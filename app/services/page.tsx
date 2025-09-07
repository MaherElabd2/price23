"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

const packages = [
  {
    key: "services.foundation",
    ar: "باقة التأسيس",
    en: "Foundation Package",
    href: "https://kayanfinance.com/services/foundation",
    descAr: "نبدأ تأسيس نظامك المحاسبي بطريقة صحيحة",
    descEn: "Kickstart your accounting system the right way",
  },
  {
    key: "services.cleanup",
    ar: "باقة التنظيف",
    en: "Cleanup Package",
    href: "https://kayanfinance.com/services/cleanup",
    descAr: "تنظيف وترتيب حساباتك المتراكمة",
    descEn: "Clean up and organize your backlog accounts",
  },
  {
    key: "services.bookkeeping",
    ar: "باقة مسك الدفاتر",
    en: "Bookkeeping Package",
    href: "https://kayanfinance.com/services/bookkeeping",
    descAr: "تسجيل مستمر ودقيق لمعاملاتك",
    descEn: "Accurate, continuous recording of your transactions",
  },
  {
    key: "services.oversight",
    ar: "باقة المراجعة",
    en: "Oversight Package",
    href: "https://kayanfinance.com/services/oversight",
    descAr: "إشراف ومراجعة دورية على التقارير",
    descEn: "Periodic supervision and review of reports",
  },
  {
    key: "services.training",
    ar: "باقة التدريب",
    en: "Training Package",
    href: "https://kayanfinance.com/services/training",
    descAr: "نقل المعرفة وبناء قدرات فريقك",
    descEn: "Upskill your team and transfer the know‑how",
  },
  {
    key: "services.consulting",
    ar: "باقة الاستشارات",
    en: "Consulting Package",
    href: "https://kayanfinance.com/services/consulting",
    descAr: "استشارات مالية ومحاسبية حسب احتياجك",
    descEn: "Advisory tailored to your needs",
  },
]

export default function ServicesPage() {
  const { language } = useLanguage()
  const isAr = language === "ar"

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {isAr ? "الخدمات" : "Services"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isAr ? "استعرض الباقات واختر ما يناسب احتياجك" : "Browse the packages and pick what fits your needs"}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((p) => (
          <div key={p.key} className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex flex-col">
            <h2 className="text-xl font-semibold mb-1">{isAr ? p.ar : p.en}</h2>
            <p className="text-sm text-muted-foreground mb-4">{isAr ? p.descAr : p.descEn}</p>
            <div className="mt-auto">
              <Link
                href={p.href}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 bg-[#1e3a8a] text-white hover:bg-blue-700"
              >
                {isAr ? "اعرف المزيد" : "Learn more"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
