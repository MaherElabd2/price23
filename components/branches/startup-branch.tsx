"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, TrendingUp, Calculator, AlertTriangle } from "lucide-react"
import {
  calculateLTV,
  calculateLTVCACRatio,
  calculateBurnRate,
  calculateCAC,
  calculateMonthlyQuantity,
  calculateTotalFixedCosts,
  computeProductUnitCost,
} from "@/lib/calculations"
import Step0BasicInfo from "@/components/steps/startup/step-0-basic-info"
import Step1Quantities from "@/components/steps/startup/step-1-quantities"
import Step2ProductCosts from "@/components/steps/startup/step-2-product-costs"
import Step3CompanyAllocation from "@/components/steps/startup/step-3-company-allocation"
import Step4PricingCompetition from "@/components/steps/startup/step-4-pricing-competition"
import Step5FinancialAnalysis from "@/components/steps/startup/step-5-financial-analysis"
import { Step6StrategicGoals } from "@/components/steps/startup/step-6-strategic-goals"
import Step7TestingIteration from "@/components/steps/startup/step-7-testing-iteration"
import Step8FinalOutputs from "../steps/startup/step-8-final-outputs"
import type { LocalData, Product } from "@/types/startup"
import { useLanguage } from "@/contexts/language-context"
import { startupT } from "@/lib/startup-translations"

interface StartupBranchProps {
  data: LocalData
  onDataChange: (data: Partial<LocalData>) => void
  language: string
  onBack: () => void
  onHome?: () => void
}

