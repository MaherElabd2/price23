"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chip } from "@/components/ui/chip"
import { QuestionExplanation } from "@/components/ui/question-explanation"
import { Trash2, Plus, Info } from "lucide-react"
import { t } from "@/lib/translations"

const clamp = (v: number, min = 0, max = 99.9) => Math.min(Math.max(v ?? 0, min), max)
const floatEq = (a: number, b: number, eps = 1e-6) => Math.abs((a ?? 0) - (b ?? 0)) < eps

const sumVariableCostPerUnit = (data: any, productId: string) =>
  (data.variableCosts?.[productId] || []).reduce((sum: number, c: any) => sum + (Number(c?.costPerUnit) || 0), 0)

// الهالك يتطبّق رياضيًا كـ cost / (1 - waste%) علشان تعوّض الفاقد
const applyWaste = (baseCostPerUnit: number, wastePct: number) => {
  const w = clamp(wastePct, 0, 99.9) / 100
  return w <= 0 ? baseCostPerUnit : baseCostPerUnit / (1 - w)
}

const getWasteRateForProduct = (data: any, productId: string) => {
  const mode = data.waste?.mode || "none"
  if (mode === "none") return 0
  if (mode === "global") return Number(data.waste?.valueGlobal) || 0
  if (mode === "perProduct") return Number(data.waste?.valuePerProduct?.[productId]) || 0
  return 0
}

interface Step6Props {
  data: any
  onDataChange: (updates: any) => void
  errors: any
  language: "ar" | "en"
}

