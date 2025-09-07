"use client"

import { SelectableCard } from "@/components/ui/selectable-card"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"
import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"

interface Step9Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step9SalesPeriod({ data, onDataChange, errors, language }: Step9Props) {
  const periodOptions = [
    { days: 30, label: t(language, "salesPeriod.oneMonth"), desc: t(language, "salesPeriod.thirtyDays") },
    { days: 90, label: t(language, "salesPeriod.quarterly"), desc: t(language, "salesPeriod.ninetyDays") },
    { days: 180, label: t(language, "salesPeriod.halfYearly"), desc: t(language, "salesPeriod.oneEightyDays") },
    { days: 365, label: t(language, "salesPeriod.yearly"), desc: t(language, "salesPeriod.threeSixtyFiveDays") },
    { days: 0, label: t(language, "salesPeriod.custom"), desc: t(language, "salesPeriod.customDesc") },
  ]

  const calculateProjections = () => {
    const reportDays = data.reportPeriodDays || 30
    const projections = data.products.map((product: any) => {
      const dailyUnits = product.qty / (product.periodDays || 30)
      const projectedUnits = dailyUnits * reportDays

      // حساب التكاليف المتوقعة
      const variableCostPerUnit = (data.variableCosts?.[product.id] || []).reduce(
        (sum: number, cost: any) => sum + (cost.costPerUnit || 0),
        0,
      )

      const totalVariableCost = projectedUnits * variableCostPerUnit

      return {
        productId: product.id,
        productName: product.name,
        projectedUnits: Math.round(projectedUnits),
        dailyUnits: dailyUnits.toFixed(2),
        totalVariableCost,
        variableCostPerUnit,
      }
    })

    return projections
  }

  const projections = calculateProjections()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{t(language, "salesPeriod.title")}</h2>
        <p className="text-[#64748b]">{t(language, "salesPeriod.subtitle")}</p>
      </div>

      {/* اختيار الفترة */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-[#0f172a]">{t(language, "salesPeriod.reportPeriod")}</h3>
          <div className="group relative">
            <Info className="w-4 h-4 text-[#3b82f6] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[#0f172a] text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              {t(language, "salesPeriod.reportPeriodTooltip")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {periodOptions
            .filter((p) => p.days > 0)
            .map((period) => (
              <SelectableCard
                key={period.days}
                selected={data.reportPeriodDays === period.days}
                onClick={() => onDataChange({ reportPeriodDays: period.days })}
              >
                <div className="text-center">
                  <h4 className="font-semibold text-[#0f172a]">{period.label}</h4>
                  <p className="text-sm text-[#64748b] mt-1">{period.desc}</p>
                </div>
              </SelectableCard>
            ))}
        </div>

        {/* فترة مخصصة */}
        <div className="mt-4">
          <SelectableCard
            selected={!periodOptions.some((p) => p.days === data.reportPeriodDays && p.days > 0)}
            onClick={() => onDataChange({ reportPeriodDays: 0 })}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#0f172a]">{t(language, "salesPeriod.custom")}</h4>
                <p className="text-sm text-[#64748b]">{t(language, "salesPeriod.customInstructions")}</p>
              </div>
              {!periodOptions.some((p) => p.days === data.reportPeriodDays && p.days > 0) && (
                <div className="w-32">
                  <Input
                    type="number"
                    min="1"
                    max="730"
                    value={data.reportPeriodDays || ""}
                    onChange={(e) => onDataChange({ reportPeriodDays: Number.parseInt(e.target.value) || 30 })}
                    placeholder={t(language, "salesPeriod.daysPlaceholder")}
                    className={errors.reportPeriod ? "border-red-500" : ""}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          </SelectableCard>
          {errors.reportPeriod && <p className="text-red-500 text-sm mt-1">{errors.reportPeriod}</p>}
        </div>
      </div>

      {/* توقعات المبيعات */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "salesPeriod.salesProjections")}</h3>
        <p className="text-sm text-[#64748b] mb-4">
          {t(language, "salesPeriod.basedOnPeriod")}:{" "}
          <strong>
            {data.reportPeriodDays || 30} {t(language, "salesPeriod.days")}
          </strong>
        </p>

        <div className="space-y-4">
          {projections.map((projection) => (
            <div key={projection.productId} className="bg-[#f9fafb] p-4 rounded-lg">
              <h4 className="font-semibold text-[#0f172a] mb-3">{projection.productName}</h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-[#64748b]">{t(language, "salesPeriod.dailyUnits")}:</span>
                  <div className="font-medium">
                    {projection.dailyUnits} {t(language, "salesPeriod.unitsPerDay")}
                  </div>
                </div>
                <div>
                  <span className="text-[#64748b]">{t(language, "salesPeriod.projectedUnits")}:</span>
                  <div className="font-medium text-[#1e3a8a]">
                    {projection.projectedUnits.toLocaleString()} {t(language, "salesPeriod.units")}
                  </div>
                </div>
                <div>
                  <span className="text-[#64748b]">{t(language, "salesPeriod.variableCostPerUnit")}:</span>
                  <div className="font-medium">
                    {projection.variableCostPerUnit.toFixed(2)} {data.currency}
                  </div>
                </div>
                <div>
                  <span className="text-[#64748b]">{t(language, "salesPeriod.totalVariableCost")}:</span>
                  <div className="font-medium text-[#dc2626]">
                    {projection.totalVariableCost.toLocaleString()} {data.currency}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ملخص إجمالي */}
        <div className="mt-6 p-4 bg-[#f1f5f9] border border-[#3b82f6] rounded-lg">
          <h4 className="font-semibold text-[#0f172a] mb-2">{t(language, "salesPeriod.periodSummary")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-[#64748b] text-sm">{t(language, "salesPeriod.totalProjectedUnits")}:</span>
              <div className="font-bold text-lg text-[#1e3a8a]">
                {projections.reduce((sum, p) => sum + p.projectedUnits, 0).toLocaleString()}{" "}
                {t(language, "salesPeriod.units")}
              </div>
            </div>
            <div>
              <span className="text-[#64748b] text-sm">{t(language, "salesPeriod.totalVariableCosts")}:</span>
              <div className="font-bold text-lg text-[#dc2626]">
                {projections.reduce((sum, p) => sum + p.totalVariableCost, 0).toLocaleString()} {data.currency}
              </div>
            </div>
            <div>
              <span className="text-[#64748b] text-sm">{t(language, "salesPeriod.reportPeriod")}:</span>
              <div className="font-bold text-lg text-[#0f172a]">
                {data.reportPeriodDays || 30} {t(language, "salesPeriod.days")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* إرشادات */}
      <div className="bg-[#dcfce7] border border-[#16a34a] rounded-lg p-4">
        <h4 className="font-semibold text-[#15803d] mb-2">{t(language, "salesPeriod.periodSelectionTips")}</h4>
        <ul className="text-sm text-[#15803d] space-y-1">
          <li>
            • <strong>{t(language, "salesPeriod.monthly")}:</strong> {t(language, "salesPeriod.monthlyTip")}
          </li>
          <li>
            • <strong>{t(language, "salesPeriod.quarterly")}:</strong> {t(language, "salesPeriod.quarterlyTip")}
          </li>
          <li>
            • <strong>{t(language, "salesPeriod.yearly")}:</strong> {t(language, "salesPeriod.yearlyTip")}
          </li>
          <li>• {t(language, "salesPeriod.generalTip")}</li>
        </ul>
      </div>
    </div>
  )
}
