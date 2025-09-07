"use client"

import type { PricingData, CustomerPriority } from "@/lib/types"

interface Step1Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step1CustomerType({ data, onDataChange, errors, language }: Step1Props) {
  const customerTypes = [
    {
      id: "b2c",
      name: language === "ar" ? "بيع للمستهلكين (B2C)" : "Sell to Consumers (B2C)",
      desc: language === "ar" ? "الأفراد والمستهلكون النهائيون." : "Individuals and end consumers.",
      icon: "👤",
    },
    {
      id: "b2b",
      name: language === "ar" ? "بيع للشركات (B2B)" : "Sell to Businesses (B2B)",
      desc: language === "ar" ? "الشركات والمؤسسات التجارية." : "Companies and organizations.",
      icon: "🏢",
    },
    {
      id: "wholesale",
      name: language === "ar" ? "بيع جملة" : "Wholesale",
      desc: language === "ar" ? "الموزعون وتجار الجملة." : "Distributors and wholesalers.",
      icon: "📦",
    },
    {
      id: "mixed",
      name: language === "ar" ? "مزيج من أكثر من فئة" : "Mixed (more than one type)",
      desc: language === "ar" ? "قسّم نسب كل نوع تقريبًا." : "Roughly split the share of each type.",
      icon: "🔄",
    },
  ]

  const brandStrengths = [
    { id: "weak", name: language === "ar" ? "لسه بيبدأ" : "Early/Low" },
    { id: "medium", name: language === "ar" ? "معروف بدرجة معقولة" : "Moderate" },
    { id: "strong", name: language === "ar" ? "قوي ومشهور" : "Strong/Well-known" },
  ]

  const priceSensitivities = [
    {
      id: "low",
      name: language === "ar" ? "منخفضة (زيادة بسيطة مش هتأثر كتير)" : "Low (small increases won't change much)",
    },
    { id: "medium", name: language === "ar" ? "متوسطة" : "Medium" },
    { id: "high", name: language === "ar" ? "مرتفعة (زيادة 5–10% تقلل المبيعات)" : "High (5–10% can reduce sales)" },
  ]

  const paymentTerms = [
    { id: "cash", name: language === "ar" ? "نقدًا (كاش)" : "Cash" },
    { id: "credit", name: language === "ar" ? "آجل (فواتير)" : "Credit (Invoices)" },
  ]

  const customerPriorities = [
    { id: "price" as CustomerPriority, name: language === "ar" ? "السعر" : "Price", icon: "💰" },
    {
      id: "quality" as CustomerPriority,
      name: language === "ar" ? "الجودة/الاعتمادية" : "Quality/Reliability",
      icon: "🛠️",
    },
    {
      id: "speed" as CustomerPriority,
      name: language === "ar" ? "السرعة/الراحة (توصيل/تنفيذ)" : "Speed/Convenience",
      icon: "⚡",
    },
    { id: "brand" as CustomerPriority, name: language === "ar" ? "البراند/الثقة" : "Brand/Trust", icon: "🌟" },
    {
      id: "aftersales" as CustomerPriority,
      name: language === "ar" ? "خدمة ما بعد البيع/الضمان" : "After-sales/Warranty",
      icon: "🤝",
    },
    {
      id: "paymentFlex" as CustomerPriority,
      name: language === "ar" ? "مرونة الدفع/أقساط" : "Payment Flexibility",
      icon: "🧾",
    },
    {
      id: "availability" as CustomerPriority,
      name: language === "ar" ? "التوافر/المخزون الجاهز" : "Availability/Stock",
      icon: "📦",
    },
    {
      id: "customization" as CustomerPriority,
      name: language === "ar" ? "التخصيص/تفصيل حسب الطلب" : "Customization",
      icon: "🧩",
    },
    {
      id: "sustainability" as CustomerPriority,
      name: language === "ar" ? "الاستدامة/الخامات الصديقة للبيئة" : "Sustainability",
      icon: "♻️",
    },
  ]

  const sectorPresets = {
    restaurants: { speed: 40, price: 35, quality: 25 },
    ecommerce: { price: 40, speed: 35, brand: 25 },
    clothing: { brand: 40, quality: 35, price: 25 },
    services: { quality: 40, aftersales: 35, speed: 25 },
  }

