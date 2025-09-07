"use client"

import { Card } from "@/components/ui/card"
import {
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  AlertTriangle,
  Calculator,
  PieChart,
  Activity,
  Zap,
  Shield,
  Award,
} from "lucide-react"
import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"
import {
  calcCMu,
  calcCMR,
  calcBEUnits,
  calcBERevenue,
  calcProfitMarginOnCost,
  calcTotalProfitMarginOnCost,
  formatCurrency as formatCurrencyGlobal,
} from "@/lib/calculations"
import { useMemo } from "react"
import { SaveExporter } from "../../lib/save-export"
import { generateComprehensivePDF } from "../../lib/pdf-export-comprehensive"
import { KayanCSVGenerator } from "../../lib/csv-generator"

interface Step12Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

interface FinancialResult {
  productId: string
  productName: string
  projectedUnits: number
  finalPrice: number
  totalRevenue: number
  variableCostPerUnit: number
  totalVariableCosts: number
  productFixedCosts: number
  totalCosts: number
  grossProfit: number
  profitMargin: number
  contributionMargin: number
  contributionRatio: number
  breakevenUnits: number
  breakevenRevenue: number
  breakevenAchievementRatio: number
  fullCostPerUnit: number
}

export function Step12Results({ data, onDataChange, errors, language }: Step12Props) {
  const calculateResults = (): FinancialResult[] => {
    const reportDays = data.reportPeriodDays || 30

    return data.products.map((product: any) => {
      const dailyUnits = product.qty / (product.periodDays || 30)
      const projectedUnits = dailyUnits * reportDays

      const variableCostPerUnit = (data.variableCosts?.[product.id] || []).reduce(
        (sum: number, cost: any) => sum + (cost.costPerUnit || 0),
        0,
      )

      const finalPrice = data.strategies?.finalPrices?.[product.id]?.price || 0
      const totalRevenue = projectedUnits * finalPrice
      const totalVariableCosts = projectedUnits * variableCostPerUnit

      const productFixedCosts = product.allocatedFixedCost || 0
      const totalCosts = totalVariableCosts + productFixedCosts
      const grossProfit = totalRevenue - totalCosts

      const fixedCostPerUnit = projectedUnits > 0 ? productFixedCosts / projectedUnits : 0
      const netProfit = grossProfit
      const profitMargin = calcProfitMarginOnCost(netProfit, totalCosts)

      // Results Page Margin Debug - removed for production

      // Fixed Cost Debug - removed for production

      const contributionMarginPerUnit = calcCMu(finalPrice, variableCostPerUnit)
      const contributionMarginRatio = calcCMR(finalPrice, variableCostPerUnit)

      const breakevenUnits = calcBEUnits(productFixedCosts, finalPrice, variableCostPerUnit)
      const breakevenRevenue = calcBERevenue(productFixedCosts, finalPrice, variableCostPerUnit)

      let breakevenAchievementRatio = 0
      if (productFixedCosts <= 0) {
        breakevenAchievementRatio = 999
      } else if (isFinite(breakevenUnits) && breakevenUnits > 0) {
        breakevenAchievementRatio = projectedUnits > 0 ? (projectedUnits / breakevenUnits) * 100 : 0
      } else if (contributionMarginPerUnit <= 0) {
        breakevenAchievementRatio = 0
      }

      return {
        productId: product.id,
        productName: product.name,
        projectedUnits: Math.round(projectedUnits),
        finalPrice,
        totalRevenue,
        variableCostPerUnit,
        totalVariableCosts,
        productFixedCosts,
        totalCosts,
        grossProfit,
        profitMargin: Number(profitMargin.toFixed(1)), // Ensure consistent 1-decimal rounding
        contributionMargin: contributionMarginPerUnit,
        contributionRatio: contributionMarginRatio,
        breakevenUnits: Math.round(breakevenUnits),
        breakevenRevenue,
        breakevenAchievementRatio,
        fullCostPerUnit: variableCostPerUnit + fixedCostPerUnit,
      }
    })
  }

  const results = calculateResults()
  const portfolioSummary = useMemo(() => {
    const totalRevenue = results.reduce((sum, r) => sum + r.totalRevenue, 0)
    const totalCosts = results.reduce((sum, r) => sum + r.totalCosts, 0)
    const totalProfit = totalRevenue - totalCosts

    const overallMargin = calcTotalProfitMarginOnCost(totalRevenue, totalCosts)

    // Portfolio Margin Debug - removed for production

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      overallMargin: Number(overallMargin.toFixed(1)), // Ensure consistent 1-decimal rounding
      productCount: results.length,
      reportPeriod: data.reportPeriodDays || 30,
      avgUnitsPerProduct: results.reduce((sum, r) => sum + r.projectedUnits, 0) / results.length,
      totalUnits: results.reduce((sum, r) => sum + r.projectedUnits, 0),
    }
  }, [results, data.reportPeriodDays])

  const totalRevenue = portfolioSummary.totalRevenue
  const totalCosts = portfolioSummary.totalCosts
  const totalProfit = portfolioSummary.totalProfit
  const overallMargin = portfolioSummary.overallMargin

  const contributionMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0

  // Operating Leverage calculation
  const operatingLeverage = contributionMargin > 0 && overallMargin > 0 ? contributionMargin / overallMargin : 0

  // Payback Period (in units)
  const totalContributionPerUnit =
    results.reduce((sum, r) => sum + r.contributionMargin * r.projectedUnits, 0) /
    results.reduce((sum, r) => sum + r.projectedUnits, 0)
  const paybackUnits = totalContributionPerUnit > 0 ? totalCosts / totalContributionPerUnit : 0

  const formatCurrency = (amount: number) => {
    return formatCurrencyGlobal(amount, data.currency || "EGP", language)
  }

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000000) {
      return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }).format(num)
    }
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
      maximumFractionDigits: 0,
    }).format(num)
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 25) return "text-green-600"
    if (margin >= 15) return "text-yellow-600"
    if (margin >= 5) return "text-orange-600"
    return "text-red-600"
  }

  const getCompetitorPositioning = (product: any, finalPrice: number) => {
    if (!product.competitors?.hasData || !product.competitors.min || !product.competitors.max) {
      return null
    }

    const { min, max } = product.competitors
    let positioning = ""
    let badgeColor = ""

    if (finalPrice < min) {
      positioning = language === "ar" ? "أقل من السوق" : "Below market"
      badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-300"
    } else if (finalPrice > max) {
      positioning = language === "ar" ? "أعلى من السوق" : "Above market"
      badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-300"
    } else {
      positioning = language === "ar" ? "داخل السوق" : "Inside market"
      badgeColor = "bg-green-100 text-green-800 border-green-300"
    }

    return { positioning, badgeColor, min, max, currency: product.competitors.currency || data.currency }
  }

  // Calculate scenarios (Best/Base/Worst)
  const calculateScenarios = () => {
    const baseCase = {
      totalUnits: results.reduce((sum, r) => sum + r.projectedUnits, 0),
      totalRevenue,
      totalCosts,
      netProfit: totalProfit,
      breakeven: paybackUnits,
    }

    const bestCase = {
      totalUnits: Math.round(baseCase.totalUnits * 1.2),
      totalRevenue: totalRevenue * 1.2,
      totalCosts: totalCosts * 1.2,
      netProfit: totalRevenue * 1.2 - totalCosts * 1.2,
      breakeven: paybackUnits * 0.83,
    }

    const worstCase = {
      totalUnits: Math.round(baseCase.totalUnits * 0.7),
      totalRevenue: totalRevenue * 0.7,
      totalCosts: totalCosts * 0.7,
      netProfit: totalRevenue * 0.7 - totalCosts * 0.7,
      breakeven: paybackUnits * 1.43,
    }

    return { bestCase, baseCase, worstCase }
  }

  const scenarios = calculateScenarios()

  // Risk indicators
  const getRiskIndicators = () => {
    const risks = []

    // Check if one product dominates profit
    const profitContributions = results
      .map((r) => ({
        name: r.productName,
        contribution: (r.grossProfit / totalProfit) * 100,
      }))
      .filter((r) => r.contribution > 60)

    if (profitContributions.length > 0) {
      risks.push({
        type: "concentration",
        message:
          language === "ar"
            ? `منتج ${profitContributions[0].name} يمثل ${profitContributions[0].contribution.toFixed(0)}% من الربح - مخاطر تركيز عالية`
            : `Product ${profitContributions[0].name} represents ${profitContributions[0].contribution.toFixed(0)}% of profit - high concentration risk`,
      })
    }

    // Check breakeven vs demand
    results.forEach((r) => {
      if (r.breakevenUnits > r.projectedUnits && r.breakevenUnits < Number.POSITIVE_INFINITY) {
        risks.push({
          type: "breakeven",
          message:
            language === "ar"
              ? `منتج ${r.productName}: نقطة التعادل (${formatNumber(r.breakevenUnits)}) أعلى من الطلب المتوقع (${formatNumber(r.projectedUnits)})`
              : `Product ${r.productName}: Breakeven (${formatNumber(r.breakevenUnits)}) higher than expected demand (${formatNumber(r.projectedUnits)})`,
        })
      }
    })

    // Stress test -30%
    const stressRevenue = totalRevenue * 0.7
    const stressCosts = totalCosts * 0.7
    const stressProfit = stressRevenue - stressCosts

    if (stressProfit < 0) {
      risks.push({
        type: "stress",
        message:
          language === "ar"
            ? `اختبار الضغط: انخفاض المبيعات 30% يؤدي لخسارة ${formatCurrency(Math.abs(stressProfit))}`
            : `Stress test: 30% sales drop leads to loss of ${formatCurrency(Math.abs(stressProfit))}`,
      })
    }

    return risks
  }

  const riskIndicators = getRiskIndicators()

  // Smart recommendations
  const getSmartRecommendations = () => {
    const recommendations = []

    results.forEach((result) => {
      // Pricing recommendations
      if (result.profitMargin < 15) {
        const newPrice = result.finalPrice * 1.05
        const newMargin = calcProfitMarginOnCost(newPrice * result.projectedUnits, result.totalCosts)
        recommendations.push({
          type: "pricing",
          message:
            language === "ar"
              ? `رفع سعر ${result.productName} بنسبة 5% يرفع الهامش من ${result.profitMargin.toFixed(1)}% إلى ${newMargin.toFixed(1)}%`
              : `Raising ${result.productName} price by 5% increases margin from ${result.profitMargin.toFixed(1)}% to ${newMargin.toFixed(1)}%`,
        })
      }

      // Volume recommendations
      if (result.contributionMargin > 0 && result.projectedUnits < result.breakevenUnits) {
        const additionalUnits = result.breakevenUnits - result.projectedUnits
        recommendations.push({
          type: "volume",
          message:
            language === "ar"
              ? `زيادة مبيعات ${result.productName} بـ ${formatNumber(additionalUnits)} وحدة تحقق التعادل`
              : `Increasing ${result.productName} sales by ${formatNumber(additionalUnits)} units achieves breakeven`,
        })
      }

      // Cost reduction recommendations
      if (result.variableCostPerUnit > 0) {
        const costReduction = result.variableCostPerUnit * 0.1
        const profitIncrease = costReduction * result.projectedUnits
        recommendations.push({
          type: "cost",
          message:
            language === "ar"
              ? `خفض التكلفة المتغيرة لـ ${result.productName} بنسبة 10% يزيد الأرباح بـ ${formatCurrency(profitIncrease)}`
              : `Reducing ${result.productName} variable cost by 10% increases profits by ${formatCurrency(profitIncrease)}`,
        })
      }
    })

    // Product mix recommendations
    const highMarginProducts = results.filter((r) => r.profitMargin > 20)
    const lowMarginProducts = results.filter((r) => r.profitMargin < 10)

    if (highMarginProducts.length > 0 && lowMarginProducts.length > 0) {
      recommendations.push({
        type: "mix",
        message:
          language === "ar"
            ? `إعادة توجيه المبيعات نحو المنتجات عالية الهامش (${highMarginProducts.map((p) => p.productName).join(", ")}) يحسن الربحية`
            : `Redirecting sales toward high-margin products (${highMarginProducts.map((p) => p.productName).join(", ")}) improves profitability`,
      })
    }

    return recommendations.slice(0, 4) // Limit to 4 recommendations
  }

  const smartRecommendations = getSmartRecommendations()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t(language, "results.title")}</h2>
        <p className="text-lg text-gray-600">{t(language, "results.subtitle")}</p>
      </div>

      {/* 1) Expanded KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90 mb-1">
                {language === "ar" ? "إجمالي المبيعات المتوقعة" : "Total Expected Sales"}
              </p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs opacity-75">{language === "ar" ? "الحالة الأساسية" : "Base Case"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90 mb-1">{language === "ar" ? "إجمالي التكاليف" : "Total Costs"}</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCosts)}</p>
              <p className="text-xs opacity-75">{language === "ar" ? "ثابتة + متغيرة" : "Fixed + Variable"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90 mb-1">{language === "ar" ? "صافي الربح" : "Net Profit"}</p>
              <p className={`text-2xl font-bold ${totalProfit < 0 ? "text-red-200" : ""}`}>
                {formatCurrency(totalProfit)}
              </p>
              <p className="text-xs opacity-75">{language === "ar" ? "الحالة الأساسية" : "Base Case"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90 mb-1">{t(language, "results.profitMarginOnCost")}</p>
              <p className="text-2xl font-bold">{overallMargin.toFixed(1)}%</p>
              <p className="text-xs opacity-75">{language === "ar" ? "الحالة الأساسية" : "Base Case"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90 mb-1">
                {language === "ar" ? "هامش المساهمة %" : "Contribution Margin %"}
              </p>
              <p className="text-2xl font-bold">{contributionMargin.toFixed(1)}%</p>
              <p className="text-xs opacity-75">
                {language === "ar" ? "المبيعات - التكاليف المتغيرة" : "Sales - Variable Costs"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90 mb-1">
                {language === "ar" ? "الرافعة التشغيلية" : "Operating Leverage"}
              </p>
              <p className="text-2xl font-bold">{operatingLeverage.toFixed(1)}x</p>
              <p className="text-xs opacity-75">
                {language === "ar" ? "تأثير زيادة المبيعات" : "Sales Increase Impact"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 2) Product Results Section */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          {language === "ar" ? "تفاصيل المنتجات" : "Product Details"}
        </h3>

        <div className="space-y-6">
          {results.map((result) => {
            const product = data.products.find((p) => p.id === result.productId)
            const competitorInfo = getCompetitorPositioning(product, result.finalPrice)

            return (
              <div key={result.productId} className="bg-gray-50 p-6 rounded-lg border">
                {/* Product Header with Suggested Price as Main Element */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">{result.productName}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {language === "ar" ? "هامش الربح على التكلفة:" : "Profit Margin on Cost:"}
                      </span>
                      <span className={`font-semibold ${getMarginColor(result.profitMargin)}`}>
                        {result.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Suggested Price - Most Prominent Element */}
                  <div className="bg-blue-600 text-white p-4 rounded-lg text-center min-w-[200px]">
                    <p className="text-sm opacity-90 mb-1">{language === "ar" ? "السعر المقترح" : "Suggested Price"}</p>
                    <p className="text-3xl font-bold">{formatCurrency(result.finalPrice)}</p>
                  </div>
                </div>

                {/* Competitor Positioning */}
                {competitorInfo && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          {language === "ar" ? "نطاق المنافسين:" : "Competitor Range:"}
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {competitorInfo.min.toFixed(2)} – {competitorInfo.max.toFixed(2)} {competitorInfo.currency}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${competitorInfo.badgeColor}`}
                      >
                        {competitorInfo.positioning}
                      </span>
                    </div>
                  </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "التكلفة المتغيرة/وحدة" : "Variable Cost/Unit"}
                    </p>
                    <p className="font-semibold">{formatCurrency(result.variableCostPerUnit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "نصيب التكاليف الثابتة" : "Fixed Cost Share"}
                    </p>
                    <p className="font-semibold">
                      {formatCurrency(result.productFixedCosts / Math.max(1, result.projectedUnits))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === "ar" ? "هامش المساهمة/وحدة" : "Contribution Margin/Unit"}
                    </p>
                    <p className="font-semibold text-green-600">{formatCurrency(result.contributionMargin)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t(language, "results.profitMarginOnCost")}</p>
                    <p className={`font-semibold ${getMarginColor(result.profitMargin)}`}>
                      {result.profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Scenarios Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-gray-700">
                          {language === "ar" ? "السيناريو" : "Scenario"}
                        </th>
                        <th className="text-right py-2 font-medium text-gray-700">
                          {language === "ar" ? "عدد الوحدات" : "Units"}
                        </th>
                        <th className="text-right py-2 font-medium text-gray-700">
                          {language === "ar" ? "المبيعات" : "Sales"}
                        </th>
                        <th className="text-right py-2 font-medium text-gray-700">
                          {language === "ar" ? "التكاليف" : "Costs"}
                        </th>
                        <th className="text-right py-2 font-medium text-gray-700">
                          {language === "ar" ? "صافي الربح" : "Net Profit"}
                        </th>
                        <th className="text-right py-2 font-medium text-gray-700">
                          {t(language, "results.profitMarginOnCost")}
                        </th>
                        <th className="text-right py-2 font-medium text-gray-700">
                          {language === "ar" ? "نقطة التعادل" : "Breakeven"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-green-50">
                        <td className="py-2 font-medium text-green-800">
                          {language === "ar" ? "أفضل حالة" : "Best Case"}
                        </td>
                        <td className="text-right py-2">{formatNumber(Math.round(result.projectedUnits * 1.2))}</td>
                        <td className="text-right py-2">{formatCurrency(result.totalRevenue * 1.2)}</td>
                        <td className="text-right py-2">{formatCurrency(result.totalCosts * 1.2)}</td>
                        <td className="text-right py-2 text-green-600 font-semibold">
                          {formatCurrency(result.totalRevenue * 1.2 - result.totalCosts * 1.2)}
                        </td>
                        <td className="text-right py-2 text-green-600 font-semibold">
                          {calcProfitMarginOnCost(result.totalRevenue * 1.2, result.totalCosts * 1.2).toFixed(1)}%
                        </td>
                        <td className="text-right py-2">{formatNumber(result.breakevenUnits)}</td>
                      </tr>
                      <tr className="border-b bg-blue-50">
                        <td className="py-2 font-medium text-blue-800">
                          {language === "ar" ? "الحالة الأساسية" : "Base Case"}
                        </td>
                        <td className="text-right py-2">{formatNumber(result.projectedUnits)}</td>
                        <td className="text-right py-2">{formatCurrency(result.totalRevenue)}</td>
                        <td className="text-right py-2">{formatCurrency(result.totalCosts)}</td>
                        <td className="text-right py-2 font-semibold">{formatCurrency(result.grossProfit)}</td>
                        <td className="text-right py-2 font-semibold">{result.profitMargin.toFixed(1)}%</td>
                        <td className="text-right py-2">{formatNumber(result.breakevenUnits)}</td>
                      </tr>
                      <tr className="border-b bg-red-50">
                        <td className="py-2 font-medium text-red-800">
                          {language === "ar" ? "أسوأ حالة" : "Worst Case"}
                        </td>
                        <td className="text-right py-2">{formatNumber(Math.round(result.projectedUnits * 0.7))}</td>
                        <td className="text-right py-2">{formatCurrency(result.totalRevenue * 0.7)}</td>
                        <td className="text-right py-2">{formatCurrency(result.totalCosts * 0.7)}</td>
                        <td className="text-right py-2 text-red-600 font-semibold">
                          {formatCurrency(result.totalRevenue * 0.7 - result.totalCosts * 0.7)}
                        </td>
                        <td className="text-right py-2 text-red-600 font-semibold">
                          {calcProfitMarginOnCost(result.totalRevenue * 0.7, result.totalCosts * 0.7).toFixed(1)}%
                        </td>
                        <td className="text-right py-2">{formatNumber(result.breakevenUnits)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Warnings */}
                {result.contributionMargin <= 0 && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">
                        {language === "ar" ? "تحذير: هامش مساهمة سالب" : "Warning: Negative contribution margin"}
                      </span>
                    </div>
                  </div>
                )}

                {result.breakevenUnits > result.projectedUnits && result.breakevenUnits < Number.POSITIVE_INFINITY && (
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">
                        {language === "ar"
                          ? `تحذير: نقطة التعادل (${formatNumber(result.breakevenUnits)}) أعلى من الطلب المتوقع`
                          : `Warning: Breakeven (${formatNumber(result.breakevenUnits)}) higher than expected demand`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* 3) Company Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          {language === "ar" ? "ملخص الشركة" : "Company Summary"}
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 font-semibold text-gray-700">
                  {language === "ar" ? "السيناريو" : "Scenario"}
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  {language === "ar" ? "إجمالي الوحدات" : "Total Units"}
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  {language === "ar" ? "المبيعات الكلية" : "Total Sales"}
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  {language === "ar" ? "التكاليف الكلية" : "Total Costs"}
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  {language === "ar" ? "صافي الربح" : "Net Profit"}
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  {t(language, "results.profitMarginOnCost")}
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  {language === "ar" ? "نقطة التعادل" : "Breakeven Units"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-green-50">
                <td className="py-3 font-medium text-green-800">{language === "ar" ? "أفضل حالة" : "Best Case"}</td>
                <td className="text-right py-3">{formatNumber(scenarios.bestCase.totalUnits)}</td>
                <td className="text-right py-3">{formatCurrency(scenarios.bestCase.totalRevenue)}</td>
                <td className="text-right py-3">{formatCurrency(scenarios.bestCase.totalCosts)}</td>
                <td className="text-right py-3 text-green-600 font-semibold">
                  {formatCurrency(scenarios.bestCase.netProfit)}
                </td>
                <td className="text-right py-3 text-green-600 font-semibold">
                  {calcTotalProfitMarginOnCost(scenarios.bestCase.totalRevenue, scenarios.bestCase.totalCosts).toFixed(
                    1,
                  )}
                  %
                </td>
                <td className="text-right py-3">{formatNumber(scenarios.bestCase.breakeven)}</td>
              </tr>
              <tr className="border-b bg-blue-50">
                <td className="py-3 font-medium text-blue-800">
                  {language === "ar" ? "الحالة الأساسية" : "Base Case"}
                </td>
                <td className="text-right py-3">{formatNumber(scenarios.baseCase.totalUnits)}</td>
                <td className="text-right py-3">{formatCurrency(scenarios.baseCase.totalRevenue)}</td>
                <td className="text-right py-3">{formatCurrency(scenarios.baseCase.totalCosts)}</td>
                <td className="text-right py-3 font-semibold">{formatCurrency(scenarios.baseCase.netProfit)}</td>
                <td className="text-right py-3 font-semibold">{overallMargin.toFixed(1)}%</td>
                <td className="text-right py-3">{formatNumber(scenarios.baseCase.breakeven)}</td>
              </tr>
              <tr className="border-b bg-red-50">
                <td className="py-3 font-medium text-red-800">{language === "ar" ? "أسوأ حالة" : "Worst Case"}</td>
                <td className="text-right py-3">{formatNumber(scenarios.worstCase.totalUnits)}</td>
                <td className="text-right py-3">{formatCurrency(scenarios.worstCase.totalRevenue)}</td>
                <td className="text-right py-3">{formatCurrency(scenarios.worstCase.totalCosts)}</td>
                <td className="text-right py-3 text-red-600 font-semibold">
                  {formatCurrency(scenarios.worstCase.netProfit)}
                </td>
                <td className="text-right py-3 text-red-600 font-semibold">
                  {calcTotalProfitMarginOnCost(
                    scenarios.worstCase.totalRevenue,
                    scenarios.worstCase.totalCosts,
                  ).toFixed(1)}
                  %
                </td>
                <td className="text-right py-3">{formatNumber(scenarios.worstCase.breakeven)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Product Dependency Indicator */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">
            {language === "ar" ? "مؤشر اعتماد المنتجات" : "Product Dependency Indicator"}
          </h4>
          <div className="space-y-2">
            {results.map((result) => {
              const contribution = (result.grossProfit / totalProfit) * 100
              return (
                <div key={result.productId} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{result.productName}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${contribution > 60 ? "bg-red-500" : contribution > 40 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(contribution, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{contribution.toFixed(0)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* 5) Risk Indicators */}
      {riskIndicators.length > 0 && (
        <Card className="p-6 border-l-4 border-l-red-500">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            {language === "ar" ? "مؤشرات المخاطر" : "Risk Indicators"}
          </h3>
          <div className="space-y-3">
            {riskIndicators.map((risk, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800">{risk.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7) Smart Recommendations */}
      {smartRecommendations.length > 0 && (
        <Card className="p-6 border-l-4 border-l-blue-500">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-500" />
            {language === "ar" ? "التوصيات الذكية" : "Smart Recommendations"}
          </h3>
          <div className="space-y-3">
            {smartRecommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-blue-800">{rec.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 8) Assumptions and Methodology */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {language === "ar" ? "الافتراضات ومنهجية التوزيع" : "Assumptions and Allocation Methodology"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              {language === "ar" ? "طريقة توزيع التكاليف الثابتة" : "Fixed Cost Allocation Method"}
            </h4>
            <p className="text-gray-700 text-sm mb-3">
              {data.costAllocation?.method === "equal" && (language === "ar" ? "توزيع متساوي" : "Equal Distribution")}
              {data.costAllocation?.method === "volume" && (language === "ar" ? "حسب الحجم" : "Volume Based")}
              {data.costAllocation?.method === "revenue" && (language === "ar" ? "حسب الإيرادات" : "Revenue Based")}
              {data.costAllocation?.method === "manual" && (language === "ar" ? "يدوي" : "Manual")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              {language === "ar" ? "معادلات الحساب" : "Calculation Formulas"}
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>{language === "ar" ? "الإيرادات = السعر × الوحدات" : "Revenue = Price × Units"}</p>
              <p>
                {language === "ar"
                  ? "الربح = الإيرادات - التكاليف المتغيرة - التكاليف الثابتة"
                  : "Profit = Revenue - Variable Costs - Fixed Costs"}
              </p>
              <p>
                {language === "ar"
                  ? "هامش الربح على التكلفة % = (صافي الربح ÷ إجمالي التكاليف) × 100"
                  : "Profit Margin on Cost % = (Net Profit ÷ Total Costs) × 100"}
              </p>
              <p>
                {language === "ar"
                  ? "نقطة التعادل = التكاليف الثابتة ÷ هامش المساهمة"
                  : "Breakeven = Fixed Costs ÷ Contribution Margin"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Export and Save Section */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {language === "ar" ? "حفظ ومشاركة النتائج" : "Save & Share Results"}
        </h3>

        <div className="flex gap-4 mb-6">
          <button
            onClick={async () => {
              try {
                if (!results || !Array.isArray(results) || results.length === 0) {
                  alert(language === "ar" ? "لا توجد نتائج للتصدير" : "No results to export")
                  return
                }
                await generateComprehensivePDF(data, results, portfolioSummary, language)
              } catch (error) {
                // Error generating PDF - handled silently
                alert(
                  language === "ar" ? "حدث خطأ أثناء إنشاء ملف PDF" : "An error occurred while generating the PDF file",
                )
              }
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {language === "ar" ? "تصدير إلى PDF" : "Export to PDF"}
          </button>

          <button
            onClick={async () => {
              const csvGenerator = new KayanCSVGenerator({
                results,
                projectName: data.projectName || "Pricing Analysis",
                companyName: data.companyName || "Company",
                totalRevenue,
                totalCosts,
                totalProfit,
                overallMargin,
                language,
                currency: data.currency || "EGP",
              })
              csvGenerator.download()
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {language === "ar" ? "تصدير إلى CSV" : "Export to CSV"}
          </button>

          <button
            onClick={async () => {
              const saveExporter = new SaveExporter(data, results, portfolioSummary, language)
              await saveExporter.saveProject()
            }}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {language === "ar" ? "حفظ" : "Save"}
          </button>

          <button
            onClick={() => {
              const saveExporter = new SaveExporter(data, results, portfolioSummary, language)
              saveExporter.generateShareLink()
            }}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {language === "ar" ? "مشاركة" : "Share"}
          </button>
        </div>

        <p className="text-sm text-gray-600">
          {language === "ar"
            ? "يمكنك حفظ النتائج بتنسيق PDF أو CSV أو حفظها في حسابك."
            : "You can save the results in PDF or CSV format, or save them to your account."}
        </p>
      </Card>
    </div>
  )
}
