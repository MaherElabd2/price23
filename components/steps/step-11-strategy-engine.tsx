"use client"

import { SelectableCard } from "@/components/ui/selectable-card"
import { TrendingUp, Target, Zap, Shield, AlertTriangle } from "lucide-react"
import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"
import { calcProfitMarginOnCost } from "@/lib/calculations"
import React, { useState } from "react"

interface Step11Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step11StrategyEngine({ data, onDataChange, errors, language }: Step11Props) {
  const [clampToCompetitorRange, setClampToCompetitorRange] = useState(false)

  const strategies = [
    {
      id: "competitive",
      name: t(language, "strategyEngine.competitive"),
      desc: t(language, "strategyEngine.competitiveDesc"),
      icon: Target,
      suitable: [
        t(language, "strategyEngine.highCompetition"),
        t(language, "strategyEngine.similarProducts"),
        t(language, "strategyEngine.highPriceSensitivity"),
      ],
      formula: t(language, "strategyEngine.competitiveFormula"),
    },
    {
      id: "penetration",
      name: t(language, "strategyEngine.penetration"),
      desc: t(language, "strategyEngine.penetrationDesc"),
      icon: Zap,
      suitable: [
        t(language, "strategyEngine.newMarketEntry"),
        t(language, "strategyEngine.newProduct"),
        t(language, "strategyEngine.rapidGrowthGoal"),
      ],
      formula: t(language, "strategyEngine.penetrationFormula"),
    },
    {
      id: "skimming",
      name: t(language, "strategyEngine.skimming"),
      desc: t(language, "strategyEngine.skimmingDesc"),
      icon: TrendingUp,
      suitable: [
        t(language, "strategyEngine.innovativeProduct"),
        t(language, "strategyEngine.fewCompetitors"),
        t(language, "strategyEngine.lowPriceSensitivity"),
      ],
      formula: t(language, "strategyEngine.skimmingFormula"),
    },
    {
      id: "value",
      name: t(language, "strategyEngine.value"),
      desc: t(language, "strategyEngine.valueDesc"),
      icon: Shield,
      suitable: [
        t(language, "strategyEngine.uniqueProduct"),
        t(language, "strategyEngine.strongBrand"),
        t(language, "strategyEngine.highAddedValue"),
      ],
      formula: t(language, "strategyEngine.valueFormula"),
    },
    {
      id: "custom",
      name: t(language, "strategyEngine.custom"),
      desc: t(language, "strategyEngine.customDesc"),
      icon: null,
      suitable: [t(language, "strategyEngine.customGoals")],
      formula: t(language, "strategyEngine.customFormula"),
    },
  ]

  const getCompetitorPositioning = (product: any, suggestedPrice: number) => {
    if (!product.competitors?.hasData || !product.competitors.min || !product.competitors.max) {
      return null
    }

    const { min, max } = product.competitors
    let positioning = ""
    let warning = ""
    let badgeColor = ""

    if (suggestedPrice < min) {
      positioning = language === "ar" ? "أقل من السوق" : "Below market"
      warning =
        language === "ar"
          ? "أقل من السوق (الحد الأدنى). تأكد من أن هذا تسعير اختراق مقصود."
          : "Below market (min). Consider whether this is intentional penetration pricing."
      badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-300"
    } else if (suggestedPrice > max) {
      positioning = language === "ar" ? "أعلى من السوق" : "Above market"
      warning =
        language === "ar"
          ? "أعلى من السوق (الحد الأقصى). تأكد من قوة مبرر القيمة."
          : "Above market (max). Ensure your value justification is strong."
      badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-300"
    } else {
      positioning = language === "ar" ? "داخل السوق" : "Inside market"
      badgeColor = "bg-green-100 text-green-800 border-green-300"
    }

    return { positioning, warning, badgeColor, min, max }
  }

