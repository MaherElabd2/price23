import jsPDF from "jspdf"
import type { PricingData } from "./types"
import { startupT, type StartupLang } from "./startup-translations"

interface PDFGeneratorOptions {
  data: PricingData
  language: "ar" | "en"
  companyName?: string
}

interface ProductResult {
  productId: string
  productName: string
  projectedUnits: number
  finalPrice: number
  totalRevenue: number
  variableCostPerUnit: number
  totalVariableCosts: number
  productFixedCosts: number
  totalCosts: number
  grossProfit: number
  profitMargin: number
  contributionMargin: number
  breakevenUnits: number
  fullCostPerUnit: number
}

export class KayanPDFGenerator {
  private pdf: jsPDF
  private data: PricingData
  private language: "ar" | "en"
  private companyName: string
  private pageWidth: number
  private pageHeight: number
  private margin: { top: number; bottom: number; left: number; right: number }

  private t(key: string): string {
    return startupT(this.language as StartupLang, key)
  }

  constructor(options: PDFGeneratorOptions) {
    this.data = options.data
    this.language = options.language
    this.companyName = options.companyName || "Company"

    // Initialize PDF with proper settings
    this.pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = { top: 20, bottom: 20, left: 20, right: 20 }

    // Set up fonts and direction based on language
    if (this.language === "ar") {
      // For Arabic: Cairo font, RTL direction
      this.pdf.setFont("helvetica")
      this.pdf.setR2L(true)
    } else {
      // For English: Inter font, LTR direction
      this.pdf.setFont("helvetica")
      this.pdf.setR2L(false)
    }
  }

  private formatCurrency(amount: number): string {
    const locale = this.language === "ar" ? "ar-EG" : "en-US"
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this.data.currency || "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  private formatNumber(num: number): string {
    return new Intl.NumberFormat(this.language === "ar" ? "ar-EG" : "en-US").format(num)
  }

  private getMarketPosition(result: ProductResult): string {
    // Simplified market position logic
    if (result.profitMargin > 30) return this.t("pdf.marketPosition.aboveMarket")
    if (result.profitMargin < 15) return this.t("pdf.marketPosition.belowMarket")
    return this.t("pdf.marketPosition.inMarket")
  }

  private getOverallPositioning(margin: number): string {
    if (margin > 25) return this.t("pdf.marginRating.excellent")
    if (margin > 15) return this.t("pdf.marginRating.good")
    return this.t("pdf.marginRating.needsImprovement")
  }

  private generateExecutiveRecommendations(summary: any): string[] {
    const recommendations = []

    if (summary.overallMargin < 15) {
      recommendations.push(this.t("pdf.recommendations.reviewCosts"))
      recommendations.push(this.t("pdf.recommendations.considerPriceIncrease"))
    } else if (summary.overallMargin > 30) {
      recommendations.push(this.t("pdf.recommendations.monitorMarket"))
      recommendations.push(this.t("pdf.recommendations.investDevelopment"))
    }

    recommendations.push(this.t("pdf.recommendations.regularReview"))
    recommendations.push(this.t("pdf.recommendations.analyzeCompetitors"))
    recommendations.push(this.t("pdf.recommendations.dynamicStrategy"))

    return recommendations.slice(0, 5) // Limit to 5 recommendations
  }

  private addAdditionalIndicators(summary: any, x: number, y: number) {
    const indicators = [
      [
        this.t("breakevenTotal"),
        `${this.formatNumber(summary.totalBreakevenUnits)} ${this.t("pdf.units")} | ${this.formatCurrency(summary.totalBreakevenRevenue)}`,
      ],
      [this.t("positioning"), this.getOverallPositioning(summary.overallMargin)],
      [this.t("pdf.productCount"), summary.productCount.toString()],
      [this.t("pdf.reportPeriod"), `${this.data.reportPeriodDays || 30} ${this.t("pdf.days")}`],
    ]

    this.pdf.setTextColor(0, 0, 0)
    this.pdf.setFontSize(12)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text(this.t("pdf.additionalIndicators"), x, y)

    indicators.forEach((indicator, index) => {
      const rowY = y + 15 + index * 12

      this.pdf.setFont("helvetica", "bold")
      this.pdf.text(indicator[0], x, rowY)

      this.pdf.setFont("helvetica", "normal")
      this.pdf.text(indicator[1], x + 100, rowY)
    })
  }

