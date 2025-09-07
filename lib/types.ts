export interface PersonalInfo {
  name: string
  email: string
  phone: string
  country: string
  city: string
}

export interface CompanyInfo {
  companyName: string
  companySize: "startup" | "sme" | "enterprise" | ""
  foundedYear: number | null
}

export interface Product {
  id: string
  name: string
  desc: string
  sku: string
  qty: number
  periodDays: number
  quantity?: {
    type: "fixed" | "range" | "historical"
    value?: number
    min?: number
    max?: number
    historical?: number[]
  }
  fixedCosts?: FixedCost[]
  allocatedFixedCost?: number
  fixedCostPerUnit?: number
  competitors?: {
    hasData: boolean
    min?: number
    max?: number
    currency?: string
    source?: string
    collectedAt?: string
    notes?: string
  }
}

export interface VariableCost {
  item: string
  costPerUnit: number
}

export interface Waste {
  mode: "none" | "global" | "perProduct"
  valueGlobal: number
  valuePerProduct: Record<string, number>
}

export interface FixedCost {
  id?: string
  item: string
  monthlyAmount: number
  category?: string
  periodMonths?: number
}

export interface Asset {
  id: string
  name: string
  value: number
  lifeYears: number
  method: "straight" | "units" | "declining" | string
  unitsTotal: number
  decliningRate: number
}

export interface RnD {
  enabled: boolean
  amount: number
  periodDays: number
}

export interface Allocation {
  modeBasic: "equal" | "units" | "revenue" | "custom"
  customShares: Record<string, number>
  matrix: Array<{
    fixedCostId: string
    shares: Record<string, number>
  }>
}

export interface CostAllocation {
  method: "equal" | "volume" | "revenue" | "manual"
  manualRatios?: Record<string, number>
  applied?: boolean
  allocation?: Record<string, number>
  reason?: string
}

export interface Depreciation {
  mode: "none" | "simple"
  assetValue?: number
  usefulLife?: number
  method?: "straight" | "declining"
}

export interface Targets {
  type?: "basic" | "advanced"
  basic: {
    margin: number
    roi?: number
  }
  advanced: Record<
    string,
    {
      mode: "margin" | "profit" | "targetPrice"
      value: number
    }
  >
  perProduct?: Record<string, {
    margin: number
    roi: number
    [key: string]: any
  }>
}

export type CustomerPriority =
  | "price"
  | "quality"
  | "speed"
  | "brand"
  | "aftersales"
  | "paymentFlex"
  | "availability"
  | "customization"
  | "sustainability"

export interface CustomerFocus {
  ranked: CustomerPriority[] // Top 3 priorities in order
  weights: Partial<Record<CustomerPriority, number>> // Weights totaling 100 (only for selected priorities)
  sectorPresetUsed: boolean // Whether sector preset was used
}

export interface PricingData {
  userLevel: "basic" | "advanced"
  productMode: "single" | "multi"
  currency: string
  sector: "ecommerce" | "restaurants" | "clothing" | "services" | "industries" | "tech" | "other"
  personalInfo: PersonalInfo
  companyInfo: CompanyInfo
  products: Product[]
  variableCosts: Record<string, VariableCost[]>
  waste: Waste
  fixedCosts: FixedCost[]
  assets: Asset[]
  rnd: RnD
  allocation: Allocation
  costAllocation?: CostAllocation
  depreciation?: Depreciation
  rdBudget?: number
  reportPeriodDays: number
  targets: Targets
  strategies: {
    primary: string
    alternatives: string[]
    finalPrices?: Record<string, { price: number }>
    appliedAt?: string
  }
  // Additional fields for startup branch
  foundedYear?: number
  projectName?: string
  companyName?: string
  // Additional fields for customer type, product nature, competition
  customerType: {
    type: "b2c" | "b2b" | "wholesale" | "mixed"
    brandStrength?: "weak" | "medium" | "strong"
    priceSensitivity?: "low" | "medium" | "high"
    paymentTerms?: "cash" | "credit"
    collectionDays?: number
    mixRatios?: {
      b2c: number
      b2b: number
      wholesale: number
    }
    customerFocus?: CustomerFocus
  }
  productNature: {
    type: "physical" | "service"
    consumption: "once" | "subscription"
    subscriptionPeriod?: "weekly" | "monthly" | "quarterly"
    seasonality: "none" | "seasonal"
    peakSeason?: string
    peakPercentage?: number
    differentiation: "standard" | "premium" | "exclusive"
  }
  competition: {
    hasDirectCompetitors: boolean
    priceRange?: {
      min: number
      max: number
      avg: number
    }
    valueVsMarket: "lower" | "similar" | "higher"
    competitorCount: "few" | "medium" | "many"
  }
  sectorGuidanceEnabled: boolean
  language: "ar" | "en"

