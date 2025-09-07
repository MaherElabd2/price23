"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Globe, ChevronDown, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

/* ---------- helpers ---------- */
const useHoverable = () => {
  const [hoverable, setHoverable] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    setHoverable(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setHoverable(e.matches)
    mq.addEventListener?.("change", onChange)
    return () => mq.removeEventListener?.("change", onChange)
  }, [])
  return hoverable
}

const menuVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16 } },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } },
}

/* ---------- Reusable PopMenu ---------- */
function PopMenu({
  id,
  label,
  items,
  isScrolled,
  active,
  tr,
  openMenu,
  setOpenMenu,
  align = "start",
}: {
  id: string
  label: string
  items: { key: string; href: string }[]
  isScrolled: boolean
  active: boolean
  tr: (k: string) => string
  openMenu: string | null
  setOpenMenu: (v: string | null) => void
  align?: "start" | "end"
}) {
  const hoverable = useHoverable()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const open = openMenu === id

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(id)
  }
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150)
  }

  useEffect(() => {
    const onOutside = (e: PointerEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener("pointerdown", onOutside)
    return () => document.removeEventListener("pointerdown", onOutside)
  }, [setOpenMenu])

  const triggerCls =
    "relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 outline-none " +
    (active
      ? isScrolled
        ? "text-primary"
        : "text-white"
      : isScrolled
      ? "text-foreground hover:text-primary"
      : "text-white/90 hover:text-white")

  return (
    <div ref={wrapperRef} className="relative" onPointerLeave={hoverable ? closeSoon : undefined}>
      <button
        type="button"
        className={triggerCls}
        onPointerEnter={hoverable ? openNow : undefined}
        onClick={() => setOpenMenu(open ? null : id)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {tr(label)} <ChevronDown className="w-4 h-4" />
        {active && isScrolled && (
          <motion.div className="absolute bottom-[-8px] left-2 right-2 h-0.5" style={{ backgroundColor: "#60A5FA" }} layoutId={`active-${label}`} />
        )}
      </button>

      <AnimatePresence initial={false} mode="wait">
        {open && (
          <motion.div
            key={`${id}-menu`}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onPointerEnter={hoverable ? openNow : undefined}
            onPointerLeave={hoverable ? closeSoon : undefined}
            className={`absolute top-full mt-1 min-w-44 rounded-md border bg-card text-card-foreground shadow-lg z-[9999] pointer-events-auto ${align === "end" ? "right-0" : "left-0"} rtl:right-0`}
            style={{ willChange: "opacity, transform" }}
          >
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="w-full text-right px-3 py-2 hover:bg-muted/40 block"
                onClick={() => setOpenMenu(null)}
              >
                {tr(it.key)}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Language Switcher ---------- */
function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const hoverable = useHoverable()
  const ref = useRef<HTMLDivElement | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    const out = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", out)
    return () => document.removeEventListener("pointerdown", out)
  }, [])

  const btn = `flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 outline-none ${
    isScrolled ? "text-muted-foreground hover:text-primary" : "text-white/90 hover:text-white"
  }`

  return (
    <div ref={ref} className="relative" onPointerLeave={hoverable ? closeSoon : undefined}>
      <button
        type="button"
        className={btn}
        onPointerEnter={hoverable ? openNow : undefined}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span>{language === "ar" ? "العربية" : "English"}</span>
      </button>

      <AnimatePresence initial={false} mode="wait">
        {open && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onPointerEnter={hoverable ? openNow : undefined}
            onPointerLeave={hoverable ? closeSoon : undefined}
            className="absolute right-0 mt-1 w-40 rounded-md border bg-card text-card-foreground shadow-lg z-[9999] pointer-events-auto"
            style={{ willChange: "opacity, transform" }}
          >
            <button
              className="w-full text-right px-3 py-2 hover:bg-muted/40 flex items-center justify-between"
              onClick={() => {
                setLanguage?.("ar")
                setOpen(false)
              }}
            >
              العربية {language === "ar" && <Check className="h-4 w-4 text-primary" />}
            </button>
            <button
              className="w-full text-right px-3 py-2 hover:bg-muted/40 flex items-center justify-between"
              onClick={() => {
                setLanguage?.("en")
                setOpen(false)
              }}
            >
              English {language === "en" && <Check className="h-4 w-4 text-primary" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Navbar ---------- */
export function Header({ heroRef }: { heroRef?: React.RefObject<HTMLElement> }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const { language } = useLanguage()
  const pathname = usePathname()

  // lightweight translator for navbar labels
  const tr = (key: string) => {
    const ar: Record<string, string> = {
      home: "الرئيسية",
      services: "خدماتنا",
      "services.all": "جميع الخدمات",
      "services.foundation": "باقة التأسيس",
      "services.cleanup": "ترتيب السنوات السابقة",
      "services.bookkeeping": "إدارة الدفاتر",
      "services.oversight": "الإشراف والمراجعة",
      "services.training": "تدريب الفريق",
      "services.consulting": "الجلسات الاستشارية",
      contact: "تواصل",
      about: "من نحن",
      "about.menu": "تعرف على كيان",
      "about.thirtyDays": "أول 30 يوم",
      founder: "المؤسس",
    }
    const en: Record<string, string> = {
      home: "Home",
      services: "Our Services",
      "services.all": "All Services",
      "services.foundation": "Foundation Package",
      "services.cleanup": "Prior Years Cleanup",
      "services.bookkeeping": "Bookkeeping",
      "services.oversight": "Oversight & Review",
      "services.training": "Team Training",
      "services.consulting": "Advisory Sessions",
      contact: "Contact",
      about: "About",
      "about.menu": "About",
      "about.thirtyDays": "First 30 days",
      founder: "Founder",
    }
    const dict = language === "ar" ? ar : en
    return dict[key] ?? key
  }

  useEffect(() => {
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    // Pricing app has no hero; keep header in scrolled style at all times for clarity
    setIsScrolled(true)
  }, [pathname])

  const serviceItems = [
    { key: "services.all", href: "https://kayanfinance.com/services" },
    { key: "services.foundation", href: "https://kayanfinance.com/services/foundation" },
    { key: "services.cleanup", href: "https://kayanfinance.com/services/cleanup" },
    { key: "services.bookkeeping", href: "https://kayanfinance.com/services/bookkeeping" },
    { key: "services.oversight", href: "https://kayanfinance.com/services/oversight" },
    { key: "services.training", href: "https://kayanfinance.com/services/training" },
    { key: "services.consulting", href: "https://kayanfinance.com/services/consulting" },
  ]
  const aboutItems = [
    { key: "about", href: "https://kayanfinance.com/about" },
    { key: "about.thirtyDays", href: "https://kayanfinance.com/about/first-30-days" },
    { key: "founder", href: "https://kayanfinance.com/founder" },
  ]

  const NavLink = ({ item, isMobile = false }: { item: { key: string; href: string }; isMobile?: boolean }) => {
    const isActive = item.href === "https://www.kayanfinance.com" ? pathname === "/" : false
    const cls = isMobile
      ? `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
          isActive
            ? "text-primary bg-accent"
            : `hover:text-primary hover:bg-accent ${isScrolled ? "text-foreground" : "text-white"}`
        }`
      : `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? isScrolled
              ? "text-primary"
              : "text-white"
            : isScrolled
            ? "text-foreground hover:text-primary"
            : "text-white/90 hover:text-white"
        }`
    return (
      <Link href={item.href} onClick={() => isMobile && setIsOpen(false)} className={cls} prefetch={false}>
        {tr(item.key)}
        {isActive && !isMobile && isScrolled && (
          <motion.div className="absolute bottom-[-8px] left-2 right-2 h-0.5" style={{ backgroundColor: "#60A5FA" }} layoutId="activeTab" />
        )}
      </Link>
    )
  }

  const iconBtn = `p-2 rounded-md transition-colors duration-200 ${
    isScrolled ? "text-muted-foreground hover:text-primary" : "text-white hover:bg-white/14"
  }`
  const isActiveService = false
  const isActiveAbout = false
  const navCls = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-card shadow-sm border-b border-border" : "bg-transparent"
  }`

  return (
    <nav className={navCls} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center h-20 ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}>
          <Link href="https://www.kayanfinance.com" className="flex-shrink-0" aria-label="Kayan Finance" prefetch={false}>
            <Image src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" width={160} height={40} className="block h-10 w-auto object-contain" priority />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink item={{ key: "home", href: "https://www.kayanfinance.com" }} />
            <PopMenu id="about" label="about.menu" items={aboutItems} isScrolled={isScrolled} active={isActiveAbout} tr={tr} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <PopMenu id="services" label="services" items={serviceItems} isScrolled={isScrolled} active={isActiveService} tr={tr} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <NavLink item={{ key: "contact", href: "https://kayanfinance.com/contact" }} />

            {/* Disabled Price Your Product Button (visible, not clickable) */}
            <button
              type="button"
              aria-disabled
              title={language === "ar" ? "أنت الآن في صفحة تسعير المنتج" : "You are on the pricing page"}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 bg-[#1e3a8a] text-white opacity-60 cursor-not-allowed"
            >
              {language === "ar" ? "سعر منتجك" : "Price Your Product"}
            </button>

            <div className="flex items-center gap-1 pl-4">
              <LanguageSwitcher isScrolled={isScrolled} />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher isScrolled={isScrolled} />
            <button onClick={() => setIsOpen((o) => !o)} className={iconBtn} aria-label="Toggle mobile menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`md:hidden ${isScrolled ? "bg-card" : "bg-primary/95 backdrop-blur-sm"} border-t border-border`}
          >
            <div className="px-4 py-3 space-y-1">
              <NavLink item={{ key: "home", href: "https://www.kayanfinance.com" }} isMobile={true} />
              <p className={`px-3 pt-2 pb-1 text-sm font-semibold ${isScrolled ? "text-muted-foreground" : "text-white/70"}`}>{tr("about.menu")}</p>
              {aboutItems.map((item) => (
                <NavLink key={item.key} item={item} isMobile={true} />
              ))}
              <p className={`px-3 pt-4 pb-1 text-sm font-semibold ${isScrolled ? "text-muted-foreground" : "text-white/70"}`}>{tr("services")}</p>
              {serviceItems.map((item) => (
                <NavLink key={item.key} item={item} isMobile={true} />
              ))}
              <div className="border-t border-border mt-3 pt-3">
                <NavLink item={{ key: "contact", href: "https://kayanfinance.com/contact" }} isMobile={true} />
                {/* Disabled Pricing CTA on mobile (visible, not clickable) */}
                <button
                  type="button"
                  aria-disabled
                  title={language === "ar" ? "أنت الآن في صفحة تسعير المنتج" : "You are on the pricing page"}
                  className="flex items-center gap-2 w-full justify-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 bg-[#1e3a8a] text-white opacity-60 cursor-not-allowed"
                >
                  {language === "ar" ? "سعر منتجك" : "Price Your Product"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
