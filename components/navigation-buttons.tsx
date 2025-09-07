"use client"

import { t } from "@/lib/translations"

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  onHome?: () => void
  canProceed: boolean
  language: "ar" | "en"
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onHome,
  canProceed,
  language,
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const handleNext = () => {
    onNext()
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="flex justify-between mt-8">
      <div className="flex gap-3">
        {onHome && (
          <button
            onClick={onHome}
            className="px-6 py-3 text-[#dc2626] border border-[#dc2626] rounded-lg font-medium hover:bg-[#dc2626] hover:text-white transition-colors"
          >
            {language === "ar" ? "الرئيسية" : "Home"}
          </button>
        )}
        <button
          onClick={onBack}
          disabled={isFirstStep}
          className="px-6 py-3 text-[#1e3a8a] border border-[#1e3a8a] rounded-lg font-medium hover:bg-[#1e3a8a] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t(language, "common.previous")}
        </button>
      </div>

      <button
        onClick={handleNext}
        disabled={!canProceed}
        className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg font-bold text-lg hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLastStep ? (language === "ar" ? "ابدأ من جديد" : "Start Over") : t(language, "common.next")}
      </button>
    </div>
  )
}
