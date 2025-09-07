"use client"

import { SelectableCard } from "@/components/ui/selectable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info, AlertTriangle } from "lucide-react"
import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"
import { validateFixedAllocation, applyFallbackIfInvalid } from "@/lib/calculations"
import { useEffect, useState, useMemo } from "react"

interface Step8Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step8CostAllocation({ data, onDataChange, errors, language }: Step8Props) {
  const [validationAlert, setValidationAlert] = useState<{
    type: "error" | "warning" | null
    message: string
  }>({ type: null, message: "" })

  const allocationMethods = [
    {
      id: "equal",
      name: t(language, "costAllocation.equal"),
      desc: t(language, "costAllocation.equalDesc"),
    },
    {
      id: "volume",
      name: t(language, "costAllocation.volume"),
      desc: t(language, "costAllocation.volumeDesc"),
    },
    {
      id: "revenue",
      name: t(language, "costAllocation.revenue"),
      desc: t(language, "costAllocation.revenueDesc"),
    },
    {
      id: "manual",
      name: t(language, "costAllocation.manual"),
      desc: t(language, "costAllocation.manualDesc"),
    },
  ]

  const normalize = (ratios: Record<string, number>) => {
    const sum = Object.values(ratios).reduce((s, x) => s + x, 0)
    if (sum === 0) return ratios
    const out: Record<string, number> = {}
    for (const k in ratios) out[k] = (ratios[k] / sum) * 100
    return out
  }

  const withFloor = (ratios: Record<string, number>, products: any[], eps = 0.01) => {
    const needFloor = products.filter((p) => (p.qty || 0) > 0 && (ratios[p.id] || 0) === 0)
    if (needFloor.length === 0) return ratios
    const out = { ...ratios }
    const added = eps * needFloor.length
    for (const p of needFloor) out[p.id] = eps
    const others = products.filter((p) => (p.qty || 0) > 0 && !needFloor.includes(p))
    const sumOthers = others.reduce((s, p) => s + (out[p.id] || 0), 0)
    if (sumOthers > 0) {
      for (const p of others) out[p.id] = out[p.id] * ((100 - added) / sumOthers)
    }
    return out
  }

  const floatEq = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps

  const allocation = useMemo(() => {
    if (!data.costAllocation) {
      return {}
    }

    const method = data.costAllocation.method
    const totalProducts = data.products.length

    if (totalProducts === 0 || !method) return {}

    let allocation: Record<string, number> = {}

    switch (method) {
      case "equal":
        allocation = data.products.reduce((acc: any, product: any) => {
          acc[product.id] = 100 / totalProducts
          return acc
        }, {})
        break

      case "volume":
        const totalVolume = data.products.reduce((sum: number, p: any) => sum + (p.qty || 0), 0)
        if (totalVolume === 0) {
          allocation = data.products.reduce((acc: any, product: any) => {
            acc[product.id] = 100 / totalProducts
            return acc
          }, {})
        } else {
          allocation = data.products.reduce((acc: any, product: any) => {
            acc[product.id] = ((product.qty || 0) / totalVolume) * 100
            return acc
          }, {})
        }
        allocation = withFloor(allocation, data.products)
        allocation = normalize(allocation)
        break

      case "revenue": {
        const unitVarCost = (p: any) => p.variableCostPerUnit ?? p.unitVariableCost ?? p.directCost ?? 0

        const totals = data.products.map((p: any) => ({
          id: p.id,
          totalVar: (p.qty || 0) * unitVarCost(p),
        }))

        const sumVar = totals.reduce((s, r) => s + r.totalVar, 0)

        if (sumVar === 0) {
          allocation = data.products.reduce((acc: any, p: any) => {
            acc[p.id] = 100 / totalProducts
            return acc
          }, {})
        } else {
          allocation = totals.reduce((acc: any, r) => {
            acc[r.id] = (r.totalVar / sumVar) * 100
            return acc
          }, {})
        }

        allocation = withFloor(allocation, data.products)
        allocation = normalize(allocation)
        break
      }

      case "manual":
        const manualRatios = data.costAllocation?.manualRatios || {}
        const hasFixedCosts = getTotalFixedCosts() > 0

        allocation = data.products.reduce((acc: any, product: any) => {
          if (product.id in manualRatios) {
            acc[product.id] = manualRatios[product.id]
          } else if (hasFixedCosts) {
            acc[product.id] = 100 / totalProducts
          } else {
            acc[product.id] = 0
          }
          return acc
        }, {})
        break

      default:
        allocation = data.products.reduce((acc: any, product: any) => {
          acc[product.id] = 100 / totalProducts
          return acc
        }, {})
    }

    return allocation
  }, [
    data.costAllocation?.method,
    data.products,
    data.costAllocation,
    data.strategies,
    data.competition?.priceRange?.avg,
  ])

