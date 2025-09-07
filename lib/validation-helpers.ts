/**
 * Consolidated Validation and Input Parsing Utilities
 * Separates validation (checking) from sanitization (formatting/fixing)
 */

import type React from "react"
import type { PricingData } from "./types"
import { t } from "./translations"

export interface ValidationResult {
  isValid: boolean
  error?: string
  raw: string
  value?: number
}

export interface SanitizationResult {
  formatted: string
  value: number
}

export function validateNumericInput(
  input: string | number,
  options: {
    min?: number
    max?: number
    required?: boolean
  } = {},
): ValidationResult {
  const { min, max, required = false } = options
  const raw = String(input)

  // Check if empty and required
  if (raw === "" || raw === null || raw === undefined) {
    if (required) {
      return { isValid: false, error: "Required field", raw }
    }
    return { isValid: true, raw }
  }

  // Check if it's a valid number
  const parsed = typeof input === "string" ? Number.parseFloat(input) : input
  if (!Number.isFinite(parsed)) {
    return { isValid: false, error: "Invalid number", raw }
  }

  // Check range constraints
  if (min !== undefined && parsed < min) {
    return { isValid: false, error: `Value must be at least ${min}`, raw }
  }

  if (max !== undefined && parsed > max) {
    return { isValid: false, error: `Value must be at most ${max}`, raw }
  }

  return { isValid: true, raw, value: parsed }
}

export function sanitizeNumericValue(
  value: number,
  options: {
    decimals?: number
    min?: number
    max?: number
    fallback?: number
  } = {},
): SanitizationResult {
  const { decimals = 2, min, max, fallback = 0 } = options

  let sanitized = value

  // Apply fallback if value is invalid
  if (!Number.isFinite(sanitized)) {
    sanitized = fallback
  }

  // Clamp to min/max if provided
  if (min !== undefined && sanitized < min) {
    sanitized = min
  }
  if (max !== undefined && sanitized > max) {
    sanitized = max
  }

  // Round to specified decimals
  const rounded = Number(sanitized.toFixed(decimals))
  const formatted = rounded.toFixed(decimals).replace(/\.?0+$/, "")

  return { formatted, value: rounded }
}

export function validatePercentage(value: string | number, required = false): ValidationResult {
  return validateNumericInput(value, {
    min: 0,
    max: 100,
    required,
  })
}

export function validateCurrency(value: string | number, required = false): ValidationResult {
  return validateNumericInput(value, {
    min: 0,
    required,
  })
}

export function validateInteger(value: string | number, min = 0, max?: number): ValidationResult {
  const result = validateNumericInput(value, { min, max })
  if (result.isValid && result.value !== undefined) {
    // For integers, we still return the validation result but note it needs rounding
    result.value = Math.round(result.value)
  }
  return result
}

export function createNumericInputHandler(
  onChange: (value: number) => void,
  onError?: (error: string | undefined) => void,
  options: {
    min?: number
    max?: number
    required?: boolean
    decimals?: number
    fallback?: number
  } = {},
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = validateNumericInput(event.target.value, options)

    if (!result.isValid) {
      // Show error but don't update state with fallback
      onError?.(result.error)
      return
    }

    // Clear any previous errors
    onError?.(undefined)

    // If valid, sanitize and update state
    if (result.value !== undefined) {
      const sanitized = sanitizeNumericValue(result.value, options)
      onChange(sanitized.value)
    }
  }
}

export function safeParseFloat(value: string | number, fallback = 0): number {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value
  return Number.isFinite(parsed) ? parsed : fallback
}

export function safeParseInt(value: string | number, fallback = 0): number {
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : value
  return Number.isFinite(parsed) ? parsed : fallback
}

