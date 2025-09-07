export const generateFreelancerPDFComprehensive = async (data: any, results: any, language = "ar") => {
  const isArabic = language === "ar"
  const direction = isArabic ? "rtl" : "ltr"
  const fontFamily = isArabic ? "Cairo" : "Inter"

  // Colors from Kayan branding
  const colors = {
    darkBlue: "#1e3a8a",
    lightBlue: "#3b82f6",
    lightGray: "#f8fafc",
    borderGray: "#e2e8f0",
  }

  const formatCurrency = (amount: number) => {
    return isArabic ? `${amount.toLocaleString()} جنيه` : `${amount.toLocaleString()} EGP`
  }

  const getFactorLabel = (factor: string, value: string) => {
    if (!isArabic) return value

    const arabicLabels: Record<string, Record<string, string>> = {
      experience: { beginner: "مبتدئ", intermediate: "متوسط", expert: "خبير" },
      specialization: { general: "عام", technical: "شهادات تخصصية", specialized: "شهادات عليا" },
      location: { egypt: "مصر", gulf: "الخليج", europe: "أوروبا", usa: "أمريكا" },
      reputation: { new: "جديد", good: "جيد", excellent: "ممتاز" },
      speed: { normal: "عادي", urgent: "مستعجل", rush: "طارئ" },
      season: { normal: "عادي", busy: "مزدحم", peak: "ذروة" },
      clientSize: { small: "صغير", medium: "متوسط", enterprise: "كبير" },
      clientRegion: { local: "محلي", gulf: "خليجي", europe: "أوروبي", usa: "أمريكي" },
      risk: { low: "منخفضة", medium: "متوسطة", high: "عالية" },
      payment: { advance: "مقدم", milestone: "مراحل", completion: "بعد التسليم" },
    }

    return arabicLabels[factor]?.[value] || value
  }

  const html = `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${isArabic ? "ar" : "en"}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isArabic ? "تقرير تسعير Freelancer" : "Freelancer Pricing Report"}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @page {
          size: A4;
          margin: 0;
        }
        
        body {
          font-family: '${fontFamily}', sans-serif;
          direction: ${direction};
          background: white;
          color: #1f2937;
          line-height: 1.6;
        }
        
        .page {
          width: 210mm;
          height: 297mm;
          position: relative;
          page-break-after: always;
          background-image: url('https://kayanfinance.com/Kayanpaper.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 20mm;
          display: flex;
          flex-direction: column;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .logo {
          width: 120px;
          height: auto;
        }
        
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: ${colors.darkBlue};
          text-align: center;
          margin: 40px 0;
        }
        
        .content {
          flex: 1;
        }
        
        .info-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 25px;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid ${colors.borderGray};
        }
        
        .tagline {
          font-size: 18px;
          color: ${colors.lightBlue};
          text-align: center;
          font-weight: 600;
          margin: 30px 0;
          padding: 20px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
        }
        
        .factors-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .factors-table th {
          background: ${colors.darkBlue};
          color: white;
          padding: 15px;
          text-align: ${isArabic ? "right" : "left"};
          font-weight: 600;
        }
        
        .factors-table td {
          padding: 12px 15px;
          border-bottom: 1px solid ${colors.borderGray};
          text-align: ${isArabic ? "right" : "left"};
        }
        
        .factors-table tr:nth-child(even) {
          background: ${colors.lightGray};
        }
        
        .price-box {
          background: linear-gradient(135deg, ${colors.lightBlue}, ${colors.darkBlue});
          color: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin: 20px 0;
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
        }
        
        .price-value {
          font-size: 36px;
          font-weight: 700;
          margin: 10px 0;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }
        
        .comparison-item {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid ${colors.borderGray};
          text-align: center;
        }
        
        .comparison-item.highlight {
          border-color: ${colors.lightBlue};
          background: rgba(59, 130, 246, 0.05);
        }
        
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .package-card {
          background: white;
          border: 2px solid ${colors.borderGray};
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .package-card.standard {
          border-color: ${colors.lightBlue};
          background: rgba(59, 130, 246, 0.05);
          transform: scale(1.05);
        }
        
        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .kpi-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid ${colors.borderGray};
          text-align: center;
        }
        
        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          color: ${colors.darkBlue};
          margin: 5px 0;
        }
        
        .recommendations {
          background: rgba(59, 130, 246, 0.1);
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
          padding-${isArabic ? "right" : "left"}: 20px;
          position: relative;
        }
        
        .recommendations li:before {
          content: "•";
          color: ${colors.lightBlue};
          font-weight: bold;
          position: absolute;
          ${isArabic ? "right" : "left"}: 0;
        }
        
        .cta-box {
          background: ${colors.darkBlue};
          color: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin: 20px 0;
        }
        
        .cta-link {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
        }
        
        .footer {
          position: absolute;
          bottom: 10mm;
          left: 20mm;
          right: 20mm;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid ${colors.lightBlue};
          padding-top: 10px;
        }
        
        .equation {
          background: rgba(30, 58, 138, 0.1);
          border: 2px solid ${colors.darkBlue};
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          font-family: 'Courier New', monospace;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .page { page-break-after: always; }
          .page:last-child { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <!-- Page 1: Cover -->
      <div class="page">
        <div class="header">
          <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" class="logo" />
        </div>
        
        <div class="content">
          <h1 class="page-title">${isArabic ? "تقرير تسعير Freelancer" : "Freelancer Pricing Report"}</h1>
          
          <div class="info-card">
            <h3 style="color: ${colors.darkBlue}; margin-bottom: 15px; font-size: 20px;">
              ${isArabic ? "بيانات التقرير" : "Report Information"}
            </h3>
            <p><strong>${isArabic ? "التاريخ:" : "Date:"}</strong> ${new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-US")}</p>
            <p><strong>${isArabic ? "إعداد بواسطة:" : "Prepared by:"}</strong> Kayan Finance</p>
            <p><strong>${isArabic ? "نوع التسعير:" : "Pricing Type:"}</strong> ${isArabic ? "مستقل" : "Freelancer"}</p>
          </div>
          
          <div class="tagline">
            ${
              isArabic
                ? "نحوّل أرقامك إلى قرارات وقراراتك إلى نمو"
                : "Turning Your Numbers into Decisions, and Your Decisions into Growth"
            }
          </div>
        </div>
        
        <div class="footer">
          <div>${isArabic ? "© كيان فينانس 2025 – جميع الحقوق محفوظة" : "© Kayan Finance 2025 – All Rights Reserved"}</div>
          <div>${isArabic ? "صفحة 1 من 5" : "Page 1 of 5"}</div>
        </div>
      </div>

      <!-- Page 2: Factors & Calculations -->
      <div class="page">
        <div class="header">
          <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" class="logo" />
        </div>
        
        <div class="content">
          <h2 class="page-title">${isArabic ? "العوامل والحسابات" : "Factors & Calculations"}</h2>
          
          <div class="info-card">
            <h3 style="color: ${colors.darkBlue}; margin-bottom: 15px;">
              ${isArabic ? "العوامل الشخصية" : "Personal Factors"}
            </h3>
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
                  <td>${getFactorLabel("experience", data.fl_experienceLevel || "intermediate")}</td>
                  <td>${results.multiplierBreakdown.experience}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "التخصص" : "Specialization"}</td>
                  <td>${getFactorLabel("specialization", data.fl_specialization || "general")}</td>
                  <td>${results.multiplierBreakdown.specialization}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "الموقع الجغرافي" : "Location"}</td>
                  <td>${getFactorLabel("location", data.fl_location || "egypt")}</td>
                  <td>${results.multiplierBreakdown.location}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "السمعة" : "Reputation"}</td>
                  <td>${getFactorLabel("reputation", data.fl_reputation || "good")}</td>
                  <td>${results.multiplierBreakdown.reputation}x</td>
                </tr>
                <tr style="background: ${colors.lightBlue}; color: white; font-weight: 600;">
                  <td colspan="2">${isArabic ? "إجمالي العوامل الشخصية" : "Total Personal Factors"}</td>
                  <td>${results.personalFactors.toFixed(2)}x</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="info-card">
            <h3 style="color: ${colors.darkBlue}; margin-bottom: 15px;">
              ${isArabic ? "العوامل الخارجية" : "External Factors"}
            </h3>
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
                  <td>${getFactorLabel("speed", data.fl_speedFactor || "normal")}</td>
                  <td>${results.multiplierBreakdown.speed}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "الموسم" : "Season"}</td>
                  <td>${getFactorLabel("season", data.fl_seasonFactor || "normal")}</td>
                  <td>${results.multiplierBreakdown.season}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "حجم العميل" : "Client Size"}</td>
                  <td>${getFactorLabel("clientSize", data.fl_clientSize || "small")}</td>
                  <td>${results.multiplierBreakdown.clientSize}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "منطقة العميل" : "Client Region"}</td>
                  <td>${getFactorLabel("clientRegion", data.fl_clientRegion || "local")}</td>
                  <td>${results.multiplierBreakdown.clientRegion}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "المخاطرة" : "Risk"}</td>
                  <td>${getFactorLabel("risk", data.fl_riskFactor || "low")}</td>
                  <td>${results.multiplierBreakdown.risk}x</td>
                </tr>
                <tr>
                  <td>${isArabic ? "شروط الدفع" : "Payment Terms"}</td>
                  <td>${getFactorLabel("payment", data.fl_paymentTerms || "milestone")}</td>
                  <td>${results.multiplierBreakdown.payment}x</td>
                </tr>
                <tr style="background: ${colors.lightBlue}; color: white; font-weight: 600;">
                  <td colspan="2">${isArabic ? "إجمالي العوامل الخارجية" : "Total External Factors"}</td>
                  <td>${results.externalFactors.toFixed(2)}x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="footer">
          <div>${isArabic ? "© كيان فينانس 2025 – جميع الحقوق محفوظة" : "© Kayan Finance 2025 – All Rights Reserved"}</div>
          <div>${isArabic ? "صفحة 2 من 5" : "Page 2 of 5"}</div>
        </div>
      </div>

      <!-- Page 3: Price Analysis -->
      <div class="page">
        <div class="header">
          <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" class="logo" />
        </div>
        
        <div class="content">
          <h2 class="page-title">${isArabic ? "تحليل الأسعار" : "Price Analysis"}</h2>
          
          <div class="equation">
            ${isArabic ? "المعادلة النهائية:" : "Final Equation:"}<br>
            ${formatCurrency(results.hourlyBase)} × ${results.personalFactors.toFixed(2)} × ${results.externalFactors.toFixed(2)} = ${formatCurrency(results.hourlyFloor)}
          </div>
          
          <div class="comparison-grid">
            <div class="comparison-item">
              <h4 style="color: ${colors.darkBlue}; margin-bottom: 10px;">
                ${isArabic ? "السعر الأساسي" : "Base Price"}
              </h4>
              <div style="font-size: 24px; font-weight: 600; color: #6b7280;">
                ${formatCurrency(results.hourlyBase)}
              </div>
              <div style="font-size: 14px; color: #9ca3af; margin-top: 5px;">
                ${isArabic ? "بالساعة" : "per hour"}
              </div>
            </div>
            
            <div class="comparison-item highlight">
              <h4 style="color: ${colors.darkBlue}; margin-bottom: 10px;">
                ${isArabic ? "السعر النهائي" : "Final Price"}
              </h4>
              <div style="font-size: 24px; font-weight: 600; color: ${colors.lightBlue};">
                ${formatCurrency(results.hourlyFloor)}
              </div>
              <div style="font-size: 14px; color: #9ca3af; margin-top: 5px;">
                ${isArabic ? "بالساعة" : "per hour"}
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <h3 style="color: ${colors.darkBlue}; margin-bottom: 15px;">
              ${isArabic ? "تحليل التأثير" : "Impact Analysis"}
            </h3>
            <div style="font-size: 18px; text-align: center; padding: 20px;">
              <strong style="color: ${colors.lightBlue};">
                ${isArabic ? "نسبة الزيادة:" : "Increase Percentage:"} 
                ${(((results.hourlyFloor - results.hourlyBase) / results.hourlyBase) * 100).toFixed(1)}%
              </strong>
            </div>
            <div style="font-size: 16px; text-align: center; color: #6b7280;">
              ${
                isArabic
                  ? `زيادة قدرها ${formatCurrency(results.hourlyFloor - results.hourlyBase)} عن السعر الأساسي`
                  : `An increase of ${formatCurrency(results.hourlyFloor - results.hourlyBase)} over the base price`
              }
            </div>
          </div>
          
          <div class="price-box">
            <h3>${isArabic ? "السعر المقترح بالساعة" : "Suggested Hourly Rate"}</h3>
            <div class="price-value">${formatCurrency(results.hourlySuggested)}</div>
            <div style="font-size: 14px; opacity: 0.9;">
              ${isArabic ? "(يشمل هامش ربح 20%)" : "(Includes 20% profit margin)"}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div>${isArabic ? "© كيان فينانس 2025 – جميع الحقوق محفوظة" : "© Kayan Finance 2025 – All Rights Reserved"}</div>
          <div>${isArabic ? "صفحة 3 من 5" : "Page 3 of 5"}</div>
        </div>
      </div>

      <!-- Page 4: Final Results -->
      <div class="page">
        <div class="header">
          <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" class="logo" />
        </div>
        
        <div class="content">
          <h2 class="page-title">${isArabic ? "النتائج النهائية" : "Final Results"}</h2>
          
          <div class="price-box">
            <h3>${isArabic ? "السعر النهائي بالساعة" : "Final Hourly Rate"}</h3>
            <div class="price-value">${formatCurrency(results.hourlySuggested)}</div>
          </div>
          
          ${
            results.projectSuggested > 0
              ? `
            <div class="price-box" style="background: linear-gradient(135deg, #059669, #047857);">
              <h3>${isArabic ? "سعر المشروع" : "Project Price"}</h3>
              <div class="price-value">${formatCurrency(results.projectSuggested)}</div>
            </div>
          `
              : ""
          }
          
          ${
            results.packages
              ? `
            <div class="info-card">
              <h3 style="color: ${colors.darkBlue}; margin-bottom: 20px; text-align: center;">
                ${isArabic ? "الباقات المقترحة" : "Suggested Packages"}
              </h3>
              <div class="packages-grid">
                <div class="package-card">
                  <h4 style="color: ${colors.darkBlue}; margin-bottom: 10px;">
                    ${isArabic ? "باقة أساسية" : "Basic Package"}
                  </h4>
                  <div style="font-size: 20px; font-weight: 600; color: ${colors.lightBlue}; margin: 10px 0;">
                    ${formatCurrency(results.packages.basic)}
                  </div>
                  <div style="font-size: 12px; color: #6b7280;">
                    ${isArabic ? "للمشاريع البسيطة" : "For simple projects"}
                  </div>
                </div>
                
                <div class="package-card standard">
                  <h4 style="color: ${colors.darkBlue}; margin-bottom: 10px;">
                    ${isArabic ? "باقة قياسية" : "Standard Package"}
                  </h4>
                  <div style="font-size: 20px; font-weight: 600; color: ${colors.lightBlue}; margin: 10px 0;">
                    ${formatCurrency(results.packages.standard)}
                  </div>
                  <div style="font-size: 12px; color: #6b7280;">
                    ${isArabic ? "الأكثر شيوعاً" : "Most popular"}
                  </div>
                </div>
                
                <div class="package-card">
                  <h4 style="color: ${colors.darkBlue}; margin-bottom: 10px;">
                    ${isArabic ? "باقة متميزة" : "Premium Package"}
                  </h4>
                  <div style="font-size: 20px; font-weight: 600; color: ${colors.lightBlue}; margin: 10px 0;">
                    ${formatCurrency(results.packages.premium)}
                  </div>
                  <div style="font-size: 12px; color: #6b7280;">
                    ${isArabic ? "للمشاريع المعقدة" : "For complex projects"}
                  </div>
                </div>
              </div>
            </div>
          `
              : ""
          }
        </div>
        
        <div class="footer">
          <div>${isArabic ? "© كيان فينانس 2025 – جميع الحقوق محفوظة" : "© Kayan Finance 2025 – All Rights Reserved"}</div>
          <div>${isArabic ? "صفحة 4 من 5" : "Page 4 of 5"}</div>
        </div>
      </div>

      <!-- Page 5: Summary -->
      <div class="page">
        <div class="header">
          <img src="https://kayanfinance.com/kayan-finance-logo.png" alt="Kayan Finance" class="logo" />
        </div>
        
        <div class="content">
          <h2 class="page-title">${isArabic ? "ملخص المستقل" : "Freelancer Summary"}</h2>
          
          <div class="info-card">
            <h3 style="color: ${colors.darkBlue}; margin-bottom: 20px; text-align: center;">
              ${isArabic ? "المؤشرات الرئيسية" : "Key Performance Indicators"}
            </h3>
            <div class="kpis-grid">
              <div class="kpi-card">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
                  ${isArabic ? "السعر الأساسي/ساعة" : "Base Price/Hour"}
                </div>
                <div class="kpi-value">${formatCurrency(results.hourlyBase)}</div>
              </div>
              
              <div class="kpi-card">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
                  ${isArabic ? "السعر النهائي/ساعة" : "Final Price/Hour"}
                </div>
                <div class="kpi-value">${formatCurrency(results.hourlySuggested)}</div>
              </div>
              
              <div class="kpi-card">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
                  ${isArabic ? "نسبة التغيير" : "Change Percentage"}
                </div>
                <div class="kpi-value">+${(((results.hourlySuggested - results.hourlyBase) / results.hourlyBase) * 100).toFixed(1)}%</div>
              </div>
              
              ${
                results.projectSuggested > 0
                  ? `
                <div class="kpi-card">
                  <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
                    ${isArabic ? "سعر المشروع" : "Project Price"}
                  </div>
                  <div class="kpi-value">${formatCurrency(results.projectSuggested)}</div>
                </div>
              `
                  : ""
              }
            </div>
          </div>
          
          <div class="recommendations">
            <h3 style="color: ${colors.darkBlue}; margin-bottom: 15px;">
              ${isArabic ? "التوصيات التنفيذية" : "Executive Recommendations"}
            </h3>
            <ul>
              <li>${
                isArabic
                  ? `استخدم السعر المقترح ${formatCurrency(results.hourlySuggested)} بالساعة كنقطة انطلاق للتفاوض`
                  : `Use the suggested rate of ${formatCurrency(results.hourlySuggested)} per hour as a starting point for negotiations`
              }</li>
              <li>${
                isArabic
                  ? "اعرض باقات متدرجة لتوفير خيارات متنوعة للعملاء"
                  : "Offer tiered packages to provide diverse options for clients"
              }</li>
              <li>${
                isArabic
                  ? "راجع أسعارك كل 6 أشهر بناءً على تطور خبرتك وسمعتك"
                  : "Review your pricing every 6 months based on your experience and reputation growth"
              }</li>
            </ul>
          </div>
          
          <div class="cta-box">
            <h3 style="margin-bottom: 15px;">
              ${isArabic ? "هل تحتاج مساعدة إضافية؟" : "Need Additional Help?"}
            </h3>
            <p style="margin-bottom: 15px;">
              ${
                isArabic
                  ? "تواصل معنا للحصول على استشارة مخصصة لتطوير استراتيجية التسعير الخاصة بك"
                  : "Contact us for personalized consultation to develop your pricing strategy"
              }
            </p>
            <a href="https://kayanfinance.com/contact" class="cta-link">
              kayanfinance.com/contact
            </a>
          </div>
        </div>
        
        <div class="footer">
          <div>${isArabic ? "© كيان فينانس 2025 – جميع الحقوق محفوظة" : "© Kayan Finance 2025 – All Rights Reserved"}</div>
          <div>${isArabic ? "صفحة 5 من 5" : "Page 5 of 5"}</div>
        </div>
      </div>
    </body>
    </html>
  `

  // Open new window and write HTML
  const printWindow = window.open("", "_blank", "width=800,height=600")
  if (!printWindow) {
    throw new Error("Failed to open print window")
  }

  printWindow.document.write(html)
  printWindow.document.close()

  // Wait for images to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
    }, 1000)
  }
}