  const totalFixedCosts = getTotalFixedCosts()

  useEffect(() => {
    if (data.products.length > 0 && totalFixedCosts > 0) {
      const allocatedCosts: Record<string, number> = {}

      data.products.forEach((product: any) => {
        const productRatio = allocation[product.id] || 0
        allocatedCosts[product.id] = (totalFixedCosts * productRatio) / 100
      })

      const updatedProducts = data.products.map((p: any) => {
        const allocated = allocatedCosts[p.id] || 0
        const fixedCostPerUnit = allocated / (p.qty || 1)

        return {
          ...p,
          allocatedFixedCost: allocated,
          fixedCostPerUnit: fixedCostPerUnit,
        }
      })

      const hasChanges = updatedProducts.some((product: any, index: number) => {
        const currentProduct = data.products[index]
        return (
          !floatEq(currentProduct.allocatedFixedCost || 0, product.allocatedFixedCost) ||
          !floatEq(currentProduct.fixedCostPerUnit || 0, product.fixedCostPerUnit)
        )
      })

      if (hasChanges) {
        onDataChange({ products: updatedProducts })
      }
    }
  }, [allocation, totalFixedCosts])

  useEffect(() => {
    const productIds = data.products.map((p) => p.id)
    const validation = validateFixedAllocation(allocation, totalFixedCosts, productIds.length)

    if (!validation.isValid) {
      setValidationAlert({
        type: "error",
        message: `خطأ في توزيع التكاليف الثابتة: ${validation.errors.join(", ")}`,
      })

      const fallback = applyFallbackIfInvalid(
        allocation,
        data.costAllocation?.method || "equal",
        totalFixedCosts,
        productIds,
      )

      if (fallback.applied) {
        onDataChange(
          (fallback as any)?.method === "manual"
            ? { costAllocation: { method: "manual", manualRatios: fallback.allocation } }
            : { costAllocation: { method: "equal", manualRatios: {} } },
        )

        setTimeout(() => {
          setValidationAlert({
            type: "warning",
            message: `تم تطبيق التوزيع المتساوي تلقائياً لتفادي فقدان البيانات. السبب: ${fallback.reason}`,
          })
        }, 100)
      }
    } else {
      const hasZeroAllocations = data.products.some((p) => (p.qty || 0) > 0 && (allocation[p.id] || 0) === 0)

      if (hasZeroAllocations) {
        setValidationAlert({
          type: "warning",
          message: `تحذير: هناك منتجات حصلت على قيمة صفرية من التكاليف الثابتة رغم وجود تكاليف. من فضلك راجع التوزيع.`,
        })
      } else {
        setValidationAlert({ type: null, message: "" })
      }
    }
  }, [allocation, totalFixedCosts])

  const updateManualRatio = (productId: string, ratio: number) => {
    const currentRatios = { ...data.costAllocation?.manualRatios }
    currentRatios[productId] = ratio

    onDataChange({
      costAllocation: {
        method: "manual",
        manualRatios: currentRatios,
      },
    })
  }

  const autoDistributeRemaining = () => {
    const currentRatios = { ...data.costAllocation?.manualRatios }
    const currentTotal = Object.values(currentRatios).reduce((sum: number, ratio: any) => sum + (ratio || 0), 0)
    const remaining = 100 - currentTotal

    if (remaining > 0) {
      const productsWithZero = data.products.filter((p) => (currentRatios[p.id] || 0) === 0)
      if (productsWithZero.length > 0) {
        const sharePerProduct = remaining / productsWithZero.length
        productsWithZero.forEach((product) => {
          currentRatios[product.id] = sharePerProduct
        })

        onDataChange({
          costAllocation: {
            method: "manual",
            manualRatios: currentRatios,
          },
        })
      }
    }
  }

