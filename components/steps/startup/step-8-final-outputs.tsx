"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  DollarSign,
  Target,
  BarChart3,
  TrendingUp,
  PieChart,
  Zap,
  CheckCircle,
  AlertTriangle,
  Eye,
  Lightbulb,
  Activity,
  Clock,
  Calculator,
  Share2,
  Download,
  FileText,
  Heart,
  UserPlus,
} from "lucide-react"
import { calculatePriceByStrategy, computeProductCosts, calculateFinalPrice } from "@/lib/calculations"
import { formatCurrency, calculateTotalFixedCosts } from "@/lib/calculations"
import { generateStartupPDF } from "@/lib/pdf-export-startup"
import { generatePDF } from "@/lib/pdf-generator"
import { t } from "@/lib/startup-translations"
import { useLanguage } from "@/contexts/language-context"
import { tKey } from "@/lib/i18n-helpers"
import { useTranslation } from "react-i18next"

type RecType = "warning" | "success" | "info"
interface Recommendation {
  type: RecType
  title: string
  description: string
  action?: string
}

const SECTOR_INFO: Record<string, { min: number; max: number; advice: string }> = {
  ecommerce: { min: 15, max: 25, advice: "step8FinalOutputs.sectorRecommendations.ecommerce" },
  restaurants: { min: 3, max: 9, advice: "step8FinalOutputs.sectorRecommendations.restaurants" },
  saas: { min: 70, max: 85, advice: "step8FinalOutputs.sectorRecommendations.saas" },
  fashion: { min: 4, max: 13, advice: "step8FinalOutputs.sectorRecommendations.fashion" },
  services: { min: 10, max: 20, advice: "step8FinalOutputs.sectorRecommendations.services" },
  industries: { min: 5, max: 15, advice: "step8FinalOutputs.sectorRecommendations.industries" },
  other: { min: 10, max: 20, advice: "step8FinalOutputs.sectorRecommendations.other" },
}

