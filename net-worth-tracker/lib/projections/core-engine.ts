import {
  ProjectionScenario,
  ProjectionResult,
  MonthlyProjection,
  MonteCarloResult,
  SensitivityResult,
  TaxBreakdown,
  InflationRates,
} from "./types";
import { calculateFullTaxBreakdown } from "./tax-engine";
import {
  calculateMonthlyPayment,
  generateAmortisationSchedule,
} from "./property-engine";
import {
  expectedMonthlyReturn,
  randomMonthlyReturn,
} from "./investment-engine";
import { calculateLifeEventImpact } from "./life-events";

// ─── Deterministic Projection ────────────────────────────────────────

/**
 * Run a single deterministic (expected-value) projection over the scenario timeline.
 * Uses expected returns with no randomness.
 */
export function runDeterministicProjection(
  scenario: ProjectionScenario,
): MonthlyProjection[] {
  const months = scenario.projectionMonths;
  const projections: MonthlyProjection[] = [];

  // State variables
  let p1Salary = scenario.household.person1.grossSalary;
  let p2Salary = scenario.household.person2?.grossSalary ?? 0;
  let mortgageBalance = scenario.property.outstandingBalance;
  let propertyValue = scenario.property.propertyValue;
  let pensionPot1 = scenario.pension.currentPot;
  let pensionPot2 = scenario.pension2?.currentPot ?? 0;
  let isaBalance = scenario.household.person1.currentISA + (scenario.household.person2?.currentISA ?? 0);
  let giaBalance = scenario.household.person1.currentGIA + (scenario.household.person2?.currentGIA ?? 0);
  let cashBalance = scenario.household.person1.currentCash + (scenario.household.person2?.currentCash ?? 0);

  const mortgagePayment = scenario.property.monthlyPayment ||
    calculateMonthlyPayment(
      scenario.property.outstandingBalance,
      scenario.property.interestRate,
      scenario.property.termMonthsRemaining,
    );

  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = now.getMonth() + 1;

  // Monthly inflation factors
  const monthlyGeneralInflation = Math.pow(1 + scenario.inflation.generalCPI / 100, 1 / 12) - 1;
  const monthlyWageGrowth = Math.pow(1 + scenario.inflation.wageGrowth / 100, 1 / 12) - 1;
  const monthlyHouseInflation = Math.pow(1 + scenario.inflation.housePriceInflation / 100, 1 / 12) - 1;

  // Investment returns (deterministic = expected)
  const isaMonthlyReturn = expectedMonthlyReturn(scenario.isa.allocation);
  const giaMonthlyReturn = expectedMonthlyReturn(scenario.gia.allocation);
  const pensionMonthlyReturn = expectedMonthlyReturn(scenario.pension.allocation);
  const pension2MonthlyReturn = scenario.pension2
    ? expectedMonthlyReturn(scenario.pension2.allocation)
    : 0;

  let isaAnnualContrib = 0;
  let livingExpenses = scenario.monthlyLivingExpenses;

  for (let m = 0; m < months; m++) {
    const dateMonth = ((startMonth - 1 + m) % 12) + 1;
    const dateYear = startYear + Math.floor((startMonth - 1 + m) / 12);
    const monthStr = `${dateYear}-${String(dateMonth).padStart(2, "0")}`;

    // Reset annual ISA tracking in April
    if (dateMonth === 4) {
      isaAnnualContrib = 0;
    }

    // Apply annual salary growth each January
    if (m > 0 && dateMonth === 1) {
      p1Salary *= (1 + scenario.household.person1.salaryGrowthRate / 100);
      if (scenario.household.person2) {
        p2Salary *= (1 + scenario.household.person2.salaryGrowthRate / 100);
      }
    }

    // Life events impact
    const lifeImpact = calculateLifeEventImpact(
      scenario.lifeEvents,
      m,
      scenario.inflation,
    );

    // Apply income multipliers from life events
    let effectiveP1Salary = lifeImpact.person1SalaryOverride ?? p1Salary;
    effectiveP1Salary *= lifeImpact.person1IncomeMultiplier;

    let effectiveP2Salary = lifeImpact.person2SalaryOverride ?? p2Salary;
    effectiveP2Salary *= lifeImpact.person2IncomeMultiplier;

    // Monthly gross income
    const p1MonthlyGross = effectiveP1Salary / 12;
    const p2MonthlyGross = effectiveP2Salary / 12;
    const totalGross = p1MonthlyGross + p2MonthlyGross;

    // Tax calculations (annual basis, divided by 12 for monthly)
    const p1PensionContrib = effectiveP1Salary * (scenario.pension.employeePercent / 100);
    const p1Tax = calculateFullTaxBreakdown(
      effectiveP1Salary,
      scenario.pension.salarySacrifice ? p1PensionContrib : 0,
      scenario.household.person1.studentLoan,
    );

    let p2Tax: TaxBreakdown | null = null;
    if (scenario.household.person2) {
      const p2PensionContrib = effectiveP2Salary * ((scenario.pension2?.employeePercent ?? 0) / 100);
      p2Tax = calculateFullTaxBreakdown(
        effectiveP2Salary,
        scenario.pension2?.salarySacrifice ? p2PensionContrib : 0,
        scenario.household.person2.studentLoan,
      );
    }

    const totalNetIncome = (p1Tax.netIncome + (p2Tax?.netIncome ?? 0)) / 12;

    // Pension contributions
    const p1EmpPension = effectiveP1Salary * (scenario.pension.employeePercent / 100) / 12;
    const p1ErPension = effectiveP1Salary * (scenario.pension.employerPercent / 100) / 12;
    pensionPot1 = (pensionPot1 + p1EmpPension + p1ErPension) * (1 + pensionMonthlyReturn);

    if (scenario.pension2 && scenario.household.person2) {
      const p2EmpPension = effectiveP2Salary * (scenario.pension2.employeePercent / 100) / 12;
      const p2ErPension = effectiveP2Salary * (scenario.pension2.employerPercent / 100) / 12;
      pensionPot2 = (pensionPot2 + p2EmpPension + p2ErPension) * (1 + pension2MonthlyReturn);
    }

    // Mortgage
    const monthlyRate = scenario.property.interestRate / 100 / 12;
    const interestPortion = mortgageBalance * monthlyRate;
    const principalPortion = Math.min(mortgagePayment - interestPortion, mortgageBalance);
    const overpayment = Math.min(
      scenario.property.overpaymentMonthly,
      mortgageBalance - principalPortion,
    );
    mortgageBalance = Math.max(0, mortgageBalance - principalPortion - overpayment);

    // Property value appreciation
    propertyValue *= (1 + monthlyHouseInflation);

    // Handle property move from life events
    if (lifeImpact.newMortgage) {
      const pm = lifeImpact.newMortgage;
      propertyValue = pm.purchasePrice;
      mortgageBalance = pm.newMortgageAmount;
    }

    // Living expenses (inflate monthly)
    livingExpenses *= (1 + monthlyGeneralInflation);
    const childcareCosts = lifeImpact.additionalExpenses;
    const totalExpenses = mortgagePayment + overpayment + livingExpenses + childcareCosts;

    // Lump sums from life events
    if (lifeImpact.lumpSumIncome > 0) {
      cashBalance += lifeImpact.lumpSumIncome;
    }
    if (lifeImpact.lumpSumExpense > 0) {
      cashBalance -= lifeImpact.lumpSumExpense;
    }

    // ISA contribution
    let isaContrib = scenario.isa.monthlyContribution;
    if (isaAnnualContrib + isaContrib > scenario.isa.annualLimit) {
      isaContrib = Math.max(0, scenario.isa.annualLimit - isaAnnualContrib);
    }
    isaAnnualContrib += isaContrib;
    isaBalance = (isaBalance + isaContrib) * (1 + isaMonthlyReturn);
    isaBalance *= (1 - scenario.isa.platformFeePercent / 100 / 12);

    // GIA contribution
    const giaContrib = scenario.gia.monthlyContribution;
    giaBalance = (giaBalance + giaContrib) * (1 + giaMonthlyReturn);
    giaBalance *= (1 - scenario.gia.platformFeePercent / 100 / 12);

    // Cash: whatever is left after all other allocations
    const totalInvestmentContribs = isaContrib + giaContrib;
    const monthlyCashFlow = totalNetIncome - totalExpenses - totalInvestmentContribs;
    cashBalance += monthlyCashFlow;

    // Total net worth
    const totalAssets = propertyValue + pensionPot1 + pensionPot2 + isaBalance + giaBalance + Math.max(0, cashBalance);
    const totalLiabilities = mortgageBalance + Math.abs(Math.min(0, cashBalance));
    const nw = totalAssets - totalLiabilities;

    // Investment income estimate (for crossover analysis)
    const investmentIncome = (isaBalance + giaBalance) * isaMonthlyReturn +
      pensionPot1 * pensionMonthlyReturn;

    projections.push({
      month: monthStr,
      monthIndex: m,
      person1GrossIncome: p1MonthlyGross,
      person2GrossIncome: p2MonthlyGross,
      totalGrossIncome: totalGross,
      person1Tax: { ...p1Tax, netIncome: p1Tax.netIncome / 12 } as TaxBreakdown,
      person2Tax: p2Tax ? { ...p2Tax, netIncome: p2Tax.netIncome / 12 } as TaxBreakdown : null,
      totalNetIncome,
      mortgagePayment: mortgagePayment + overpayment,
      livingExpenses,
      childcareCosts,
      otherExpenses: 0,
      totalExpenses,
      isaContribution: isaContrib,
      giaContribution: giaContrib,
      pensionContribution: p1EmpPension + p1ErPension,
      cashSaving: monthlyCashFlow,
      propertyValue,
      mortgageBalance,
      propertyEquity: propertyValue - mortgageBalance,
      pensionPot: pensionPot1 + pensionPot2,
      isaBalance,
      giaBalance,
      cashBalance: Math.max(0, cashBalance),
      totalAssets,
      totalLiabilities,
      netWorth: nw,
      investmentIncome,
    });
  }

  return projections;
}

