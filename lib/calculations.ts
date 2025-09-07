/**
 * Consolidated Calculation Utilities
 * All financial calculations, validations, and helper functions in one place
 */

import type { Product, AdditionalCost, FixedCost, CostItem, LocalData } from "@/types/startup";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ProductProjection {
  productId: string
  productName: string
  projectedUnits: number
  dailyUnits: number
  variableCostPerUnit: number
  totalVariableCost: number
}

export interface FinancialResult {
  productId: string
  productName: string
  projectedUnits: number
  finalPrice: number
  totalRevenue: number
  variableCostPerUnit: number
  totalVariableCosts: number
  productFixedCosts: number
  totalCosts: number
  grossProfit: number
  profitMargin: number
  contributionMargin: number
  contributionRatio: number
  breakevenUnits: number
  breakevenRevenue: number
  breakevenAchievementRatio: number
  fullCostPerUnit: number
}

export interface FixedCostItem {
  id?: string
  item: string
  monthlyAmount: number
  category?: string
  periodMonths?: number
}

export interface AllocationValidationResult {
  isValid: boolean
  hasZeroAllocations: boolean
  totalAllocation: number
  errors: string[]
  warnings: string[]
}

export interface ValidationResult {
  isValid: boolean
  value: number
  error?: string
}

export type AllocationMethod = "equal" | "revenue" | "units" | "custom"

export interface ProductForAllocation {
  id: string
  revenue?: unknown
  units?: unknown
  customPercent?: unknown
}

export interface AllocatedProduct extends ProductForAllocation {
  allocatedFixed: number
}

// ============================================================================
// CORE UTILITY FUNCTIONS
// ============================================================================

/**
 * Safe number conversion with fallback protection
 */
export function asNumber(v: unknown, fallback = 0): number {
  if (v === null || v === undefined || v === "") {
    return fallback
  }
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Safe division with zero-division protection
 */
export function safeDivide(num: unknown, den: unknown, fallback = 0): number {
  const a = asNumber(num)
  const b = asNumber(den)
  if (Math.abs(b) < 1e-10) return fallback
  const r = a / b
  return Number.isFinite(r) ? r : fallback
}

/**
 * Assert finite number with warning
 */
export function assertFinite(label: string, v: unknown): boolean {
  const n = Number(v)
  if (!Number.isFinite(n)) {
    // Non-finite number detected - handled silently
    return false
  }
  return true
}

/**
 * Assert positive number with warning
 */
export function assertPositive(label: string, v: unknown): boolean {
  const n = Number(v)
  if (!Number.isFinite(n) || n < 0) {
    // Non-positive number detected - handled silently
    return false
  }
  return true
}

// ============================================================================
// FORMATTING FUNCTIONS
// ============================================================================

/**
 * Safe EGP currency formatting
 */
export function formatEGP(n: unknown): string {
  const v = asNumber(n, 0)
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(v)
}

/**
 * Format currency with locale-aware formatting
 */
export function formatCurrency(amount: number, currency: string, language: "ar" | "en"): string {
  const locale = language === "ar" ? "ar-EG" : "en-US"

  if (Math.abs(amount) >= 1000000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      notation: "compact",
      compactDisplay: "short",
    }).format(amount)
  }

  if (Math.abs(amount) >= 100000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(amount)
  }

  if (Math.abs(amount) >= 10000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: amount < 100 ? 2 : 0,
  }).format(amount)
}

/**
 * Format number with locale-aware formatting
 */
