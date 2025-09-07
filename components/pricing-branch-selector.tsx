"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Building2, User, ArrowLeft } from "lucide-react"
import { t } from "@/lib/translations"
import type { PricingData } from "@/lib/types"
import type { LocalData } from "@/types/startup"
// import { FreelancerBranch } from "./branches/freelancer-branch" // File doesn't exist yet
import { StartupBranch } from "./branches/startup-branch"

interface PricingBranchSelectorProps {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  language: "ar" | "en"
}

export function PricingBranchSelector({ data, onDataChange, language }: PricingBranchSelectorProps) {
  const [selectedType, setSelectedType] = useState<"startup" | "sme" | "freelancer" | null>(data.userType || null)
  const [showSubWizard, setShowSubWizard] = useState(false)

  const handleTypeSelect = (type: "startup" | "sme" | "freelancer") => {
    setSelectedType(type)
    onDataChange({ userType: type })
    setShowSubWizard(true)
  }

  const handleBackToSelection = () => {
    setShowSubWizard(false)
  }

  const handleSkip = () => {
    onDataChange({ userType: "startup" })
  }

  // Adapter for StartupBranch which expects LocalData props
  const handleStartupDataChange = (updates: Partial<LocalData>) => {
    onDataChange(updates as any)
  }

  if (showSubWizard && selectedType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToSelection} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {language === "ar" ? "العودة للاختيار" : "Back to Selection"}
          </Button>
          <Badge variant="secondary">
            {selectedType === "startup"
              ? t(language, "branch.userType.startup")
              : selectedType === "sme"
              ? t(language, "branch.userType.sme")
              : t(language, "branch.userType.freelancer")}
          </Badge>
        </div>

        {selectedType === "freelancer" ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Freelancer Branch - Coming Soon</h3>
            <p className="text-gray-600">This feature is under development</p>
          </div>
        ) : selectedType === "sme" ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">SME Branch - Coming Soon</h3>
            <p className="text-gray-600">This feature is under development</p>
          </div>
        ) : (
          <StartupBranch
            data={data as unknown as LocalData}
            onDataChange={handleStartupDataChange}
            language={language}
            onBack={handleBackToSelection}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">{t(language, "branch.userType.title")}</h3>
        <p className="text-muted-foreground">{t(language, "branch.userType.desc")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          onClick={() => handleTypeSelect("startup")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{t(language, "branch.userType.startup")}</CardTitle>
            <CardDescription>
              {language === "ar" ? "للشركات الناشئة والمنتجات الرقمية" : "For startups and digital products"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-transparent" variant="outline">
              {language === "ar" ? "اختيار" : "Select"}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          onClick={() => handleTypeSelect("sme")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">{t(language, "branch.userType.sme")}</CardTitle>
            <CardDescription>
              {language === "ar" ? "للشركات الصغيرة والمتوسطة" : "For small and medium enterprises"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-transparent" variant="outline">
              {language === "ar" ? "اختيار" : "Select"}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          onClick={() => handleTypeSelect("freelancer")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">{t(language, "branch.userType.freelancer")}</CardTitle>
            <CardDescription>
              {language === "ar" ? "للمستقلين ومقدمي الخدمات" : "For freelancers and service providers"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-transparent" variant="outline">
              {language === "ar" ? "اختيار" : "Select"}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">{t(language, "branch.note.defaultStartup")}</p>
        <Button variant="ghost" onClick={handleSkip}>
          {language === "ar" ? "تخطي والمتابعة كـ Startup" : "Skip and Continue as Startup"}
        </Button>
      </div>
    </div>
  )
}