  private addCTABox() {
    const boxHeight = 40
    const boxY = this.pageHeight - this.margin.bottom - boxHeight - 20
    const boxWidth = this.pageWidth - this.margin.left - this.margin.right

    // CTA background
    this.pdf.setFillColor(30, 58, 138) // Primary blue
    this.pdf.rect(this.margin.left, boxY, boxWidth, boxHeight, "F")

    // CTA text
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(18)
    this.pdf.setFont("helvetica", "bold")

    this.pdf.text(this.t("pdf.contactCTA"), this.pageWidth / 2, boxY + boxHeight / 2 + 3, {
      align: "center",
      maxWidth: boxWidth - 40,
    })
  }

  private addPageNumbers() {
    const totalPages = this.pdf.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i)

      // Skip page numbers on cover page
      if (i === 1) continue

      this.pdf.setTextColor(100, 116, 139)
      this.pdf.setFontSize(10)
      this.pdf.setFont("helvetica", "normal")

      const pageText = this.t("pdf.pageOf").replace("{current}", i.toString()).replace("{total}", totalPages.toString())
      this.pdf.text(pageText, this.pageWidth / 2, this.pageHeight - 25, { align: "center" })
    }
  }

  public async generate(): Promise<Blob> {
    // Generate all pages
    this.addCoverPage()
    this.addProductDetailPages()
    this.addCompanySummary()
    this.addPageNumbers()

    return this.pdf.output("blob")
  }

  private addCoverPage() {
    // Cover page implementation
    this.pdf.setFillColor(30, 58, 138)
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, "F")

    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(24)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("Kayan Finance", this.pageWidth / 2, 50, { align: "center" })

    this.pdf.setFontSize(16)
    this.pdf.setFont("helvetica", "normal")
    this.pdf.text("Pricing Report", this.pageWidth / 2, 70, { align: "center" })

    this.pdf.setFontSize(12)
    this.pdf.text(`Company: ${this.companyName}`, this.pageWidth / 2, 100, { align: "center" })
    this.pdf.text(`Date: ${new Date().toLocaleDateString()}`, this.pageWidth / 2, 120, { align: "center" })
  }

  private addProductDetailPages() {
    // Product detail pages implementation
    const results = this.calculateResults()

    results.forEach((result, index) => {
      if (index > 0) {
        this.pdf.addPage()
      }

      this.pdf.setFontSize(16)
      this.pdf.setFont("helvetica", "bold")
      this.pdf.text(result.productName, this.margin.left, this.margin.top + 20)

      // Add product details
      this.pdf.setFontSize(12)
      this.pdf.setFont("helvetica", "normal")
      this.pdf.text(`Price: ${this.formatCurrency(result.finalPrice)}`, this.margin.left, this.margin.top + 40)
      this.pdf.text(`Units: ${this.formatNumber(result.projectedUnits)}`, this.margin.left, this.margin.top + 55)
      this.pdf.text(`Revenue: ${this.formatCurrency(result.totalRevenue)}`, this.margin.left, this.margin.top + 70)
      this.pdf.text(`Profit Margin: ${result.profitMargin.toFixed(1)}%`, this.margin.left, this.margin.top + 85)
    })
  }

  private addCompanySummary() {
    this.pdf.addPage()

    this.pdf.setFontSize(16)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("Company Summary", this.margin.left, this.margin.top + 20)

    const summary = this.calculateSummary()

    this.pdf.setFontSize(12)
    this.pdf.setFont("helvetica", "normal")
    this.pdf.text(`Total Revenue: ${this.formatCurrency(summary.totalRevenue)}`, this.margin.left, this.margin.top + 40)
    this.pdf.text(`Total Costs: ${this.formatCurrency(summary.totalCosts)}`, this.margin.left, this.margin.top + 55)
    this.pdf.text(`Net Profit: ${this.formatCurrency(summary.netProfit)}`, this.margin.left, this.margin.top + 70)
    this.pdf.text(`Overall Margin: ${summary.overallMargin.toFixed(1)}%`, this.margin.left, this.margin.top + 85)

    // Add recommendations
    this.pdf.setFontSize(14)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("Recommendations", this.margin.left, this.margin.top + 110)

    const recommendations = this.generateExecutiveRecommendations(summary)
    this.pdf.setFontSize(12)
    this.pdf.setFont("helvetica", "normal")

    recommendations.forEach((rec, index) => {
      this.pdf.text(`${index + 1}. ${rec}`, this.margin.left, this.margin.top + 130 + index * 15)
    })
  }

  private calculateResults(): ProductResult[] {
    // Calculate results for each product
    return this.data.products.map((product) => {
      // Extract quantity based on type
      let projectedUnits = 0
      if (typeof product.qty === "number") {
        projectedUnits = product.qty
      } else if (product.quantity?.type === "fixed" && product.quantity.value) {
        projectedUnits = product.quantity.value
      } else if (product.quantity?.type === "range" && product.quantity.min && product.quantity.max) {
        projectedUnits = (product.quantity.min + product.quantity.max) / 2
      } else if (product.quantity?.type === "historical" && product.quantity.historical) {
        projectedUnits =
          product.quantity.historical.reduce((sum, val) => sum + val, 0) / product.quantity.historical.length
      }

      const finalPrice = 0 // Will be calculated based on strategy
      const totalRevenue = projectedUnits * finalPrice
      const variableCostPerUnit = 0 // Will be calculated from variable costs
      const totalVariableCosts = projectedUnits * variableCostPerUnit
      const productFixedCosts = product.allocatedFixedCost || 0
      const totalCosts = totalVariableCosts + productFixedCosts
      const grossProfit = totalRevenue - totalCosts
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
      const contributionMargin = finalPrice - variableCostPerUnit
      const breakevenUnits = contributionMargin > 0 ? Math.ceil(productFixedCosts / contributionMargin) : 0
      const fullCostPerUnit = variableCostPerUnit + productFixedCosts / Math.max(projectedUnits, 1)

      return {
        productId: product.id,
        productName: product.name,
        projectedUnits,
        finalPrice,
        totalRevenue,
        variableCostPerUnit,
        totalVariableCosts,
        productFixedCosts,
        totalCosts,
        grossProfit,
        profitMargin,
        contributionMargin,
        breakevenUnits,
        fullCostPerUnit,
      }
    })
  }

  private calculateSummary() {
    const results = this.calculateResults()

    return {
      totalRevenue: results.reduce((sum, r) => sum + r.totalRevenue, 0),
      totalCosts: results.reduce((sum, r) => sum + r.totalCosts, 0),
      netProfit: results.reduce((sum, r) => sum + r.grossProfit, 0),
      overallMargin: results.length > 0 ? results.reduce((sum, r) => sum + r.profitMargin, 0) / results.length : 0,
      totalBreakevenUnits: results.reduce((sum, r) => sum + r.breakevenUnits, 0),
      totalBreakevenRevenue: results.reduce((sum, r) => sum + r.breakevenUnits * r.finalPrice, 0),
      productCount: results.length,
    }
  }
}

export async function generatePDF(options: PDFGeneratorOptions): Promise<Blob> {
  const generator = new KayanPDFGenerator(options)
  return await generator.generate()
}
