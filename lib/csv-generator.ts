export interface CSVExportData {
  results: any[]
  projectName: string
  companyName: string
  totalRevenue: number
  totalCosts: number
  totalProfit: number
  overallMargin: number
  language: "ar" | "en"
  currency: string
}

export class KayanCSVGenerator {
  private data: CSVExportData

  constructor(data: CSVExportData) {
    this.data = data
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat(this.data.language === "ar" ? "ar-EG" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  private formatPercent(value: number): string {
    return new Intl.NumberFormat(this.data.language === "ar" ? "ar-EG" : "en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  private generateCSVContent(): string {
    const t =
      this.data.language === "ar"
        ? {
            company: "الشركة",
            date: "التاريخ",
            report: "تقرير كيان للتسعير المالي",
            product: "المنتج",
            suggestedPrice: "السعر المقترح",
            profitMargin: "هامش الربح %",
            projectedUnits: "الوحدات المتوقعة",
            expectedRevenue: "الإيرادات المتوقعة",
            expectedNetProfit: "صافي الربح المتوقع",
            totalRevenue: "إجمالي الإيرادات",
            totalCosts: "إجمالي التكاليف",
            netProfitTotal: "صافي الربح",
            profitMarginPercent: "هامش الربح %",
          }
        : {
            company: "Company",
            date: "Date",
            report: "Kayan Finance Pricing Report",
            product: "Product",
            suggestedPrice: "Suggested Price",
            profitMargin: "Profit Margin %",
            projectedUnits: "Projected Units",
            expectedRevenue: "Expected Revenue",
            expectedNetProfit: "Expected Net Profit",
            totalRevenue: "Total Revenue",
            totalCosts: "Total Costs",
            netProfitTotal: "Net Profit",
            profitMarginPercent: "Profit Margin %",
          }

    let csv = `${t.company},${this.data.companyName}\n`
    csv += `${t.date},${new Date().toLocaleDateString()}\n`
    csv += `${t.report}\n\n`

    // Product details header
    csv += `${t.product},${t.suggestedPrice},${t.profitMargin},${t.projectedUnits},${t.expectedRevenue},${t.expectedNetProfit}\n`

    // Product data
    this.data.results.forEach((result: any) => {
      const revenue = result.projectedUnits * result.finalPrice
      const netProfit = revenue - result.totalCosts

      csv += `${result.productName},${this.formatNumber(result.finalPrice)},${this.formatPercent(result.profitMargin)},${result.projectedUnits},${this.formatNumber(revenue)},${this.formatNumber(netProfit)}\n`
    })

    // Summary
    csv += `\n${t.totalRevenue},${this.formatNumber(this.data.totalRevenue)}\n`
    csv += `${t.totalCosts},${this.formatNumber(this.data.totalCosts)}\n`
    csv += `${t.netProfitTotal},${this.formatNumber(this.data.totalProfit)}\n`
    csv += `${t.profitMarginPercent},${this.formatPercent(this.data.overallMargin)}\n`

    return csv
  }

  public download(filename?: string): void {
    const csvContent = this.generateCSVContent()
    const defaultFilename = `${this.data.language === "ar" ? "تقرير_كيان_للتسعير" : "Kayan_Finance_Pricing_Report"}_${new Date().toISOString().split("T")[0]}.csv`

    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename || defaultFilename
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("CSV export error:", error)
      throw new Error("Failed to export CSV file")
    }
  }
}