  const getRecommendedStrategy = () => {
    const factors = {
      competition: data.competition?.hasDirectCompetitors,
      competitorCount: data.competition?.competitorCount,
      valueVsMarket: data.competition?.valueVsMarket,
      brandStrength: data.customerType?.brandStrength,
      priceSensitivity: data.customerType?.priceSensitivity,
      differentiation: data.productNature?.differentiation,
      customerType: data.customerType?.type,
      targetMargin: data.targets?.basic?.margin,
    }

    // Strategic decision tree based on market conditions - prioritize market strategies first

    // High competition scenarios
    if (factors.competition && factors.competitorCount === "many") {
      if (factors.priceSensitivity === "high") {
        return "penetration" // High competition + price sensitive = penetration
      }
      if (factors.differentiation === "premium" || factors.brandStrength === "strong") {
        return "value" // High competition but strong differentiation = value-based
      }
      return "competitive" // Default for high competition
    }

    // Low competition scenarios
    if (!factors.competition || factors.competitorCount === "few") {
      if (factors.differentiation === "exclusive" || factors.brandStrength === "strong") {
        return "skimming" // Low competition + premium product = skimming
      }
      if (factors.customerType === "b2c" && factors.priceSensitivity === "low") {
        return "skimming" // B2C with low price sensitivity = skimming opportunity
      }
    }

    // Value-based scenarios
    if (factors.valueVsMarket === "higher" && factors.differentiation === "premium") {
      return "value" // Superior value proposition = value-based pricing
    }

    // Only recommend custom for very specific scenarios
    if (data.userLevel === "advanced" && data.targets?.advanced) {
      const hasCustomTargets = Object.values(data.targets.advanced).some(
        (target: any) => target?.mode === "targetPrice" || target?.mode === "profit",
      )
      if (hasCustomTargets) {
        return "custom" // Only when user has set specific custom targets
      }
    }

    // Default to competitive strategy for most scenarios
    return "competitive"
  }

  const calculatePrices = (strategyId: string) => {
    return data.products.map((product: any) => {
      // Variable costs calculation
      const variableCost = (data.variableCosts?.[product.id] || []).reduce(
        (sum: number, cost: any) => sum + (cost.costPerUnit || 0),
        0,
      )

      const fixedCostPerUnit = product.fixedCostPerUnit || 0
      const totalCostPerUnit = variableCost + fixedCostPerUnit

      // Competitor average with fallback logic
      const competitorAvg = data.competition?.priceRange?.avg || totalCostPerUnit * 1.4

      let suggestedPrice = 0
      let targetMargin = 0

      switch (strategyId) {
        case "competitive":
          suggestedPrice = competitorAvg
          const netProfit = suggestedPrice - totalCostPerUnit
          targetMargin = calcProfitMarginOnCost(netProfit, totalCostPerUnit)
          break
        case "penetration":
          targetMargin = 8 // Lower margin for market penetration
          suggestedPrice = totalCostPerUnit / (1 - targetMargin / 100)
          break
        case "skimming":
          targetMargin = 45 // High margin for premium positioning
          suggestedPrice = totalCostPerUnit / (1 - targetMargin / 100)
          break
        case "value":
          // Value-based pricing with premium over competition
          const valuePremium = data.competition?.valueVsMarket === "higher" ? 1.25 : 1.15
          suggestedPrice = competitorAvg * valuePremium
          const valueNetProfit = suggestedPrice - totalCostPerUnit
          targetMargin = calcProfitMarginOnCost(valueNetProfit, totalCostPerUnit)
          break
        case "custom":
          if (data.userLevel === "basic") {
            targetMargin = data.targets?.basic?.margin || 25
            // Apply margin after total costs (cost-plus pricing)
            suggestedPrice = totalCostPerUnit * (1 + targetMargin / 100)
          } else {
            // Advanced mode - check per-product targets
            const productTarget = data.targets?.advanced?.[product.id]
            if (productTarget?.mode === "margin") {
              targetMargin = productTarget.value
              // Apply margin after total costs (cost-plus pricing)
              suggestedPrice = totalCostPerUnit * (1 + targetMargin / 100)
            } else if (productTarget?.mode === "targetPrice") {
              suggestedPrice = productTarget.value
              const customNetProfit = suggestedPrice - totalCostPerUnit
              targetMargin = calcProfitMarginOnCost(customNetProfit, totalCostPerUnit)
            } else if (productTarget?.mode === "profit") {
              const targetProfit = productTarget.value
              suggestedPrice = totalCostPerUnit + targetProfit
              targetMargin = calcProfitMarginOnCost(targetProfit, totalCostPerUnit)
            } else {
              targetMargin = data.targets?.basic?.margin || 25
              suggestedPrice = totalCostPerUnit * (1 + targetMargin / 100)
            }
          }
          break
        default:
          targetMargin = 20
          suggestedPrice = totalCostPerUnit / (1 - targetMargin / 100)
      }

      // Ensure minimum viable pricing
      const minimumPrice = totalCostPerUnit * 1.05 // 5% minimum margin
      suggestedPrice = Math.max(suggestedPrice, minimumPrice)

      if (
        clampToCompetitorRange &&
        product.competitors?.hasData &&
        product.competitors.min &&
        product.competitors.max
      ) {
        suggestedPrice = Math.max(product.competitors.min, Math.min(suggestedPrice, product.competitors.max))
      }

      const finalNetProfit = suggestedPrice - totalCostPerUnit
      const actualMargin = calcProfitMarginOnCost(finalNetProfit, totalCostPerUnit)

      // Strategy Engine Margin Debug - removed for production

      return {
        productId: product.id,
        productName: product.name,
        totalCostPerUnit,
        variableCost,
        fixedCostPerUnit,
        suggestedPrice: Math.round(suggestedPrice * 100) / 100,
        targetMargin,
        actualMargin,
        contributionMargin: suggestedPrice - variableCost,
        competitorAvg,
      }
    })
  }