  const handleMixRatioChange = (type: "b2c" | "b2b" | "wholesale", value: number) => {
    const currentRatios = data.customerType.mixRatios || { b2c: 0, b2b: 0, wholesale: 0 }
    const newRatios = { ...currentRatios, [type]: value }

    onDataChange({
      customerType: {
        ...data.customerType,
        mixRatios: newRatios,
      },
    })
  }

  const handlePriorityDrop = (draggedId: CustomerPriority, targetIndex: number) => {
    const currentRanked = data.customerType?.customerFocus?.ranked || []
    const newRanked = [...currentRanked]

    // Remove dragged item if it exists
    const draggedIndex = newRanked.indexOf(draggedId)
    if (draggedIndex > -1) {
      newRanked.splice(draggedIndex, 1)
    }

    // Insert at target position, but only keep top 3
    newRanked.splice(targetIndex, 0, draggedId)
    const finalRanked = newRanked.slice(0, 3)

    // Update weights to maintain existing values or set defaults
    const currentWeights = data.customerType?.customerFocus?.weights || {}
    const newWeights: Partial<Record<CustomerPriority, number>> = {}

    if (finalRanked.length === 3) {
      const defaultWeights = [50, 30, 20]
      finalRanked.forEach((priority, index) => {
        newWeights[priority] = currentWeights[priority] || defaultWeights[index]
      })
    }

    onDataChange({
      customerType: {
        ...data.customerType,
        customerFocus: {
          ranked: finalRanked,
          weights: newWeights,
          sectorPresetUsed: data.customerType?.customerFocus?.sectorPresetUsed || false,
        },
      },
    })
  }

  const handleWeightChange = (priority: CustomerPriority, weight: number) => {
    const currentWeights = data.customerType?.customerFocus?.weights || {}
    onDataChange({
      customerType: {
        ...data.customerType,
        customerFocus: {
          ...data.customerType?.customerFocus,
          ranked: data.customerType?.customerFocus?.ranked || [],
          weights: { ...currentWeights, [priority]: weight } as Partial<Record<CustomerPriority, number>>,
          sectorPresetUsed: data.customerType?.customerFocus?.sectorPresetUsed || false,
        },
      },
    })
  }

