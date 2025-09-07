import { startupT, type StartupLang } from "./startup-translations"

interface PDFPrintGeneratorOptions {
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

export class KayanPDFPrintGenerator {
  private options: PDFPrintGeneratorOptions

  constructor(options: PDFPrintGeneratorOptions) {
    this.options = options
  }

  private t(key: string): string {
    return startupT(this.options.language as StartupLang, key)
  }

  private formatCurrency(amount: number): string {
    const { currency, language } = this.options
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  private formatNumber(num: number): string {
    const { language } = this.options
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  private formatPercentage(num: number): string {
    const { language } = this.options
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num / 100)
  }

  private getKayanLogoBase64(): string {
    // Base64 encoded Kayan Finance logo to avoid CORS issues
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMWUzYThhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+S2F5YW4gRmluYW5jZTwvdGV4dD4KPC9zdmc+"
  }

  private generateCoverPage(): string {
    const { language, companyName } = this.options
    const currentDate = new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")

    const tagline =
      language === "ar"
        ? "نحوّل أرقامك إلى قرارات وقراراتك إلى نمو"
        : "Turning Your Numbers into Decisions, and Your Decisions into Growth"

    const reportInfo =
      language === "ar"
        ? `تقرير تسعير مقدم إلى: ${companyName || "شركة غير محددة"}<br>التاريخ: ${currentDate}<br>إعداد بواسطة: Kayan Finance`
        : `Pricing report for: ${companyName || "Unspecified Company"}<br>Date: ${currentDate}<br>Prepared by: Kayan Finance`

    return `
      <div class="cover-page" style="
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        page-break-after: always;
        background: white;
      ">
        <img src="${this.getKayanLogoBase64()}" alt="Kayan Finance" style="
          width: 25%;
          max-width: 300px;
          margin-bottom: 40px;
        " />
        
        <h1 style="
          font-size: 28pt;
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 60px;
          line-height: 1.4;
        ">${tagline}</h1>
        
        <div style="
          background: #f3f4f6;
          padding: 25px;
          border-radius: 8px;
          width: 65%;
          font-size: 18pt;
          line-height: 1.8;
          color: #374151;
        ">${reportInfo}</div>
        
        <div style="
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          height: 16px;
          background: #1e3a8a;
        "></div>
      </div>
    `
  }

  private generateProductsSummaryPage(): string {
    const { language, results } = this.options

    const headers =
      language === "ar"
        ? [
            "المنتج",
            "التكلفة الكاملة/الوحدة",
            "السعر المقترح",
            "هامش الربح %",
            "نقطة التعادل",
            "أدنى سعر بالسوق",
            "أعلى سعر بالسوق",
            "الموقع",
          ]
        : [
            "Product",
            "Full Cost/Unit",
            "Suggested Price",
            "Margin %",
            "Breakeven Units",
            "Market Min",
            "Market Max",
            "Position",
          ]

    const rows = results
      .map((result) => {
        const fullCost = result.fullCostPerUnit || 0
        const suggestedPrice = result.suggestedPrice || 0
        const margin = suggestedPrice > 0 ? ((suggestedPrice - fullCost) / suggestedPrice) * 100 : 0
        const breakevenUnits = result.breakevenUnits || 0
        const marketMin = result.marketAnalysis?.minPrice || 0
        const marketMax = result.marketAnalysis?.maxPrice || 0
        const position = result.marketAnalysis?.position || (language === "ar" ? "متوسط" : "Average")

        return `
        <tr>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${result.productName || result.name}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${this.formatCurrency(fullCost)}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${this.formatCurrency(suggestedPrice)}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${this.formatPercentage(margin)}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${this.formatNumber(breakevenUnits)}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${this.formatCurrency(marketMin)}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${this.formatCurrency(marketMax)}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; font-size: 16pt;">${position}</td>
        </tr>
      `
      })
      .join("")

    return `
      <div class="summary-page" style="
        background: url('https://kayanfinance.com/Kayanpaper.png') center top / cover no-repeat;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        min-height: 100vh;
        padding: 80px 40px 60px 40px;
        page-break-after: always;
      ">
        <h2 style="
          font-size: 24pt;
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 30px;
          text-align: center;
        ">${language === "ar" ? "ملخص المنتجات" : "Products Summary"}</h2>
        
        <table style="
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 8px;
          overflow: hidden;
        ">
          <thead>
            <tr style="background: #f9fafb;">
              ${headers.map((header) => `<th style="padding: 16px; text-align: ${language === "ar" ? "right" : "left"}; font-weight: 600; border-bottom: 2px solid #e5e7eb; font-size: 18pt;">${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `
  }

  private generateProductDetailPages(): string {
    const { language, results } = this.options
    let pages = ""

    for (let i = 0; i < results.length; i += 2) {
      const product1 = results[i]
      const product2 = results[i + 1]

      pages += `
        <div class="products-detail-page" style="
          background: url('https://kayanfinance.com/Kayanpaper.png') center top / cover no-repeat;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          min-height: 100vh;
          padding: 80px 40px 60px 40px;
          page-break-after: always;
        ">
          ${this.generateProductDetail(product1, true)}
          ${product2 ? this.generateProductDetail(product2, false) : ""}
        </div>
      `
    }

    return pages
  }

  private generateProductDetail(result: any, isFirst: boolean): string {
    const { language } = this.options

    const fullCost = result.fullCostPerUnit || 0
    const suggestedPrice = result.suggestedPrice || 0
    const margin = suggestedPrice > 0 ? ((suggestedPrice - fullCost) / suggestedPrice) * 100 : 0
    const breakevenUnits = result.breakevenUnits || 0

    const scenarios = result.scenarios || {
      best: { units: 0, revenue: 0, variableCost: 0, allocatedFixed: 0, netProfit: 0, margin: 0, breakevenUnits: 0 },
      base: { units: 0, revenue: 0, variableCost: 0, allocatedFixed: 0, netProfit: 0, margin: 0, breakevenUnits: 0 },
      worst: { units: 0, revenue: 0, variableCost: 0, allocatedFixed: 0, netProfit: 0, margin: 0, breakevenUnits: 0 },
    }

    const scenarioLabels = language === "ar" ? ["الأفضل", "الأساسي", "الأسوأ"] : ["Best", "Base", "Worst"]

    const scenarioHeaders =
      language === "ar"
        ? [
            "السيناريو",
            "الوحدات",
            "الإيرادات",
            "التكلفة المتغيرة",
            "التكلفة الثابتة المخصصة",
            "صافي الربح",
            "هامش الربح %",
            "وحدات التعادل",
          ]
        : [
            "Scenario",
            "Units",
            "Revenue",
            "Variable Cost",
            "Allocated Fixed",
            "Net Profit",
            "Margin %",
            "Breakeven Units",
          ]

    return `
      <div style="
        height: 50%;
        page-break-inside: avoid;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: ${isFirst ? "20px" : "0"};
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #1e3a8a;
          padding-bottom: 10px;
        ">
          <h3 style="
            font-size: 22pt;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0;
          ">${result.productName || result.name}</h3>
          <span style="
            font-size: 16pt;
            color: #6b7280;
          ">${result.sku || ""}</span>
        </div>

        <div style="
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        ">
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 14pt; color: #6b7280; margin-bottom: 8px;">
              ${language === "ar" ? "التكلفة/الوحدة" : "Cost/Unit"}
            </div>
            <div style="font-size: 18pt; font-weight: bold; color: #1e3a8a;">
              ${this.formatCurrency(fullCost)}
            </div>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 14pt; color: #6b7280; margin-bottom: 8px;">
              ${language === "ar" ? "السعر المقترح" : "Suggested Price"}
            </div>
            <div style="font-size: 18pt; font-weight: bold; color: #059669;">
              ${this.formatCurrency(suggestedPrice)}
            </div>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 14pt; color: #6b7280; margin-bottom: 8px;">
              ${language === "ar" ? "هامش الربح %" : "Margin %"}
            </div>
            <div style="font-size: 18pt; font-weight: bold; color: #dc2626;">
              ${this.formatPercentage(margin)}
            </div>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 14pt; color: #6b7280; margin-bottom: 8px;">
              ${language === "ar" ? "وحدات التعادل" : "Breakeven Units"}
            </div>
            <div style="font-size: 18pt; font-weight: bold; color: #7c3aed;">
              ${this.formatNumber(breakevenUnits)}
            </div>
          </div>
        </div>

        <table style="
          width: 100%;
          border-collapse: collapse;
          font-size: 14pt;
          margin-bottom: 15px;
        ">
          <thead>
            <tr style="background: #f3f4f6;">
              ${scenarioHeaders.map((header) => `<th style="padding: 12px; text-align: ${language === "ar" ? "right" : "left"}; font-weight: 600; border: 1px solid #d1d5db; font-size: 16pt;">${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${Object.entries(scenarios)
              .map(
                ([key, scenario], index) => `
              <tr>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-weight: 600; font-size: 14pt;">${scenarioLabels[index]}</td>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 14pt;">${this.formatNumber((scenario as any).units)}</td>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 14pt;">${this.formatCurrency((scenario as any).revenue)}</td>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 14pt;">${this.formatCurrency((scenario as any).variableCost)}</td>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 14pt;">${this.formatCurrency((scenario as any).allocatedFixed)}</td>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 14pt;">${this.formatCurrency((scenario as any).netProfit)}</td>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 14pt;">${this.formatPercentage((scenario as any).margin)}</td>
                <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 14pt;">${this.formatNumber((scenario as any).breakevenUnits)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div style="
          display: flex;
          justify-content: space-between;
          font-size: 14pt;
          color: #374151;
        ">
          <div>
            <strong>${language === "ar" ? "نطاق السوق:" : "Market Range:"}</strong>
            ${this.formatCurrency(result.marketAnalysis?.minPrice || 0)} - ${this.formatCurrency(result.marketAnalysis?.maxPrice || 0)}
          </div>
          <div>
            <strong>${language === "ar" ? "الموقع:" : "Position:"}</strong>
            ${result.marketAnalysis?.position || (language === "ar" ? "متوسط" : "Average")}
          </div>
        </div>
      </div>
    `
  }

  private generateCompanySummaryPage(): string {
    const { language, totalRevenue, totalCosts, totalProfit, overallMargin, results } = this.options

    const totalBreakevenUnits = results.reduce((sum, result) => sum + (result.breakevenUnits || 0), 0)
    const totalBreakevenValue = results.reduce(
      (sum, result) => sum + (result.breakevenUnits || 0) * (result.suggestedPrice || 0),
      0,
    )

    const recommendations =
      language === "ar"
        ? [
            "راجع أسعار المنتجات ذات الهامش المنخفض",
            "ركز على المنتجات عالية الربحية",
            "احسب تكاليف التسويق في استراتيجية التسعير",
            "راقب أسعار المنافسين بانتظام",
            "اختبر استراتيجيات تسعير مختلفة",
          ]
        : [
            "Review pricing for low-margin products",
            "Focus on high-profitability products",
            "Include marketing costs in pricing strategy",
            "Monitor competitor pricing regularly",
            "Test different pricing strategies",
          ]

    const ctaText =
      language === "ar"
        ? "هل تريد تحسين أسعار منتجاتك؟ تواصل معنا: kayanfinance.com/contact"
        : "Ready to optimize your pricing strategy? Contact us: kayanfinance.com/contact"

    return `
      <div class="summary-page" style="
        background: url('https://kayanfinance.com/Kayanpaper.png') center top / cover no-repeat;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        min-height: 100vh;
        padding: 80px 40px 60px 40px;
      ">
        <h2 style="
          font-size: 24pt;
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 40px;
          text-align: center;
        ">${language === "ar" ? "ملخص الشركة" : "Company Summary"}</h2>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #059669;
          ">
            <div style="font-size: 16pt; color: #6b7280; margin-bottom: 12px;">
              ${language === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
            </div>
            <div style="font-size: 24pt; font-weight: bold; color: #059669;">
              ${this.formatCurrency(totalRevenue)}
            </div>
          </div>
          <div style="
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #dc2626;
          ">
            <div style="font-size: 16pt; color: #6b7280; margin-bottom: 12px;">
              ${language === "ar" ? "إجمالي التكاليف" : "Total Costs"}
            </div>
            <div style="font-size: 24pt; font-weight: bold; color: #dc2626;">
              ${this.formatCurrency(totalCosts)}
            </div>
          </div>
          <div style="
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #1e3a8a;
          ">
            <div style="font-size: 16pt; color: #6b7280; margin-bottom: 12px;">
              ${language === "ar" ? "صافي الربح" : "Net Profit"}
            </div>
            <div style="font-size: 24pt; font-weight: bold; color: #1e3a8a;">
              ${this.formatCurrency(totalProfit)}
            </div>
          </div>
          <div style="
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #7c3aed;
          ">
            <div style="font-size: 16pt; color: #6b7280; margin-bottom: 12px;">
              ${language === "ar" ? "هامش الربح %" : "Margin %"}
            </div>
            <div style="font-size: 24pt; font-weight: bold; color: #7c3aed;">
              ${this.formatPercentage(overallMargin)}
            </div>
          </div>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 8px;
          ">
            <h3 style="
              font-size: 20pt;
              font-weight: bold;
              color: #1e3a8a;
              margin-bottom: 15px;
            ">${language === "ar" ? "نقطة التعادل" : "Break-even Analysis"}</h3>
            <div style="margin-bottom: 12px; font-size: 16pt;">
              <strong>${language === "ar" ? "إجمالي الوحدات:" : "Total Units:"}</strong>
              ${this.formatNumber(totalBreakevenUnits)}
            </div>
            <div style="font-size: 16pt;">
              <strong>${language === "ar" ? "إجمالي القيمة:" : "Total Value:"}</strong>
              ${this.formatCurrency(totalBreakevenValue)}
            </div>
          </div>

          <div style="
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 8px;
          ">
            <h3 style="
              font-size: 20pt;
              font-weight: bold;
              color: #1e3a8a;
              margin-bottom: 15px;
            ">${language === "ar" ? "التوصيات" : "Recommendations"}</h3>
            <ul style="
              list-style: none;
              padding: 0;
              margin: 0;
              font-size: 15pt;
              line-height: 1.8;
            ">
              ${recommendations
                .slice(0, 5)
                .map((rec) => `<li style="margin-bottom: 10px;">• ${rec}</li>`)
                .join("")}
            </ul>
          </div>
        </div>

        <div style="
          text-align: center;
          margin-top: 60px;
        ">
          <div style="
            background: #1e3a8a;
            color: white;
            padding: 25px;
            border-radius: 8px;
            font-size: 20pt;
            font-weight: bold;
            display: inline-block;
            max-width: 80%;
          ">
            ${ctaText}
          </div>
        </div>
      </div>
    `
  }

  async generateAndPrint(): Promise<void> {
    const { language } = this.options

    // Create new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      throw new Error("Unable to open print window")
    }

    const isRTL = language === "ar"
    const fontFamily = isRTL ? '"Cairo", "Tahoma", sans-serif' : '"Inter", "Arial", sans-serif'

    // Calculate total pages
    const totalPages = 3 + Math.ceil(this.options.results.length / 2) // Cover + Summary + Company + Product pages
    const currentPage = 1

    const html = `
      <!DOCTYPE html>
      <html lang="${language}" dir="${isRTL ? "rtl" : "ltr"}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${language === "ar" ? "تقرير كيان للتسعير المالي" : "Kayan Finance Pricing Report"}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: ${fontFamily};
            direction: ${isRTL ? "rtl" : "ltr"};
            color: #374151;
            line-height: 1.5;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page-number { position: fixed; bottom: 10mm; ${isRTL ? "right" : "left"}: 10mm; font-size: 10pt; color: #6b7280; }
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
          }
          
          th, td {
            text-align: ${isRTL ? "right" : "left"};
            vertical-align: top;
          }
        </style>
      </head>
      <body>
        ${this.generateCoverPage()}
        ${this.generateProductsSummaryPage()}
        ${this.generateProductDetailPages()}
        ${this.generateCompanySummaryPage()}
        
        <script>
          // Add page numbers
          let pageNum = 1;
          const pages = document.querySelectorAll('.cover-page, .summary-page, .products-detail-page');
          pages.forEach(page => {
            if (!page.classList.contains('cover-page')) {
              const pageNumber = document.createElement('div');
              pageNumber.className = 'page-number';
              pageNumber.textContent = \`${language === "ar" ? "صفحة" : "Page"} \${pageNum} ${language === "ar" ? "من" : "of"} ${totalPages}\`;
              page.appendChild(pageNumber);
            }
            pageNum++;
          });
          
          // Wait for fonts and images to load before printing
          Promise.all([
            document.fonts.ready,
            ...Array.from(document.images).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            })
          ]).then(() => {
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 1000);
            }, 500);
          });
        </script>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }
}
