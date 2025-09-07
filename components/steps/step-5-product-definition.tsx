"use client"

import { useState } from "react"
import type { PricingData, Product } from "@/lib/types"
import { Chip } from "@/components/ui/chip"
import { t } from "@/lib/translations"

interface Step5Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step5ProductDefinition({ data, onDataChange, errors, language }: Step5Props) {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    desc: "",
    sku: "",
    qty: 0,
    periodDays: 30,
  })

  const periodOptions = [
    { days: 30, label: t(language, "productDefinition.days30") },
    { days: 90, label: t(language, "productDefinition.days90") },
    { days: 180, label: t(language, "productDefinition.days180") },
    { days: 365, label: t(language, "productDefinition.days365") },
  ]

  const addProduct = () => {
    if (!newProduct.name?.trim()) return

    const product: Product = {
      id: `p${Date.now()}`,
      name: newProduct.name,
      desc: newProduct.desc || "",
      sku: newProduct.sku || "",
      qty: newProduct.qty || 0,
      periodDays: newProduct.periodDays || 30,
    }

    onDataChange({
      products: [...data.products, product],
    })

    setNewProduct({
      name: "",
      desc: "",
      sku: "",
      qty: 0,
      periodDays: 30,
    })
  }

  const removeProduct = (id: string) => {
    onDataChange({
      products: data.products.filter((p) => p.id !== id),
    })
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    onDataChange({
      products: data.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })
  }

  const calculateUnitsPerDay = (qty: number, periodDays: number) => {
    if (periodDays === 0) return 0
    return (qty / periodDays).toFixed(2)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{t(language, "productDefinition.title")}</h2>

        {/* Add New Product */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "productDefinition.addProduct")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "productDefinition.productName")} *
              </label>
              <input
                type="text"
                value={newProduct.name || ""}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                placeholder={t(language, "productDefinition.productNamePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "productDefinition.productCode")}
              </label>
              <input
                type="text"
                value={newProduct.sku || ""}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                placeholder={t(language, "productDefinition.productCodePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "productDefinition.quantity")} *
              </label>
              <input
                type="number"
                min="0"
                value={newProduct.qty || ""}
                onChange={(e) => setNewProduct({ ...newProduct, qty: Number.parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                placeholder={t(language, "productDefinition.quantityPlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "productDefinition.period")}
              </label>
              <p className="text-xs text-[#64748b] mb-3">{t(language, "productDefinition.periodHelper")}</p>
              <div className="flex gap-2">
                {periodOptions.map((option) => (
                  <Chip
                    key={option.days}
                    selected={newProduct.periodDays === option.days}
                    onClick={() => setNewProduct({ ...newProduct, periodDays: option.days })}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0f172a] mb-2">
              {t(language, "productDefinition.productDesc")}
            </label>
            <textarea
              value={newProduct.desc || ""}
              onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              rows={3}
              placeholder={t(language, "productDefinition.productDescPlaceholder")}
            />
          </div>

          <button
            onClick={addProduct}
            disabled={!newProduct.name?.trim()}
            className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg font-medium hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t(language, "productDefinition.addProductButton")}
          </button>
        </div>

        {/* Products List */}
        {data.products.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
              {t(language, "productDefinition.addedProducts")}
            </h3>
            <div className="space-y-4">
              {data.products.map((product, index) => (
                <div key={product.id} className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-[#0f172a]">{product.name}</h4>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                    >
                      {t(language, "productDefinition.delete")}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172a] mb-2">
                        {t(language, "productDefinition.expectedQuantity")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={product.qty}
                        onChange={(e) => updateProduct(product.id, { qty: Number.parseInt(e.target.value) || 0 })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                          errors[`product_${index}_qty`] ? "border-[#dc2626]" : "border-[#e5e7eb]"
                        }`}
                      />
                      {errors[`product_${index}_qty`] && (
                        <p className="text-[#dc2626] text-sm mt-1">{errors[`product_${index}_qty`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0f172a] mb-2">
                        {t(language, "productDefinition.periodDays")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={product.periodDays}
                        onChange={(e) =>
                          updateProduct(product.id, { periodDays: Number.parseInt(e.target.value) || 30 })
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                          errors[`product_${index}_period`] ? "border-[#dc2626]" : "border-[#e5e7eb]"
                        }`}
                      />
                      {errors[`product_${index}_period`] && (
                        <p className="text-[#dc2626] text-sm mt-1">{errors[`product_${index}_period`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#64748b] mb-2">
                        {t(language, "productDefinition.unitsPerDay")}
                      </label>
                      <div className="px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#64748b]">
                        {calculateUnitsPerDay(product.qty, product.periodDays)}
                      </div>
                    </div>
                  </div>

                  {product.desc && (
                    <div className="mt-4">
                      <p className="text-sm text-[#64748b]">{product.desc}</p>
                    </div>
                  )}

                  {product.sku && (
                    <div className="mt-2">
                      <span className="text-xs text-[#64748b]">SKU: {product.sku}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.products && (
          <div className="mt-4 p-4 bg-[#fef2f2] border border-[#dc2626] rounded-lg">
            <p className="text-[#dc2626] text-sm">{errors.products}</p>
          </div>
        )}

        {data.products.length === 0 && (
          <div className="text-center py-12 text-[#64748b]">
            <p>{t(language, "productDefinition.noProductsYet")}</p>
            <p className="text-sm mt-1">{t(language, "productDefinition.useFormAbove")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