export function formatNumber(num: number, language: "ar" | "en"): string {
  const locale = language === "ar" ? "ar-EG" : "en-US"

  if (Math.abs(num) >= 1000000) {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(num)
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format break-even number
 */
export function formatBENumber(value: number): string {
  if (!isFinite(value) || value <= 0 || value >= 999999) {
    return "N/A"
  }
  return Math.round(value).toLocaleString()
}

// ============================================================================
// STARTUP-SPECIFIC CALCULATIONS
// ============================================================================

/**
 * Calculate monthly quantity for any product
 */
export function calculateMonthlyQuantity(product: Product): number {
  if (product.paused) return 0
  
  let monthlyQuantity = 0
  switch (product.quantityType) {
    case 'fixed':
      monthlyQuantity = Number(product.monthlyQuantity) || 0
      break
    case 'range':
      if (product.minQuantity != null && product.maxQuantity != null) {
        monthlyQuantity = (Number(product.minQuantity) + Number(product.maxQuantity)) / 2
      }
      break
    case 'capacity':
      if (product.capacityMax != null && product.capacityUtilization != null) {
        monthlyQuantity = Number(product.capacityMax) * (Number(product.capacityUtilization) / 100)
      }
      break
    case 'market':
      if (product.marketSize != null && product.marketSharePct != null) {
        monthlyQuantity = Number(product.marketSize) * (Number(product.marketSharePct) / 100)
      }
      break
    case 'historical':
      if (product.historical?.m1 != null && product.historical?.m2 != null && product.historical?.m3 != null) {
        monthlyQuantity = (Number(product.historical.m1) + Number(product.historical.m2) + Number(product.historical.m3)) / 3
      }
      break
    default:
      monthlyQuantity = 0
  }
  
  return monthlyQuantity
}

/**
 * Calculate unit variable cost for a product
 */
export function calculateUnitVariableCost(product: Product): number {
  if (!product.costItems || product.costItems.length === 0) {
    return Number(product.unitCost) || 0
  }
  return product.costItems.reduce((sum: number, item: CostItem) => sum + (Number(item.amount) || 0), 0)
}

/**
 * Calculate additional costs with proper base handling
 */
export function calculateAdditionalCosts(
  additionalCosts: AdditionalCost[],
  estimatedRevenue: number,
  totalUnits: number,
  totalCosts: number
): number {
  return additionalCosts.reduce((sum: number, c: AdditionalCost) => {
    const calcType = c.calculationType || (c.percentage ? 'percentage' : 'amount')
    const base = c.base || 'revenue'

    if (calcType === 'percentage') {
      const pct = Number(c.percentage) || 0
      let baseAmount = estimatedRevenue
      if (base === 'cost') baseAmount = totalCosts
      if (base === 'units') baseAmount = totalUnits
      return sum + (baseAmount * pct) / 100
    }

    const amt = Number(c.amount) || 0
    if (base === 'units') {
      return sum + amt * totalUnits
    }
    return sum + amt
  }, 0)
}

/**
 * Calculate break-even analysis
 */
export function calculateBreakEven(
  fixedCosts: number,
  variableCostPerUnit: number,
  sellingPrice: number
): { units: number; revenue: number; isViable: boolean } {
  const contributionMargin = sellingPrice - variableCostPerUnit
  
  if (contributionMargin <= 0) {
    return { units: 0, revenue: 0, isViable: false }
  }
  
  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin)
  const breakEvenRevenue = breakEvenUnits * sellingPrice
  
  return {
    units: breakEvenUnits,
    revenue: breakEvenRevenue,
    isViable: contributionMargin > 0
  }
}

/**
 * Calculate LTV (Lifetime Value)
 */
export function calculateLTV(avgPurchaseValue: number, purchaseFrequency: number, customerLifespan: number): number {
  return avgPurchaseValue * purchaseFrequency * customerLifespan
}

/**
 * Calculate CAC (Customer Acquisition Cost)
 */
export function calculateCAC(monthlyMarketingSpend: number, newCustomersPerMonth: number): number {
  if (newCustomersPerMonth <= 0) return 0
  return (monthlyMarketingSpend || 0) / (newCustomersPerMonth || 1)
}

/**
 * Calculate LTV:CAC ratio
 */
export function calculateLTVCACRatio(ltv: number, cac: number): number {
  return cac > 0 ? ltv / cac : 0
}

/**
 * Calculate burn rate
 */
export function calculateBurnRate(fixedCosts: FixedCost[]): number {
  return fixedCosts.reduce((sum, cost) => sum + (cost?.amount || 0), 0)
}

/**
 * Calculate contribution margin
 */
export function calculateContributionMargin(price: number, unitCost: number): number {
  return price > 0 ? ((price - unitCost) / price) * 100 : 0
}

// ============================================================================
// FINANCIAL CALCULATIONS
// ============================================================================

/**
 * Calculate contribution margin per unit
 */
export function calcCMu(price: unknown, variableUnitCost: unknown): number {
  const safePrice = asNumber(price, 0)
  const safeCost = asNumber(variableUnitCost, 0)
  return Math.max(0, safePrice - safeCost)
}

/**
 * Calculate contribution margin ratio
 */
export function calcCMR(price: unknown, variableUnitCost: unknown): number {
  const safePrice = asNumber(price, 0)
  const safeCost = asNumber(variableUnitCost, 0)

  if (safePrice <= 0) return 0
  return Math.max(0, safeDivide(safePrice - safeCost, safePrice))
}

/**
 * Calculate break-even units
 */
export function calcBEUnits(fixedAllocatedTotal: unknown, price: unknown, variableUnitCost: unknown): number {
  const safeFixed = asNumber(fixedAllocatedTotal, 0)
  const safePrice = asNumber(price, 0)
  const safeCost = asNumber(variableUnitCost, 0)

  const cmu = calcCMu(safePrice, safeCost)
  if (cmu <= 0 || safeFixed <= 0) return 0

  const result = safeDivide(safeFixed, cmu)
  return Math.ceil(result)
}

/**
 * Calculate break-even revenue
 */
export function calcBERevenue(fixedAllocatedTotal: unknown, price: unknown, variableUnitCost: unknown): number {
  const safeFixed = asNumber(fixedAllocatedTotal, 0)
  const safePrice = asNumber(price, 0)
  const safeCost = asNumber(variableUnitCost, 0)

  const cmr = calcCMR(safePrice, safeCost)
  if (cmr <= 0 || safeFixed <= 0) return 0

  return safeDivide(safeFixed, cmr)
}

/**
 * Calculate portfolio break-even revenue
 */
export function calcPortfolioBERevenue(
  products: Array<{
    fixedAllocatedTotal: number
    price: number
    variableUnitCost: number
    projectedUnits: number
  }>,
): number {
  if (!products || products.length === 0) return 0

  let totalRevenue = 0
  let totalContribution = 0

  products.forEach((product) => {
    const revenue = (product.projectedUnits || 0) * (product.price || 0)
    const contribution = (product.projectedUnits || 0) * calcCMu(product.price || 0, product.variableUnitCost || 0)
    totalRevenue += revenue
    totalContribution += contribution
  })

  if (totalRevenue <= 0 || totalContribution <= 0) return 0

  const weightedAvgCMR = totalContribution / totalRevenue
  const totalFixedCosts = products.reduce((sum, p) => sum + (p.fixedAllocatedTotal || 0), 0)

  if (weightedAvgCMR <= 0 || totalFixedCosts <= 0) return 0
  return totalFixedCosts / weightedAvgCMR
}

/**
 * Calculate profit margin on cost
 */
export function calcProfitMarginOnCost(netProfit: unknown, totalCost: unknown): number {
  const safeNetProfit = asNumber(netProfit, 0)
  const safeTotalCost = asNumber(totalCost, 0)

  assertFinite("netProfit", safeNetProfit)
  assertFinite("totalCost", safeTotalCost)

  const margin = safeDivide(safeNetProfit, safeTotalCost) * 100
  const roundedMargin = Math.round(margin * 10) / 10

  return Number.isFinite(roundedMargin) ? roundedMargin : 0
}

/**
 * Calculate total profit margin on cost for portfolio
 */
export function calcTotalProfitMarginOnCost(totalRevenue: unknown, totalCosts: unknown): number {
  const safeRevenue = asNumber(totalRevenue, 0)
  const safeCosts = asNumber(totalCosts, 0)

  assertFinite("totalRevenue", safeRevenue)
  assertFinite("totalCosts", safeCosts)

  const totalNetProfit = safeRevenue - safeCosts
  const marginPercent = safeDivide(totalNetProfit, safeCosts) * 100
  const roundedMargin = Math.round(marginPercent * 10) / 10

  return Number.isFinite(roundedMargin) ? roundedMargin : 0
}

// ============================================================================
// COST ALLOCATION
// ============================================================================

/**
 * Calculate total fixed costs
 */
export function calculateTotalFixedCosts(
  fixedCosts: FixedCost[] = [],
  depreciation?: { mode?: string; assetValue?: string | number; usefulLife?: string | number } | number,
  rdBudget?: number,
  reportPeriodDays = 30,
): number {
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => {
    return sum + Math.max(0, cost.monthlyAmount || 0)
  }, 0)

  let monthlyDepreciation = 0
  if (typeof depreciation === 'number') {
    monthlyDepreciation = depreciation
  } else if (depreciation?.mode === "simple" && depreciation?.assetValue && depreciation?.usefulLife) {
    const assetValue = Math.max(0, Number.parseFloat(String(depreciation.assetValue)) || 0)
    const lifeYears = Math.max(1, Number.parseFloat(String(depreciation.usefulLife)) || 1)
    const annualDepreciation = assetValue / lifeYears
    monthlyDepreciation = annualDepreciation / 12
  }

  const monthlyRD = Math.max(0, rdBudget || 0)
  const totalMonthlyFixed = totalFixedCosts + monthlyDepreciation + monthlyRD
  const reportPeriodMonths = Math.max(0, reportPeriodDays / 30)
  return totalMonthlyFixed * reportPeriodMonths
}