export function formatInputValue(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return ""
  return value.toFixed(decimals).replace(/\.?0+$/, "")
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateStep(step: number, data: PricingData, language: "ar" | "en" = "ar"): Record<string, string> {
  const errors: Record<string, string> = {}

  switch (step) {
    case 0:
      if (!data.personalInfo.name.trim()) {
        errors.name = t(language, "validation.nameRequired")
      }
      if (!data.personalInfo.email.trim()) {
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

    case 1:
      if (!data.customerType.type) {
        errors.customerType = t(language, "validation.customerTypeRequired")
      }
      if (data.customerType.type === "mixed") {
        const ratios = data.customerType.mixRatios
        if (!ratios || Math.abs(ratios.b2c + ratios.b2b + ratios.wholesale - 100) > 0.1) {
          errors.mixRatios = t(language, "validation.mixRatiosInvalid")
        }
      }
      if (data.customerType.type === "b2b" && data.customerType.paymentTerms === "credit") {
        if (!data.customerType.collectionDays || data.customerType.collectionDays <= 0) {
          errors.collectionDays = t(language, "validation.collectionDaysRequired")
        }
      }
      break

    case 3:
      if (data.products.length === 0) {
        errors.products = t(language, "validation.productsRequired")
      }
      data.products.forEach((product, index) => {
        if (!product.name.trim()) {
          errors[`product_${index}_name`] = t(language, "validation.productNameRequired")
        }
        if (product.qty <= 0) {
          errors[`product_${index}_qty`] = t(language, "validation.quantityInvalid")
        }
        if (product.periodDays <= 0) {
          errors[`product_${index}_period`] = t(language, "validation.periodInvalid")
        }
        if (product.periodDays > 365) {
          errors[`product_${index}_period`] = t(language, "validation.periodTooLong")
        }
      })
      break

    case 6:
      data.products.forEach((product, productIndex) => {
        const productCosts = data.variableCosts[product.id] || []
        if (productCosts.length === 0) {
          errors[`product_${productIndex}_costs`] = t(language, "validation.variableCostsRequired")
        }
        productCosts.forEach((cost, costIndex) => {
          if (!cost.item.trim()) {
            errors[`product_${productIndex}_cost_${costIndex}_item`] = t(language, "validation.costItemRequired")
          }
          if (cost.costPerUnit < 0) {
            errors[`product_${productIndex}_cost_${costIndex}_amount`] = t(language, "validation.costAmountInvalid")
          }
        })
      })
      break

    case 7:
      if (data.fixedCosts.length === 0) {
        errors.fixedCosts = t(language, "validation.fixedCostsRequired")
      }
      data.fixedCosts.forEach((cost, index) => {
        if (!cost.item.trim()) {
          errors[`fixed_cost_${index}_item`] = t(language, "validation.fixedCostItemRequired")
        }
        if ((cost.monthlyAmount || 0) <= 0) {
          errors[`fixed_cost_${index}_amount`] = t(language, "validation.fixedCostAmountInvalid")
        }
      })
      break

    case 8:
      if (data.costAllocation?.method === "manual") {
        const totalShares = Object.values(data.costAllocation?.manualRatios || {}).reduce(
          (sum, share) => sum + share,
          0,
        )
        if (Math.abs(totalShares - 100) > 0.1) {
          errors.customShares = t(language, "validation.customSharesInvalid")
        }
      }
      break

    case 9:
      if (data.reportPeriodDays <= 0) {
        errors.reportPeriod = t(language, "validation.reportPeriodInvalid")
      }
      if (data.reportPeriodDays > 365) {
        errors.reportPeriod = t(language, "validation.reportPeriodTooLong")
      }
      break

    case 10:
      if (data.userLevel === "basic") {
        if (data.targets.basic.margin < 0 || data.targets.basic.margin > 100) {
          errors.margin = t(language, "validation.marginInvalid")
        }
        if (data.targets.basic.margin < 5) {
          errors.margin = t(language, "validation.marginTooLow")
        }
      } else {
        data.products.forEach((product, index) => {
          const target = data.targets.advanced[product.id]
          if (target) {
            if (target.mode === "margin" && (target.value < 0 || target.value > 100)) {
              errors[`advanced_margin_${index}`] = t(language, "validation.marginInvalid")
            }
            if (target.mode === "profit" && target.value < 0) {
              errors[`advanced_profit_${index}`] = t(language, "validation.profitInvalid")
            }
            if (target.mode === "targetPrice" && target.value <= 0) {
              errors[`advanced_price_${index}`] = t(language, "validation.targetPriceInvalid")
            }
          }
        })
      }
      break

    case 11:
      if (!data.strategies?.primary) {
        errors.strategy = t(language, "validation.strategyRequired")
      }
      break
  }

  return errors
}

export function validateBusinessLogic(data: PricingData, language: "ar" | "en" = "ar"): string[] {
  const warnings: string[] = []

  if (data.targets.basic.margin > 50) {
    warnings.push(t(language, "validation.highMarginWarning"))
  }

  const totalFixedCosts = data.fixedCosts.reduce((sum, cost) => sum + cost.monthlyAmount, 0)
  const avgVariableCosts =
    data.products.reduce((sum, product) => {
      const productCosts = data.variableCosts[product.id] || []
      return sum + productCosts.reduce((pSum, cost) => pSum + cost.costPerUnit, 0)
    }, 0) / data.products.length

  if (totalFixedCosts > avgVariableCosts * 100) {
    warnings.push(t(language, "validation.highFixedCostsWarning"))
  }

  if (data.competition?.hasDirectCompetitors && data.strategies?.primary === "skimming") {
    warnings.push(t(language, "validation.skimmingWithCompetitionWarning"))
  }

  return warnings
}
