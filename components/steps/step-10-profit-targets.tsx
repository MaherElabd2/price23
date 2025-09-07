"use client"

import { SelectableCard } from "@/components/ui/selectable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"

interface Step10Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step10ProfitTargets({ data, onDataChange, errors, language }: Step10Props) {
  const targetTypes = [
    {
      id: "basic",
      name: t(language, "profitTargets.basicTarget"),
      desc: t(language, "profitTargets.basicTargetDesc"),
    },
    {
      id: "advanced",
      name: t(language, "profitTargets.advancedTargets"),
      desc: t(language, "profitTargets.advancedTargetsDesc"),
    },
  ]

  const getSectorMarginGuidance = () => {
    const sectorBenchmarks = {
      ecommerce: { minMargin: 15, maxMargin: 35, avgMargin: 25 },
      restaurants: { minMargin: 8, maxMargin: 20, avgMargin: 12 },
      clothing: { minMargin: 40, maxMargin: 70, avgMargin: 55 },
      services: { minMargin: 20, maxMargin: 60, avgMargin: 40 },
      industries: { minMargin: 10, maxMargin: 30, avgMargin: 18 },
      tech: { minMargin: 25, maxMargin: 80, avgMargin: 50 },
    }
    return (
      sectorBenchmarks[data.sector as keyof typeof sectorBenchmarks] || { minMargin: 15, maxMargin: 40, avgMargin: 25 }
    )
  }

  const marginGuidance = getSectorMarginGuidance()

  const updateBasicTarget = (field: string, value: number) => {
    onDataChange({
      targets: {
        ...data.targets,
        basic: {
          ...data.targets.basic,
          [field]: value,
        },
      },
    })
  }

  const updateProductTarget = (productId: string, field: string, value: number) => {
    const currentTargets = { ...data.targets.perProduct }
    if (!currentTargets[productId]) {
      currentTargets[productId] = { margin: 0, roi: 0 }
    }
    currentTargets[productId][field] = value

    onDataChange({
      targets: {
        ...data.targets,
        perProduct: currentTargets,
      },
    })
  }

  const calculateBreakeven = () => {
    const reportDays = data.reportPeriodDays || 30
    const monthlyFixedCosts = (data.fixedCosts || []).reduce(
      (sum: number, cost: any) => sum + (cost.monthlyAmount || 0),
      0,
    )
    const monthlyDepreciation =
      data.depreciation?.assetValue && data.depreciation?.usefulLife
        ? data.depreciation.assetValue / data.depreciation.usefulLife / 12
        : 0
    const monthlyRD = data.rdBudget || 0
    const totalMonthlyFixed = monthlyFixedCosts + monthlyDepreciation + monthlyRD
    const periodFixedCosts = (totalMonthlyFixed * reportDays) / 30

    return data.products.map((product: any) => {
      const variableCostPerUnit = (data.variableCosts?.[product.id] || []).reduce(
        (sum: number, cost: any) => sum + (cost.costPerUnit || 0),
        0,
      )

      const fixedCostPerUnit = product.fixedCostPerUnit || 0
      const totalCostPerUnit = variableCostPerUnit + fixedCostPerUnit

      return {
        productId: product.id,
        productName: product.name,
        variableCostPerUnit,
        fixedCostPerUnit,
        totalCostPerUnit,
        breakevenPrice: totalCostPerUnit,
      }
    })
  }

  const breakevenData = calculateBreakeven()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{t(language, "profitTargets.title")}</h2>
        <p className="text-[#64748b]">{t(language, "profitTargets.subtitle")}</p>
        {language === "ar" && (
          <div className="text-sm text-[#64748b] mt-4 bg-[#f8fafc] p-4 rounded-lg border-r-4 border-[#3b82f6] text-right">
            🎯 <strong>أهداف الربح:</strong> عايز تكسب كام في المية من كل منتج؟
            <br />
            <strong>مثال:</strong> لو المنتج بيكلفك 100 جنيه وعايز ربح 25%， يبقى هتبيعه بـ 125 جنيه
          </div>
        )}
      </div>

      {/* نوع الأهداف */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "profitTargets.targetTypes")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {targetTypes.map((type) => (
            <SelectableCard
              key={type.id}
              selected={data.targets.type === type.id}
              onClick={() =>
                onDataChange({
                  targets: {
                    ...data.targets,
                    type: type.id as any,
                  },
                })
              }
            >
              <div>
                <h4 className="font-semibold text-[#0f172a]">{type.name}</h4>
                <p className="text-sm text-[#64748b] mt-1">{type.desc}</p>
              </div>
            </SelectableCard>
          ))}
        </div>
      </div>