// ─── Monte Carlo Simulation ─────────────────────────────────────────

/**
 * Run Monte Carlo simulation across all variable inputs.
 * Returns percentile bands for net worth over time.
 */
export function runMonteCarloSimulation(
  scenario: ProjectionScenario,
): MonteCarloResult {
  const { numSimulations, projectionMonths } = scenario.monteCarlo;
  const allNetWorths: number[][] = [];

  for (let sim = 0; sim < numSimulations; sim++) {
    const netWorths = runSingleMonteCarloPath(scenario);
    allNetWorths.push(netWorths);
  }

  // Calculate percentiles for each month
  const p10: number[] = [];
  const p25: number[] = [];
  const p50: number[] = [];
  const p75: number[] = [];
  const p90: number[] = [];
  const mean: number[] = [];

  for (let m = 0; m < projectionMonths; m++) {
    const values = allNetWorths.map((nw) => nw[m]).sort((a, b) => a - b);
    p10.push(percentile(values, 10));
    p25.push(percentile(values, 25));
    p50.push(percentile(values, 50));
    p75.push(percentile(values, 75));
    p90.push(percentile(values, 90));
    mean.push(values.reduce((s, v) => s + v, 0) / values.length);
  }

  // Generate month labels
  const now = new Date();
  const startYear = now.getFullYear();
  const startMonthIdx = now.getMonth() + 1;
  const months: string[] = [];
  for (let m = 0; m < projectionMonths; m++) {
    const dateMonth = ((startMonthIdx - 1 + m) % 12) + 1;
    const dateYear = startYear + Math.floor((startMonthIdx - 1 + m) / 12);
    months.push(`${dateYear}-${String(dateMonth).padStart(2, "0")}`);
  }

  // Failure rate: % of scenarios where net worth goes negative in the last 5 years
  const lastYearStart = Math.max(0, projectionMonths - 60);
  let failures = 0;
  for (const nw of allNetWorths) {
    const lastYears = nw.slice(lastYearStart);
    if (lastYears.some((v) => v < 0)) failures++;
  }

  return {
    percentiles: { p10, p25, p50, p75, p90 },
    mean,
    months,
    failureRate: (failures / numSimulations) * 100,
  };
}