  const recommendedStrategy = getRecommendedStrategy()
  const selectedStrategy = data.strategies?.primary || recommendedStrategy
  const priceCalculations = calculatePrices(selectedStrategy)

  React.useEffect(() => {
    if (selectedStrategy && priceCalculations.length > 0) {
      const finalPrices = priceCalculations.reduce((acc: any, calc) => {
        acc[calc.productId] = {
          price: calc.suggestedPrice,
          margin: calc.actualMargin,
          strategy: selectedStrategy,
          totalCostPerUnit: calc.totalCostPerUnit,
          variableCost: calc.variableCost,
          fixedCostPerUnit: calc.fixedCostPerUnit,
          contributionMargin: calc.contributionMargin,
        }
        return acc
      }, {})

      onDataChange({
        strategies: {
          ...data.strategies,
          primary: selectedStrategy,
          finalPrices,
          appliedAt: new Date().toISOString(),
        },
      })
    }
  }, [selectedStrategy, clampToCompetitorRange])

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#0f172a] mb-2">{t(language, "strategyEngine.title")}</h2>
        <p className="text-lg text-[#64748b]">{t(language, "strategyEngine.subtitle")}</p>
      </div>

      {/* Smart Recommendation */}
      <div className="bg-[#dcfce7] border border-[#16a34a] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-[#15803d]">{t(language, "strategyEngine.smartRecommendation")}</h3>
        </div>
        <p className="text-[#15803d] mb-2">
          {t(language, "strategyEngine.recommendationText")}{" "}
          <strong>{strategies.find((s) => s.id === recommendedStrategy)?.name}</strong>
        </p>
        <p className="text-sm text-[#15803d]">{strategies.find((s) => s.id === recommendedStrategy)?.desc}</p>
      </div>

