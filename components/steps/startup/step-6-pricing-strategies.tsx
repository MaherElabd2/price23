"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LocalData, Product } from "@/types/startup"
import { calculateUnitVariableCost } from "@/lib/calculations"
import { useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
// ملاحظة: لقد قمنا بتغيير استدعاء الترجمة ليعتمد على النظام الرئيسي
import { startupT } from "@/lib/startup-translations"

interface StepProps {
  language: string;
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
}

export default function Step6PricingStrategies({ localData, updateLocalData, language }: StepProps) {
  // استخدام دالة الترجمة الرئيسية مباشرة
  const t = (key: string) => startupT(language as "ar" | "en", key)
  const { dir } = useLanguage()

  const pricingStrategy: Record<string, string> = localData.pricingStrategy || {}
  const recommendedStrategy: Record<string, string> = localData.recommendedStrategy || {}
  const recommendedMargin: Record<string, number> = localData.recommendedMargin || {}

  useEffect(() => {
    const products = localData.products || []
    if (products.length === 0) return

    const next = products.map((p) => {
      const unitVar = Math.max(0, Number(p.unitVarCost) || 0)
      const fixedPer = Math.max(0, Number((p as any).allocatedFixedCostPerUnit) || 0)
      const total = unitVar + fixedPer
      const prev = Number((p as any).totalUnitCost ?? 0)
      if (Math.abs(prev - total) > 0.01) {
        return { ...p, totalUnitCost: total }
      }
      return p
    })

    const changed = next.some((p, i) => p !== (localData.products || [])[i])
    if (changed) {
      updateLocalData({ products: next })
    }
  }, [localData.products, updateLocalData])

  const getDisplayedUnitCost = (product: Product) => {
    if (typeof (product as any)?.totalUnitCost === "number" && !Number.isNaN((product as any).totalUnitCost)) {
      return (product as any).totalUnitCost as number
    }
    return calculateUnitVariableCost(product)
  }

  const strategyOptions = [
    "penetration", "premium", "bundling", "subscription",
    "cost_plus", "value_based", "competitive", "dynamic", "skimming",
  ].map((key) => ({
    value: key,
    // التصحيح: استخدام الدالة 't' مباشرة
    label: t(`step6PricingStrategies.strategyOptions.${key}.label`),
    desc: t(`step6PricingStrategies.strategyOptions.${key}.desc`),
  }))

  const strategyLabels: Record<string, string> = strategyOptions.reduce(
    (acc, s) => {
      acc[s.value] = s.label
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <div className={`space-y-6`} dir={dir}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{t("step6PricingStrategies.title")}</h3>
        <p className="text-gray-600 text-sm">{t("step6PricingStrategies.subtitle")}</p>
      </div>

      {(localData.products || []).length > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg">{t("step6PricingStrategies.recommendationsTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(localData.products || []).map((product: Product, index: number) => {
                const recStrat = recommendedStrategy[product.id]
                const recMarg = recommendedMargin[product.id]
                return (
                  <div key={product.id} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">
                      {product.name || `Product #${index + 1}`}
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded border text-xs bg-white">
                        {recStrat ? strategyLabels[recStrat] || recStrat : "—"}
                      </span>
                      <span className="text-gray-700">
                        {t("step6PricingStrategies.recommendedMarginForThis")}{" "}
                        {typeof recMarg === "number" ? `${recMarg}%` : "—"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("step6PricingStrategies.productStrategyTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(localData.products || []).map((product: Product, index: number) => (
            <div key={product.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-semibold">
                  {product.name || `Product #${index + 1}`}
                </h4>
                {recommendedStrategy[product.id] && (
                  <span className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {t("step6PricingStrategies.recommendedBadge")}:{" "}
                    {strategyLabels[recommendedStrategy[product.id]] || recommendedStrategy[product.id]}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-700 mb-3">
                <span className="text-gray-600">{t("step6PricingStrategies.unitCostLabel")}</span>{" "}
                <span className="font-semibold">{`${getDisplayedUnitCost(product).toFixed(2)} ${t("common.currency")}`}</span>
              </div>
              {typeof recommendedMargin[product.id] === "number" && (
                <div className="text-xs text-gray-700 mb-3">
                  {t("step6PricingStrategies.recommendedMarginForThis")} {recommendedMargin[product.id]}%
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {strategyOptions.map((strategy) => {
                  const isSelected = pricingStrategy[product.id] === strategy.value
                  const isRecommended = recommendedStrategy[product.id] === strategy.value
                  return (
                    <Card
                      key={strategy.value}
                      className={`cursor-pointer transition-all relative ${
                        isSelected ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                      } ${isRecommended ? "ring-1 ring-emerald-300" : ""}`}
                      onClick={() =>
                        updateLocalData({ pricingStrategy: { ...pricingStrategy, [product.id]: strategy.value } })
                      }
                    >
                      <CardContent className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <h5 className="font-medium text-sm">{strategy.label}</h5>
                          {isRecommended && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {t("step6PricingStrategies.recommendedBadge")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{strategy.desc}</p>
                        {typeof recommendedMargin[product.id] === "number" && (
                          <p className="text-[11px] text-gray-700 mt-2">
                            {t("step6PricingStrategies.suggestedMargin")} {recommendedMargin[product.id]}%
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {Object.keys(pricingStrategy).length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">{t("step6PricingStrategies.summaryTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(localData.products || []).map((product: Product, index: number) => {
                const strategy = pricingStrategy[product.id]
                if (!strategy) return null

                return (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="font-medium">
                      {product.name || `Product #${index + 1}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border">
                        {strategyLabels[strategy] || strategy}
                      </span>
                      {typeof recommendedMargin[product.id] === "number" && (
                        <span className="text-xs text-gray-700">
                          {t("step6PricingStrategies.recommendedMarginForThis")}{" "}
                          {recommendedMargin[product.id]}%
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}