      {/* الهدف الأساسي */}
      {data.targets.type === "basic" && (
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "profitTargets.basicTarget")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>{t(language, "profitTargets.targetMargin")}</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={data.targets.basic.margin || 0}
                onChange={(e) => updateBasicTarget("margin", Number.parseFloat(e.target.value) || 0)}
                className={errors.margin ? "border-red-500" : ""}
                placeholder="25.0"
              />
              <p className="text-xs text-[#64748b] mt-1">
                {t(language, "profitTargets.sectorGuidance")}: {marginGuidance.minMargin}–{marginGuidance.maxMargin}% (
                {t(language, "profitTargets.average")}: {marginGuidance.avgMargin}%)
              </p>
              {errors.margin && <p className="text-red-500 text-sm mt-1">{errors.margin}</p>}
            </div>

            <div>
              <Label>{t(language, "profitTargets.targetROI")}</Label>
              <Input
                type="number"
                min="0"
                max="200"
                step="0.1"
                value={data.targets.basic.roi || 0}
                onChange={(e) => updateBasicTarget("roi", Number.parseFloat(e.target.value) || 0)}
                placeholder="15.0"
              />
              <p className="text-xs text-[#64748b] mt-1">{t(language, "profitTargets.roiDescription")}</p>
            </div>
          </div>
        </div>
      )}

      {/* الأهداف المتقدمة */}
      {data.targets.type === "advanced" && (
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
            {t(language, "profitTargets.perProductTargets")}
          </h3>

          <div className="space-y-6">
            {data.products.map((product: any) => (
              <div key={product.id} className="bg-[#f9fafb] p-4 rounded-lg">
                <h4 className="font-semibold text-[#0f172a] mb-3">{product.name}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t(language, "profitTargets.profitMargin")}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={data.targets.perProduct?.[product.id]?.margin || 0}
                      onChange={(e) =>
                        updateProductTarget(product.id, "margin", Number.parseFloat(e.target.value) || 0)
                      }
                      placeholder="25.0"
                    />
                  </div>
                  <div>
                    <Label>{t(language, "profitTargets.roi")}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="200"
                      step="0.1"
                      value={data.targets.perProduct?.[product.id]?.roi || 0}
                      onChange={(e) => updateProductTarget(product.id, "roi", Number.parseFloat(e.target.value) || 0)}
                      placeholder="15.0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* تحليل نقطة التعادل */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "profitTargets.breakevenAnalysis")}</h3>

        {/* تعريف نقطة التعادل */}
        <div className="bg-[#f1f5f9] border border-[#3b82f6] rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-[#0f172a] mb-2">{t(language, "profitTargets.whatIsBreakeven")}</h4>
          <p className="text-sm text-[#64748b] mb-2">{t(language, "profitTargets.breakevenDefinition")}</p>
          {language === "ar" && (
            <div className="text-sm text-[#64748b] mb-2 bg-[#fff9e6] p-3 rounded border-r-4 border-[#f59e0b]">
              ⚖️ <strong>نقطة التعادل بالبلدي:</strong> النقطة اللي فيها مبيعاتك تغطي مصاريفك من غير مكسب أو خسارة
              <br />
              <strong>يعني:</strong> لو بعت بالسعر ده، مش هتكسب ولا هتخسر، هتطلع بالظبط زي ما دخلت
            </div>
          )}
          <div className="text-xs text-[#64748b] bg-white p-2 rounded border">
            <strong>{t(language, "profitTargets.formula")}:</strong> {t(language, "profitTargets.breakevenFormula")}
          </div>
        </div>

        <div className="space-y-4">
          {breakevenData.map((item) => (
            <div key={item.productId} className="bg-[#f9fafb] p-4 rounded-lg">
              <h4 className="font-semibold text-[#0f172a] mb-3">{item.productName}</h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-[#64748b]">{t(language, "profitTargets.variableCostPerUnit")}:</span>
                  <div className="font-medium">
                    {item.variableCostPerUnit.toFixed(2)} {data.currency}
                  </div>
                  <p className="text-xs text-[#64748b]">{t(language, "profitTargets.variableCostDesc")}</p>
                </div>
                <div>
                  <span className="text-[#64748b]">{t(language, "profitTargets.fixedCostPerUnit")}:</span>
                  <div className="font-medium">
                    {item.fixedCostPerUnit > 0 ? item.fixedCostPerUnit.toFixed(2) : "0.00"} {data.currency}
                  </div>
                  <p className="text-xs text-[#64748b]">{t(language, "profitTargets.fixedCostDesc")}</p>
                </div>
                <div>
                  <span className="text-[#64748b]">{t(language, "profitTargets.totalCostPerUnit")}:</span>
                  <div className="font-medium">
                    {item.totalCostPerUnit.toFixed(2)} {data.currency}
                  </div>
                  <p className="text-xs text-[#64748b]">{t(language, "profitTargets.totalCostDesc")}</p>
                </div>
                <div>
                  <span className="text-[#64748b]">{t(language, "profitTargets.breakevenPrice")}:</span>
                  <div className="font-medium text-[#dc2626]">
                    {item.breakevenPrice.toFixed(2)} {data.currency}
                  </div>
                  <p className="text-xs text-[#64748b]">{t(language, "profitTargets.breakevenPriceDesc")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إرشادات الهوامش */}
      <div className="bg-[#f1f5f9] border border-[#3b82f6] rounded-lg p-4">
        <h4 className="font-semibold text-[#0f172a] mb-2">{t(language, "profitTargets.marginGuidance")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[#64748b]">{t(language, "profitTargets.minimum")}:</span>
            <div className="font-bold text-[#dc2626]">{marginGuidance.minMargin}%</div>
          </div>
          <div>
            <span className="text-[#64748b]">{t(language, "profitTargets.average")}:</span>
            <div className="font-bold text-[#1e3a8a]">{marginGuidance.avgMargin}%</div>
          </div>
          <div>
            <span className="text-[#64748b]">{t(language, "profitTargets.maximum")}:</span>
            <div className="font-bold text-[#16a34a]">{marginGuidance.maxMargin}%</div>
          </div>
        </div>
        <p className="text-xs text-[#64748b] mt-2">{t(language, "profitTargets.marginDisclaimer")}</p>
      </div>
    </div>
  )
}
