"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, DollarSign, BarChart3, Lightbulb, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { LocalData } from "@/types/startup"

interface StepProps {
  data: LocalData
  onDataChange: (data: Partial<LocalData>) => void
  language: string; 
}

export { Step0BasicInfo }

export default function Step0BasicInfo({ data, onDataChange, language }: StepProps) {
  const { t } = useLanguage()
  const selectedSector = data.sector || ""

  const countries = [
    { id: "EG", name: t.step0BasicInfo?.countries?.EG || "Egypt" },
    { id: "SA", name: t.step0BasicInfo?.countries?.SA || "Saudi Arabia" },
    { id: "AE", name: t.step0BasicInfo?.countries?.AE || "United Arab Emirates" },
    { id: "KW", name: t.step0BasicInfo?.countries?.KW || "Kuwait" },
    { id: "QA", name: t.step0BasicInfo?.countries?.QA || "Qatar" },
    { id: "BH", name: t.step0BasicInfo?.countries?.BH || "Bahrain" },
    { id: "OM", name: t.step0BasicInfo?.countries?.OM || "Oman" },
    { id: "JO", name: t.step0BasicInfo?.countries?.JO || "Jordan" },
    { id: "LB", name: t.step0BasicInfo?.countries?.LB || "Lebanon" },
    { id: "IQ", name: t.step0BasicInfo?.countries?.IQ || "Iraq" },
    { id: "DZ", name: t.step0BasicInfo?.countries?.DZ || "Algeria" },
    { id: "MA", name: t.step0BasicInfo?.countries?.MA || "Morocco" },
    { id: "TN", name: t.step0BasicInfo?.countries?.TN || "Tunisia" },
  ]

  const currencies = ["EGP", "USD", "EUR", "SAR", "AED", "GBP", "CAD", "AUD"]

  return (
    <div className={`space-y-6 ${language === "ar" ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className={language === "ar" ? "text-right" : "text-left"}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.step0BasicInfo?.title || "Basic Information - Startups"}
        </h2>
        <p className="text-gray-600">
          {t.step0BasicInfo?.subtitle || "Enter your personal and startup company information"}
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <Target className="h-5 w-5" />
            {t.step0BasicInfo?.personalInfo || "Personal Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t.step0BasicInfo?.fullName || "Full Name"} *</Label>
              <Input
                id="name"
                type="text"
                value={data.personalInfo?.name || ""}
                onChange={(e) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, name: e.target.value },
                  })
                }
                placeholder={t.step0BasicInfo?.fullNamePlaceholder || "Enter your full name"}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">{t.step0BasicInfo?.email || "Email"} *</Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo?.email || ""}
                onChange={(e) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, email: e.target.value },
                  })
                }
                placeholder={t.step0BasicInfo?.emailPlaceholder || "example@email.com"}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">{t.step0BasicInfo?.phone || "Phone Number"} *</Label>
              <Input
                id="phone"
                type="tel"
                value={data.personalInfo?.phone || ""}
                onChange={(e) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, phone: e.target.value },
                  })
                }
                placeholder={t.step0BasicInfo?.phonePlaceholder || "+1 234 567 8900"}
                required
              />
            </div>

            <div>
              <Label htmlFor="country">{t.step0BasicInfo?.country || "Country"} *</Label>
              <Select
                value={data.personalInfo?.country || ""}
                onValueChange={(value) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, country: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.step0BasicInfo?.selectCountry || "Select Country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <TrendingUp className="h-5 w-5" />
            {t.step0BasicInfo?.companyInfo || "Startup Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">{t.step0BasicInfo?.companyName || "Company Name"} *</Label>
              <Input
                id="companyName"
                type="text"
                value={data.companyName || ""}
                onChange={(e) => onDataChange({ companyName: e.target.value })}
                placeholder={t.step0BasicInfo?.companyNamePlaceholder || "Enter your company name"}
                required
              />
            </div>

            <div>
              <Label htmlFor="foundedYear">{t.step0BasicInfo?.foundedYear || "Founded Year"}</Label>
              <Input
                id="foundedYear"
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={data.foundedYear || ""}
                onChange={(e) => onDataChange({ foundedYear: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="2023"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <DollarSign className="h-5 w-5" />
            {t.step0BasicInfo?.currency || "Currency"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="currency">{t.step0BasicInfo?.selectCurrency || "Select pricing currency"} *</Label>
            <Select value={data.currency || ""} onValueChange={(value) => onDataChange({ currency: value })}>
              <SelectTrigger>
                <SelectValue placeholder={t.step0BasicInfo?.selectCurrency || "Select Currency"} />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              {t.step0BasicInfo?.currencyNote || "This currency will be used for all calculations and reports"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <Target className="h-5 w-5" />
            {t.step0BasicInfo?.sectorTitle || "Company Sector"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            {t.step0BasicInfo?.sectorDescription || "Select the sector your startup operates in"}
          </p>
          <Select value={data.sector} onValueChange={(value) => onDataChange({ sector: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t.step0BasicInfo?.sectorPlaceholder || "Select Sector"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ecommerce">{t.step0BasicInfo?.sectors?.ecommerce || "E-commerce"}</SelectItem>
              <SelectItem value="restaurants">{t.step0BasicInfo?.sectors?.restaurants || "Restaurants"}</SelectItem>
              <SelectItem value="fashion">{t.step0BasicInfo?.sectors?.fashion || "Fashion"}</SelectItem>
              <SelectItem value="services">{t.step0BasicInfo?.sectors?.services || "Services"}</SelectItem>
              <SelectItem value="industries">{t.step0BasicInfo?.sectors?.industries || "Industries"}</SelectItem>
              <SelectItem value="saas">{t.step0BasicInfo?.sectors?.saas || "SaaS"}</SelectItem>
              <SelectItem value="other">{t.step0BasicInfo?.sectors?.other || "Other"}</SelectItem>
            </SelectContent>
          </Select>

          {data.sector === "other" && (
            <div className="space-y-3">
              <Input
                placeholder={t.step0BasicInfo?.customSectorPlaceholder || "Enter custom sector"}
                value={data.customSector || ""}
                onChange={(e) => onDataChange({ customSector: e.target.value })}
              />
              <div>
                <Label htmlFor="expectedMargin">{t.step0BasicInfo?.expectedMarginLabel || "Expected Margin %"}</Label>
                <Input
                  type="number"
                  placeholder={t.step0BasicInfo?.expectedMarginPlaceholder || "25"}
                  value={data.expectedMargin || ""}
                  onChange={(e) => onDataChange({ expectedMargin: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          {data.sector && data.sector !== "other" && (
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 mt-4">
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  {t.step0BasicInfo?.sectorMetricsTitle || "Sector Metrics"} - {data.sector}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
                      <span className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {t.step0BasicInfo?.marginLabel || "Margin"}
                      </span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {t.step0BasicInfo?.sectorBenchmarks?.[
                          data.sector as keyof typeof t.step0BasicInfo.sectorBenchmarks
                        ]?.margin || "10-20%"}
                      </Badge>
                    </div>
                    <div className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
                      <span className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {t.step0BasicInfo?.variableCostLabel || "Variable Cost"}
                      </span>
                      <Badge variant="outline">
                        {t.step0BasicInfo?.sectorBenchmarks?.[
                          data.sector as keyof typeof t.step0BasicInfo.sectorBenchmarks
                        ]?.variableCost || "50-70%"}
                      </Badge>
                    </div>
                    <div className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
                      <span className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {t.step0BasicInfo?.fixedCostLabel || "Fixed Cost"}
                      </span>
                      <Badge variant="outline">
                        {t.step0BasicInfo?.sectorBenchmarks?.[
                          data.sector as keyof typeof t.step0BasicInfo.sectorBenchmarks
                        ]?.fixedCost || "15-25%"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className={`flex items-center gap-2 mb-1 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t.step0BasicInfo?.keyMetricLabel || "Key Metric"}
                        </span>
                      </div>
                      <p className={`text-xs text-gray-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {t.step0BasicInfo?.sectorBenchmarks?.[
                          data.sector as keyof typeof t.step0BasicInfo.sectorBenchmarks
                        ]?.keyMetric || "Contribution margin"}
                      </p>
                    </div>
                    <div>
                      <div className={`flex items-center gap-2 mb-1 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className={`text-sm text-gray-600 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t.step0BasicInfo?.strategyLabel || "Strategy"}
                        </span>
                      </div>
                      <p className={`text-xs text-gray-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {t.step0BasicInfo?.sectorBenchmarks?.[
                          data.sector as keyof typeof t.step0BasicInfo.sectorBenchmarks
                        ]?.strategy || "Market analysis"}
                      </p>
                    </div>
                  </div>
                </div>
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-3">
                    <div className={`flex items-start gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className={language === "ar" ? "text-right" : "text-left"}>
                        <span className="text-sm font-medium text-yellow-800">
                          {t.step0BasicInfo?.adviceLabel || "Advice"}
                        </span>
                        <p className="text-xs text-yellow-700">
                          {t.step0BasicInfo?.sectorBenchmarks?.[
                            data.sector as keyof typeof t.step0BasicInfo.sectorBenchmarks
                          ]?.advice || "Analyze your competitors carefully"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <Lightbulb className="h-5 w-5" />
            {t.step0BasicInfo?.companyStageTitle || "Company Stage"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            {t.step0BasicInfo?.companyStageDescription || "What is the current stage of your company?"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(["idea", "mvp", "growth", "scaleup"]).map(([index, value]) => (
              <Card
                key={value}
                className={`cursor-pointer transition-all ${data.companyStage === value ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"}`}
                onClick={() => onDataChange({ companyStage: value as "idea" | "mvp" | "growth" | "scaleup" })}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t.step0BasicInfo?.stages?.[value as keyof typeof t.step0BasicInfo.stages]?.label || value}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {t.step0BasicInfo?.stages?.[value as keyof typeof t.step0BasicInfo.stages]?.desc || ""}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.companyStage === "mvp" && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {t.step0BasicInfo?.mvpHint ||
                      "At this stage, we can calculate the break-even point, but revenue and profit forecasts will be uncertain."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
