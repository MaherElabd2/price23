"use client"

import { useState } from "react"
import { ProgressBar } from "./progress-bar"
import { WizardStep } from "./wizard-step"
import { NavigationButtons } from "./navigation-buttons"
import { PathSelection } from "./path-selection"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { type PricingData, initialData } from "@/lib/types"
import type { LocalData } from "@/types/startup"
import { validateStep } from "@/lib/validation"
import { STEPS, STEPS_EN } from "@/lib/steps"
import { StartupBranch } from "./branches/startup-branch"
import { SMEBranch } from "./branches/sme-branch"

interface PricingWizardProps {
  language: "ar" | "en"
  onLanguageChange: (lang: "ar" | "en") => void
}

export function PricingWizard({ language, onLanguageChange }: PricingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPath, setSelectedPath] = useState<"startup" | "sme" | null>(null)
  const [data, setData] = useLocalStorage<PricingData>("kayan-pricing-data", {
    ...initialData,
    sectorGuidanceEnabled: true,
    language: language,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isStartupPath = selectedPath === "startup"
  const isSMEPath = selectedPath === "sme"
  const isAlternativePath = isStartupPath || isSMEPath

  const availableSteps = (language === "ar" ? STEPS : STEPS_EN).filter((_, index) => index !== 4)

  // Helper: deep-merge PricingData with updates, merging products by id
  type Prod = { id: string; [k: string]: any }
  const mergePricingData = (prev: PricingData, updates: Partial<PricingData>): PricingData => {
    if (updates.products) {
      const prevProducts: Prod[] = (prev.products as any) || []
      const updatesProducts: Prod[] = (updates.products as any) || []

      const byId = new Map<string, Prod>()
      prevProducts.forEach(p => byId.set(p.id, { ...p }))
      updatesProducts.forEach(up => {
        const existing = byId.get(up.id)
        byId.set(up.id, existing ? { ...existing, ...up } : up)
      })

      return { ...prev, ...updates, products: Array.from(byId.values()) } as PricingData
    }
    return { ...prev, ...updates } as PricingData
  }

  const handlePathSelect = (path: "startup" | "sme" | "freelancer") => {
    if (path === "freelancer") {
      // Temporarily disabled
      return
    }
    setSelectedPath(path)
    setData(prev => ({
      ...prev,
      userType: path, // Keep original path type
      companyInfo: {
        ...prev.companyInfo,
        companySize: path === "sme" ? "sme" : path as "startup" | "sme" | "enterprise" | ""
      }
    }))
  }

  const handleNext = () => {
    const actualStepIndex = currentStep >= 4 ? currentStep + 1 : currentStep
    const stepErrors = validateStep(actualStepIndex, data, language)
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
      setSelectedPath(null)
      setData({
        ...initialData,
        sectorGuidanceEnabled: true,
        language: language,
      })
      setErrors({})
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, availableSteps.length - 1))
  }

  const handleBack = () => {
    if (currentStep === 0) {
      // Go back to path selection
      setSelectedPath(null)
      setCurrentStep(0)
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0))
    }
  }

  const handleHome = () => {
    setSelectedPath(null)
    setCurrentStep(0)
  }

  const handleDataChange = (updates: Partial<PricingData>) => {
    setData(prev => mergePricingData(prev, updates))
    setErrors({})
  }

  const handleLanguageChangeFromWizard = (lang: "ar" | "en") => {
    onLanguageChange(lang)
    setData((prev) => ({ ...prev, language: lang }))
  }

  // Adapter for StartupBranch which expects LocalData props
  const handleStartupDataChange = (updates: Partial<LocalData>) => {
    setData(prev => mergePricingData(prev as PricingData, updates as Partial<PricingData>))
    setErrors({})
  }

  const progress = ((currentStep + 1) / availableSteps.length) * 100
  const actualStepIndex = currentStep >= 4 ? currentStep + 1 : currentStep

  // Show path selection if no path is selected
  if (!selectedPath) {
    return <PathSelection language={language} onPathSelect={handlePathSelect} />
  }

  // Show alternative branches for startup and SME paths (including step 0)
  if (isAlternativePath) {
    return (
      <div className={`min-h-screen ${language === "ar" ? "rtl" : "ltr"} content-with-header`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {isStartupPath && (
            <StartupBranch
              data={data as unknown as LocalData}
              onDataChange={handleStartupDataChange}
              language={language}
              onBack={() => setCurrentStep(0)}
              onHome={handleHome}
            />
          )}
          {isSMEPath && (
            <SMEBranch
              data={data as unknown as LocalData}
              onDataChange={handleStartupDataChange}
              language={language}
              onBack={() => setCurrentStep(0)}
              onHome={handleHome}
            />
          )}
        </div>
      </div>
    )
  }

  // Show regular wizard for SME path or first step of other paths
  return (
    <div className={`min-h-screen ${language === "ar" ? "rtl" : "ltr"} content-with-header`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={availableSteps.length}
          stepName={availableSteps[currentStep].name}
          progress={progress}
          language={language}
        />

        <div className="mt-8">
          <WizardStep
            step={actualStepIndex}
            data={{ ...data, language }}
            onDataChange={handleDataChange}
            errors={errors}
            language={language}
            selectedPath={selectedPath}
          />
        </div>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={availableSteps.length}
          onNext={handleNext}
          onBack={handleBack}
          onHome={handleHome}
          canProceed={Object.keys(errors).length === 0}
          language={language}
        />
      </div>
    </div>
  )
}
