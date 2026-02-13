// ─── Core Types ──────────────────────────────────────────────────────

export interface PersonProfile {
  name: string;
  birthDate: string; // YYYY-MM
  grossSalary: number; // annual
  salaryGrowthRate: number; // % per year
  pensionContributionPercent: number; // employee %
  employerPensionPercent: number; // employer match %
  salarySacrifice: boolean;
  studentLoan: StudentLoanPlan | null;
  niCategory: "A" | "B" | "C" | "H" | "M" | "Z"; // NI category letter
  taxCode: string; // e.g. "1257L"
  statePensionWeeks: number; // qualifying years * 52, max 35 years
  currentPensionPot: number;
  currentISA: number;
  currentGIA: number;
  currentCash: number;
}

export type StudentLoanPlan = "plan1" | "plan2" | "plan4" | "plan5" | "postgrad";

export interface HouseholdConfig {
  person1: PersonProfile;
  person2?: PersonProfile;
  marriageAllowanceTransfer: boolean; // transfer from lower to higher earner
  jointAssessment: boolean;
}

// ─── Inflation ───────────────────────────────────────────────────────

export interface InflationRates {
  generalCPI: number;        // % e.g. 2.5
  wageGrowth: number;        // % e.g. 3.5
  housePriceInflation: number; // % e.g. 4.0
  educationCosts: number;    // % e.g. 5.0
  rentInflation: number;     // % e.g. 3.0
}

// ─── Tax ─────────────────────────────────────────────────────────────