/**
 * Run a single Monte Carlo path with randomised returns,
 * inflation, and salary growth.
 */
function runSingleMonteCarloPath(scenario: ProjectionScenario): number[] {
  const months = scenario.monteCarlo.projectionMonths;
  const netWorths: number[] = [];

  let p1Salary = scenario.household.person1.grossSalary;
  let p2Salary = scenario.household.person2?.grossSalary ?? 0;
  let mortgageBalance = scenario.property.outstandingBalance;
  let propertyValue = scenario.property.propertyValue;
  let pensionPot = scenario.pension.currentPot + (scenario.pension2?.currentPot ?? 0);
  let isaBalance = scenario.household.person1.currentISA + (scenario.household.person2?.currentISA ?? 0);
  let giaBalance = scenario.household.person1.currentGIA + (scenario.household.person2?.currentGIA ?? 0);
  let cashBalance = scenario.household.person1.currentCash + (scenario.household.person2?.currentCash ?? 0);
  let livingExpenses = scenario.monthlyLivingExpenses;

  const mortgagePayment = scenario.property.monthlyPayment ||
    calculateMonthlyPayment(
      scenario.property.outstandingBalance,
      scenario.property.interestRate,
      scenario.property.termMonthsRemaining,
    );

  let isaAnnualContrib = 0;
  const now = new Date();
  const startMonth = now.getMonth() + 1;

  for (let m = 0; m < months; m++) {
    const dateMonth = ((startMonth - 1 + m) % 12) + 1;

    if (dateMonth === 4) isaAnnualContrib = 0;

    // Randomised salary growth
    if (m > 0 && dateMonth === 1) {
      const salaryGrowthRandom = randomNormal(
        scenario.household.person1.salaryGrowthRate / 100,
        0.02,
      );
      p1Salary *= (1 + salaryGrowthRandom);
      if (scenario.household.person2) {
        const p2GrowthRandom = randomNormal(
          scenario.household.person2.salaryGrowthRate / 100,
          0.02,
        );
        p2Salary *= (1 + p2GrowthRandom);
      }
    }

    // Life events
    const lifeImpact = calculateLifeEventImpact(scenario.lifeEvents, m, scenario.inflation);
    const effP1 = (lifeImpact.person1SalaryOverride ?? p1Salary) * lifeImpact.person1IncomeMultiplier;
    const effP2 = (lifeImpact.person2SalaryOverride ?? p2Salary) * lifeImpact.person2IncomeMultiplier;

    // Tax (simplified monthly)
    const p1PensionContrib = effP1 * (scenario.pension.employeePercent / 100);
    const p1Tax = calculateFullTaxBreakdown(effP1, p1PensionContrib, scenario.household.person1.studentLoan);
    const p2Tax = scenario.household.person2
      ? calculateFullTaxBreakdown(effP2, effP2 * ((scenario.pension2?.employeePercent ?? 0) / 100), scenario.household.person2.studentLoan)
      : null;

    const totalNetIncome = (p1Tax.netIncome + (p2Tax?.netIncome ?? 0)) / 12;

    // Pension with random returns
    const pensionReturn = randomMonthlyReturn(scenario.pension.allocation);
    const totalPensionContrib = effP1 * ((scenario.pension.employeePercent + scenario.pension.employerPercent) / 100) / 12;
    const p2PensionContrib = scenario.pension2
      ? effP2 * ((scenario.pension2.employeePercent + scenario.pension2.employerPercent) / 100) / 12
      : 0;
    pensionPot = (pensionPot + totalPensionContrib + p2PensionContrib) * (1 + pensionReturn);

    // Mortgage
    const monthlyRate = scenario.property.interestRate / 100 / 12;
    const interestPortion = mortgageBalance * monthlyRate;
    const principalPortion = Math.min(mortgagePayment - interestPortion, mortgageBalance);
    mortgageBalance = Math.max(0, mortgageBalance - principalPortion - scenario.property.overpaymentMonthly);

    // Property with random appreciation
    const houseReturn = randomNormal(
      scenario.inflation.housePriceInflation / 100 / 12,
      0.03 / Math.sqrt(12),
    );
    propertyValue *= (1 + houseReturn);

    // Life event lump sums
    if (lifeImpact.lumpSumIncome > 0) cashBalance += lifeImpact.lumpSumIncome;
    if (lifeImpact.lumpSumExpense > 0) cashBalance -= lifeImpact.lumpSumExpense;
    if (lifeImpact.newMortgage) {
      propertyValue = lifeImpact.newMortgage.purchasePrice;
      mortgageBalance = lifeImpact.newMortgage.newMortgageAmount;
    }

    // Random inflation
    const inflationRandom = randomNormal(
      scenario.inflation.generalCPI / 100 / 12,
      0.005 / Math.sqrt(12),
    );
    livingExpenses *= (1 + inflationRandom);

    const childcareCosts = lifeImpact.additionalExpenses;
    const totalExpenses = mortgagePayment + scenario.property.overpaymentMonthly + livingExpenses + childcareCosts;

    // ISA with random returns
    let isaContrib = scenario.isa.monthlyContribution;
    if (isaAnnualContrib + isaContrib > scenario.isa.annualLimit) {
      isaContrib = Math.max(0, scenario.isa.annualLimit - isaAnnualContrib);
    }
    isaAnnualContrib += isaContrib;
    const isaReturn = randomMonthlyReturn(scenario.isa.allocation);
    isaBalance = (isaBalance + isaContrib) * (1 + isaReturn);
    isaBalance *= (1 - scenario.isa.platformFeePercent / 100 / 12);

    // GIA with random returns
    const giaReturn = randomMonthlyReturn(scenario.gia.allocation);
    giaBalance = (giaBalance + scenario.gia.monthlyContribution) * (1 + giaReturn);
    giaBalance *= (1 - scenario.gia.platformFeePercent / 100 / 12);

    // Cash flow
    const totalInvestContribs = isaContrib + scenario.gia.monthlyContribution;
    cashBalance += totalNetIncome - totalExpenses - totalInvestContribs;

    // Net worth
    const totalAssets = propertyValue + pensionPot + isaBalance + giaBalance + Math.max(0, cashBalance);
    const totalLiabilities = mortgageBalance + Math.abs(Math.min(0, cashBalance));
    netWorths.push(totalAssets - totalLiabilities);
  }

  return netWorths;
}