/**
 * Validate fixed cost allocation
 */
export function validateFixedAllocation(
  allocationMap: Record<string, number>,
  totalFixed: number,
  productCount: number,
): AllocationValidationResult {
  const result: AllocationValidationResult = {
    isValid: true,
    hasZeroAllocations: false,
    totalAllocation: 0,
    errors: [],
    warnings: [],
  }

  const allocations = Object.values(allocationMap)
  result.totalAllocation = allocations.reduce((sum, val) => sum + (val || 0), 0)

  const zeroCount = allocations.filter((val) => val === 0).length
  if (zeroCount > 0 && totalFixed > 0) {
    result.hasZeroAllocations = true
    result.warnings.push(`${zeroCount} products have zero fixed cost allocation despite having total fixed costs`)
  }

  if (result.totalAllocation === 0 && totalFixed > 0) {
    result.isValid = false
    result.errors.push("All products have zero allocation despite having fixed costs")
  }

  const negativeCount = allocations.filter((val) => val < 0).length
  if (negativeCount > 0) {
    result.isValid = false
    result.errors.push(`${negativeCount} products have negative allocations`)
  }

  return result
}

/**
 * Allocate fixed costs to products
 */
export function allocateFixedCosts(
  totalFixedCosts: number,
  products: any[],
  allocationMethod = "equal",
  customShares?: Record<string, number>,
  finalPrices?: Record<string, number>,
): { productId: string; allocatedAmount: number; allocationRatio: number; hasWarning: boolean }[] {
  if (!Array.isArray(products) || products.length === 0) {
    return []
  }

  const safeTotalFixedCosts = Math.max(0, Number(totalFixedCosts) || 0)

  if (safeTotalFixedCosts === 0) {
    return products.map((product) => ({
      productId: product?.id || "",
      allocatedAmount: 0,
      allocationRatio: 0,
      hasWarning: false,
    }))
  }

  const ratios: Record<string, number> = {}
  let hasWarning = false
  const equalShare = 100 / products.length

  try {
    switch (allocationMethod) {
      case "equal":
        products.forEach((product) => {
          ratios[product?.id || ""] = equalShare
        })
        break

      case "volume":
        const totalVolume = products.reduce((sum, p) => {
          const qty = Number(p?.qty) || 0
          return sum + Math.max(0, qty)
        }, 0)

        if (totalVolume > 0) {
          products.forEach((product) => {
            const productVolume = Math.max(0, Number(product?.qty) || 0)
            ratios[product?.id || ""] = (productVolume / totalVolume) * 100
          })
        } else {
          products.forEach((product) => {
            ratios[product?.id || ""] = equalShare
          })
          hasWarning = true
        }
        break

      case "revenue":
        const revenues = products.map((p) => {
          const revenue = Math.max(0, Number(p?.revenue) || 0)
          return revenue
        })
        const totalRevenue = revenues.reduce((sum, rev) => sum + rev, 0)

        if (totalRevenue > 0) {
          products.forEach((product, index) => {
            const productRevenue = revenues[index]
            const ratio = (productRevenue / totalRevenue) * 100
            ratios[product?.id || ""] = ratio
          })
        } else {
          products.forEach((product) => {
            ratios[product?.id || ""] = equalShare
          })
          hasWarning = true
        }
        break

      case "manual":
        if (customShares && typeof customShares === "object") {
          const totalCustom = Object.values(customShares).reduce((sum, val) => {
            const numVal = Number(val) || 0
            return sum + Math.max(0, numVal)
          }, 0)

          if (totalCustom > 0) {
            products.forEach((product) => {
              const customValue = Math.max(0, Number(customShares[product?.id || ""]) || 0)
              ratios[product?.id || ""] = (customValue / totalCustom) * 100
            })
          } else {
            products.forEach((product) => {
              ratios[product?.id || ""] = equalShare
            })
            hasWarning = true
          }
        } else {
          products.forEach((product) => {
            ratios[product?.id || ""] = equalShare
          })
          hasWarning = true
        }
        break

      default:
        products.forEach((product) => {
          ratios[product?.id || ""] = equalShare
        })
        hasWarning = true
    }

    const totalRatio = Object.values(ratios).reduce((sum, ratio) => sum + (Number(ratio) || 0), 0)
    if (Math.abs(totalRatio - 100) > 0.001 && totalRatio > 0) {
      const factor = 100 / totalRatio
      Object.keys(ratios).forEach((key) => {
        ratios[key] = (ratios[key] || 0) * factor
      })

      // Final adjustment for rounding errors
      const adjustedTotal = Object.values(ratios).reduce((sum, ratio) => sum + (Number(ratio) || 0), 0)
      const roundingError = 100 - adjustedTotal
      if (Math.abs(roundingError) > 0.0001 && products.length > 0) {
        const firstProductId = products[0]?.id || ""
        if (firstProductId) {
          ratios[firstProductId] = (ratios[firstProductId] || 0) + roundingError
        }
      }
    }

    const results = products.map((product) => {
      const productId = product?.id || ""
      const ratio = ratios[productId] || 0
      return {
        productId,
        allocatedAmount: (safeTotalFixedCosts * ratio) / 100,
        allocationRatio: ratio,
        hasWarning,
      }
    })

    const totalAllocated = results.reduce((sum, r) => sum + (Number(r.allocatedAmount) || 0), 0)
    const difference = safeTotalFixedCosts - totalAllocated

    if (Math.abs(difference) > 0.01 && results.length > 0) {
      const largestIndex = results.reduce((maxIndex, result, index) => {
        const currentAmount = Number(result.allocatedAmount) || 0
        const maxAmount = Number(results[maxIndex].allocatedAmount) || 0
        return currentAmount > maxAmount ? index : maxIndex
      }, 0)
      results[largestIndex].allocatedAmount = (results[largestIndex].allocatedAmount || 0) + difference
    }

    return results
  } catch (error) {
    // Cost allocation error - handled silently
    // Return equal distribution as fallback
    return products.map((product) => ({
      productId: product?.id || "",
      allocatedAmount: safeTotalFixedCosts / products.length,
      allocationRatio: equalShare,
      hasWarning: true,
    }))
  }
}

