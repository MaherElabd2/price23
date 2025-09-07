"use client"

import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"
import { CollapsibleHint } from "@/components/ui/collapsible-hint"

interface SMEStep0Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function SMEStep0BasicInfo({ data, onDataChange, errors, language }: SMEStep0Props) {
  const countries = [
    { id: "EG", name: language === "ar" ? "مصر" : "Egypt" },
    { id: "SA", name: language === "ar" ? "السعودية" : "Saudi Arabia" },
    { id: "AE", name: language === "ar" ? "الإمارات العربية المتحدة" : "United Arab Emirates" },
    { id: "KW", name: language === "ar" ? "الكويت" : "Kuwait" },
    { id: "QA", name: language === "ar" ? "قطر" : "Qatar" },
    { id: "BH", name: language === "ar" ? "البحرين" : "Bahrain" },
    { id: "OM", name: language === "ar" ? "عمان" : "Oman" },
    { id: "JO", name: language === "ar" ? "الأردن" : "Jordan" },
    { id: "LB", name: language === "ar" ? "لبنان" : "Lebanon" },
    { id: "SY", name: language === "ar" ? "سوريا" : "Syria" },
    { id: "IQ", name: language === "ar" ? "العراق" : "Iraq" },
    { id: "YE", name: language === "ar" ? "اليمن" : "Yemen" },
    { id: "LY", name: language === "ar" ? "ليبيا" : "Libya" },
    { id: "TN", name: language === "ar" ? "تونس" : "Tunisia" },
    { id: "DZ", name: language === "ar" ? "الجزائر" : "Algeria" },
    { id: "MA", name: language === "ar" ? "المغرب" : "Morocco" },
    { id: "SD", name: language === "ar" ? "السودان" : "Sudan" },
    { id: "US", name: language === "ar" ? "الولايات المتحدة" : "United States" },
    { id: "GB", name: language === "ar" ? "المملكة المتحدة" : "United Kingdom" },
    { id: "DE", name: language === "ar" ? "ألمانيا" : "Germany" },
    { id: "FR", name: language === "ar" ? "فرنسا" : "France" },
    { id: "IT", name: language === "ar" ? "إيطاليا" : "Italy" },
    { id: "ES", name: language === "ar" ? "إسبانيا" : "Spain" },
    { id: "CA", name: language === "ar" ? "كندا" : "Canada" },
    { id: "AU", name: language === "ar" ? "أستراليا" : "Australia" },
    { id: "TR", name: language === "ar" ? "تركيا" : "Turkey" },
    { id: "IN", name: language === "ar" ? "الهند" : "India" },
    { id: "CN", name: language === "ar" ? "الصين" : "China" },
    { id: "JP", name: language === "ar" ? "اليابان" : "Japan" },
    { id: "KR", name: language === "ar" ? "كوريا الجنوبية" : "South Korea" },
    { id: "BR", name: language === "ar" ? "البرازيل" : "Brazil" },
    { id: "MX", name: language === "ar" ? "المكسيك" : "Mexico" },
    { id: "RU", name: language === "ar" ? "روسيا" : "Russia" },
    { id: "ZA", name: language === "ar" ? "جنوب أفريقيا" : "South Africa" },
    { id: "NG", name: language === "ar" ? "نيجيريا" : "Nigeria" },
    { id: "KE", name: language === "ar" ? "كينيا" : "Kenya" },
    { id: "GH", name: language === "ar" ? "غانا" : "Ghana" },
    { id: "ET", name: language === "ar" ? "إثيوبيا" : "Ethiopia" },
  ]

  const sectors = [
    { id: "ecommerce", name: t(language, "basicInfo.ecommerce") },
    { id: "restaurants", name: t(language, "basicInfo.restaurants") },
    { id: "clothing", name: t(language, "basicInfo.clothing") },
    { id: "services", name: t(language, "basicInfo.services") },
    { id: "industries", name: t(language, "basicInfo.industries") },
    { id: "tech", name: t(language, "basicInfo.tech") },
    { id: "other", name: t(language, "basicInfo.other") },
  ]

  const companySizes = [
    {
      id: "sme",
      name: t(language, "basicInfo.sme"),
      desc: t(language, "basicInfo.smeDesc"),
    },
    {
      id: "enterprise",
      name: t(language, "basicInfo.enterprise"),
      desc: t(language, "basicInfo.enterpriseDesc"),
    },
  ]

  const currencies = ["EGP", "USD", "EUR", "SAR", "AED"]