// ─── Sensitivity Analysis ────────────────────────────────────────────

/**
 * Run sensitivity analysis: vary each key input by ±1% and measure
 * impact on final net worth. Rank by absolute impact.
 */
export function runSensitivityAnalysis(
  scenario: ProjectionScenario,
): SensitivityResult[] {
  const baseProjection = runDeterministicProjection(scenario);
  const baseNW = baseProjection[baseProjection.length - 1].netWorth;

  const variables: { name: string; apply: (s: ProjectionScenario, delta: number) => ProjectionScenario }[] = [
    {
      name: "Salary Growth Rate",
      apply: (s, d) => ({
        ...s,
        household: {
          ...s.household,
          person1: { ...s.household.person1, salaryGrowthRate: s.household.person1.salaryGrowthRate + d },
        },
      }),
    },
    {
      name: "Investment Returns (Equity)",
      apply: (s, d) => ({
        ...s,
        isa: { ...s.isa, allocation: { ...s.isa.allocation, equityReturn: s.isa.allocation.equityReturn + d } },
        pension: { ...s.pension, allocation: { ...s.pension.allocation, equityReturn: s.pension.allocation.equityReturn + d } },
      }),
    },
    {
      name: "House Price Inflation",
      apply: (s, d) => ({
        ...s,
        inflation: { ...s.inflation, housePriceInflation: s.inflation.housePriceInflation + d },
      }),
    },
    {
      name: "General CPI Inflation",
      apply: (s, d) => ({
        ...s,
        inflation: { ...s.inflation, generalCPI: s.inflation.generalCPI + d },
      }),
    },
    {
      name: "Mortgage Interest Rate",
      apply: (s, d) => ({
        ...s,
        property: { ...s.property, interestRate: s.property.interestRate + d },
      }),
    },
    {
      name: "Monthly ISA Contribution",
      apply: (s, d) => ({
        ...s,
        isa: { ...s.isa, monthlyContribution: s.isa.monthlyContribution * (1 + d / 100) },
      }),
    },
    {
      name: "Pension Contribution %",
      apply: (s, d) => ({
        ...s,
        pension: { ...s.pension, employeePercent: s.pension.employeePercent + d },
      }),
    },
  ];

  const results: SensitivityResult[] = variables.map((v) => {
    const scenarioUp = v.apply({ ...scenario }, 1);
    const projUp = runDeterministicProjection(scenarioUp);
    const nwUp = projUp[projUp.length - 1].netWorth;
    const impact = nwUp - baseNW;

    return {
      variable: v.name,
      baseValue: baseNW,
      impact,
      rank: 0,
    };
  });

  // Rank by absolute impact
  results.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  results.forEach((r, i) => { r.rank = i + 1; });

  return results;
}