// ============================================================================
// PRODUCT COST CALCULATIONS
// ============================================================================

/**
 * Compute product unit cost
 */
export function computeProductUnitCost(product: Product, localData?: LocalData) {
  const unitVar = (product.costItems || []).reduce((s, i: any) => s + (Number(i.amount) || 0), 0)
  const monthlyQty = Number((product as any).monthlyQuantity) || 0
  // Product specific fixed costs monthly
  const productSpecificMonthly = (Array.isArray((product as any).productFixedCosts) ? (product as any).productFixedCosts : [])
    .reduce((s: number, fc: any) => s + Math.max(0, Number(fc?.monthlyAmount) || 0), 0)
  const productSpecificPerUnit = monthlyQty > 0 ? productSpecificMonthly / monthlyQty : 0
  // Shared fixed per unit (rough estimation if localData provided)
  let sharedPerUnit = 0
  if (localData && Array.isArray(localData.fixedCosts)) {
    const sharedMonthly = (localData.fixedCosts || []).reduce((s: number, c: any) => s + (Number(c.amount) || 0), 0)
    const totalUnits = (localData.products || []).reduce((sum, p: any) => sum + (Number(p.monthlyQuantity) || 0), 0)
    sharedPerUnit = totalUnits > 0 ? sharedMonthly / totalUnits : 0
  }
  const fixedPerUnit = productSpecificPerUnit + sharedPerUnit
  const totalUnitCost = unitVar + fixedPerUnit
  return { unitVar, fixedPerUnit, totalUnitCost }
}

