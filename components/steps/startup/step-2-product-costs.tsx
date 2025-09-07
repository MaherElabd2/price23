"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { useMemo, useRef, useEffect } from "react"
import { Plus, Trash2, Package, DollarSign, TrendingUp } from "lucide-react"
import type { LocalData, Product, CostItem, FixedCost, CostItemType } from "@/types/startup"

import { t as startupT } from "@/lib/startup-translations"

interface StepProps {
  language: string;
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
  updateProduct: (productId: string, updates: Partial<Product>) => void
}

export default function Step2ProductCosts({ localData, updateLocalData, updateProduct }: StepProps) {
  const { language } = useLanguage()

  // Calculate unit variable cost for a product
  const computeUnitVarFromProduct = (p: Product): number => {
    if (!p.costItems?.length) return 0
    return p.costItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  }

  // Alias for compatibility with existing code
  const calculateUnitVariableCost = computeUnitVarFromProduct

  // Calculate monthly quantity for a product
  const calculateMonthlyQuantity = (p: Product): number => {
    // Default to 1 if no quantity information is available
    if (!p.quantity) return 1

    // Handle different quantity types
    switch (p.quantity.type) {
      case "fixed":
        return p.quantity.value || 0
      case "range":
        return ((p.quantity.min || 0) + (p.quantity.max || 0)) / 2
      case "historical":
        const hist = p.quantity.historical
        return hist ? (hist[0] + hist[1] + hist[2]) / 3 : 0
      default:
        return p.quantity.value || 0
    }
  }

  // Memoized calculations
  const burnRateCalculations = useMemo(() => {
    const products: Product[] = localData.products || []
    const fixedCosts: FixedCost[] = localData.fixedCosts || []

    const totalVariableCosts = products.reduce<number>((sum: number, p: Product) => {
      const unitCost = computeUnitVarFromProduct(p)
      const monthlyQty = calculateMonthlyQuantity(p)
      return sum + unitCost * monthlyQty
    }, 0)

    const totalFixedCosts = fixedCosts.reduce<number>(
      (sum: number, cost: FixedCost) => sum + (cost.monthlyAmount || 0),
      0,
    )

    const productFixedCosts = products.reduce<number>((sum: number, p: Product) => {
      const fixedCosts = p.fixedCosts || []
      return sum + fixedCosts.reduce((s: number, c: FixedCost) => s + (c.monthlyAmount || 0), 0)
    }, 0)

    return {
      totalVariableCosts,
      totalFixedCosts,
      productFixedCosts,
      totalBurnRate: totalVariableCosts + totalFixedCosts + productFixedCosts,
    }
  }, [localData.products, localData.fixedCosts])

  // Get sector placeholders from translations
  const getSectorPlaceholder = (sector: string, type: CostItemType): string => {
    return (
      startupT(language, `step2ProductCosts.sectorPlaceholders.${sector}.${type}`) ||
      startupT(language, `step2ProductCosts.sectorPlaceholders.other.${type}`) ||
      startupT(language, "step2ProductCosts.costItemPlaceholder")
    )
  }

  // Auto-update runway in auto mode without causing render loops
  const lastRunwayRef = useRef<number | null>(null)
  useEffect(() => {
    if (localData?.runwayMode !== "auto") return
    const cash = Number(localData.runwayCash) || 0
    const burn = Number(burnRateCalculations.totalBurnRate) || 0
    const calculatedRunway = burn > 0 ? Number((cash / burn).toFixed(2)) : 0
    if (!Number.isFinite(calculatedRunway)) return
    if (lastRunwayRef.current === calculatedRunway) {
      lastRunwayRef.current = calculatedRunway
      return
    }
    if (localData.runwayMonths === calculatedRunway) {
      lastRunwayRef.current = calculatedRunway
      return
    }
    lastRunwayRef.current = calculatedRunway
    updateLocalData({ runwayMonths: calculatedRunway })
  }, [localData.runwayMode, localData.runwayCash, burnRateCalculations.totalBurnRate])

  // Persist pipeline field: unitVarCost (keep unitCost in sync for backward compatibility)
  // Fallback guard to catch any external/in-place changes
  useEffect(() => {
    const products = localData.products || []
    products.forEach((p: Product) => {
      const newUnitVar = computeUnitVarFromProduct(p)
      const prevVar = Number(p.unitVarCost ?? p.unitCost ?? 0)
      if (Math.abs(prevVar - newUnitVar) > 0.01) {
        updateProduct(p.id, { unitVarCost: newUnitVar, unitCost: newUnitVar })
      }
    })
  }, [
    localData.products,
    JSON.stringify(
      (localData.products || []).map((p) => ({
        id: p.id,
        unitCost: p.unitCost,
        itemsLen: p.costItems?.length || 0,
        itemsSum: (p.costItems || []).reduce((s, it) => s + (Number(it?.amount) || 0), 0),
      })),
    ),
  ])

  // Helper functions for product cost management
  const addProductCostItem = (productId: string) => {
    const newItem: CostItem = {
      id: Date.now().toString(),
      name: "",
      amount: 0,
      type: "material",
    }
    const product = (localData.products || []).find((p: Product) => p.id === productId)
    if (!product) return
    const updatedCostItems = [...(product.costItems || []), newItem]
    const nextVar = updatedCostItems.reduce((s: number, it: CostItem) => s + (Number(it?.amount) || 0), 0)
    updateProduct(productId, { costItems: updatedCostItems, unitVarCost: nextVar, unitCost: nextVar })
  }

  const updateProductCostItem = (productId: string, itemId: string, updates: Partial<CostItem>) => {
    const product = (localData.products || []).find((p: Product) => p.id === productId)
    if (!product) return
    const updatedCostItems = (product.costItems || []).map((item: CostItem) =>
      item.id === itemId ? { ...item, ...updates, amount: Number((updates.amount ?? item.amount) || 0) } : item,
    )
    const nextVar = updatedCostItems.reduce((s: number, it: CostItem) => s + (Number(it?.amount) || 0), 0)
    updateProduct(productId, { costItems: updatedCostItems, unitVarCost: nextVar, unitCost: nextVar })
  }

  const removeProductCostItem = (productId: string, itemId: string) => {
    const product = (localData.products || []).find((p: Product) => p.id === productId)
    if (!product) return
    const updatedCostItems = (product.costItems || []).filter((item: CostItem) => item.id !== itemId)
    const nextVar = updatedCostItems.reduce((s: number, it: CostItem) => s + (Number(it?.amount) || 0), 0)
    updateProduct(productId, { costItems: updatedCostItems, unitVarCost: nextVar, unitCost: nextVar })
  }

  // Product-specific fixed costs helpers
  const addProductFixedCost = (productId: string) => {
    const product = (localData.products || []).find((p) => p.id === productId)
    const current = product?.productFixedCosts || []
    const newItem = {
      id: `pfc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: "",
      monthlyAmount: 0,
    }
    updateProduct(productId, { productFixedCosts: [...current, newItem] })
  }

  const updateProductFixedCost = (
    productId: string,
    itemId: string,
    updates: Partial<{ name: string; monthlyAmount: number }>,
  ) => {
    const product = (localData.products || []).find((p) => p.id === productId)
    const current = product?.productFixedCosts || []
    const next = current.map((it) => (it.id === itemId ? { ...it, ...updates } : it))
    updateProduct(productId, { productFixedCosts: next })
  }

  const removeProductFixedCost = (productId: string, itemId: string) => {
    const product = (localData.products || []).find((p) => p.id === productId)
    const current = product?.productFixedCosts || []
    const next = current.filter((it) => it.id !== itemId)
    updateProduct(productId, { productFixedCosts: next })
  }

  return (
    <div className={`space-y-6 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className={language === "ar" ? "text-right" : "text-left"}>
        <h2 className="text-2xl font-bold">{startupT(language, "step2ProductCosts.title")}</h2>
        <p className="text-muted-foreground">{startupT(language, "step2ProductCosts.subtitle")}</p>
      </div>

      {/* Product Unit Costs - Redesigned */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <Package className="h-5 w-5 text-green-600" />
            {startupT(language, "step2ProductCosts.productCostsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
            {startupT(language, "step2ProductCosts.addCostItemDesc")}
          </p>

          {(localData.products || []).map((product: Product, index: number) => {
            const totalUnitCost = calculateUnitVariableCost(product)
            return (
              <Card
                key={product.id}
                className={`border-l-4 ${language === "ar" ? "border-r-4 border-l-0" : ""} border-l-green-500 ${language === "ar" ? "border-r-green-500" : ""}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`text-lg flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <span>{product.name || `${startupT(language, "step1Quantities.productLabel")} ${index + 1}`}</span>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {Number.isFinite(totalUnitCost) ? totalUnitCost.toFixed(2) : "0.00"}{" "}
                      {localData.currency || startupT(language, "common.currency")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(product.costItems || []).map((item: CostItem, itemIndex: number) => (
                      <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                        <div
                          className={`flex items-center justify-between mb-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
                        >
                          <span className="text-sm font-medium">
                            {startupT(language, "step2ProductCosts.costItemLabel")} {itemIndex + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProductCostItem(product.id, item.id)}
                            className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Select
                            value={item.type || "material"}
                            onValueChange={(value) =>
                              updateProductCostItem(product.id, item.id, { type: value as CostItemType })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="material">
                                {startupT(language, "step2ProductCosts.costItemTypes.material")}
                              </SelectItem>
                              <SelectItem value="labor">
                                {startupT(language, "step2ProductCosts.costItemTypes.labor")}
                              </SelectItem>
                              <SelectItem value="shipping">
                                {startupT(language, "step2ProductCosts.costItemTypes.shipping")}
                              </SelectItem>
                              <SelectItem value="commission">
                                {startupT(language, "step2ProductCosts.costItemTypes.commission")}
                              </SelectItem>
                              <SelectItem value="packaging">
                                {startupT(language, "step2ProductCosts.costItemTypes.packaging")}
                              </SelectItem>
                              <SelectItem value="other">
                                {startupT(language, "step2ProductCosts.costItemTypes.other")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder={
                              getSectorPlaceholder(localData.sector || "other", item.type as CostItemType) ||
                              startupT(language, "step2ProductCosts.costItemPlaceholder")
                            }
                            value={item.name || ""}
                            onChange={(e) => updateProductCostItem(product.id, item.id, { name: e.target.value })}
                            className={`h-8 text-sm ${language === "ar" ? "text-right" : "text-left"}`}
                          />
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder={startupT(language, "step2ProductCosts.amountPlaceholder")}
                              value={item.amount || ""}
                              onChange={(e) =>
                                updateProductCostItem(product.id, item.id, { amount: Number(e.target.value) })
                              }
                              className={`h-8 ${language === "ar" ? "pr-8 text-right" : "pl-8 text-left"}`}
                              inputMode="decimal"
                              step="0.01"
                              min="0"
                            />
                            <span
                              className={`absolute ${language === "ar" ? "right-2" : "left-2"} top-1/2 -translate-y-1/2 text-gray-500 text-sm`}
                            >
                              {localData.currency || startupT(language, "common.currency")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => addProductCostItem(product.id)}
                    variant="outline"
                    size="sm"
                    className={`w-full ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {startupT(language, "step2ProductCosts.addCostItemButton")}
                  </Button>

                  {(product.costItems || []).length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded">
                      <div className="text-sm space-y-1">
                        {(product.costItems || []).map((item: CostItem) => (
                          <div
                            key={item.id}
                            className={`flex justify-between text-xs ${language === "ar" ? "flex-row-reverse" : ""}`}
                          >
                            <span>
                              {item.name ||
                                startupT(language, `step2ProductCosts.costItemTypes.${item.type || "other"}`)}
                              :
                            </span>
                            <span>
                              {Number.isFinite(Number(item.amount)) ? (Number(item.amount) || 0).toFixed(2) : "0.00"}{" "}
                              {localData.currency || startupT(language, "common.currency")}
                            </span>
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div
                          className={`flex justify-between font-medium ${language === "ar" ? "flex-row-reverse" : ""}`}
                        >
                          <span>{startupT(language, "step2ProductCosts.totalVariableCostLabel")}</span>
                          <span>
                            {Number.isFinite(totalUnitCost) ? totalUnitCost.toFixed(2) : "0.00"}{" "}
                            {localData.currency || startupT(language, "common.currency")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* Fixed Costs - Reorganized */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <DollarSign className="h-5 w-5 text-blue-600" />
            {startupT(language, "step3CompanyAllocation.totalFixedCosts")} 💰
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
            {startupT(language, "step2ProductCosts.monthlyFixedCostsDesc")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "salaries",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.salaries"),
                icon: "👥",
              },
              {
                key: "rent",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.rent"),
                icon: "🏢",
              },
              {
                key: "utilities",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.utilities"),
                icon: "⚡",
              },
              {
                key: "marketing",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.marketing"),
                icon: "📢",
              },
              {
                key: "insurance",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.insurance"),
                icon: "🛡️",
              },
              {
                key: "software",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.software"),
                icon: "💻",
              },
              {
                key: "other_fixed",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.other_fixed"),
                icon: "📋",
              },
              {
                key: "maintenance",
                label: startupT(language, "step2ProductCosts.fixedCostCategories.maintenance"),
                icon: "🔧",
              },
            ].map((category) => {
              const cost = (localData.fixedCosts || []).find((c: FixedCost) => c.category === category.key) || {
                amount: 0,
              }
              const totalFixed = (localData.fixedCosts || []).reduce(
                (sum: number, c: FixedCost) => sum + (Number(c.amount) || 0),
                0,
              )
              const percentage = totalFixed > 0 ? ((Number(cost.amount) || 0) / totalFixed) * 100 : 0

              return (
                <div key={category.key} className="border rounded-lg p-3 bg-gray-50">
                  <div className={`flex items-center gap-2 mb-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-lg">{category.icon}</span>
                    <Label className="text-sm font-medium">{category.label}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="0"
                      value={cost.amount || ""}
                      onChange={(e) => {
                        const amount = Number(e.target.value)
                        const existingIndex = (localData.fixedCosts || []).findIndex(
                          (c: FixedCost) => c.category === category.key,
                        )
                        const newCosts = [...(localData.fixedCosts || [])]

                        if (existingIndex >= 0) {
                          newCosts[existingIndex] = { ...newCosts[existingIndex], amount, monthlyAmount: amount }
                        } else {
                          const newFixedCost: FixedCost = {
                            id: `fixed-${Date.now()}`,
                            name: "",
                            category: category.key as FixedCost["category"],
                            amount: amount,
                            monthlyAmount: amount,
                          }
                          newCosts.push(newFixedCost)
                        }

                        updateLocalData({ fixedCosts: newCosts })
                      }}
                      className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}
                    />
                    <div className="w-12 text-xs text-gray-600 text-center">
                      {Number.isFinite(percentage) && percentage > 0 ? `${percentage.toFixed(0)}%` : ""}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Custom Fixed Costs Section */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <span>{startupT(language, "step2ProductCosts.customFixedCostsTitle")}</span>
                <Button
                  onClick={() => {
                    const newCost = {
                      id: Date.now().toString(),
                      category: "custom",
                      name: "",
                      amount: 0,
                      monthlyAmount: 0,
                      percentage: 0,
                    }
                    updateLocalData({
                      fixedCosts: [...(localData.fixedCosts || []), newCost],
                    })
                  }}
                  size="sm"
                  variant="outline"
                  className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
                >
                  <Plus className="h-4 w-4" />
                  {startupT(language, "step2ProductCosts.addFixedCostButton")}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm text-gray-600 mb-4 ${language === "ar" ? "text-right" : "text-left"}`}>
                {startupT(language, "step2ProductCosts.addFixedCostDesc")}
              </p>

              {(localData.fixedCosts || [])
                .filter((c: FixedCost) => c.category === "custom")
                .map((cost: FixedCost) => (
                  <div key={cost.id} className="border rounded-lg p-3 bg-purple-50">
                    <div
                      className={`flex items-center justify-between mb-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
                    >
                      <span className="text-sm font-medium">
                        {startupT(language, "step2ProductCosts.customFixedCostsTitle")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedCosts = (localData.fixedCosts || []).filter((c: FixedCost) => c.id !== cost.id)
                          updateLocalData({ fixedCosts: updatedCosts })
                        }}
                        className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">{startupT(language, "step2ProductCosts.costNameLabel")}</Label>
                        <Input
                          placeholder={startupT(language, "step2ProductCosts.costNamePlaceholder")}
                          value={cost.name || ""}
                          onChange={(e) => {
                            const updatedCosts = (localData.fixedCosts || []).map((c: FixedCost) =>
                              c.id === cost.id ? { ...c, name: e.target.value } : c,
                            )
                            updateLocalData({ fixedCosts: updatedCosts })
                          }}
                          className={`h-8 text-sm ${language === "ar" ? "text-right" : "text-left"}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{startupT(language, "step2ProductCosts.monthlyAmountLabel")}</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={cost.amount || ""}
                          onChange={(e) => {
                            const amount = Number(e.target.value)
                            const updatedCosts = (localData.fixedCosts || []).map((c: FixedCost) =>
                              c.id === cost.id ? { ...c, amount, monthlyAmount: amount } : c,
                            )
                            updateLocalData({ fixedCosts: updatedCosts })
                          }}
                          className={`h-8 ${language === "ar" ? "text-right" : "text-left"}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}

              {(localData.fixedCosts || []).filter((c: FixedCost) => c.category === "custom").length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {startupT(language, "step2ProductCosts.noCostItems")}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product-specific fixed costs */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <span>{startupT(language, "step2ProductCosts.productSpecificFixedCostsTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(localData.products || []).map((prod) => (
                <div key={prod.id} className="border rounded p-3 bg-purple-50">
                  <div
                    className={`flex items-center justify-between mb-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="font-medium text-sm">{prod.name}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addProductFixedCost(prod.id)}
                      className={`${language === "ar" ? "flex-row-reverse" : ""}`}
                    >
                      {startupT(language, "step2ProductCosts.addCostButton")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(prod.productFixedCosts || []).length === 0 && (
                      <div className="text-xs text-gray-500">
                        {startupT(language, "step2ProductCosts.noProductSpecificCosts")}
                      </div>
                    )}
                    {(prod.productFixedCosts || []).map((it) => (
                      <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <Label className="text-xs">{startupT(language, "step2ProductCosts.costNameLabel")}</Label>
                          <Input
                            placeholder={startupT(language, "step2ProductCosts.costNamePlaceholder")}
                            value={it.name}
                            onChange={(e) => updateProductFixedCost(prod.id, it.id, { name: e.target.value })}
                            className={`h-8 text-sm ${language === "ar" ? "text-right" : "text-left"}`}
                          />
                        </div>
                        <div className="col-span-4">
                          <Label className="text-xs">
                            {startupT(language, "step2ProductCosts.monthlyAmountLabel")}
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={Number(it.monthlyAmount) || 0}
                            onChange={(e) =>
                              updateProductFixedCost(prod.id, it.id, { monthlyAmount: Number(e.target.value) || 0 })
                            }
                            className={`h-8 ${language === "ar" ? "text-right" : "text-left"}`}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end pt-5">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeProductFixedCost(prod.id, it.id)}
                          >
                            {startupT(language, "step2ProductCosts.deleteButton")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className={`flex justify-between items-center ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <span className="font-semibold">{startupT(language, "step2ProductCosts.totalMonthlyFixedLabel")}:</span>
                <span className="text-lg font-bold text-blue-800">
                  {Number.isFinite(
                    (localData.fixedCosts || []).reduce(
                      (sum: number, c: FixedCost) => sum + (Number(c.amount) || 0),
                      0,
                    ),
                  )
                    ? (localData.fixedCosts || [])
                        .reduce((sum: number, c: FixedCost) => sum + (Number(c.amount) || 0), 0)
                        .toLocaleString()
                    : "0"}{" "}
                  /month
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {startupT(language, "step2ProductCosts.includesAllFixedCosts")}
              </p>

              {/* Breakdown by category */}
              <div className="mt-3 text-xs text-blue-600 space-y-1">
                {(localData.fixedCosts || [])
                  .filter((c: FixedCost) => (c.amount || 0) > 0)
                  .map((cost: FixedCost) => (
                    <div
                      key={cost.id}
                      className={`flex justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}
                    >
                      <span>{cost.category !== "custom" ? cost.category : cost.name || "Custom Cost"}: </span>
                      <span>
                        {Number.isFinite(cost.amount || 0) ? (cost.amount || 0).toLocaleString() : "0"}{" "}
                        {startupT(language, "common.currency")}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Burn Rate Summary */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <TrendingUp className="w-5 h-5" />
            {startupT(language, "step2ProductCosts.monthlyBurnRateTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <span>{startupT(language, "step2ProductCosts.variableCostsLabel")}</span>
            <span>
              {localData.currency || startupT(language, "common.currency")}{" "}
              {burnRateCalculations.totalVariableCosts.toFixed(2)} /month
            </span>
          </div>
          <div className={`flex justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <span>{startupT(language, "step2ProductCosts.fixedCostsLabel")}</span>
            <span>
              {localData.currency || startupT(language, "common.currency")}{" "}
              {(burnRateCalculations.totalFixedCosts + burnRateCalculations.productFixedCosts).toFixed(2)} /month
            </span>
          </div>
          <Separator />
          <div className={`flex justify-between font-bold ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <span>{startupT(language, "step2ProductCosts.totalBurnRateLabel")}</span>
            <span>
              {localData.currency || startupT(language, "common.currency")}{" "}
              {burnRateCalculations.totalBurnRate.toFixed(2)} /month
            </span>
          </div>
          <p className={`text-sm text-muted-foreground ${language === "ar" ? "text-right" : "text-left"}`}>
            {startupT(language, "step2ProductCosts.totalBurnRateDesc")}
          </p>
        </CardContent>
      </Card>

      {/* Total */}
      <Separator />
      <div
        className={`flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200 ${language === "ar" ? "flex-row-reverse" : ""}`}
      >
        <div>
          <div className="text-lg font-bold text-red-800">
            {startupT(language, "step2ProductCosts.totalBurnRateLabel")}
          </div>
          <div className="text-xs text-red-600">{startupT(language, "step2ProductCosts.totalBurnRateDesc")}</div>
        </div>
        <Badge variant="destructive" className="text-xl px-4 py-2">
          {Number.isFinite(burnRateCalculations.totalBurnRate)
            ? burnRateCalculations.totalBurnRate.toLocaleString()
            : "0"}{" "}
          /month
        </Badge>
      </div>
    </div>
  )
}