  function getTotalFixedCosts() {
    const fixedCosts = (data.fixedCosts || []).reduce((sum: number, cost: any) => sum + (cost.monthlyAmount || 0), 0)
    const depreciation =
      data.depreciation?.assetValue && data.depreciation?.usefulLife
        ? data.depreciation.assetValue / data.depreciation.usefulLife / 12
        : 0
    const rdBudget = data.rdBudget || 0
    return fixedCosts + depreciation + rdBudget
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{t(language, "costAllocation.title")}</h2>
        <p className="text-[#64748b]">{t(language, "costAllocation.subtitle")}</p>
      </div>

      {validationAlert.type && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            validationAlert.type === "error"
              ? "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]"
              : "bg-[#fef3c7] border-[#f59e0b] text-[#92400e]"
          }`}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">{validationAlert.type === "error" ? "خطأ في التوزيع" : "تحذير"}</h4>
            <p className="text-sm">{validationAlert.message}</p>
          </div>
        </div>
      )}

      <div className="bg-[#f1f5f9] border border-[#3b82f6] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-[#0f172a]">{t(language, "costAllocation.totalFixedCosts")}</h3>
          <div className="group relative">
            <Info className="w-4 h-4 text-[#3b82f6] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[#0f172a] text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              {t(language, "costAllocation.totalFixedCostsTooltip")}
            </div>
          </div>
        </div>
        <div className="text-2xl font-bold text-[#1e3a8a]">
          {totalFixedCosts.toLocaleString()} {data.currency}
        </div>
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "costAllocation.chooseMethod")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allocationMethods.map((method) => (
            <SelectableCard
              key={method.id}
              selected={data.costAllocation?.method === method.id}
              onClick={() =>
                onDataChange({
                  costAllocation: {
                    ...data.costAllocation,
                    method: method.id as any,
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

      {data.costAllocation?.method === "manual" && (
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#0f172a]">{t(language, "costAllocation.manualAllocation")}</h3>
            <button
              onClick={autoDistributeRemaining}
              className="px-3 py-1 text-sm bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
            >
              توزيع المتبقي تلقائياً
            </button>
          </div>
          <p className="text-sm text-[#64748b] mb-4">{t(language, "costAllocation.manualInstructions")}</p>

          <div className="space-y-4">
            {data.products.map((product: any) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>{product.name}</Label>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={data.costAllocation?.manualRatios?.[product.id] || allocation[product.id] || 0}
                    onChange={(e) => updateManualRatio(product.id, Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
                <span className="text-[#64748b]">%</span>
              </div>
            ))}

            <div className="mt-4 p-3 bg-[#f9fafb] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t(language, "costAllocation.total")}:</span>
                <span
                  className={`font-bold ${
                    Math.abs(
                      Object.values(data.costAllocation?.manualRatios || {}).reduce(
                        (sum: number, ratio: any) => sum + (ratio || 0),
                        0,
                      ) - 100,
                    ) < 0.1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Object.values(data.costAllocation?.manualRatios || {})
                    .reduce((sum: number, ratio: any) => sum + (ratio || 0), 0)
                    .toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "costAllocation.results")}</h3>

        <div className="space-y-4">
          {data.products.map((product: any) => {
            const productRatio = allocation[product.id] || 0
            const productFixedCost = (totalFixedCosts * productRatio) / 100
            const costPerUnit = product.qty > 0 ? productFixedCost / product.qty : 0

            const allocatedFixedCost = product.allocatedFixedCost ?? productFixedCost
            const fixedCostPerUnit = product.fixedCostPerUnit ?? costPerUnit

            const showWarning = (product.qty || 0) > 0 && productRatio === 0 && totalFixedCosts > 0

            return (
              <div
                key={product.id}
                className={`p-4 rounded-lg ${showWarning ? "bg-[#fef2f2] border border-[#fecaca]" : "bg-[#f9fafb]"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[#0f172a]">{product.name}</h4>
                  {showWarning && (
                    <span className="text-xs text-[#dc2626] bg-[#fecaca] px-2 py-1 rounded">تحذير: توزيع صفري</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#64748b]">{t(language, "costAllocation.allocationRatio")}:</span>
                    <div className="font-medium">{productRatio.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-[#64748b]">{t(language, "costAllocation.monthlyFixedCost")}:</span>
                    <div className="font-medium">
                      {allocatedFixedCost.toLocaleString()} {data.currency}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748b]">{t(language, "costAllocation.expectedQuantity")}:</span>
                    <div className="font-medium">
                      {(product.qty || 0).toLocaleString()} {t(language, "costAllocation.units")}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748b]">{t(language, "costAllocation.fixedCostPerUnit")}:</span>
                    <div className="font-medium text-[#1e3a8a]">
                      {fixedCostPerUnit.toFixed(2)} {data.currency}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-lg p-4">
        <h4 className="font-semibold text-[#92400e] mb-2">{t(language, "costAllocation.guidance")}</h4>
        <ul className="text-sm text-[#92400e] space-y-1">
          <li>
            • <strong>{t(language, "costAllocation.equal")}:</strong> {t(language, "costAllocation.equalGuidance")}
          </li>
          <li>
            • <strong>{t(language, "costAllocation.volume")}:</strong> {t(language, "costAllocation.volumeGuidance")}
          </li>
          <li>
            • <strong>{t(language, "costAllocation.revenue")}:</strong> {t(language, "costAllocation.revenueGuidance")}
          </li>
          <li>
            • <strong>{t(language, "costAllocation.manual")}:</strong> {t(language, "costAllocation.manualGuidance")}
          </li>
        </ul>
      </div>
    </div>
  )
}
