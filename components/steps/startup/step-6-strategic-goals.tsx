"use client"

import { useMemo, useEffect } from "react"
import type { LocalData, Product } from "@/types/startup"
import {
  calculateMonthlyQuantity,
  getRecommendedStrategy as getRecStrategy,
  getRecommendedMargin,
  inferDifferentiationLevel,
  calculatePriceByStrategy,
  calculateFinalPrice,
} from "@/lib/calculations"
import { useLanguage } from "@/contexts/language-context"
import { tKey } from "@/lib/i18n-helpers"

interface Step6StrategicGoalsProps {
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
}

const getPrimaryStrategies = (language: "ar" | "en") => {
  return [
    {
      value: "cost_plus",
      title: tKey(language, "step6StrategicGoals.primaryStrategies.cost_plus.title"),
      description: tKey(language, "step6StrategicGoals.primaryStrategies.cost_plus.description"),
      pros: [
        tKey(language, "step6StrategicGoals.primaryStrategies.cost_plus.pros.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.cost_plus.pros.1"),
        tKey(language, "step6StrategicGoals.primaryStrategies.cost_plus.pros.2"),
      ],
      cons: [
        tKey(language, "step6StrategicGoals.primaryStrategies.cost_plus.cons.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.cost_plus.cons.1"),
      ],
      bestFor: ["quick_revenue", "test_market"],
      category: "primary" as const,
    },
    {
      value: "competitive",
      title: tKey(language, "step6StrategicGoals.primaryStrategies.competitive.title"),
      description: tKey(language, "step6StrategicGoals.primaryStrategies.competitive.description"),
      pros: [
        tKey(language, "step6StrategicGoals.primaryStrategies.competitive.pros.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.competitive.pros.1"),
      ],
      cons: [
        tKey(language, "step6StrategicGoals.primaryStrategies.competitive.cons.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.competitive.cons.1"),
      ],
      bestFor: ["market_entry", "sustainable_growth"],
      category: "primary" as const,
    },
    {
      value: "value_based",
      title: tKey(language, "step6StrategicGoals.primaryStrategies.value_based.title"),
      description: tKey(language, "step6StrategicGoals.primaryStrategies.value_based.description"),
      pros: [
        tKey(language, "step6StrategicGoals.primaryStrategies.value_based.pros.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.value_based.pros.1"),
      ],
      cons: [
        tKey(language, "step6StrategicGoals.primaryStrategies.value_based.cons.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.value_based.cons.1"),
      ],
      bestFor: ["premium_position", "sustainable_growth"],
      category: "primary" as const,
    },
    {
      value: "penetration",
      title: tKey(language, "step6StrategicGoals.primaryStrategies.penetration.title"),
      description: tKey(language, "step6StrategicGoals.primaryStrategies.penetration.description"),
      pros: [
        tKey(language, "step6StrategicGoals.primaryStrategies.penetration.pros.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.penetration.pros.1"),
      ],
      cons: [
        tKey(language, "step6StrategicGoals.primaryStrategies.penetration.cons.0"),
        tKey(language, "step6StrategicGoals.primaryStrategies.penetration.cons.1"),
      ],
      bestFor: ["market_entry", "test_market"],
      category: "primary" as const,
    },
  ]
}

const getSecondaryStrategies = (language: "ar" | "en") => {
  return [
    {
      value: "psychological",
      title: tKey(language, "step6StrategicGoals.secondaryStrategies.psychological.title"),
      description: tKey(language, "step6StrategicGoals.secondaryStrategies.psychological.description"),
      pros: [
        tKey(language, "step6StrategicGoals.secondaryStrategies.psychological.pros.0"),
        tKey(language, "step6StrategicGoals.secondaryStrategies.psychological.pros.1"),
      ],
      cons: [tKey(language, "step6StrategicGoals.secondaryStrategies.psychological.cons.0")],
      category: "secondary" as const,
    },
    {
      value: "bundle",
      title: tKey(language, "step6StrategicGoals.secondaryStrategies.bundle.title"),
      description: tKey(language, "step6StrategicGoals.secondaryStrategies.bundle.description"),
      pros: [
        tKey(language, "step6StrategicGoals.secondaryStrategies.bundle.pros.0"),
        tKey(language, "step6StrategicGoals.secondaryStrategies.bundle.pros.1"),
      ],
      cons: [tKey(language, "step6StrategicGoals.secondaryStrategies.bundle.cons.0")],
      category: "secondary" as const,
    },
    {
      value: "dynamic",
      title: tKey(language, "step6StrategicGoals.secondaryStrategies.dynamic.title"),
      description: tKey(language, "step6StrategicGoals.secondaryStrategies.dynamic.description"),
      pros: [
        tKey(language, "step6StrategicGoals.secondaryStrategies.dynamic.pros.0"),
        tKey(language, "step6StrategicGoals.secondaryStrategies.dynamic.pros.1"),
      ],
      cons: [tKey(language, "step6StrategicGoals.secondaryStrategies.dynamic.cons.0")],
      category: "secondary" as const,
    },
    {
      value: "skimming",
      title: tKey(language, "step6StrategicGoals.secondaryStrategies.skimming.title"),
      description: tKey(language, "step6StrategicGoals.secondaryStrategies.skimming.description"),
      pros: [
        tKey(language, "step6StrategicGoals.secondaryStrategies.skimming.pros.0"),
        tKey(language, "step6StrategicGoals.secondaryStrategies.skimming.pros.1"),
      ],
      cons: [tKey(language, "step6StrategicGoals.secondaryStrategies.skimming.cons.0")],
      category: "secondary" as const,
    },
  ]
}