  // حقل تحديد المسار
  userType?: "startup" | "sme" | "freelancer"

  // حقول مسار Freelancer - Inputs
  fl_pricingModel?: "hourly" | "project" | "value"
  fl_monthlyTargetIncome?: number
  fl_monthlyOverheads?: number
  fl_taxRatePct?: number
  fl_safetyMarginPct?: number
  fl_billableHoursPerMonth?: number
  fl_projectHoursMin?: number
  fl_projectHoursLikely?: number
  fl_projectHoursMax?: number
  fl_directCosts?: number
  fl_riskPremiumPct?: number
  fl_urgencyFeePct?: number
  fl_complexityFeePct?: number
  fl_valueImpactAmount?: number
  fl_valueCapturePct?: number
  fl_packagesMode?: "single" | "three"
  fl_experienceLevel?: "beginner" | "intermediate" | "junior" | "mid" | "senior" | "expert"
  fl_specialization?: "general" | "technical" | "specialized" | "frontend" | "backend" | "fullstack" | "mobile" | "devops" | "design" | "marketing"
  fl_location?: "local" | "remote" | "hybrid" | string
  fl_reputation?: "new" | "established" | "expert" | string
  fl_speedFactor?: "normal" | "urgent" | "rush"
  fl_seasonFactor?: "normal" | "busy" | "peak"
  fl_clientSize?: "startup" | "sme" | "enterprise" | string
  fl_clientRegion?: "local" | "regional" | "global" | string
  fl_riskFactor?: "low" | "medium" | "high" | string
  fl_paymentTerms?: "immediate" | "net30" | "net60" | string
  fl_clientROI?: number
  fl_valuePercentage?: number

  // مسار Freelancer - Outputs (Derived)
  fl_hourlyFloor?: number
  fl_hourlySuggested?: number
  fl_projectFloor?: number
  fl_projectSuggested?: number
  fl_packages?: { basic?: number; standard?: number; premium?: number }

  // حقول مسار Startup - الأساسيات الأربعة
  st_fundamentals?: {
    // 1. التكاليف (Costs)
    costs: {
      variable: {
        // متغيرة
        materials?: number
        shipping?: number
        commissions?: number
        paymentFees?: number
      }
      fixed: {
        // ثابتة
        rent?: number
        salaries?: number
        marketing?: number
        depreciation?: number
        insurance?: number
        utilities?: number
      }
      hidden: {
        // مخفية
        returns?: number
        waste?: number
        repairs?: number
        maintenance?: number
        badDebt?: number
      }
    }
    // 2. السوق والمنافسة (Market & Competition)
    market: {
      avgMarketPrice?: number
      positioning: "economical" | "mid" | "premium"
      elasticity: "low" | "medium" | "high" // مرونة الطلب
      competitorAnalysis?: {
        directCompetitors: number
        priceRange: { min: number; max: number }
        marketShare?: number
      }
    }
    // 3. العميل المستهدف (Customer)
    customer: {
      segment: "b2c" | "b2b" | "mixed"
      priceSensitivity: "low" | "medium" | "high"
      adoptionStage: "early" | "mainstream" | "late"
      paymentBehavior: "immediate" | "credit" | "subscription"
    }
    // 4. مرحلة الشركة (Stage)
    stage: {
      current: "idea" | "mvp" | "growth" | "scaling"
      fundingStage: "bootstrap" | "seed" | "seriesA" | "seriesB+"
      priorityGoal: "traction" | "revenue" | "profit" | "growth"
    }
  }

