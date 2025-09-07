export class PDFExporter {
  private data: any
  private results: any[]
  private portfolioSummary: any
  private language: "ar" | "en"

  constructor(data: any, results: any[], portfolioSummary: any, language: "ar" | "en") {
    this.data = data
    this.results = results
    this.portfolioSummary = portfolioSummary
    this.language = language
  }

  async generatePDF() {
    if (!this.results || !Array.isArray(this.results) || this.results.length === 0) {
      alert(this.language === "ar" ? "لا توجد نتائج للتصدير" : "No results to export")
      return
    }

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert(this.language === "ar" ? "يرجى السماح بالنوافذ المنبثقة" : "Please allow pop-ups")
      return
    }

    const isRTL = this.language === "ar"
    const fontFamily = isRTL ? "Cairo" : "Inter"

    const htmlContent = `
<!DOCTYPE html>
<html lang="${this.language}" dir="${isRTL ? "rtl" : "ltr"}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isRTL ? "تقرير التسعير - كيان فينانس" : "Pricing Report - Kayan Finance"}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${fontFamily}', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            direction: ${isRTL ? "rtl" : "ltr"};
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .page {
            page-break-after: always;
            min-height: 270mm;
            max-width: 180mm;
            margin: 0 auto;
            padding: 10mm;
            position: relative;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .cover-page {
            background: white;
            text-align: center;
            padding: 40mm 20mm;
        }
        
        .letterhead-page {
            /* Added official paper background from Kayan Finance */
            background-image: url('https://kayanfinance.com/Kayanpaper.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding-top: 30mm; /* Space for header logo */
            padding-bottom: 20mm; /* Space for footer */
        }
        
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 20px;
        }
        
        .company-info {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            margin: 20px auto;
            max-width: 400px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 10px;
            word-wrap: break-word;
        }
        
        h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1e3a8a;
            margin-bottom: 15px;
            word-wrap: break-word;
        }
        
        h3 {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
            word-wrap: break-word;
        }
        
        .tagline {
            font-size: 16px;
            color: #3b82f6;
            margin-bottom: 30px;
            font-weight: 500;
        }
        
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .summary-table th {
            background: #1e3a8a;
            color: white;
            padding: 8px 6px;
            text-align: ${isRTL ? "right" : "left"};
            font-weight: 600;
            border: 1px solid #1e3a8a;
            word-wrap: break-word;
            max-width: 80px;
        }
        
        .summary-table td {
            padding: 6px;
            border: 1px solid #e5e7eb;
            text-align: ${isRTL ? "right" : "left"};
            word-wrap: break-word;
            max-width: 80px;
            overflow: hidden;
        }
        
        .summary-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .product-section {
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            height: 120mm;
            overflow: hidden;
        }
        
        .product-header {
            background: #3b82f6;
            color: white;
            padding: 10px;
            margin: -15px -15px 15px -15px;
            border-radius: 8px 8px 0 0;
        }
        
        .product-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
            word-wrap: break-word;
        }
        
        .suggested-price {
            font-size: 20px;
            font-weight: 700;
            color: #fbbf24;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 15px 0;
        }
        
        .metric-item {
            padding: 8px;
            background: #f8fafc;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
        
        .metric-label {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 2px;
            word-wrap: break-word;
        }
        
        .metric-value {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
            word-wrap: break-word;
        }
        
        .scenarios-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-top: 10px;
        }
        
        .scenarios-table th {
            background: #f1f5f9;
            padding: 4px;
            border: 1px solid #cbd5e1;
            font-size: 9px;
            word-wrap: break-word;
        }
        
        .scenarios-table td {
            padding: 4px;
            border: 1px solid #e2e8f0;
            text-align: ${isRTL ? "right" : "left"};
            font-size: 9px;
            word-wrap: break-word;
        }
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .kpi-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            text-align: center;
        }
        
        .kpi-value {
            font-size: 18px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 5px;
            word-wrap: break-word;
        }
        
        .kpi-label {
            font-size: 11px;
            color: #6b7280;
            word-wrap: break-word;
        }
        
        .recommendations {
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            margin: 15px 0;
        }
        
        .recommendation-item {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
            font-size: 11px;
            word-wrap: break-word;
        }
        
        .recommendation-item:last-child {
            border-bottom: none;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            opacity: 0.05;
            font-size: 48px;
            font-weight: 700;
            color: #1e3a8a;
            z-index: -1;
            pointer-events: none;
        }
        
        .footer {
            position: fixed;
            bottom: 10mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #666;
            background: rgba(255, 255, 255, 0.9);
            padding: 5px;
        }
        
        @media print {
            body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .page {
                page-break-after: always;
                margin: 0;
                padding: 10mm;
            }
            .page:last-child {
                page-break-after: avoid;
            }
            /* Ensure background images print correctly */
            .letterhead-page {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        
        /* Text overflow prevention */
        .text-container {
            max-width: 100%;
            overflow: hidden;
            word-wrap: break-word;
            hyphens: auto;
        }
        
        /* Ensure tables don't overflow */
        table {
            table-layout: fixed;
            width: 100%;
        }
        
        th, td {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    ${this.generateCoverPage()}
    ${this.generateProductsSnapshot()}
    ${this.generateProductPages()}
    ${this.generateCompanySummary()}
    
    <div class="footer">
        © كيان فينانس 2025 – جميع الحقوق محفوظة
    </div>
    
    <script>
        // Wait for fonts and images to load before printing
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        });
    </script>
</body>
</html>`

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  private generateCoverPage(): string {
    const isRTL = this.language === "ar"

    return `
    <div class="page cover-page">
        <div class="watermark">${isRTL ? "كيان فينانس" : "KAYAN FINANCE"}</div>
        
        <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance Logo" class="logo" />
        
        <h1 class="text-container">${isRTL ? "تقرير التسعير الاحترافي" : "Professional Pricing Report"}</h1>
        
        <p class="tagline text-container">${isRTL ? "حلول التسعير الذكية للشركات الناشئة والمتوسطة" : "Smart Pricing Solutions for SMEs"}</p>
        
        <div class="company-info">
            <h3 class="text-container">${isRTL ? "معلومات التقرير" : "Report Information"}</h3>
            <div style="text-align: ${isRTL ? "right" : "left"}; margin-top: 15px;">
                <p class="text-container"><strong>${isRTL ? "تاريخ التقرير:" : "Report Date:"}</strong> ${new Date().toLocaleDateString(isRTL ? "ar-EG" : "en-US")}</p>
                <p class="text-container"><strong>${isRTL ? "عدد المنتجات:" : "Number of Products:"}</strong> ${this.results.length}</p>
                <p class="text-container"><strong>${isRTL ? "فترة التقرير:" : "Report Period:"}</strong> ${this.data.reportPeriodDays || 30} ${isRTL ? "يوم" : "days"}</p>
                <p class="text-container"><strong>${isRTL ? "العملة:" : "Currency:"}</strong> ${this.data.currency || "EGP"}</p>
                <p class="text-container"><strong>${isRTL ? "التركيز الأساسي:" : "Primary Focus:"}</strong> ${isRTL ? "استراتيجية التسعير المتقدمة" : "Advanced Pricing Strategy"}</p>
            </div>
        </div>
        
        <div style="margin-top: 40px; font-size: 12px; color: #6b7280;">
            <p class="text-container">${isRTL ? "هذا التقرير يحتوي على تحليل شامل لاستراتيجية التسعير المقترحة" : "This report contains comprehensive analysis of the proposed pricing strategy"}</p>
            <p class="text-container">${isRTL ? "بناءً على البيانات المدخلة ومعايير السوق" : "Based on input data and market criteria"}</p>
        </div>
    </div>`
  }

  private generateProductsSnapshot(): string {
    const isRTL = this.language === "ar"

    return `
    <div class="page letterhead-page">
        <div class="watermark">${isRTL ? "كيان فينانس" : "KAYAN FINANCE"}</div>
        
        <h2 class="text-container">${isRTL ? "ملخص المنتجات" : "Products Snapshot"}</h2>
        
        <table class="summary-table">
            <thead>
                <tr>
                    <th class="text-container">${isRTL ? "المنتج" : "Product"}</th>
                    <th class="text-container">${isRTL ? "السعر المقترح" : "Suggested Price"}</th>
                    <th class="text-container">${isRTL ? "الوحدات" : "Units"}</th>
                    <th class="text-container">${isRTL ? "المبيعات" : "Sales"}</th>
                    <th class="text-container">${isRTL ? "التكاليف" : "Costs"}</th>
                    <th class="text-container">${isRTL ? "الربح" : "Profit"}</th>
                    <th class="text-container">${isRTL ? "الهامش %" : "Margin %"}</th>
                </tr>
            </thead>
            <tbody>
                ${this.results
                  .map(
                    (result) => `
                    <tr>
                        <td class="text-container">${result.productName}</td>
                        <td class="text-container">${this.formatCurrency(result.finalPrice)}</td>
                        <td class="text-container">${this.formatNumber(result.projectedUnits)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalRevenue)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalCosts)}</td>
                        <td class="text-container">${this.formatCurrency(result.grossProfit)}</td>
                        <td class="text-container">${result.profitMargin.toFixed(1)}%</td>
                    </tr>
                `,
                  )
                  .join("")}
                <tr style="background: #1e3a8a; color: white; font-weight: 600;">
                    <td class="text-container">${isRTL ? "الإجمالي" : "Total"}</td>
                    <td class="text-container">-</td>
                    <td class="text-container">${this.formatNumber(this.portfolioSummary.totalUnits)}</td>
                    <td class="text-container">${this.formatCurrency(this.portfolioSummary.totalRevenue)}</td>
                    <td class="text-container">${this.formatCurrency(this.portfolioSummary.totalCosts)}</td>
                    <td class="text-container">${this.formatCurrency(this.portfolioSummary.totalProfit)}</td>
                    <td class="text-container">${this.portfolioSummary.overallMargin.toFixed(1)}%</td>
                </tr>
            </tbody>
        </table>
    </div>`
  }

  private generateProductPages(): string {
    const isRTL = this.language === "ar"

    return this.results
      .map(
        (result) => `
    <div class="page letterhead-page">
        <div class="watermark">${isRTL ? "كيان فينانس" : "KAYAN FINANCE"}</div>
        
        <div class="product-section">
            <div class="product-header">
                <div class="product-title text-container">${result.productName}</div>
                <div class="suggested-price text-container">${isRTL ? "السعر المقترح:" : "Suggested Price:"} ${this.formatCurrency(result.finalPrice)}</div>
            </div>
            
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-label text-container">${isRTL ? "التكلفة المتغيرة/وحدة" : "Variable Cost/Unit"}</div>
                    <div class="metric-value text-container">${this.formatCurrency(result.variableCostPerUnit)}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label text-container">${isRTL ? "نصيب التكاليف الثابتة" : "Fixed Cost Share"}</div>
                    <div class="metric-value text-container">${this.formatCurrency(result.productFixedCosts / result.projectedUnits)}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label text-container">${isRTL ? "هامش المساهمة/وحدة" : "Contribution Margin/Unit"}</div>
                    <div class="metric-value text-container">${this.formatCurrency(result.contributionMargin)}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label text-container">${isRTL ? "هامش الربح على التكلفة" : "Profit Margin on Cost"}</div>
                    <div class="metric-value text-container">${result.profitMargin.toFixed(1)}%</div>
                </div>
            </div>
            
            <table class="scenarios-table">
                <thead>
                    <tr>
                        <th class="text-container">${isRTL ? "السيناريو" : "Scenario"}</th>
                        <th class="text-container">${isRTL ? "الوحدات" : "Units"}</th>
                        <th class="text-container">${isRTL ? "المبيعات" : "Sales"}</th>
                        <th class="text-container">${isRTL ? "التكاليف" : "Costs"}</th>
                        <th class="text-container">${isRTL ? "الربح" : "Profit"}</th>
                        <th class="text-container">${isRTL ? "الهامش %" : "Margin %"}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #dcfce7;">
                        <td class="text-container">${isRTL ? "أفضل حالة" : "Best Case"}</td>
                        <td class="text-container">${this.formatNumber(Math.round(result.projectedUnits * 1.2))}</td>
                        <td class="text-container">${this.formatCurrency(result.totalRevenue * 1.2)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalCosts * 1.2)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalRevenue * 1.2 - result.totalCosts * 1.2)}</td>
                        <td class="text-container">${(((result.totalRevenue * 1.2 - result.totalCosts * 1.2) / (result.totalCosts * 1.2)) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr style="background: #dbeafe;">
                        <td class="text-container">${isRTL ? "الحالة الأساسية" : "Base Case"}</td>
                        <td class="text-container">${this.formatNumber(result.projectedUnits)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalRevenue)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalCosts)}</td>
                        <td class="text-container">${this.formatCurrency(result.grossProfit)}</td>
                        <td class="text-container">${result.profitMargin.toFixed(1)}%</td>
                    </tr>
                    <tr style="background: #fee2e2;">
                        <td class="text-container">${isRTL ? "أسوأ حالة" : "Worst Case"}</td>
                        <td class="text-container">${this.formatNumber(Math.round(result.projectedUnits * 0.7))}</td>
                        <td class="text-container">${this.formatCurrency(result.totalRevenue * 0.7)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalCosts * 0.7)}</td>
                        <td class="text-container">${this.formatCurrency(result.totalRevenue * 0.7 - result.totalCosts * 0.7)}</td>
                        <td class="text-container">${(((result.totalRevenue * 0.7 - result.totalCosts * 0.7) / (result.totalCosts * 0.7)) * 100).toFixed(1)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,
      )
      .join("")
  }

  private generateCompanySummary(): string {
    const isRTL = this.language === "ar"

    return `
    <div class="page letterhead-page">
        <div class="watermark">${isRTL ? "كيان فينانس" : "KAYAN FINANCE"}</div>
        
        <h2 class="text-container">${isRTL ? "ملخص الشركة والتوصيات" : "Company Summary & Recommendations"}</h2>
        
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-value text-container">${this.formatCurrency(this.portfolioSummary.totalRevenue)}</div>
                <div class="kpi-label text-container">${isRTL ? "إجمالي المبيعات المتوقعة" : "Total Expected Sales"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value text-container">${this.formatCurrency(this.portfolioSummary.totalProfit)}</div>
                <div class="kpi-label text-container">${isRTL ? "صافي الربح" : "Net Profit"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value text-container">${this.portfolioSummary.overallMargin.toFixed(1)}%</div>
                <div class="kpi-label text-container">${isRTL ? "هامش الربح على التكلفة" : "Profit Margin on Cost"}</div>
            </div>
        </div>
        
        <div class="recommendations">
            <h3 class="text-container">${isRTL ? "التوصيات الرئيسية" : "Key Recommendations"}</h3>
            <div class="recommendation-item text-container">
                <strong>1.</strong> ${isRTL ? "مراقبة الأداء الفعلي مقابل التوقعات المالية بشكل شهري" : "Monitor actual performance against financial projections monthly"}
            </div>
            <div class="recommendation-item text-container">
                <strong>2.</strong> ${isRTL ? "مراجعة أسعار المنافسين كل 3 أشهر لضمان القدرة التنافسية" : "Review competitor prices every 3 months to ensure competitiveness"}
            </div>
            <div class="recommendation-item text-container">
                <strong>3.</strong> ${isRTL ? "تحسين هوامش الربح من خلال تحسين كفاءة العمليات وخفض التكاليف" : "Improve profit margins through operational efficiency and cost reduction"}
            </div>
            <div class="recommendation-item text-container">
                <strong>4.</strong> ${isRTL ? "تطوير استراتيجيات تسويقية لزيادة الطلب على المنتجات عالية الهامش" : "Develop marketing strategies to increase demand for high-margin products"}
            </div>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: rgba(255, 255, 255, 0.95); border-radius: 8px; border: 1px solid #e5e7eb;">
            <h3 class="text-container">${isRTL ? "معلومات الاتصال" : "Contact Information"}</h3>
            <p class="text-container" style="margin-top: 10px;">
                <strong>${isRTL ? "الموقع الإلكتروني:" : "Website:"}</strong> www.kayanfinance.com<br>
                <strong>${isRTL ? "البريد الإلكتروني:" : "Email:"}</strong> info@kayanfinance.com<br>
                <strong>${isRTL ? "للاستفسارات:" : "For inquiries:"}</strong> ${isRTL ? "تواصل معنا لمزيد من الاستشارات المالية المتخصصة" : "Contact us for more specialized financial consultations"}
            </p>
        </div>
    </div>`
  }

  private formatCurrency(amount: number): string {
    const currency = this.data.currency || "EGP"
    return new Intl.NumberFormat(this.language === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  private formatNumber(num: number): string {
    return new Intl.NumberFormat(this.language === "ar" ? "ar-EG" : "en-US", {
      maximumFractionDigits: 0,
    }).format(num)
  }
}
