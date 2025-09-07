"use client"

import type { PricingData } from "@/lib/types"
import { SelectableCard } from "@/components/ui/selectable-card"
import { Chip } from "@/components/ui/chip"
import { Package, Wrench, Calendar, Star, Zap, Crown } from "lucide-react"
import { QuestionExplanation } from "@/components/ui/question-explanation"

interface Step2Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step2ProductNature({ data, onDataChange, errors, language }: Step2Props) {
  const productTypes = [
    {
      id: "service",
      name: language === "ar" ? "خدمة" : "Service",
      desc: language === "ar" ? "زي استشارة أو تدريب" : "Like consulting or training",
      icon: Wrench,
    },
    {
      id: "physical",
      name: language === "ar" ? "منتج" : "Product",
      desc: language === "ar" ? "حاجة ملموسة بتتبع أو بتتشحن" : "A physical item to sell/ship",
      icon: Package,
    },
  ]

  const consumptionTypes = [
    {
      id: "once",
      name: language === "ar" ? "مرة واحدة" : "One-time",
      desc: language === "ar" ? "يدفع ويخلص" : "Pay once",
      icon: Zap,
    },
    {
      id: "subscription",
      name: language === "ar" ? "اشتراك" : "Subscription",
      desc: language === "ar" ? "يدفع كل شهر/سنة" : "Pay monthly/yearly",
      icon: Calendar,
    },
  ]

  const subscriptionPeriods = [
    { id: "weekly", name: language === "ar" ? "أسبوعي" : "Weekly" },
    { id: "monthly", name: language === "ar" ? "شهري" : "Monthly" },
    { id: "quarterly", name: language === "ar" ? "ربع سنوي" : "Quarterly" },
  ]

  const seasonalityTypes = [
    {
      id: "none",
      name: language === "ar" ? "ثابت طول السنة" : "Steady all year",
      desc: language === "ar" ? "الطلب ثابت مافيش تغيير كبير" : "Demand stays consistent",
      icon: Star,
    },
    {
      id: "seasonal",
      name: language === "ar" ? "موسمي" : "Seasonal",
      desc: language === "ar" ? "بيزيد في المواسم/الأعياد" : "Peaks during seasons/holidays",
      icon: Calendar,
    },
  ]

  const differentiationLevels = [
    {
      id: "standard",
      name: language === "ar" ? "عادي" : "Standard",
      desc: language === "ar" ? "زي أغلب اللي في السوق" : "Like most in the market",
      icon: Package,
    },
    {
      id: "premium",
      name: language === "ar" ? "Premium" : "Premium",
      desc: language === "ar" ? "جودة أعلى من العادي" : "Better quality than average",
      icon: Star,
    },
    {
      id: "exclusive",
      name: language === "ar" ? "مخصوص" : "Custom",
      desc: language === "ar" ? "تفصيل أو حاجة فريدة" : "Tailored/unique",
      icon: Crown,
    },
  ]

  const hasErrors = (field: string) => errors[field]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">
          {language === "ar" ? "طبيعة المنتج أو الخدمة" : "Product/Service Nature"}
        </h2>
        <p className="text-[#64748b] mb-6">
          {language === "ar"
            ? "جاوب بسرعة على شوية أسئلة بسيطة عن المنتج/الخدمة."
            : "Answer a few quick questions about your product/service."}
        </p>

        {language === "ar" && (
          <QuestionExplanation
            question="ما هو طبيعة المنتج؟"
            explanation="طبيعة المنتج بتحدد استراتيجية التسعير والتسويق، لازم نفهم إنت بتقدم إيه بالظبط."
            exampleKey="productNature"
            sector={data.sector || "general"}
            className="mb-6"
          />
        )}

        <div className="mb-8">
          <label className="block text-xl font-bold text-[#0f172a] mb-2">
            {language === "ar" ? "إنت بتقدم إيه؟" : "What do you offer?"}
            <span className="text-red-500 ml-1">*</span>
          </label>

          {language === "ar" && (
            <QuestionExplanation
              question="ما هو نوع المنتج؟"
              explanation="الفرق بين المنتج والخدمة مهم في التسعير - المنتج له تكلفة مواد، الخدمة تكلفتها في الوقت والخبرة."
              exampleKey="productType"
              sector={data.sector || "general"}
              className="mb-4"
            />
          )}

