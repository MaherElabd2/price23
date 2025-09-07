"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chip } from "@/components/ui/chip"
import { SelectableCard } from "@/components/ui/selectable-card"
import { QuestionExplanation } from "@/components/ui/question-explanation"
import { Trash2, Plus, Info } from "lucide-react"
import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"

interface Step7Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step7FixedCosts({ data, onDataChange, errors, language }: Step7Props) {
  const [depreciationMode, setDepreciationMode] = useState(data.depreciation?.mode || "none")

  useEffect(() => {
    if (depreciationMode === "simple" && (!data.depreciation?.usefulLife || data.depreciation.usefulLife <= 0)) {
      onDataChange({
        depreciation: {
          ...data.depreciation,
          mode: "simple",
          usefulLife: getSectorGuidance().depreciationYears,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depreciationMode])

  const addFixedCost = () => {
    const currentCosts = data.fixedCosts || []
    const newCosts = [...currentCosts, { item: "", monthlyAmount: 0, category: "operational" }]
    onDataChange({ fixedCosts: newCosts })
  }

  const updateFixedCost = (index: number, field: string, value: any) => {
    const currentCosts = [...(data.fixedCosts || [])]
    currentCosts[index] = { ...currentCosts[index], [field]: value }
    onDataChange({ fixedCosts: currentCosts })
  }

  const removeFixedCost = (index: number) => {
    const currentCosts = [...(data.fixedCosts || [])]
    currentCosts.splice(index, 1)
    onDataChange({ fixedCosts: currentCosts })
  }

  const depreciationMethods = [
    { id: "straight", name: t(language, "fixedCosts.straightLine"), desc: t(language, "fixedCosts.straightLineDesc") },
    {
      id: "declining",
      name: t(language, "fixedCosts.decliningBalance"),
      desc: t(language, "fixedCosts.decliningBalanceDesc"),
    },
  ]

  const costCategories = [
    { id: "operational", name: t(language, "fixedCosts.operational") },
    { id: "administrative", name: t(language, "fixedCosts.administrative") },
    { id: "marketing", name: t(language, "fixedCosts.marketing") },
    { id: "other", name: t(language, "fixedCosts.other") },
  ]

  const getSectorGuidance = () => {
    const sectorBenchmarks = {
      ecommerce: { rdMin: 2, rdMax: 8, depreciationYears: 3 },
      restaurants: { rdMin: 0, rdMax: 2, depreciationYears: 5 },
      clothing: { rdMin: 1, rdMax: 5, depreciationYears: 3 },
      services: { rdMin: 5, rdMax: 15, depreciationYears: 2 },
      industries: { rdMin: 3, rdMax: 12, depreciationYears: 7 },
      tech: { rdMin: 10, rdMax: 25, depreciationYears: 2 },
    }
    return (
      sectorBenchmarks[data.sector as keyof typeof sectorBenchmarks] || { rdMin: 2, rdMax: 10, depreciationYears: 5 }
    )
  }

  const guidance = getSectorGuidance()

  const setModeNone = () => {
    setDepreciationMode("none")
    onDataChange({
      depreciation: { mode: "none", assetValue: 0, usefulLife: undefined, method: undefined },
    })
  }

  const setModeSimple = () => {
    setDepreciationMode("simple")
    onDataChange({
      depreciation: {
        mode: "simple",
        assetValue: data.depreciation?.assetValue ?? 0,
        usefulLife: data.depreciation?.usefulLife ?? getSectorGuidance().depreciationYears,
        method: data.depreciation?.method ?? "straight",
      },
    })
  }

  const calculateMonthlyDepreciation = () => {
    if (
      data.depreciation?.mode !== "simple" ||
      !data.depreciation?.assetValue ||
      data.depreciation.assetValue <= 0 ||
      !data.depreciation?.usefulLife ||
      data.depreciation.usefulLife <= 0
    ) {
      return 0
    }

    const { assetValue, usefulLife, method } = data.depreciation

    if (method === "declining") {
      // طريقة الرصيد المتناقص - معدل الإهلاك المضاعف
      const straightLineRate = 1 / usefulLife
      const decliningRate = straightLineRate * 2 // معدل مضاعف

      // حساب الإهلاك للسنة الأولى (أعلى قيمة)
      const firstYearDepreciation = assetValue * decliningRate

      // الإهلاك الشهري للسنة الأولى
      return firstYearDepreciation / 12
    } else {
      // طريقة القسط الثابت (الافتراضية)
      return assetValue / usefulLife / 12
    }
  }

  const monthlyDep = calculateMonthlyDepreciation()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{t(language, "fixedCosts.title")}</h2>
        {language === "ar" && (
          <p className="text-[13px] text-[#666] mt-3">
            دي المصاريف اللي بتدفعها كل شهر سواء بعت حاجة أو لأ، زي الإيجار والمرتبات.
          </p>
        )}
        <p className="text-[#64748b] mt-2">{t(language, "fixedCosts.subtitle")}</p>
        {language === "ar" && (
          <QuestionExplanation
            question="ما هي التكاليف الثابتة؟"
            explanation="دي المصاريف اللي بتدفعها كل شهر سواء بعت حاجة أو لأ، زي الإيجار والمرتبات."
            exampleKey="fixedCosts"
            sector={data.sector || "general"}
            className="mt-4"
          />
        )}
      </div>

      {/* Fixed Costs */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "fixedCosts.monthlyFixedCosts")}</h3>

        {errors.fixedCosts && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{errors.fixedCosts}</p>
          </div>
        )}

        <div className="space-y-4">
          {(data.fixedCosts || []).map((cost: any, index: number) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>{t(language, "fixedCosts.itemName")}</Label>
                {language === "ar" && (
                  <p className="text-[13px] text-[#666] mt-3">المصاريف اللي بتدفعها كل شهر بانتظام</p>
                )}
                <Input
                  value={cost.item}
                  onChange={(e) => updateFixedCost(index, "item", e.target.value)}
                  placeholder={t(language, "fixedCosts.itemNamePlaceholder")}
                  className={errors[`fixed_cost_${index}_item`] ? "border-red-500" : ""}
                />
                {errors[`fixed_cost_${index}_item`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`fixed_cost_${index}_item`]}</p>
                )}
              </div>
              <div className="flex-1">
                <Label>
                  {t(language, "fixedCosts.monthlyAmount")} ({data.currency})
                </Label>
                {language === "ar" && <p className="text-[13px] text-[#666] mt-3">المبلغ اللي بتدفعه كل شهر</p>}
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost.monthlyAmount}
                  onChange={(e) => updateFixedCost(index, "monthlyAmount", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={errors[`fixed_cost_${index}_amount`] ? "border-red-500" : ""}
                />
                {errors[`fixed_cost_${index}_amount`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`fixed_cost_${index}_amount`]}</p>
                )}
              </div>
              <div className="w-32">
                <Label>{t(language, "fixedCosts.category")}</Label>
                <select
                  value={cost.category}
                  onChange={(e) => updateFixedCost(index, "category", e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                >
                  {costCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFixedCost(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addFixedCost} className="w-full bg-transparent">
            <Plus className="w-4 h-4 ml-2" />
            {t(language, "fixedCosts.addFixedCost")}
          </Button>

          <div className="bg-[#f9fafb] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t(language, "fixedCosts.totalMonthlyFixed")}:</span>
              <span className="font-bold text-[#1e3a8a]">
                {(data.fixedCosts || [])
                  .reduce((sum: number, cost: any) => sum + (cost.monthlyAmount || 0), 0)
                  .toLocaleString()}{" "}
                {data.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Depreciation */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-[#0f172a]">{t(language, "fixedCosts.depreciation")}</h3>
          <div className="group relative">
            <Info className="w-4 h-4 text-[#3b82f6] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[#0f172a] text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              {t(language, "fixedCosts.depreciationTooltip")}
            </div>
          </div>
        </div>

        {language === "ar" && (
          <p className="text-[13px] text-[#666] mt-3 mb-4">
            قيمة الأجهزة والمعدات اللي بتقل مع الوقت، زي الماكينات والكمبيوتر والعربيات.
          </p>
        )}

        <div className="space-y-4">
          <div>
            <Label>{t(language, "fixedCosts.addDepreciation")}</Label>
            <div className="flex gap-2 mt-2">
              <Chip selected={depreciationMode === "none"} onClick={setModeNone}>
                {t(language, "fixedCosts.noDepreciation")}
              </Chip>
              <Chip selected={depreciationMode === "simple"} onClick={setModeSimple}>
                {t(language, "fixedCosts.simpleDepreciation")}
              </Chip>
            </div>
          </div>

          {depreciationMode === "simple" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    {t(language, "fixedCosts.assetValue")} ({data.currency})
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.depreciation?.assetValue || 0}
                    onChange={(e) =>
                      onDataChange({
                        depreciation: {
                          ...data.depreciation,
                          mode: "simple",
                          assetValue: Number.parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="100000"
                  />
                </div>
                <div>
                  <Label>{t(language, "fixedCosts.usefulLife")}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={data.depreciation?.usefulLife || guidance.depreciationYears}
                    onChange={(e) =>
                      onDataChange({
                        depreciation: {
                          ...data.depreciation,
                          mode: "simple",
                          usefulLife: Number.parseInt(e.target.value) || guidance.depreciationYears,
                        },
                      })
                    }
                    placeholder={guidance.depreciationYears.toString()}
                  />
                  <p className="text-xs text-[#64748b] mt-1">
                    {t(language, "fixedCosts.sectorGuidance")}: {guidance.depreciationYears}{" "}
                    {t(language, "fixedCosts.years")}
                  </p>
                </div>
              </div>

              <div>
                <Label>{t(language, "fixedCosts.depreciationMethod")}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {depreciationMethods.map((method) => (
                    <SelectableCard
                      key={method.id}
                      selected={data.depreciation?.method === method.id}
                      onClick={() =>
                        onDataChange({
                                                      depreciation: {
                              ...data.depreciation,
                              method: method.id as "straight" | "declining",
                              mode: "simple",
                            },
                        })
                      }
                    >
                      <div>
                        <h4 className="font-semibold text-[#0f172a]">{method.name}</h4>
                        <p className="text-sm text-[#64748b] mt-1">{method.desc}</p>
                      </div>
                    </SelectableCard>
                  ))}
                </div>
              </div>

              {monthlyDep > 0 && (
                <div className="bg-[#f9fafb] p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t(language, "fixedCosts.monthlyDepreciation")}:</span>
                    <span className="font-bold text-[#1e3a8a]">
                      {monthlyDep.toLocaleString()} {data.currency}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#f1f5f9] border border-[#3b82f6] rounded-lg p-6">
        <h4 className="font-semibold text-[#0f172a] mb-4">{t(language, "fixedCosts.monthlySummary")}</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t(language, "fixedCosts.operationalCosts")}:</span>
            <span>
              {(data.fixedCosts || [])
                .filter((cost: any) => cost.category === "operational")
                .reduce((sum: number, cost: any) => sum + (cost.monthlyAmount || 0), 0)
                .toLocaleString()}{" "}
              {data.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t(language, "fixedCosts.depreciation")}:</span>
            <span>
              {monthlyDep.toLocaleString()} {data.currency}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>{t(language, "fixedCosts.total")}:</span>
            <span className="text-[#1e3a8a]">
              {(
                (data.fixedCosts || []).reduce((sum: number, cost: any) => sum + (cost.monthlyAmount || 0), 0) +
                monthlyDep
              ).toLocaleString()}{" "}
              {data.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