export function StartupBranch({ data, onDataChange, language, onBack, onHome }: StartupBranchProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { t } = useLanguage()
  const st = (key: string) => startupT(language as "ar" | "en", key)

  const localData = data
  const storageLoading = false

  useEffect(() => {
    // Debug logging removed for production
  }, [localData])

  const totalSteps = 8 // Updated to include Step 5

  const ltvCacInputs = localData.ltvCacInputs || {}
  const ltv = calculateLTV(
    ltvCacInputs.avgPurchaseValue || 0,
    ltvCacInputs.purchaseFrequencyPerYear || 0,
    ltvCacInputs.customerLifespanYears || 0,
  )
  const cac = calculateCAC(ltvCacInputs.monthlyMarketingSpend || 0, ltvCacInputs.newCustomersPerMonth || 0)
  const ltvCacRatio = calculateLTVCACRatio(ltv, cac)
  const burnRate = calculateBurnRate(localData.fixedCosts || [])

  const calculateStrategyPrice = (product: Product) => {
    const { totalUnitCost } = computeProductUnitCost(product, localData)
    const competitors = (product.competitors || []).map((c) => Number(c.price)).filter((p) => p > 0)
    const avgCompetitorPrice =
      competitors.length > 0 ? competitors.reduce((sum, p) => sum + p, 0) / competitors.length : 0
    const customMargin = localData.customMargin || 30

    // Calculate base price from primary strategy
    let basePrice: number
    switch (localData.selectedStrategy) {
      case "cost_plus":
        basePrice = totalUnitCost * (1 + customMargin / 100)
        break
      case "competitive":
        basePrice = avgCompetitorPrice > 0 ? avgCompetitorPrice * 0.95 : totalUnitCost * 1.25
        break
      case "penetration":
        basePrice = avgCompetitorPrice > 0 ? avgCompetitorPrice * 0.8 : totalUnitCost * 1.15
        break
      case "value_based":
        const valueBased = avgCompetitorPrice > 0 ? avgCompetitorPrice : totalUnitCost * 1.4
        basePrice = valueBased * 1.2
        break
      default:
        basePrice = Number(product.price) || totalUnitCost * 1.3
    }

    // Apply secondary strategies
    const secondaryStrategies = localData.secondaryStrategies || []
    let finalPrice = basePrice

    secondaryStrategies.forEach((strategy) => {
      switch (strategy) {
        case "psychological":
          finalPrice = Math.floor(finalPrice / 100) * 100 + 99
          break
        case "bundle":
          finalPrice = finalPrice * 0.95
          break
        case "dynamic":
          finalPrice = finalPrice * 1.1
          break
        case "skimming":
          finalPrice = finalPrice * 1.2
          break
        default:
          break
      }
    })

    return finalPrice
  }

  const productsWithCalc = (localData.products || []).map((product: Product) => {
    const { unitVar, fixedPerUnit, totalUnitCost } = computeProductUnitCost(product, localData)
    const monthlyQuantity = calculateMonthlyQuantity(product)
    const price = Number(product.price) || calculateStrategyPrice(product)
    return {
      id: product.id,
      name: product.name,
      monthlyQuantity,
      price,
      unitVarCost: unitVar,
      fixedCostPerUnit: fixedPerUnit,
      totalUnitCost,
    }
  })

  const estimatedRevenue = productsWithCalc.reduce<number>((s, p) => s + p.monthlyQuantity * p.price, 0)
  const variableCosts = productsWithCalc.reduce<number>((s, p) => s + p.monthlyQuantity * p.unitVarCost, 0)
  const sharedFixedCosts = calculateTotalFixedCosts(
    localData.fixedCosts || [],
    localData.depreciation,
    localData.rdBudget,
  )
  const productSpecificFixed = (localData.products || []).reduce((sum, p) => {
    return sum + (p.productFixedCosts || []).reduce((pSum, fc) => pSum + (Number(fc.monthlyAmount) || 0), 0)
  }, 0)
  const totalFixedCosts = sharedFixedCosts + productSpecificFixed

  const totalCosts = variableCosts + totalFixedCosts
  const netCashFlow = estimatedRevenue - totalCosts
  const monthlyLoss = Math.max(0, totalCosts - estimatedRevenue)

  let finalRunway = localData.runwayMonths || 0
  if (localData.runwayMode === "auto" && localData.runwayCash) {
    const cash = Number(localData.runwayCash) || 0
    finalRunway = monthlyLoss > 0 ? cash / monthlyLoss : netCashFlow >= 0 ? Number.POSITIVE_INFINITY : 0
  }

  const productsWithBreakEven = productsWithCalc.map((product) => {
    const contributionMargin = product.price - product.unitVarCost
    const allocatedFixedCostMonthly = product.fixedCostPerUnit * product.monthlyQuantity
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(allocatedFixedCostMonthly / contributionMargin) : 0
    const isViable = contributionMargin > 0

    return {
      ...product,
      allocatedFixedCost: allocatedFixedCostMonthly,
      breakEvenUnits,
      currentMargin: contributionMargin,
      isBreakEvenReached: isViable && product.monthlyQuantity >= breakEvenUnits,
      isViable,
    }
  })

  const [validationError, setValidationError] = useState<string | null>(null)
  const stepContainerRef = useRef<HTMLDivElement>(null)
  const firstInvalidFieldIdRef = useRef<string | null>(null)

  const validateStep = (step: number): { isValid: boolean; error?: string; fieldId?: string } => {
    switch (step) {
      case 0:
        if (!localData.sector) {
          return {
            isValid: false,
            error: st("startupBranch.validation.selectSector"),
            fieldId: "sector-select",
          }
        }
        if (!localData.companyStage) {
          return {
            isValid: false,
            error: st("startupBranch.validation.selectCompanyStage"),
            fieldId: "company-stage",
          }
        }
        return { isValid: true }
      case 1: {
        // Must have at least one product
        if (!localData.products || localData.products.length === 0) {
          return {
            isValid: false,
            error: st("startupBranch.validation.addOneProduct"),
            fieldId: "add-product-btn",
          }
        }
        // Validate each product
        for (const p of localData.products) {
          if (p.paused) continue // paused products are skipped from validation
          if (!p.name || p.name.trim() === "") {
            return {
              isValid: false,
              error: st("startupBranch.validation.productNameRequired"),
              fieldId: `product-name-${p.id}`,
            }
          }
          if (!p.quantityType) {
            return {
              isValid: false,
              error: st("startupBranch.validation.selectQuantityMethod"),
              fieldId: `product-qtytype-${p.id}`,
            }
          }
          if (p.quantityType === "fixed") {
            const v = Number(p.monthlyQuantity)
            if (isNaN(v) || v < 0) {
              return {
                isValid: false,
                error: st("startupBranch.validation.quantityGteZero"),
                fieldId: `product-fixed-${p.id}`,
              }
            }
          }
          if (p.quantityType === "range") {
            const min = Number(p.minQuantity)
            const max = Number(p.maxQuantity)
            if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
              return {
                isValid: false,
                error: st("startupBranch.validation.checkRange"),
                fieldId: `product-range-min-${p.id}`,
              }
            }
          }
          if (p.quantityType === "capacity") {
            const cap = Number(p.capacityMax)
            const util = Number(p.capacityUtilization)
            if (isNaN(cap) || cap < 0 || isNaN(util) || util < 0 || util > 100) {
              return {
                isValid: false,
                error: st("startupBranch.validation.checkCapacity"),
                fieldId: `product-capacity-${p.id}`,
              }
            }
          }
          if (p.quantityType === "market") {
            const size = Number(p.marketSize)
            const share = Number(p.marketSharePct)
            if (isNaN(size) || size < 0 || isNaN(share) || share < 0 || share > 100) {
              return {
                isValid: false,
                error: st("startupBranch.validation.checkMarket"),
                fieldId: `product-market-${p.id}`,
              }
            }
          }
          if (p.quantityType === "historical") {
            const h = p.historical
            if (!h || h.m1 === undefined || h.m2 === undefined || h.m3 === undefined) {
              return {
                isValid: false,
                error: st("startupBranch.validation.historicalThreeMonths"),
                fieldId: `product-hist-m1-${p.id}`,
              }
            }
            const vals = [h.m1, h.m2, h.m3].map(Number)
            if (vals.some((x) => isNaN(x) || x < 0)) {
              return {
                isValid: false,
                error: st("startupBranch.validation.historicalGteZero"),
                fieldId: `product-hist-m1-${p.id}`,
              }
            }
          }
          // "uncertain" is allowed and does not block next
        }
        // Validate runway
        if (localData.runwayMode === "manual") {
          const m = Number(localData.manualRunwayMonths)
          if (isNaN(m) || m < 0) {
            return {
              isValid: false,
              error: st("startupBranch.validation.runwayGteZero"),
              fieldId: "runway-manual-months",
            }
          }
        } else {
          const cash = Number(localData.runwayCash)
          if (isNaN(cash) || cash < 0) {
            return {
              isValid: false,
              error: st("startupBranch.validation.cashGteZero"),
              fieldId: "runway-cash",
            }
          }
        }
        return { isValid: true }
      }
      case 3: {
        // Allocation validation: if custom, sum must be exactly 100%
        if (localData.allocationMethod === "custom") {
          const shares = Object.values(localData.allocationCustom || {}).map(Number)
          const sum = shares.reduce((s, v) => s + (isFinite(v) ? v : 0), 0)
          // Allow tiny rounding tolerance 0.05
          if (Math.abs(sum - 100) > 0.05) {
            return {
              isValid: false,
              error: st("startupBranch.validation.allocationSum100"),
              fieldId: undefined,
            }
          }
        }
        return { isValid: true }
      }
      default:
        return { isValid: true }
    }
  }

  const handleNext = () => {
    const validation = validateStep(currentStep)

    if (!validation.isValid) {
      setValidationError(validation.error || st("startupBranch.validation.completeRequiredData"))
      // Scroll to top and focus on first missing field
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      firstInvalidFieldIdRef.current = validation.fieldId || null
      if (validation.fieldId) {
        // Give time for scroll, then focus
        setTimeout(() => {
          const el = document.getElementById(validation.fieldId!) as HTMLInputElement | HTMLSelectElement | null
          if (el) el.focus()
        }, 300)
      }
      return
    }

    setValidationError(null)
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBack = () => {
    onBack()
  }

  const updateLocalData = (updates: Partial<LocalData>) => {
    const newData = { ...localData, ...updates }
    onDataChange(newData)
  }

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      description: "",
      monthlyQuantity: 0,
      quantityType: "fixed" as const,
      type: "core" as const,
      unitCost: 0,
      paused: false,
      costItems: [],
    }
    updateLocalData({ products: [...(localData.products || []), newProduct] })
  }

  const updateProduct = (id: string, updates: any) => {
    const updatedProducts = (localData.products || []).map((p) => (p.id === id ? { ...p, ...updates } : p))
    updateLocalData({ products: updatedProducts })
  }

  const removeProduct = (id: string) => {
    updateLocalData({ products: (localData.products || []).filter((p) => p.id !== id) })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0BasicInfo data={localData} onDataChange={updateLocalData} language={language} />

      case 1:
        return (
          <Step1Quantities
            localData={localData}
            addProduct={addProduct}
            updateProduct={updateProduct}
            removeProduct={removeProduct}
            updateLocalData={updateLocalData}
            language={language}
          />
        )

      case 2:
        return (
          <Step2ProductCosts
            localData={localData}
            updateLocalData={updateLocalData}
            updateProduct={updateProduct}
            language={language}
          />
        )

      case 3:
        return <Step3CompanyAllocation localData={localData} updateLocalData={updateLocalData} language={language} />

      case 4:
        return <Step4PricingCompetition localData={localData} updateLocalData={updateLocalData} language={language} />

      case 5:
        return <Step5FinancialAnalysis localData={localData} updateLocalData={updateLocalData} language={language} />

      case 6:
        return <Step6StrategicGoals localData={localData} updateLocalData={updateLocalData} language={language} />

      case 7:
        return (
          <div className="space-y-8">
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center text-blue-800 flex items-center justify-center gap-3">
                  <TrendingUp className="h-8 w-8" />
                  {st("startupBranch.finalReportTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-700 mb-6 text-lg">{st("startupBranch.finalReportSubtitle")}</p>
              </CardContent>
            </Card>
            <Step8FinalOutputs localData={localData} updateLocalData={updateLocalData} language={language} />
            <Step7TestingIteration localData={localData} updateLocalData={updateLocalData} language={language as any} />
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">
              {st("startupBranch.stepUnderDevelopment").replace("{{currentStep}}", String(currentStep + 1))}
            </h3>
            <p className="text-gray-600">{st("startupBranch.contentComingSoon")}</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{st("startupBranch.toolTitle")}</h2>
          <div className="text-sm text-gray-600">
            {st("startupBranch.stepProgress")
              .replace("{{currentStep}}", String(currentStep + 1))
              .replace("{{totalSteps}}", String(totalSteps))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6" ref={stepContainerRef}>
        {validationError && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{validationError}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-4">
            {onHome && (
              <Button
                variant="outline"
                size="sm"
                onClick={onHome}
                className="flex items-center gap-2 bg-transparent text-[#dc2626] border-[#dc2626] hover:bg-[#dc2626] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {st("startupBranch.homeButton")}
              </Button>
            )}

            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                {st("startupBranch.previousButton")}
              </Button>
            )}
          </div>

          {currentStep < totalSteps - 1 && (
            <Button onClick={handleNext} className="flex items-center gap-2" disabled={false}>
              {st("startupBranch.nextButton")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {currentStep === totalSteps - 1 && (
            <Button onClick={() => {}} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Calculator className="h-4 w-4" />
              {st("startupBranch.calculateButton")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
