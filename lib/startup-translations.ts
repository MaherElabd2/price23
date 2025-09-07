export type StartupLang = "ar" | "en"

export const startupTranslations = {
  ar: {
    // Common elements
    common: {
      backHome: "رجوع للرئيسية",
      previous: "السابق",
      next: "التالي",
      calculate: "احسب الأسعار",
      step: "الخطوة",
      of: "من",
      currentIndicators: "المؤشرات الحالية",
      currency: "جنيه",
      currencyPerMonth: "جنيه/شهر",
      currencyPerUnit: "جنيه",
      units: "وحدة",
      unitsPerMonth: "وحدة/شهر",
      days: "يوم",
      months: "شهر",
      percentage: "%",
      total: "الإجمالي",
      undefined: "غير محدد",
      notApplicable: "غير مطبق",
      example: "مثال",
    },

    // Step 0: Basic Information
    step0BasicInfo: {
      title: "المعلومات الأساسية - الشركات الناشئة",
      subtitle: "أدخل معلوماتك الشخصية ومعلومات الشركة الناشئة",
      personalInfo: "المعلومات الشخصية",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "أدخل اسمك الكامل",
      email: "البريد الإلكتروني",
      emailPlaceholder: "example@email.com",
      phone: "رقم الهاتف",
      phonePlaceholder: "+1 234 567 8900",
      country: "البلد",
      selectCountry: "اختر البلد",
      companyInfo: "معلومات الشركة الناشئة",
      companyName: "اسم الشركة",
      companyNamePlaceholder: "أدخل اسم شركتك",
      foundedYear: "سنة التأسيس",
      currency: "العملة",
      selectCurrency: "اختر عملة التسعير",
      currencyNote: "ستُستخدم هذه العملة في جميع الحسابات والتقارير",
      sectorTitle: "قطاع الشركة",
      sectorDescription: "اختر القطاع الذي تعمل فيه شركتك الناشئة",
      sectorPlaceholder: "اختر القطاع",
      customSectorPlaceholder: "أدخل القطاع المخصص",
      expectedMarginLabel: "الهامش المتوقع %",
      expectedMarginPlaceholder: "25",
      companyStageTitle: "مرحلة الشركة",
      companyStageDescription: "ما هي المرحلة الحالية لشركتك؟",
      mvpHint: "في هذه المرحلة، يمكننا حساب نقطة التعادل، لكن توقعات الإيرادات والأرباح ستكون غير مؤكدة.",
      sectorMetricsTitle: "معايير القطاع",
      marginLabel: "الهامش",
      variableCostLabel: "التكلفة المتغيرة",
      fixedCostLabel: "التكلفة الثابتة",
      keyMetricLabel: "المقياس الرئيسي",
      strategyLabel: "الاستراتيجية",
      adviceLabel: "نصيحة",
      countries: {
        EG: "مصر",
        SA: "المملكة العربية السعودية",
        AE: "الإمارات العربية المتحدة",
        KW: "الكويت",
        QA: "قطر",
        BH: "البحرين",
        OM: "عُمان",
        JO: "الأردن",
        LB: "لبنان",
        IQ: "العراق",
        DZ: "الجزائر",
        MA: "المغرب",
        TN: "تونس",
      },
      sectors: {
        ecommerce: "التجارة الإلكترونية",
        restaurants: "المطاعم",
        fashion: "الأزياء",
        services: "الخدمات",
        industries: "الصناعات",
        saas: "البرمجيات كخدمة",
        other: "أخرى",
      },
      stages: {
        idea: {
          label: "فكرة",
          desc: "لديك فكرة وتخطط للبدء",
        },
        mvp: {
          label: "المنتج الأولي",
          desc: "لديك منتج أولي وتختبر السوق",
        },
        growth: {
          label: "النمو",
          desc: "توسع عملك وتزيد العملاء",
        },
        scaleup: {
          label: "التوسع",
          desc: "توسع على نطاق واسع",
        },
      },
      sectorBenchmarks: {
        ecommerce: {
          margin: "15-25%",
          variableCost: "60-70%",
          fixedCost: "10-15%",
          keyMetric: "معدل التحويل وقيمة الطلب",
          strategy: "تحسين تجربة المستخدم",
          advice: "ركز على تكاليف الشحن والتخزين",
        },
        restaurants: {
          margin: "3-9%",
          variableCost: "70-80%",
          fixedCost: "15-20%",
          keyMetric: "تكلفة الطعام ومعدل دوران الطاولات",
          strategy: "تحكم في تكلفة المواد الخام",
          advice: "تحكم في تكلفة المواد الخام والعمالة",
        },
        saas: {
          margin: "70-85%",
          variableCost: "10-20%",
          fixedCost: "5-10%",
          keyMetric: "معدل الاحتفاظ بالعملاء",
          strategy: "الاستثمار في المنتج",
          advice: "استثمر في الاحتفاظ بالعملاء",
        },
        fashion: {
          margin: "4-13%",
          variableCost: "50-60%",
          fixedCost: "30-40%",
          keyMetric: "معدل دوران المخزون",
          strategy: "إدارة المخزون بكفاءة",
          advice: "إدارة المخزون والموسمية",
        },
        services: {
          margin: "10-20%",
          variableCost: "40-60%",
          fixedCost: "20-30%",
          keyMetric: "معدل استغلال الوقت",
          strategy: "تحسين الكفاءة",
          advice: "ركز على قيمة الخدمة المقدمة",
        },
        industries: {
          margin: "5-15%",
          variableCost: "60-75%",
          fixedCost: "15-25%",
          keyMetric: "كفاءة الإنتاج",
          strategy: "تحسين العمليات",
          advice: "تحسين العمليات والكفاءة",
        },
        other: {
          margin: "10-20%",
          variableCost: "50-70%",
          fixedCost: "15-25%",
          keyMetric: "هامش المساهمة",
          strategy: "تحليل السوق",
          advice: "حلل منافسيك بعناية",
        },
      },
    },

    // Step 1: Quantities
    step1Quantities: {
      title: "تعريف المنتجات والكميات",
      subtitle: "حدد منتجاتك وخدماتك والكميات المتوقعة",
      productsTitle: "المنتجات",
      addProductButton: "إضافة منتج",
      noProducts: "لم تضف أي منتجات بعد",
      noProductsDesc: 'اضغط "إضافة منتج" لتبدأ',
      productLabel: "المنتج",
      pauseLabel: "إيقاف مؤقت",
      productNameLabel: "اسم المنتج",
      productNameHint: "اسم واضح ومميز للمنتج",
      productTypeLabel: "نوع المنتج",
      productTypeDesc: "هل هذا منتج أساسي أم إضافي؟",
      productTypes: {
        core: "أساسي",
        addon: "إضافي",
      },
      descriptionLabel: "وصف المنتج",
      descriptionPlaceholder: "وصف مختصر للمنتج وفوائده",
      descriptionHint: "وصف يساعد في فهم قيمة المنتج",
      preliminaryPriceLabel: "السعر التمهيدي",
      preliminaryPriceHint: "سعر تقديري أولي (اختياري)",
      selectMethodLabel: "اختر طريقة تقدير الكمية:",
      quantityMethods: {
        fixed: "عدد ثابت",
        range: "نطاق (من - إلى)",
        market: "حسب السوق",
        historical: "حسب المبيعات السابقة",
        capacity: "حسب الطاقة الإنتاجية",
        uncertain: "غير متأكد",
      },
      quantityLabel: "الكمية",
      quantityHint: "الكمية المتوقعة شهرياً",
      monthlyQuantity: "الكمية الشهرية",
      fixedQtyPlaceholder: "أدخل الكمية الثابتة",
      monthlyQuantityLabel: "الكمية الشهرية",
      unitPerMonthSuffix: "وحدة / شهر",
      rangeMinPlaceholder: "الحد الأدنى",
      rangeMaxPlaceholder: "الحد الأقصى",
      averageLabel: "المتوسط",
      rangeLabel: "النطاق",
      unitsShort: "وحدة",
      capacityMaxLabel: "الطاقة القصوى",
      capacityMaxHint: "أقصى وحدات يمكن إنتاجها/تقديمها شهرياً",
      capacityUtilizationLabel: "نسبة استغلال الطاقة %",
      capacityUtilizationHint: "ما نسبة الطاقة المتوقع استخدامها",
      expectedQuantityLabel: "الكمية المتوقعة",
      calculationLabel: "الحساب",
      marketSizeLabel: "حجم السوق",
      marketSizeHint: "إجمالي حجم السوق بالوحدات شهرياً",
      sectorGuidance: "إرشادات خاصة بالقطاع",
      sectorNotes: {
        ecommerce:
          "للتجارة الإلكترونية: ركز على تحليل معدل التحويل وتكلفة اكتساب العملاء. الكميات تعتمد على حركة المرور والتحويل.",
        restaurants: "للمطاعم: احسب الطاقة الاستيعابية بناءً على عدد الطاولات وساعات العمل. راعي الموسمية في التوقعات.",
        saas: "للبرمجيات كخدمة: ركز على معدل النمو الشهري والاحتفاظ بالعملاء. ابدأ بتوقعات محافظة واعتمد على البيانات.",
        fashion: "للأزياء: راعي الموسمية والاتجاهات. احسب المخزون بعناية وتوقع دورات الطلب المختلفة.",
        services: "للخدمات: احسب الطاقة بناءً على ساعات العمل المتاحة وعدد الموظفين. راعي وقت تقديم كل خدمة.",
        industries: "للصناعات: احسب الطاقة الإنتاجية بناءً على المعدات والمواد الخام المتاحة. راعي أوقات الصيانة.",
        other: "لقطاعات أخرى: ادرس السوق بعناية واستخدم بيانات مماثلة من قطاعات شبيهة. ابدأ بتوقعات محافظة.",
      },
      marketShareLabel: "نسبة الحصة السوقية %",
      marketShareHint: "ما نسبة السوق المتوقع الاستحواذ عليها",
      historicalM1: "الشهر الأول",
      historicalM2: "الشهر الثاني",
      historicalM3: "الشهر الثالث",
      historicalAverageLabel: "المتوسط التاريخي",
      uncertainMethod: {
        description: "عندما تكون غير متأكد من الكميات، سنساعدك في التقدير بناءً على نموذج عملك وبحث السوق",
        hint: "هذا طبيعي للشركات الجديدة - سنوفر إرشادات بناءً على قطاعك وأهدافك",
      },
      quantityWarning: "الكمية أقل من المتوقع للقطاع (الحد الأدنى: {min})",
      quantitySuggestion: "جرب كمية أقرب إلى {suggested}",
      sectorPlaceholders: {
        ecommerce: "مثال: 100-500 طلب شهري",
        restaurants: "مثال: 50-200 طلب يومي",
        saas: "مثال: 10-100 اشتراك شهري",
        fashion: "مثال: 20-100 قطعة شهري",
        services: "مثال: 5-50 مشروع شهري",
        industries: "مثال: 10-100 وحدة شهري",
        other: "مثال: 10-100 وحدة شهري",
      },
      runway: {
        title: "الـ Runway (عُمر الكاش)",
        calculationMethod: "طريقة الحساب",
        manual: "إدخال يدوي",
        auto: "حساب تلقائي",
        runwayMonths: "عدد الشهور",
        runwayMonthsPlaceholder: "أدخل عدد الشهور",
        availableCash: "الكاش المتاح",
        cashPlaceholder: "أدخل المبلغ المتاح",
        hint: "💡 نصيحة: الـ Runway هو عدد الشهور اللي هتفضل معاك فلوس قبل ما تحتاج ترفع كاش تاني",
        calculationHint: "سيتم حساب الـ Runway تلقائياً بناءً على التكاليف والإيرادات المتوقعة",
        importance: "مهم جداً للشركات الناشئة - يحدد متى تحتاج لرفع كاش جديد",
        hintShort: "تحذير: أقل من 6 شهور - تحتاج لرفع كاش فوري",
        hintMedium: "انتباه: أقل من 12 شهر - خطط لرفع كاش قريباً",
        hintLong: "ممتاز: أكثر من 12 شهر - وضع آمن",
      },
      productSummary: {
        title: "ملخص المنتجات",
        noProducts: "لا توجد منتجات",
        productName: "اسم المنتج",
        monthlyQuantity: "الكمية الشهرية",
      },
      productStatusLabel: "حالة المنتج",
      productStatuses: {
        active: "نشط",
        paused: "متوقف مؤقتاً",
      },
    },

    // Step 2: Product Costs
    step2ProductCosts: {
      title: "تكاليف المنتجات والخدمات",
      subtitle: "حدد التكاليف المتغيرة لكل منتج",
      productCostsTitle: "تكاليف المنتجات",
      addCostItemButton: "إضافة بند تكلفة",
      costItemLabel: "بند التكلفة",
      costItemPlaceholder: "مثال: مواد خام، عمالة، شحن",
      amountLabel: "المبلغ",
      amountPlaceholder: "0.00",
      totalVariableCostLabel: "إجمالي التكلفة المتغيرة",
      perUnitLabel: "للوحدة الواحدة",
      noCostItems: "لا توجد بنود تكلفة",
      addCostItemDesc: "أضف بنود التكلفة المتغيرة لهذا المنتج",
      costItemTypes: {
        material: "مواد خام",
        labor: "عمالة",
        shipping: "شحن",
        commission: "عمولة",
        packaging: "تغليف",
        other: "أخرى",
      },
      monthlyFixedCostsDesc: "التكاليف الثابتة الشهرية التي لا تتغير مع حجم الإنتاج",
      fixedCostCategories: {
        salaries: "الرواتب",
        rent: "الإيجار",
        utilities: "المرافق",
        marketing: "التسويق",
        insurance: "التأمين",
        software: "البرمجيات",
        maintenance: "الصيانة",
        other_fixed: "ثابتة أخرى",
      },
      customFixedCostsTitle: "التكاليف الثابتة المخصصة",
      addFixedCostButton: "إضافة تكلفة ثابتة",
      addFixedCostDesc: "أضف أي تكاليف ثابتة إضافية خاصة بعملك",
      productSpecificFixedCostsTitle: "التكاليف الثابتة الخاصة بالمنتج",
      noProductSpecificCosts: "لا توجد تكاليف ثابتة خاصة بالمنتج",
      addCostButton: "إضافة تكلفة",
      costNameLabel: "اسم التكلفة",
      costNamePlaceholder: "اسم التكلفة",
      monthlyAmountLabel: "المبلغ الشهري",
      deleteButton: "حذف",
      totalMonthlyFixedLabel: "إجمالي الثابتة الشهرية",
      monthlyBurnRateTitle: "معدل الحرق الشهري",
      variableCostsLabel: "التكاليف المتغيرة:",
      fixedCostsLabel: "التكاليف الثابتة:",
      totalBurnRateLabel: "إجمالي معدل الحرق:",
      totalBurnRateDesc: "إجمالي التدفق النقدي الشهري الصادر شامل جميع التكاليف",
      includesAllFixedCosts: "يشمل جميع التكاليف الثابتة التي لا تتغير مع الإنتاج",
      sectorPlaceholders: {
        ecommerce: {
          material: "مواد التغليف، منتجات للبيع",
          labor: "خدمة العملاء، التعبئة",
          shipping: "شحن للعملاء",
          commission: "عمولة المبيعات",
          packaging: "صناديق، أكياس",
          other: "رسوم الدفع الإلكتروني",
        },
        restaurants: {
          material: "مكونات الطعام، مشروبات",
          labor: "طهاة، خدمة",
          shipping: "توصيل الطلبات",
          commission: "عمولة التوصيل",
          packaging: "علب الطعام، أكياس",
          other: "غاز، كهرباء المطبخ",
        },
        saas: {
          material: "خوادم، تراخيص",
          labor: "مطورين، دعم فني",
          shipping: "غير مطبق",
          commission: "عمولة المبيعات",
          packaging: "غير مطبق",
          other: "أدوات التطوير",
        },
        fashion: {
          material: "أقمشة، إكسسوارات",
          labor: "تصميم، خياطة",
          shipping: "شحن للعملاء",
          commission: "عمولة المبيعات",
          packaging: "أكياس، علب هدايا",
          other: "تصوير المنتجات",
        },
        services: {
          material: "أدوات، مواد استهلاكية",
          labor: "مقدمي الخدمة",
          shipping: "انتقال للعميل",
          commission: "عمولة الوسطاء",
          packaging: "غير مطبق",
          other: "تأمين المسؤولية",
        },
        industries: {
          material: "مواد خام، قطع غيار",
          labor: "عمال إنتاج",
          shipping: "نقل المنتجات",
          commission: "عمولة الموزعين",
          packaging: "تغليف صناعي",
          other: "طاقة الإنتاج",
        },
        other: {
          material: "مواد أساسية",
          labor: "عمالة مباشرة",
          shipping: "نقل وشحن",
          commission: "عمولات",
          packaging: "تغليف",
          other: "تكاليف أخرى",
        },
      },
    },

    // Step 3: Company Allocation
    step3CompanyAllocation: {
      title: "توزيع التكاليف الثابتة",
      subtitle: "حدد كيفية توزيع التكاليف الثابتة على المنتجات",
      totalFixedCosts: "إجمالي التكاليف الثابتة",
      allocationMethodLabel: "اختر طريقة التوزيع",
      allocationMethods: {
        equal: "التوزيع المتساوي",
        units: "حسب الوحدات المباعة",
        cost: "حسب التكلفة المتغيرة",
        custom: "مخصص",
      },
      customAllocation: {
        distributed: "موزع",
        remaining: "متبقي",
        distributeEqual: "توزيع متساوي",
        distributeByVariableCost: "حسب التكلفة المتغيرة",
        resetAll: "إعادة تعيين الكل",
        incompleteDistributionWarning: "توزيع غير مكتمل: {value}% متبقي",
      },
      previewTitle: "معاينة التوزيع",
      tableHeaders: {
        product: "المنتج",
        quantity: "الكمية",
        variableCosts: "التكاليف المتغيرة",
        fixedPercentage: "نسبة الثابتة %",
        productSpecificFixed: "الثابتة الخاصة",
        sharedFixed: "الثابتة المشتركة",
        totalFixed: "إجمالي الثابتة",
        costPerUnit: "التكلفة/الوحدة",
        total: "الإجمالي",
      },
    },

    // Step 4: Detailed Costs
    step4DetailedCosts: {
      title: "تحليل التكاليف التفصيلي",
      tableHeaders: {
        product: "المنتج",
        unitVariable: "المتغيرة للوحدة",
        totalVariable: "إجمالي المتغيرة",
        productSpecificFixed: "الثابتة الخاصة",
        sharedFixed: "الثابتة المشتركة",
        totalFixed: "إجمالي الثابتة",
        fixedPerUnit: "الثابتة/الوحدة",
        fullUnitCost: "التكلفة الكاملة للوحدة",
        totalCosts: "إجمالي التكاليف",
        totalRow: "الإجمالي",
      },
    },

    // Step 4: Pricing Competition
    step4PricingCompetition: {
      title: "تحليل التسعير والمنافسة",
      subtitle: "حلل منافسة السوق وضع استراتيجيات التسعير المثلى",
      competitorsCard: {
        title: "تحليل المنافسين",
        desc: "حلل تسعير منافسيك الرئيسيين",
        productTitleFallback: "المنتج {index}",
        competitorLabel: "المنافس {i}",
        priceHint: "أدخل سعر المنافس",
        pricePlaceholder: "0",
        priceRangeLabel: "نطاق الأسعار",
        currencyLabel: "جنيه",
      },
      priceSensitivityCard: {
        title: "تحليل حساسية السعر",
        desc: "ما مدى حساسية عملائك لتغييرات الأسعار؟",
        options: {
          high: {
            title: "حساسية عالية",
            desc: "العملاء حساسون جداً للأسعار",
          },
          medium: {
            title: "حساسية متوسطة",
            desc: "اعتبار متوازن للأسعار",
          },
          low: {
            title: "حساسية منخفضة",
            desc: "السعر أقل أهمية من القيمة",
          },
        },
        tooltipExample: {
          high: "العملاء في {sector} عادة ما يقارنون الأسعار بعناية. {suggestion}",
          medium: "العملاء في {sector} يوازنون بين السعر والقيمة. {suggestion}",
          low: "العملاء في {sector} يركزون على الجودة أكثر من السعر. {suggestion}",
        },
      },
      differentiationCard: {
        title: "عوامل التمايز",
        desc: "ما الذي يجعل منتجك فريداً؟",
        chips: [
          "جودة عالية",
          "خدمة عملاء ممتازة",
          "سرعة التسليم",
          "تقنية متقدمة",
          "سعر تنافسي",
          "تصميم فريد",
          "ضمان شامل",
          "سهولة الاستخدام",
        ],
        customLabel: "تمايز مخصص",
        customPlaceholder: "اوصف عرض القيمة الفريد الخاص بك...",
      },
      currentGoalCard: {
        title: "الهدف التجاري الحالي",
        desc: "ما هو هدفك التجاري الأساسي الآن؟",
        options: {
          quick_revenue: {
            title: "إيرادات سريعة",
            desc: "توليد إيرادات بسرعة",
          },
          market_entry: {
            title: "دخول السوق",
            desc: "دخول السوق بشكل تنافسي",
          },
          premium_position: {
            title: "موقع متميز",
            desc: "التموضع كعلامة تجارية متميزة",
          },
          sustainable_growth: {
            title: "نمو مستدام",
            desc: "التركيز على النمو طويل المدى",
          },
          test_market: {
            title: "اختبار السوق",
            desc: "اختبار استجابة السوق",
          },
        },
      },
      ltvCacCard: {
        title: "تحليل LTV/CAC",
        infoTitle: "ما هو LTV/CAC؟",
        infoDesc: "نسبة القيمة الدائمة للعميل إلى تكلفة اكتساب العميل - مقياس رئيسي للنمو المستدام",
        productTitleFallback: "المنتج {index}",
        customerDataTitle: "بيانات العملاء",
        monthlyNewCustomersLabel: "العملاء الجدد شهرياً",
        monthlyNewCustomersHelp: "كم عميل جديد تكتسب شهرياً؟",
        churnRateLabel: "معدل فقدان العملاء (%)",
        churnRateHelp: "ما نسبة العملاء الذين يتوقفون عن الشراء شهرياً؟",
        purchaseDataTitle: "بيانات الشراء",
        avgOrderValueLabel: "متوسط قيمة الطلب",
        avgOrderValueHelp: "متوسط المبلغ لكل عملية شراء",
        purchaseFrequencyLabel: "تكرار الشراء (شهرياً)",
        purchaseFrequencyHelp: "كم مرة يشتري العميل شهرياً؟",
        grossMarginLabel: "الهامش الإجمالي (%)",
        marketingMonthlyLabel: "تكلفة التسويق الشهرية",
        marketingMonthlyHelp: "كم تنفق على التسويق شهرياً لهذا المنتج؟",
        metrics: {
          cacShort: "CAC",
          cacLabel: "تكلفة اكتساب العميل",
          cacZeroHint: "أضف تكلفة التسويق للحساب",
          ltvShort: "LTV",
          ltvLabel: "القيمة الدائمة للعميل",
          ltvZeroHint: "أكمل بيانات العملاء للحساب",
          ratioLabel: "نسبة LTV:CAC",
          ratioQuestion: "ما مدى استدامة نموك؟",
        },
      },
      sectorGuidance: {
        ecommerce: {
          pricingSuggestion: "ركز على تحسين معدل التحويل",
        },
        restaurants: {
          pricingSuggestion: "تحكم في تكلفة المواد الخام",
        },
        saas: {
          pricingSuggestion: "استثمر في الاحتفاظ بالعملاء",
        },
        fashion: {
          pricingSuggestion: "إدارة المخزون بكفاءة",
        },
        services: {
          pricingSuggestion: "ركز على قيمة الخدمة",
        },
        industries: {
          pricingSuggestion: "تحسين كفاءة الإنتاج",
        },
        other: {
          pricingSuggestion: "حلل السوق بعناية",
        },
      },
    },

    // Step 5: Financial Analysis
    step5FinancialAnalysis: {
      title: "التحليل المالي",
      subtitle: "حلل توقعاتك المالية ونقاط التعادل",
      appliedStrategyLabel: "الاستراتيجية المطبقة",
      strategies: {
        cost_plus: "التكلفة زائد",
        competitive: "تنافسي",
        value_based: "قائم على القيمة",
        penetration: "اختراق السوق",
        custom: "مخصص",
      },
      runwayCard: {
        title: "عُمر الكاش",
        tooltip: "كم من الوقت سيدوم كاشك بمعدل الحرق الحالي",
        revenueLabel: "الإيرادات الشهرية",
        netProfitLabel: "صافي الربح",
        netLossLabel: "صافي الخسارة",
        runwayRemainingLabel: "المدة المتبقية",
        monthsShort: "شهر",
        undefinedLabel: "غير محدد",
      },
      ltvCacCard: {
        title: "تحليل LTV/CAC",
        tooltipDesc: "تحليل نسبة القيمة الدائمة للعميل إلى تكلفة اكتساب العميل",
        inputs: {
          avgPurchaseValue: {
            label: "متوسط قيمة الشراء",
            help: "متوسط المبلغ لكل عملية شراء",
            placeholder: "200",
          },
          purchaseFrequencyPerYear: {
            label: "تكرار الشراء (سنوياً)",
            help: "كم مرة يشتري العميل سنوياً؟",
            placeholder: "4",
          },
          customerLifespanYears: {
            label: "عمر العميل (بالسنوات)",
            help: "كم سنة يبقى العميل معك؟",
            placeholder: "2",
          },
          monthlyMarketingSpend: {
            label: "الإنفاق التسويقي الشهري",
            help: "كم تنفق على التسويق شهرياً؟",
            placeholder: "5000",
          },
          newCustomersPerMonth: {
            label: "العملاء الجدد شهرياً",
            help: "كم عميل جديد تكتسب شهرياً؟",
            placeholder: "50",
          },
        },
        metricsBox: {
          cacTitle: "CAC",
          cacDesc: "تكلفة اكتساب العميل",
          ltvTitle: "LTV",
          ltvDesc: "القيمة الدائمة للعميل",
          ratioTitle: "نسبة LTV:CAC",
          ratioStatus: {
            good: "جيد",
            ok: "متوسط",
            bad: "يحتاج تحسين",
          },
        },
      },
      breakEvenCard: {
        title: "تحليل نقطة التعادل",
        tooltip: "تحليل الوحدات المطلوبة لتغطية جميع التكاليف",
        profitableLabel: "مربح",
        needsImprovementLabel: "يحتاج تحسين",
        priceLabel: "السعر",
        marginPerUnitLabel: "الهامش/الوحدة",
        breakEvenLabel: "نقطة التعادل",
        unitPerMonthSuffix: "وحدة/شهر",
        breakEvenUndefined: "غير قابل للتطبيق",
        currentQtyLabel: "الكمية الحالية",
      },
    },

    // Step 5: Investor Perspective
    step5InvestorPerspective: {
      title: "منظور المستثمر",
      subtitle: "حلل عملك من وجهة نظر المستثمر",
      strategicGoal: {
        title: "الهدف الاستراتيجي",
        options: {
          growth: {
            title: "النمو",
            description: "التركيز على النمو السريع",
          },
          sustainability: {
            title: "الاستدامة",
            description: "بناء عمل مستدام",
          },
          exit: {
            title: "الخروج",
            description: "التحضير للبيع أو الاكتتاب",
          },
        },
      },
      selfAssessment: {
        title: "التقييم الذاتي",
        question: "كيف تقيم عرض القيمة الخاص بك؟",
        options: {
          standard: {
            label: "عادي",
            desc: "منتج عادي في السوق",
          },
          value_added: {
            label: "قيمة مضافة",
            desc: "منتج بقيمة مضافة واضحة",
          },
          game_changer: {
            label: "مغير للعبة",
            desc: "منتج ثوري يغير السوق",
          },
        },
        premiumNotice: "فكر في التسعير المتميز للقيمة المغيرة للعبة",
      },
      discountsPolicy: {
        title: "سياسة الخصومات",
        offerDiscountsLabel: "تقديم خصومات وعروض ترويجية",
        plannedTypesLabel: "اختر أنواع الخصومات المخططة:",
        types: {
          quantity: "خصم الكمية",
          loyalty: "خصم الولاء",
          seasonal: "خصم موسمي",
          free_trial: "تجربة مجانية",
        },
      },
    },

    // Step 6: Pricing Strategies
    step6PricingStrategies: {
      title: "استراتيجيات التسعير",
      subtitle: "اختر استراتيجيات التسعير المثلى لمنتجاتك",
      recommendationsTitle: "التوصيات",
      recommendedMarginForThis: "الهامش الموصى به لهذا:",
      productStrategyTitle: "اختيار استراتيجية المنتج",
      recommendedBadge: "موصى به",
      unitCostLabel: "تكلفة الوحدة:",
      suggestedMargin: "الهامش المقترح:",
      summaryTitle: "ملخص الاستراتيجية",
      strategyOptions: {
        penetration: {
          label: "اختراق السوق",
          desc: "أسعار منخفضة لكسب حصة سوقية",
        },
        premium: {
          label: "متميز",
          desc: "أسعار عالية للجودة العالية",
        },
        bundling: {
          label: "الحزم",
          desc: "بيع منتجات متعددة معاً",
        },
        subscription: {
          label: "الاشتراك",
          desc: "دفع دوري للخدمة",
        },
        cost_plus: {
          label: "التكلفة زائد",
          desc: "التكلفة + هامش ربح ثابت",
        },
        value_based: {
          label: "قائم على القيمة",
          desc: "السعر حسب القيمة المقدمة",
        },
        competitive: {
          label: "تنافسي",
          desc: "مطابقة أسعار المنافسين",
        },
        dynamic: {
          label: "ديناميكي",
          desc: "تغيير الأسعار حسب الطلب",
        },
        skimming: {
          label: "القشط",
          desc: "أسعار عالية ثم تخفيض تدريجي",
        },
      },
    },

    // Step 6: Strategic Goals
    step6StrategicGoals: {
      title: "الأهداف الاستراتيجية والتسعير",
      primaryTitle: "الاستراتيجيات الأساسية",
      secondaryTitle: "استراتيجيات مساندة",

      step6Strategic: {
        sectorAnalysis: {
          pros: "المزايا",
          cons: "العيوب",
        },
        breakdown: {
          title: "تفصيل المنتجات",
        },
      },

      // تحذيرات/ملاحظات عامة
      warnings: {
        mixedPricing: "تحذير: بعض المنتجات تستخدم استراتيجيات تسعير مختلفة؛ راجع الاتساق.",
        belowCost: "السعر النهائي أقل من التكلفة للوحدة — عدّل الهامش أو الاستراتيجية.",
        ltvLow: "نسبة LTV:CAC منخفضة؛ فكّر في تحسين الاحتفاظ أو خفض تكلفة الاستحواذ.",
      },

      // نصوص الجداول
      tables: {
        products: {
          header: {
            product: "المنتج",
            unitCost: "إجمالي تكلفة الوحدة",
            strategy: "الاستراتيجية",
            margin: "هامش %",
            competitorAvg: "متوسط المنافس",
            finalPrice: "السعر النهائي",
          },
          empty: "لم تتم إضافة منتجات بعد.",
        },
      },

      // الاستراتيجيات الأساسية
      primaryStrategies: {
        cost_plus: {
          title: "التسعير بالتكلفة+هامش",
          description: "إضافة هامش ربح ثابت إلى تكلفة الوحدة.",
          pros: ["سهل الحساب", "يضمن ربحًا", "مناسب للمبتدئين"],
          cons: ["قد يفوّت أرباحًا أعلى", "يتجاهل القيمة المدركة"],
        },
        competitive: {
          title: "التسعير التنافسي",
          description: "تسعير قريب من المنافسين.",
          pros: ["مقبول سوقيًا", "مخاطر أقل", "سهل التبرير"],
          cons: ["قد لا يعكس القيمة", "قد يسبّب حروب أسعار"],
        },
        value_based: {
          title: "التسعير المعتمد على القيمة",
          description: "تسعير وفق القيمة المدركة لدى العميل.",
          pros: ["هوامش أعلى", "يركّز على المنافع", "ولاء العملاء"],
          cons: ["بحث معقّد", "يتطلب فهمًا عميقًا"],
        },
        penetration: {
          title: "تسعير الاختراق",
          description: "أسعار منخفضة مبدئيًا لاكتساب حصة.",
          pros: ["دخول سريع", "اكتساب عملاء", "تعطيل منافسين"],
          cons: ["أرباح مبكرة أقل", "صعب رفع الأسعار لاحقًا"],
        },
      },

      // الاستراتيجيات المساندة
      secondaryStrategies: {
        psychological: {
          title: "التسعير النفسي",
          description: "استخدام نهايات .99 للتأثير على الإدراك.",
          pros: ["يزيد التحويل", "يبدو أقل تكلفة"],
          cons: ["قد يقلل قيمة الصورة"],
        },
        bundle: {
          title: "تسعير الحزم",
          description: "تجميع عناصر بخصم.",
          pros: ["يرفع قيمة الطلب", "يقلل المخزون"],
          cons: ["معقد في الإدارة"],
        },
        dynamic: {
          title: "التسعير الديناميكي",
          description: "تعديل وفق العرض والطلب.",
          pros: ["يعظّم الربح", "مرن"],
          cons: ["إعداد معقد", "قد يزعج العملاء"],
        },
        skimming: {
          title: "قشط السعر",
          description: "بدء بسعر مرتفع ثم خفضه لاحقًا.",
          pros: ["ربح مبكر مرتفع", "صورة فاخرة"],
          cons: ["شريحة صغيرة", "يجذب المنافسين"],
        },
      },
    },

    // Step 7: Testing Iteration
    step7TestingIteration: {
      title: "الاختبار والتحسين",
      testingMethods: "طرق الاختبار",
      addMethod: "إضافة طريقة",
      methodName: "اسم الطريقة",
      methodNamePlaceholder: "مثال: اختبار أ/ب للأسعار",
      status: "الحالة",
      statusPlanned: "مخطط",
      statusInProgress: "قيد التنفيذ",
      statusCompleted: "مكتمل",
      description: "الوصف",
      descriptionPlaceholder: "اوصف طريقة الاختبار...",
      results: "النتائج",
      resultsPlaceholder: "وثق النتائج...",
      remove: "إزالة",
      noMethods: "لم تتم إضافة طرق اختبار بعد",
      keyLearnings: "الدروس المستفادة",
      learningsPlaceholder: "ما الذي تعلمته من اختباراتك؟",
      nextSteps: "الخطوات التالية",
      nextStepsPlaceholder: "ما هي خطواتك التالية؟",
      summaryTitle: "ملخص الاختبار",
      summaryDescription: "الاختبار والتحسين المنتظم هما مفتاح العثور على استراتيجية التسعير المثلى.",
    },

    // Step 8: Final Outputs
    step8FinalOutputs: {
      title: "النتائج النهائية والتوصيات",
      subtitle: "ملخص شامل لتحليل التسعير والتوصيات",

      // Executive Dashboard
      executiveDashboard: {
        title: "التقرير التنفيذي النهائي",
        subtitle: "تحليل مالي شامل ونظرة عامة على أداء الشركة والمؤشرات الرئيسية",
      },

      // Company Info
      companyInfo: {
        companyName: "اسم الشركة",
        sector: "القطاع",
        customerType: "نوع العملاء",
        notSpecified: "غير محدد",
      },

      // Sector Labels
      sectorLabels: {
        ecommerce: "التجارة الإلكترونية",
        restaurants: "المطاعم",
        saas: "البرمجيات كخدمة",
        fashion: "الأزياء",
        services: "الخدمات",
        industries: "الصناعات",
        other: "أخرى",
      },

      // Customer Type Labels
      customerTypeLabels: {
        b2b: "شركات (B2B)",
        b2c: "أفراد (B2C)",
      },

      // Key Metrics
      keyMetrics: {
        title: "المؤشرات المالية الرئيسية",
        totalRevenue: "إجمالي الإيرادات",
        totalCosts: "إجمالي التكاليف",
        profitMargin: "هامش الربح",
        netProfit: "صافي الربح",
      },

      // Sector Benchmark
      sectorBenchmark: {
        title: "معايير القطاع",
        expectedMargin: "هامش الربح المتوقع",
        advice: "النصيحة",
      },

      // Current Performance
      currentPerformance: {
        title: "الأداء الحالي",
        yourMargin: "هامش الربح الخاص بك:",
        excellent: "أداء ممتاز! 🎉",
        good: "أداء جيد ✅",
        needsImprovement: "يحتاج تحسين ⚠️",
      },

      // Sector Benchmarks
      sectorBenchmarks: {
        ecommerce: {
          margin: "15-25%",
          advice: "ركز على تكاليف الشحن والتخزين",
        },
        restaurants: {
          margin: "3-9%",
          advice: "تحكم في تكاليف المواد الخام والعمالة",
        },
        saas: {
          margin: "70-85%",
          advice: "استثمر في الاحتفاظ بالعملاء",
        },
        fashion: {
          margin: "4-13%",
          advice: "أدر المخزون والموسمية",
        },
        services: {
          margin: "10-20%",
          advice: "ركز على قيمة الخدمة",
        },
        industries: {
          margin: "5-15%",
          advice: "حسن العمليات والكفاءة",
        },
        other: {
          margin: "10-20%",
          advice: "حلل المنافسين بعناية",
        },
      },

      // Product Pricing
      productPricing: {
        title: "تفصيل تسعير المنتجات",
        productLabel: "المنتج",
        strategy: "الاستراتيجية:",
        achievedMargin: "الهامش المحقق:",
        marketDifference: "الفرق عن السوق:",
        finalPrice: "السعر النهائي",
        expectedQuantity: "الكمية المتوقعة",
        totalRevenue: "إجمالي الإيرادات",
        totalCosts: "إجمالي التكاليف",
        profitMargin: "هامش الربح",
        marginPerformance: "أداء هامش الربح",
      },

      // Scenarios
      scenarios: {
        title: "سيناريوهات الكمية (نفس السعر)",
        scenario: "السيناريو",
        quantity: "الكمية",
        revenue: "الإيرادات",
        totalCost: "إجمالي التكلفة",
        totalProfit: "إجمالي الربح",
        profitMargin: "هامش الربح",
        breakEven: "التعادل",
        worst: "الأسوأ",
        expected: "المتوقع",
        best: "الأفضل",
        units: "وحدة",
        undefined: "غير محدد",
        fixedPriceNote: "سعر ثابت ({price}) - تغيير الكمية فقط",
      },

      // Runway Analysis
      runway: {
        title: "تحليل المدرج المالي",
        financialSurvival: "فترة البقاء المالي",
        months: "شهر",
        safe: "وضع آمن",
        needsMonitoring: "يحتاج مراقبة",
        critical: "وضع حرج",
        sustainable: "مستدام",
        profitableSustainable: "العمل مربح ومستدام",
        availableCapital: "رأس المال المتاح",
        monthlyBurnRate: "معدل الحرق الشهري",
        netCashFlow: "التدفق النقدي الصافي",
        availableCash: "النقد المتاح للعمليات",
        monthlyLoss: "كم تخسر شهرياً",
        profitableNoBurn: "العمل مربح - لا توجد خسائر",
        revenueMinusCosts: "الإيرادات - إجمالي التكاليف",
        calculationFormula: "صيغة الحساب",
        runwayFormula: "المدرج = رأس المال المتاح ÷ معدل الحرق الشهري",
        profitableBusiness: "عمل مربح:",
        revenueCoversAllCosts: "الإيرادات تغطي جميع التكاليف بالكامل (المدرج = ∞)",
        noBurn: "لا يوجد حرق",
      },

      // LTV & CAC Analysis
      ltvCac: {
        title: "تحليل قيمة العميل مدى الحياة (LTV) وتكلفة اكتساب العميل (CAC)",
        subtitle: "كم يجلب العميل من المال على المدى الطويل وكم يكلف جذبه",
        ltvTitle: "قيمة العميل مدى الحياة (LTV)",
        ltvDescription: "كم يجلب العميل من المال طوال علاقته معك",
        cacTitle: "تكلفة اكتساب العميل (CAC)",
        cacDescription: "كم تنفق لاكتساب عميل جديد",
        ratioTitle: "نسبة LTV/CAC",
        excellent: "ممتاز (≥3x)",
        acceptable: "مقبول (2-3x)",
        weak: "ضعيف (<2x)",
        undefined: "غير محدد",
        returnDescription: "كل جنيه ينفق على اكتساب العملاء يعود بـ {ratio} جنيه",
        enterCacToCalculate: "أدخل تكلفة اكتساب العميل لحساب النسبة",
        totalNewCustomers: "إجمالي العملاء الجدد شهرياً",
        allNewCustomers: "جميع العملاء الجدد من كل المنتجات",
        customerLifetime: "عمر العميل (بالشهور)",
        howLongCustomerStays: "كم يبقى العميل معك",
        totalMarketingCost: "إجمالي تكلفة التسويق",
        monthlyMarketingSpend: "كل ما تنفقه على التسويق شهرياً",
        months: "شهر",
        formulaExplanation: "شرح الصيغة",
        ltvFormula: {
          title: "LTV (قيمة العميل مدى الحياة):",
          formula: "= متوسط ربح العميل الشهري × عمر العميل بالشهور",
          calculatedFrom: "محسوب من بيانات المنتجات",
        },
        cacFormula: {
          title: "CAC (تكلفة اكتساب العميل):",
          formula: "= التكلفة التسويقية الشهرية ÷ العملاء الجدد شهرياً",
        },
        termsExplanation: "شرح المصطلحات بلغة بسيطة",
        ltvSimple: {
          title: "LTV (القيمة مدى الحياة):",
          explanation:
            "كم يجلب عميل واحد من المال من أول شراء حتى يتركك. لو العميل يشتري بـ100 جنيه شهرياً لمدة سنة، فـLTV = 1200 جنيه.",
        },
        cacSimple: {
          title: "CAC (تكلفة اكتساب العميل):",
          explanation:
            "كم تنفق للحصول على عميل جديد واحد. لو أنفقت 1000 جنيه على إعلانات وجبت 10 عملاء، فـCAC = 100 جنيه لكل عميل.",
        },
        ratioSimple: {
          title: "نسبة LTV/CAC:",
          explanation:
            "تقيس كم مرة يرد العميل ما أنفقته عليه. نسبة 3x تعني كل جنيه تنفقه على اكتساب العملاء يرد عليك 3 جنيه ربح.",
        },
        acceptableStandards: {
          title: "المعايير المقبولة:",
          explanation:
            "النسبة المثالية ≥3x. لو أقل من 2x، التسويق غالي جداً. لو أعلى من 5x، ممكن تزيد الإنفاق التسويقي.",
        },
      },

      // Additional Metrics
      additionalMetrics: {
        title: "المقاييس المالية الإضافية",
        totalContributionMargin: "إجمالي هامش المساهمة",
        revenueMinusVariable: "الإيرادات - التكاليف المتغيرة",
        breakEvenPoint: "نقطة التعادل",
        units: "وحدة",
        avgContributionMargin: "متوسط هامش المساهمة:",
        salesIncreaseNeeded: "زيادة المبيعات المطلوبة:",
        toReachBreakEven: "للوصول للتعادل",
        costRatios: "نسب التكاليف",
        variableCostRatio: "نسبة التكاليف المتغيرة",
        fixedCostRatio: "نسبة التكاليف الثابتة",
        ofTotalRevenue: "من إجمالي الإيرادات",
      },

      // Recommendations
      recommendations: {
        title: "التوصيات الاستراتيجية",
        suggestedAction: "الإجراء المقترح",
        balancedStrategy: "استراتيجية متوازنة!",
        strategyLooksBalanced: "استراتيجية التسعير تبدو متوازنة ومناسبة للسوق",

        // Recommendation types
        operationalLoss: "خسارة تشغيلية",
        operationalLossDesc: "شركتك تحقق خسائر تشغيلية. يجب مراجعة التكاليف والأسعار فوراً.",
        operationalLossAction: "قلل التكاليف الثابتة أو ارفع الأسعار",

        lowMargin: "هامش ربح منخفض",
        lowMarginDesc: "هامش الربح {margin}% أقل من المعدل المطلوب للقطاع ({min}%-{max}%)",
        lowMarginAction: "راجع استراتيجية التسعير أو قلل التكاليف",

        excellentMargin: "هامش ربح ممتاز",
        excellentMarginDesc: "هامش الربح {margin}% ممتاز ويفوق توقعات القطاع",
        excellentMarginAction: "حافظ على الاستراتيجية الحالية وفكر في التوسع",

        withinSectorMargin: "هامش ربح ضمن المعدل",
        withinSectorMarginDesc: "هامش الربح {margin}% ضمن المعدل المطلوب للقطاع ({min}%-{max}%)",
        withinSectorMarginAction: "استمر في المراقبة والتحسين التدريجي",

        insufficientContribution: "مساهمة غير كافية",
        insufficientContributionDesc: "فجوة قدرها {gap} شهرياً",
        insufficientContributionAction: "ارفع الأسعار أو قلل التكاليف أو زد الكميات",

        allocationDiscrepancy: "تضارب في التوزيع",
        allocationDiscrepancyDesc: "فرق قدره {sign}{delta} شهرياً مقارنة بالمعيار",
        allocationDiscrepancyAction: "راجع منهجية التوزيع ونسب المشاركة",

        priceBelowCost: "سعر أقل من التكلفة ({name})",
        priceBelowCostDesc: "السعر أقل من تكلفة الوحدة",
        priceBelowCostAction: "ارفع السعر إلى ≥ التكلفة أو قلل التكاليف",

        costPlusNotAchieved: "هامش التكلفة+ غير محقق ({name})",
        costPlusNotAchievedDesc: "المحقق {achieved}% < المستهدف {target}%",
        costPlusNotAchievedAction: "عدل السعر أو راجع التكلفة لتحقيق الهدف",

        missingCompetitorAnalysis: "تحليل المنافسين مفقود",
        missingCompetitorAnalysisDesc: "لا توجد بيانات أسعار المنافسين",
        missingCompetitorAnalysisAction: "أضف ≥ 3 منافسين لكل منتج",

        largePriceDeviation: "انحراف كبير عن السوق",
        largePriceDeviationDesc: "{count} منتجات تنحرف >20% عن متوسط المنافسين",
        largePriceDeviationAction: "تحقق من التمايز في القيمة أو عدل الاستراتيجية",

        breakEvenGap: "فجوة التعادل",
        breakEvenGapDesc: "{gap} وحدة إضافية مطلوبة للوصول للتعادل",
        breakEvenGapAction: "زد الكمية أو حسن هامش المساهمة",

        limitedRunway: "مدرج محدود",
        limitedRunwayDesc: "{months} شهر مدرج",
        limitedRunwayAction: "قلل معدل الحرق، حسن الهوامش، ناقش خيارات التمويل",

        sustainableOperation: "عملية مستدامة",
        sustainableOperationDesc: "الربحية الحالية تغطي الالتزامات",
        sustainableOperationAction: "استثمر الفائض بحكمة",

        poorProductPerformance: "أداء منتج ضعيف ({name})",
        poorProductPerformanceDesc: "الهامش {margin}% أقل من المعيار",
        poorProductPerformanceAction: "عدل التسعير/قلل التكاليف/أعد تموضع المنتج",

        starProduct: "منتج نجم ({name})",
        starProductDesc: "الهامش أعلى بكثير من المعيار",
        starProductAction: "زد التوفر/ادعم التسويق/اختبر مرونة السعر",

        restaurantsFocus: "تركيز المطاعم",
        restaurantsFocusDesc: "راقب هدر المواد الخام والعمالة وقس Food Cost% بدقة",
        restaurantsFocusAction: "اتفاقيات التحكم في الحصص والحزم",

        ecommerceFocus: "تركيز التجارة الإلكترونية",
        ecommerceFocusDesc: "تكاليف الشحن والإرجاع تؤثر مباشرة على الهامش",
        ecommerceFocusAction: "فاوض على الشحن، قلل الإرجاع، حسن التغليف",

        saasFocus: "تركيز البرمجيات كخدمة",
        saasFocusDesc: "نمو صحي من خلال الاحتفاظ وتحسين ARPU",
        saasFocusAction: "برامج الولاء/البيع المتقاطع/حسن التأهيل",

        fashionFocus: "تركيز الأزياء",
        fashionFocusDesc: "الموسمية والتحكم في المخزون يؤثران على الهامش",
        fashionFocusAction: "تخطيط الموسم والخصومات المحسوبة",

        industriesFocus: "تركيز الصناعات",
        industriesFocusDesc: "تحسين الكفاءة يقلل التكلفة لكل وحدة",
        industriesFocusAction: "كايزن/الإنتاج الرشيق ومراقبة الانحرافات",

        servicesFocus: "تركيز الخدمات",
        servicesFocusDesc: "بع القيمة وليس الساعات",
        servicesFocusAction: "حزم القيمة والمخرجات الواضحة",
      },

      // Next Steps
      nextSteps: {
        title: "الخطوات التالية والإجراءات المطلوبة",
        immediateActions: "الإجراءات الفورية",
        mediumTermPlans: "الخطط متوسطة المدى",
        applyCalculatedPrices: "تطبيق الأسعار المحسوبة على المنتجات",
        monitorCustomerReactions: "مراقبة ردود فعل العملاء على الأسعار الجديدة",
        trackActualSalesAndProfits: "تتبع المبيعات والأرباح الفعلية",
        regularPriceReview: "مراجعة دورية للأسعار (كل 3-6 أشهر)",
        analyzeCompetitorsAndAdjust: "تحليل أداء المنافسين وتعديل الاستراتيجية",
        developNewOffers: "تطوير عروض جديدة وحزم منتجات",
      },

      // Export & Share
      exportShare: {
        title: "تصدير ومشاركة التقرير",
        exportPdf: "تصدير PDF",
        exportExcel: "تصدير Excel",
        shareReport: "مشاركة التقرير",
        description: "يمكنك تصدير هذا التقرير ومشاركته مع فريقك أو المستثمرين",
      },

      // PDF Generation
      pdfGenerationError: "حدث خطأ أثناء إنشاء ملف PDF",
    },

    // Startup Branch (Main Navigation)
    startupBranch: {
      toolTitle: "أداة تسعير الشركات الناشئة",
      loadingText: "جاري التحميل...",
      stepProgress: "الخطوة {{currentStep}} من {{totalSteps}}",
      stepUnderDevelopment: "الخطوة {{currentStep}} قيد التطوير",
      contentComingSoon: "المحتوى قريباً",
      homeButton: "الرئيسية",
      previousButton: "السابق",
      nextButton: "التالي",
      calculateButton: "احسب الأسعار",
      finalReportTitle: "التقرير النهائي",
      finalReportSubtitle: "تحليل شامل لاستراتيجية التسعير والنتائج المالية",
      validation: {
        selectSector: "يرجى اختيار القطاع",
        selectCompanyStage: "يرجى اختيار مرحلة الشركة",
        addOneProduct: "يرجى إضافة منتج واحد على الأقل",
        productNameRequired: "اسم المنتج مطلوب",
        selectQuantityMethod: "يرجى اختيار طريقة تقدير الكمية",
        quantityGteZero: "الكمية يجب أن تكون أكبر من أو تساوي صفر",
        checkRange: "يرجى التحقق من نطاق الكمية (الحد الأدنى ≤ الأقصى)",
        checkCapacity: "يرجى التحقق من الطاقة ونسبة الاستغلال",
        checkMarket: "يرجى التحقق من حجم السوق ونسبة الحصة",
        historicalThreeMonths: "يرجى إدخال بيانات 3 أشهر سابقة",
        historicalGteZero: "البيانات التاريخية يجب أن تكون أكبر من أو تساوي صفر",
        runwayGteZero: "عدد الشهور يجب أن يكون أكبر من أو يساوي صفر",
        cashGteZero: "مبلغ الكاش يجب أن يكون أكبر من أو يساوي صفر",
        allocationSum100: "مجموع التوزيع يجب أن يساوي 100%",
        completeRequiredData: "يرجى إكمال البيانات المطلوبة",
      },
    },

    // PDF Export
    pdf: {
      marketPosition: {
        aboveMarket: "أعلى من السوق",
        belowMarket: "أقل من السوق",
        inMarket: "داخل السوق",
      },
      productCount: "عدد المنتجات",
      reportPeriod: "فترة التقرير",
      additionalIndicators: "مؤشرات إضافية",
      marginRating: {
        excellent: "متميز - هوامش عالية",
        good: "جيد - هوامش معقولة",
        needsImprovement: "يحتاج تحسين - هوامش منخفضة",
      },
      recommendations: {
        reviewCosts: "مراجعة هيكل التكاليف وتحسين الكفاءة التشغيلية",
        considerPriceIncrease: "دراسة إمكانية رفع الأسعار تدريجياً",
        monitorMarket: "مراقبة ردود فعل السوق على الأسعار الحالية",
        investDevelopment: "الاستثمار في التطوير والتحسين المستمر",
        regularReview: "مراجعة دورية للأسعار كل 3-6 أشهر",
        analyzeCompetitors: "تحليل أداء المنافسين بانتظام",
        dynamicStrategy: "تطوير استراتيجية تسعير ديناميكية",
      },
      contactCTA: "هل تريد تحسين أسعار منتجاتك؟ تواصل معنا اليوم عبر: kayanfinance.com/contact",
      pageOf: "صفحة {current} من {total}",
    },
  },

  en: {
    // Common elements
    common: {
      backHome: "Back to Home",
      previous: "Previous",
      next: "Next",
      calculate: "Calculate Prices",
      step: "Step",
      of: "of",
      currentIndicators: "Current Indicators",
      currency: "EGP",
      currencyPerMonth: "EGP/month",
      currencyPerUnit: "EGP",
      units: "units",
      unitsPerMonth: "units/month",
      days: "days",
      months: "months",
      percentage: "%",
      total: "Total",
      undefined: "Undefined",
      notApplicable: "N/A",
      example: "Example",
    },

    // Step 0: Basic Information
    step0BasicInfo: {
      title: "Basic Information - Startups",
      subtitle: "Enter your personal and startup company information",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email",
      emailPlaceholder: "example@email.com",
      phone: "Phone Number",
      phonePlaceholder: "+1 234 567 8900",
      country: "Country",
      selectCountry: "Select Country",
      companyInfo: "Startup Information",
      companyName: "Company Name",
      companyNamePlaceholder: "Enter your company name",
      foundedYear: "Founded Year",
      currency: "Currency",
      selectCurrency: "Select pricing currency",
      currencyNote: "This currency will be used for all calculations and reports",
      sectorTitle: "Company Sector",
      sectorDescription: "Select the sector your startup operates in",
      sectorPlaceholder: "Select Sector",
      customSectorPlaceholder: "Enter custom sector",
      expectedMarginLabel: "Expected Margin %",
      expectedMarginPlaceholder: "25",
      companyStageTitle: "Company Stage",
      companyStageDescription: "What is the current stage of your company?",
      mvpHint:
        "At this stage, we can calculate the break-even point, but revenue and profit forecasts will be uncertain.",
      sectorMetricsTitle: "Sector Metrics",
      marginLabel: "Margin",
      variableCostLabel: "Variable Cost",
      fixedCostLabel: "Fixed Cost",
      keyMetricLabel: "Key Metric",
      strategyLabel: "Strategy",
      adviceLabel: "Advice",
      countries: {
        EG: "Egypt",
        SA: "Saudi Arabia",
        AE: "United Arab Emirates",
        KW: "Kuwait",
        QA: "Qatar",
        BH: "Bahrain",
        OM: "Oman",
        JO: "Jordan",
        LB: "Lebanon",
        IQ: "Iraq",
        DZ: "Algeria",
        MA: "Morocco",
        TN: "Tunisia",
      },
      sectors: {
        ecommerce: "E-commerce",
        restaurants: "Restaurants",
        fashion: "Fashion",
        services: "Services",
        industries: "Industries",
        saas: "SaaS",
        other: "Other",
      },
      stages: {
        idea: {
          label: "Idea",
          desc: "You have an idea and plan to start",
        },
        mvp: {
          label: "MVP",
          desc: "You have a minimum viable product and testing the market",
        },
        growth: {
          label: "Growth",
          desc: "You're expanding your business and gaining customers",
        },
        scaleup: {
          label: "Scale-up",
          desc: "You're scaling on a large scale",
        },
      },
      sectorBenchmarks: {
        ecommerce: {
          margin: "15-25%",
          variableCost: "60-70%",
          fixedCost: "10-15%",
          keyMetric: "Conversion rate and order value",
          strategy: "Optimize user experience",
          advice: "Focus on shipping and storage costs",
        },
        restaurants: {
          margin: "3-9%",
          variableCost: "70-80%",
          fixedCost: "15-20%",
          keyMetric: "Food cost and table turnover",
          strategy: "Control raw material costs",
          advice: "Control raw material and labor costs",
        },
        saas: {
          margin: "70-85%",
          variableCost: "10-20%",
          fixedCost: "5-10%",
          keyMetric: "Customer retention rate",
          strategy: "Invest in product",
          advice: "Invest in customer retention",
        },
        fashion: {
          margin: "4-13%",
          variableCost: "50-60%",
          fixedCost: "30-40%",
          keyMetric: "Inventory turnover",
          strategy: "Efficient inventory management",
          advice: "Manage inventory and seasonality",
        },
        services: {
          margin: "10-20%",
          variableCost: "40-60%",
          fixedCost: "20-30%",
          keyMetric: "Time utilization rate",
          strategy: "Improve efficiency",
          advice: "Focus on service value",
        },
        industries: {
          margin: "5-15%",
          variableCost: "60-75%",
          fixedCost: "15-25%",
          keyMetric: "Production efficiency",
          strategy: "Process improvement",
          advice: "Improve operations and efficiency",
        },
        other: {
          margin: "10-20%",
          variableCost: "50-70%",
          fixedCost: "15-25%",
          keyMetric: "Contribution margin",
          strategy: "Market analysis",
          advice: "Analyze your competitors carefully",
        },
      },
    },

    // Step 1: Quantities
    step1Quantities: {
      title: "Define Products and Quantities",
      subtitle: "Define your products, services and expected quantities",
      productsTitle: "Products",
      addProductButton: "Add Product",
      noProducts: "No products added yet",
      noProductsDesc: 'Click "Add Product" to start',
      productLabel: "Product",
      pauseLabel: "Pause",
      productNameLabel: "Product Name",
      productNameHint: "Clear and distinctive product name",
      productTypeLabel: "Product Type",
      productTypeDesc: "Is this a core or add-on product?",
      productTypes: {
        core: "Core",
        addon: "Add-on",
      },
      descriptionLabel: "Product Description",
      descriptionPlaceholder: "Brief description of the product and its benefits",
      descriptionHint: "Description that helps understand the product value",
      preliminaryPriceLabel: "Preliminary Price",
      preliminaryPriceHint: "Initial estimated price (optional)",
      selectMethodLabel: "Choose quantity estimation method:",
      quantityMethods: {
        fixed: "Fixed Number",
        range: "Range (from - to)",
        market: "Market Based",
        historical: "Historical Sales",
        capacity: "Production Capacity",
        uncertain: "Uncertain",
      },
      quantityLabel: "Quantity",
      quantityHint: "Expected monthly quantity",
      monthlyQuantity: "Monthly Quantity",
      fixedQtyPlaceholder: "Enter fixed quantity",
      monthlyQuantityLabel: "Monthly Quantity",
      unitPerMonthSuffix: "units / month",
      rangeMinPlaceholder: "Minimum",
      rangeMaxPlaceholder: "Maximum",
      averageLabel: "Average",
      rangeLabel: "Range",
      unitsShort: "units",
      capacityMaxLabel: "Maximum Capacity",
      capacityMaxHint: "Maximum units that can be produced/delivered monthly",
      capacityUtilizationLabel: "Capacity Utilization %",
      capacityUtilizationHint: "What percentage of capacity is expected to be used",
      expectedQuantityLabel: "Expected Quantity",
      calculationLabel: "Calculation",
      marketSizeLabel: "Market Size",
      marketSizeHint: "Total market size in units monthly",
      sectorGuidance: "Sector-Specific Guidance",
      sectorNotes: {
        ecommerce:
          "For E-commerce: Focus on conversion rate analysis and customer acquisition cost. Quantities depend on traffic and conversion.",
        restaurants:
          "For Restaurants: Calculate capacity based on number of tables and operating hours. Consider seasonality in projections.",
        saas: "For SaaS: Focus on monthly growth rate and customer retention. Start with conservative estimates and rely on data.",
        fashion:
          "For Fashion: Consider seasonality and trends. Calculate inventory carefully and expect different demand cycles.",
        services:
          "For Services: Calculate capacity based on available working hours and staff. Consider time required for each service.",
        industries:
          "For Industries: Calculate production capacity based on equipment and available raw materials. Consider maintenance times.",
        other:
          "For Other Sectors: Study the market carefully and use similar data from comparable sectors. Start with conservative estimates.",
      },
      marketShareLabel: "Market Share %",
      marketShareHint: "What percentage of market you expect to capture",
      historicalM1: "Month 1",
      historicalM2: "Month 2",
      historicalM3: "Month 3",
      historicalAverageLabel: "Historical Average",
      uncertainMethod: {
        description:
          "When you're unsure about quantities, we'll help you estimate based on your business model and market research",
        hint: "This is normal for new businesses - we'll provide guidance based on your sector and goals",
      },
      quantityWarning: "Quantity lower than expected for sector (minimum: {min})",
      quantitySuggestion: "Try a quantity closer to {suggested}",
      sectorPlaceholders: {
        ecommerce: "Example: 100-500 orders monthly",
        restaurants: "Example: 50-200 orders daily",
        saas: "Example: 10-100 subscriptions monthly",
        fashion: "Example: 20-100 pieces monthly",
        services: "Example: 5-50 projects monthly",
        industries: "Example: 10-100 units monthly",
        other: "Example: 10-100 units monthly",
      },
      runway: {
        title: "Runway (Cash lifetime)",
        calculationMethod: "Calculation method",
        manual: "Manual",
        auto: "Automatic",
        runwayMonths: "Number of months",
        runwayMonthsPlaceholder: "Enter number of months",
        availableCash: "Available cash",
        cashPlaceholder: "Enter available amount",
        hint: "💡 Tip: Runway is the number of months you'll have cash before needing to raise more",
        calculationHint: "Runway will be calculated automatically based on costs and expected revenue",
        importance: "Very important for startups - determines when you need to raise new cash",
        hintShort: "Warning: Less than 6 months - need immediate cash raise",
        hintMedium: "Caution: Less than 12 months - plan cash raise soon",
        hintLong: "Excellent: More than 12 months - safe position",
      },
      productSummary: {
        title: "Products Summary",
        noProducts: "No products",
        productName: "Product Name",
        monthlyQuantity: "Monthly Quantity",
      },
      productStatusLabel: "Product Status",
      productStatuses: {
        active: "Active",
        paused: "Paused",
      },
    },

    // Step 2: Product Costs
    step2ProductCosts: {
      title: "Product and Service Costs",
      subtitle: "Define variable costs for each product",
      productCostsTitle: "Product Costs",
      addCostItemButton: "Add Cost Item",
      costItemLabel: "Cost Item",
      costItemPlaceholder: "Example: raw materials, labor, shipping",
      amountLabel: "Amount",
      amountPlaceholder: "0.00",
      totalVariableCostLabel: "Total Variable Cost",
      perUnitLabel: "per unit",
      noCostItems: "No cost items",
      addCostItemDesc: "Add variable cost items for this product",
      costItemTypes: {
        material: "Material",
        labor: "Labor",
        shipping: "Shipping",
        commission: "Commission",
        packaging: "Packaging",
        other: "Other",
      },
      monthlyFixedCostsDesc: "Monthly fixed costs that don't change with production volume",
      fixedCostCategories: {
        salaries: "Salaries",
        rent: "Rent",
        utilities: "Utilities",
        marketing: "Marketing",
        insurance: "Insurance",
        software: "Software",
        maintenance: "Maintenance",
        other_fixed: "Other Fixed",
      },
      customFixedCostsTitle: "Custom Fixed Costs",
      addFixedCostButton: "Add Fixed Cost",
      addFixedCostDesc: "Add any additional fixed costs specific to your business",
      productSpecificFixedCostsTitle: "Product-Specific Fixed Costs",
      noProductSpecificCosts: "No product-specific fixed costs",
      addCostButton: "Add Cost",
      costNameLabel: "Cost Name",
      costNamePlaceholder: "Cost Name",
      monthlyAmountLabel: "Monthly Amount",
      deleteButton: "Delete",
      totalMonthlyFixedLabel: "Total Monthly Fixed",
      monthlyBurnRateTitle: "Monthly Burn Rate",
      variableCostsLabel: "Variable Costs:",
      fixedCostsLabel: "Fixed Costs:",
      totalBurnRateLabel: "Total Burn Rate:",
      totalBurnRateDesc: "Total monthly cash outflow including all costs",
      includesAllFixedCosts: "Includes all fixed costs that don't change with production",
      sectorPlaceholders: {
        ecommerce: {
          material: "packaging materials, products for sale",
          labor: "customer service, packing",
          shipping: "shipping to customers",
          commission: "sales commission",
          packaging: "boxes, bags",
          other: "payment processing fees",
        },
        restaurants: {
          material: "food ingredients, beverages",
          labor: "chefs, service staff",
          shipping: "delivery orders",
          commission: "delivery commission",
          packaging: "food containers, bags",
          other: "gas, kitchen electricity",
        },
        saas: {
          material: "servers, licenses",
          labor: "developers, technical support",
          shipping: "not applicable",
          commission: "sales commission",
          packaging: "not applicable",
          other: "development tools",
        },
        fashion: {
          material: "fabrics, accessories",
          labor: "design, tailoring",
          shipping: "shipping to customers",
          commission: "sales commission",
          packaging: "bags, gift boxes",
          other: "product photography",
        },
        services: {
          material: "tools, consumables",
          labor: "service providers",
          shipping: "travel to client",
          commission: "broker commission",
          packaging: "not applicable",
          other: "liability insurance",
        },
        industries: {
          material: "raw materials, spare parts",
          labor: "production workers",
          shipping: "product transportation",
          commission: "distributor commission",
          packaging: "industrial packaging",
          other: "production energy",
        },
        other: {
          material: "basic materials",
          labor: "direct labor",
          shipping: "transport and shipping",
          commission: "commissions",
          packaging: "packaging",
          other: "other costs",
        },
      },
    },

    // Step 3: Company Allocation
    step3CompanyAllocation: {
      title: "Fixed Cost Allocation",
      subtitle: "Specify how to allocate fixed costs across products",
      totalFixedCosts: "Total Fixed Costs",
      allocationMethodLabel: "Select allocation method",
      allocationMethods: {
        equal: "Equal Distribution",
        units: "By Units Sold",
        cost: "By Variable Cost",
        custom: "Custom",
      },
      customAllocation: {
        distributed: "Distributed",
        remaining: "Remaining",
        distributeEqual: "Distribute Equally",
        distributeByVariableCost: "Distribute by Variable Cost",
        resetAll: "Reset All",
        incompleteDistributionWarning: "Incomplete distribution: {value}% remaining",
      },
      previewTitle: "Allocation Preview",
      tableHeaders: {
        product: "Product",
        quantity: "Quantity",
        variableCosts: "Variable Costs",
        fixedPercentage: "Fixed Percentage %",
        productSpecificFixed: "Product Specific Fixed",
        sharedFixed: "Shared Fixed",
        totalFixed: "Total Fixed",
        costPerUnit: "Cost/Unit",
        total: "Total",
      },
    },

    // Step 4: Detailed Costs
    step4DetailedCosts: {
      title: "Detailed Cost Analysis",
      tableHeaders: {
        product: "Product",
        unitVariable: "Variable per Unit",
        totalVariable: "Total Variable",
        productSpecificFixed: "Product Specific Fixed",
        sharedFixed: "Shared Fixed",
        totalFixed: "Total Fixed",
        fixedPerUnit: "Fixed per Unit",
        fullUnitCost: "Full Unit Cost",
        totalCosts: "Total Costs",
        totalRow: "Total",
      },
    },

    // Step 4: Pricing Competition
    step4PricingCompetition: {
      title: "Pricing & Competition Analysis",
      subtitle: "Analyze market competition and set optimal pricing strategies",
      competitorsCard: {
        title: "Competitor Analysis",
        desc: "Analyze pricing of your top two competitors",
        productTitleFallback: "Product {index}",
        competitorLabel: "Competitor {i}",
        priceHint: "Enter competitor price",
        pricePlaceholder: "0",
        priceRangeLabel: "Price Range",
        currencyLabel: "EGP",
      },
      priceSensitivityCard: {
        title: "Price Sensitivity Analysis",
        desc: "How sensitive are your customers to price changes?",
        options: {
          high: {
            title: "High Sensitivity",
            desc: "Customers are very sensitive to prices",
          },
          medium: {
            title: "Medium Sensitivity",
            desc: "Balanced consideration for prices",
          },
          low: {
            title: "Low Sensitivity",
            desc: "Price is less important than value",
          },
        },
        tooltipExample: {
          high: "Customers in {sector} usually compare prices carefully. {suggestion}",
          medium: "Customers in {sector} balance between price and value. {suggestion}",
          low: "Customers in {sector} focus more on quality than price. {suggestion}",
        },
      },
      differentiationCard: {
        title: "Differentiation Factors",
        desc: "What makes your product unique?",
        chips: [
          "High Quality",
          "Excellent Customer Service",
          "Fast Delivery",
          "Advanced Technology",
          "Competitive Pricing",
          "Unique Design",
          "Comprehensive Warranty",
          "Ease of Use",
        ],
        customLabel: "Custom Differentiation",
        customPlaceholder: "Describe your unique value proposition...",
      },
      currentGoalCard: {
        title: "Current Business Goal",
        desc: "What is your primary business goal now?",
        options: {
          quick_revenue: {
            title: "Quick Revenue",
            desc: "Generate revenue quickly",
          },
          market_entry: {
            title: "Market Entry",
            desc: "Competitive market entry",
          },
          premium_position: {
            title: "Premium Position",
            desc: "Establish a premium brand position",
          },
          sustainable_growth: {
            title: "Sustainable Growth",
            desc: "Focus on long-term growth",
          },
          test_market: {
            title: "Market Testing",
            desc: "Test market response",
          },
        },
      },
      ltvCacCard: {
        title: "LTV/CAC Analysis",
        infoTitle: "What is LTV/CAC?",
        infoDesc: "Customer Lifetime Value to Customer Acquisition Cost - a key metric for sustainable growth",
        productTitleFallback: "Product {index}",
        customerDataTitle: "Customer Data",
        monthlyNewCustomersLabel: "Monthly New Customers",
        monthlyNewCustomersHelp: "How many new customers do you acquire monthly?",
        churnRateLabel: "Customer Churn Rate (%)",
        churnRateHelp: "What percentage of customers stop buying monthly?",
        purchaseDataTitle: "Purchase Data",
        avgOrderValueLabel: "Average Order Value",
        avgOrderValueHelp: "Average amount per purchase",
        purchaseFrequencyLabel: "Purchase Frequency (monthly)",
        purchaseFrequencyHelp: "How often does a customer purchase?",
        grossMarginLabel: "Gross Margin (%)",
        marketingMonthlyLabel: "Monthly Marketing Spend",
        marketingMonthlyHelp: "How much do you spend on marketing for this product?",
        metrics: {
          cacShort: "CAC",
          cacLabel: "Customer Acquisition Cost",
          cacZeroHint: "Add marketing spend for calculation",
          ltvShort: "LTV",
          ltvLabel: "Customer Lifetime Value",
          ltvZeroHint: "Complete customer data for calculation",
          ratioLabel: "LTV:CAC Ratio",
          ratioQuestion: "How sustainable is your growth?",
        },
      },
      sectorGuidance: {
        ecommerce: {
          pricingSuggestion: "Focus on improving conversion rate",
        },
        restaurants: {
          pricingSuggestion: "Control raw material costs",
        },
        saas: {
          pricingSuggestion: "Invest in customer retention",
        },
        fashion: {
          pricingSuggestion: "Efficient inventory management",
        },
        services: {
          pricingSuggestion: "Focus on service value",
        },
        industries: {
          pricingSuggestion: "Improve production efficiency",
        },
        other: {
          pricingSuggestion: "Carefully analyze the market",
        },
      },
    },

    // Step 5: Financial Analysis
    step5FinancialAnalysis: {
      title: "Financial Analysis",
      subtitle: "Analyze your financial projections and break-even points",
      appliedStrategyLabel: "Applied Strategy",
      strategies: {
        cost_plus: "Cost Plus",
        competitive: "Competitive",
        value_based: "Value Based",
        penetration: "Penetration",
        custom: "Custom",
      },
      runwayCard: {
        title: "Runway",
        tooltip: "How long will your cash last at the current burn rate?",
        revenueLabel: "Monthly Revenue",
        netProfitLabel: "Net Profit",
        netLossLabel: "Net Loss",
        runwayRemainingLabel: "Remaining Runway",
        monthsShort: "months",
        undefinedLabel: "Undefined",
      },
      ltvCacCard: {
        title: "LTV/CAC Analysis",
        tooltipDesc: "Analyze the ratio of Customer Lifetime Value to Customer Acquisition Cost",
        inputs: {
          avgPurchaseValue: {
            label: "Average Purchase Value",
            help: "Average amount per purchase",
            placeholder: "200",
          },
          purchaseFrequencyPerYear: {
            label: "Purchase Frequency (annually)",
            help: "How often does a customer purchase?",
            placeholder: "4",
          },
          customerLifespanYears: {
            label: "Customer Lifespan (years)",
            help: "How long does a customer stay with you?",
            placeholder: "2",
          },
          monthlyMarketingSpend: {
            label: "Monthly Marketing Spend",
            help: "How much do you spend on marketing?",
            placeholder: "5000",
          },
          newCustomersPerMonth: {
            label: "Monthly New Customers",
            help: "How many new customers do you acquire monthly?",
            placeholder: "50",
          },
        },
        metricsBox: {
          cacTitle: "CAC",
          cacDesc: "Customer Acquisition Cost",
          ltvTitle: "LTV",
          ltvDesc: "Customer Lifetime Value",
          ratioTitle: "LTV:CAC Ratio",
          ratioStatus: {
            good: "Good",
            ok: "Okay",
            bad: "Needs Improvement",
          },
        },
      },
      breakEvenCard: {
        title: "Break-even Analysis",
        tooltip: "Analysis of units required to cover all costs",
        profitableLabel: "Profitable",
        needsImprovementLabel: "Needs Improvement",
        priceLabel: "Price",
        marginPerUnitLabel: "Margin/Unit",
        breakEvenLabel: "Break-even Point",
        unitPerMonthSuffix: "units/month",
        breakEvenUndefined: "Not Applicable",
        currentQtyLabel: "Current Quantity",
      },
    },

    // Step 5: Investor Perspective
    step5InvestorPerspective: {
      title: "Investor Perspective",
      subtitle: "Analyze your business from an investor's point of view",
      strategicGoal: {
        title: "Strategic Goal",
        options: {
          growth: {
            title: "Growth",
            description: "Focus on rapid growth",
          },
          sustainability: {
            title: "Sustainability",
            description: "Build a sustainable business",
          },
          exit: {
            title: "Exit",
            description: "Prepare for sale or acquisition",
          },
        },
      },
      selfAssessment: {
        title: "Self-Assessment",
        question: "How do you rate your value proposition?",
        options: {
          standard: {
            label: "Standard",
            desc: "A standard product in the market",
          },
          value_added: {
            label: "Value Added",
            desc: "A product with a clear value-added proposition",
          },
          game_changer: {
            label: "Game Changer",
            desc: "A revolutionary product that changes the market",
          },
        },
        premiumNotice: "Consider premium pricing for game-changing products",
      },
      discountsPolicy: {
        title: "Discounts Policy",
        offerDiscountsLabel: "Offer Discounts and Promotions",
        plannedTypesLabel: "Select Planned Discount Types:",
        types: {
          quantity: "Quantity Discount",
          loyalty: "Loyalty Discount",
          seasonal: "Seasonal Discount",
          free_trial: "Free Trial",
        },
      },
    },

    // Step 6: Pricing Strategies
    step6PricingStrategies: {
      title: "Pricing Strategies",
      subtitle: "Select optimal pricing strategies for your products",
      recommendationsTitle: "Recommendations",
      recommendedMarginForThis: "Recommended Margin for This:",
      productStrategyTitle: "Product Strategy Selection",
      recommendedBadge: "Recommended",
      unitCostLabel: "Unit Cost:",
      suggestedMargin: "Suggested Margin:",
      summaryTitle: "Strategy Summary",
      strategyOptions: {
        penetration: {
          label: "Penetration",
          desc: "Low prices to gain market share",
        },
        premium: {
          label: "Premium",
          desc: "High prices for high quality",
        },
        bundling: {
          label: "Bundling",
          desc: "Sell multiple products together",
        },
        subscription: {
          label: "Subscription",
          desc: "Recurring payment for the service",
        },
        cost_plus: {
          label: "Cost Plus",
          desc: "Cost + Fixed Profit Margin",
        },
        value_based: {
          label: "Value Based",
          desc: "Price based on value provided",
        },
        competitive: {
          label: "Competitive",
          desc: "Match competitor prices",
        },
        dynamic: {
          label: "Dynamic",
          desc: "Change prices based on demand",
        },
        skimming: {
          label: "Skimming",
          desc: "High prices initially then gradual reduction",
        },
      },
    },

    // Step 6: Strategic Goals
    step6StrategicGoals: {
      title: "Strategic Goals & Pricing",
      primaryTitle: "Primary Strategies",
      secondaryTitle: "Secondary Strategies",

      step6Strategic: {
        sectorAnalysis: {
          pros: "Pros",
          cons: "Cons",
        },
        breakdown: {
          title: "Product Breakdown",
        },
      },

      // تحذيرات/ملاحظات عامة
      warnings: {
        mixedPricing: "Warning: Some products use different pricing strategies; review consistency.",
        belowCost: "Final price is below total unit cost — adjust margin or strategy.",
        ltvLow: "LTV:CAC ratio is low; consider improving retention or lowering CAC.",
      },

      // نصوص الجداول
      tables: {
        products: {
          header: {
            product: "Product",
            unitCost: "Total Unit Cost",
            strategy: "Strategy",
            margin: "Margin %",
            competitorAvg: "Avg. Competitor",
            finalPrice: "Final Price",
          },
          empty: "No products added yet.",
        },
      },

      // الاستراتيجيات الأساسية
      primaryStrategies: {
        cost_plus: {
          title: "Cost Plus Pricing",
          description: "Add a fixed profit margin to unit cost.",
          pros: ["Easy to calculate", "Guarantees profit", "Good for beginners"],
          cons: ["May miss higher profits", "Ignores perceived value"],
        },
        competitive: {
          title: "Competitive Pricing",
          description: "Price close to competitors.",
          pros: ["Market-accepted", "Lower risk", "Simple to justify"],
          cons: ["May not reflect value", "Can trigger price wars"],
        },
        value_based: {
          title: "Value-Based Pricing",
          description: "Price by perceived customer value.",
          pros: ["Higher margins", "Focus on benefits", "Loyal customers"],
          cons: ["Complex to research", "Needs strong insight"],
        },
        penetration: {
          title: "Penetration Pricing",
          description: "Low initial prices to gain share.",
          pros: ["Fast entry", "Acquire customers", "Block competitors"],
          cons: ["Lower early profits", "Hard to raise later"],
        },
      },

      // الاستراتيجيات المساندة
      secondaryStrategies: {
        psychological: {
          title: "Psychological Pricing",
          description: "Use .99 endings to influence perception.",
          pros: ["Boosts conversion", "Feels cheaper"],
          cons: ["May cheapen image"],
        },
        bundle: {
          title: "Bundle Pricing",
          description: "Group items at a discount.",
          pros: ["Higher order value", "Moves inventory"],
          cons: ["Complex to manage"],
        },
        dynamic: {
          title: "Dynamic Pricing",
          description: "Adjust by demand & supply.",
          pros: ["Maximizes profit", "Flexible"],
          cons: ["Complex setup", "May annoy users"],
        },
        skimming: {
          title: "Price Skimming",
          description: "High initial prices then gradual reduction.",
          pros: ["High early profits", "Targets early adopters"],
          cons: ["Attracts competitors", "Limited customer base"],
        },
      },
    },

    step7TestingIteration: {
      title: "Testing & Iteration",
      testingMethods: "Testing Methods",
      addMethod: "Add Method",
      methodName: "Method Name",
      methodNamePlaceholder: "e.g., A/B Price Test",
      status: "Status",
      statusPlanned: "Planned",
      statusInProgress: "In Progress",
      statusCompleted: "Completed",
      description: "Description",
      descriptionPlaceholder: "Describe the testing method...",
      results: "Results",
      resultsPlaceholder: "Document the results...",
      remove: "Remove",
      noMethods: "No testing methods added yet",
      keyLearnings: "Key Learnings",
      learningsPlaceholder: "What have you learned from your tests?",
      nextSteps: "Next Steps",
      nextStepsPlaceholder: "What are your next steps?",
      summaryTitle: "Testing Summary",
      summaryDescription: "Regular testing and iteration are key to finding the optimal pricing strategy.",
    },

    // Step 8: Final Outputs
    step8FinalOutputs: {
      title: "Final Results and Recommendations",
      subtitle: "Comprehensive summary of pricing analysis and recommendations",
      additionalMetrics: {
        title: "📈 Additional Financial Metrics",
      },
      priceSensitivityAnalysis: {
        title: "Price Sensitivity Analysis",
        description: "How sensitive are your customers to price changes?",
        options: {
          high: {
            title: "High Sensitivity",
            description: "Customers are very sensitive to prices",
          },
          medium: {
            title: "Medium Sensitivity",
            description: "Balanced consideration for prices",
          },
          low: {
            title: "Low Sensitivity",
            description: "Price is less important than value",
          },
        },
      },
      downloadPdfButton: "Download PDF Report",
      pdfGenerationError: "Error occurred while generating PDF file",
      sectorRecommendations: {
        ecommerce: "Focus on shipping and storage costs",
        restaurants: "Control raw material and labor costs",
        saas: "Invest in customer retention",
        fashion: "Manage inventory and seasonality",
        services: "Focus on service value",
        industries: "Improve operations and efficiency",
        other: "Carefully analyze your competitors",
      },
      burnRateStatus: {
        noBurn: "No Burn",
        safePosition: "Safe Position",
        criticalPosition: "Critical Position",
      },
      recommendations: {
        operationalLoss: "Operational Loss",
        operationalLossDesc: "Costs are higher than revenue",
        operationalLossAction: "Adjust prices and costs immediately and increase sales",
        lowMargin: "Low Margin",
        lowMarginDesc: "Margin {margin}% is lower than ({min}–{max}%)",
        lowMarginAction: "Reduce costs, adjust pricing, improve mix, and increase quantities",
        excellentMargin: "Excellent Margin",
        excellentMarginDesc: "Margin {margin}% is higher than ({min}–{max}%)",
        excellentMarginAction: "Consider expansion or competitive price reduction to increase market share",
        withinSectorMargin: "Within Sector Margin",
        withinSectorMarginDesc: "{margin}% within range ({min}–{max}%)",
        withinSectorMarginAction: "Maintain performance and gradually improve efficiency",
        insufficientContribution: "Insufficient Contribution",
        insufficientContributionDesc: "Gap of {gap} monthly",
        insufficientContributionAction: "Increase prices or reduce costs or increase quantities/improve mix",
        allocationDiscrepancy: "Allocation Discrepancy",
        allocationDiscrepancyDesc: "Difference of {sign}{delta} monthly compared to benchmark",
        allocationDiscrepancyAction: "Review allocation methodology and participation ratios",
        priceBelowCost: "Price Below Cost ({name})",
        priceBelowCostDesc: "Price is lower than unit cost",
        priceBelowCostAction: "Increase price to ≥ cost or reduce costs or improve value",
        costPlusNotAchieved: "Cost+ Margin Not Achieved ({name})",
        costPlusNotAchievedDesc: "Achieved {achieved}% < Target {target}%",
        costPlusNotAchievedAction: "Adjust price or review cost to meet target",
        missingCompetitorAnalysis: "Missing Competitor Analysis",
        missingCompetitorAnalysisDesc: "No competitor price data",
        missingCompetitorAnalysisAction: "Add ≥ 3 competitors per product",
        largePriceDeviation: "Large Price Deviation from Market",
        largePriceDeviationDesc: "{count} products deviate >20% from competitors' average",
        largePriceDeviationAction: "Verify value differentiation or adjust strategy",
        breakEvenGap: "Break-even Gap",
        breakEvenGapDesc: "Additional {gap} units required to reach break-even",
        breakEvenGapAction: "Increase quantity or improve contribution margin",
        limitedRunway: "Limited Runway",
        limitedRunwayDesc: "{months} months runway",
        limitedRunwayAction: "Reduce burn rate, improve margins, discuss financing options",
        sustainableOperation: "Sustainable Operation",
        sustainableOperationDesc: "Current profitability covers commitments",
        sustainableOperationAction: "Invest surplus wisely",
        poorProductPerformance: "Poor Product Performance ({name})",
        poorProductPerformanceDesc: "Margin {margin}% is lower than benchmark",
        poorProductPerformanceAction: "Adjust pricing/reduce costs/reposition product",
        starProduct: "Star Product ({name})",
        starProductDesc: "Margin significantly higher than benchmark",
        starProductAction: "Increase availability/support marketing/test price flexibility",
        restaurantsFocus: "Restaurants Focus",
        restaurantsFocusDesc: "Monitor raw material and labor waste and measure Food Cost% accurately",
        restaurantsFocusAction: "Portion Control agreements and bundles",
        ecommerceFocus: "E-commerce Focus",
        ecommerceFocusDesc: "Shipping and return costs directly impact margin",
        ecommerceFocusAction: "Negotiate shipping, reduce returns, improve packaging",
        saasFocus: "SaaS Focus",
        saasFocusDesc: "Healthy growth through Retention and improving ARPU",
        saasFocusAction: "Loyalty programs/Upsell/improve Onboarding",
        fashionFocus: "Fashion Focus",
        fashionFocusDesc: "Seasonality and inventory control margin",
        fashionFocusAction: "Season planning and calculated discounts",
        industriesFocus: "Industries Focus",
        industriesFocusDesc: "Improving efficiency reduces cost per unit",
        industriesFocusAction: "Kaizen/Lean and monitor deviations",
        servicesFocus: "Services Focus",
        servicesFocusDesc: "Sell value not hours",
        servicesFocusAction: "Value bundles and clear outputs",
      },
    },

    // Startup Branch (Main Navigation)
    startupBranch: {
      toolTitle: "Startup Pricing Tool",
      loadingText: "Loading...",
      stepProgress: "Step {{currentStep}} of {{totalSteps}}",
      stepUnderDevelopment: "Step {{currentStep}} is under development",
      contentComingSoon: "Content coming soon",
      homeButton: "Home",
      previousButton: "Previous",
      nextButton: "Next",
      calculateButton: "Calculate Prices",
      finalReportTitle: "Final Report",
      finalReportSubtitle: "Comprehensive analysis of pricing strategy and financial results",
      validation: {
        selectSector: "Please select a sector",
        selectCompanyStage: "Please select company stage",
        addOneProduct: "Please add at least one product",
        productNameRequired: "Product name is required",
        selectQuantityMethod: "Please select quantity estimation method",
        quantityGteZero: "Quantity must be greater than or equal to zero",
        checkRange: "Please check quantity range (min ≤ max)",
        checkCapacity: "Please check capacity and utilization rate",
        checkMarket: "Please check market size and share percentage",
        historicalThreeMonths: "Please enter 3 months of historical data",
        historicalGteZero: "Historical data must be greater than or equal to zero",
        runwayGteZero: "Number of months must be greater than or equal to zero",
        cashGteZero: "Cash amount must be greater than or equal to zero",
        allocationSum100: "Allocation sum must equal 100%",
        completeRequiredData: "Please complete required data",
      },
    },

    // PDF Export
    pdf: {
      marketPosition: {
        aboveMarket: "Above Market",
        belowMarket: "Below Market",
        inMarket: "In Market",
      },
      productCount: "Product Count",
      reportPeriod: "Report Period",
      additionalIndicators: "Additional Indicators",
      marginRating: {
        excellent: "Excellent - High Margins",
        good: "Good - Reasonable Margins",
        needsImprovement: "Needs Improvement - Low Margins",
      },
      recommendations: {
        reviewCosts: "Review cost structure and improve operational efficiency",
        considerPriceIncrease: "Consider gradual price increase",
        monitorMarket: "Monitor market response to current prices",
        investDevelopment: "Invest in continuous development and improvement",
        regularReview: "Regularly review prices every 3-6 months",
        analyzeCompetitors: "Regularly analyze competitor performance",
        dynamicStrategy: "Develop a dynamic pricing strategy",
      },
      contactCTA: "Want to improve your product prices? Contact us today via: kayanfinance.com/contact",
      pageOf: "Page {current} of {total}",
    },
  },
} as const

// Simple translation function matching SME approach
export function t(language: StartupLang, key: string): string {
  const keys = key.split(".")
  let value: any = startupTranslations[language]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Return key if translation not found
      return key
    }
  }

  return typeof value === "string" ? value : key
}

// Template function for interpolation
export function tF(language: StartupLang, key: string, replacements: Record<string, string | number> = {}): string {
  let result = t(language, key)

  // Replace placeholders like {key} with values
  Object.entries(replacements).forEach(([placeholder, value]) => {
    result = result.replace(new RegExp(`\\{${placeholder}\\}`, "g"), String(value))
  })

  return result
}

export const startupT = t
export const startupTF = tF