  const showSectorAndProducts = true // Always show for SME

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{t(language, "smeBasicInfo.title")}</h2>

        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "smeBasicInfo.personalInfo")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "smeBasicInfo.fullName")} *
              </label>
              <input
                type="text"
                value={data.personalInfo.name}
                onChange={(e) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, name: e.target.value },
                  })
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                  errors.name ? "border-[#dc2626]" : "border-[#e5e7eb]"
                }`}
                placeholder={t(language, "smeBasicInfo.fullNamePlaceholder")}
                required
                aria-required="true"
              />
              {errors.name && <p className="text-[#dc2626] text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "smeBasicInfo.email")} *
              </label>
              <input
                type="email"
                value={data.personalInfo.email}
                onChange={(e) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, email: e.target.value },
                  })
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                  errors.email ? "border-[#dc2626]" : "border-[#e5e7eb]"
                }`}
                placeholder="example@email.com"
                required
                aria-required="true"
              />
              {errors.email && <p className="text-[#dc2626] text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "smeBasicInfo.phone")} *
              </label>
              <input
                type="tel"
                value={data.personalInfo.phone}
                onChange={(e) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, phone: e.target.value },
                  })
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                  errors.phone ? "border-[#dc2626]" : "border-[#e5e7eb]"
                }`}
                placeholder={t(language, "smeBasicInfo.phonePlaceholder")}
                required
                aria-required="true"
              />
              {errors.phone && <p className="text-[#dc2626] text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "smeBasicInfo.country")} *
              </label>
              <select
                value={data.personalInfo.country}
                onChange={(e) =>
                  onDataChange({
                    personalInfo: { ...data.personalInfo, country: e.target.value },
                  })
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                  errors.country ? "border-[#dc2626]" : "border-[#e5e7eb]"
                } ${language === "ar" ? "text-right" : "text-left"}`}
                required
                aria-required="true"
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-[#dc2626] text-sm mt-1">{errors.country}</p>}
            </div>
          </div>
          {language === "ar" && (
            <CollapsibleHint sectionName="sme-personal-info">
              <div className="text-sm text-[#64748b] space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">💡</span>
                  <div className="space-y-2">
                    <p className="font-medium text-[#475569]">ليه محتاجين البيانات دي؟</p>
                    <p>علشان نقدر نحسبلك التسعير المناسب لبلدك وظروف شغلك كشركة صغيرة ومتوسطة</p>
                  </div>
                </div>
              </div>
            </CollapsibleHint>
          )}
        </div>

        {/* Company Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "smeBasicInfo.companyInfo")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "smeBasicInfo.companyName")} *
              </label>
              <input
                type="text"
                value={data.companyInfo.companyName}
                onChange={(e) =>
                  onDataChange({
                    companyInfo: { ...data.companyInfo, companyName: e.target.value },
                  })
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
                  errors.companyName ? "border-[#dc2626]" : "border-[#e5e7eb]"
                }`}
                placeholder={t(language, "smeBasicInfo.companyNamePlaceholder")}
                required
                aria-required="true"
              />
              {errors.companyName && <p className="text-[#dc2626] text-sm mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">
                {t(language, "smeBasicInfo.foundedYear")}
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={data.companyInfo.foundedYear || ""}
                onChange={(e) =>
                  onDataChange({
                    companyInfo: {
                      ...data.companyInfo,
                      foundedYear: e.target.value ? Number.parseInt(e.target.value) : null,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                placeholder="2020"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-3">
              {t(language, "smeBasicInfo.companySize")} *
            </label>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${errors.companySize ? "border border-[#dc2626] rounded-lg p-2" : ""}`}
              role="radiogroup"
              aria-labelledby="company-size-label"
              aria-required="true"
            >
              {companySizes.map((size) => (
                <div
                  key={size.id}
                  onClick={() =>
                    onDataChange({
                      companyInfo: { ...data.companyInfo, companySize: size.id as any },
                    })
                  }
                  className={`
                    cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md
                    ${
                      data.companyInfo.companySize === size.id
                        ? "border-[#3b82f6] bg-[#eff6ff] shadow-lg ring-2 ring-[#3b82f6] ring-opacity-20"
                        : "border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#f9fafb]"
                    }
                  `}
                  role="radio"
                  aria-checked={data.companyInfo.companySize === size.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onDataChange({
                        companyInfo: { ...data.companyInfo, companySize: size.id as any },
                      })
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <h4 className="font-semibold text-[#0f172a]">{size.name}</h4>
                      {data.companyInfo.companySize === size.id && <span className="ml-2 text-[#3b82f6]">✅</span>}
                    </div>
                    <p className="text-sm text-[#64748b]">{size.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {errors.companySize && <p className="text-[#dc2626] text-sm mt-1">{errors.companySize}</p>}
          </div>
          {language === "ar" && (
            <CollapsibleHint sectionName="sme-company-info">
              <div className="text-sm text-[#64748b] space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">💼</span>
                  <div className="space-y-2">
                    <p className="font-medium text-[#475569]">معلومات الشركة:</p>
                    <p>علشان نفهم حجم شغلك كشركة صغيرة ومتوسطة ونديلك نصايح مناسبة لحجمك</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">📊</span>
                  <div className="space-y-2">
                    <p className="font-medium text-[#475569]">حجم الشغل:</p>
                    <p>اختار الوصف اللي أقرب لوضعك كشركة صغيرة ومتوسطة علشان نديلك الحسابات المناسبة</p>
                  </div>
                </div>
              </div>
            </CollapsibleHint>
          )}
        </div>

        {/* Setup - Always show for SME */}
        <div>
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">{t(language, "smeBasicInfo.setup")}</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0f172a] mb-3">
              {t(language, "smeBasicInfo.sector")} *
            </label>
            <div className={`flex flex-wrap gap-2 ${errors.sector ? "border border-[#dc2626] rounded-lg p-2" : ""}`}>
              {sectors.map((sector) => (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => onDataChange({ sector: sector.id as any })}
                  className={`
                    px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium
                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-opacity-50
                    ${
                      data.sector === sector.id
                        ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-lg"
                        : "bg-white text-[#374151] border-[#d1d5db] hover:border-[#9ca3af] hover:bg-[#f9fafb]"
                    }
                  `}
                  aria-pressed={data.sector === sector.id}
                >
                  {sector.name}
                </button>
              ))}
            </div>
            {errors.sector && <p className="text-[#dc2626] text-sm mt-1">{errors.sector}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0f172a] mb-3">
              {t(language, "smeBasicInfo.numberOfProducts")} *
            </label>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${errors.productMode ? "border border-[#dc2626] rounded-lg p-2" : ""}`}
              role="radiogroup"
              aria-labelledby="product-mode-label"
              aria-required="true"
            >
              <div
                onClick={() => onDataChange({ productMode: "single" })}
                className={`
                  cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md
                  ${
                    data.productMode === "single"
                      ? "border-[#3b82f6] bg-[#eff6ff] shadow-lg ring-2 ring-[#3b82f6] ring-opacity-20"
                      : "border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#f9fafb]"
                  }
                `}
                role="radio"
                aria-checked={data.productMode === "single"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onDataChange({ productMode: "single" })
                  }
                }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <h4 className="font-semibold text-[#0f172a]">{t(language, "smeBasicInfo.singleProduct")}</h4>
                    {data.productMode === "single" && <span className="ml-2 text-[#3b82f6]">✅</span>}
                  </div>
                  <p className="text-sm text-[#64748b]">{t(language, "smeBasicInfo.singleProductDesc")}</p>
                </div>
              </div>

              <div
                onClick={() => onDataChange({ productMode: "multi" })}
                className={`
                  cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md
                  ${
                    data.productMode === "multi"
                      ? "border-[#3b82f6] bg-[#eff6ff] shadow-lg ring-2 ring-[#3b82f6] ring-opacity-20"
                      : "border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#f9fafb]"
                  }
                `}
                role="radio"
                aria-checked={data.productMode === "multi"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onDataChange({ productMode: "multi" })
                  }
                }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <h4 className="font-semibold text-[#0f172a]">{t(language, "smeBasicInfo.multipleProducts")}</h4>
                    {data.productMode === "multi" && <span className="ml-2 text-[#3b82f6]">✅</span>}
                  </div>
                  <p className="text-sm text-[#64748b]">{t(language, "smeBasicInfo.multipleProductsDesc")}</p>
                </div>
              </div>
            </div>
            {errors.productMode && <p className="text-[#dc2626] text-sm mt-1">{errors.productMode}</p>}
          </div>
          {language === "ar" && (
            <CollapsibleHint sectionName="sme-setup-info">
              <div className="text-sm text-[#64748b] space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">🏢</span>
                  <div className="space-y-2">
                    <p className="font-medium text-[#475569]">مجال الشغل:</p>
                    <p>اختار القطاع اللي بتشغل فيه كشركة صغيرة ومتوسطة علشان نديلك نصايح مخصوصة لمجالك</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">📦</span>
                  <div className="space-y-2">
                    <p className="font-medium text-[#475569]">عدد المنتجات:</p>
                    <p>عندك منتج واحد بس ولا أكتر من منتج؟ ده هيغير طريقة حساب التكاليف والأرباح للشركات الصغيرة والمتوسطة</p>
                  </div>
                </div>
              </div>
            </CollapsibleHint>
          )}
        </div>

        {/* Currency - Always show */}
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">{t(language, "smeBasicInfo.currency")} *</label>
          <select
            value={data.currency}
            onChange={(e) => onDataChange({ currency: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${
              errors.currency ? "border-[#dc2626]" : "border-[#e5e7eb]"
            }`}
            required
            aria-required="true"
          >
            <option value="">{t(language, "smeBasicInfo.selectCurrency")}</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {errors.currency && <p className="text-[#dc2626] text-sm mt-1">{errors.currency}</p>}
          {language === "ar" && (
            <CollapsibleHint sectionName="sme-currency-info">
              <div className="text-sm text-[#64748b]">
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">💰</span>
                  <div className="space-y-2">
                    <p className="font-medium text-[#475569]">العملة:</p>
                    <p>اختار العملة اللي بتحاسب بيها عملاءك كشركة صغيرة ومتوسطة علشان كل الحسابات تطلع بنفس العملة</p>
                  </div>
                </div>
              </div>
            </CollapsibleHint>
          )}
        </div>
      </div>
    </div>
  )
}
