"use client"

import { Mail, Phone, Linkedin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface LinkItem {
  name: string
  href: string
}

export function Footer() {
  const { language } = useLanguage()
  const t = (key: string, fallbackAr: string, fallbackEn: string) =>
    language === "ar" ? fallbackAr : fallbackEn
  const year = new Date().getFullYear()

  const aboutLinks: LinkItem[] = [
    { name: t("aboutUs", "عن كيان", "About Us"), href: "https://www.kayanfinance.com/about" },
    { name: t("first30Days", "أول 30 يوم", "First 30 Days"), href: "https://www.kayanfinance.com/about/first-30-days" },
    { name: t("founder", "المؤسس", "Founder"), href: "https://www.kayanfinance.com/about/founder" },
    { name: t("contactUs", "تواصل معنا", "Contact Us"), href: "https://www.kayanfinance.com/contact-us" }
  ]

  const serviceLinks: LinkItem[] = [
    { name: t("foundationPackage", "حزمة التأسيس", "Foundation Package"), href: "https://www.kayanfinance.com/services/foundation" },
    { name: t("pastYearsCleanup", "تنظيف السنوات السابقة", "Past Years Cleanup"), href: "https://www.kayanfinance.com/services/cleanup" },
    { name: t("bookkeeping", "مسك الدفاتر", "Bookkeeping"), href: "https://www.kayanfinance.com/services/bookkeeping" },
    { name: t("oversightReview", "مراجعة وإشراف", "Oversight & Review"), href: "https://www.kayanfinance.com/services/oversight" },
    { name: t("teamTraining", "تدريب الفريق", "Team Training"), href: "https://www.kayanfinance.com/services/team-training" },
    { name: t("consultingSessions", "جلسات استشارية", "Consulting Sessions"), href: "https://www.kayanfinance.com/services/consulting" }
  ]

  return (
    <footer className="bg-[#0c1f3e] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Kayan */}
          <div className="space-y-4">
            <span className="font-bold text-lg">{t("aboutKayan", "عن كيان", "About Kayan")}</span>
            <div className="flex items-center mt-4">
              <img
                alt="Kayan Finance Logo"
                className="h-10 w-auto"
                src="https://kayanfinance.com/kayan-finance-logo.png"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pt-2">
              {t(
                "footerSlogan",
                "نقدّم حلول محاسبية ومالية عملية تساعدك تركز على نمو شركتك.",
                "We provide practical accounting and finance solutions so you can focus on growth."
              )}
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <span className="font-bold text-lg">{t("services", "الخدمات", "Services")}</span>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Kayan Links */}
          <div className="space-y-4">
            <span className="font-bold text-lg">{t("aboutKayan", "عن كيان", "About Kayan")}</span>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <span className="font-bold text-lg">{t("contactUs", "تواصل معنا", "Contact Us")}</span>
            <div className="space-y-3">
              <a
                href="tel:+201024466670"
                className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-300 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                <span>+201024466670</span>
              </a>
              <a
                href="mailto:info@kayanfinance.com"
                className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-300 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                <span>info@kayanfinance.com</span>
              </a>
              <a
                href="https://www.linkedin.com/company/kayan-finance"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-300 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {year} Kayan Finance. {t("allRightsReserved", "كل الحقوق محفوظة", "All rights reserved")}
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
              <a
                href="https://www.kayanfinance.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t("home", "الرئيسية", "Home")}
              </a>
              <a
                href="https://www.kayanfinance.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t("aboutUs", "عن كيان", "About Us")}
              </a>
              <a
                href="https://www.kayanfinance.com/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t("contactUs", "تواصل معنا", "Contact Us")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