      {/* Strategy Selection */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#0f172a] mb-4">{t(language, "strategyEngine.chooseStrategy")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => {
            const Icon = strategy.icon
            const isRecommended = strategy.id === recommendedStrategy

            return (
              <SelectableCard
                key={strategy.id}
                selected={selectedStrategy === strategy.id}
                onClick={() =>
                  onDataChange({
                    strategies: {
                      ...data.strategies,
                      primary: strategy.id as any,
                    },
                  })
                }
                className={isRecommended ? "border-[#16a34a] bg-[#f0fdf4]" : ""}
              >
                <div className="relative">
                  {isRecommended && (
                    <div className="absolute -top-2 -right-2 bg-[#16a34a] text-white text-xs px-2 py-1 rounded-full">
                      {t(language, "strategyEngine.recommended")}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    {Icon && <Icon className="w-6 h-6 text-[#3b82f6]" />}
                    <h4 className="font-semibold text-[#0f172a]">{strategy.name}</h4>
                  </div>
                  <p className="text-sm text-[#64748b] mb-3">{strategy.desc}</p>
                  <div className="text-xs text-[#64748b]">
                    <strong>{t(language, "strategyEngine.suitableFor")}:</strong>
                    <ul className="mt-1 space-y-1">
                      {strategy.suitable.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SelectableCard>
            )
          })}
        </div>
      </div>

      {data.products.some((p) => p.competitors?.hasData) && (
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
            {language === "ar" ? "خيارات متقدمة" : "Advanced Options"}
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="clampToRange"
              checked={clampToCompetitorRange}
              onChange={(e) => setClampToCompetitorRange(e.target.checked)}
              className="w-4 h-4 text-[#3b82f6] border-[#d1d5db] rounded focus:ring-[#3b82f6]"
            />
            <label htmlFor="clampToRange" className="text-sm font-medium text-[#0f172a]">
              {language === "ar"
                ? "تقييد السعر المقترح داخل نطاق المنافسين تلقائياً"
                : "Clamp recommended price inside competitor range automatically"}
            </label>
          </div>
          <p className="text-xs text-[#64748b] mt-2 ml-7">
            {language === "ar"
              ? "عند التفعيل، سيتم تقييد الأسعار المقترحة داخل نطاق المنافسين. عند عدم التفعيل، ستظهر التحذيرات فقط."
              : "When ON, clamp to [min, max]. When OFF, only warn (do not overwrite)."}
          </p>
        </div>
      )}

      {/* Price Preview */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#0f172a] mb-4">{t(language, "strategyEngine.pricePreview")}</h3>
        <p className="text-base text-[#64748b] mb-4">
          {t(language, "strategyEngine.calculatedUsing")}{" "}
          <strong>{strategies.find((s) => s.id === selectedStrategy)?.name}</strong>
        </p>

        <div className="space-y-4">
          {priceCalculations.map((calc) => {
            const product = data.products.find((p) => p.id === calc.productId)
            const competitorInfo = getCompetitorPositioning(product, calc.suggestedPrice)

            return (
              <div key={calc.productId} className="bg-[#f9fafb] p-5 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-[#0f172a]">{calc.productName}</h4>
                  {competitorInfo && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${competitorInfo.badgeColor}`}>
                      {competitorInfo.positioning}
                    </span>
                  )}
                </div>

                {competitorInfo?.warning && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{competitorInfo.warning}</p>
                  </div>
                )}

                {competitorInfo && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{language === "ar" ? "نطاق المنافسين:" : "Competitor range:"}</strong>{" "}
                      {competitorInfo.min.toFixed(2)} - {competitorInfo.max.toFixed(2)}{" "}
                      {product?.competitors?.currency || data.currency}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-base">
                  <div>
                    <span className="text-[#64748b] text-sm block mb-1">
                      {t(language, "strategyEngine.variableCost")}:
                    </span>
                    <div className="font-semibold text-[#dc2626] text-lg">
                      {calc.variableCost.toFixed(2)} {data.currency}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-sm block mb-1">
                      {t(language, "strategyEngine.fixedCostPerUnit")}:
                    </span>
                    <div className="font-semibold text-[#dc2626] text-lg">
                      {calc.fixedCostPerUnit.toFixed(2)} {data.currency}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-sm block mb-1">
                      {t(language, "strategyEngine.totalCost")}:
                    </span>
                    <div className="font-semibold text-[#dc2626] text-lg">
                      {calc.totalCostPerUnit.toFixed(2)} {data.currency}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-sm block mb-1">
                      {t(language, "strategyEngine.competitorAverage")}:
                    </span>
                    <div className="font-semibold text-lg">
                      {(calc.competitorAvg || 0).toFixed(2)} {data.currency}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-sm block mb-1">
                      {t(language, "strategyEngine.suggestedPrice")}:
                    </span>
                    <div className="font-bold text-[#1e3a8a] text-xl">
                      {calc.suggestedPrice.toFixed(2)} {data.currency}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-sm block mb-1">
                      {t(language, "strategyEngine.profitMargin")}:
                    </span>
                    <div
                      className={`font-bold text-xl ${calc.actualMargin >= 20 ? "text-[#16a34a]" : calc.actualMargin >= 10 ? "text-[#f59e0b]" : "text-[#dc2626]"}`}
                    >
                      {calc.actualMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                    <div>
                      <span className="text-[#64748b] text-sm block mb-1">
                        {t(language, "strategyEngine.contributionMargin")}:
                      </span>
                      <div className="font-semibold text-[#16a34a] text-lg">
                        {calc.contributionMargin.toFixed(2)} {data.currency}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#64748b] text-sm block mb-1">
                        {t(language, "strategyEngine.contributionRatio")}:
                      </span>
                      <div className="font-semibold text-lg">
                        {((calc.contributionMargin / calc.suggestedPrice) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Strategy Details */}
      {selectedStrategy && (
        <div className="bg-[#f1f5f9] border border-[#3b82f6] rounded-lg p-6">
          <h4 className="text-xl font-semibold text-[#0f172a] mb-3">
            {t(language, "strategyEngine.strategyDetails")}: {strategies.find((s) => s.id === selectedStrategy)?.name}
          </h4>
          <div className="space-y-3 text-base">
            <div>
              <strong>{t(language, "strategyEngine.formulaUsed")}:</strong>
              <p className="text-[#64748b] mt-1">{strategies.find((s) => s.id === selectedStrategy)?.formula}</p>
            </div>
            <div>
              <strong>{t(language, "strategyEngine.suitableFor")}:</strong>
              <ul className="text-[#64748b] mt-1 space-y-1">
                {strategies
                  .find((s) => s.id === selectedStrategy)
                  ?.suitable.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
