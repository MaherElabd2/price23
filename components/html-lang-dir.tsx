"use client"

import { useLanguage } from "@/contexts/language-context"
import { useEffect } from "react"

export function HtmlLangDir() {
  const { language, dir } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir

    const bodyClasses = `font-sans antialiased ${language === "ar" ? "font-cairo" : "font-inter"}`
    document.body.className = bodyClasses

    document.documentElement.style.setProperty("--text-align-start", dir === "rtl" ? "right" : "left")
    document.documentElement.style.setProperty("--text-align-end", dir === "rtl" ? "left" : "right")
  }, [language, dir])

  return null
}
