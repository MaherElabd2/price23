"use client"

import type { PricingData } from "@/lib/types"
import { Step0BasicInfo } from "./steps/step-0-basic-info"
import StartupStep0BasicInfo from "./steps/startup/step-0-basic-info"
import { SMEStep0BasicInfo } from "./steps/sme/step-0-basic-info"
import { Step1CustomerType } from "./steps/step-1-customer-type"
import { Step2ProductNature } from "./steps/step-2-product-nature"
import { Step3Competition } from "./steps/step-3-competition"
import { Step4SectorGuidance } from "./steps/step-4-sector-guidance"
import { Step5ProductDefinition } from "./steps/step-5-product-definition"
import { Step6VariableCosts } from "./steps/step-6-variable-costs"
import { Step7FixedCosts } from "./steps/step-7-fixed-costs"
import { Step8CostAllocation } from "./steps/step-8-cost-allocation"
import { Step9SalesPeriod } from "./steps/step-9-sales-period"
import { Step10ProfitTargets } from "./steps/step-10-profit-targets"
import { Step11StrategyEngine } from "./steps/step-11-strategy-engine"
import { Step12Results } from "./steps/step-12-results"

interface WizardStepProps {
  step: number
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
  selectedPath?: "startup" | "sme" | "freelancer"
}

export function WizardStep({ step, data, onDataChange, errors, language, selectedPath }: WizardStepProps) {
  const stepComponents = [
    // Always use the unified-props version here to keep the array homogenous.
    // We handle the Startup special case below before rendering the array item.
    Step0BasicInfo,
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

  const StepComponent = stepComponents[step]

  // Handle different component props based on path
  if (step === 0 && selectedPath === "startup") {
    return (
      <div className="bg-card text-card-foreground rounded-[20px] p-6 shadow-sm border border-border">
        <StartupStep0BasicInfo 
          data={data as any} 
          onDataChange={onDataChange as any} 
        />
      </div>
    )
  }

  if (step === 0 && selectedPath === "sme") {
    return (
      <div className="bg-card text-card-foreground rounded-[20px] p-6 shadow-sm border border-border">
        <SMEStep0BasicInfo 
          data={data} 
          onDataChange={onDataChange} 
          errors={errors} 
          language={language} 
        />
      </div>
    )
  }

  return (
    <div className="bg-card text-card-foreground rounded-[20px] p-6 shadow-sm border border-border">
      <StepComponent data={data} onDataChange={onDataChange} errors={errors} language={language} />
    </div>
  )
}