  const applySectorPreset = () => {
    const preset = sectorPresets[data.sector as keyof typeof sectorPresets]
    if (!preset) return

    const presetEntries = Object.entries(preset) as [CustomerPriority, number][]
    const ranked = presetEntries.map(([priority]) => priority)
    const weights = Object.fromEntries(presetEntries) as Record<CustomerPriority, number>

    onDataChange({
      customerType: {
        ...data.customerType,
        customerFocus: {
          ranked,
          weights,
          sectorPresetUsed: true,
        },
      },
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{language === "ar" ? "نوع العميل" : "Customer Type"}</h2>

        <div className="text-center mb-6">
          <p className="text-lg text-[#64748b] font-medium">
            {language === "ar"
              ? "اختر الفئة الأساسية للعملاء اللي بتبيع لهم."
              : "Choose the main type of customers you sell to."}
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-xl font-bold text-[#1e3a8a] mb-3">
            {language === "ar" ? "نوع العميل" : "Customer Type"} *
          </label>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 transition-all duration-300 ${
              errors.customerType ? "ring-2 ring-red-500 ring-opacity-50 rounded-lg p-2" : ""
            }`}
            role="radiogroup"
            aria-labelledby="customer-type-label"
            aria-required="true"
          >
            {customerTypes.map((type) => (
              <div
                key={type.id}
                className={`relative cursor-pointer transition-all duration-250 transform hover:scale-[1.02] hover:shadow-lg ${
                  data.customerType.type === type.id ? "scale-[1.03] shadow-xl" : "hover:shadow-md"
                }`}
                onClick={() =>
                  onDataChange({
                    customerType: { ...data.customerType, type: type.id as any },
                  })
                }
                role="radio"
                aria-checked={data.customerType.type === type.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onDataChange({
                      customerType: { ...data.customerType, type: type.id as any },
                    })
                  }
                }}
              >
                <div
                  className={`p-5 rounded-xl border-2 transition-all duration-250 ${
                    data.customerType.type === type.id
                      ? "bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white border-[#3b82f6] shadow-md"
                      : "bg-white border-[#e5e7eb] hover:border-[#3b82f6] hover:shadow-sm"
                  }`}
                >
                  <div className={`flex items-start gap-3 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <div className="flex-shrink-0 text-2xl w-7 h-7 flex items-center justify-center">{type.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-lg leading-tight mb-2 ${
                          data.customerType.type === type.id ? "text-white" : "text-[#1e3a8a]"
                        }`}
                      >
                        {type.name}
                      </h4>
                      <p
                        className={`text-sm leading-relaxed font-normal ${
                          data.customerType.type === type.id ? "text-white/90" : "text-[#6b7280]"
                        }`}
                      >
                        {type.desc}
                      </p>
                    </div>
                  </div>

                  {data.customerType.type === type.id && (
                    <div className={`absolute top-3 ${language === "ar" ? "left-3" : "right-3"} text-white`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {errors.customerType && (
            <div className={`mt-3 flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {language === "ar" ? "هذا الحقل مطلوب." : "This field is required."}
              </p>
            </div>
          )}
        </div>

        {data.customerType.type === "b2c" && (
          <div className="space-y-8">
            <div>
              <label className="block text-xl font-bold text-[#1e3a8a] mb-2">
                {language === "ar" ? "قوة البراند عند عملائك" : "Brand Strength with Your Customers"} *
              </label>
              <p className="text-sm text-[#6b7280] mb-4">
                {language === "ar"
                  ? "قد إيه العملاء يعرفوا اسمك ويثقوا فيك؟"
                  : "How well do customers know and trust your brand?"}
              </p>
              <div
                className={`flex gap-3 flex-wrap transition-all duration-300 ${
                  errors.brandStrength ? "ring-2 ring-red-500 ring-opacity-50 rounded-lg p-2" : ""
                }`}
                role="radiogroup"
                aria-required="true"
              >
                {brandStrengths.map((strength) => (
                  <div
                    key={strength.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      data.customerType.brandStrength === strength.id ? "transform scale-105" : "hover:scale-102"
                    }`}
                    onClick={() =>
                      onDataChange({
                        customerType: { ...data.customerType, brandStrength: strength.id as any },
                      })
                    }
                    role="radio"
                    aria-checked={data.customerType.brandStrength === strength.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onDataChange({
                          customerType: { ...data.customerType, brandStrength: strength.id as any },
                        })
                      }
                    }}
                  >
                    <div
                      className={`px-5 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        data.customerType.brandStrength === strength.id
                          ? "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white border-[#3b82f6] shadow-sm font-bold"
                          : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#3b82f6] hover:shadow-sm"
                      }`}
                    >
                      {strength.name}
                    </div>
                  </div>
                ))}
              </div>
              {errors.brandStrength && (
                <div className={`mt-2 flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm font-medium">
                    {language === "ar" ? "هذا الحقل مطلوب." : "This field is required."}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xl font-bold text-[#1e3a8a] mb-2">
                {language === "ar" ? "حساسية العملاء للسعر" : "Customer Price Sensitivity"} *
              </label>
              <p className="text-sm text-[#6b7280] mb-4">
                {language === "ar"
                  ? "لو السعر زاد 5–10%، هل قرار الشراء بيتغيّر؟"
                  : "If price increases 5–10%, does purchase decision change?"}
              </p>
              <div
                className={`flex gap-3 flex-wrap transition-all duration-300 ${
                  errors.priceSensitivity ? "ring-2 ring-red-500 ring-opacity-50 rounded-lg p-2" : ""
                }`}
                role="radiogroup"
                aria-required="true"
              >
                {priceSensitivities.map((sensitivity) => (
                  <div
                    key={sensitivity.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      data.customerType.priceSensitivity === sensitivity.id ? "transform scale-105" : "hover:scale-102"
                    }`}
                    onClick={() =>
                      onDataChange({
                        customerType: { ...data.customerType, priceSensitivity: sensitivity.id as any },
                      })
                    }
                    role="radio"
                    aria-checked={data.customerType.priceSensitivity === sensitivity.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onDataChange({
                          customerType: { ...data.customerType, priceSensitivity: sensitivity.id as any },
                        })
                      }
                    }}
                  >
                    <div
                      className={`px-5 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        data.customerType.priceSensitivity === sensitivity.id
                          ? "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white border-[#3b82f6] shadow-sm font-bold"
                          : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#3b82f6] hover:shadow-sm"
                      }`}
                    >
                      {sensitivity.name}
                    </div>
                  </div>
                ))}
              </div>
              {errors.priceSensitivity && (
                <div className={`mt-2 flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm font-medium">
                    {language === "ar" ? "هذا الحقل مطلوب." : "This field is required."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {data.customerType.type === "b2b" && (
          <div className="space-y-8">
            <div>
              <label className="block text-xl font-bold text-[#1e3a8a] mb-3">
                {language === "ar" ? "طريقة الدفع المفضلة" : "Preferred Payment Method"} *
              </label>
              <div
                className={`flex gap-3 flex-wrap transition-all duration-300 ${
                  errors.paymentTerms ? "ring-2 ring-red-500 ring-opacity-50 rounded-lg p-2" : ""
                }`}
                role="radiogroup"
                aria-required="true"
              >
                {paymentTerms.map((term) => (
                  <div
                    key={term.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      data.customerType.paymentTerms === term.id ? "transform scale-105" : "hover:scale-102"
                    }`}
                    onClick={() =>
                      onDataChange({
                        customerType: { ...data.customerType, paymentTerms: term.id as any },
                      })
                    }
                    role="radio"
                    aria-checked={data.customerType.paymentTerms === term.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onDataChange({
                          customerType: { ...data.customerType, paymentTerms: term.id as any },
                        })
                      }
                    }}
                  >
                    <div
                      className={`px-5 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        data.customerType.paymentTerms === term.id
                          ? "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white border-[#3b82f6] shadow-sm font-bold"
                          : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#3b82f6] hover:shadow-sm"
                      }`}
                    >
                      {term.name}
                    </div>
                  </div>
                ))}
              </div>
              {errors.paymentTerms && (
                <div className={`mt-2 flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm font-medium">
                    {language === "ar" ? "هذا الحقل مطلوب." : "This field is required."}
                  </p>
                </div>
              )}
            </div>

            {data.customerType.paymentTerms === "credit" && (
              <div>
                <label className="block text-lg font-bold text-[#1e3a8a] mb-2">
                  {language === "ar" ? "متوسط فترة التحصيل (أيام)" : "Average Collection Period (days)"} *
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.customerType.collectionDays || ""}
                  onChange={(e) =>
                    onDataChange({
                      customerType: {
                        ...data.customerType,
                        collectionDays: e.target.value ? Number.parseInt(e.target.value) : 0,
                      },
                    })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all duration-200 ${
                    errors.collectionDays ? "border-red-500" : "border-[#e5e7eb]"
                  }`}
                  placeholder={language === "ar" ? "مثال: 30" : "e.g., 30"}
                />
                {errors.collectionDays && (
                  <p className="text-red-600 text-sm font-medium mt-1">
                    {language === "ar" ? "هذا الحقل مطلوب." : "This field is required."}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {data.customerType.type === "mixed" && (
          <div className="space-y-6">
            <div>
              <label className="block text-xl font-bold text-[#1e3a8a] mb-2">
                {language === "ar"
                  ? "قسّم عملاءك تقريبيًا (يجب أن يكون المجموع = 100%)"
                  : "Split your customers roughly (must total 100%)"}{" "}
                *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#64748b] mb-2">
                    {language === "ar" ? "نسبة B2C" : "B2C Share"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={data.customerType.mixRatios?.b2c || 0}
                    onChange={(e) => handleMixRatioChange("b2c", Number.parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#64748b] mb-2">
                    {language === "ar" ? "نسبة B2B" : "B2B Share"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={data.customerType.mixRatios?.b2b || 0}
                    onChange={(e) => handleMixRatioChange("b2b", Number.parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#64748b] mb-2">
                    {language === "ar" ? "نسبة الجملة" : "Wholesale Share"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={data.customerType.mixRatios?.wholesale || 0}
                    onChange={(e) => handleMixRatioChange("wholesale", Number.parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              {errors.mixRatios && (
                <div className={`mt-2 flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm font-medium">{errors.mixRatios}</p>
                </div>
              )}
              <div className="mt-2 text-sm text-[#64748b] font-medium">
                {language === "ar" ? "الإجمالي الحالي: " : "Current total: "}
                {(data.customerType.mixRatios?.b2c || 0) +
                  (data.customerType.mixRatios?.b2b || 0) +
                  (data.customerType.mixRatios?.wholesale || 0)}
                %
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">
              {language === "ar" ? "العميل بيهتم بإيه أكتر؟" : "What does the customer care about most?"} *
            </h3>
            <p className="text-sm text-[#666] mt-3" style={{ fontSize: "13px" }}>
              {language === "ar"
                ? "رتّب أهم 3 حاجات تهم عميلك ووزّع نقاط عليها عشان نزبط التسعير صح."
                : "Rank the top 3 things that matter to your customer and distribute points to get pricing right."}
            </p>
          </div>

          {/* Sector Preset Button */}
          {data.sector && sectorPresets[data.sector as keyof typeof sectorPresets] && (
            <div className="mb-6">
              <button
                type="button"
                onClick={applySectorPreset}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                {language === "ar" ? `استخدم إعدادات قطاع ${data.sector}` : `Use ${data.sector} sector preset`}
              </button>
            </div>
          )}

          {/* Available Priorities */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              {language === "ar" ? "الأولويات المتاحة:" : "Available Priorities:"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {customerPriorities
                .filter((priority) => !data.customerType?.customerFocus?.ranked?.includes(priority.id))
                .map((priority) => (
                  <div
                    key={priority.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", priority.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-move hover:bg-gray-200 transition-colors text-sm"
                  >
                    <span>{priority.icon}</span>
                    <span>{priority.name}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top 3 Ranked Priorities */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              {language === "ar"
                ? "أهم 3 أولويات (اسحب وأفلت لإعادة الترتيب):"
                : "Top 3 Priorities (drag & drop to reorder):"}
            </h4>
            <div className="space-y-3">
              {[0, 1, 2].map((index) => {
                const priority = data.customerType?.customerFocus?.ranked?.[index]
                const priorityData = priority ? customerPriorities.find((p) => p.id === priority) : null
                const weight = priority ? data.customerType?.customerFocus?.weights?.[priority] || 0 : 0

                return (
                  <div
                    key={index}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const draggedId = e.dataTransfer.getData("text/plain") as CustomerPriority
                      handlePriorityDrop(draggedId, index)
                    }}
                    className={`min-h-[60px] border-2 border-dashed rounded-lg p-3 transition-colors ${
                      priorityData ? "border-blue-300 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {priorityData ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                          <span className="text-lg">{priorityData.icon}</span>
                          <span className="font-medium">{priorityData.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={weight}
                            onChange={(e) => handleWeightChange(priority!, Number(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border rounded text-center text-sm"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        {language === "ar"
                          ? `اسحب أولوية هنا للمركز ${index + 1}`
                          : `Drop priority here for position ${index + 1}`}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weight Total Display */}
          {data.customerType?.customerFocus?.ranked && data.customerType.customerFocus.ranked.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="font-medium">{language === "ar" ? "إجمالي الأوزان:" : "Total Weights:"}</span>
                <span
                  className={`font-bold ${
                    Math.abs(
                      data.customerType.customerFocus.ranked.reduce(
                        (sum, priority) => sum + (data.customerType?.customerFocus?.weights?.[priority] || 0),
                        0,
                      ) - 100,
                    ) < 0.1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {data.customerType.customerFocus.ranked.reduce(
                    (sum, priority) => sum + (data.customerType?.customerFocus?.weights?.[priority] || 0),
                    0,
                  )}
                  %
                </span>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.customerPriorities && (
            <div className={`mt-3 flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {errors.customerPriorities}
              </p>
            </div>
          )}

          {errors.customerPrioritiesWeights && (
            <div className={`mt-3 flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {errors.customerPrioritiesWeights}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
