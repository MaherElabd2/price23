import type { PricingData } from "./types"
import { t } from "./translations"

export function validateStep(step: number, data: PricingData, language: "ar" | "en" = "ar"): Record<string, string> {
  const errors: Record<string, string> = {}

  try {
    switch (step) {
      case 0: // Basic Info
        if (!data.personalInfo?.name?.trim()) {
          errors.name = t(language, "validation.nameRequired")
        }
        if (!data.personalInfo?.email?.trim()) {
          errors.email = t(language, "validation.emailRequired")
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
          errors.email = t(language, "validation.emailInvalid")
        }
        if (!data.sector) {
          errors.sector = t(language, "validation.sectorRequired")
        }
        if (!data.productMode) {
          errors.productMode = t(language, "validation.productModeRequired")
        }
        if (!data.currency) {
          errors.currency = t(language, "validation.currencyRequired")
        }
        break

      case 1: // Customer Type
        if (!data.customerType?.type) {
          errors.customerType = t(language, "validation.customerTypeRequired")
        }
        if (data.customerType?.type === "mixed") {
          const ratios = data.customerType.mixRatios
          if (!ratios || Math.abs((ratios.b2c || 0) + (ratios.b2b || 0) + (ratios.wholesale || 0) - 100) > 0.1) {
            errors.mixRatios = t(language, "validation.mixRatiosInvalid")
          }
        }
        if (data.customerType?.type === "b2b" && data.customerType?.paymentTerms === "credit") {
          if (!data.customerType.collectionDays || data.customerType.collectionDays <= 0) {
            errors.collectionDays = t(language, "validation.collectionDaysRequired")
          }
        }
        if (!data.customerType?.customerFocus?.ranked || data.customerType.customerFocus.ranked.length !== 3) {
          errors.customerPriorities =
            language === "ar" ? "يجب اختيار وترتيب 3 أولويات للعميل" : "Must select and rank 3 customer priorities"
        }
        if (data.customerType?.customerFocus?.ranked && data.customerType.customerFocus.ranked.length === 3) {
          const totalWeight = data.customerType.customerFocus.ranked.reduce((sum, priority) => {
            return sum + (data.customerType?.customerFocus?.weights[priority] || 0)
          }, 0)
          if (Math.abs(totalWeight - 100) > 0.1) {
            errors.customerPrioritiesWeights =
              language === "ar" ? "يجب أن يكون مجموع الأوزان = 100%" : "Total weights must equal 100%"
          }
        }
        break

      case 3: // Product Definition
        if (!data.products || data.products.length === 0) {
          errors.products = t(language, "validation.productsRequired")
        } else {
          data.products.forEach((product, index) => {
            if (!product?.name?.trim()) {
              errors[`product_${index}_name`] = t(language, "validation.productNameRequired")
            }
            if (!product?.qty || product.qty <= 0) {
              errors[`product_${index}_qty`] = t(language, "validation.quantityInvalid")
            }
            if (!product?.periodDays || product.periodDays <= 0) {
              errors[`product_${index}_period`] = t(language, "validation.periodInvalid")
            }
            if (product?.periodDays && product.periodDays > 365) {
              errors[`product_${index}_period`] = t(language, "validation.periodTooLong")
            }
          })
        }
        break

      case 5: // Competitors
        if (data.products) {
          data.products.forEach((product, index) => {
            if (product?.competitors?.hasData) {
              const min = Number(product.competitors.min)
              const max = Number(product.competitors.max)

              if (!min || min <= 0 || !Number.isFinite(min)) {
                errors[`product_${index}_competitor_min`] = t(language, "validation.competitorMinRequired")
              }
              if (!max || max <= 0 || !Number.isFinite(max)) {
                errors[`product_${index}_competitor_max`] = t(language, "validation.competitorMaxRequired")
              }
              if (min && max && min >= max) {
                errors[`product_${index}_competitor_range`] = t(language, "validation.competitorMaxMustBeGreater")
              }
              if (min && (min > 1000000 || min < 0.01)) {
                errors[`product_${index}_competitor_min`] = t(language, "validation.competitorPriceTooLarge")
              }
              if (max && (max > 1000000 || max < 0.01)) {
                errors[`product_${index}_competitor_max`] = t(language, "validation.competitorPriceTooLarge")
              }
            }
          })
        }
        break

      case 6: // Variable Costs
        if (data.products) {
          data.products.forEach((product, productIndex) => {
            const productCosts = data.variableCosts?.[product.id] || []
            if (productCosts.length === 0) {
              errors[`product_${productIndex}_costs`] = t(language, "validation.variableCostsRequired")
            }
            productCosts.forEach((cost, costIndex) => {
              if (!cost?.item?.trim()) {
                errors[`product_${productIndex}_cost_${costIndex}_item`] = t(language, "validation.costItemRequired")
              }
              const costValue = Number(cost.costPerUnit)
              if (!Number.isFinite(costValue) || costValue < 0) {
                errors[`product_${productIndex}_cost_${costIndex}_amount`] = t(language, "validation.costAmountInvalid")
              }
              if (costValue > 1000000) {
                errors[`product_${productIndex}_cost_${costIndex}_amount`] = "التكلفة كبيرة جداً - يرجى المراجعة"
              }
            })
          })
        }
        break

      case 7: // Fixed Costs
        if (!data.fixedCosts || data.fixedCosts.length === 0) {
          errors.fixedCosts = t(language, "validation.fixedCostsRequired")
        } else {
          data.fixedCosts.forEach((cost, index) => {
            if (!cost?.item?.trim()) {
              errors[`fixed_cost_${index}_item`] = t(language, "validation.fixedCostItemRequired")
            }
            const amount = Number(cost.monthlyAmount)
            if (!Number.isFinite(amount) || amount <= 0) {
              errors[`fixed_cost_${index}_amount`] = t(language, "validation.fixedCostAmountInvalid")
            }
          })
        }
        break

      case 8: // Cost Allocation
        if (data.costAllocation?.method === "manual") {
          const totalShares = Object.values(data.costAllocation?.manualRatios || {}).reduce(
            (sum, share) => sum + (Number(share) || 0),
            0,
          )
          if (Math.abs(totalShares - 100) > 0.1) {
            errors.customShares = t(language, "validation.customSharesInvalid")
          }
        }
        break

      case 9: // Sales Period
        const reportDays = Number(data.reportPeriodDays)
        if (!Number.isFinite(reportDays) || reportDays <= 0) {
          errors.reportPeriod = t(language, "validation.reportPeriodInvalid")
        }
        if (reportDays > 365) {
          errors.reportPeriod = t(language, "validation.reportPeriodTooLong")
        }
        break

      case 10: // Profit Targets
        if (data.userLevel === "basic") {
          const margin = Number(data.targets?.basic?.margin)
          if (!Number.isFinite(margin) || margin < 0 || margin > 100) {
            errors.margin = t(language, "validation.marginInvalid")
          }
          if (margin < 5) {
            errors.margin = t(language, "validation.marginTooLow")
          }
        } else if (data.products) {
          data.products.forEach((product, index) => {
            const target = data.targets?.advanced?.[product.id]
            if (target) {
              const value = Number(target.value)
              if (target.mode === "margin" && (!Number.isFinite(value) || value < 0 || value > 100)) {
                errors[`advanced_margin_${index}`] = t(language, "validation.marginInvalid")
              }
              if (target.mode === "profit" && (!Number.isFinite(value) || value < 0)) {
                errors[`advanced_profit_${index}`] = t(language, "validation.profitInvalid")
              }
              if (target.mode === "targetPrice" && (!Number.isFinite(value) || value <= 0)) {
                errors[`advanced_price_${index}`] = t(language, "validation.targetPriceInvalid")
              }
            }
          })
        }
        break

      case 11: // Strategy Engine
        if (!data.strategies?.primary) {
          errors.strategy = t(language, "validation.strategyRequired")
        }
        break
    }
  } catch (error) {
    console.error(`[v0] Validation error in step ${step}:`, error)
    errors.general = language === "ar" ? "حدث خطأ في التحقق من البيانات" : "Validation error occurred"
  }

  return errors
}