export function Step6StrategicGoals({ localData, updateLocalData }: Step6StrategicGoalsProps) {
  const { language, dir } = useLanguage()
  const primaryStrategies = getPrimaryStrategies(language)
  const secondaryStrategies = getSecondaryStrategies(language)
  const allStrategies = [...primaryStrategies, ...secondaryStrategies]
  const products: Product[] = localData.products || []
  const sector = localData.sector || "other"
  const runwayMonths = localData.runwayMonths ?? 12

  const companyStage = localData.companyStage || (localData as any).stage
  const currentGoal = localData.currentGoal

  const getAvgCompetitorPriceForProduct = (productId?: string) => {
    const prices = (localData.competitors || [])
      .filter((c) => !productId || c.productId === productId)
      .map((c) => Number(c.price))
      .filter((p) => p > 0)
    if (prices.length === 0) return 0
    return prices.reduce((s, p) => s + p, 0) / prices.length
  }

  const differentiationLevel = inferDifferentiationLevel((localData as any).differentiationPoints)

  const priceSensitivity = (localData as any).priceSensitivity as "high" | "medium" | "low" | undefined

  const productLtvCacRatio: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {}
    const ltvInputs = localData.productLtvCac || {}
    products.forEach((p) => {
      const inp = ltvInputs[p.id]
      if (!inp) return
      const avgOrder = Number(inp.avgOrderValue) || 0
      const freq = Number(inp.purchaseFrequency) || 0
      const grossPct = Number(inp.grossMarginPercent) || 0
      const revenuePerCycle = avgOrder * freq
      const grossPerCycle = revenuePerCycle * (grossPct / 100)
      const churn = Number(inp.customerChurnRate) || 0
      const lifespan = churn > 0 ? Math.max(1, Math.round(100 / churn)) : 12 // months
      const ltv = grossPerCycle * (lifespan / 12)
      const cac = (Number(inp.monthlyMarketingCost) || 0) / Math.max(1, Number(inp.monthlyNewCustomers) || 0)
      map[p.id] = cac > 0 ? ltv / cac : 0
    })
    return map
  }, [localData.productLtvCac, products])

  const recommendedMaps = useMemo(() => {
    const recStrategy: Record<string, string> = {}
    const recMargin: Record<string, number> = {}
    products.forEach((p) => {
      const strategy = getRecStrategy({
        sector,
        stage: companyStage,
        goal: currentGoal,
        priceSensitivity: priceSensitivity || "medium",
        differentiationLevel,
        runwayMonths,
      })
      const margin = getRecommendedMargin({
        sector,
        runwayMonths,
        ltvToCac: productLtvCacRatio[p.id] || 0,
      })
      recStrategy[p.id] = strategy
      recMargin[p.id] = margin
    })
    return { recStrategy, recMargin }
  }, [
    products,
    sector,
    companyStage,
    currentGoal,
    priceSensitivity,
    differentiationLevel,
    runwayMonths,
    productLtvCacRatio,
  ])

  useEffect(() => {
    const hasStrategyDiff =
      JSON.stringify(localData.recommendedStrategy || {}) !== JSON.stringify(recommendedMaps.recStrategy)
    const hasMarginDiff =
      JSON.stringify(localData.recommendedMargin || {}) !== JSON.stringify(recommendedMaps.recMargin)
    if (hasStrategyDiff || hasMarginDiff) {
      updateLocalData({
        recommendedStrategy: recommendedMaps.recStrategy,
        recommendedMargin: recommendedMaps.recMargin,
      })
    }
  }, [recommendedMaps, localData.recommendedStrategy, localData.recommendedMargin, updateLocalData])

  useEffect(() => {
    const prods = localData.products || []
    if (prods.length === 0) return

    const tolerance = 0.01
    let changed = false
    const updated = prods.map((p) => {
      const unitVar = Number((p as any).unitVarCost) || 0
      const fixedPer = Number((p as any).allocatedFixedCostPerUnit) || 0
      const total = unitVar + fixedPer
      if (Math.abs((p.totalUnitCost || 0) - total) > tolerance) {
        changed = true
        return { ...p, totalUnitCost: total }
      }
      return p
    })
    if (changed) updateLocalData({ products: updated })
  }, [localData.products, localData.fixedCosts, updateLocalData])

  const calculateBaseCost = () => {
    if (products.length === 0) return 0
    return products.reduce((acc, p) => {
      const unitCost = Number((p as any).totalUnitCost) || 0
      const qty = calculateMonthlyQuantity(p)
      return acc + unitCost * qty
    }, 0)
  }

  useEffect(() => {
    const prods = localData.products || []
    if (prods.length === 0) return

    const tol = 0.005
    const anyChanged = false
    const nextEffective: Record<string, string> = { ...(localData.effectiveStrategy || {}) }
    const updatedProducts = prods.map((p) => {
      const unitVariableCost = Number((p as any).unitVarCost) || 0
      const fixedCostPerUnit = Number((p as any).allocatedFixedCostPerUnit) || 0
      const unitCost = Number((p as any).totalUnitCost) || unitVariableCost + fixedCostPerUnit

      const effectiveStrategy = (localData.selectedStrategy ||
        localData.recommendedStrategy?.[p.id] ||
        recommendedMaps.recStrategy[p.id] ||
        "cost_plus") as string
      nextEffective[p.id] = effectiveStrategy

      const marginPct =
        effectiveStrategy === "cost_plus"
          ? Number.isFinite(localData.customMargin as any)
            ? Number(localData.customMargin)
            : 0
          : (localData.recommendedMargin?.[p.id] ?? recommendedMaps.recMargin[p.id] ?? 0)

      const avgComp = getAvgCompetitorPriceForProduct(p.id)
      let price = calculatePriceByStrategy(effectiveStrategy, unitCost, avgComp, marginPct)
      price = calculateFinalPrice(price, localData.secondaryStrategies || [])

      if (effectiveStrategy === "cost_plus") {
        const m = Math.max(0, Math.min(99.99, Number(marginPct) || 0))
        const target = m > 0 ? unitCost / (1 - m / 100) : unitCost
        let pFinal = round2(Math.max(price, target))
        if (pFinal + 1e-9 < target) pFinal = ceil2(target)
        price = pFinal
      } else {
        price = round2(Math.max(price, unitCost))
      }

      const prevPrice = Number((p as any).price)
      if (!Number.isFinite(prevPrice) || Math.abs(prevPrice - price) > tol) {
        return { ...p, price }
      }
      return p
    })
    updateLocalData({ products: updatedProducts })
  }, [
    localData.products,
    localData.selectedStrategy,
    localData.recommendedStrategy,
    recommendedMaps,
    localData.secondaryStrategies,
    localData.customMargin,
    updateLocalData,
  ])

  const warningsPerProduct = useMemo(() => {
    const warnings: Record<string, string[]> = {}
    const effectiveStrategyByProduct: Record<string, string> = {}

    products.forEach((p) => {
      const productWarnings: string[] = []
      const unitCost = Number((p as any).totalUnitCost) || 0
      const effectiveStrategy = (localData.selectedStrategy ||
        localData.recommendedStrategy?.[p.id] ||
        recommendedMaps.recStrategy[p.id] ||
        "cost_plus") as string

      effectiveStrategyByProduct[p.id] = effectiveStrategy

      const marginPct =
        effectiveStrategy === "cost_plus"
          ? Number.isFinite(localData.customMargin as any)
            ? Number(localData.customMargin)
            : 0
          : (localData.recommendedMargin?.[p.id] ?? recommendedMaps.recMargin[p.id] ?? 0)

      const avgComp = getAvgCompetitorPriceForProduct(p.id)
      let price = calculatePriceByStrategy(effectiveStrategy, unitCost, avgComp, marginPct)
      price = calculateFinalPrice(price, localData.secondaryStrategies || [])

      if (effectiveStrategy === "cost_plus") {
        const m = Math.max(0, Math.min(99.99, Number(marginPct) || 0))
        const target = m > 0 ? unitCost / (1 - m / 100) : unitCost
        let pFinal = round2(Math.max(price, target))
        if (pFinal + 1e-9 < target) pFinal = ceil2(target)
        price = pFinal
      } else {
        price = round2(Math.max(price, unitCost))
      }

      if (price < unitCost) {
        productWarnings.push(tKey(language, "step6StrategicGoals.warnings.belowCost"))
      }

      const ltvCacRatio = productLtvCacRatio[p.id] || 0
      if (ltvCacRatio > 0 && ltvCacRatio < 1.5) {
        productWarnings.push(tKey(language, "step6StrategicGoals.warnings.ltvLow"))
      }

      warnings[p.id] = productWarnings
    })

    const uniqueStrategies = new Set(Object.values(effectiveStrategyByProduct))
    const globalWarnings: string[] = []
    if (uniqueStrategies.size > 1) {
      globalWarnings.push(tKey(language, "step6StrategicGoals.warnings.mixedPricing"))
    }

    return { perProduct: warnings, global: globalWarnings }
  }, [products, localData, recommendedMaps, productLtvCacRatio, language])

  const round2 = (n: number) => Math.round(n * 100) / 100
  const ceil2 = (n: number) => Math.ceil(n * 100) / 100

  return (
    <div dir={dir} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-balance">{tKey(language, "step6StrategicGoals.title")}</h2>
      </div>

      {warningsPerProduct.global.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          {warningsPerProduct.global.map((warning, idx) => (
            <p key={idx} className="text-yellow-800 text-sm">
              {warning}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-start">{tKey(language, "step6StrategicGoals.primaryTitle")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {primaryStrategies.map((strategy) => (
            <div key={strategy.value} className="border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-start">{strategy.title}</h4>
                <p className="text-sm text-muted-foreground text-start">{strategy.description}</p>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-green-700 text-start">
                    {tKey(language, "step6StrategicGoals.prosLabel")}:
                  </h5>
                  <ul className="text-xs text-green-600 space-y-1">
                    {strategy.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span className="text-start">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-red-700 text-start">
                    {tKey(language, "step6StrategicGoals.consLabel")}:
                  </h5>
                  <ul className="text-xs text-red-600 space-y-1">
                    {strategy.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span className="text-start">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-start">{tKey(language, "step6StrategicGoals.secondaryTitle")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {secondaryStrategies.map((strategy) => (
            <div key={strategy.value} className="border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-start">{strategy.title}</h4>
                <p className="text-sm text-muted-foreground text-start">{strategy.description}</p>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-green-700 text-start">
                    {tKey(language, "step6StrategicGoals.prosLabel")}:
                  </h5>
                  <ul className="text-xs text-green-600 space-y-1">
                    {strategy.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span className="text-start">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-red-700 text-start">
                    {tKey(language, "step6StrategicGoals.consLabel")}:
                  </h5>
                  <ul className="text-xs text-red-600 space-y-1">
                    {strategy.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span className="text-start">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-start">{tKey(language, "step6StrategicGoals.breakdown.title")}</h3>
          <div className="overflow-x-auto">
            <table
              className={`w-full border-collapse border border-gray-200 ${dir === "rtl" ? "text-right" : "text-left"}`}
            >
              <thead>
                <tr className="bg-gray-50">
                  <th className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                    {tKey(language, "step6StrategicGoals.tables.products.header.product")}
                  </th>
                  <th className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                    {tKey(language, "step6StrategicGoals.tables.products.header.unitCost")}
                  </th>
                  <th className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                    {tKey(language, "step6StrategicGoals.tables.products.header.strategy")}
                  </th>
                  <th className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                    {tKey(language, "step6StrategicGoals.tables.products.header.margin")}
                  </th>
                  <th className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                    {tKey(language, "step6StrategicGoals.tables.products.header.finalPrice")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const unitCost = Number((product as any).totalUnitCost) || 0
                  const effectiveStrategy = localData.recommendedStrategy?.[product.id] || "cost_plus"
                  const strategyObj = allStrategies.find((s) => s.value === effectiveStrategy)
                  const finalPrice = Number((product as any).price) || 0
                  const marginPct = unitCost > 0 ? ((finalPrice - unitCost) / unitCost) * 100 : 0

                  return (
                    <tr key={product.id}>
                      <td className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {product.name}
                      </td>
                      <td className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {unitCost.toFixed(2)}
                      </td>
                      <td className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {strategyObj?.title || effectiveStrategy}
                      </td>
                      <td className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {marginPct.toFixed(1)}%
                      </td>
                      <td className={`border border-gray-200 px-4 py-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {finalPrice.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {Object.entries(warningsPerProduct.perProduct).map(([productId, warnings]) => {
            if (warnings.length === 0) return null
            const product = products.find((p) => p.id === productId)
            return (
              <div key={productId} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className={`font-medium text-red-800 mb-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                  {product?.name}
                </h4>
                {warnings.map((warning, idx) => (
                  <p key={idx} className={`text-red-700 text-sm ${dir === "rtl" ? "text-right" : "text-left"}`}>
                    {warning}
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {tKey(language, "step6StrategicGoals.tables.products.empty")}
        </div>
      )}
    </div>
  )
}