          <p className="text-sm text-[#64748b] mb-4">
            {language === "ar"
              ? "اختار نوع العرض اللي بتقدمه للعملاء"
              : "Choose the type of offering you provide to customers"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productTypes.map((type) => {
              const Icon = type.icon
              return (
                <SelectableCard
                  key={type.id}
                  selected={data.productNature.type === type.id}
                  onClick={() =>
                    onDataChange({
                      productNature: { ...data.productNature, type: type.id as any },
                    })
                  }
                  className={`transition-all duration-200 hover:scale-105 ${
                    data.productNature.type === type.id
                      ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                      : "hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#0f172a] text-lg">{type.name}</h4>
                      <p className="text-sm text-[#64748b] mt-1">{type.desc}</p>
                    </div>
                  </div>
                </SelectableCard>
              )
            })}
          </div>
          {hasErrors("productNature.type") && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ⚠️ {language === "ar" ? "لازم تختار" : "Please choose"}
            </p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-xl font-bold text-[#0f172a] mb-2">
            {language === "ar" ? "العميل بيدفع إزاي؟" : "How does the customer pay?"}
            <span className="text-red-500 ml-1">*</span>
          </label>

          {language === "ar" && (
            <QuestionExplanation
              question="ما هي طريقة الدفع؟"
              explanation="طريقة الدفع بتأثر على التدفق النقدي والتسعير - الاشتراك بيدي دخل ثابت، الدفع مرة واحدة محتاج هامش ربح أعلى."
              exampleKey="paymentMethod"
              sector={data.sector || "general"}
              className="mb-4"
            />
          )}

          <p className="text-sm text-[#64748b] mb-4">
            {language === "ar"
              ? "اختار طريقة الدفع المناسبة لعملك"
              : "Choose the payment method that fits your business"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consumptionTypes.map((type) => {
              const Icon = type.icon
              return (
                <SelectableCard
                  key={type.id}
                  selected={data.productNature.consumption === type.id}
                  onClick={() =>
                    onDataChange({
                      productNature: { ...data.productNature, consumption: type.id as any },
                    })
                  }
                  className={`transition-all duration-200 hover:scale-105 ${
                    data.productNature.consumption === type.id
                      ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                      : "hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#0f172a] text-lg">{type.name}</h4>
                      <p className="text-sm text-[#64748b] mt-1">{type.desc}</p>
                    </div>
                  </div>
                </SelectableCard>
              )
            })}
          </div>
          {hasErrors("productNature.consumption") && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ⚠️ {language === "ar" ? "لازم تختار" : "Please choose"}
            </p>
          )}
        </div>

        {data.productNature.consumption === "subscription" && (
          <div className="mb-8">
            <label className="block text-lg font-semibold text-[#0f172a] mb-2">
              {language === "ar" ? "كل قد إيه الاشتراك؟" : "How often is the subscription?"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-sm text-[#64748b] mb-4">
              {language === "ar" ? "اختار فترة تجديد الاشتراك" : "Choose subscription renewal period"}
            </p>
            <div className="flex flex-wrap gap-3">
              {subscriptionPeriods.map((period) => (
                <Chip
                  key={period.id}
                  selected={data.productNature.subscriptionPeriod === period.id}
                  onClick={() =>
                    onDataChange({
                      productNature: { ...data.productNature, subscriptionPeriod: period.id as any },
                    })
                  }
                  className={`px-6 py-3 text-base transition-all duration-200 hover:scale-105 ${
                    data.productNature.subscriptionPeriod === period.id
                      ? "bg-blue-600 text-white ring-2 ring-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {period.name}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <label className="block text-xl font-bold text-[#0f172a] mb-2">
            {language === "ar" ? "الطلب عندك ماشي إزاي؟" : "How's your demand?"}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-sm text-[#64748b] mb-4">
            {language === "ar"
              ? "هل الطلب على منتجك ثابت ولا بيتغير حسب الوقت؟"
              : "Is demand for your product steady or does it change with time?"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonalityTypes.map((type) => {
              const Icon = type.icon
              return (
                <SelectableCard
                  key={type.id}
                  selected={data.productNature.seasonality === type.id}
                  onClick={() =>
                    onDataChange({
                      productNature: { ...data.productNature, seasonality: type.id as any },
                    })
                  }
                  className={`transition-all duration-200 hover:scale-105 ${
                    data.productNature.seasonality === type.id
                      ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                      : "hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#0f172a] text-lg">{type.name}</h4>
                      <p className="text-sm text-[#64748b] mt-1">{type.desc}</p>
                    </div>
                  </div>
                </SelectableCard>
              )
            })}
          </div>
          {hasErrors("productNature.seasonality") && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ⚠️ {language === "ar" ? "لازم تختار" : "Please choose"}
            </p>
          )}
        </div>

        {data.productNature.seasonality === "seasonal" && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-[#0f172a] mb-2">
                {language === "ar" ? "إيه الموسم اللي بيزيد فيه الطلب؟" : "When does demand peak?"}
              </label>
              <input
                type="text"
                value={data.productNature.peakSeason || ""}
                onChange={(e) =>
                  onDataChange({
                    productNature: { ...data.productNature, peakSeason: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent text-base"
                placeholder={language === "ar" ? "مثال: رمضان، الصيف، الشتاء" : "e.g., Summer, Winter, Holidays"}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-[#0f172a] mb-2">
                {language === "ar" ? "بكام في المية بيزيد الطلب؟" : "By what percentage does demand increase?"}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={data.productNature.peakPercentage || ""}
                onChange={(e) =>
                  onDataChange({
                    productNature: {
                      ...data.productNature,
                      peakPercentage: e.target.value ? Number.parseInt(e.target.value) : 0,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent text-base"
                placeholder="60"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xl font-bold text-[#0f172a] mb-2">
            {language === "ar" ? "المنتج بتاعك عامل إزاي قدام السوق؟" : "How's your product vs market?"}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-sm text-[#64748b] mb-4">
            {language === "ar"
              ? "قارن منتجك بالمنافسين في السوق"
              : "Compare your product with competitors in the market"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {differentiationLevels.map((level) => {
              const Icon = level.icon
              return (
                <SelectableCard
                  key={level.id}
                  selected={data.productNature.differentiation === level.id}
                  onClick={() =>
                    onDataChange({
                      productNature: { ...data.productNature, differentiation: level.id as any },
                    })
                  }
                  className={`transition-all duration-200 hover:scale-105 ${
                    data.productNature.differentiation === level.id
                      ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                      : "hover:border-blue-300"
                  }`}
                >
                  <div className="text-center">
                    <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-[#0f172a] text-lg">{level.name}</h4>
                    <p className="text-sm text-[#64748b] mt-1">{level.desc}</p>
                  </div>
                </SelectableCard>
              )
            })}
          </div>
          {hasErrors("productNature.differentiation") && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ⚠️ {language === "ar" ? "لازم تختار" : "Please choose"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
