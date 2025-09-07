"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { startupTranslations, type StartupLang } from "@/lib/startup-translations"

type TShape = Record<string, any>

interface LanguageContextValue {
  language: StartupLang
  dir: "rtl" | "ltr"
  t: TShape
  isLoading: boolean
  setLanguage: (lang: StartupLang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function aliasKeys(dict: any): any {
  if (!dict) return {}
  return {
    ...dict,
    // Aliases expected by some components that used a different naming scheme
    startupBranch: dict.startupBranch,
    step0BasicInfo: dict.step0BasicInfo,
    step1Quantities: dict.step1Quantities,
    step4PricingCompetition: dict.step4PricingCompetition,
    step5FinancialAnalysis: dict.step5FinancialAnalysis,
    step6PricingStrategies: dict.step6PricingStrategies,
    step7TestingIteration: dict.step7TestingIteration,
    step8FinalOutputs: dict.step8FinalOutputs,
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<StartupLang>("ar")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? (localStorage.getItem("language") as StartupLang | null) : null
      if (saved === "ar" || saved === "en") setLanguageState(saved)
    } catch {
      // Ignore localStorage errors
    }
    setIsLoading(false)
  }, [])

  const setLanguage = (lang: StartupLang) => {
    setLanguageState(lang)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("language", lang)
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  const dir = language === "ar" ? "rtl" : "ltr"
  const t = useMemo(() => aliasKeys(startupTranslations[language]), [language])

  const value: LanguageContextValue = useMemo(
    () => ({
      language,
      dir,
      t,
      isLoading,
      setLanguage,
    }),
    [language, dir, t, isLoading],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Fallback for components used outside provider during build/SSR
    const language: StartupLang = "ar"
    const dir = "rtl"
    return {
      language,
      dir,
      t: aliasKeys(startupTranslations[language]),
      isLoading: false,
      setLanguage: () => {},
    }
  }
  return ctx
}