export interface TaxBreakdown {
  grossIncome: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  basicRateTax: number;
  higherRateTax: number;
  additionalRateTax: number;
  employeeNI: number;
  employerNI: number;
  studentLoanRepayment: number;
  dividendTax: number;
  capitalGainsTax: number;
  highIncomeChildBenefitCharge: number;
  totalDeductions: number;
  netIncome: number; // monthly take-home
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export interface PensionAllowance {
  annualAllowance: number; // £60,000 standard
  tapered: boolean;
  taperedAllowance: number;
  carryForward: [number, number, number]; // previous 3 years' unused
  totalAvailable: number;
  usedThisYear: number;
  remaining: number;
}

export interface StampDutyResult {
  propertyPrice: number;
  isAdditional: boolean;
  isFirstTimeBuyer: boolean;
  stampDuty: number;
  effectiveRate: number;
  bands: { from: number; to: number; rate: number; tax: number }[];
}

// ─── Property ────────────────────────────────────────────────────────

export interface MortgageTerms {
  propertyName: string;
  propertyValue: number;
  outstandingBalance: number;
  interestRate: number; // % annual
  termYears: number;
  termMonthsRemaining: number;
  fixedRateEndDate?: string; // YYYY-MM
  monthlyPayment: number;
  overpaymentMonthly: number;
  maxOverpaymentPercent: number; // typically 10% of balance per year
}

export interface AmortisationRow {
  month: number;
  date: string; // YYYY-MM
  openingBalance: number;
  payment: number;
  interestPortion: number;
  principalPortion: number;
  overpayment: number;
  closingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  equity: number; // propertyValue - closingBalance (projected)
}

export interface RemortgageScenario {
  name: string;
  newRate: number;
  newTermYears: number;
  fees: number;
  startMonth: number; // month index from now
}

export interface PropertyProjection {
  currentValue: number;
  appreciationRate: number; // % per year, uses housePriceInflation
  monthlyValues: number[];
  equityOverTime: number[];
}

// ─── Investment ──────────────────────────────────────────────────────

export interface AssetAllocation {
  equities: number; // % 0-100
  bonds: number;
  cash: number;
  // expected returns and volatility for Monte Carlo
  equityReturn: number; // % annual
  equityVolatility: number; // % annual std dev
  bondReturn: number;
  bondVolatility: number;
  cashReturn: number;
  cashVolatility: number;
}

export interface ISAConfig {
  annualLimit: number; // £20,000
  monthlyContribution: number;
  allocation: AssetAllocation;
  platformFeePercent: number; // e.g. 0.15
}

export interface GIAConfig {
  monthlyContribution: number;
  allocation: AssetAllocation;
  platformFeePercent: number;
}

// ─── Pension ─────────────────────────────────────────────────────────

export interface PensionConfig {
  provider: string;
  currentPot: number;
  employeePercent: number;
  employerPercent: number;
  salarySacrifice: boolean;
  allocation: AssetAllocation;
  platformFeePercent: number;
  drawdownAge: number; // 57 minimum
  targetIncomeInRetirement: number; // annual in today's money
}

export interface StatePensionForecast {
  currentWeeklyAmount: number;
  fullWeeklyAmount: number; // £221.20 (2024/25)
  qualifyingYears: number;
  yearsToFull: number;
  projectedWeeklyAmount: number;
  projectedAnnualAmount: number;
  startAge: number; // 67 currently
}

export interface SalarySacrificeComparison {
  withoutSacrifice: {
    grossSalary: number;
    incomeTax: number;
    employeeNI: number;
    employerNI: number;
    netPay: number;
    pensionContribution: number;
    totalPensionInflow: number;
  };
  withSacrifice: {
    grossSalary: number;
    adjustedSalary: number;
    incomeTax: number;
    employeeNI: number;
    employerNI: number;
    netPay: number;
    pensionContribution: number;
    employerNISaving: number;
    totalPensionInflow: number;
  };
  netBenefit: number;
  pensionBoost: number;
}

// ─── Life Events ─────────────────────────────────────────────────────

export type LifeEventType =
  | "child"
  | "career_break"
  | "career_change"
  | "inheritance"
  | "redundancy"
  | "part_time"
  | "retirement"
  | "property_move"
  | "education";

export interface LifeEvent {
  id: string;
  type: LifeEventType;
  name: string;
  startMonth: number; // months from now
  durationMonths?: number; // how long the event lasts
  enabled: boolean;
  params: LifeEventParams;
}

export type LifeEventParams =
  | ChildEventParams
  | CareerBreakParams
  | CareerChangeParams
  | InheritanceParams
  | RedundancyParams
  | PartTimeParams
  | RetirementParams
  | PropertyMoveParams;

export interface ChildEventParams {
  type: "child";
  nurseryCostMonthly: number; // ~£1,500
  nurseryMonths: number; // typically 36 months (age 1-4)
  schoolFeeMonthly: number; // 0 for state
  schoolFeeMonths: number; // 0 for state, 156 for private (age 5-18)
  childcareCostInflation: number; // % per year
  incomeReductionPercent: number; // e.g. one parent goes to 80%
  incomeReductionMonths: number;
  person: "person1" | "person2";
}

export interface CareerBreakParams {
  type: "career_break";
  person: "person1" | "person2";
  incomeReductionPercent: number; // 100 = no income
}

export interface CareerChangeParams {
  type: "career_change";
  person: "person1" | "person2";
  newSalary: number;
  newGrowthRate: number;
}

export interface InheritanceParams {
  type: "inheritance";
  amount: number;
  taxable: boolean;
}

export interface RedundancyParams {
  type: "redundancy";
  person: "person1" | "person2";
  statutoryWeeks: number;
  contractualMonths: number; // notice period
  contractualMultiplier: number; // x weekly pay
}

export interface PartTimeParams {
  type: "part_time";
  person: "person1" | "person2";
  hoursReductionPercent: number; // e.g. 40 = working 60% of full time
}

export interface RetirementParams {
  type: "retirement";
  person: "person1" | "person2";
  targetAnnualIncome: number; // in today's money
}

export interface PropertyMoveParams {
  type: "property_move";
  salePrice: number;
  purchasePrice: number;
  movingCosts: number;
  stampDuty: number; // auto-calculated
  newMortgageAmount: number;
  newMortgageRate: number;
  newMortgageTerm: number;
}

// ─── Decision Comparisons ────────────────────────────────────────────

export interface OverpaymentVsInvestResult {
  overpaymentScenario: {
    interestSaved: number;
    yearsReduced: number;
    totalCost: number;
  };
  isaScenario: {
    projectedValue: number;
    taxOnGains: number;
    netValue: number;
  };
  pensionScenario: {
    projectedValue: number;
    taxRelief: number;
    employerNISaving: number;
    netValue: number;
  };
  recommendation: string;
  breakEvenRate: number; // mortgage rate where investing = overpaying
}

export interface SalarySacrificeOptimisation {
  optimalSacrificeAmount: number;
  netPayAfterSacrifice: number;
  pensionBoost: number;
  personalAllowanceRecovered: number;
  totalBenefit: number;
}

// ─── Monte Carlo ─────────────────────────────────────────────────────

export interface MonteCarloConfig {
  numSimulations: number; // 10,000
  projectionMonths: number; // e.g. 360 = 30 years
  randomSeed?: number;
}

export interface MonteCarloResult {
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  mean: number[];
  months: string[]; // YYYY-MM labels
  failureRate: number; // % of scenarios where money runs out
}

// ─── Projection Output ──────────────────────────────────────────────

export interface MonthlyProjection {
  month: string; // YYYY-MM
  monthIndex: number;
  // Income
  person1GrossIncome: number;
  person2GrossIncome: number;
  totalGrossIncome: number;
  // Tax
  person1Tax: TaxBreakdown;
  person2Tax: TaxBreakdown | null;
  // Net income
  totalNetIncome: number;
  // Expenses
  mortgagePayment: number;
  livingExpenses: number;
  childcareCosts: number;
  otherExpenses: number;
  totalExpenses: number;
  // Savings & investments
  isaContribution: number;
  giaContribution: number;
  pensionContribution: number;
  cashSaving: number; // residual
  // Assets
  propertyValue: number;
  mortgageBalance: number;
  propertyEquity: number;
  pensionPot: number;
  isaBalance: number;
  giaBalance: number;
  cashBalance: number;
  // Totals
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  // Investment income (for crossover analysis)
  investmentIncome: number;
}

export interface ProjectionScenario {
  id: string;
  name: string;
  household: HouseholdConfig;
  inflation: InflationRates;
  property: MortgageTerms;
  propertyAppreciation: number;
  isa: ISAConfig;
  gia: GIAConfig;
  pension: PensionConfig;
  pension2?: PensionConfig; // person 2
  statePension1: StatePensionForecast;
  statePension2?: StatePensionForecast;
  lifeEvents: LifeEvent[];
  monthlyLivingExpenses: number; // in today's money
  projectionMonths: number;
  monteCarlo: MonteCarloConfig;
}

export interface ProjectionResult {
  scenario: ProjectionScenario;
  deterministic: MonthlyProjection[];
  monteCarlo: MonteCarloResult;
  crossoverMonth: number | null; // when investment income > expenses
  retirementMonth: number | null;
  sensitivityAnalysis: SensitivityResult[];
}

export interface SensitivityResult {
  variable: string;
  baseValue: number;
  impact: number; // change in final net worth per 1% change in variable
  rank: number;
}

// ─── Scenario defaults ──────────────────────────────────────────────

export const DEFAULT_INFLATION: InflationRates = {
  generalCPI: 2.5,
  wageGrowth: 3.5,
  housePriceInflation: 4.0,
  educationCosts: 5.0,
  rentInflation: 3.0,
};

export const DEFAULT_ASSET_ALLOCATION: AssetAllocation = {
  equities: 80,
  bonds: 15,
  cash: 5,
  equityReturn: 7.0,
  equityVolatility: 16.0,
  bondReturn: 3.5,
  bondVolatility: 5.0,
  cashReturn: 2.0,
  cashVolatility: 0.5,
};

export const UK_TAX_YEAR_2024_25 = {
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  basicRateLimit: 37700,
  basicRate: 0.20,
  higherRateThreshold: 50270, // 12570 + 37700
  higherRate: 0.40,
  additionalRateThreshold: 125140,
  additionalRate: 0.45,
  // NI thresholds (annual)
  niPrimaryThreshold: 12570,
  niUpperEarningsLimit: 50270,
  niRate: 0.08, // 8% main rate (2024/25)
  niUpperRate: 0.02, // 2% above UEL
  niEmployerThreshold: 9100,
  niEmployerRate: 0.138, // 13.8%
  // Pension
  pensionAnnualAllowance: 60000,
  pensionTaperThresholdIncome: 260000,
  pensionTaperAdjustedIncome: 260000,
  pensionMinTaperedAllowance: 10000,
  // Dividends
  dividendAllowance: 500,
  dividendBasicRate: 0.0875,
  dividendHigherRate: 0.3375,
  dividendAdditionalRate: 0.3935,
  // CGT
  cgtAllowance: 3000,
  cgtBasicRateProperty: 0.18,
  cgtHigherRateProperty: 0.24,
  cgtBasicRateOther: 0.10,
  cgtHigherRateOther: 0.20,
  // HICBC
  hicbcThreshold: 60000,
  hicbcFullCharge: 80000,
  childBenefitWeeklyFirstChild: 25.60,
  childBenefitWeeklySubsequent: 16.95,
  // Student loans
  studentLoanPlan1Threshold: 22015,
  studentLoanPlan1Rate: 0.09,
  studentLoanPlan2Threshold: 27295,
  studentLoanPlan2Rate: 0.09,
  studentLoanPlan4Threshold: 27660,
  studentLoanPlan4Rate: 0.09,
  studentLoanPlan5Threshold: 25000,
  studentLoanPlan5Rate: 0.09,
  studentLoanPostgradThreshold: 21000,
  studentLoanPostgradRate: 0.06,
  // ISA
  isaAnnualLimit: 20000,
  // Marriage allowance
  marriageAllowanceAmount: 1260,
  // State pension
  statePensionFullWeekly: 221.20,
  statePensionAge: 67,
};
