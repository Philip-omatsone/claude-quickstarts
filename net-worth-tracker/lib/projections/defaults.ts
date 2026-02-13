import {
  ProjectionScenario,
  PersonProfile,
  HouseholdConfig,
  MortgageTerms,
  ISAConfig,
  GIAConfig,
  PensionConfig,
  StatePensionForecast,
  DEFAULT_INFLATION,
  DEFAULT_ASSET_ALLOCATION,
  UK_TAX_YEAR_2024_25 as TAX,
  MonteCarloConfig,
} from "./types";

export const DEFAULT_PERSON: PersonProfile = {
  name: "Person 1",
  birthDate: "1992-06",
  grossSalary: 105000,
  salaryGrowthRate: 3.5,
  pensionContributionPercent: 5,
  employerPensionPercent: 5,
  salarySacrifice: true,
  studentLoan: null,
  niCategory: "A",
  taxCode: "1257L",
  statePensionWeeks: 520, // ~10 years
  currentPensionPot: 45000,
  currentISA: 30000,
  currentGIA: 0,
  currentCash: 20000,
};

export const DEFAULT_PERSON_2: PersonProfile = {
  name: "Person 2",
  birthDate: "1993-03",
  grossSalary: 55000,
  salaryGrowthRate: 3.0,
  pensionContributionPercent: 5,
  employerPensionPercent: 3,
  salarySacrifice: false,
  studentLoan: null,
  niCategory: "A",
  taxCode: "1257L",
  statePensionWeeks: 416, // ~8 years
  currentPensionPot: 20000,
  currentISA: 15000,
  currentGIA: 0,
  currentCash: 10000,
};

export const DEFAULT_HOUSEHOLD: HouseholdConfig = {
  person1: DEFAULT_PERSON,
  person2: DEFAULT_PERSON_2,
  marriageAllowanceTransfer: false,
  jointAssessment: true,
};

export const DEFAULT_MORTGAGE: MortgageTerms = {
  propertyName: "Home",
  propertyValue: 500000,
  outstandingBalance: 380000,
  interestRate: 4.5,
  termYears: 25,
  termMonthsRemaining: 300,
  fixedRateEndDate: "2027-06",
  monthlyPayment: 0, // will be auto-calculated
  overpaymentMonthly: 200,
  maxOverpaymentPercent: 10,
};

export const DEFAULT_ISA: ISAConfig = {
  annualLimit: TAX.isaAnnualLimit,
  monthlyContribution: 500,
  allocation: { ...DEFAULT_ASSET_ALLOCATION },
  platformFeePercent: 0.15,
};

export const DEFAULT_GIA: GIAConfig = {
  monthlyContribution: 0,
  allocation: { ...DEFAULT_ASSET_ALLOCATION },
  platformFeePercent: 0.15,
};

export const DEFAULT_PENSION: PensionConfig = {
  provider: "BBB Workplace",
  currentPot: 45000,
  employeePercent: 5,
  employerPercent: 5,
  salarySacrifice: true,
  allocation: {
    ...DEFAULT_ASSET_ALLOCATION,
    equities: 75,
    bonds: 20,
    cash: 5,
  },
  platformFeePercent: 0.30,
  drawdownAge: 57,
  targetIncomeInRetirement: 35000,
};

export const DEFAULT_PENSION_2: PensionConfig = {
  provider: "Workplace Pension",
  currentPot: 20000,
  employeePercent: 5,
  employerPercent: 3,
  salarySacrifice: false,
  allocation: {
    ...DEFAULT_ASSET_ALLOCATION,
    equities: 70,
    bonds: 25,
    cash: 5,
  },
  platformFeePercent: 0.35,
  drawdownAge: 57,
  targetIncomeInRetirement: 25000,
};

export const DEFAULT_STATE_PENSION_1: StatePensionForecast = {
  currentWeeklyAmount: (10 / 35) * TAX.statePensionFullWeekly,
  fullWeeklyAmount: TAX.statePensionFullWeekly,
  qualifyingYears: 10,
  yearsToFull: 25,
  projectedWeeklyAmount: TAX.statePensionFullWeekly, // will reach full before state pension age
  projectedAnnualAmount: TAX.statePensionFullWeekly * 52,
  startAge: TAX.statePensionAge,
};

export const DEFAULT_STATE_PENSION_2: StatePensionForecast = {
  currentWeeklyAmount: (8 / 35) * TAX.statePensionFullWeekly,
  fullWeeklyAmount: TAX.statePensionFullWeekly,
  qualifyingYears: 8,
  yearsToFull: 27,
  projectedWeeklyAmount: TAX.statePensionFullWeekly,
  projectedAnnualAmount: TAX.statePensionFullWeekly * 52,
  startAge: TAX.statePensionAge,
};

export const DEFAULT_MONTE_CARLO: MonteCarloConfig = {
  numSimulations: 10000,
  projectionMonths: 360, // 30 years
};

export function createDefaultScenario(): ProjectionScenario {
  return {
    id: "default",
    name: "Base Scenario",
    household: DEFAULT_HOUSEHOLD,
    inflation: DEFAULT_INFLATION,
    property: DEFAULT_MORTGAGE,
    propertyAppreciation: DEFAULT_INFLATION.housePriceInflation,
    isa: DEFAULT_ISA,
    gia: DEFAULT_GIA,
    pension: DEFAULT_PENSION,
    pension2: DEFAULT_PENSION_2,
    statePension1: DEFAULT_STATE_PENSION_1,
    statePension2: DEFAULT_STATE_PENSION_2,
    lifeEvents: [],
    monthlyLivingExpenses: 3500,
    projectionMonths: 360,
    monteCarlo: DEFAULT_MONTE_CARLO,
  };
}
