import type { PricingData } from "./types"

interface FinancialResult {
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
  contributionRatio: number
  breakevenUnits: number
  breakevenRevenue: number
  breakevenAchievementRatio: number
  fullCostPerUnit: number
}

interface PortfolioSummary {
  totalRevenue: number
  totalCosts: number
  totalProfit: number
  overallMargin: number
  productCount: number
  reportPeriod: number
  avgUnitsPerProduct: number
  totalUnits: number
}

export async function generateComprehensivePDF(
  data: PricingData,
  results: FinancialResult[],
  portfolioSummary: PortfolioSummary,
  language: "ar" | "en",
) {
  const formatCurrency = (amount: number) => {
    const currency = data.currency || "EGP"
    const locale = language === "ar" ? "ar-EG" : "en-US"
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    const locale = language === "ar" ? "ar-EG" : "en-US"
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(num)
  }

  const currentDate = new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")

  // Create new window for PDF
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert(language === "ar" ? "يرجى السماح بالنوافذ المنبثقة" : "Please allow pop-ups")
    return
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="${language === "ar" ? "ar" : "en"}" dir="${language === "ar" ? "rtl" : "ltr"}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${language === "ar" ? "تقرير التسعير الاستراتيجي" : "Strategic Pricing Report"}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm 20mm 20mm 20mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            background-image: url('https://kayanfinance.com/Kayanpaper.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            page-break-after: always;
            position: relative;
            padding: 15mm 20mm 20mm 20mm;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 100%;
        }
        
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 30px;
        }
        
        .cover-title {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        
        .cover-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 40px;
        }
        
        .cover-info {
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
        }
        
        .cover-info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .content-page {
            padding-top: 20px;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #1e40af;
        }
        
        .page-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }
        
        .page-subtitle {
            font-size: 12px;
            color: #6b7280;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            text-align: center;
        }
        
        .summary-card-title {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 5px;
        }
        
        .summary-card-value {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
        }
        
        .product-section {
            background: rgba(255, 255, 255, 0.95);
            margin-bottom: 25px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
        }
        
        .product-header {
            background: #1e40af;
            color: white;
            padding: 15px;
            text-align: center;
        }
        
        .product-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .product-price {
            font-size: 24px;
            font-weight: bold;
        }
        
        .product-content {
            padding: 20px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .metric-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .metric-label {
            color: #6b7280;
            font-size: 11px;
        }
        
        .metric-value {
            font-weight: bold;
            color: #1f2937;
        }
        
        .scenarios-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 10px;
        }
        
        .scenarios-table th,
        .scenarios-table td {
            padding: 8px 6px;
            text-align: ${language === "ar" ? "right" : "left"};
            border: 1px solid #e5e7eb;
        }
        
        .scenarios-table th {
            background: #f9fafb;
            font-weight: bold;
            color: #374151;
        }
        
        .scenario-best {
            background: #f0fdf4;
            color: #166534;
        }
        
        .scenario-base {
            background: #eff6ff;
            color: #1d4ed8;
        }
        
        .scenario-worst {
            background: #fef2f2;
            color: #dc2626;
        }
        
        .company-summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
        }
        
        .company-summary-table th,
        .company-summary-table td {
            padding: 10px 8px;
            text-align: ${language === "ar" ? "right" : "left"};
            border: 1px solid #e5e7eb;
        }
        
        .company-summary-table th {
            background: #1e40af;
            color: white;
            font-weight: bold;
        }
        
        .methodology-section {
            background: rgba(248, 250, 252, 0.95);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            margin-top: 20px;
        }
        
        .methodology-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 15px;
        }
        
        .methodology-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        
        .methodology-item h4 {
            font-size: 12px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .methodology-item p,
        .methodology-item ul {
            font-size: 10px;
            color: #6b7280;
            line-height: 1.4;
        }
        
        .methodology-item ul {
            padding-${language === "ar" ? "right" : "left"}: 15px;
        }
        
        .methodology-item li {
            margin-bottom: 3px;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .page {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page cover-page">
        <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" class="logo">
        <h1 class="cover-title">
            ${language === "ar" ? "تحول أرقامك إلى قرارات وقراراتك إلى نمو" : "Turn Your Numbers Into Decisions And Your Decisions Into Growth"}
        </h1>
        <p class="cover-subtitle">
            ${language === "ar" ? "تقرير التسعير الاستراتيجي" : "Strategic Pricing Report"}
        </p>
        <div class="cover-info">
            <div class="cover-info-item">
                <span>${language === "ar" ? "📊 تقرير التسعير مقدم إلى: شركة العميل" : "📊 Pricing Report Submitted to: Client Company"}</span>
            </div>
            <div class="cover-info-item">
                <span>${language === "ar" ? "📅 التاريخ:" : "📅 Date:"}</span>
                <span>${currentDate}</span>
            </div>
            <div class="cover-info-item">
                <span>${language === "ar" ? "✏️ إعداد بواسطة:" : "✏️ Prepared by:"}</span>
                <span>Kayan Finance</span>
            </div>
        </div>
    </div>

    <!-- Executive Summary Page -->
    <div class="page content-page">
        <div class="page-header">
            <h2 class="page-title">${language === "ar" ? "الملخص التنفيذي" : "Executive Summary"}</h2>
            <p class="page-subtitle">${language === "ar" ? "نظرة شاملة على النتائج المالية" : "Comprehensive Overview of Financial Results"}</p>
        </div>
        
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-card-title">${language === "ar" ? "إجمالي المبيعات المتوقعة" : "Total Expected Revenue"}</div>
                <div class="summary-card-value">${formatCurrency(portfolioSummary.totalRevenue)}</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">${language === "ar" ? "إجمالي التكاليف" : "Total Costs"}</div>
                <div class="summary-card-value">${formatCurrency(portfolioSummary.totalCosts)}</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">${language === "ar" ? "صافي الربح" : "Net Profit"}</div>
                <div class="summary-card-value">${formatCurrency(portfolioSummary.totalProfit)}</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">${language === "ar" ? "عدد المنتجات" : "Product Count"}</div>
                <div class="summary-card-value">${portfolioSummary.productCount}</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">${language === "ar" ? "إجمالي الوحدات" : "Total Units"}</div>
                <div class="summary-card-value">${formatNumber(portfolioSummary.totalUnits)}</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">${language === "ar" ? "هامش الربح على التكلفة" : "Profit Margin on Cost"}</div>
                <div class="summary-card-value">${portfolioSummary.overallMargin.toFixed(1)}%</div>
            </div>
        </div>

        <!-- Products Overview Table -->
        <div class="product-section">
            <div class="product-header">
                <h3>${language === "ar" ? "ملخص المنتجات" : "Products Summary"}</h3>
            </div>
            <div class="product-content">
                <table class="company-summary-table">
                    <thead>
                        <tr>
                            <th>${language === "ar" ? "المنتج" : "Product"}</th>
                            <th>${language === "ar" ? "الوحدات المتوقعة" : "Expected Units"}</th>
                            <th>${language === "ar" ? "السعر النهائي" : "Final Price"}</th>
                            <th>${language === "ar" ? "إجمالي المبيعات" : "Total Sales"}</th>
                            <th>${language === "ar" ? "هامش الربح %" : "Profit Margin %"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results
                          .map(
                            (result) => `
                            <tr>
                                <td>${result.productName}</td>
                                <td>${formatNumber(result.projectedUnits)}</td>
                                <td>${formatCurrency(result.finalPrice)}</td>
                                <td>${formatCurrency(result.totalRevenue)}</td>
                                <td>${result.profitMargin.toFixed(1)}%</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Allocation Method -->
        <div class="methodology-section">
            <h3 class="methodology-title">${language === "ar" ? "طريقة توزيع التكاليف الثابتة" : "Fixed Cost Allocation Method"}</h3>
            <p>${language === "ar" ? "تم توزيع التكاليف الثابتة" : "Fixed costs were allocated"} ${
              data.costAllocation?.method === "equal"
                ? language === "ar"
                  ? "بالتساوي بين جميع المنتجات"
                  : "equally among all products"
                : data.costAllocation?.method === "volume"
                  ? (language === "ar" ? "حسب حجم المبيعات المتوقع" : "based on expected sales volume")
                  : data.costAllocation?.method === "revenue"
                    ? language === "ar"
                      ? "حسب الإيرادات المتوقعة"
                      : "based on expected revenue"
                    : language === "ar"
                      ? "يدوياً"
                      : "manually"
            }</p>
        </div>
    </div>

    ${results
      .map(
        (result) => `
    <!-- Product Detail Page: ${result.productName} -->
    <div class="page content-page">
        <div class="page-header">
            <h2 class="page-title">${language === "ar" ? "تفاصيل المنتج -" : "Product Details -"} ${result.productName}</h2>
            <p class="page-subtitle">${language === "ar" ? "تحليل مالي شامل" : "Comprehensive Financial Analysis"}</p>
        </div>
        
        <div class="product-section">
            <div class="product-header">
                <div class="product-name">${result.productName}</div>
                <div class="product-price">${formatCurrency(result.finalPrice)}</div>
            </div>
            <div class="product-content">
                <div class="metrics-grid">
                    <div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "الوحدات المتوقعة" : "Expected Units"}</span>
                            <span class="metric-value">${formatNumber(result.projectedUnits)}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "إجمالي المبيعات" : "Total Revenue"}</span>
                            <span class="metric-value">${formatCurrency(result.totalRevenue)}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "التكلفة المتغيرة/وحدة" : "Variable Cost/Unit"}</span>
                            <span class="metric-value">${formatCurrency(result.variableCostPerUnit)}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "نصيب التكاليف الثابتة" : "Fixed Cost Share"}</span>
                            <span class="metric-value">${formatCurrency(result.productFixedCosts)}</span>
                        </div>
                    </div>
                    <div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "إجمالي التكاليف" : "Total Costs"}</span>
                            <span class="metric-value">${formatCurrency(result.totalCosts)}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "صافي الربح" : "Net Profit"}</span>
                            <span class="metric-value">${formatCurrency(result.grossProfit)}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "هامش المساهمة/وحدة" : "Contribution Margin/Unit"}</span>
                            <span class="metric-value">${formatCurrency(result.contributionMargin)}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">${language === "ar" ? "هامش الربح على التكلفة" : "Profit Margin on Cost"}</span>
                            <span class="metric-value">${result.profitMargin.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                
                <h4 style="margin: 20px 0 10px 0; font-weight: bold; color: #1e40af;">${language === "ar" ? "السيناريوهات" : "Scenarios"}</h4>
                <table class="scenarios-table">
                    <thead>
                        <tr>
                            <th>${language === "ar" ? "السيناريو" : "Scenario"}</th>
                            <th>${language === "ar" ? "الوحدات" : "Units"}</th>
                            <th>${language === "ar" ? "المبيعات" : "Sales"}</th>
                            <th>${language === "ar" ? "التكاليف" : "Costs"}</th>
                            <th>${language === "ar" ? "صافي الربح" : "Net Profit"}</th>
                            <th>${language === "ar" ? "الهامش %" : "Margin %"}</th>
                            <th>${language === "ar" ? "نقطة التعادل" : "Breakeven"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="scenario-best">
                            <td>${language === "ar" ? "أفضل حالة" : "Best Case"}</td>
                            <td>${formatNumber(Math.round(result.projectedUnits * 1.2))}</td>
                            <td>${formatCurrency(result.totalRevenue * 1.2)}</td>
                            <td>${formatCurrency(result.totalCosts * 1.2)}</td>
                            <td>${formatCurrency(result.totalRevenue * 1.2 - result.totalCosts * 1.2)}</td>
                            <td>${(((result.totalRevenue * 1.2 - result.totalCosts * 1.2) / (result.totalCosts * 1.2)) * 100).toFixed(1)}%</td>
                            <td>${formatNumber(result.breakevenUnits)}</td>
                        </tr>
                        <tr class="scenario-base">
                            <td>${language === "ar" ? "الحالة الأساسية" : "Base Case"}</td>
                            <td>${formatNumber(result.projectedUnits)}</td>
                            <td>${formatCurrency(result.totalRevenue)}</td>
                            <td>${formatCurrency(result.totalCosts)}</td>
                            <td>${formatCurrency(result.grossProfit)}</td>
                            <td>${result.profitMargin.toFixed(1)}%</td>
                            <td>${formatNumber(result.breakevenUnits)}</td>
                        </tr>
                        <tr class="scenario-worst">
                            <td>${language === "ar" ? "أسوأ حالة" : "Worst Case"}</td>
                            <td>${formatNumber(Math.round(result.projectedUnits * 0.7))}</td>
                            <td>${formatCurrency(result.totalRevenue * 0.7)}</td>
                            <td>${formatCurrency(result.totalCosts * 0.7)}</td>
                            <td>${formatCurrency(result.totalRevenue * 0.7 - result.totalCosts * 0.7)}</td>
                            <td>${(((result.totalRevenue * 0.7 - result.totalCosts * 0.7) / (result.totalCosts * 0.7)) * 100).toFixed(1)}%</td>
                            <td>${formatNumber(result.breakevenUnits)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <h4 style="color: #1e40af; margin-bottom: 10px; font-size: 12px;">${language === "ar" ? "التوصية" : "Recommendation"}</h4>
                    <p style="font-size: 11px; color: #374151; line-height: 1.4;">
                        ${
                          language === "ar"
                            ? `منتج ${result.productName} يحقق هامش ربح ${result.profitMargin.toFixed(1)}% بسعر ${formatCurrency(result.finalPrice)}. يحتاج المنتج إلى بيع ${formatNumber(result.breakevenUnits)} وحدة لتحقيق التعادل.`
                            : `Product ${result.productName} achieves a ${result.profitMargin.toFixed(1)}% profit margin at ${formatCurrency(result.finalPrice)}. The product needs to sell ${formatNumber(result.breakevenUnits)} units to break even.`
                        }
                    </p>
                </div>
            </div>
        </div>
    </div>
    `,
      )
      .join("")}

    <!-- Company Summary Page -->
    <div class="page content-page">
        <div class="page-header">
            <h2 class="page-title">${language === "ar" ? "ملخص الشركة - السيناريوهات" : "Company Summary - Scenarios"}</h2>
            <p class="page-subtitle">${language === "ar" ? "تحليل شامل لجميع السيناريوهات" : "Comprehensive Analysis of All Scenarios"}</p>
        </div>
        
        <table class="company-summary-table">
            <thead>
                <tr>
                    <th>${language === "ar" ? "السيناريو" : "Scenario"}</th>
                    <th>${language === "ar" ? "إجمالي الوحدات" : "Total Units"}</th>
                    <th>${language === "ar" ? "المبيعات الكلية" : "Total Sales"}</th>
                    <th>${language === "ar" ? "التكاليف الكلية" : "Total Costs"}</th>
                    <th>${language === "ar" ? "صافي الربح" : "Net Profit"}</th>
                    <th>${language === "ar" ? "هامش الربح على التكلفة" : "Profit Margin on Cost"}</th>
                </tr>
            </thead>
            <tbody>
                <tr class="scenario-best">
                    <td>${language === "ar" ? "أفضل حالة" : "Best Case"}</td>
                    <td>${formatNumber(Math.round(portfolioSummary.totalUnits * 1.2))}</td>
                    <td>${formatCurrency(portfolioSummary.totalRevenue * 1.2)}</td>
                    <td>${formatCurrency(portfolioSummary.totalCosts * 1.2)}</td>
                    <td>${formatCurrency(portfolioSummary.totalRevenue * 1.2 - portfolioSummary.totalCosts * 1.2)}</td>
                    <td>${(((portfolioSummary.totalRevenue * 1.2 - portfolioSummary.totalCosts * 1.2) / (portfolioSummary.totalCosts * 1.2)) * 100).toFixed(1)}%</td>
                </tr>
                <tr class="scenario-base">
                    <td>${language === "ar" ? "الحالة الأساسية" : "Base Case"}</td>
                    <td>${formatNumber(portfolioSummary.totalUnits)}</td>
                    <td>${formatCurrency(portfolioSummary.totalRevenue)}</td>
                    <td>${formatCurrency(portfolioSummary.totalCosts)}</td>
                    <td>${formatCurrency(portfolioSummary.totalProfit)}</td>
                    <td>${portfolioSummary.overallMargin.toFixed(1)}%</td>
                </tr>
                <tr class="scenario-worst">
                    <td>${language === "ar" ? "أسوأ حالة" : "Worst Case"}</td>
                    <td>${formatNumber(Math.round(portfolioSummary.totalUnits * 0.7))}</td>
                    <td>${formatCurrency(portfolioSummary.totalRevenue * 0.7)}</td>
                    <td>${formatCurrency(portfolioSummary.totalCosts * 0.7)}</td>
                    <td>${formatCurrency(portfolioSummary.totalRevenue * 0.7 - portfolioSummary.totalCosts * 0.7)}</td>
                    <td>${(((portfolioSummary.totalRevenue * 0.7 - portfolioSummary.totalCosts * 0.7) / (portfolioSummary.totalCosts * 0.7)) * 100).toFixed(1)}%</td>
                </tr>
            </tbody>
        </table>

        <div class="methodology-section">
            <h3 class="methodology-title">${language === "ar" ? "المنهجية والافتراضات" : "Methodology and Assumptions"}</h3>
            <div class="methodology-grid">
                <div class="methodology-item">
                    <h4>${language === "ar" ? "معادلات الحساب الأساسية" : "Basic Calculation Formulas"}</h4>
                    <ul>
                        <li>${language === "ar" ? "الإيرادات = السعر × عدد الوحدات" : "Revenue = Price × Units"}</li>
                        <li>${language === "ar" ? "التكاليف الكلية = التكاليف المتغيرة + التكاليف الثابتة" : "Total Costs = Variable Costs + Fixed Costs"}</li>
                        <li>${language === "ar" ? "صافي الربح = الإيرادات - التكاليف الكلية" : "Net Profit = Revenue - Total Costs"}</li>
                        <li>${language === "ar" ? "هامش الربح على التكلفة % = (صافي الربح ÷ التكاليف الكلية) × 100" : "Profit Margin on Cost % = (Net Profit ÷ Total Costs) × 100"}</li>
                        <li>${language === "ar" ? "نقطة التعادل = التكاليف الثابتة ÷ هامش المساهمة للوحدة" : "Breakeven = Fixed Costs ÷ Unit Contribution Margin"}</li>
                    </ul>
                </div>
                <div class="methodology-item">
                    <h4>${language === "ar" ? "طريقة توزيع التكاليف الثابتة" : "Fixed Cost Allocation Method"}</h4>
                    <p>
                        ${data.costAllocation?.method === "equal" && (language === "ar" ? "تم توزيع التكاليف الثابتة بالتساوي بين جميع المنتجات" : "Fixed costs were allocated equally among all products")}
                        ${data.costAllocation?.method === "volume" && (language === "ar" ? "تم توزيع التكاليف الثابتة حسب حجم المبيعات المتوقع لكل منتج" : "Fixed costs were allocated based on expected sales volume for each product")}
                        ${data.costAllocation?.method === "revenue" && (language === "ar" ? "تم توزيع التكاليف الثابتة حسب الإيرادات المتوقعة لكل منتج" : "Fixed costs were allocated based on expected revenue for each product")}
                        ${data.costAllocation?.method === "manual" && (language === "ar" ? "تم توزيع التكاليف الثابتة يدوياً حسب المعايير المحددة" : "Fixed costs were allocated manually based on specified criteria")}
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for images to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
    }, 1000)
  }
}

// Legacy function for backward compatibility
export const generateAndDownloadBrowserPDF = generateComprehensivePDF
