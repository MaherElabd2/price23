"use client"

import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  allocateFixedCosts,
  calculateMonthlyQuantity,
  computeProductUnitCost,
  calculateTotalFixedCosts,
} from "@/lib/calculations"
import type { LocalData } from "@/types/startup"
import { useLanguage } from "@/contexts/language-context"
import { t as startupT } from "@/lib/startup-translations"

interface StepProps {
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
}

export default function Step3CompanyAllocation({ localData, updateLocalData }: StepProps) {
  const { language } = useLanguage()
  const totalMonthlyFixedCosts = calculateTotalFixedCosts(localData.fixedCosts || [])

  // Persist pipeline field: allocatedFixedCostPerUnit (keep fixedCostPerUnit for backward compatibility)
  // Minimal deps to avoid re-renders; use tolerance to reduce churn
  useEffect(() => {
    const products = localData.products || []
    if (products.length === 0) return

    const nextProducts = products.map((p) => {
      const { fixedPerUnit } = computeProductUnitCost(p, localData)
      const prev = Number(p.allocatedFixedCostPerUnit ?? (p as any).fixedCostPerUnit ?? 0)
      if (Math.abs(prev - fixedPerUnit) > 0.01) {
        return { ...p, allocatedFixedCostPerUnit: fixedPerUnit, fixedCostPerUnit: fixedPerUnit }
      }
      return p
    })

    // Only update if something changed
    const changed = nextProducts.some((p, i) => p !== products[i])
    if (changed) {
      updateLocalData({ products: nextProducts })
    }
  }, [localData, updateLocalData])

  // Helpers for Custom Allocation UX
  const products = localData.products || []
  const customShares = { ...(localData.allocationCustom || {}) }
  const sumShares = Object.values(customShares).reduce((s, v) => s + (Number(v) || 0), 0)
  const remaining = Math.max(0, 100 - sumShares)

  const round1 = (n: number) => Math.round((n || 0) * 10) / 10

  const setShare = (productId: string, value: number) => {
    const current = { ...(localData.allocationCustom || {}) }
    const othersSum = Object.entries(current)
      .filter(([k]) => k !== productId)
      .reduce((s, [, v]) => s + (Number(v) || 0), 0)
    const maxAllowed = Math.max(0, 100 - othersSum)
    const clamped = round1(Math.max(0, Math.min(maxAllowed, value)))
    updateLocalData({ allocationCustom: { ...current, [productId]: clamped } })
  }

  // Auto balance: assign the remaining percentage to the product with the largest current share
  const autoBalanceCustom = () => {
    const current = { ...(localData.allocationCustom || {}) }
    if (products.length === 0) return
    const entries = products.map((p) => ({ id: p.id, val: Number(current[p.id] || 0) }))
    const remainingNow = Math.max(0, 100 - entries.reduce((s, e) => s + e.val, 0))
    if (remainingNow <= 0) return
    let target = entries[0]
    for (const e of entries) if (e.val > target.val) target = e
    const othersSum = entries.filter((e) => e.id !== target.id).reduce((s, e) => s + e.val, 0)
    const maxAllowed = Math.max(0, 100 - othersSum)
    const targetNew = Math.max(0, Math.min(maxAllowed, target.val + remainingNow))
    updateLocalData({ allocationCustom: { ...current, [target.id]: +targetNew.toFixed(1) } })
  }

  const distributeEqual = () => {
    if (products.length === 0) return
    const base = Math.floor(1000 / products.length) / 10 // one decimal
    const shares: Record<string, number> = {}
    let acc = 0
    products.forEach((p, i) => {
      if (i < products.length - 1) {
        shares[p.id] = base
        acc += base
      } else {
        shares[p.id] = Math.max(0, +(100 - acc).toFixed(1))
      }
    })
    updateLocalData({ allocationCustom: shares })
  }

  const resetAll = () => {
    const shares: Record<string, number> = {}
    products.forEach((p) => {
      shares[p.id] = 0
    })
    updateLocalData({ allocationCustom: shares })
  }

  const distributeByVariableCost = () => {
    // Use variable cost totals to set proportions
    const totals = products.map((p) => {
      const qty = calculateMonthlyQuantity(p)
      const unitVar = computeProductUnitCost(p, localData).unitVar
      return { id: p.id, total: Math.max(0, unitVar * qty) }
    })
    const sum = totals.reduce((s, t) => s + t.total, 0)
    const shares: Record<string, number> = {}
    if (sum <= 0) {
      distributeEqual()
      return
    }
    let acc = 0
    totals.forEach((t, i) => {
      if (i < totals.length - 1) {
        const pct = Math.floor((t.total / sum) * 1000) / 10
        shares[t.id] = pct
        acc += pct
      } else {
        shares[t.id] = Math.max(0, +(100 - acc).toFixed(1))
      }
    })
    updateLocalData({ allocationCustom: shares })
  }

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${language === "ar" ? "rtl" : "ltr"}`}>
        <div className={`text-center mb-8 ${language === "ar" ? "text-right" : "text-left"}`}>
          <h3 className="text-2xl font-bold mb-2">{startupT(language, "step3CompanyAllocation.title")}</h3>
          <p className="text-gray-600 text-sm">{startupT(language, "step3CompanyAllocation.subtitle")}</p>
        </div>

        {/* Fixed cost allocation selection and preview */}
        <Card>
          <CardHeader className={language === "ar" ? "text-right" : "text-left"}>
            <CardTitle>{startupT(language, "step3CompanyAllocation.totalFixedCosts")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`text-sm text-gray-600 mb-4 ${language === "ar" ? "text-right" : "text-left"}`}>
              {startupT(language, "step3CompanyAllocation.allocationMethodLabel")}
            </div>
            <div className="text-sm text-gray-700">
              <div
                className={`flex items-center justify-between flex-wrap gap-2 mb-3 ${language === "ar" ? "flex-row-reverse" : ""}`}
              >
                <div className="text-gray-600">
                  <span className={language === "ar" ? "ml-1" : "mr-1"}>Sector Recommendation:</span>
                  <span className="font-medium">
                    {(() => {
                      const sector = localData.sector || "other"
                      const recommendationMap: Record<string, string> = {
                        saas: "cost",
                        ecommerce: "cost",
                        restaurants: "units",
                        other: "equal",
                      }
                      const rec = (recommendationMap[sector] || "equal") as "equal" | "units" | "cost" | "custom"
                      const methodLabels = {
                        equal: startupT(language, "step3CompanyAllocation.allocationMethods.equal"),
                        units: startupT(language, "step3CompanyAllocation.allocationMethods.units"),
                        cost: startupT(language, "step3CompanyAllocation.allocationMethods.cost"),
                        custom: startupT(language, "step3CompanyAllocation.allocationMethods.custom"),
                      }
                      return methodLabels[rec]
                    })()}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(
                    [
                      {
                        id: "equal",
                        label: startupT(language, "step3CompanyAllocation.allocationMethods.equal"),
                      },
                      {
                        id: "units",
                        label: startupT(language, "step3CompanyAllocation.allocationMethods.units"),
                      },
                      {
                        id: "cost",
                        label: startupT(language, "step3CompanyAllocation.allocationMethods.cost"),
                      },
                      {
                        id: "custom",
                        label: startupT(language, "step3CompanyAllocation.allocationMethods.custom"),
                      },
                    ] as { id: "equal" | "units" | "cost" | "custom"; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      className={`px-3 py-1 rounded border text-sm ${
                        localData.allocationMethod === opt.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        updateLocalData({ allocationMethod: opt.id as "equal" | "units" | "cost" | "custom" })
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {localData.allocationMethod === "custom" && (
                <div className="mt-4 p-3 border rounded bg-white">
                  <div
                    className={`flex flex-wrap items-center justify-between gap-3 ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="text-xs text-gray-600">
                      {startupT(language, "step3CompanyAllocation.customAllocation.distributed")}:{" "}
                      <span className="font-medium">{Math.min(100, sumShares).toFixed(1)}%</span> ·{" "}
                      {startupT(language, "step3CompanyAllocation.customAllocation.remaining")}:{" "}
                      <span className={`font-medium ${remaining > 0 ? "text-blue-700" : "text-green-700"}`}>
                        {remaining.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-xs rounded border hover:bg-gray-50" onClick={distributeEqual}>
                        {startupT(language, "step3CompanyAllocation.customAllocation.distributeEqual")}
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded border hover:bg-gray-50"
                        onClick={distributeByVariableCost}
                      >
                        {startupT(language, "step3CompanyAllocation.customAllocation.distributeByVariableCost")}
                      </button>
                      <button className="px-3 py-1 text-xs rounded border hover:bg-gray-50" onClick={resetAll}>
                        {startupT(language, "step3CompanyAllocation.customAllocation.resetAll")}
                      </button>
                    </div>
                  </div>
                  {remaining > 0 && (
                    <div className="mt-2 text-[12px] bg-red-50 border border-red-200 text-red-800 rounded px-2 py-1">
                      {startupT(
                        language,
                        "step3CompanyAllocation.customAllocation.incompleteDistributionWarning",
                      ).replace("{value}", remaining.toFixed(1))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preview allocations */}
            <div className="text-sm">
              <div className={`mb-2 font-medium ${language === "ar" ? "text-right" : "text-left"}`}>
                {startupT(language, "step3CompanyAllocation.previewTitle")}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr>
                      <th className={`border border-gray-300 p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {startupT(language, "step3CompanyAllocation.tableHeaders.product")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.quantity")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.variableCosts")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.fixedPercentage")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.productSpecificFixed")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.sharedFixed")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.totalFixed")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.costPerUnit")}
                      </th>
                      <th className="border border-gray-300 p-2 text-end">
                        {startupT(language, "step3CompanyAllocation.tableHeaders.total")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const method = localData.allocationMethod || "equal"
                      const customShares = localData.allocationCustom || {}
                      const productsForAlloc = (localData.products || []).map((p) => ({
                        ...p,
                        qty: calculateMonthlyQuantity(p),
                        unitVarCost: computeProductUnitCost(p, localData).unitVar,
                      }))
                      const allocations = allocateFixedCosts(
                        totalMonthlyFixedCosts,
                        productsForAlloc,
                        method,
                        customShares,
                      )

                      const rows = (localData.products || []).map((product) => {
                        const { unitVar, fixedPerUnit, totalUnitCost } = computeProductUnitCost(product, localData)
                        const qty = calculateMonthlyQuantity(product)
                        const totalVarCost = unitVar * qty
                        // Shared fixed (monthly) from allocation and direct product-specific fixed (monthly)
                        const allocationInfo = allocations.find((a) => a.productId === product.id)
                        const sharedFixed = allocationInfo?.allocatedAmount || 0
                        const directFixed = (
                          Array.isArray(product.productFixedCosts) ? product.productFixedCosts : []
                        ).reduce((sum, fc) => sum + Math.max(0, Number(fc?.monthlyAmount) || 0), 0)
                        const totalFixedForProduct = sharedFixed + directFixed
                        const unitFullCost = totalUnitCost
                        const totalCost = totalUnitCost * qty

                        return (
                          <tr
                            key={product.id}
                            className={
                              Number(localData.allocationCustom?.[product.id] || 0) > 0 ? "bg-white" : "bg-gray-50/30"
                            }
                          >
                            <td
                              className={`border border-gray-300 p-2 ${language === "ar" ? "text-right" : "text-left"}`}
                            >
                              {product.name}
                            </td>
                            <td className="border border-gray-300 p-2 text-end">
                              {Number.isFinite(qty) ? qty.toLocaleString() : "0"}
                            </td>
                            <td className="border border-gray-300 p-2 text-end">
                              {Number.isFinite(totalVarCost) ? Math.round(totalVarCost).toLocaleString() : "0"}{" "}
                              {startupT(language, "common.currency")}
                            </td>
                            <td className="border border-gray-300 p-2 text-end">
                              {method === "custom" ? (
                                <div className="inline-flex items-center gap-1 justify-end">
                                  <Input
                                    type="number"
                                    inputMode="decimal"
                                    className={`h-8 w-24 text-end no-spinner ${language === "ar" ? "text-right" : "text-left"}`}
                                    step={0.1}
                                    min={0}
                                    max={100}
                                    value={
                                      Number.isFinite(localData.allocationCustom?.[product.id] as number)
                                        ? (localData.allocationCustom?.[product.id] as number)
                                        : 0
                                    }
                                    onChange={(e) => setShare(product.id, Number(e.target.value) || 0)}
                                  />
                                  <span className="text-xs text-gray-500">%</span>
                                </div>
                              ) : (
                                <span className="inline-block text-end w-full">
                                  {Number.isFinite(allocationInfo?.allocationRatio)
                                    ? (allocationInfo?.allocationRatio || 0).toFixed(1)
                                    : "0.0"}
                                  %
                                </span>
                              )}
                            </td>
                            <td className="border border-gray-300 p-2 text-end">
                              {Number.isFinite(directFixed) ? Math.round(directFixed).toLocaleString() : "0"}{" "}
                              {startupT(language, "common.currency")}
                            </td>
                            <td className="border border-gray-300 p-2 text-end">
                              {Number.isFinite(sharedFixed) ? Math.round(sharedFixed).toLocaleString() : "0"}{" "}
                              {startupT(language, "common.currency")}
                            </td>
                            <td className="border border-gray-300 p-2 text-end">
                              {Number.isFinite(totalFixedForProduct)
                                ? Math.round(totalFixedForProduct).toLocaleString()
                                : "0"}{" "}
                              {startupT(language, "common.currency")}
                            </td>
                            <td className="border border-gray-300 p-2 text-end">
                              {Number.isFinite(unitFullCost) ? unitFullCost.toFixed(2) : "0.00"}{" "}
                              {startupT(language, "common.currency")}
                            </td>
                            <td className="border border-gray-300 p-2 font-semibold text-end">
                              {Number.isFinite(totalCost) ? Math.round(totalCost).toLocaleString() : "0"}{" "}
                              {startupT(language, "common.currency")}
                            </td>
                          </tr>
                        )
                      })
                      if (method === "custom") {
                        const sum = Object.values(localData.allocationCustom || {}).reduce(
                          (s, v) => s + (Number(v) || 0),
                          0,
                        )
                        rows.push(
                          <tr key="summary" className="bg-gray-50">
                            <td className="border border-gray-300 p-2 font-medium" colSpan={3}>
                              {startupT(language, "step3CompanyAllocation.customAllocation.remaining")}
                            </td>
                            <td className="border border-gray-300 p-2 font-medium text-blue-700">
                              {Math.max(0, 100 - sum).toFixed(1)}%
                            </td>
                            <td className="border border-gray-300 p-2" colSpan={4}></td>
                          </tr>,
                        )
                      }
                      return rows
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
