export const generateFreelancerPDFComprehensive = async (data: any, results: any, language = "ar") => {
  const isArabic = language === "ar"
  const currency = data.currency || "EGP"

  // Create new window for PDF
  const printWindow = window.open("", "_blank", "width=800,height=600")
  if (!printWindow) {
    throw new Error("Unable to open print window")
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="${isArabic ? "ar" : "en"}" dir="${isArabic ? "rtl" : "ltr"}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isArabic ? "تقرير تسعير المستقل" : "Freelancer Pricing Report"}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${isArabic ? "'Cairo', sans-serif" : "'Inter', sans-serif"};
            line-height: 1.6;
            color: #1e3a8a;
            background: white;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: url('https://kayanfinance.com/Kayanpaper.png') no-repeat center center;
            background-size: cover;
            position: relative;
            page-break-after: always;
            padding: 20mm;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 20px;
        }
        
        .title {
            font-size: 28px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 16px;
            color: #3b82f6;
            margin-bottom: 20px;
        }
        
        .info-card {
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #3b82f6;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .factors-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .factors-table th,
        .factors-table td {
            padding: 12px;
            text-align: ${isArabic ? "right" : "left"};
            border-bottom: 1px solid #e5e7eb;
        }
        
        .factors-table th {
            background: #3b82f6;
            color: white;
            font-weight: 600;
        }
        
        .factors-table tr:nth-child(even) {
            background: #f8fafc;
        }
        
        .price-highlight {
            background: linear-gradient(135deg, #3b82f6, #1e3a8a);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
        }
        
        .price-value {
            font-size: 32px;
            font-weight: 700;
            margin: 10px 0;
        }
        
        .packages-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .package-card {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        
        .package-card.featured {
            border-color: #3b82f6;
            background: #eff6ff;
        }
        
        .package-price {
            font-size: 24px;
            font-weight: 700;
            color: #1e3a8a;
            margin: 10px 0;
        }
        
        .footer {
            position: fixed;
            bottom: 10mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #3b82f6;
            padding-top: 10px;
        }
        
        .formula-box {
            background: #eff6ff;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        
        .formula {
            font-size: 18px;
            font-weight: 600;
            color: #1e3a8a;
            font-family: 'Courier New', monospace;
        }
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .kpi-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        
        .kpi-value {
            font-size: 20px;
            font-weight: 700;
            color: #1e3a8a;
        }
        
        .kpi-label {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
        }
        
        .recommendations {
            background: #f0f9ff;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .recommendations ul {
            list-style: none;
            padding: 0;
        }
        
        .recommendations li {
            padding: 8px 0;
            border-bottom: 1px solid #e0e7ff;
        }
        
        .recommendations li:before {
            content: "✓ ";
            color: #3b82f6;
            font-weight: bold;
        }
        
        .cta-box {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .page { margin: 0; }
        }
    </style>
</head>
<body>
    <!-- Page 1: Cover Page -->
    <div class="page">
        <div class="header">
            <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" class="logo" onerror="this.style.display='none'">
            <h1 class="title">${isArabic ? "تقرير تسعير المستقل" : "Freelancer Pricing Report"}</h1>
            <p class="subtitle">${isArabic ? "تحليل شامل لاستراتيجية التسعير" : "Comprehensive Pricing Strategy Analysis"}</p>
        </div>
        
        <div class="info-card">
            <h3>${isArabic ? "معلومات التقرير" : "Report Information"}</h3>
            <p><strong>${isArabic ? "التاريخ:" : "Date:"}</strong> ${new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-US")}</p>
            <p><strong>${isArabic ? "إعداد بواسطة:" : "Prepared by:"}</strong> Kayan Finance</p>
            <p><strong>${isArabic ? "نوع التقرير:" : "Report Type:"}</strong> ${isArabic ? "تسعير المستقل" : "Freelancer Pricing"}</p>
        </div>
        
        <div class="price-highlight">
            <h2>${isArabic ? "السعر المقترح" : "Recommended Rate"}</h2>
            <div class="price-value">${results.hourlySuggested} ${currency}/${isArabic ? "ساعة" : "hour"}</div>
            <p>${isArabic ? "بناءً على تحليل شامل لجميع العوامل المؤثرة" : "Based on comprehensive analysis of all influencing factors"}</p>
        </div>
        
        <div class="cta-box">
            <p>${isArabic ? "أداة تسعير متقدمة من كايان فينانس" : "Advanced pricing tool by Kayan Finance"}</p>
            <p><strong>kayanfinance.com</strong></p>
        </div>
    </div>
    
    <!-- Page 2: Factors & Calculations -->
    <div class="page">
        <div class="header">
            <h2 class="title">${isArabic ? "العوامل والحسابات" : "Factors & Calculations"}</h2>
        </div>
        
        <div class="info-card">
            <h3>${isArabic ? "العوامل الشخصية" : "Personal Factors"}</h3>
            <table class="factors-table">
                <thead>
                    <tr>
                        <th>${isArabic ? "العامل" : "Factor"}</th>
                        <th>${isArabic ? "القيمة" : "Value"}</th>
                        <th>${isArabic ? "المعامل" : "Multiplier"}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${isArabic ? "مستوى الخبرة" : "Experience Level"}</td>
                        <td>${data.fl_experienceLevel}</td>
                        <td>${results.multiplierBreakdown.experience.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "التخصص" : "Specialization"}</td>
                        <td>${data.fl_specialization}</td>
                        <td>${results.multiplierBreakdown.specialization.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "الموقع الجغرافي" : "Location"}</td>
                        <td>${data.fl_location}</td>
                        <td>${results.multiplierBreakdown.location.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "السمعة" : "Reputation"}</td>
                        <td>${data.fl_reputation}</td>
                        <td>${results.multiplierBreakdown.reputation.toFixed(2)}x</td>
                    </tr>
                    <tr style="background: #eff6ff; font-weight: bold;">
                        <td>${isArabic ? "المجموع" : "Total"}</td>
                        <td>-</td>
                        <td>${results.personalFactors.toFixed(2)}x</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="info-card">
            <h3>${isArabic ? "العوامل الخارجية" : "External Factors"}</h3>
            <table class="factors-table">
                <thead>
                    <tr>
                        <th>${isArabic ? "العامل" : "Factor"}</th>
                        <th>${isArabic ? "القيمة" : "Value"}</th>
                        <th>${isArabic ? "المعامل" : "Multiplier"}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${isArabic ? "السرعة" : "Speed"}</td>
                        <td>${data.fl_speedFactor}</td>
                        <td>${results.multiplierBreakdown.speed.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "الموسم" : "Season"}</td>
                        <td>${data.fl_seasonFactor}</td>
                        <td>${results.multiplierBreakdown.season.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "حجم العميل" : "Client Size"}</td>
                        <td>${data.fl_clientSize}</td>
                        <td>${results.multiplierBreakdown.clientSize.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "منطقة العميل" : "Client Region"}</td>
                        <td>${data.fl_clientRegion}</td>
                        <td>${results.multiplierBreakdown.clientRegion.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "المخاطرة" : "Risk"}</td>
                        <td>${data.fl_riskFactor}</td>
                        <td>${results.multiplierBreakdown.risk.toFixed(2)}x</td>
                    </tr>
                    <tr>
                        <td>${isArabic ? "شروط الدفع" : "Payment Terms"}</td>
                        <td>${data.fl_paymentTerms}</td>
                        <td>${results.multiplierBreakdown.payment.toFixed(2)}x</td>
                    </tr>
                    <tr style="background: #eff6ff; font-weight: bold;">
                        <td>${isArabic ? "المجموع" : "Total"}</td>
                        <td>-</td>
                        <td>${results.externalFactors.toFixed(2)}x</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="formula-box">
            <h3>${isArabic ? "المعادلة النهائية" : "Final Formula"}</h3>
            <div class="formula">
                ${results.hourlyBase} × ${results.personalFactors.toFixed(2)} × ${results.externalFactors.toFixed(2)} = ${results.hourlyFloor}
            </div>
            <p style="margin-top: 10px; font-size: 14px;">
                ${isArabic ? "السعر الأساسي × العوامل الشخصية × العوامل الخارجية = السعر النهائي" : "Base Rate × Personal Factors × External Factors = Final Rate"}
            </p>
        </div>
    </div>
    
    <!-- Page 3: Price Analysis -->
    <div class="page">
        <div class="header">
            <h2 class="title">${isArabic ? "تحليل الأسعار" : "Price Analysis"}</h2>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-value">${results.hourlyBase} ${currency}</div>
                <div class="kpi-label">${isArabic ? "السعر الأساسي/ساعة" : "Base Rate/Hour"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${results.hourlyFloor} ${currency}</div>
                <div class="kpi-label">${isArabic ? "السعر النهائي/ساعة" : "Final Rate/Hour"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${Math.round((results.hourlyFloor / results.hourlyBase - 1) * 100)}%</div>
                <div class="kpi-label">${isArabic ? "نسبة التغيير" : "Change Percentage"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${results.projectSuggested || "N/A"} ${currency}</div>
                <div class="kpi-label">${isArabic ? "سعر المشروع" : "Project Price"}</div>
            </div>
        </div>
        
        <div class="price-highlight">
            <h3>${isArabic ? "السعر المقترح بالساعة" : "Recommended Hourly Rate"}</h3>
            <div class="price-value">${results.hourlySuggested} ${currency}</div>
            <p>${isArabic ? "هذا السعر يضمن ربحية مستدامة مع مراعاة جميع العوامل" : "This rate ensures sustainable profitability considering all factors"}</p>
        </div>
        
        ${
          results.packages
            ? `
        <div class="info-card">
            <h3>${isArabic ? "الباقات المقترحة" : "Suggested Packages"}</h3>
            <div class="packages-grid">
                <div class="package-card">
                    <h4>${isArabic ? "أساسي" : "Basic"}</h4>
                    <div class="package-price">${results.packages.basic} ${currency}</div>
                    <p>${isArabic ? "للميزانيات المحدودة" : "For limited budgets"}</p>
                </div>
                <div class="package-card featured">
                    <h4>${isArabic ? "متوسط" : "Standard"}</h4>
                    <div class="package-price">${results.packages.standard} ${currency}</div>
                    <p>${isArabic ? "الأكثر شيوعاً" : "Most Popular"}</p>
                </div>
                <div class="package-card">
                    <h4>${isArabic ? "مميز" : "Premium"}</h4>
                    <div class="package-price">${results.packages.premium} ${currency}</div>
                    <p>${isArabic ? "للعملاء المميزين" : "For premium clients"}</p>
                </div>
            </div>
        </div>
        `
            : ""
        }
    </div>
    
    <!-- Page 4: Final Results -->
    <div class="page">
        <div class="header">
            <h2 class="title">${isArabic ? "النتائج النهائية" : "Final Results"}</h2>
        </div>
        
        <div class="price-highlight">
            <h3>${isArabic ? "ملخص التسعير" : "Pricing Summary"}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                <div>
                    <p><strong>${isArabic ? "السعر بالساعة:" : "Hourly Rate:"}</strong></p>
                    <div class="price-value" style="font-size: 24px;">${results.hourlySuggested} ${currency}</div>
                </div>
                ${
                  results.projectSuggested
                    ? `
                <div>
                    <p><strong>${isArabic ? "سعر المشروع:" : "Project Price:"}</strong></p>
                    <div class="price-value" style="font-size: 24px;">${results.projectSuggested} ${currency}</div>
                </div>
                `
                    : ""
                }
            </div>
        </div>
        
        <div class="recommendations">
            <h3>${isArabic ? "توصيات تنفيذية" : "Executive Recommendations"}</h3>
            <ul>
                <li>${isArabic ? "ابدأ بالسعر المقترح ولا تنزل عن الحد الأدنى أبداً" : "Start with the suggested rate and never go below the minimum"}</li>
                <li>${isArabic ? "راجع أسعارك كل 6 أشهر بناءً على تطور خبرتك وسمعتك" : "Review your rates every 6 months based on experience and reputation growth"}</li>
                <li>${isArabic ? "استخدم الباقات المتدرجة لتناسب مختلف أنواع العملاء" : "Use tiered packages to suit different client types"}</li>
            </ul>
        </div>
        
        <div class="cta-box">
            <h3>${isArabic ? "تواصل معنا" : "Contact Us"}</h3>
            <p>${isArabic ? "للمزيد من الاستشارات المالية والتسعيرية" : "For more financial and pricing consultations"}</p>
            <p><strong>kayanfinance.com/contact</strong></p>
        </div>
    </div>
    
    <!-- Page 5: Summary -->
    <div class="page">
        <div class="header">
            <h2 class="title">${isArabic ? "ملخص المستقل" : "Freelancer Summary"}</h2>
        </div>
        
        <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div class="kpi-card">
                <div class="kpi-value">${results.hourlyBase}</div>
                <div class="kpi-label">${isArabic ? "السعر الأساسي/ساعة" : "Base Rate/Hour"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${results.hourlyFloor}</div>
                <div class="kpi-label">${isArabic ? "السعر النهائي/ساعة" : "Final Rate/Hour"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${Math.round((results.hourlyFloor / results.hourlyBase - 1) * 100)}%</div>
                <div class="kpi-label">${isArabic ? "نسبة التغيير" : "Change %"}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${results.totalMultiplier.toFixed(2)}x</div>
                <div class="kpi-label">${isArabic ? "إجمالي المعامل" : "Total Multiplier"}</div>
            </div>
        </div>
        
        <div class="recommendations">
            <h3>${isArabic ? "توصيات نهائية" : "Final Recommendations"}</h3>
            <ul>
                <li>${isArabic ? "استخدم هذا التسعير كنقطة انطلاق وعدّله حسب ظروف كل مشروع" : "Use this pricing as a starting point and adjust based on each project circumstances"}</li>
                <li>${isArabic ? "احتفظ بسجل لجميع مشاريعك وأسعارها لتحليل الأداء" : "Keep a record of all your projects and their rates for performance analysis"}</li>
                <li>${isArabic ? "لا تتردد في زيادة أسعارك مع نمو خبرتك وتحسن سمعتك" : "Don't hesitate to increase your rates as your experience grows and reputation improves"}</li>
            </ul>
        </div>
        
        <div class="cta-box">
            <h3>${isArabic ? "شكراً لاستخدام كايان فينانس" : "Thank you for using Kayan Finance"}</h3>
            <p>${isArabic ? "نساعدك في بناء مستقبل مالي أفضل" : "We help you build a better financial future"}</p>
            <p><strong>kayanfinance.com</strong></p>
        </div>
    </div>
    
    <div class="footer">
        <p>© ${isArabic ? "كايان فينانس 2025 – جميع الحقوق محفوظة" : "Kayan Finance 2025 – All Rights Reserved"}</p>
    </div>
</body>
</html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
    }, 1000)
  }
}