  // العوامل الإضافية المؤثرة
  st_additionalFactors?: {
    // الضرائب والقوانين
    legal: {
      vatRate?: number
      salesTaxRate?: number
      customsDuty?: number
      licensingCosts?: number
    }
    // طرق الدفع
    payment: {
      onlinePaymentFees?: number // 2-5%
      creditTermsDays?: number
      earlyPaymentDiscount?: number
      collectionRisk?: number
    }
    // الخصومات والعروض
    discounts: {
      introductoryDiscount?: number
      volumeDiscounts?: { threshold: number; discount: number }[]
      loyaltyProgram?: boolean
      seasonalDiscounts?: number
    }
    // القيمة المدركة والبراند
    brand: {
      brandStrength: "weak" | "medium" | "strong"
      psychologicalPricing?: boolean // 99.99 pricing
      anchorPricing?: number
      premiumPositioning?: boolean
    }
    // قنوات التوزيع
    channels: {
      direct?: { percentage: number; margin: number }
      retail?: { percentage: number; margin: number }
      distributors?: { percentage: number; margin: number }
      online?: { percentage: number; costs: number }
    }
    // العوامل الموسمية
    seasonality: {
      hasSeason: boolean
      peakMonths?: string[]
      peakMultiplier?: number
      lowSeasonStrategy?: "discount" | "maintain" | "premium"
    }
    // الموردين وسلسلة التوريد
    supply: {
      supplierPower: "low" | "medium" | "high"
      importDependency?: number // percentage
      currencyRisk?: boolean
      supplyStability: "stable" | "volatile"
    }
    // إدارة النقدية
    cashFlow: {
      cashConversionCycle?: number // days
      workingCapitalNeeds?: number
      seasonalCashNeeds?: number
    }
    // تكاليف ما بعد البيع
    afterSales: {
      warrantyPeriod?: number // months
      supportCosts?: number
      maintenanceCosts?: number
      returnRate?: number
    }
    // المخاطر
    risks: {
      regulatoryRisk: "low" | "medium" | "high"
      marketVolatility: "low" | "medium" | "high"
      demandRisk: "low" | "medium" | "high"
      competitionRisk: "low" | "medium" | "high"
    }
    // التوسع الجغرافي
    geography: {
      targetMarkets?: string[]
      localizedPricing?: boolean
      purchasingPowerAdjustment?: Record<string, number>
    }
  }

  // المؤشرات الاستثمارية
  st_investmentMetrics?: {
    // Customer Acquisition Cost
    cac?: number
    cacByChannel?: Record<string, number>
    // Customer Lifetime Value
    ltv?: number
    ltvCalculationMethod?: "simple" | "cohort" | "predictive"
    // Unit Economics
    unitEconomics?: {
      contributionMargin?: number
      contributionMarginPercent?: number
      paybackPeriod?: number
    }
    // Runway & Burn Rate
    financials?: {
      monthlyBurnRate?: number
      currentRunway?: number // months
      breakEvenPoint?: number // units or revenue
      cashPosition?: number
    }
    // Investor Metrics
    investor?: {
      revenueMultiple?: number
      growthRate?: number
      marketSize?: number
      addressableMarket?: number
    }
  }

  // تحليل القطاعات بالتفصيل
  st_sectorSpecific?: {
    ecommerce?: {
      averageOrderValue?: number
      conversionRate?: number
      shippingStrategy: "free" | "paid" | "threshold"
      returnRate?: number
      inventoryTurnover?: number
    }
    food?: {
      foodCostRatio?: number // 25-35%
      laborCostRatio?: number
      perishabilityFactor?: number
      deliveryModel?: "dine-in" | "delivery" | "both"
    }
    fashion?: {
      seasonalCollections?: number
      markupMultiplier?: number // 2x-4x
      inventoryRisk?: number
      brandPremium?: number
    }
    services?: {
      hourlyRate?: number
      utilizationRate?: number
      projectBasedPricing?: boolean
      retainerModel?: boolean
    }
    manufacturing?: {
      economiesOfScale?: boolean
      minimumOrderQuantity?: number
      productionCapacity?: number
      qualityCosts?: number
    }
    saas?: {
      subscriptionModel: "monthly" | "annual" | "usage"
      freemiumConversion?: number
      churnRate?: number
      expansionRevenue?: number
      grossMargin?: number // 70-90%
    }
    edtech?: {
      courseBasedPricing?: boolean
      certificationPremium?: number
      corporateDiscount?: number
      studentSegmentation?: boolean
    }
    healthtech?: {
      regulatoryCompliance?: number
      dataSecurityCosts?: number
      insuranceReimbursement?: boolean
      subscriptionVsUsage?: "subscription" | "usage" | "hybrid"
    }
    fintech?: {
      transactionFees?: number
      complianceCosts?: number
      trustFactorPremium?: number
      regulatoryCapital?: number
    }
  }

