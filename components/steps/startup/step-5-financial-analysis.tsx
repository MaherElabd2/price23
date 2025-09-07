"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, TrendingUp, Clock, TargetIcon } from "lucide-react"
import { calculateMonthlyQuantity, calculateUnitVariableCost, calculateBreakEven } from "@/lib/calculations"
import type { LocalData, Product, FixedCost } from "@/types/startup"
import { useLanguage } from "@/contexts/language-context"

interface StepProps {
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
  hideLtvCacSection?: boolean
}

export default function Step5FinancialAnalysis({ localData, updateLocalData, hideLtvCacSection }: StepProps) {
  const { language, t } = useLanguage()

  // Calculate prices based on selected strategy
  const calculateStrategyPrice = (product: Product) => {
    const unitCost = (product.costItems || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    const competitors = (localData.competitors || []).filter((c) => c.productId === product.id)
    const avgCompetitorPrice =
      competitors.length > 0 ? competitors.reduce((sum, c) => sum + c.price, 0) / competitors.length : 0
    const customMargin = localData.customMargin || 30

    // Calculate base price from primary strategy
    let basePrice: number
    switch (localData.selectedStrategy) {
      case "cost_plus":
        basePrice = unitCost * (1 + customMargin / 100)
        break
      case "competitive":
        basePrice = avgCompetitorPrice > 0 ? avgCompetitorPrice * 0.95 : unitCost * 1.25
        break
      case "penetration":
        basePrice = avgCompetitorPrice > 0 ? avgCompetitorPrice * 0.8 : unitCost * 1.15
        break
      case "value_based":
        const valueBased = avgCompetitorPrice > 0 ? avgCompetitorPrice : unitCost * 1.4
        basePrice = valueBased * 1.2
        break
      default:
        basePrice = Number(product.price) || unitCost * 1.3
    }

    // Apply secondary strategies
    const secondaryStrategies = localData.secondaryStrategies || []
    let finalPrice = basePrice

    secondaryStrategies.forEach((strategy) => {
      switch (strategy) {
        case "psychological":
          // Convert to psychological pricing (99, 199, 299, etc.)
          finalPrice = Math.floor(finalPrice / 100) * 100 + 99
          break
        case "bundle":
          // Apply bundle discount (5%)
          finalPrice = finalPrice * 0.95
          break
        case "dynamic":
          // Dynamic pricing adjustment (+10%)
          finalPrice = finalPrice * 1.1
          break
        case "skimming":
          // Skimming premium (+20%)
          finalPrice = finalPrice * 1.2
          break
        default:
          break
      }
    })

    return finalPrice
  }

  const productsWithCalc = (localData.products || []).map((product: Product) => {
    const monthlyQuantity = calculateMonthlyQuantity(product)
    const price = localData.selectedStrategy ? calculateStrategyPrice(product) : Number(product.price) || 0
    const unitVarCost = calculateUnitVariableCost(product)
    return {
      id: product.id,
      name: product.name,
      monthlyQuantity,
      price,
      unitVarCost,
    }
  })

  const estimatedRevenue = productsWithCalc.reduce<number>((s, p) => s + p.monthlyQuantity * p.price, 0)
  const variableCosts = productsWithCalc.reduce<number>((s, p) => s + p.monthlyQuantity * p.unitVarCost, 0)
  const fixedCosts = (localData.fixedCosts || []).reduce(
    (sum: number, c: FixedCost) => sum + (Number(c.amount) || 0),
    0,
  )

  // Net cash flow calculation (Revenue - All Costs)
  const netCashFlow = estimatedRevenue - variableCosts - fixedCosts
  const totalBurnRate = Math.abs(netCashFlow < 0 ? netCashFlow : fixedCosts + variableCosts)

  let finalRunway = localData.runwayMonths || 0
  if (localData.runwayMode === "auto" && localData.runwayCash && totalBurnRate > 0) {
    finalRunway = Number(localData.runwayCash) / totalBurnRate
  }

  const productsWithBreakEven = productsWithCalc.map((product) => {
    const allocatedFixedCost = fixedCosts / productsWithCalc.length // Simple equal allocation for now
    const breakEvenResult = calculateBreakEven(allocatedFixedCost, product.unitVarCost, product.price)
    return {
      ...product,
      allocatedFixedCost,
      breakEvenUnits: breakEvenResult.units,
      currentMargin: product.price - product.unitVarCost,
      isBreakEvenReached: breakEvenResult.isViable && product.monthlyQuantity >= breakEvenResult.units,
      isViable: breakEvenResult.isViable,
    }
  })

  // LTV/CAC Calculation - Fixed formulas
  const ltvInputs = localData.ltvCacInputs || {}
  const avgPurchaseValue = Number(ltvInputs.avgPurchaseValue) || 0
  const purchaseFrequencyPerYear = Number(ltvInputs.purchaseFrequencyPerYear) || 0
  const customerLifespanYears = Number(ltvInputs.customerLifespanYears) || 0
  const monthlyMarketingSpend = Number(ltvInputs.monthlyMarketingSpend) || 0
  const newCustomersPerMonth = Number(ltvInputs.newCustomersPerMonth) || 0

  // Correct LTV calculation: Average Purchase Value × Purchase Frequency × Customer Lifespan
  const ltv = avgPurchaseValue * purchaseFrequencyPerYear * customerLifespanYears

  // Correct CAC calculation: Monthly Marketing Spend ÷ New Customers Per Month
  const cac = newCustomersPerMonth > 0 ? monthlyMarketingSpend / newCustomersPerMonth : 0

  // LTV to CAC ratio
  const ltvToCacRatio = cac > 0 ? ltv / cac : 0

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${language === "ar" ? "rtl" : "ltr"}`}>
        <div className={`text-center mb-8 ${language === "ar" ? "text-right" : "text-left"}`}>
          <h3 className="text-2xl font-bold mb-2">
            {t.startupTranslations?.step5FinancialAnalysis?.title || "التحليل المالي"}
          </h3>
          <p className="text-gray-600 text-sm">
            {t.startupTranslations?.step5FinancialAnalysis?.subtitle || "تحليل التوقعات المالية ونقاط التعادل"}
          </p>
          {localData.selectedStrategy && (
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {t.startupTranslations?.step5FinancialAnalysis?.appliedStrategyLabel || "الاستراتيجية المطبقة"}:{" "}
                {localData.selectedStrategy === "cost_plus"
                  ? t.startupTranslations?.step5FinancialAnalysis?.strategies?.costPlus || "التكلفة زائد الربح"
                  : localData.selectedStrategy === "competitive"
                    ? t.startupTranslations?.step5FinancialAnalysis?.strategies?.competitive || "تنافسية"
                    : localData.selectedStrategy === "value_based"
                      ? t.startupTranslations?.step5FinancialAnalysis?.strategies?.valueBased || "قائمة على القيمة"
                      : localData.selectedStrategy === "penetration"
                        ? t.startupTranslations?.step5FinancialAnalysis?.strategies?.penetration || "اختراق السوق"
                        : t.startupTranslations?.step5FinancialAnalysis?.strategies?.custom || "مخصصة"}
              </span>
            </div>
          )}
        </div>

        <Card
          className={`border-2 ${
            finalRunway < 6
              ? "border-red-300 bg-red-50"
              : finalRunway < 12
                ? "border-orange-300 bg-orange-50"
                : "border-green-300 bg-green-50"
          }`}
        >
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <Clock className="h-5 w-5" />
              <Tooltip>
                <TooltipTrigger className="cursor-help">
                  <span className="border-b border-dotted border-gray-500">
                    {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.title || "مدة استمرار النقد"}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.tooltip ||
                      "كم من الوقت سيستمر نقدك بمعدل الحرق الحالي"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.revenueLabel || "الإيرادات الشهرية"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {estimatedRevenue.toLocaleString()}{" "}
                  {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.currencyPerMonth || "جنيه/شهر"}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.variableCostsLabel ||
                      "التكاليف المتغيرة"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {variableCosts.toLocaleString()}{" "}
                  {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.currencyPerMonth || "جنيه/شهر"}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.fixedCostsLabel || "التكاليف الثابتة"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {fixedCosts.toLocaleString()}{" "}
                  {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.currencyPerMonth || "جنيه/شهر"}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">
                    {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.totalBurnRateLabel ||
                      "معدل الحرق الإجمالي"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-900">
                  {totalBurnRate > 0 ? (
                    <>
                      {totalBurnRate.toLocaleString()}{" "}
                      {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.currencyPerMonth || "جنيه/شهر"}
                    </>
                  ) : (
                    <span className="text-gray-500">
                      {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.noBurnRate || "لا يوجد حرق"}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`p-4 rounded-lg border ${netCashFlow >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {netCashFlow >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${netCashFlow >= 0 ? "text-green-800" : "text-red-800"}`}>
                    {netCashFlow >= 0
                      ? t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.netProfitLabel || "صافي الربح"
                      : t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.netLossLabel || "صافي الخسارة"}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${netCashFlow >= 0 ? "text-green-900" : "text-red-900"}`}>
                  {Math.abs(netCashFlow).toLocaleString()}{" "}
                  {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.currencyPerMonth || "جنيه/شهر"}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">
                    {t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.runwayRemainingLabel ||
                      "المدة المتبقية"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {totalBurnRate > 0 && finalRunway > 0
                    ? `${finalRunway.toFixed(1)} ${t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.monthsShort || "شهر"}`
                    : netCashFlow >= 0
                      ? t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.profitable || "مربح"
                      : t.startupTranslations?.step5FinancialAnalysis?.runwayCard?.undefinedLabel || "غير محدد"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!hideLtvCacSection && (
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <TargetIcon className="h-5 w-5 text-teal-600" />
                <Tooltip>
                  <TooltipTrigger className="cursor-help">
                    <span className="border-b border-dotted border-gray-500">
                      {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.title || "تحليل LTV/CAC"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.tooltip ||
                        "نسبة القيمة مدى الحياة إلى تكلفة اكتساب العميل"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="avgPurchaseValue">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.avgPurchaseValue?.label ||
                      "متوسط قيمة الشراء"}
                  </Label>
                  <p className="text-xs text-gray-500 mb-1">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.avgPurchaseValue?.help ||
                      "المبلغ المتوسط لكل عملية شراء"}
                  </p>
                  <Input
                    id="avgPurchaseValue"
                    type="number"
                    placeholder={
                      t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.avgPurchaseValue
                        ?.placeholder || "200"
                    }
                    value={ltvInputs.avgPurchaseValue || ""}
                    onChange={(e) =>
                      updateLocalData({
                        ltvCacInputs: { ...ltvInputs, avgPurchaseValue: Number(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseFrequency">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.purchaseFrequencyPerYear
                      ?.label || "تكرار الشراء (سنوياً)"}
                  </Label>
                  <p className="text-xs text-gray-500 mb-1">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.purchaseFrequencyPerYear
                      ?.help || "كم مرة في السنة"}
                  </p>
                  <Input
                    id="purchaseFrequency"
                    type="number"
                    placeholder={
                      t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.purchaseFrequencyPerYear
                        ?.placeholder || "4"
                    }
                    value={ltvInputs.purchaseFrequencyPerYear || ""}
                    onChange={(e) =>
                      updateLocalData({
                        ltvCacInputs: { ...ltvInputs, purchaseFrequencyPerYear: Number(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="customerLifespan">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.customerLifespanYears?.label ||
                      "عمر العميل (بالسنوات)"}
                  </Label>
                  <p className="text-xs text-gray-500 mb-1">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.customerLifespanYears?.help ||
                      "كم من الوقت يبقى العملاء"}
                  </p>
                  <Input
                    id="customerLifespan"
                    type="number"
                    placeholder={
                      t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.customerLifespanYears
                        ?.placeholder || "2"
                    }
                    value={ltvInputs.customerLifespanYears || ""}
                    onChange={(e) =>
                      updateLocalData({
                        ltvCacInputs: { ...ltvInputs, customerLifespanYears: Number(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyMarketing">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.monthlyMarketingSpend?.label ||
                      "الإنفاق التسويقي الشهري"}
                  </Label>
                  <p className="text-xs text-gray-500 mb-1">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.monthlyMarketingSpend?.help ||
                      "ميزانية التسويق شهرياً"}
                  </p>
                  <Input
                    id="monthlyMarketing"
                    type="number"
                    placeholder={
                      t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.monthlyMarketingSpend
                        ?.placeholder || "5000"
                    }
                    value={ltvInputs.monthlyMarketingSpend || ""}
                    onChange={(e) =>
                      updateLocalData({
                        ltvCacInputs: { ...ltvInputs, monthlyMarketingSpend: Number(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-4 border rounded-lg bg-blue-50 mt-4">
                <div>
                  <Label htmlFor="newCustomersPerMonth">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.newCustomersPerMonth?.label ||
                      "العملاء الجدد شهرياً"}
                  </Label>
                  <p className="text-xs text-gray-500 mb-1">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.newCustomersPerMonth?.help ||
                      "كم عميل جديد شهرياً"}
                  </p>
                  <Input
                    id="newCustomersPerMonth"
                    type="number"
                    placeholder={
                      t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.inputs?.newCustomersPerMonth
                        ?.placeholder || "50"
                    }
                    value={ltvInputs.newCustomersPerMonth || ""}
                    onChange={(e) =>
                      updateLocalData({
                        ltvCacInputs: { ...ltvInputs, newCustomersPerMonth: Number(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
                  <div className="text-sm text-blue-700 mb-2">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.cacTitle || "CAC"}
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {cac.toFixed(0)}{" "}
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.currency || "جنيه"}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.cacDesc ||
                      "تكلفة اكتساب العميل"}
                  </div>
                </div>
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                  <div className="text-sm text-green-700 mb-2">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.ltvTitle || "LTV"}
                  </div>
                  <div className="text-3xl font-bold text-green-900">
                    {ltv.toFixed(0)}{" "}
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.currency || "جنيه"}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.ltvDesc ||
                      "القيمة مدى الحياة"}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg text-center border-2 ${
                    ltvToCacRatio >= 3
                      ? "bg-teal-50 border-teal-300"
                      : ltvToCacRatio >= 1
                        ? "bg-yellow-50 border-yellow-300"
                        : "bg-red-50 border-red-300"
                  }`}
                >
                  <div
                    className={`text-sm mb-2 ${
                      ltvToCacRatio >= 3 ? "text-teal-700" : ltvToCacRatio >= 1 ? "text-yellow-700" : "text-red-700"
                    }`}
                  >
                    {t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.ratioTitle ||
                      "نسبة LTV:CAC"}
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      ltvToCacRatio >= 3 ? "text-teal-900" : ltvToCacRatio >= 1 ? "text-yellow-900" : "text-red-900"
                    }`}
                  >
                    {ltvToCacRatio > 0 ? ltvToCacRatio.toFixed(1) : "0.0"}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      ltvToCacRatio >= 3 ? "text-teal-600" : ltvToCacRatio >= 1 ? "text-yellow-600" : "text-red-600"
                    }`}
                  >
                    {ltvToCacRatio >= 3
                      ? t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.ratioStatus?.excellent ||
                        "ممتاز"
                      : ltvToCacRatio >= 1
                        ? t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.ratioStatus?.good ||
                          "جيد"
                        : t.startupTranslations?.step5FinancialAnalysis?.ltvCacCard?.metricsBox?.ratioStatus
                            ?.needsImprovement || "يحتاج تحسين"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <Tooltip>
                <TooltipTrigger className="cursor-help">
                  <span className="border-b border-dotted border-gray-500">
                    {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.title || "تحليل نقطة التعادل"}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.tooltip ||
                      "الوحدات المطلوبة لتغطية جميع التكاليف"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productsWithBreakEven.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border-2 ${
                    product.isBreakEvenReached ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between mb-3 ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <h4 className="font-semibold text-lg">{product.name}</h4>
                    <Badge variant={product.isBreakEvenReached ? "default" : "secondary"}>
                      {product.isBreakEvenReached
                        ? t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.profitableLabel || "مربح"
                        : t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.needsImprovementLabel ||
                          "يحتاج تحسين"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">
                        {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.priceLabel || "السعر"}
                      </span>
                      <div className="font-semibold">
                        {product.price.toLocaleString()}{" "}
                        {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.currency || "جنيه"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.marginPerUnitLabel ||
                          "الهامش/وحدة"}
                      </span>
                      <div className="font-semibold text-blue-600">
                        {product.currentMargin.toLocaleString()}{" "}
                        {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.currency || "جنيه"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.breakEvenLabel || "نقطة التعادل"}
                      </span>
                      <div className="font-semibold text-purple-600">
                        {product.isViable
                          ? `${product.breakEvenUnits.toFixed(0)} ${t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.unitPerMonthSuffix || "وحدة/شهر"}`
                          : t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.notViable ||
                            "غير قابل للتطبيق"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.currentQtyLabel ||
                          "الكمية الحالية"}
                      </span>
                      <div
                        className={`font-semibold ${product.isBreakEvenReached ? "text-green-600" : "text-orange-600"}`}
                      >
                        {product.monthlyQuantity.toFixed(0)}{" "}
                        {t.startupTranslations?.step5FinancialAnalysis?.breakEvenCard?.unitPerMonthSuffix || "وحدة/شهر"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