export function Step6VariableCosts({ data, onDataChange, errors, language }: Step6Props) {
  const [wasteMode, setWasteMode] = useState(data.waste?.mode || "none")

  useEffect(() => {
    if (!Array.isArray(data.products) || data.products.length === 0) return

    // جهّز نسخة محدّثة من المنتجات بالقيمة المعدّلة
    const updated = data.products.map((p: any) => {
      const base = sumVariableCostPerUnit(data, p.id) // إجمالي البنود/الوحدة قبل الهالك
      const wastePct = getWasteRateForProduct(data, p.id) // نسبة الهالك حسب المود
      const adjusted = applyWaste(base, wastePct) // بعد الهالك

      // خزّن القيمة في حقل معتمد تستخدمه الخطوات اللاحقة
      const next = { ...p, variableCostPerUnit: adjusted, variableCostPerUnitBase: base, wastePct }

      return next
    })

    // امنع حلقات التحديث: ما نكتبش لو مافيش تغيّر فعلي
    const hasChanges = updated.some(
      (p: any, i: number) =>
        !floatEq(p.variableCostPerUnit, data.products[i]?.variableCostPerUnit) ||
        !floatEq(p.variableCostPerUnitBase, data.products[i]?.variableCostPerUnitBase) ||
        !floatEq(p.wastePct, data.products[i]?.wastePct),
    )

    if (hasChanges) {
      onDataChange({ products: updated })
    }
  }, [data, onDataChange]) // استخدام data بدلاً من الخصائص المحددة لحل مشكلة اللينتر

  const addVariableCost = (productId: string) => {
    const currentCosts = data.variableCosts?.[productId] || []
    const newCosts = [...currentCosts, { item: "", costPerUnit: 0 }]
    onDataChange({
      variableCosts: {
        ...data.variableCosts,
        [productId]: newCosts,
      },
    })
  }

  const updateVariableCost = (productId: string, index: number, field: string, value: any) => {
    const currentCosts = [...(data.variableCosts?.[productId] || [])]
    currentCosts[index] = { ...currentCosts[index], [field]: value }
    onDataChange({
      variableCosts: {
        ...data.variableCosts,
        [productId]: currentCosts,
      },
    })
  }

  const removeVariableCost = (productId: string, index: number) => {
    const currentCosts = [...(data.variableCosts?.[productId] || [])]
    currentCosts.splice(index, 1)
    onDataChange({
      variableCosts: {
        ...data.variableCosts,
        [productId]: currentCosts,
      },
    })
  }

  const updateWasteMode = (mode: string) => {
    setWasteMode(mode)
    onDataChange({
      waste: {
        ...data.waste,
        mode,
        valueGlobal: mode === "global" ? data.waste?.valueGlobal || 0 : 0,
        valuePerProduct: mode === "perProduct" ? data.waste?.valuePerProduct || {} : {},
      },
    })
  }

  const getSectorWasteGuidance = () => {
    const sectorBenchmarks = {
      ecommerce: { wasteMin: 2, wasteMax: 5 },
      restaurants: { wasteMin: 8, wasteMax: 15 },
      clothing: { wasteMin: 3, wasteMax: 7 },
      services: { wasteMin: 0, wasteMax: 0 },
      industries: { wasteMin: 5, wasteMax: 10 },
      tech: { wasteMin: 0, wasteMax: 0 },
    }
    return sectorBenchmarks[data.sector as keyof typeof sectorBenchmarks] || { wasteMin: 0, wasteMax: 5 }
  }

  const wasteGuidance = getSectorWasteGuidance()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{t(language, "variableCosts.title")}</h2>
        <p className="text-[#64748b] mt-2">{t(language, "variableCosts.subtitle")}</p>
        {language === "ar" && (
          <QuestionExplanation
            question="ما هي التكاليف المتغيرة؟"
            explanation="دي المصاريف اللي بتدفعها كل مرة تبيع فيها حاجة، يعني بتزيد مع المبيعات وتقل لو مفيش بيع."
            exampleKey="variableCosts"
            sector={data.sector || "general"}
            className="mt-4"
          />
        )}
      </div>

      {data.products?.map((product: any, productIndex: number) => (
        <div key={product.id} className="bg-white border border-[#e5e7eb] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4 flex items-center gap-2">
            {product.name}
            <span className="text-sm text-[#64748b] font-normal">- {t(language, "variableCosts.variableCosts")}</span>
          </h3>

          {errors[`product_${productIndex}_costs`] && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{errors[`product_${productIndex}_costs`]}</p>
            </div>
          )}

          <div className="space-y-4">
            {(data.variableCosts?.[product.id] || []).map((cost: any, index: number) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>{t(language, "variableCosts.itemName")}</Label>
                  {language === "ar" && (
                    <p className="text-[13px] text-[#666] mt-3">اسم المادة أو الخدمة اللي بتدفع فيها لكل قطعة</p>
                  )}
                  <Input
                    value={cost.item}
                    onChange={(e) => updateVariableCost(product.id, index, "item", e.target.value)}
                    placeholder={t(language, "variableCosts.itemNamePlaceholder")}
                    className={errors[`product_${productIndex}_cost_${index}_item`] ? "border-red-500" : ""}
                  />
                  {errors[`product_${productIndex}_cost_${index}_item`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`product_${productIndex}_cost_${index}_item`]}</p>
                  )}
                </div>
                <div className="flex-1">
                  <Label>
                    {t(language, "variableCosts.costPerUnit")} ({data.currency})
                  </Label>
                  {language === "ar" && (
                    <p className="text-[13px] text-[#666] mt-3">كام بتدفع في الحاجة دي لكل قطعة واحدة</p>
                  )}
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cost.costPerUnit}
                    onChange={(e) =>
                      updateVariableCost(product.id, index, "costPerUnit", Number.parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                    className={errors[`product_${productIndex}_cost_${index}_amount`] ? "border-red-500" : ""}
                  />
                  {errors[`product_${productIndex}_cost_${index}_amount`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`product_${productIndex}_cost_${index}_amount`]}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeVariableCost(product.id, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={() => addVariableCost(product.id)} className="w-full">
              <Plus className="w-4 h-4 ml-2" />
              {t(language, "variableCosts.addVariableCost")}
            </Button>

            <div className="bg-[#f9fafb] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t(language, "variableCosts.totalVariableCost")}</span>
                <span className="font-bold text-[#1e3a8a]">
                  {applyWaste(
                    sumVariableCostPerUnit(data, product.id),
                    getWasteRateForProduct(data, product.id),
                  ).toLocaleString()}{" "}
                  {data.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-[#0f172a]">{t(language, "variableCosts.waste")}</h3>
          <div className="group relative">
            <Info className="w-4 h-4 text-[#3b82f6] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[#0f172a] text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              {t(language, "variableCosts.wasteTooltip")}
            </div>
          </div>
        </div>

        {language === "ar" && (
          <p className="text-[13px] text-[#666] mt-3 mb-4">
            الحاجات اللي بتلف أو بتضيع من المواد الخام، زي الخضار اللي بتتقشر أو القماش اللي بيضيع.
          </p>
        )}

        <div className="space-y-4">
          <div>
            <Label>{t(language, "variableCosts.wasteMethod")}</Label>
            <div className="flex gap-2 mt-2">
              <Chip selected={wasteMode === "none"} onClick={() => updateWasteMode("none")}>
                {t(language, "variableCosts.noWaste")}
              </Chip>
              <Chip selected={wasteMode === "global"} onClick={() => updateWasteMode("global")}>
                {t(language, "variableCosts.globalWaste")}
              </Chip>
              <Chip selected={wasteMode === "perProduct"} onClick={() => updateWasteMode("perProduct")}>
                {t(language, "variableCosts.perProductWaste")}
              </Chip>
            </div>
          </div>

          {wasteMode === "global" && (
            <div>
              <Label>{t(language, "variableCosts.globalWasteRate")}</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={data.waste?.valueGlobal || 0}
                onChange={(e) =>
                  onDataChange({
                    waste: {
                      ...data.waste,
                      valueGlobal: Number.parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="0.0"
              />
              <p className="text-xs text-[#64748b] mt-1">
                {t(language, "variableCosts.sectorGuidance")} {wasteGuidance.wasteMin}–{wasteGuidance.wasteMax}%
              </p>
            </div>
          )}

          {wasteMode === "perProduct" && (
            <div className="space-y-4">
              {data.products?.map((product: any) => (
                <div key={product.id}>
                  <Label>
                    {t(language, "variableCosts.wasteRate")} - {product.name} (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={data.waste?.valuePerProduct?.[product.id] || 0}
                    onChange={(e) =>
                      onDataChange({
                        waste: {
                          ...data.waste,
                          valuePerProduct: {
                            ...data.waste?.valuePerProduct,
                            [product.id]: Number.parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    placeholder="0.0"
                  />
                </div>
              ))}
              <p className="text-xs text-[#64748b]">
                {t(language, "variableCosts.sectorGuidance")} {wasteGuidance.wasteMin}–{wasteGuidance.wasteMax}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