// ─── Full Projection Run ─────────────────────────────────────────────

/**
 * Run the complete projection: deterministic + Monte Carlo + sensitivity.
 */
export function runFullProjection(scenario: ProjectionScenario): ProjectionResult {
  const deterministic = runDeterministicProjection(scenario);
  const monteCarlo = runMonteCarloSimulation(scenario);
  const sensitivityAnalysis = runSensitivityAnalysis(scenario);

  // Find crossover point: when investment income > expenses
  let crossoverMonth: number | null = null;
  for (const p of deterministic) {
    if (p.investmentIncome >= p.totalExpenses && crossoverMonth === null) {
      crossoverMonth = p.monthIndex;
    }
  }

  // Find retirement feasibility
  let retirementMonth: number | null = null;
  const targetRetirementIncome = scenario.monthlyLivingExpenses; // simplified
  for (const p of deterministic) {
    const sustainableDrawdown = (p.isaBalance + p.giaBalance + p.pensionPot) * 0.04 / 12;
    if (sustainableDrawdown >= targetRetirementIncome && retirementMonth === null) {
      retirementMonth = p.monthIndex;
    }
  }

  return {
    scenario,
    deterministic,
    monteCarlo,
    crossoverMonth,
    retirementMonth,
    sensitivityAnalysis,
  };
}

// ─── Utility Functions ───────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z;
}
