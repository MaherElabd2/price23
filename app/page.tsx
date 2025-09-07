"use client"
import { PricingWizard } from "@/components/pricing-wizard"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (lang: "ar" | "en") => {
    setLanguage?.(lang)
  }

  return (
    <main className="flex-1 bg-background text-foreground content-with-header">
      <div className="pt-20">
        <PricingWizard language={language} onLanguageChange={handleLanguageChange} />
      </div>
    </main>
  )
}