// ============================================================================
// PRICING STRATEGIES
// ============================================================================

/**
 * Sector benchmarks
 */
export const sectorBenchmarks: Record<string, { gross: string; startupMin: string; note: string }> = {
  ecommerce:  { gross: '15-25%', startupMin: '15%', note: 'ركز على تكاليف الشحن والتخزين' },
  restaurants:{ gross: '3-9%',   startupMin: '5%',  note: 'تحكم في تكلفة المواد الخام والعمالة' },
  saas:       { gross: '70-85%', startupMin: '60%', note: 'استثمر في الاحتفاظ بالعملاء' },
  fashion:    { gross: '4-13%',  startupMin: '8%',  note: 'إدارة المخزون والموسمية' },
  services:   { gross: '10-20%', startupMin: '12%', note: 'ركز على قيمة الخدمة المقدمة' },
  industries: { gross: '5-15%',  startupMin: '8%',  note: 'تحسين العمليات والكفاءة' },
  other:      { gross: '10-20%', startupMin: '10%', note: 'حلل منافسيك بعناية' },
}

/**
 * Parse startup minimum percentage
 */
export function parseStartupMinPercent(input?: string): number {
  if (!input) return 0
  const match = String(input).match(/\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : 0
}

/**
 * Infer differentiation level
 */
export function inferDifferentiationLevel(points?: unknown): 'low' | 'medium' | 'high' {
  const arr = Array.isArray(points) ? points : []
  const count = arr.length
  if (count >= 5) return 'high'
  if (count >= 2) return 'medium'
  return 'low'
}

/**
 * Get recommended strategy
 */
export function getRecommendedStrategy(args: {
  sector?: string
  stage?: string
  goal?: string
  priceSensitivity?: 'high' | 'medium' | 'low'
  differentiationLevel?: 'low' | 'medium' | 'high'
  runwayMonths?: number
}): 'cost_plus' | 'competitive' | 'value_based' | 'penetration' {
  const sector = args.sector || 'other'
  const sensitivity = args.priceSensitivity || 'medium'
  const diff = args.differentiationLevel || 'low'
  const runway = Math.max(0, Number(args.runwayMonths || 0))
  const goal = args.goal || ''

  if (goal === 'test_market' || runway < 6) return 'penetration'
  if (diff === 'high' && sensitivity !== 'high') return 'value_based'
  if (sector === 'ecommerce' || sensitivity === 'high') return 'competitive'
  return 'cost_plus'
}

/**
 * Get recommended margin
 */
export function getRecommendedMargin(args: { sector?: string; runwayMonths?: number; ltvToCac?: number }): number {
  const sector = args.sector || 'other'
  const runway = Math.max(0, Number(args.runwayMonths || 0))
  const ratio = Math.max(0, Number(args.ltvToCac || 0))

  let base = parseStartupMinPercent(sectorBenchmarks[sector]?.startupMin) || 10
  if (ratio >= 3) base += 10
  else if (ratio >= 2) base += 5
  if (runway < 6) base += 5
  return Math.min(80, Math.max(base, 5))
}

/**
 * Calculate price by strategy
 */
export function calculatePriceByStrategy(
  strategy: string,
  unitCost: number,
  avgCompetitorPrice: number,
  marginPct?: number,
  customMargin?: number,
): number {
  const cost = Math.max(0, Number(unitCost) || 0)
  const comp = Math.max(0, Number(avgCompetitorPrice) || 0)
  const m = Math.max(0, Number(marginPct ?? customMargin ?? 0) || 0)
  switch (strategy) {
    case 'cost_plus':
      return cost * (1 + m / 100)
    case 'competitive':
      return comp > 0 ? comp * 0.95 : cost * 1.25
    case 'penetration':
      return comp > 0 ? comp * 0.8 : cost * 1.15
    case 'value_based':
      return (comp > 0 ? comp : cost * 1.4) * 1.2
    default:
      return cost * 1.3
  }
}

/**
 * Calculate final price with secondary strategies
 */
export function calculateFinalPrice(basePrice: number, secondaryStrategies: string[] = []): number {
  let p = Number(basePrice) || 0
  for (const s of secondaryStrategies) {
    switch (s) {
      case 'psychological':
        p = Math.floor(p / 100) * 100 + 99
        break
      case 'bundle':
        p = p * 0.95
        break
      case 'dynamic':
        p = p * 1.1
        break
      case 'skimming':
        p = p * 1.2
        break
      default:
        break
    }
  }
  return p
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate numeric input
 */
export function validateNumericInput(
  value: string | number,
  options: {
    min?: number
    max?: number
    required?: boolean
    decimals?: number
    fallback?: number
  } = {},
): ValidationResult {
  const { min, max, required = false, decimals = 2, fallback = 0 } = options

  // Handle empty values
  if (value === "" || value === null || value === undefined) {
    if (required) {
      return { isValid: false, value: fallback, error: "This field is required" }
    }
    return { isValid: true, value: fallback }
  }

  // Parse the value
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value

  // Check if it's a valid number
  if (!Number.isFinite(parsed)) {
    return { isValid: false, value: fallback, error: "Please enter a valid number" }
  }

  // Apply decimal precision
  const rounded = Number(parsed.toFixed(decimals))

  // Check min constraint
  if (min !== undefined && rounded < min) {
    return { isValid: false, value: min, error: `Value must be at least ${min}` }
  }

  // Check max constraint
  if (max !== undefined && rounded > max) {
    return { isValid: false, value: max, error: `Value must be at most ${max}` }
  }

  return { isValid: true, value: rounded }
}

/**
 * Validate percentage input
 */
export function validatePercentage(value: string | number, required = false): ValidationResult {
  return validateNumericInput(value, {
    min: 0,
    max: 100,
    required,
    decimals: 2,
    fallback: 0,
  })
}

/**
 * Validate currency input
 */
export function validateCurrency(value: string | number, required = false): ValidationResult {
  return validateNumericInput(value, {
    min: 0,
    required,
    decimals: 2,
    fallback: 0,
  })
}

/**
 * Validate integer input
 */
export function validateInteger(value: string | number, min = 0, max?: number): ValidationResult {
  const result = validateNumericInput(value, { min, max, decimals: 0 })
  if (result.isValid) {
    result.value = Math.round(result.value)
  }
  return result
}

// ============================================================================
// SECTOR VALIDATION
// ============================================================================

/**
 * Validate quantity realistic for sector
 */
export function validateQuantityRealistic(
  sector: string,
  monthlyQuantity: number,
  productType: 'core' | 'addon'
): { isRealistic: boolean; warning?: string; suggestion?: string } {
  const sectorLimits: Record<string, { min: number; max: number; typical: number }> = {
    restaurants: { min: 100, max: 10000, typical: 2000 },
    ecommerce: { min: 50, max: 50000, typical: 5000 },
    saas: { min: 10, max: 5000, typical: 500 },
    services: { min: 5, max: 1000, typical: 100 },
    fashion: { min: 20, max: 20000, typical: 2000 },
    industries: { min: 100, max: 100000, typical: 10000 },
    other: { min: 10, max: 100000, typical: 1000 }
  }
  
  const limits = sectorLimits[sector] || sectorLimits.other
  const adjustedMax = productType === 'addon' ? limits.max * 0.3 : limits.max
  const adjustedTypical = productType === 'addon' ? limits.typical * 0.3 : limits.typical
  
  if (monthlyQuantity < limits.min) {
    return {
      isRealistic: false,
      warning: `الكمية أقل من المتوقع للقطاع (الحد الأدنى: ${limits.min})`,
      suggestion: `جرب كمية أقرب إلى ${adjustedTypical.toLocaleString()}`
    }
  }
  
  if (monthlyQuantity > adjustedMax) {
    return {
      isRealistic: false,
      warning: `الكمية مبالغ فيها للقطاع (الحد الأقصى المعقول: ${adjustedMax.toLocaleString()})`,
      suggestion: `ابدأ بكمية أصغر حوالي ${adjustedTypical.toLocaleString()}`
    }
  }
  
  return { isRealistic: true }
}

// ============================================================================
// SCENARIO ANALYSIS
// ============================================================================

/**
 * Calculate scenario analysis
 */
export function calculateScenarioAnalysis(
  results: FinancialResult[],
  strategies: Array<{ id: string; name: string; margin: number }>,
) {
  if (!Array.isArray(results) || !Array.isArray(strategies)) {
    return []
  }

  return strategies.map((strategy) => {
    try {
      const totalRevenue = results.reduce((sum, r) => {
        const fullCost = asNumber(r?.fullCostPerUnit, 0)
        const margin = asNumber(strategy?.margin, 0)
        const units = asNumber(r?.projectedUnits, 0)

        const strategicPrice = margin >= 100 ? fullCost * 2 : safeDivide(fullCost, 1 - margin / 100, fullCost * 1.2)
        return sum + units * strategicPrice
      }, 0)

      const totalCosts = results.reduce((sum, r) => sum + asNumber(r?.totalCosts, 0), 0)
      const profit = totalRevenue - totalCosts

      return {
        strategy: strategy?.id || "",
        name: strategy?.name || "",
        avgMargin: asNumber(strategy?.margin, 0),
        totalRevenue: Math.max(0, totalRevenue),
        totalProfit: profit,
        profitMargin: safeDivide(profit, totalRevenue, 0) * 100,
      }
    } catch (error) {
      // Scenario analysis error - handled silently
      return {
        strategy: strategy?.id || "",
        name: strategy?.name || "",
        avgMargin: 0,
        totalRevenue: 0,
        totalProfit: 0,
        profitMargin: 0,
      }
    }
  })
}

// ============================================================================
// COMPREHENSIVE BREAK-EVEN ANALYSIS
// ============================================================================

/**
 * Calculate comprehensive break-even analysis
 */
export function calculateBreakEvenAnalysis(
  price: number,
  variableCost: number,
  fixedCostAllocated: number,
  projectedUnits = 0,
) {
  const contributionMargin = calcCMu(price, variableCost)
  const contributionMarginRatio = calcCMR(price, variableCost)
  const breakEvenUnits = calcBEUnits(fixedCostAllocated, price, variableCost)
  const breakEvenRevenue = calcBERevenue(fixedCostAllocated, price, variableCost)

  const safetyMargin = projectedUnits > breakEvenUnits ? ((projectedUnits - breakEvenUnits) / projectedUnits) * 100 : 0

  return {
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
    safetyMargin,
    isViable: contributionMargin > 0 && breakEvenUnits > 0,
  }
}

// ============================================================================
// UNIT PROJECTIONS
// ============================================================================

/**
 * Calculate unit projections for a reporting period
 */
export function calculateUnitProjections(
  products: any[],
  variableCosts: Record<string, any[]>,
  reportDays: number,
): ProductProjection[] {
  if (!Array.isArray(products) || products.length === 0) {
    return []
  }

  const safeReportDays = asNumber(reportDays, 30)

  return products.map((product) => {
    const qty = asNumber(product?.qty, 0)
    const periodDays = asNumber(product?.periodDays, 30)

    const dailyUnits = periodDays > 0 ? qty / periodDays : 0
    const projectedUnits = dailyUnits * safeReportDays

    const variableCostPerUnit = (variableCosts?.[product?.id] || []).reduce((sum: number, cost: any) => {
      const costValue = asNumber(cost?.costPerUnit, 0)
      return sum + costValue
    }, 0)

    const totalVariableCost = projectedUnits * variableCostPerUnit

    return {
      productId: product?.id || "",
      productName: product?.name || "",
      projectedUnits: Math.round(Math.max(0, projectedUnits)),
      dailyUnits: Number(Math.max(0, dailyUnits).toFixed(2)),
      variableCostPerUnit: Math.max(0, variableCostPerUnit),
      totalVariableCost: Math.max(0, totalVariableCost),
    }
  })
}

/**
 * Calculate variable cost per unit
 */
export function calculateVariableCostPerUnit(variableCosts: any[]): number {
  return variableCosts.reduce((sum: number, cost: any) => sum + (cost.costPerUnit || 0), 0)
}

/**
 * Calculate total variable costs
 */
export function calculateTotalVariableCosts(projectedUnits: number, variableCostPerUnit: number): number {
  return projectedUnits * variableCostPerUnit
}

/**
 * Calculate total revenue
 */
export function calculateTotalRevenue(projectedUnits: number, finalPrice: number): number {
  return projectedUnits * finalPrice
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(totalRevenue: number, totalCosts: number): number {
  return totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0
}

/**
 * Sum costs by field
 */
export function sumCostsByField(costs: any[], field: string): number {
  return costs.reduce((sum: number, cost: any) => sum + (cost[field] || 0), 0)
}

// ============================================================================
// SUGGESTED PRICING
// ============================================================================

/**
 * Calculate suggested price based on cost, competitors, and elasticity
 */
export function calculateSuggestedPrice(
  unitCost: number,
  competitors: { price: number }[] = [],
  elasticity: 'inelastic' | 'elastic' | 'unit_elastic' | undefined
): { suggested: number; min: number; max: number } {
  const validUnitCost = Number(unitCost) || 0;

  // 1. Cost-plus pricing: baseline with a 50% margin
  const costPlusPrice = validUnitCost * 1.5;

  // 2. Factor in competitor pricing
  let targetPrice = costPlusPrice;
  const competitorPrices = competitors.map(c => Number(c.price)).filter(p => p > 0);

  if (competitorPrices.length > 0) {
    const avgCompetitorPrice = competitorPrices.reduce((sum, p) => sum + p, 0) / competitorPrices.length;
    // Blend cost-plus price with market price (60% our cost, 40% market)
    targetPrice = (costPlusPrice * 0.6) + (avgCompetitorPrice * 0.4);
  }

  // 3. Adjust for demand elasticity
  let finalPrice = targetPrice;
  switch (elasticity) {
    case 'inelastic': // Low sensitivity, can charge more
      finalPrice *= 1.15;
      break;
    case 'elastic': // High sensitivity, be cautious
      finalPrice *= 0.90;
      break;
    case 'unit_elastic': // Proportional, no change
    default:
      break;
  }

  // 4. Sanity check: ensure price is at least 15% above unit cost
  const minViablePrice = validUnitCost * 1.15;
  finalPrice = Math.max(finalPrice, minViablePrice);

  // Round to a clean number
  const suggested = Math.round(finalPrice / 5) * 5; // Round to nearest 5

  return {
    suggested,
    min: Math.round(suggested * 0.85),
    max: Math.round(suggested * 1.15),
  };
}

// ============================================================================
// COMPUTE PRODUCT COSTS (WRAPPER)
// ============================================================================

/**
 * Compute unit costs and monthly quantity for a product (wrapper used by Step 8)
 */
export function computeProductCosts(product: Product, localData?: any): {
  unitVariableCost: number
  fixedCostPerUnit: number
  totalUnitCost: number
  monthlyQuantity: number
} {
  const { unitVar, fixedPerUnit, totalUnitCost } = computeProductUnitCost(product, localData)
  const monthlyQuantity = calculateMonthlyQuantity(product)
  return {
    unitVariableCost: unitVar,
    fixedCostPerUnit: fixedPerUnit,
    totalUnitCost,
    monthlyQuantity,
  }
}

/**
 * Apply fallback allocation if current allocation is invalid
 */
export function applyFallbackIfInvalid(
  allocation: Record<string, number>,
  method: string,
  totalFixedCosts: number,
  productIds: string[],
): { applied: boolean; allocation: Record<string, number>; reason: string } {
  const validation = validateFixedAllocation(allocation, totalFixedCosts, productIds.length)

  if (validation.isValid && !validation.hasZeroAllocations) {
    return {
      applied: false,
      allocation,
      reason: "No fallback needed - allocation is valid",
    }
  }

  // Apply equal distribution fallback
  const equalShare = 100 / productIds.length
  const fallbackAllocation: Record<string, number> = {}

  productIds.forEach((id) => {
    fallbackAllocation[id] = equalShare
  })

  let reason = "Applied equal distribution fallback"
  if (!validation.isValid) {
    reason += " due to invalid allocation"
  } else if (validation.hasZeroAllocations) {
    reason += " due to zero allocations detected"
  }

  return {
    applied: true,
    allocation: fallbackAllocation,
    reason,
  }
}
