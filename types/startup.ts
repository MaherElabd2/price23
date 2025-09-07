// types/startup.ts

// --- Cost & Financial Types ---

export type CostItemType = 'material' | 'labor' | 'shipping' | 'commission' | 'packaging' | 'other';

export interface CostItem {
  id: string;
  name: string;
  amount?: number;
  type?: CostItemType;
}

export interface FixedCost extends CostItem {
  category?: string;
  percentage?: number;
  // Optional monthly amount used by some UIs
  monthlyAmount?: number;
}

export type AdditionalCostCalculationType = 'fixed' | 'percentage' | 'per_unit' | 'per_total_cost' | 'amount';

export interface AdditionalCost {
  id: string;
  name: string;
  amount?: number; // Can be optional if percentage is used
  calculationType: AdditionalCostCalculationType;
  percentage?: number;
  base?: 'revenue' | 'units' | 'cost';
}

// --- Product & Quantity Types ---

export type QuantityType = 'fixed' | 'range' | 'capacity' | 'market' | 'historical' | 'uncertain';

export interface ProductHistoricalData {
  m1: number;
  m2: number;
  m3: number;
}

export interface Product {
  // Basic Info
  id: string;
  name: string;
  description?: string;
  type?: 'core' | 'addon'; // Type of product
  paused: boolean;
  
  // Costing
  unitCost?: number; // Used if costItems is empty
  costItems: CostItem[];
  // Optional direct fixed costs for this product (monthly)
  productFixedCosts?: Array<{ id: string; name: string; monthlyAmount: number }>;

  // Quantity
  quantityType: QuantityType;
  monthlyQuantity?: number; // for fixed
  minQuantity?: number;      // for range
  maxQuantity?: number;      // for range
  capacityMax?: number;      // for capacity
  capacityUtilization?: number; // for capacity
  marketSize?: number;       // for market
  marketSharePct?: number;   // for market
  historical?: ProductHistoricalData;

  // Pricing & Allocation
  preliminaryPrice?: number;
  price?: number;
  allocation?: number; // Percentage
  // Computed fields optionally persisted by UI
  totalUnitCost?: number;
  allocatedFixedCostPerUnit?: number;
  unitVarCost?: number;
  // Optional per-product competitors list used in some steps
  competitors?: Array<{ id?: string; name?: string; price: number }>;
  // Additional properties for compatibility
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
}


// --- Market & Strategy Types ---

export interface Competitor {
  id: string;
  name: string;
  price: number; 
  productId?: string; // Link competitor price to a specific product
}

// --- Main Data Structure ---

export type RunwayMode = 'auto' | 'manual';

export interface Bundle {
  id: string;
  name: string;
  productIds: string[];
  discountType: 'percentage' | 'fixed' | 'bundle';
  discountValue: number;
  bundlePrice: number;
}

export interface LocalData {
  // Step 0: Basic Info
  companyName?: string;
  sector?: string;
  foundedYear?: number;
  currency?: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
  };

  // Step 1: Customer Type
  customerType?: 'B2C' | 'B2B';

  // Step 2: Costs
  products: Product[];
  fixedCosts: FixedCost[];
  additionalCosts: AdditionalCost[];
  
  // Runway
  runwayCash?: number;
  runwayMonths?: number;
  manualRunwayMonths?: number;
  runwayMode: RunwayMode;

  // Step 4: Market Assumptions
  competitors: Competitor[];
  bundling?: Bundle[];
  allocationMethod?: 'equal' | 'volume' | 'revenue' | 'manual' | 'units' | 'cost' | 'custom';
  allocationCustom?: Record<string, number>;

  // Step 5: Strategic Goals
  targetMargin?: number;
  strategicGoal?: 'profit_maximization' | 'market_share' | 'premium_branding' | 'survival';
  
  // Step 6: 
  customDifferentiation?: string;
  priceSensitivity?: 'high' | 'medium' | 'low';
  differentiation?: string[];
  
  // This might be a global setting or per-product
  globalPriceElasticity?: number;


  // Step 9: LTV/CAC
  ltvCacInputs?: {
    avgPurchaseValue?: number; // Can be auto-calculated but allow override
    purchaseFrequencyPerYear?: number; // How many times a customer buys in a year
    customerLifespanYears?: number; // How many years a customer stays
    monthlyMarketingSpend?: number; // Total marketing/sales spend
    newCustomersPerMonth?: number; // New customers from that spend
  };

  // UI state management for specific steps/features
  companyStage?: 'idea' | 'mvp' | 'growth' | 'scaleup';
  customSector?: string;
  expectedMargin?: number;

  // LTV/CAC Metrics
  monthlyNewCustomers?: number;
  customerChurnRate?: number; // As a percentage
  avgOrderValue?: number;
  purchaseFrequency?: number;
  grossMarginPercent?: number;
  currentGoal?: 'quick_revenue' | 'market_entry' | 'premium_position' | 'sustainable_growth' | 'test_market';
  // Selected strategy per product
  pricingStrategy?: Record<string, string>;
  secondaryStrategies?: string[];
  customMargin?: number;
  monthlyMarketingCost?: number;
  // Strategic outputs stored by UI
  selectedStrategy?: string;
  recommendedStrategy?: Record<string, string>;
  recommendedMargin?: Record<string, number>;
  effectiveStrategy?: Record<string, string>;
  // Product-level LTV/CAC inputs map
  productLtvCac?: Record<string, {
    monthlyNewCustomers?: number;
    customerChurnRate?: number;
    avgOrderValue?: number;
    purchaseFrequency?: number;
    grossMarginPercent?: number;
    monthlyMarketingCost?: number;
  }>;
  // Additional financial params used in allocations
  depreciation?: number;
  rdBudget?: number;
  // Fallback allocation method
  fallback?: {
    applied: boolean;
    allocation: Record<string, number>;
    reason: string;
    method?: string;
  };
}

// Financial result shape used by Step 8 computations
export interface FinancialResult extends Product {
  monthlyQuantity: number;
  totalUnitCost: number;
  unitVariableCost: number;
  fixedCostPerUnit: number;
  monthlyRevenue: number;
  monthlyVariableCosts: number;
  monthlyFixedCostsAllocated: number;
  monthlyTotalCost: number;
  monthlyProfit: number;
  profitMargin: number;
  contributionMargin: number;
  contributionRatio: number;
  price?: number;
  effectiveStrategy?: string;
  achievedMarginPct?: number;
  // Additional properties for compatibility
  unitVarCost?: number;
  allocatedFixedCostPerUnit?: number;
}
