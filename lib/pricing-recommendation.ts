import type { LocalData, Product } from '@/types/startup';

export type PricingStrategy = 
  | 'cost_plus'
  | 'competitor_based'
  | 'value_based'
  | 'penetration'
  | 'skimming'
  | 'premium';

export interface PriceRecommendation {
  productId: string;
  productName: string;
  recommendedPrice: number;
  strategy: PricingStrategy;
  reasoning: string[];
}

export interface OverallRecommendation {
  strategy: PricingStrategy;
  reasoning: string;
  productRecommendations: PriceRecommendation[];
}

export const STRATEGY_NAMES: { [key in PricingStrategy]: string } = {
  cost_plus: 'التسعير على أساس التكلفة (Cost-Plus)',
  competitor_based: 'التسعير على أساس المنافسين (Competitor-Based)',
  value_based: 'التسعير على أساس القيمة (Value-Based)',
  penetration: 'التسعير الاختراقي (Penetration)',
  skimming: 'التسعير الاستغلالي (Skimming)',
  premium: 'التسعير الفاخر (Premium)',
};


/**
 * Generates pricing recommendations based on user data.
 * This is a placeholder implementation and will be expanded.
 */
export function generatePricingRecommendations(data: LocalData): OverallRecommendation {
  // --- LTV/CAC Calculation ---
  const { products, fixedCosts, monthlyNewCustomers, customerChurnRate } = data;
  const marketingCosts = (fixedCosts || []).find(c => c.category === 'marketing')?.amount || 0;
  const churnRateDecimal = (customerChurnRate || 0) / 100;

  const estimatedRevenue = (products || []).reduce((acc, p) => acc + (p.price || 0) * (p.monthlyQuantity || 0), 0);
  const variableCosts = (products || []).reduce((acc, p) => acc + (p.unitCost || 0) * (p.monthlyQuantity || 0), 0);
  
  const totalGrossMargin = estimatedRevenue - variableCosts;
  const grossMarginPerCustomer = (monthlyNewCustomers || 0) > 0 ? totalGrossMargin / monthlyNewCustomers! : 0;

  const cac = (monthlyNewCustomers || 0) > 0 ? marketingCosts / monthlyNewCustomers! : 0;
  const ltv = churnRateDecimal > 0 ? grossMarginPerCustomer / churnRateDecimal : 0;
  const ltvToCacRatio = cac > 0 ? ltv / cac : 0;

  const { strategicGoal, companyStage, competitors, differentiation } = data;

  let primaryStrategy: PricingStrategy = 'value_based'; // Default strategy
  let primaryReasoning = 'Based on your unique value proposition, a value-based strategy is recommended as a starting point.';
  const reasoningFactors: string[] = [];

  // Logic based on LTV/CAC ratio
  if (ltvToCacRatio > 0 && ltvToCacRatio < 3) {
    primaryStrategy = 'cost_plus';
    primaryReasoning = 'Your LTV/CAC ratio is below the ideal of 3:1, indicating that customer acquisition costs are high relative to their lifetime value. A cost-plus strategy is recommended to ensure profitability and improve financial stability before pursuing more aggressive growth strategies.';
    reasoningFactors.push(`Low LTV/CAC Ratio (${ltvToCacRatio.toFixed(1)}:1)`);
  } else if (ltvToCacRatio >= 3) {
    reasoningFactors.push(`Healthy LTV/CAC Ratio (${ltvToCacRatio.toFixed(1)}:1)`);
  }

  // If LTV/CAC is healthy or not applicable, proceed with other strategic factors
  if (primaryStrategy !== 'cost_plus' || ltvToCacRatio === 0 || ltvToCacRatio >= 3) {
      if (strategicGoal === 'market_share' && (companyStage === 'idea' || companyStage === 'mvp')) {
        primaryStrategy = 'penetration';
        primaryReasoning = 'With a healthy LTV/CAC ratio and a goal of market share acquisition, a penetration pricing strategy is recommended to attract customers quickly and build a strong user base.';
        reasoningFactors.push('Goal: Market Share');
      } else if (strategicGoal === 'profit_maximization') {
        primaryStrategy = 'skimming';
        primaryReasoning = 'To maximize profits with a sustainable acquisition model, skimming allows you to capture high value from early adopters.';
        reasoningFactors.push('Goal: Profit Maximization');
      } else if (strategicGoal === 'premium_branding' || (differentiation && differentiation.includes('quality'))) {
        primaryStrategy = 'premium';
        primaryReasoning = 'Your focus on premium branding, supported by a strong LTV/CAC ratio, justifies a premium pricing strategy to reflect the high value of your products.';
        reasoningFactors.push('Strategy: Premium Branding');
      } else if (competitors && competitors.length > 0) {
        primaryStrategy = 'competitor_based';
        primaryReasoning = 'With active competitors, your pricing should be benchmarked against theirs. Your healthy LTV/CAC gives you flexibility in competitive positioning.';
        reasoningFactors.push('Factor: Active Competitors');
      } else {
        primaryStrategy = 'value_based';
        primaryReasoning = 'With no direct competitors and a sustainable business model, pricing should be based on the unique value you provide to customers.';
        reasoningFactors.push('Strategy: Value-Based');
      }
  }

  const productRecommendations: PriceRecommendation[] = (products || []).map(product => {
    let recommendedPrice = (product.unitCost || 0) * 1.4; // Default cost-plus
    const reasoning: string[] = [`Initial price based on a 40% margin over unit cost.`];

    // Adjust price based on strategy
    switch (primaryStrategy) {
      case 'penetration':
        recommendedPrice = (product.unitCost || 0) * 1.1; // Lower margin
        reasoning.push('Price is lowered to quickly gain market share.');
        break;
      case 'skimming':
        recommendedPrice = (product.unitCost || 0) * 2.5; // Higher margin
        reasoning.push('Price is set high to capture maximum value from early adopters.');
        break;
      case 'premium':
        recommendedPrice = (product.unitCost || 0) * 3.0; // Highest margin
        reasoning.push('Price reflects the premium quality and brand positioning.');
        break;
      case 'competitor_based':
        const avgCompetitorPrice = competitors.reduce((acc, c) => acc + (c.price || 0), 0) / (competitors.length || 1);
        if(avgCompetitorPrice > 0) {
            recommendedPrice = avgCompetitorPrice * 0.95; // Slightly below average
            reasoning.push('Price is set slightly below the average competitor price to be attractive.');
        }
        break;
    }

    if (primaryStrategy === 'cost_plus' && ltvToCacRatio > 0 && ltvToCacRatio < 3) {
        reasoning.push('A conservative margin is applied to improve the LTV/CAC ratio.');
    }

    return {
      productId: product.id,
      productName: product.name,
      recommendedPrice,
      strategy: primaryStrategy,
      reasoning,
    };
  });

  return {
    strategy: primaryStrategy,
    reasoning: primaryReasoning,
    productRecommendations,
  };
}
