"use client"

import React, { useState } from "react"
import { ProgressBar } from "../progress-bar"
import { NavigationButtons } from "../navigation-buttons"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { type PricingData, initialData } from "@/lib/types"
import type { LocalData } from "@/types/startup"
import { validateStep } from "@/lib/validation"
import { STEPS, STEPS_EN } from "@/lib/steps"
import { SMEStep0BasicInfo } from "../steps/sme/step-0-basic-info"
import { Step1CustomerType } from "../steps/step-1-customer-type"
import { Step2ProductNature } from "../steps/step-2-product-nature"
import { Step3Competition } from "../steps/step-3-competition"
import { Step4SectorGuidance } from "../steps/step-4-sector-guidance"
import { Step5ProductDefinition } from "../steps/step-5-product-definition"
import { Step6VariableCosts } from "../steps/step-6-variable-costs"
import { Step7FixedCosts } from "../steps/step-7-fixed-costs"
import { Step8CostAllocation } from "../steps/step-8-cost-allocation"
import { Step9SalesPeriod } from "../steps/step-9-sales-period"
import { Step10ProfitTargets } from "../steps/step-10-profit-targets"
import { Step11StrategyEngine } from "../steps/step-11-strategy-engine"
import { Step12Results } from "../steps/step-12-results"

interface SMEBranchProps {
  data: LocalData
  onDataChange: (updates: Partial<LocalData>) => void
  language: "ar" | "en"
  onBack: () => void
  onHome: () => void
}

export function SMEBranch({ data, onDataChange, language, onBack, onHome }: SMEBranchProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const availableSteps = (language === "ar" ? STEPS : STEPS_EN).filter((_, index) => index !== 4)

  // Helper: deep-merge PricingData with updates, merging products by id
  type Prod = { id: string; [k: string]: any }
  const mergePricingData = (prev: PricingData, updates: Partial<PricingData>): PricingData => {
    if (updates.products) {
      const prevProducts: Prod[] = (prev.products as any) || []
      const updatesProducts: Prod[] = (updates.products as any) || []

      const byId = new Map<string, Prod>()
      prevProducts.forEach((p: any) => byId.set(p.id, { ...p }))
      updatesProducts.forEach((up: any) => {
        const existing = byId.get(up.id)
        byId.set(up.id, existing ? { ...existing, ...up } : up)
      })

      return { ...prev, ...updates, products: Array.from(byId.values()) } as PricingData
    }
    return { ...prev, ...updates } as PricingData
  }

  const handleNext = () => {
    const actualStepIndex = currentStep >= 4 ? currentStep + 1 : currentStep
    const stepErrors = validateStep(actualStepIndex, data as unknown as PricingData, language)
    setErrors(stepErrors)

    if (Object.keys(stepErrors).length > 0) {
      setTimeout(() => {
        const errorElement = document.querySelector(".text-red-500, .border-red-500")
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
      return
    }

    if (currentStep === availableSteps.length - 1) {
      // Reset to path selection
      setCurrentStep(0)
      onHome()
      return
    }

    setCurrentStep((prev: number) => Math.min(prev + 1, availableSteps.length - 1))
  }

  const handleBack = () => {
    if (currentStep === 0) {
      onBack()
    } else {
      setCurrentStep((prev: number) => Math.max(prev - 1, 0))
    }
  }

  const handleDataChange = (updates: Partial<PricingData>) => {
    onDataChange(updates as unknown as Partial<LocalData>)
    setErrors({})
  }

  const stepComponents = [
    SMEStep0BasicInfo,
    Step1CustomerType,
    Step2ProductNature,
    Step5ProductDefinition, // Now step 3
    Step4SectorGuidance,
    Step3Competition, // Now step 5
    Step6VariableCosts,
    Step7FixedCosts,
    Step8CostAllocation,
    Step9SalesPeriod,
    Step10ProfitTargets,
    Step11StrategyEngine,
    Step12Results,
  ]

  const StepComponent = stepComponents[currentStep]
  const progress = ((currentStep + 1) / availableSteps.length) * 100
  const actualStepIndex = currentStep >= 4 ? currentStep + 1 : currentStep

  return (
    <div className="space-y-8">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={availableSteps.length}
        stepName={availableSteps[currentStep].name}
        progress={progress}
        language={language}
      />

      <div className="bg-card text-card-foreground rounded-[20px] p-6 shadow-sm border border-border">
        <StepComponent 
          data={data as unknown as PricingData} 
          onDataChange={handleDataChange} 
          errors={errors} 
          language={language} 
        />
      </div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={availableSteps.length}
        onNext={handleNext}
        onBack={handleBack}
        onHome={onHome}
        canProceed={Object.keys(errors).length === 0}
        language={language}
      />
    </div>
  )
}