export function generateRecommendations(args: {
  localData: any
  productFinancials: any[]
  portfolioTotals: {
    totalRevenue: number
    totalVariableCosts: number
    totalFixedCosts: number
    totalCosts: number
    totalProfit: number
    profitMargin: number
  }
  diagnostics: {
    sharedFixedTotals: { allocated: number; defined: number; delta: number }
    productSpecificFixedMonthly: number
    issues: string[]
  }
  breakEven: { units: number; revenue: number; unitsGap: number; weightedAvgContribution: number }
  runway: { months: number; loss: number; cash: number }
  language?: "ar" | "en"
}): Recommendation[] {
  const { localData, productFinancials, portfolioTotals, diagnostics, breakEven, runway, language = "ar" } = args
  const recs: Recommendation[] = []

  const sector = localData?.sector ?? "other"
  const sectorInfo = SECTOR_INFO[sector] ?? SECTOR_INFO.other
  const sectorMin = sectorInfo.min
  const sectorMax = sectorInfo.max

  // 1) Portfolio margin vs sector band
  const pm = Number(portfolioTotals.profitMargin || 0)
  if (pm < 0) {
    recs.push({
      type: "warning",
      title: t(language, "step8FinalOutputs.recommendations.operationalLoss"),
      description: t(language, "step8FinalOutputs.recommendations.operationalLossDesc"),
      action: t(language, "step8FinalOutputs.recommendations.operationalLossAction"),
    })
  } else if (pm < sectorMin) {
    recs.push({
      type: "warning",
      title: t(language, "step8FinalOutputs.recommendations.lowMargin"),
      description: t(language, "step8FinalOutputs.recommendations.lowMarginDesc")
        .replace("{margin}", pm.toFixed(1))
        .replace("{min}", sectorMin.toString())
        .replace("{max}", sectorMax.toString()),
      action: t(language, "step8FinalOutputs.recommendations.lowMarginAction"),
    })
  } else if (pm > sectorMax) {
    recs.push({
      type: "success",
      title: t(language, "step8FinalOutputs.recommendations.excellentMargin"),
      description: t(language, "step8FinalOutputs.recommendations.excellentMarginDesc").replace(
        "{margin}",
        pm.toFixed(1),
      ),
      action: t(language, "step8FinalOutputs.recommendations.excellentMarginAction"),
    })
  } else {
    recs.push({
      type: "success",
      title: t(language, "step8FinalOutputs.recommendations.withinSectorMargin"),
      description: t(language, "step8FinalOutputs.recommendations.withinSectorMarginDesc")
        .replace("{margin}", pm.toFixed(1))
        .replace("{min}", sectorMin.toString())
        .replace("{max}", sectorMax.toString()),
      action: t(language, "step8FinalOutputs.recommendations.withinSectorMarginAction"),
    })
  }

  // 2) Fixed cost coverage
  const totalContribution = productFinancials.reduce(
    (s, f) => s + Number(f.contributionMargin || 0) * Number(f.monthlyQuantity || 0),
    0,
  )
  if (totalContribution + 1e-6 < Number(portfolioTotals.totalFixedCosts || 0)) {
    const gap = Number(portfolioTotals.totalFixedCosts || 0) - totalContribution
    recs.push({
      type: "warning",
      title: t(language, "step8FinalOutputs.recommendations.insufficientContribution"),
      description: t(language, "step8FinalOutputs.recommendations.insufficientContributionDesc").replace(
        "{gap}",
        gap.toFixed(2),
      ),
      action: t(language, "step8FinalOutputs.recommendations.insufficientContributionAction"),
    })
  }

  // 3) Allocation audit
  const absDelta = Math.abs(Number(diagnostics?.sharedFixedTotals?.delta || 0))
  const defined = Math.max(1, Number(diagnostics?.sharedFixedTotals?.defined || 0))
  const threshold = Math.max(1, 0.02 * defined)
  if (absDelta > threshold) {
    const sign = (diagnostics.sharedFixedTotals.delta || 0) > 0 ? "+" : "-"
    recs.push({
      type: "warning",
      title: t(language, "step8FinalOutputs.recommendations.allocationDiscrepancy"),
      description: t(language, "step8FinalOutputs.recommendations.allocationDiscrepancyDesc")
        .replace("{sign}", sign)
        .replace("{delta}", absDelta.toFixed(2)),
      action: t(language, "step8FinalOutputs.recommendations.allocationDiscrepancyAction"),
    })
  }

  // 4) Price vs cost
  for (const f of productFinancials) {
    if (Number(f.price) + 1e-9 < Number(f.totalUnitCost)) {
      recs.push({
        type: "warning",
        title: t(language, "step8FinalOutputs.recommendations.priceBelowCost").replace("{name}", f.name),
        description: t(language, "step8FinalOutputs.recommendations.priceBelowCostDesc"),
        action: t(language, "step8FinalOutputs.recommendations.priceBelowCostAction"),
      })
    }
  }

  // 5) Cost+ target vs achieved
  const customMargin = Math.max(0, Math.min(99.99, Number(localData?.customMargin || 0)))
  for (const f of productFinancials) {
    const eff = String(f.effectiveStrategy || "")
    const achieved = Number(f.achievedMarginPct ?? f.profitMargin ?? 0)
    if (eff === "cost_plus" && achieved + 0.05 < customMargin) {
      recs.push({
        type: "warning",
        title: t(language, "step8FinalOutputs.recommendations.costPlusNotAchieved").replace("{name}", f.name),
        description: t(language, "step8FinalOutputs.recommendations.costPlusNotAchievedDesc")
          .replace("{achieved}", achieved.toFixed(1))
          .replace("{target}", customMargin.toFixed(1)),
        action: t(language, "step8FinalOutputs.recommendations.costPlusNotAchievedAction"),
      })
    }
  }

  // 6) Competitors
  const hasComp = productFinancials.some((f) => Number(f.competitorAvg || 0) > 0)
  if (!hasComp) {
    recs.push({
      type: "info",
      title: t(language, "step8FinalOutputs.recommendations.missingCompetitorAnalysis"),
      description: t(language, "step8FinalOutputs.recommendations.missingCompetitorAnalysisDesc"),
      action: t(language, "step8FinalOutputs.recommendations.missingCompetitorAnalysisAction"),
    })
  } else {
    const largeDevs = productFinancials.filter((f) => Math.abs(Number(f.competitorDeviationPct || 0)) > 20)
    if (largeDevs.length > 0) {
      recs.push({
        type: "info",
        title: t(language, "step8FinalOutputs.recommendations.largePriceDeviation"),
        description: t(language, "step8FinalOutputs.recommendations.largePriceDeviationDesc").replace(
          "{count}",
          largeDevs.length.toString(),
        ),
        action: t(language, "step8FinalOutputs.recommendations.largePriceDeviationAction"),
      })
    }
  }

  // 7) Break-even
  if (Number(breakEven?.unitsGap || 0) > 0) {
    recs.push({
      type: "info",
      title: t(language, "step8FinalOutputs.recommendations.breakEvenGap"),
      description: t(language, "step8FinalOutputs.recommendations.breakEvenGapDesc").replace(
        "{gap}",
        Number(breakEven.unitsGap).toFixed(0),
      ),
      action: t(language, "step8FinalOutputs.recommendations.breakEvenGapAction"),
    })
  }

  // 8) Runway
  if (Number(runway?.loss || 0) > 0 && Number(runway?.cash || 0) > 0 && Number.isFinite(Number(runway?.months))) {
    recs.push({
      type: "info",
      title: t(language, "step8FinalOutputs.recommendations.limitedRunway"),
      description: t(language, "step8FinalOutputs.recommendations.limitedRunwayDesc").replace(
        "{months}",
        Number(runway.months).toFixed(1),
      ),
      action: t(language, "step8FinalOutputs.recommendations.limitedRunwayAction"),
    })
  } else if (!Number.isFinite(Number(runway?.months))) {
    recs.push({
      type: "success",
      title: t(language, "step8FinalOutputs.recommendations.sustainableOperation"),
      description: t(language, "step8FinalOutputs.recommendations.sustainableOperationDesc"),
      action: t(language, "step8FinalOutputs.recommendations.sustainableOperationAction"),
    })
  }

  // 9) Product-level outliers
  for (const f of productFinancials) {
    const prodPM = Number(f.profitMargin || 0)
    const cr = Number(f.contributionRatio || 0)
    if (prodPM < sectorMin - 2 || cr < 0.2) {
      recs.push({
        type: "warning",
        title: t(language, "step8FinalOutputs.recommendations.poorProductPerformance").replace("{name}", f.name),
        description: t(language, "step8FinalOutputs.recommendations.poorProductPerformanceDesc").replace(
          "{margin}",
          prodPM.toFixed(1),
        ),
        action: t(language, "step8FinalOutputs.recommendations.poorProductPerformanceAction"),
      })
    } else if (prodPM > sectorMax + 3) {
      recs.push({
        type: "success",
        title: t(language, "step8FinalOutputs.recommendations.starProduct").replace("{name}", f.name),
        description: t(language, "step8FinalOutputs.recommendations.starProductDesc"),
        action: t(language, "step8FinalOutputs.recommendations.starProductAction"),
      })
    }
  }

  // 10) Sector-tailored nudges
  switch (sector) {
    case "restaurants":
      recs.push({
        type: "info",
        title: t(language, "step8FinalOutputs.recommendations.restaurantsFocus"),
        description: t(language, "step8FinalOutputs.recommendations.restaurantsFocusDesc"),
        action: t(language, "step8FinalOutputs.recommendations.restaurantsFocusAction"),
      })
      break
    case "ecommerce":
      recs.push({
        type: "info",
        title: t(language, "step8FinalOutputs.recommendations.ecommerceFocus"),
        description: t(language, "step8FinalOutputs.recommendations.ecommerceFocusDesc"),
        action: t(language, "step8FinalOutputs.recommendations.ecommerceFocusAction"),
      })
      break
    case "saas":
      recs.push({
        type: "info",
        title: t(language, "step8FinalOutputs.recommendations.saasFocus"),
        description: t(language, "step8FinalOutputs.recommendations.saasFocusDesc"),
        action: t(language, "step8FinalOutputs.recommendations.saasFocusAction"),
      })
      break
    case "fashion":
      recs.push({
        type: "info",
        title: t(language, "step8FinalOutputs.recommendations.fashionFocus"),
        description: t(language, "step8FinalOutputs.recommendations.fashionFocusDesc"),
        action: t(language, "step8FinalOutputs.recommendations.fashionFocusAction"),
      })
      break
    case "industries":
      recs.push({
        type: "info",
        title: t(language, "step8FinalOutputs.recommendations.industriesFocus"),
        description: t(language, "step8FinalOutputs.recommendations.industriesFocusDesc"),
        action: t(language, "step8FinalOutputs.recommendations.industriesFocusAction"),
      })
      break
    case "services":
      recs.push({
        type: "info",
        title: t(language, "step8FinalOutputs.recommendations.servicesFocus"),
        description: t(language, "step8FinalOutputs.recommendations.servicesFocusDesc"),
        action: t(language, "step8FinalOutputs.recommendations.servicesFocusAction"),
      })
      break
  }

  return recs
}

import type { FinancialResult } from "@/types/startup"
import type { LocalData, Product } from "@/types/startup"

interface StepProps {
  language: string;
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
  language: "ar" | "en" // Added language prop
}

