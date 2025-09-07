"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Trash2, AlertTriangle, HelpCircle, Package, Percent } from "lucide-react"
import { validateQuantityRealistic, calculateMonthlyQuantity } from "@/lib/calculations"
import { useLanguage } from "@/contexts/language-context"
import { useEffect } from "react"

import { t as startupT } from "@/lib/startup-translations"

// Sector-based quantity methods (prioritized order)
// Normalize to translation keys: use 'uncertain' (not 'unknown')
const sectorQuantityMethods: Record<string, string[]> = {
  saas: ["market", "historical", "range", "uncertain"],
  restaurants: ["capacity", "historical", "range", "uncertain"],
  ecommerce: ["historical", "market", "range", "fixed", "uncertain"],
  fashion: ["range", "historical", "market", "uncertain"],
  services: ["capacity", "historical", "market", "uncertain"],
  industries: ["capacity", "historical", "range", "uncertain"],
  other: ["fixed", "range", "market", "capacity", "historical", "uncertain"],
}

export default function Step1Quantities({ localData, addProduct, updateProduct, removeProduct, updateLocalData }: any) {
  const { language } = useLanguage()

  useEffect(() => {
    // Data migration: Handle legacy 'unknown' quantityType
    localData.products.forEach((product: any) => {
      if (product.quantityType === "unknown") {
        updateProduct(product.id, { quantityType: "uncertain" })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sectorPlaceholders: Record<string, string> = {
    ecommerce: startupT(language, "step1Quantities.sectorPlaceholders.ecommerce"),
    restaurants: startupT(language, "step1Quantities.sectorPlaceholders.restaurants"),
    saas: startupT(language, "step1Quantities.sectorPlaceholders.saas"),
    fashion: startupT(language, "step1Quantities.sectorPlaceholders.fashion"),
    services: startupT(language, "step1Quantities.sectorPlaceholders.services"),
    industries: startupT(language, "step1Quantities.sectorPlaceholders.industries"),
    other: startupT(language, "step1Quantities.sectorPlaceholders.other"),
  }

  // Get available quantity methods for current sector
  const availableMethods = sectorQuantityMethods[localData.sector] || sectorQuantityMethods.other

  const addBundle = () => {
    const newBundle = {
      id: Date.now().toString(),
      name: "",
      productIds: [],
      discountType: "percentage", // percentage or fixed
      discountValue: 0,
      bundlePrice: 0,
    }
    updateLocalData({ bundling: [...(localData.bundling || []), newBundle] })
  }

  const updateBundle = (id: string, updates: any) => {
    const updatedBundles = (localData.bundling || []).map((b: any) => (b.id === id ? { ...b, ...updates } : b))
    updateLocalData({ bundling: updatedBundles })
  }

  const removeBundle = (id: string) => {
    updateLocalData({ bundling: (localData.bundling || []).filter((b: any) => b.id !== id) })
  }

  return (
    <div className={`space-y-6 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className={`text-center mb-8 ${language === "ar" ? "text-right" : "text-left"}`}>
        <h3 className="text-2xl font-bold mb-2">{startupT(language, "step1Quantities.title")}</h3>
        <p className="text-gray-600 text-sm">{startupT(language, "step1Quantities.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <span>{startupT(language, "step1Quantities.productsTitle")}</span>
            <Button
              id="add-product-btn"
              onClick={addProduct}
              size="sm"
              className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <Plus className="h-4 w-4" />
              {startupT(language, "step1Quantities.addProductButton")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {localData.products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{startupT(language, "step1Quantities.noProducts")}</p>
              <p className="text-sm">{startupT(language, "step1Quantities.noProductsDesc")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {localData.products.map((product: any, index: number) => (
                <Card
                  key={product.id}
                  className={`border-l-4 border-l-blue-500 ${language === "ar" ? "border-r-4 border-r-blue-500 border-l-0" : ""}`}
                >
                  <CardContent className="p-4">
                    <div
                      className={`flex items-center justify-between mb-4 ${language === "ar" ? "flex-row-reverse" : ""}`}
                    >
                      <h4 className="font-semibold">
                        {startupT(language, "step1Quantities.productLabel")} {index + 1}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                          <Label className="text-xs">{startupT(language, "step1Quantities.pauseLabel")}</Label>
                          <Switch
                            checked={!!product.paused}
                            onCheckedChange={(v) => updateProduct(product.id, { paused: v })}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className={`text-red-600 hover:text-red-800 ${language === "ar" ? "mr-1" : "ml-1"}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{startupT(language, "step1Quantities.productNameLabel")}</Label>
                        <Input
                          id={`product-name-${product.id}`}
                          placeholder={
                            sectorPlaceholders[localData.sector as keyof typeof sectorPlaceholders] ||
                            sectorPlaceholders.other
                          }
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {startupT(language, "step1Quantities.productNameHint")}
                        </p>
                      </div>

                      <div>
                        <Label>{startupT(language, "step1Quantities.productTypeLabel")}</Label>
                        <p className="text-xs text-gray-500 mb-1">
                          {startupT(language, "step1Quantities.productTypeDesc")}
                        </p>
                        <Select
                          value={product.type}
                          onValueChange={(value) => updateProduct(product.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="core">
                              {startupT(language, "step1Quantities.productTypes.core")}
                            </SelectItem>
                            <SelectItem value="addon">
                              {startupT(language, "step1Quantities.productTypes.addon")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label>{startupT(language, "step1Quantities.descriptionLabel")}</Label>
                        <Textarea
                          placeholder={startupT(language, "step1Quantities.descriptionPlaceholder")}
                          value={product.description}
                          onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {startupT(language, "step1Quantities.descriptionHint")}
                        </p>
                      </div>

                      <div>
                        <Label>{startupT(language, "step1Quantities.preliminaryPriceLabel")}</Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          value={product.preliminaryPrice ?? ""}
                          onChange={(e) => updateProduct(product.id, { preliminaryPrice: Number(e.target.value) })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {startupT(language, "step1Quantities.preliminaryPriceHint")}
                        </p>
                      </div>

                      <div>
                        <Label>{startupT(language, "step1Quantities.selectMethodLabel")}</Label>
                        <div className={`flex gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                          <Select
                            value={product.quantityType === "unknown" ? "uncertain" : product.quantityType}
                            onValueChange={(value) => updateProduct(product.id, { quantityType: value })}
                          >
                            <SelectTrigger id={`product-qtytype-${product.id}`} className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMethods.map((method) => {
                                const key = method === "unknown" ? "uncertain" : method
                                return (
                                  <SelectItem key={String(key)} value={String(key)}>
                                    {startupT(language, `step1Quantities.quantityMethods.${key}`)}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          {product.quantityType && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="px-2 bg-transparent">
                                  <HelpCircle className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                {product.quantityType === "uncertain" && (
                                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-sm text-yellow-800 font-medium mb-2">
                                      {startupT(language, "step1Quantities.uncertainMethod.description")}
                                    </p>
                                    <div className="text-xs text-yellow-700">
                                      {startupT(language, "step1Quantities.uncertainMethod.hint")}
                                    </div>
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>

                      {product.quantityType === "fixed" && (
                        <div>
                          <Label>{startupT(language, "step1Quantities.quantityLabel")}</Label>
                          <p className="text-xs text-gray-500 mb-1">
                            {startupT(language, "step1Quantities.quantityHint")}
                          </p>
                          <Input
                            type="number"
                            placeholder="1000"
                            id={`product-fixed-${product.id}`}
                            min={0}
                            value={product.monthlyQuantity || ""}
                            onChange={(e) => updateProduct(product.id, { monthlyQuantity: Number(e.target.value) })}
                          />
                          {product.monthlyQuantity && Number(product.monthlyQuantity) > 0 && (
                            <>
                              <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                                <span className="font-medium text-green-800">
                                  {startupT(language, "step1Quantities.monthlyQuantityLabel")}:{" "}
                                </span>
                                <span className="text-green-700">
                                  {Number(product.monthlyQuantity).toLocaleString()}{" "}
                                  {startupT(language, "step1Quantities.unitPerMonthSuffix")}
                                </span>
                              </div>
                              {(() => {
                                const validation = validateQuantityRealistic(
                                  localData.sector || "other",
                                  Number(product.monthlyQuantity),
                                  product.type || "core",
                                )
                                if (!validation.isRealistic) {
                                  return (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                      <div
                                        className={`flex items-start gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
                                      >
                                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <p className="text-yellow-800 font-medium">{validation.warning}</p>
                                          {validation.suggestion && (
                                            <p className="text-yellow-700 text-xs mt-1">💡 {validation.suggestion}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                                return null
                              })()}
                            </>
                          )}
                        </div>
                      )}

                      {product.quantityType === "range" && (
                        <div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>{startupT(language, "step1Quantities.rangeMinPlaceholder")}</Label>
                              <Input
                                type="number"
                                placeholder="800"
                                id={`product-range-min-${product.id}`}
                                min={0}
                                value={product.minQuantity || ""}
                                onChange={(e) => updateProduct(product.id, { minQuantity: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>{startupT(language, "step1Quantities.rangeMaxPlaceholder")}</Label>
                              <Input
                                type="number"
                                placeholder="1200"
                                min={0}
                                value={product.maxQuantity || ""}
                                onChange={(e) => updateProduct(product.id, { maxQuantity: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                          {product.minQuantity &&
                            product.maxQuantity &&
                            Number(product.minQuantity) >= 0 &&
                            Number(product.maxQuantity) >= 0 &&
                            Number(product.minQuantity) <= Number(product.maxQuantity) && (
                              <>
                                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                  <span className="font-medium text-blue-800">
                                    {startupT(language, "step1Quantities.averageLabel")}:{" "}
                                  </span>
                                  <span className="text-blue-700">
                                    {Math.round(
                                      (Number(product.minQuantity) + Number(product.maxQuantity)) / 2,
                                    ).toLocaleString()}{" "}
                                    {startupT(language, "step1Quantities.unitPerMonthSuffix")}
                                  </span>
                                  <div className="text-xs text-blue-600 mt-1">
                                    {startupT(language, "step1Quantities.rangeLabel")}:{" "}
                                    {Number(product.minQuantity).toLocaleString()} -{" "}
                                    {Number(product.maxQuantity).toLocaleString()}{" "}
                                    {startupT(language, "step1Quantities.unitsShort")}
                                  </div>
                                </div>
                                {(() => {
                                  const avgQuantity = (Number(product.minQuantity) + Number(product.maxQuantity)) / 2
                                  const validation = validateQuantityRealistic(
                                    localData.sector || "other",
                                    avgQuantity,
                                    product.type || "core",
                                  )
                                  if (!validation.isRealistic) {
                                    return (
                                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                        <div
                                          className={`flex items-start gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
                                        >
                                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-yellow-800 font-medium">{validation.warning}</p>
                                            {validation.suggestion && (
                                              <p className="text-yellow-700 text-xs mt-1">💡 {validation.suggestion}</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                })()}
                              </>
                            )}
                        </div>
                      )}

                      {product.quantityType === "capacity" && (
                        <div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>{startupT(language, "step1Quantities.capacityMaxLabel")}</Label>
                              <p className="text-xs text-gray-500 mb-1">
                                {startupT(language, "step1Quantities.capacityMaxHint")}
                              </p>
                              <Input
                                type="number"
                                placeholder="5000"
                                id={`product-capacity-${product.id}`}
                                min={0}
                                value={product.capacityMax || ""}
                                onChange={(e) => updateProduct(product.id, { capacityMax: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>{startupT(language, "step1Quantities.capacityUtilizationLabel")}</Label>
                              <p className="text-xs text-gray-500 mb-1">
                                {startupT(language, "step1Quantities.capacityUtilizationHint")}
                              </p>
                              <Input
                                type="number"
                                placeholder="70"
                                min={0}
                                max={100}
                                value={product.capacityUtilization || ""}
                                onChange={(e) =>
                                  updateProduct(product.id, { capacityUtilization: Number(e.target.value) })
                                }
                              />
                            </div>
                          </div>
                          {product.capacityMax &&
                            product.capacityUtilization &&
                            Number(product.capacityMax) > 0 &&
                            Number(product.capacityUtilization) > 0 &&
                            Number(product.capacityUtilization) <= 100 && (
                              <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
                                <span className="font-medium text-purple-800">
                                  {startupT(language, "step1Quantities.expectedQuantityLabel")}:
                                </span>
                                <span className="text-purple-700">
                                  {Math.round(
                                    Number(product.capacityMax) * (Number(product.capacityUtilization) / 100),
                                  ).toLocaleString()}{" "}
                                  {startupT(language, "common.unitsPerMonth")}
                                </span>
                                <div className="text-xs text-purple-600 mt-1">
                                  {startupT(language, "step1Quantities.calculationLabel")}:{" "}
                                  {Number(product.capacityMax).toLocaleString()} × {product.capacityUtilization}% ={" "}
                                  {Math.round(
                                    Number(product.capacityMax) * (Number(product.capacityUtilization) / 100),
                                  ).toLocaleString()}
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      {product.quantityType === "market" && (
                        <div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>{startupT(language, "step1Quantities.marketSizeLabel")}</Label>
                              <p className="text-xs text-gray-500 mb-1">
                                {startupT(language, "step1Quantities.marketSizeHint")}
                              </p>
                              <Input
                                type="number"
                                placeholder="10000"
                                id={`product-market-${product.id}`}
                                min={0}
                                value={product.marketSize || ""}
                                onChange={(e) => updateProduct(product.id, { marketSize: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>{startupT(language, "step1Quantities.marketShareLabel")}</Label>
                              <p className="text-xs text-gray-500 mb-1">
                                {startupT(language, "step1Quantities.marketShareHint")}
                              </p>
                              <Input
                                type="number"
                                placeholder="5"
                                min={0}
                                max={100}
                                value={product.marketSharePct || ""}
                                onChange={(e) => updateProduct(product.id, { marketSharePct: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                          {product.marketSize &&
                            product.marketSharePct &&
                            Number(product.marketSize) > 0 &&
                            Number(product.marketSharePct) > 0 &&
                            Number(product.marketSharePct) <= 100 && (
                              <div className="mt-2 p-2 bg-orange-50 rounded text-sm">
                                <span className="font-medium text-orange-800">
                                  {startupT(language, "step1Quantities.expectedQuantityLabel")}:
                                </span>
                                <span className="text-orange-700">
                                  {Math.round(
                                    Number(product.marketSize) * (Number(product.marketSharePct) / 100),
                                  ).toLocaleString()}{" "}
                                  {startupT(language, "common.unitsPerMonth")}
                                </span>
                                <div className="text-xs text-orange-600 mt-1">
                                  {startupT(language, "step1Quantities.calculationLabel")}:{" "}
                                  {Number(product.marketSize).toLocaleString()} × {product.marketSharePct}% ={" "}
                                  {Math.round(
                                    Number(product.marketSize) * (Number(product.marketSharePct) / 100),
                                  ).toLocaleString()}
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      {product.quantityType === "uncertain" && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800 font-medium mb-2">
                            {startupT(language, "step1Quantities.uncertainMethod.description")}
                          </p>
                          <div className="text-xs text-yellow-700">
                            {startupT(language, "step1Quantities.uncertainMethod.hint")}
                          </div>
                        </div>
                      )}

                      {product.quantityType === "historical" && (
                        <>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label>{startupT(language, "step1Quantities.historicalM1")}</Label>
                              <Input
                                type="number"
                                placeholder="900"
                                id={`product-hist-m1-${product.id}`}
                                min={0}
                                value={product.historical?.m1 || ""}
                                onChange={(e) =>
                                  updateProduct(product.id, {
                                    historical: { ...product.historical, m1: Number(e.target.value) },
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>{startupT(language, "step1Quantities.historicalM2")}</Label>
                              <Input
                                type="number"
                                placeholder="1100"
                                min={0}
                                value={product.historical?.m2 || ""}
                                onChange={(e) =>
                                  updateProduct(product.id, {
                                    historical: { ...product.historical, m2: Number(e.target.value) },
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>{startupT(language, "step1Quantities.historicalM3")}</Label>
                              <Input
                                type="number"
                                placeholder="1000"
                                min={0}
                                value={product.historical?.m3 || ""}
                                onChange={(e) =>
                                  updateProduct(product.id, {
                                    historical: { ...product.historical, m3: Number(e.target.value) },
                                  })
                                }
                              />
                            </div>
                          </div>
                          {product.historical?.m1 != null &&
                            product.historical?.m2 != null &&
                            product.historical?.m3 != null &&
                            Number(product.historical.m1) >= 0 &&
                            Number(product.historical.m2) >= 0 &&
                            Number(product.historical.m3) >= 0 && (
                              <div className="mt-2 p-2 bg-indigo-50 rounded text-sm">
                                <span className="font-medium text-indigo-800">
                                  {startupT(language, "step1Quantities.historicalAverageLabel")}:
                                </span>
                                <span className="text-indigo-700">
                                  {Math.round(
                                    (Number(product.historical.m1) +
                                      Number(product.historical.m2) +
                                      Number(product.historical.m3)) /
                                      3,
                                  ).toLocaleString()}{" "}
                                  {startupT(language, "common.unitsPerMonth")}
                                </span>
                                <div className="text-xs text-indigo-600 mt-1">
                                  {startupT(language, "step1Quantities.calculationLabel")}: (
                                  {Number(product.historical.m1).toLocaleString()} +{" "}
                                  {Number(product.historical.m2).toLocaleString()} +{" "}
                                  {Number(product.historical.m3).toLocaleString()}) ÷ 3
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Real Bundling Support */}
          {localData.products.length > 1 && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span>Product Bundling</span>
                  </div>
                  <Button
                    onClick={addBundle}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Bundle
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Create product bundles to offer multiple items together at a discounted price.
                </p>

                {(localData.bundling || []).length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No bundles created yet. Click 'Add Bundle' to start.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(localData.bundling || []).map((bundle: any, index: number) => (
                      <Card key={bundle.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Bundle {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBundle(bundle.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Bundle Name</Label>
                              <Input
                                placeholder="Enter bundle name"
                                value={bundle.name}
                                onChange={(e) => updateBundle(bundle.id, { name: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label>Included Products</Label>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {localData.products.map((product: any) => (
                                  <div key={product.id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`${bundle.id}-${product.id}`}
                                      checked={(bundle.productIds || []).includes(product.id)}
                                      onChange={(e) => {
                                        const productIds = bundle.productIds || []
                                        const newProductIds = e.target.checked
                                          ? [...productIds, product.id]
                                          : productIds.filter((id: string) => id !== product.id)
                                        updateBundle(bundle.id, { productIds: newProductIds })
                                      }}
                                    />
                                    <label htmlFor={`${bundle.id}-${product.id}`} className="text-sm">
                                      {product.name || `Product ${localData.products.indexOf(product) + 1}`}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label>Discount Type</Label>
                              <Select
                                value={bundle.discountType || "percentage"}
                                onValueChange={(value) => updateBundle(bundle.id, { discountType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage</SelectItem>
                                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                                  <SelectItem value="bundle">Bundle Price</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>
                                {bundle.discountType === "bundle"
                                  ? "Bundle Price"
                                  : bundle.discountType === "percentage"
                                    ? "Discount %"
                                    : "Discount Amount"}
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min={0}
                                  max={bundle.discountType === "percentage" ? 100 : undefined}
                                  placeholder={bundle.discountType === "percentage" ? "10" : "50"}
                                  value={
                                    bundle.discountType === "bundle"
                                      ? bundle.bundlePrice || ""
                                      : bundle.discountValue || ""
                                  }
                                  onChange={(e) => {
                                    const value = Number(e.target.value)
                                    if (bundle.discountType === "bundle") {
                                      updateBundle(bundle.id, { bundlePrice: value })
                                    } else {
                                      updateBundle(bundle.id, { discountValue: value })
                                    }
                                  }}
                                />
                                {bundle.discountType === "percentage" && <Percent className="h-4 w-4 text-gray-400" />}
                              </div>
                            </div>
                          </div>

                          {(bundle.productIds || []).length > 0 && (
                            <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                              <span className="font-medium">Products: </span>
                              {(bundle.productIds || [])
                                .map((pid: string) => {
                                  const product = localData.products.find((p: any) => p.id === pid)
                                  return product?.name || "Unknown Product"
                                })
                                .join(" + ")}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Runway Section */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className={`text-lg ${language === "ar" ? "text-right" : ""}`}>
            {startupT(language, "step1Quantities.runway.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`p-3 bg-blue-50 border border-blue-200 rounded ${language === "ar" ? "text-right" : "text-left"}`}
          >
            <p className="text-sm text-blue-800">{startupT(language, "step1Quantities.runway.hint")}</p>
          </div>
          <div>
            <Label className={`mb-2 block ${language === "ar" ? "text-right" : ""}`}>
              {startupT(language, "step1Quantities.runway.calculationMethod")}
            </Label>
            <RadioGroup
              dir={language === "ar" ? "rtl" : "ltr"}
              value={localData.runwayMode || "manual"}
              onValueChange={(v) => updateLocalData({ runwayMode: v })}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="manual" id="runway-mode-manual" />
                <Label htmlFor="runway-mode-manual">{startupT(language, "step1Quantities.runway.manual")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="auto" id="runway-mode-auto" />
                <Label htmlFor="runway-mode-auto">{startupT(language, "step1Quantities.runway.auto")}</Label>
              </div>
            </RadioGroup>
          </div>

          {localData.runwayMode !== "auto" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="runway-manual-months">
                  {startupT(language, "step1Quantities.runway.runwayMonths")}
                </Label>
                <Input
                  type="number"
                  id="runway-manual-months"
                  placeholder={startupT(language, "step1Quantities.runway.runwayMonthsPlaceholder")}
                  min={0}
                  value={localData.manualRunwayMonths ?? ""}
                  onChange={(e) => {
                    const months = e.target.value === "" ? null : Number(e.target.value)
                    updateLocalData({ manualRunwayMonths: months, runway: months })
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {startupT(language, "step1Quantities.runway.calculationHint")}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="runway-cash">{startupT(language, "step1Quantities.runway.availableCash")}</Label>
              <Input
                type="number"
                id="runway-cash"
                placeholder={startupT(language, "step1Quantities.runway.cashPlaceholder")}
                min={0}
                value={localData.runwayCash ?? ""}
                onChange={(e) => updateLocalData({ runwayCash: e.target.value === "" ? null : Number(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">{startupT(language, "step1Quantities.runway.importance")}</p>
            </div>
          )}

          {localData.runwayMode !== "auto" &&
            typeof localData.manualRunwayMonths === "number" &&
            localData.manualRunwayMonths !== null && (
              <div
                className={`p-3 rounded-md text-sm ${language === "ar" ? "text-right" : ""} 
              ${
                localData.manualRunwayMonths < 6
                  ? "bg-red-50 text-red-800"
                  : localData.manualRunwayMonths < 12
                    ? "bg-yellow-50 text-yellow-800"
                    : "bg-green-50 text-green-800"
              }`}
              >
                {localData.manualRunwayMonths < 6
                  ? startupT(language, "step1Quantities.runway.hintShort")
                  : localData.manualRunwayMonths < 12
                    ? startupT(language, "step1Quantities.runway.hintMedium")
                    : startupT(language, "step1Quantities.runway.hintLong")}
              </div>
            )}
        </CardContent>
      </Card>

      {localData.products.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className={`text-lg ${language === "ar" ? "text-right" : ""}`}>
              {startupT(language, "step1Quantities.productSummary.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {localData.products.length === 0 ? (
              <p className="text-center text-gray-500">
                {startupT(language, "step1Quantities.productSummary.noProducts")}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full text-sm ${language === "ar" ? "text-right" : "text-left"}`}>
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">{startupT(language, "step1Quantities.productSummary.productName")}</th>
                      <th className="p-2">{startupT(language, "step1Quantities.productTypeLabel")}</th>
                      <th className="p-2">{startupT(language, "step1Quantities.productStatusLabel")}</th>
                      <th className="p-2">{startupT(language, "step1Quantities.productSummary.monthlyQuantity")}</th>
                      <th className="p-2">{startupT(language, "step1Quantities.descriptionLabel")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localData.products.map((product: any, index: number) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2">
                          {product.name || `${startupT(language, "step1Quantities.productLabel")} ${index + 1}`}
                        </td>
                        <td className="p-2">
                          <Badge variant={product.type === "core" ? "default" : "secondary"}>
                            {startupT(language, `step1Quantities.productTypes.${product.type}`) || product.type}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {product.paused ? (
                            <Badge variant="secondary">
                              {startupT(language, "step1Quantities.productStatuses.paused")}
                            </Badge>
                          ) : (
                            <Badge>{startupT(language, "step1Quantities.productStatuses.active")}</Badge>
                          )}
                        </td>
                        <td className="p-2">
                          {calculateMonthlyQuantity(product).toLocaleString() ||
                            startupT(language, "common.notApplicable")}
                        </td>
                        <td className="p-2">{product.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Uncertain badge */}
            {localData.products.some((p: any) => p.quantityType === "uncertain") && (
              <div className="mt-2 text-xs text-yellow-700 flex items-center gap-2">
                <Badge variant="secondary">Final Recommendation Postponed</Badge>
                Break-even analysis will only be calculated for uncertain products.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sector-specific guidance card */}
      {localData.sector && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className={`text-lg flex items-center gap-2 ${language === "ar" ? "text-right" : ""}`}>
              💡 {startupT(language, "step1Quantities.sectorGuidance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-blue-800 ${language === "ar" ? "text-right" : ""}`}>
              {startupT(language, `step1Quantities.sectorNotes.${localData.sector}`)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
