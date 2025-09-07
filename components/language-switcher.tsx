"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage?.(language === 'ar' ? 'en' : 'ar')}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'ar' ? 'عربي' : 'English'}
    </Button>
  )
}