export function validateBusinessLogic(data: PricingData, language: "ar" | "en" = "ar"): string[] {
  const warnings: string[] = []

  try {
    // Check for unrealistic margins
    const margin = Number(data.targets?.basic?.margin)
    if (Number.isFinite(margin) && margin > 50) {
      warnings.push(t(language, "validation.highMarginWarning"))
    }

    // Check for cost structure issues
    const totalFixedCosts = (data.fixedCosts || []).reduce((sum, cost) => {
      const amount = Number(cost.monthlyAmount)
      return sum + (Number.isFinite(amount) ? amount : 0)
    }, 0)

    if (data.products && data.products.length > 0) {
      const avgVariableCosts =
        data.products.reduce((sum, product) => {
          const productCosts = data.variableCosts?.[product.id] || []
          const productTotal = productCosts.reduce((pSum, cost) => {
            const costValue = Number(cost.costPerUnit)
            return pSum + (Number.isFinite(costValue) ? costValue : 0)
          }, 0)
          return sum + productTotal
        }, 0) / data.products.length

      if (totalFixedCosts > avgVariableCosts * 100) {
        warnings.push(t(language, "validation.highFixedCostsWarning"))
      }
    }

    // Check for pricing strategy alignment
    if (data.competition?.hasDirectCompetitors && data.strategies?.primary === "skimming") {
      warnings.push(t(language, "validation.skimmingWithCompetitionWarning"))
    }
  } catch (error) {
    console.error("[v0] Business logic validation error:", error)
    warnings.push(language === "ar" ? "تحذير: حدث خطأ في فحص منطق الأعمال" : "Warning: Business logic validation error")
  }

  return warnings
}