  // أدوات وتقنيات التسعير
  st_pricingTools?: {
    strategy: "cost-plus" | "value-based" | "penetration" | "premium" | "dynamic" | "freemium"
    testingApproach?: {
      abTesting?: boolean
      priceElasticity?: number
      demandCurve?: { price: number; demand: number }[]
    }
    dynamicPricing?: {
      enabled: boolean
      factors?: ("demand" | "time" | "inventory" | "competition")[]
      algorithm?: "rule-based" | "ml-based"
    }
  }

  // حقول مسار Startup - Inputs (الحقول الأساسية الموجودة)
  st_goal?: "growth" | "profit"
  st_productType?: "saas" | "ecom" | "marketplace"
  st_positioning?: "economic" | "mid" | "premium"
  st_competitorMin?: number
  st_competitorMax?: number
  st_candidatePrices?: number[]
  st_vcu?: number
  st_fcMonthly?: number
  st_cac?: number
  // SaaS فقط
  st_arpu?: number
  st_churnMonthlyPct?: number
  st_grossMarginPct?: number
  // E-com فقط (اختياري للتقارير)
  st_avgBasket?: number
  st_shippingFees?: number
  // Marketplace فقط (اختياري)
  st_takeRatePct?: number

  // مسار Startup - Outputs (Derived)
  st_bestAnchorPrice?: number
  st_unitContribution?: number
  st_breakEvenUnits?: number
  st_ltv?: number
  st_ltvToCac?: number
  st_paybackMonths?: number
  st_plans?: { starter?: number; growth?: number; scale?: number }

  // تحليل السيناريوهات
  st_enhancedOutputs?: {
    scenarios?: {
      conservative: { price: number; volume: number; revenue: number; profit: number }
      realistic: { price: number; volume: number; revenue: number; profit: number }
      optimistic: { price: number; volume: number; revenue: number; profit: number }
    }
    sensitivity?: {
      priceElasticity: number
      volumeImpact: { priceChange: number; volumeChange: number }[]
      profitImpact: { priceChange: number; profitChange: number }[]
    }
    recommendations?: {
      primaryStrategy: string
      alternativeStrategies: string[]
      riskMitigation: string[]
      nextSteps: string[]
    }
    kpis?: {
      grossMargin: number
      contributionMargin: number
      operatingMargin: number
      netMargin: number
      roiProjection: number
      paybackPeriod: number
    }
  }
}

export const initialData: PricingData = {
  userLevel: "basic",
  productMode: "single",
  currency: "EGP",
  sector: "ecommerce",
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
  },
  companyInfo: {
    companyName: "",
    companySize: "",
    foundedYear: null,
  },
  products: [],
  variableCosts: {},
  waste: {
    mode: "none",
    valueGlobal: 0,
    valuePerProduct: {},
  },
  fixedCosts: [],
  assets: [],
  rnd: {
    enabled: false,
    amount: 0,
    periodDays: 0,
  },
  allocation: {
    modeBasic: "equal",
    customShares: {},
    matrix: [],
  },
  costAllocation: {
    method: "equal",
    manualRatios: {},
  },
  depreciation: {
    mode: "none",
  },
  rdBudget: 0,
  reportPeriodDays: 30,
  targets: {
    basic: {
      margin: 25,
    },
    advanced: {},
  },
  strategies: {
    primary: "",
    alternatives: [],
  },
  customerType: {
    type: "b2c",
  },
  productNature: {
    type: "physical",
    consumption: "once",
    seasonality: "none",
    differentiation: "standard",
  },
  competition: {
    hasDirectCompetitors: false,
    valueVsMarket: "similar",
    competitorCount: "medium",
  },
  sectorGuidanceEnabled: true,
  language: "ar",

  userType: "startup", // القيمة الافتراضية
}
