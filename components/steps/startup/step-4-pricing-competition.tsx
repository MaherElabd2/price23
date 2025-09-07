"use client"

import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Ratio } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { startupT } from "@/lib/startup-translations"

import type { LocalData, Product, Competitor } from "@/types/startup"

interface StepProps {
  language: string;
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
}

export default function Step4PricingCompetition({ localData, updateLocalData, language }: StepProps) {
  const { t } = useLanguage()
  const st = (key: string) => startupT(language as "ar" | "en", key)

  // Per-product LTV/CAC helpers
  const productLtvCac = (localData as any).productLtvCac || ({} as Record<string, any>)
  const updateProductLtv = (productId: string, patch: Record<string, number>) => {
    const current = productLtvCac[productId] || {}
    updateLocalData({ productLtvCac: { ...productLtvCac, [productId]: { ...current, ...patch } } } as any)
  }

  // Sector-aware examples for tooltips
  const getSensitivityExample = (key: "high" | "medium" | "low") => {
    const sector = localData.sector || "other"
    const sectorData = st(`step4PricingCompetition.sectorGuidance.${sector}.pricingSuggestion`)
    const tpl = st(`step4PricingCompetition.priceSensitivityCard.tooltipExample.${key}`)
    const sectorName = st(`step0BasicInfo.sectors.${sector}`)
    return tpl.replace("{sector}", sectorName).replace("{suggestion}", sectorData)
  }

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${language === "ar" ? "rtl" : "ltr"}`}>
        <div className={`text-center mb-8 ${language === "ar" ? "text-right" : "text-left"}`}>
          <h3 className="text-2xl font-bold mb-2">{st("step4PricingCompetition.title")}</h3>
          <p className="text-gray-600 text-sm">{st("step4PricingCompetition.subtitle")}</p>
        </div>

        <Card>
          <CardHeader className={language === "ar" ? "text-right" : "text-left"}>
            <CardTitle>{st("step4PricingCompetition.competitorsCard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
              {st("step4PricingCompetition.competitorsCard.desc")}
            </p>
            {(localData.products || []).map((product: Product, index: number) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h4 className={`font-semibold mb-3 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {product.name ||
                    st("step4PricingCompetition.competitorsCard.productTitleFallback").replace(
                      "{index}",
                      String(index + 1),
                    )}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <label className={`text-sm ${language === "ar" ? "text-right" : "text-left"} block`}>
                        {st("step4PricingCompetition.competitorsCard.competitorLabel").replace("{i}", String(i))}
                      </label>
                      <p className="text-xs text-gray-500 mb-1">
                        {st("step4PricingCompetition.competitorsCard.priceHint")}
                      </p>
                      <Input
                        type="number"
                        placeholder={st("step4PricingCompetition.competitorsCard.pricePlaceholder")}
                        className={language === "ar" ? "text-right" : "text-left"}
                        onChange={(e) => {
                          const price = Number(e.target.value)
                          const newCompetitors = (localData.competitors || []).filter(
                            (c: Competitor) =>
                              !(
                                c.productId === product.id &&
                                c.name ===
                                  st("step4PricingCompetition.competitorsCard.competitorLabel").replace(
                                    "{i}",
                                    String(i),
                                  )
                              ),
                          )
                          if (price > 0) {
                            newCompetitors.push({
                              id: Date.now().toString() + i,
                              productId: product.id,
                              price,
                              name: st("step4PricingCompetition.competitorsCard.competitorLabel").replace(
                                "{i}",
                                String(i),
                              ),
                            })
                          }
                          updateLocalData({ competitors: newCompetitors })
                        }}
                      />
                    </div>
                  ))}
                </div>

                {(localData.competitors || []).filter((c: Competitor) => c.productId === product.id).length > 0 && (
                  <Card className="bg-gray-50 mt-3">
                    <CardContent className="pt-3">
                      <div className="text-sm">
                        <span className="font-semibold">
                          {st("step4PricingCompetition.competitorsCard.priceRangeLabel")}:
                        </span>
                        {Math.min(
                          ...(localData.competitors || [])
                            .filter((c: Competitor) => c.productId === product.id)
                            .map((c: Competitor) => c.price),
                        )}{" "}
                        -
                        {Math.max(
                          ...(localData.competitors || [])
                            .filter((c: Competitor) => c.productId === product.id)
                            .map((c: Competitor) => c.price),
                        )}{" "}
                        {localData.currency || st("step4PricingCompetition.competitorsCard.currencyLabel")}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={language === "ar" ? "text-right" : "text-left"}>
            <CardTitle>{st("step4PricingCompetition.priceSensitivityCard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
              {st("step4PricingCompetition.priceSensitivityCard.desc")}
            </p>
            {/* Selectable cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  key: "high",
                  title: st("step4PricingCompetition.priceSensitivityCard.options.high.title"),
                  desc: st("step4PricingCompetition.priceSensitivityCard.options.high.desc"),
                  emoji: "💸",
                },
                {
                  key: "medium",
                  title: st("step4PricingCompetition.priceSensitivityCard.options.medium.title"),
                  desc: st("step4PricingCompetition.priceSensitivityCard.options.medium.desc"),
                  emoji: "⚖️",
                },
                {
                  key: "low",
                  title: st("step4PricingCompetition.priceSensitivityCard.options.low.title"),
                  desc: st("step4PricingCompetition.priceSensitivityCard.options.low.desc"),
                  emoji: "🌟",
                },
              ].map((opt) => {
                const selected = (localData.priceSensitivity || "medium") === (opt.key as any)
                return (
                  <Tooltip key={opt.key}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => updateLocalData({ priceSensitivity: opt.key as any })}
                        className={`${language === "ar" ? "text-right" : "text-left"} rounded-lg border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-teal-300 w-full 
                        ${selected ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
                      >
                        <div className={`flex items-start gap-3 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                          <span className="text-xl" aria-hidden>
                            {opt.emoji}
                          </span>
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">{opt.title}</div>
                            <div className="text-xs text-gray-600">{opt.desc}</div>
                          </div>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      className={`max-w-[260px] ${language === "ar" ? "text-right" : "text-left"} text-xs`}
                    >
                      {getSensitivityExample(opt.key as "high" | "medium" | "low")}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={language === "ar" ? "text-right" : "text-left"}>
            <CardTitle>{st("step4PricingCompetition.differentiationCard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
              {st("step4PricingCompetition.differentiationCard.desc")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {st("step4PricingCompetition.differentiationCard.chips")
                .split(",")
                .map((item: string) => {
                  const trimmedItem = item.trim()
                  const active = (localData.differentiation || []).includes(trimmedItem)
                  return (
                    <button
                      key={trimmedItem}
                      type="button"
                      onClick={() => {
                        const oldDiff = localData.differentiation || []
                        const isActive = oldDiff.includes(trimmedItem)
                        const newDiff = isActive ? oldDiff.filter((d) => d !== trimmedItem) : [...oldDiff, trimmedItem]
                        updateLocalData({ differentiation: newDiff })
                      }}
                      className={`px-3 py-2 rounded-full text-sm border transition w-full text-center 
                    ${active ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                    >
                      {trimmedItem}
                    </button>
                  )
                })}
            </div>
            <div className="mt-2">
              <Label htmlFor="custom-diff">{st("step4PricingCompetition.differentiationCard.customLabel")}</Label>
              <Textarea
                id="custom-diff"
                placeholder={st("step4PricingCompetition.differentiationCard.customPlaceholder")}
                value={localData.customDifferentiation || ""}
                onChange={(e) => updateLocalData({ customDifferentiation: e.target.value })}
                className={language === "ar" ? "text-right" : "text-left"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Goal moved above LTV/CAC */}
        <Card>
          <CardHeader className={language === "ar" ? "text-right" : "text-left"}>
            <CardTitle>{st("step4PricingCompetition.currentGoalCard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">{st("step4PricingCompetition.currentGoalCard.desc")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  key: "quick_revenue",
                  title: st("step4PricingCompetition.currentGoalCard.options.quick_revenue.title"),
                  desc: st("step4PricingCompetition.currentGoalCard.options.quick_revenue.desc"),
                  emoji: "⚡",
                },
                {
                  key: "market_entry",
                  title: st("step4PricingCompetition.currentGoalCard.options.market_entry.title"),
                  desc: st("step4PricingCompetition.currentGoalCard.options.market_entry.desc"),
                  emoji: "🚪",
                },
                {
                  key: "premium_position",
                  title: st("step4PricingCompetition.currentGoalCard.options.premium_position.title"),
                  desc: st("step4PricingCompetition.currentGoalCard.options.premium_position.desc"),
                  emoji: "🏆",
                },
                {
                  key: "sustainable_growth",
                  title: st("step4PricingCompetition.currentGoalCard.options.sustainable_growth.title"),
                  desc: st("step4PricingCompetition.currentGoalCard.options.sustainable_growth.desc"),
                  emoji: "🌱",
                },
                {
                  key: "test_market",
                  title: st("step4PricingCompetition.currentGoalCard.options.test_market.title"),
                  desc: st("step4PricingCompetition.currentGoalCard.options.test_market.desc"),
                  emoji: "🧪",
                },
              ].map((g) => {
                const active = (localData.currentGoal || "") === (g.key as any)
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => updateLocalData({ currentGoal: g.key as any })}
                    className={`${language === "ar" ? "text-right" : "text-left"} rounded-lg border p-4 transition focus:outline-none w-full 
                    ${active ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div className={`flex items-start gap-3 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                      <span className="text-xl" aria-hidden>
                        {g.emoji}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-900">{g.title}</div>
                        <div className="text-xs text-gray-600">{g.desc}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Per-product LTV/CAC */}
        <Card>
          <CardHeader className={language === "ar" ? "text-right" : "text-left"}>
            <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <Ratio className="h-5 w-5 text-teal-600" />
              {st("step4PricingCompetition.ltvCacCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">
                📊 {st("step4PricingCompetition.ltvCacCard.infoTitle")}
              </h4>
              <p className="text-sm text-blue-700">{st("step4PricingCompetition.ltvCacCard.infoDesc")}</p>
            </div>

            {(localData.products || []).map((product: Product, idx: number) => {
              const pd = productLtvCac[product.id] || {}
              const monthlyNewCustomers = Number(pd.monthlyNewCustomers) || 0
              const customerChurnRate = Number(pd.customerChurnRate) || 0 // %
              const avgOrderValue = Number(pd.avgOrderValue) || 0
              const purchaseFrequency = Number(pd.purchaseFrequency) || 0
              const grossMarginPercent = Number(pd.grossMarginPercent ?? 30)
              const pdMarketing = Number(pd.monthlyMarketingCost) || 0 // per-product spend

              // CAC per product = per-product marketing / new customers
              const cac = monthlyNewCustomers > 0 ? pdMarketing / monthlyNewCustomers : 0
              const monthlyRevenue = avgOrderValue * purchaseFrequency
              const monthlyGrossProfit = monthlyRevenue * (grossMarginPercent / 100)
              const customerLifetimeMonths = customerChurnRate > 0 ? 100 / customerChurnRate : 0
              const ltv = customerLifetimeMonths > 0 ? monthlyGrossProfit * customerLifetimeMonths : 0
              const ratio = cac > 0 ? ltv / cac : 0

              return (
                <div key={product.id} className="border rounded-lg p-4 space-y-4">
                  <h4 className={`font-semibold ${language === "ar" ? "text-right" : "text-left"}`}>
                    {product.name ||
                      st("step4PricingCompetition.ltvCacCard.productTitleFallback").replace("{index}", String(idx + 1))}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-800">
                        📈 {st("step4PricingCompetition.ltvCacCard.customerDataTitle")}
                      </h5>
                      <div>
                        <Label>{st("step4PricingCompetition.ltvCacCard.monthlyNewCustomersLabel")}</Label>
                        <p className="text-xs text-gray-500 mb-2">
                          {st("step4PricingCompetition.ltvCacCard.monthlyNewCustomersHelp")}
                        </p>
                        <Input
                          type="number"
                          placeholder="50"
                          value={monthlyNewCustomers || ""}
                          onChange={(e) =>
                            updateProductLtv(product.id, { monthlyNewCustomers: Number.parseInt(e.target.value) || 0 })
                          }
                          className={language === "ar" ? "text-right" : "text-left"}
                        />
                      </div>
                      <div>
                        <Label>{st("step4PricingCompetition.ltvCacCard.churnRateLabel")}</Label>
                        <p className="text-xs text-gray-500 mb-2">
                          {st("step4PricingCompetition.ltvCacCard.churnRateHelp")}
                        </p>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="5"
                          value={pd.customerChurnRate || ""}
                          onChange={(e) =>
                            updateProductLtv(product.id, { customerChurnRate: Number.parseFloat(e.target.value) || 0 })
                          }
                          className={language === "ar" ? "text-right" : "text-left"}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-800">
                        💰 {st("step4PricingCompetition.ltvCacCard.purchaseDataTitle")}
                      </h5>
                      <div>
                        <Label>{st("step4PricingCompetition.ltvCacCard.avgOrderValueLabel")}</Label>
                        <p className="text-xs text-gray-500 mb-2">
                          {st("step4PricingCompetition.ltvCacCard.avgOrderValueHelp")}
                        </p>
                        <Input
                          type="number"
                          placeholder="200"
                          value={pd.avgOrderValue || ""}
                          onChange={(e) =>
                            updateProductLtv(product.id, { avgOrderValue: Number.parseFloat(e.target.value) || 0 })
                          }
                          className={language === "ar" ? "text-right" : "text-left"}
                        />
                      </div>
                      <div>
                        <Label>{st("step4PricingCompetition.ltvCacCard.purchaseFrequencyLabel")}</Label>
                        <p className="text-xs text-gray-500 mb-2">
                          {st("step4PricingCompetition.ltvCacCard.purchaseFrequencyHelp")}
                        </p>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="2.5"
                          value={pd.purchaseFrequency || ""}
                          onChange={(e) =>
                            updateProductLtv(product.id, { purchaseFrequency: Number.parseFloat(e.target.value) || 0 })
                          }
                          className={language === "ar" ? "text-right" : "text-left"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{st("step4PricingCompetition.ltvCacCard.grossMarginLabel")}</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        value={pd.grossMarginPercent ?? ""}
                        onChange={(e) =>
                          updateProductLtv(product.id, { grossMarginPercent: Number.parseFloat(e.target.value) || 0 })
                        }
                        className={language === "ar" ? "text-right" : "text-left"}
                      />
                    </div>
                    <div>
                      <Label>{st("step4PricingCompetition.ltvCacCard.marketingMonthlyLabel")}</Label>
                      <p className="text-xs text-gray-500 mb-2">
                        {st("step4PricingCompetition.ltvCacCard.marketingMonthlyHelp")}
                      </p>
                      <Input
                        type="number"
                        placeholder="3000"
                        value={pd.monthlyMarketingCost || ""}
                        onChange={(e) =>
                          updateProductLtv(product.id, { monthlyMarketingCost: Number.parseFloat(e.target.value) || 0 })
                        }
                        className={language === "ar" ? "text-right" : "text-left"}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <div className="text-xs text-blue-600 mb-1">
                          {st("step4PricingCompetition.ltvCacCard.metrics.cacShort")}
                        </div>
                        <div className="text-sm text-blue-700 mb-2">
                          {st("step4PricingCompetition.ltvCacCard.metrics.cacLabel")}
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                          {cac.toFixed(0)} {localData.currency || "EGP"}
                        </div>
                        {cac === 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {st("step4PricingCompetition.ltvCacCard.metrics.cacZeroHint")}
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <div className="text-xs text-green-600 mb-1">
                          {st("step4PricingCompetition.ltvCacCard.metrics.ltvShort")}
                        </div>
                        <div className="text-sm text-green-700 mb-2">
                          {st("step4PricingCompetition.ltvCacCard.metrics.ltvLabel")}
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                          {ltv.toFixed(0)} {localData.currency || "EGP"}
                        </div>
                        {ltv === 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            {st("step4PricingCompetition.ltvCacCard.metrics.ltvZeroHint")}
                          </div>
                        )}
                      </div>
                      <div
                        className={`p-4 rounded-lg text-center border-2 ${
                          ratio === 0
                            ? "bg-gray-50 border-gray-300"
                            : ratio < 3
                              ? "bg-red-50 border-red-300"
                              : ratio < 5
                                ? "bg-yellow-50 border-yellow-300"
                                : "bg-teal-50 border-teal-300"
                        }`}
                      >
                        <div
                          className={`text-xs mb-1 ${
                            ratio === 0
                              ? "text-gray-600"
                              : ratio < 3
                                ? "text-red-600"
                                : ratio < 5
                                  ? "text-yellow-600"
                                  : "text-teal-600"
                          }`}
                        >
                          {st("step4PricingCompetition.ltvCacCard.metrics.ratioLabel")}
                        </div>
                        <div
                          className={`text-sm mb-2 ${
                            ratio === 0
                              ? "text-gray-700"
                              : ratio < 3
                                ? "text-red-700"
                                : ratio < 5
                                  ? "text-yellow-700"
                                  : "text-teal-700"
                          }`}
                        >
                          {st("step4PricingCompetition.ltvCacCard.metrics.ratioQuestion")}
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            ratio === 0
                              ? "text-gray-900"
                              : ratio < 3
                                ? "text-red-900"
                                : ratio < 5
                                  ? "text-yellow-900"
                                  : "text-teal-900"
                          }`}
                        >
                          {ratio > 0 ? ratio.toFixed(1) : "0.0"} : 1
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