export default function Step8FinalOutputs({ localData, updateLocalData }: StepProps) {
  const { language, dir } = useLanguage()
  const [activeTab, setActiveTab] = useState("summary")
  const { t: startupT } = useTranslation("startup")

  // 2-decimal helpers (keep consistent with Step 6)
  const round2 = (n: number) => Math.round(n * 100) / 100
  const ceil2 = (n: number) => Math.ceil(n * 100) / 100

  const { productFinancials, portfolioTotals, diagnostics, breakEven, runway } = useMemo(() => {
    const defaultResult = {
      productFinancials: [] as FinancialResult[],
      portfolioTotals: {
        totalRevenue: 0,
        totalVariableCosts: 0,
        totalFixedCosts: 0,
        totalCosts: 0,
        totalProfit: 0,
        profitMargin: 0,
      },
      diagnostics: {
        sharedFixedTotals: { allocated: 0, defined: 0, delta: 0 },
        productSpecificFixedMonthly: 0,
        issues: [] as string[],
      },
      breakEven: { units: 0, revenue: 0, unitsGap: 0, weightedAvgContribution: 0 },
      runway: { months: 0, loss: 0, cash: 0 },
    }

    if (!localData.products || localData.products.length === 0) {
      return defaultResult
    }

    const getAvgCompetitorPriceForProduct = (productId: string) => {
      const product = localData.products.find((p: Product) => p.id === productId)
      if (!product || !product.competitors) return 0
      const validPrices = product.competitors.map((c: any) => Number(c.price)).filter((p: number) => p > 0)
      return validPrices.length > 0 ? validPrices.reduce((a: number, b: number) => a + b, 0) / validPrices.length : 0
    }

    let sharedAllocatedMonthlySum = 0
    let productSpecificMonthlySum = 0

    const financials: FinancialResult[] = localData.products.map((p) => {
      const { unitVariableCost, fixedCostPerUnit, totalUnitCost, monthlyQuantity } = computeProductCosts(p, localData)
      const effectiveStrategy = localData.effectiveStrategy?.[p.id] || localData.selectedStrategy || "cost_plus"
      const marginPct =
        effectiveStrategy === "cost_plus"
          ? Number.isFinite(localData.customMargin as any)
            ? Number(localData.customMargin)
            : 0
          : (localData.recommendedMargin?.[p.id] ?? 0)
      const avgComp = getAvgCompetitorPriceForProduct(p.id)

      let finalPrice = Number((p as any).price)
      if (!Number.isFinite(finalPrice)) {
        const basePrice = calculatePriceByStrategy(
          effectiveStrategy,
          totalUnitCost,
          avgComp,
          marginPct,
          localData.customMargin,
        )
        const tmp = calculateFinalPrice(basePrice, localData.secondaryStrategies || [])
        if (effectiveStrategy === "cost_plus") {
          const m = Math.max(0, Math.min(99.99, Number(marginPct) || 0))
          const target = m > 0 ? totalUnitCost / (1 - m / 100) : totalUnitCost
          let pFinal = round2(Math.max(tmp, target))
          if (pFinal + 1e-9 < target) pFinal = ceil2(target)
          finalPrice = pFinal
        } else {
          finalPrice = round2(Math.max(tmp, totalUnitCost))
        }
      }

      const monthlyRevenue = finalPrice * monthlyQuantity
      const monthlyVariableCosts = unitVariableCost * monthlyQuantity
      const monthlyFixedCostsAllocated = fixedCostPerUnit * monthlyQuantity
      const monthlyTotalCost = monthlyVariableCosts + monthlyFixedCostsAllocated
      const monthlyProfit = monthlyRevenue - monthlyTotalCost
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0
      const contributionMargin = finalPrice - unitVariableCost

      // Product-specific fixed costs monthly total
      const productSpecificMonthly = (
        Array.isArray((p as any).productFixedCosts) ? (p as any).productFixedCosts : []
      ).reduce((s: number, fc: any) => s + Math.max(0, Number(fc?.monthlyAmount) || 0), 0)
      const productSpecificPerUnit = monthlyQuantity > 0 ? productSpecificMonthly / monthlyQuantity : 0
      // Shared part allocated (monthly)
      const sharedAllocatedMonthly = Math.max(0, fixedCostPerUnit - productSpecificPerUnit) * monthlyQuantity
      sharedAllocatedMonthlySum += sharedAllocatedMonthly
      productSpecificMonthlySum += productSpecificMonthly

      // Competitor deviation
      const compDeviationPct = avgComp > 0 ? ((finalPrice - avgComp) / avgComp) * 100 : 0

      return {
        ...p,
        monthlyQuantity,
        price: finalPrice,
        totalUnitCost,
        unitVariableCost,
        fixedCostPerUnit,
        monthlyRevenue,
        monthlyVariableCosts,
        monthlyFixedCostsAllocated,
        monthlyTotalCost,
        monthlyProfit,
        profitMargin,
        contributionMargin,
        contributionRatio: finalPrice > 0 ? contributionMargin / finalPrice : 0,
        // extra diagnostics for UI badges
        effectiveStrategy,
        achievedMarginPct: profitMargin,
        competitorAvg: avgComp,
        competitorDeviationPct: compDeviationPct,
      }
    })

    const sharedFixedDefined = calculateTotalFixedCosts(
      localData.fixedCosts || [],
      localData.depreciation,
      localData.rdBudget,
    )
    const totals = {
      totalRevenue: financials.reduce((sum, r) => sum + r.monthlyRevenue, 0),
      totalVariableCosts: financials.reduce((sum, r) => sum + r.monthlyVariableCosts, 0),
      // Shared fixed (defined) + product-specific fixed monthly
      totalFixedCosts: sharedFixedDefined + productSpecificMonthlySum,
      get totalCosts() {
        return this.totalVariableCosts + this.totalFixedCosts
      },
      get totalProfit() {
        return this.totalRevenue - this.totalCosts
      },
      get profitMargin() {
        return this.totalRevenue > 0 ? (this.totalProfit / this.totalRevenue) * 100 : 0
      },
    }

    const diag = {
      sharedFixedTotals: {
        allocated: sharedAllocatedMonthlySum,
        defined: sharedFixedDefined,
        delta: sharedAllocatedMonthlySum - sharedFixedDefined,
      },
      productSpecificFixedMonthly: productSpecificMonthlySum,
      issues: [] as string[],
    }

    // Consistency checks (tolerant: only warn if > max(1 جنيه, 2% من الثابتة المشتركة المُعرّفة))
    const absDelta = Math.abs(diag.sharedFixedTotals.delta)
    const deltaThreshold = Math.max(1, 0.02 * Math.max(1, diag.sharedFixedTotals.defined))
    if (absDelta > deltaThreshold) {
      const sign = diag.sharedFixedTotals.delta > 0 ? "+" : "-"
      diag.issues.push(
        `فروق في توزيع التكاليف الثابتة المشتركة (يتم استبعاد الثابتة الخاصة بالمنتجات): الفرق ${sign}${absDelta.toFixed(2)} شهريًا مقابل المُعرّف`,
      )
    }
    financials.forEach((f) => {
      if (f.price && f.price < f.totalUnitCost - 1e-6) {
        diag.issues.push(`سعر المنتج "${f.name}" أقل من تكلفة الوحدة`)
      }
      if (f.effectiveStrategy === "cost_plus") {
        const m = Math.max(0, Math.min(99.99, Number(localData.customMargin) || 0))
        const achieved = f.achievedMarginPct ?? f.profitMargin
        if (achieved + 0.05 < m) {
          diag.issues.push(
            `هامش الربح المحقق للمنتج "${f.name}" (${achieved.toFixed(1)}%) أقل من المستهدف (${m.toFixed(1)}%)`,
          )
        }
      }
    })

    // Break-even (على مستوى المحفظة): Fixed Costs / Weighted Avg Contribution Margin per Unit
    const totalUnits = financials.reduce((sum, f) => sum + f.monthlyQuantity, 0)
    const weightedAvgContribution =
      totalUnits > 0 ? financials.reduce((sum, f) => sum + f.contributionMargin * f.monthlyQuantity, 0) / totalUnits : 0
    const breakEvenUnits = weightedAvgContribution > 0 ? totals.totalFixedCosts / weightedAvgContribution : 0
    const breakEvenRevenue = breakEvenUnits * (totals.totalRevenue / Math.max(1, totalUnits))
    const currentUnits = totalUnits
    const unitsGap = Math.max(0, breakEvenUnits - currentUnits)

    // Runway: Cash burn rate calculation
    const monthlyLoss = Math.max(0, totals.totalCosts - totals.totalRevenue)
    const availableCash = Math.max(0, Number(localData.runwayCash) || 0)

    let runwayMonths: number
    if (monthlyLoss <= 0) {
      // Profitable - infinite runway
      runwayMonths = Number.POSITIVE_INFINITY
    } else if (availableCash <= 0) {
      // No cash available - immediate problem
      runwayMonths = 0
    } else {
      // Losing money but have cash - calculate months
      runwayMonths = availableCash / monthlyLoss
    }

    return {
      productFinancials: financials,
      portfolioTotals: totals,
      diagnostics: diag,
      breakEven: { units: breakEvenUnits, revenue: breakEvenRevenue, unitsGap, weightedAvgContribution },
      runway: { months: runwayMonths, loss: monthlyLoss, cash: availableCash },
    }
  }, [localData])

  // Get sector info
  const getSectorBenchmarks = () => ({
    ecommerce: {
      margin: t.step8FinalOutputs?.sectorBenchmarks?.ecommerce?.margin || "15-25%",
      advice: t.step8FinalOutputs?.sectorBenchmarks?.ecommerce?.advice || "Focus on shipping and storage costs",
    },
    restaurants: {
      margin: t.step8FinalOutputs?.sectorBenchmarks?.restaurants?.margin || "3-9%",
      advice: t.step8FinalOutputs?.sectorBenchmarks?.restaurants?.advice || "Control raw material and labor costs",
    },
    saas: {
      margin: t.step8FinalOutputs?.sectorBenchmarks?.saas?.margin || "70-85%",
      advice: t.step8FinalOutputs?.sectorBenchmarks?.saas?.advice || "Invest in customer retention",
    },
    fashion: {
      margin: t.step8FinalOutputs?.sectorBenchmarks?.fashion?.margin || "4-13%",
      advice: t.step8FinalOutputs?.sectorBenchmarks?.fashion?.advice || "Manage inventory and seasonality",
    },
    services: {
      margin: t.step8FinalOutputs?.sectorBenchmarks?.services?.margin || "10-20%",
      advice: t.step8FinalOutputs?.sectorBenchmarks?.services?.advice || "Focus on service value",
    },
    industries: {
      margin: t.step8FinalOutputs?.sectorBenchmarks?.industries?.margin || "5-15%",
      advice: t.step8FinalOutputs?.sectorBenchmarks?.industries?.advice || "Improve operations and efficiency",
    },
    other: {
      margin: t.step8FinalOutputs?.sectorBenchmarks?.other?.margin || "10-20%",
      advice: t.step8FinalOutputs?.sectorBenchmarks?.other?.advice || "Analyze competitors carefully",
    },
  })
  const sectorBenchmarks = getSectorBenchmarks()

  const currentSector = localData.sector || "other"
  const sectorInfo = sectorBenchmarks[currentSector as keyof typeof sectorBenchmarks] || sectorBenchmarks.other

  // Strategic recommendations using dynamic sector-based system
  const recommendations = useMemo(() => {
    return generateRecommendations({
      localData,
      productFinancials,
      portfolioTotals,
      diagnostics,
      breakEven,
      runway,
      language,
    })
  }, [localData, productFinancials, portfolioTotals, diagnostics, breakEven, runway, language])

  // Handle PDF export
  const handlePDFExport = async () => {
    try {
      await generateStartupPDF(localData as any, productFinancials as any, portfolioTotals as any, language)
    } catch (error) {
      alert(tKey(language, "step8FinalOutputs.pdfGenerationError"))
    }
  }

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(localData, language)
    } catch (error) {
      alert(tKey(language, "step8FinalOutputs.pdfGenerationError"))
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir={dir}>
      {/* Executive Financial Dashboard - Merged */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            {tKey(language, "step8FinalOutputs.executiveDashboard.title")}
          </CardTitle>
          <p className="text-gray-600 mt-2">{tKey(language, "step8FinalOutputs.executiveDashboard.subtitle")}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Company Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {tKey(language, "step8FinalOutputs.companyInfo.companyName")}
                </h4>
                <p className="text-lg font-bold text-blue-600">
                  {localData.companyName || tKey(language, "step8FinalOutputs.companyInfo.notSpecified")}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">
                  {tKey(language, "step8FinalOutputs.companyInfo.sector")}
                </h4>
                <p className="text-lg font-bold text-purple-600">
                  {tKey(language, `step8FinalOutputs.sectorLabels.${localData.sector}`) ||
                    localData.sector ||
                    tKey(language, "step8FinalOutputs.sectorLabels.other")}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">
                  {tKey(language, "step8FinalOutputs.companyInfo.customerType")}
                </h4>
                <p className="text-lg font-bold text-green-600">
                  {localData.customerType === "B2B"
                    ? tKey(language, "step8FinalOutputs.customerTypeLabels.b2b")
                    : tKey(language, "step8FinalOutputs.customerTypeLabels.b2c")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Financial Health Metrics */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="h-6 w-6 text-green-600" />
                {t.step8FinalOutputs?.keyMetrics?.title || "📈 المؤشرات المالية الرئيسية"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border-2 border-green-100 shadow-sm text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-bold text-gray-700 mb-1 text-sm">
                    {t.step8FinalOutputs?.keyMetrics?.totalRevenue || "إجمالي الإيرادات"}
                  </h4>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(portfolioTotals.totalRevenue, "EGP", "ar")}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-red-100 shadow-sm text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <h4 className="font-bold text-gray-700 mb-1 text-sm">
                    {t.step8FinalOutputs?.keyMetrics?.totalCosts || "إجمالي التكاليف"}
                  </h4>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(portfolioTotals.totalCosts, "EGP", "ar")}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-blue-100 shadow-sm text-center">
                  <PieChart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-bold text-gray-700 mb-1 text-sm">
                    {t.step8FinalOutputs?.keyMetrics?.profitMargin || "هامش الربح"}
                  </h4>
                  <p className="text-xl font-bold text-blue-600">{portfolioTotals.profitMargin.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-purple-100 shadow-sm text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-bold text-gray-700 mb-1 text-sm">
                    {t.step8FinalOutputs?.keyMetrics?.netProfit || "صافي الربح"}
                  </h4>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(portfolioTotals.totalProfit, "EGP", "ar")}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Performance Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t.step8FinalOutputs?.sectorBenchmark?.title || "معايير القطاع"}
                </h4>
                <p className="text-sm text-blue-700 mb-2">
                  <strong>{t.step8FinalOutputs?.sectorBenchmark?.expectedMargin || "هامش الربح المتوقع:"}:</strong>{" "}
                  {sectorInfo.margin}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>{t.step8FinalOutputs?.sectorBenchmark?.advice || "نصيحة:"}:</strong> {sectorInfo.advice}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t.step8FinalOutputs?.currentPerformance?.title || "الأداء الحالي"}
                </h4>
                <p className="text-sm text-green-700">
                  {t.step8FinalOutputs?.currentPerformance?.yourMargin || "هامش الربح الخاص بك:"}{" "}
                  <strong>{portfolioTotals.profitMargin.toFixed(1)}%</strong>
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {portfolioTotals.profitMargin > 20
                    ? t.step8FinalOutputs?.currentPerformance?.excellent || "أداء ممتاز! 🎉"
                    : portfolioTotals.profitMargin > 10
                      ? t.step8FinalOutputs?.currentPerformance?.good || "أداء جيد ✅"
                      : t.step8FinalOutputs?.currentPerformance?.needsImprovement || "يحتاج إلى تحسين ⚠️"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Pricing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calculator className="h-8 w-8 text-green-600" />
            {t.step8FinalOutputs?.productPricing?.title || "💰 تحليل تسعير المنتج"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {productFinancials.map((result: FinancialResult, index: number) => (
              <div key={result.id} className="border rounded-xl p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{result.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {t.step8FinalOutputs?.productPricing?.productLabel || "المنتج"} {index + 1}
                    </Badge>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {t.step8FinalOutputs?.productPricing?.strategy || "الاستراتيجية:"}{" "}
                        {String((result as any).effectiveStrategy || "").toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">
                        {t.step8FinalOutputs?.productPricing?.achievedMargin || "هامش الربح المحقق:"}{" "}
                        {result.profitMargin.toFixed(1)}%
                      </Badge>
                      {(result as any).competitorAvg > 0 && (
                        <Badge variant="outline">
                          {t.step8FinalOutputs?.productPricing?.marketDifference || "فرق السوق:"}{" "}
                          {(result as any).competitorDeviationPct.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.price || 0, "EGP", "ar")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.step8FinalOutputs?.productPricing?.finalPrice || "السعر النهائي"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-sm text-gray-600">
                      {t.step8FinalOutputs?.productPricing?.expectedQuantity || "الكمية المتوقعة"}
                    </p>
                    <p className="text-lg font-bold">{result.monthlyQuantity.toLocaleString("ar")}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-sm text-gray-600">
                      {t.step8FinalOutputs?.productPricing?.totalRevenue || "إجمالي الإيرادات"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(result.monthlyRevenue, "EGP", "ar")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-sm text-gray-600">
                      {t.step8FinalOutputs?.productPricing?.totalCosts || "إجمالي التكاليف"}
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(result.monthlyTotalCost, "EGP", "ar")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-sm text-gray-600">
                      {t.step8FinalOutputs?.productPricing?.profitMargin || "هامش الربح"}
                    </p>
                    <p className="text-lg font-bold text-blue-600">{result.profitMargin.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Scenarios Table: Best / Expected / Worst */}
                {(() => {
                  const q = result.monthlyQuantity
                  const unitVar = result.unitVariableCost
                  const fixedPerUnit = result.fixedCostPerUnit
                  const price = result.price // Same price for all scenarios
                  const scenario = (label: string, qty: number) => {
                    const revenue = (price || 0) * qty
                    const varCosts = unitVar * qty
                    const fixedCosts = fixedPerUnit * qty
                    const totalCost = varCosts + fixedCosts
                    const profit = revenue - totalCost
                    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
                    const contributionMargin = (price || 0) - unitVar
                    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0
                    const totalProfit = profit // Same as profit for single product
                    return { label, price, qty, revenue, totalCost, profit, margin, breakEvenUnits, totalProfit }
                  }
                  const scenarios = [
                    scenario(tKey(language, "step8FinalOutputs.scenarios.worst"), Math.max(0, Math.round(q * 0.8))),
                    scenario(tKey(language, "step8FinalOutputs.scenarios.expected"), q),
                    scenario(tKey(language, "step8FinalOutputs.scenarios.best"), Math.round(q * 1.2)),
                  ]
                  return (
                    <div className="mt-5">
                      <h4 className="font-semibold text-gray-800 mb-3 text-center">
                        {tKey(language, "step8FinalOutputs.scenarios.title")}
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 rounded-lg">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 p-3 text-center font-semibold">
                                {tKey(language, "step8FinalOutputs.scenarios.scenario")}
                              </th>
                              <th className="border border-gray-300 p-3 text-center font-semibold">
                                {tKey(language, "step8FinalOutputs.scenarios.quantity")}
                              </th>
                              <th className="border border-gray-300 p-3 text-center font-semibold">
                                {tKey(language, "step8FinalOutputs.scenarios.revenue")}
                              </th>
                              <th className="border border-gray-300 p-3 text-center font-semibold">
                                {tKey(language, "step8FinalOutputs.scenarios.totalCost")}
                              </th>
                              <th className="border border-gray-300 p-3 text-center font-semibold">
                                {tKey(language, "step8FinalOutputs.scenarios.totalProfit")}
                              </th>
                              <th className="border border-gray-300 p-3 text-center font-semibold">
                                {tKey(language, "step8FinalOutputs.scenarios.profitMargin")}
                              </th>
                              <th className="border border-gray-300 p-3 text-center font-semibold">
                                {tKey(language, "step8FinalOutputs.scenarios.breakEven")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {scenarios.map((s, i) => (
                              <tr
                                key={i}
                                className={`${i === 0 ? "bg-red-50" : i === 1 ? "bg-gray-50" : "bg-green-50"}`}
                              >
                                <td className="border border-gray-300 p-3 text-center font-semibold">{s.label}</td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {s.qty.toLocaleString(language === "ar" ? "ar" : "en")}
                                </td>
                                <td className="border border-gray-300 p-3 text-center text-green-700 font-semibold">
                                  {formatCurrency(s.revenue, "EGP", language === "ar" ? "ar" : "en")}
                                </td>
                                <td className="border border-gray-300 p-3 text-center text-red-700 font-semibold">
                                  {formatCurrency(s.totalCost, "EGP", language === "ar" ? "ar" : "en")}
                                </td>
                                <td
                                  className="border border-gray-300 p-3 text-center font-semibold"
                                  style={{ color: s.totalProfit >= 0 ? "#059669" : "#dc2626" }}
                                >
                                  {formatCurrency(s.totalProfit, "EGP", language === "ar" ? "ar" : "en")}
                                </td>
                                <td
                                  className="border border-gray-300 p-3 text-center font-semibold"
                                  style={{ color: s.margin >= 0 ? "#059669" : "#dc2626" }}
                                >
                                  {s.margin.toFixed(1)}%
                                </td>
                                <td className="border border-gray-300 p-3 text-center font-semibold text-purple-700">
                                  {s.breakEvenUnits > 0
                                    ? `${s.breakEvenUnits.toLocaleString(language === "ar" ? "ar" : "en")} ${tKey(language, "step8FinalOutputs.scenarios.units")}`
                                    : tKey(language, "step8FinalOutputs.scenarios.undefined")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {tKey(language, "step8FinalOutputs.scenarios.fixedPriceNote", {
                          price: formatCurrency(price || 0, "EGP", language === "ar" ? "ar" : "en"),
                        })}
                      </p>
                    </div>
                  )
                })()}

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {t.step8FinalOutputs?.productPricing?.marginPerformance || "أداء هامش الربح"}
                    </span>
                    <span className="text-sm text-gray-600">{result.profitMargin.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(result.profitMargin, 100)} className="h-3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Runway Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Clock className="h-8 w-8 text-indigo-600" />
            {t.step8FinalOutputs?.runway?.title || "⏰ تحليل المسار المالي"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Runway Display */}
            <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border-2 border-indigo-200">
              <h3 className="font-bold text-gray-800 mb-4 text-xl">
                {t.step8FinalOutputs?.runway?.financialSurvival || "فترة البقاء المالي"}
              </h3>
              {Number.isFinite(runway.months) ? (
                <div>
                  <p className="text-4xl font-bold text-indigo-800 mb-2">
                    {runway.months.toFixed(1)} {t.step8FinalOutputs?.runway?.months || "شهر"}
                  </p>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      runway.months > 12
                        ? "bg-green-100 text-green-800"
                        : runway.months > 6
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {runway.months > 12
                      ? t.step8FinalOutputs?.runway?.safe || "✅ وضع آمن"
                      : runway.months > 6
                        ? t.step8FinalOutputs?.runway?.needsMonitoring || "⚠️ يحتاج إلى مراقبة"
                        : t.step8FinalOutputs?.runway?.critical || "🚨 وضع حرج"}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-4xl font-bold text-green-800 mb-2">
                    {t.step8FinalOutputs?.runway?.sustainable || "مستدام"}
                  </p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    {t.step8FinalOutputs?.runway?.profitableSustainable || "✅ العمل مربح ومستدام"}
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {t.step8FinalOutputs?.runway?.availableCapital || "رأس المال المتاح"}
                </h4>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(runway.cash, "EGP", "ar")}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {t.step8FinalOutputs?.runway?.availableCash || "النقد المتاح للعمليات"}
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {t.step8FinalOutputs?.runway?.monthlyBurnRate || "معدل الحرق الشهري"}
                </h4>
                <p className="text-lg font-bold text-red-600">
                  {runway.loss > 0
                    ? formatCurrency(runway.loss, "EGP", "ar")
                    : t.step8FinalOutputs?.runway?.noBurn || "لا يوجد حرق"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {runway.loss > 0
                    ? t.step8FinalOutputs?.runway?.monthlyLoss || "كم تخسر من المال كل شهر"
                    : t.step8FinalOutputs?.runway?.profitableNoBurn || "العمل مربح - لا خسائر"}
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {t.step8FinalOutputs?.runway?.netCashFlow || "صافي التدفق النقدي"}
                </h4>
                <p
                  className={`text-xl font-bold ${portfolioTotals.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(portfolioTotals.totalProfit, "EGP", "ar")}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {t.step8FinalOutputs?.runway?.revenueMinusCosts || "الإيرادات - إجمالي التكاليف"}
                </p>
              </div>
            </div>

            {/* Runway Formula Explanation */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">
                {t.step8FinalOutputs?.runway?.calculationFormula || "صيغة الحساب"}
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                {Number.isFinite(runway.months) ? (
                  <div>
                    <p>
                      <strong>
                        {t.step8FinalOutputs?.runway?.runwayFormula || "المسار = رأس المال المتاح ÷ معدل الحرق الشهري"}
                      </strong>
                    </p>
                    <p>
                      = {formatCurrency(runway.cash, "EGP", "ar")} ÷ {formatCurrency(runway.loss, "EGP", "ar")} ={" "}
                      {runway.months.toFixed(1)} {t.step8FinalOutputs?.runway?.months || "شهر"}
                    </p>
                  </div>
                ) : (
                  <p>
                    <strong>{t.step8FinalOutputs?.runway?.profitableBusiness || "عمل مربح:"}:</strong>{" "}
                    {t.step8FinalOutputs?.runway?.revenueCoversAllCosts ||
                      "الإيرادات تغطي جميع التكاليف بالكامل (المسار = ∞)"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LTV & CAC Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Heart className="h-8 w-8 text-pink-600" />
            {t.step8FinalOutputs?.ltvCac?.title || "💝 تحليل قيمة العميل الدائمة (LTV) وتكلفة اكتساب العميل (CAC)"}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {t.step8FinalOutputs?.ltvCac?.subtitle || "كم من المال يجلب العميل على المدى الطويل وكم يكلف لجذبه"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(() => {
              // Calculate portfolio-level LTV and CAC from Step 4 data
              const productLtvCac = localData.productLtvCac || {}

              let totalLtv = 0
              let totalCac = 0
              let totalNewCustomers = 0
              let totalMarketingCost = 0
              let validProducts = 0

              // Aggregate LTV/CAC from all products (Step 4 data)
              localData.products.forEach((product: any) => {
                const pd = productLtvCac[product.id] || {}
                const monthlyNewCustomers = Number(pd.monthlyNewCustomers) || 0
                const customerChurnRate = Number(pd.customerChurnRate) || 0
                const avgOrderValue = Number(pd.avgOrderValue) || 0
                const purchaseFrequency = Number(pd.purchaseFrequency) || 0
                const grossMarginPercent = Number(pd.grossMarginPercent ?? 30)
                const pdMarketing = Number(pd.monthlyMarketingCost) || 0

                if (monthlyNewCustomers > 0 && customerChurnRate > 0) {
                  const monthlyRevenue = avgOrderValue * purchaseFrequency
                  const monthlyGrossProfit = monthlyRevenue * (grossMarginPercent / 100)
                  const customerLifetimeMonths = 100 / customerChurnRate
                  const productLtv = monthlyGrossProfit * customerLifetimeMonths
                  const productCac = pdMarketing / monthlyNewCustomers

                  totalLtv += productLtv * monthlyNewCustomers // Weight by customer volume
                  totalCac += productCac * monthlyNewCustomers // Weight by customer volume
                  totalNewCustomers += monthlyNewCustomers
                  totalMarketingCost += pdMarketing
                  validProducts++
                }
              })

              // Calculate weighted averages
              const avgLtv = totalNewCustomers > 0 ? totalLtv / totalNewCustomers : 0
              const avgCac = totalNewCustomers > 0 ? totalCac / totalNewCustomers : 0
              const ltvCacRatio = avgCac > 0 ? avgLtv / avgCac : 0

              // Calculate average customer lifetime for display
              let avgCustomerLifetime = 0
              if (validProducts > 0) {
                let totalLifetime = 0
                localData.products.forEach((product: any) => {
                  const pd = productLtvCac[product.id] || {}
                  const customerChurnRate = Number(pd.customerChurnRate) || 0
                  if (customerChurnRate > 0) {
                    totalLifetime += 100 / customerChurnRate
                  }
                })
                avgCustomerLifetime = totalLifetime / validProducts
              }

              return (
                <>
                  {/* Main LTV/CAC Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl border-2 border-pink-200">
                      <Heart className="h-12 w-12 mx-auto mb-3 text-pink-600" />
                      <h3 className="font-bold text-gray-800 mb-2 text-xl">
                        {t.step8FinalOutputs?.ltvCac?.ltvTitle || "قيمة العميل الدائمة (LTV)"}
                      </h3>
                      <p className="text-3xl font-bold text-pink-600 mb-2">{formatCurrency(avgLtv, "EGP", "ar")}</p>
                      <p className="text-sm text-gray-600">
                        {t.step8FinalOutputs?.ltvCac?.ltvDescription || "كم من المال يجلب العميل طوال علاقته بك"}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl border-2 border-orange-200">
                      <UserPlus className="h-12 w-12 mx-auto mb-3 text-orange-600" />
                      <h3 className="font-bold text-gray-800 mb-2 text-xl">
                        {t.step8FinalOutputs?.ltvCac?.cacTitle || "تكلفة اكتساب العميل (CAC)"}
                      </h3>
                      <p className="text-3xl font-bold text-orange-600 mb-2">{formatCurrency(avgCac, "EGP", "ar")}</p>
                      <p className="text-sm text-gray-600">
                        {t.step8FinalOutputs?.ltvCac?.cacDescription || "كم تنفق لاكتساب عميل جديد"}
                      </p>
                    </div>
                  </div>

                  {/* LTV/CAC Ratio Analysis */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border-2 border-blue-200">
                    <h3 className="font-bold text-gray-800 mb-4 text-xl">
                      {t.step8FinalOutputs?.ltvCac?.ratioTitle || "نسبة LTV/CAC"}
                    </h3>
                    {avgCac > 0 ? (
                      <div>
                        <p className="text-4xl font-bold text-blue-600 mb-2">{ltvCacRatio.toFixed(1)}x</p>
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                            ltvCacRatio >= 3
                              ? "bg-green-100 text-green-800"
                              : ltvCacRatio >= 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ltvCacRatio >= 3
                            ? t.step8FinalOutputs?.ltvCac?.excellent || "✅ ممتاز (≥3x)"
                            : ltvCacRatio >= 2
                              ? t.step8FinalOutputs?.ltvCac?.acceptable || "⚠️ مقبول (2-3x)"
                              : t.step8FinalOutputs?.ltvCac?.weak || "🚨 ضعيف (<2x)"}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {(
                            t.step8FinalOutputs?.ltvCac?.returnDescription ||
                            "كل جنيه يتم إنفاقه على اكتساب العملاء يعود {ratio} جنيهات"
                          ).replace("{ratio}", ltvCacRatio.toFixed(1))}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl font-bold text-gray-600 mb-2">
                          {t.step8FinalOutputs?.ltvCac?.undefined || "غير محدد"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t.step8FinalOutputs?.ltvCac?.enterCacToCalculate || "أدخل تكلفة اكتساب العميل لحساب النسبة"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.step8FinalOutputs?.ltvCac?.totalNewCustomers || "إجمالي العملاء الجدد شهريًا"}
                      </h4>
                      <p className="text-lg font-bold text-green-600">{totalNewCustomers}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {t.step8FinalOutputs?.ltvCac?.allNewCustomers || "جميع العملاء الجدد من جميع المنتجات"}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.step8FinalOutputs?.ltvCac?.customerLifetime || "مدة بقاء العميل (بالأشهر)"}
                      </h4>
                      <p className="text-lg font-bold text-blue-600">
                        {avgCustomerLifetime.toFixed(1)} {t.step8FinalOutputs?.ltvCac?.months || "شهر"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {t.step8FinalOutputs?.ltvCac?.howLongCustomerStays || "كم من الوقت يبقى العميل معك"}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.step8FinalOutputs?.ltvCac?.totalMarketingCost || "إجمالي تكلفة التسويق"}
                      </h4>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(totalMarketingCost, "EGP", "ar")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {t.step8FinalOutputs?.ltvCac?.monthlyMarketingSpend || "كل ما تنفقه على التسويق شهريًا"}
                      </p>
                    </div>
                  </div>

                  {/* Formula Explanation */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t.step8FinalOutputs?.ltvCac?.formulaExplanation || "شرح الصيغة"}
                    </h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p>
                            <strong>
                              {t.step8FinalOutputs?.ltvCac?.ltvFormula?.title || "LTV (قيمة العميل الدائمة):"}
                            </strong>
                          </p>
                          <p>
                            {t.step8FinalOutputs?.ltvCac?.ltvFormula?.formula ||
                              "= متوسط الربح الشهري للعميل × مدة بقاء العميل بالأشهر"}
                          </p>
                          <p>
                            = {formatCurrency(avgLtv, "EGP", "ar")} (
                            {t.step8FinalOutputs?.ltvCac?.ltvFormula?.calculatedFrom || "محسوبة من بيانات المنتج"})
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>
                              {t.step8FinalOutputs?.ltvCac?.cacFormula?.title || "CAC (تكلفة اكتساب العميل):"}
                            </strong>
                          </p>
                          <p>
                            {t.step8FinalOutputs?.ltvCac?.cacFormula?.formula ||
                              "= تكلفة التسويق الشهرية ÷ العملاء الجدد شهريًا"}
                          </p>
                          <p>
                            = {formatCurrency(totalMarketingCost, "EGP", "ar")} ÷ {totalNewCustomers} ={" "}
                            {formatCurrency(avgCac, "EGP", "ar")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms Explanation */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">
                      {t.step8FinalOutputs?.ltvCac?.termsExplanation || "شرح المصطلحات بلغة بسيطة"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>{t.step8FinalOutputs?.ltvCac?.ltvSimple?.title || "LTV (القيمة الدائمة):"}</strong>
                        </p>
                        <p className="text-gray-700">
                          {t.step8FinalOutputs?.ltvCac?.ltvSimple?.explanation ||
                            "كم من المال يجلب العميل الواحد من أول عملية شراء حتى يغادر. إذا اشترى العميل 100 جنيه شهريًا لمدة عام، فإن قيمة LTV الخاصة به هي 1200 جنيه."}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>{t.step8FinalOutputs?.ltvCac?.cacSimple?.title || "CAC (تكلفة الاكتساب):"}</strong>
                        </p>
                        <p className="text-gray-700">
                          {t.step8FinalOutputs?.ltvCac?.cacSimple?.explanation ||
                            "كم تنفق للحصول على عميل جديد واحد. إذا أنفقت 1000 جنيه على الإعلانات وحصلت على 10 عملاء، فإن CAC = 100 جنيه لكل عميل."}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>{t.step8FinalOutputs?.ltvCac?.ratioSimple?.title || "نسبة LTV/CAC:"}</strong>
                        </p>
                        <p className="text-gray-700">
                          {t.step8FinalOutputs?.ltvCac?.ratioSimple?.explanation ||
                            "تقيس عدد المرات التي يعود فيها العميل ما أنفقته عليه. نسبة 3x تعني أن كل جنيه يتم إنفاقه على اكتساب العملاء يعود 3 جنيهات ربح."}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>
                            {t.step8FinalOutputs?.ltvCac?.acceptableStandards?.title || "المعايير المقبولة:"}
                          </strong>
                        </p>
                        <p className="text-gray-700">
                          {t.step8FinalOutputs?.ltvCac?.acceptableStandards?.explanation ||
                            "النسبة المثالية ≥3x. إذا كانت أقل من 2x، فإن التسويق مكلف للغاية. إذا كانت أعلى من 5x، يمكنك زيادة الإنفاق التسويقي."}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Financial Metrics - Only Unique Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Activity className="h-8 w-8 text-purple-600" />
            {t.step8FinalOutputs?.additionalMetrics?.title || "المقاييس المالية الإضافية"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Contribution Margin & Break-even */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <Zap className="h-12 w-12 mx-auto mb-3 text-purple-600" />
                <h4 className="font-bold text-gray-800 mb-2">
                  {t.step8FinalOutputs?.additionalMetrics?.totalContributionMargin || "إجمالي هامش المساهمة"}
                </h4>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    productFinancials.reduce((acc, p) => acc + p.contributionMargin * p.monthlyQuantity, 0),
                    "EGP",
                    "ar",
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {t.step8FinalOutputs?.additionalMetrics?.revenueMinusVariable || "الإيرادات - التكاليف المتغيرة"}
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <Target className="h-12 w-12 mx-auto mb-3 text-yellow-600" />
                <h4 className="font-bold text-gray-800 mb-2">
                  {t.step8FinalOutputs?.additionalMetrics?.breakEvenPoint || "نقطة التعادل"}
                </h4>
                <p className="text-2xl font-bold text-yellow-800">
                  {breakEven.units.toFixed(0)} {t.step8FinalOutputs?.additionalMetrics?.units || "وحدة"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t.step8FinalOutputs?.additionalMetrics?.avgContributionMargin || "متوسط هامش المساهمة:"}{" "}
                  {formatCurrency(breakEven.weightedAvgContribution, "EGP", "ar")}
                </p>
                {breakEven.unitsGap > 0 && (
                  <p className="text-sm text-gray-700 mt-1">
                    {t.step8FinalOutputs?.additionalMetrics?.salesIncreaseNeeded || "زيادة المبيعات المطلوبة:"}{" "}
                    <strong>
                      {breakEven.unitsGap.toFixed(0)} {t.step8FinalOutputs?.additionalMetrics?.units || "units"}
                    </strong>{" "}
                    {t.step8FinalOutputs?.additionalMetrics?.toReachBreakEven || "للوصول إلى نقطة التعادل"}
                  </p>
                )}
              </div>
            </div>

            {/* Cost Ratios */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4 text-center">
                {t.step8FinalOutputs?.additionalMetrics?.costRatios || "نسب التكلفة"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">
                    {t.step8FinalOutputs?.additionalMetrics?.variableCostRatio || "نسبة التكلفة المتغيرة"}
                  </h5>
                  <p className="text-2xl font-bold text-green-900">
                    {portfolioTotals.totalRevenue > 0
                      ? ((portfolioTotals.totalVariableCosts / portfolioTotals.totalRevenue) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.step8FinalOutputs?.additionalMetrics?.ofTotalRevenue || "من إجمالي الإيرادات"}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-800 mb-2">
                    {t.step8FinalOutputs?.additionalMetrics?.fixedCostRatio || "نسبة التكلفة الثابتة"}
                  </h5>
                  <p className="text-2xl font-bold text-orange-900">
                    {portfolioTotals.totalRevenue > 0
                      ? ((portfolioTotals.totalFixedCosts / portfolioTotals.totalRevenue) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.step8FinalOutputs?.additionalMetrics?.ofTotalRevenue || "من إجمالي الإيرادات"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Lightbulb className="h-8 w-8 text-yellow-600" />
            {tKey(language, "step8FinalOutputs.recommendations.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.type === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : rec.type === "success"
                        ? "bg-green-50 border-green-400"
                        : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {rec.type === "warning" ? (
                      <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                    ) : rec.type === "success" ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    ) : (
                      <Eye className="h-6 w-6 text-blue-600 mt-1" />
                    )}
                    <div>
                      <h4 className="font-bold text-gray-800">{rec.title}</h4>
                      <p className="text-gray-700 mb-2">{rec.description}</p>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>{tKey(language, "step8FinalOutputs.recommendations.suggestedAction")}:</strong>{" "}
                        {rec.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {tKey(language, "step8FinalOutputs.recommendations.noIssues.title")}
                </h3>
                <p className="text-gray-600">
                  {tKey(language, "step8FinalOutputs.recommendations.noIssues.description")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Items & Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <FileText className="h-8 w-8 text-indigo-600" />
            {t.step8FinalOutputs?.nextSteps?.title || "📋 الخطوات التالية والإجراءات المطلوبة"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {t.step8FinalOutputs?.nextSteps?.immediateActions || "إجراءات فورية"}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>
                      {t.step8FinalOutputs?.nextSteps?.applyCalculatedPrices || "تطبيق الأسعار المحسوبة على المنتجات"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>
                      {t.step8FinalOutputs?.nextSteps?.monitorCustomerReactions ||
                        "مراقبة ردود أفعال العملاء تجاه الأسعار الجديدة"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>
                      {t.step8FinalOutputs?.nextSteps?.trackActualSalesAndProfits || "تتبع المبيعات والأرباح الفعلية"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  {t.step8FinalOutputs?.nextSteps?.mediumTermPlans || "خطط متوسطة الأجل"}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span>
                      {t.step8FinalOutputs?.nextSteps?.regularPriceReview || "مراجعة الأسعار بانتظام (كل 3-6 أشهر)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span>
                      {t.step8FinalOutputs?.nextSteps?.analyzeCompetitorsAndAdjust ||
                        "تحليل أداء المنافسين وتعديل الاستراتيجية"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span>{t.step8FinalOutputs?.nextSteps?.developNewOffers || "تطوير عروض جديدة وحزم منتجات"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Share Options */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-blue-800">
            <Share2 className="h-8 w-8" />
            {t.step8FinalOutputs?.exportShare?.title || "📤 تصدير ومشاركة التقرير"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={handlePDFExport} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3">
              <Download className="h-5 w-5 mr-2" />
              {t.step8FinalOutputs?.exportShare?.exportPdf || "تصدير PDF"}
            </Button>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 bg-transparent"
            >
              <FileText className="h-5 w-5 mr-2" />
              {t.step8FinalOutputs?.exportShare?.exportExcel || "تصدير Excel"}
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 bg-transparent"
            >
              <Share2 className="h-5 w-5 mr-2" />
              {t.step8FinalOutputs?.exportShare?.shareReport || "مشاركة التقرير"}
            </Button>
          </div>
          <p className="text-center text-gray-600 text-sm mt-4">
            {t.step8FinalOutputs?.exportShare?.description || "يمكنك تصدير هذا التقرير ومشاركته مع فريقك أو المستثمرين"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
