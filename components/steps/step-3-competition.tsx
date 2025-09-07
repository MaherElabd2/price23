"use client"

import { useState } from "react"
import type { PricingData } from "@/lib/types"
import { Chip } from "@/components/ui/chip"
import { t } from "@/lib/translations"

interface Step3Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step3Competition({ data, onDataChange, errors, language }: Step3Props) {
  const [applyToAllRange, setApplyToAllRange] = useState({ min: 0, max: 0, currency: data.currency })

  const updateProductCompetitors = (productId: string, competitors: any) => {
    const updatedProducts = data.products.map((product) =>
      product.id === productId
        ? {
            ...product,
            competitors: {
              hasData: false,
              ...product.competitors,
              ...competitors,
            },
          }
        : product,
    )
    onDataChange({ products: updatedProducts })
  }

  const applyRangeToAll = () => {
    if (!applyToAllRange.min || !applyToAllRange.max) return

    const updatedProducts = data.products.map((product) => {
      if (product.competitors?.hasData) {
        return {
          ...product,
          competitors: {
            ...product.competitors,
            min: applyToAllRange.min,
            max: applyToAllRange.max,
            currency: applyToAllRange.currency || data.currency,
          },
        }
      }
      return product
    })
    onDataChange({ products: updatedProducts })
  }

  const hasProductsWithData = data.products.some((p) => p.competitors?.hasData)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{t(language, "competitionPerProduct.title")}</h2>
        <p className="text-[#64748b] mb-8">{t(language, "competitionPerProduct.subtitle")}</p>

        {/* Per Product Competitor Data */}
        <div className="space-y-6">
          {data.products.map((product, index) => (
            <div key={product.id} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#0f172a]">{product.name}</h3>
                <span className="text-sm text-[#64748b]">SKU: {product.sku || "N/A"}</span>
              </div>

              {/* Toggle for competitor data */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0f172a] mb-3">
                  {t(language, "competitionPerProduct.hasCompetitorData")}
                </label>
                <div className="flex gap-2">
                  <Chip
                    selected={product.competitors?.hasData === true}
                    onClick={() =>
                      updateProductCompetitors(product.id, {
                        hasData: true,
                        currency: data.currency,
                      })
                    }
                  >
                    {t(language, "competitionPerProduct.yes")}
                  </Chip>
                  <Chip
                    selected={product.competitors?.hasData === false || !product.competitors?.hasData}
                    onClick={() =>
                      updateProductCompetitors(product.id, {
                        hasData: false,
                        min: undefined,
                        max: undefined,
                        source: undefined,
                        collectedAt: undefined,
                        notes: undefined,
                      })
                    }
                  >
                    {t(language, "competitionPerProduct.no")}
                  </Chip>
                </div>
              </div>

              {/* Competitor price inputs */}
              {product.competitors?.hasData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172a] mb-2">
                        {t(language, "competitionPerProduct.minPrice")} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.competitors.min || ""}
                        onChange={(e) =>
                          updateProductCompetitors(product.id, {
                            min: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                          })
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                          errors[`product_${index}_competitor_min`] ? "border-[#dc2626]" : "border-[#e5e7eb]"
                        }`}
                        placeholder="100"
                      />
                      {errors[`product_${index}_competitor_min`] && (
                        <p className="text-[#dc2626] text-sm mt-1">{errors[`product_${index}_competitor_min`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0f172a] mb-2">
                        {t(language, "competitionPerProduct.maxPrice")} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.competitors.max || ""}
                        onChange={(e) =>
                          updateProductCompetitors(product.id, {
                            max: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                          })
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                          errors[`product_${index}_competitor_max`] ? "border-[#dc2626]" : "border-[#e5e7eb]"
                        }`}
                        placeholder="500"
                      />
                      {errors[`product_${index}_competitor_max`] && (
                        <p className="text-[#dc2626] text-sm mt-1">{errors[`product_${index}_competitor_max`]}</p>
                      )}
                    </div>
                  </div>

                  {errors[`product_${index}_competitor_range`] && (
                    <p className="text-[#dc2626] text-sm">{errors[`product_${index}_competitor_range`]}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172a] mb-2">
                        {t(language, "competitionPerProduct.source")}
                      </label>
                      <input
                        type="text"
                        value={product.competitors.source || ""}
                        onChange={(e) =>
                          updateProductCompetitors(product.id, {
                            source: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                        placeholder={t(language, "competitionPerProduct.sourcePlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0f172a] mb-2">
                        {t(language, "competitionPerProduct.dateCollected")}
                      </label>
                      <input
                        type="date"
                        value={product.competitors.collectedAt || ""}
                        onChange={(e) =>
                          updateProductCompetitors(product.id, {
                            collectedAt: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0f172a] mb-2">
                      {t(language, "competitionPerProduct.notes")}
                    </label>
                    <textarea
                      value={product.competitors.notes || ""}
                      onChange={(e) =>
                        updateProductCompetitors(product.id, {
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      rows={2}
                      placeholder={t(language, "competitionPerProduct.notesPlaceholder")}
                    />
                  </div>

                  <p className="text-sm text-[#64748b]">
                    {t(language, "competitionPerProduct.allPricesIn")} {product.competitors.currency || data.currency}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Apply to All Section */}
        {hasProductsWithData && (
          <div className="mt-8 p-6 bg-[#f1f5f9] rounded-lg">
            <h4 className="font-semibold text-[#0f172a] mb-4">{t(language, "competitionPerProduct.applyToAll")}</h4>
            <p className="text-sm text-[#64748b] mb-4">{t(language, "competitionPerProduct.applyToAllDesc")}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-2">
                  {t(language, "competitionPerProduct.minPrice")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={applyToAllRange.min || ""}
                  onChange={(e) =>
                    setApplyToAllRange({
                      ...applyToAllRange,
                      min: e.target.value ? Number.parseFloat(e.target.value) : 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-2">
                  {t(language, "competitionPerProduct.maxPrice")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={applyToAllRange.max || ""}
                  onChange={(e) =>
                    setApplyToAllRange({
                      ...applyToAllRange,
                      max: e.target.value ? Number.parseFloat(e.target.value) : 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  placeholder="500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={applyRangeToAll}
                  disabled={!applyToAllRange.min || !applyToAllRange.max || applyToAllRange.min >= applyToAllRange.max}
                  className="w-full px-6 py-3 bg-[#1e3a8a] text-white rounded-lg font-medium hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t(language, "competitionPerProduct.applyToAll")}
                </button>
              </div>
            </div>
          </div>
        )}

        {!hasProductsWithData && (
          <div className="mt-8 p-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-center">
            <p className="text-[#64748b]">{t(language, "competitionPerProduct.noProductsWithData")}</p>
            <p className="text-sm text-[#64748b] mt-1">{t(language, "competitionPerProduct.addDataFirst")}</p>
          </div>
        )}

        {/* Guidance */}
        <div className="mt-8 p-4 bg-[#f1f5f9] rounded-lg">
          <h4 className="font-semibold text-[#0f172a] mb-2">{t(language, "competitionPerProduct.guidance")}</h4>
          <ul className="text-sm text-[#64748b] space-y-1">
            <li>{t(language, "competitionPerProduct.guidanceText1")}</li>
            <li>{t(language, "competitionPerProduct.guidanceText2")}</li>
            <li>{t(language, "competitionPerProduct.guidanceText3")}</li>
            <li>{t(language, "competitionPerProduct.guidanceText4")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
