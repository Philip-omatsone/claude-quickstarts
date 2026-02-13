import {
  AssetAllocation,
  ISAConfig,
  GIAConfig,
  PensionConfig,
  StatePensionForecast,
  SalarySacrificeOptimisation,
  UK_TAX_YEAR_2024_25 as TAX,
} from "./types";
import { personalAllowance, calculateIncomeTax, calculateEmployeeNI } from "./tax-engine";

// ─── Portfolio Returns ───────────────────────────────────────────────

/**
 * Calculate expected monthly return for a given asset allocation.
 * Weighted average of component expected returns.
 */
export function expectedMonthlyReturn(allocation: AssetAllocation): number {
  const annualReturn =
    (allocation.equities / 100) * allocation.equityReturn +
    (allocation.bonds / 100) * allocation.bondReturn +
    (allocation.cash / 100) * allocation.cashReturn;
  return annualReturn / 100 / 12;
}

/**
 * Calculate monthly volatility for a given asset allocation.
 * Simplified: weighted average of volatilities (ignores correlation).
 */
export function monthlyVolatility(allocation: AssetAllocation): number {
  const annualVol =
    (allocation.equities / 100) * allocation.equityVolatility +
    (allocation.bonds / 100) * allocation.bondVolatility +
    (allocation.cash / 100) * allocation.cashVolatility;
  return annualVol / 100 / Math.sqrt(12);
}

/**
 * Generate a random monthly return using geometric Brownian motion.
 * Uses Box-Muller transform for normal distribution.
 */
export function randomMonthlyReturn(allocation: AssetAllocation): number {
  const mu = expectedMonthlyReturn(allocation);
  const sigma = monthlyVolatility(allocation);

  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  return mu + sigma * z;
}

// ─── ISA Module ──────────────────────────────────────────────────────

/**
 * Project ISA balance month by month.
 * Respects the £20k annual limit. Returns are tax-free.
 */
export function projectISA(
  config: ISAConfig,
  initialBalance: number,
  months: number,
  useRandomReturns: boolean = false,
): { balances: number[]; totalContributed: number; totalFees: number } {
  const balances: number[] = [];
  let balance = initialBalance;
  let totalContributed = 0;
  let totalFees = 0;
  let annualContributed = 0;

  const monthlyFee = config.platformFeePercent / 100 / 12;

  for (let m = 0; m < months; m++) {
    // Reset annual contribution tracking each April (tax year)
    if (m > 0 && m % 12 === 0) {
      annualContributed = 0;
    }

    // Contribution (respecting annual limit)
    let contribution = config.monthlyContribution;
    if (annualContributed + contribution > config.annualLimit) {
      contribution = Math.max(0, config.annualLimit - annualContributed);
    }
    annualContributed += contribution;
    totalContributed += contribution;

    // Returns
    const monthlyReturn = useRandomReturns
      ? randomMonthlyReturn(config.allocation)
      : expectedMonthlyReturn(config.allocation);

    balance = (balance + contribution) * (1 + monthlyReturn);

    // Platform fees
    const fee = balance * monthlyFee;
    balance -= fee;
    totalFees += fee;

    balances.push(balance);
  }

  return { balances, totalContributed, totalFees };
}

// ─── GIA Module ──────────────────────────────────────────────────────

/**
 * Project General Investment Account balance.
 * Tracks cost basis for CGT calculations.
 */
export function projectGIA(
  config: GIAConfig,
  initialBalance: number,
  months: number,
  useRandomReturns: boolean = false,
): { balances: number[]; costBasis: number[]; unrealisedGains: number[]; totalFees: number } {
  const balances: number[] = [];
  const costBasisArr: number[] = [];
  const unrealisedGainsArr: number[] = [];
  let balance = initialBalance;
  let costBasis = initialBalance;
  let totalFees = 0;

  const monthlyFee = config.platformFeePercent / 100 / 12;

  for (let m = 0; m < months; m++) {
    // Contribution
    const contribution = config.monthlyContribution;
    costBasis += contribution;

    // Returns
    const monthlyReturn = useRandomReturns
      ? randomMonthlyReturn(config.allocation)
      : expectedMonthlyReturn(config.allocation);

    balance = (balance + contribution) * (1 + monthlyReturn);

    // Platform fees
    const fee = balance * monthlyFee;
    balance -= fee;
    totalFees += fee;

    balances.push(balance);
    costBasisArr.push(costBasis);
    unrealisedGainsArr.push(balance - costBasis);
  }

  return { balances, costBasis: costBasisArr, unrealisedGains: unrealisedGainsArr, totalFees };
}

// ─── Pension Module ──────────────────────────────────────────────────

/**
 * Project pension pot growth over time.
 * Includes employee + employer contributions (optionally via salary sacrifice).
 */
export function projectPension(
  config: PensionConfig,
  grossSalary: number,
  salaryGrowthRate: number,
  months: number,
  useRandomReturns: boolean = false,
): {
  balances: number[];
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalFees: number;
} {
  const balances: number[] = [];
  let balance = config.currentPot;
  let currentSalary = grossSalary;
  let totalEmployee = 0;
  let totalEmployer = 0;
  let totalFees = 0;

  const monthlyFee = config.platformFeePercent / 100 / 12;
  const monthlyGrowthRate = Math.pow(1 + salaryGrowthRate / 100, 1 / 12) - 1;

  for (let m = 0; m < months; m++) {
    // Annual salary growth
    if (m > 0 && m % 12 === 0) {
      currentSalary *= (1 + salaryGrowthRate / 100);
    }

    const monthlyGross = currentSalary / 12;
    const employeeContrib = monthlyGross * (config.employeePercent / 100);
    const employerContrib = monthlyGross * (config.employerPercent / 100);

    totalEmployee += employeeContrib;
    totalEmployer += employerContrib;

    // Returns
    const monthlyReturn = useRandomReturns
      ? randomMonthlyReturn(config.allocation)
      : expectedMonthlyReturn(config.allocation);

    balance = (balance + employeeContrib + employerContrib) * (1 + monthlyReturn);

    // Platform fees
    const fee = balance * monthlyFee;
    balance -= fee;
    totalFees += fee;

    balances.push(balance);
  }

  return { balances, totalEmployeeContributions: totalEmployee, totalEmployerContributions: totalEmployer, totalFees };
}

// ─── State Pension ───────────────────────────────────────────────────

export function calculateStatePension(
  qualifyingYears: number,
  currentAge: number,
): StatePensionForecast {
  const fullYears = 35;
  const minYears = 10;
  const fullWeekly = TAX.statePensionFullWeekly;

  if (qualifyingYears < minYears) {
    return {
      currentWeeklyAmount: 0,
      fullWeeklyAmount: fullWeekly,
      qualifyingYears,
      yearsToFull: fullYears - qualifyingYears,
      projectedWeeklyAmount: 0,
      projectedAnnualAmount: 0,
      startAge: TAX.statePensionAge,
    };
  }

  const yearsUsed = Math.min(qualifyingYears, fullYears);
  const weeklyAmount = (yearsUsed / fullYears) * fullWeekly;
  const yearsUntilRetirement = Math.max(0, TAX.statePensionAge - currentAge);
  const projectedYears = Math.min(qualifyingYears + yearsUntilRetirement, fullYears);
  const projectedWeekly = (projectedYears / fullYears) * fullWeekly;

  return {
    currentWeeklyAmount: weeklyAmount,
    fullWeeklyAmount: fullWeekly,
    qualifyingYears,
    yearsToFull: Math.max(0, fullYears - qualifyingYears),
    projectedWeeklyAmount: projectedWeekly,
    projectedAnnualAmount: projectedWeekly * 52,
    startAge: TAX.statePensionAge,
  };
}

// ─── Salary Sacrifice Optimisation ───────────────────────────────────

/**
 * Find the optimal salary sacrifice amount to maximise total benefit.
 * Especially important for incomes around £100k where the personal allowance
 * taper creates a ~62% marginal rate.
 */
export function optimiseSalarySacrifice(
  grossSalary: number,
  employeePensionPercent: number,
  employerPensionPercent: number,
): SalarySacrificeOptimisation {
  // The big win is sacrificing income above £100k to recover personal allowance
  // Every £2 sacrificed above £100k recovers £1 of allowance
  // At 40% tax, that's an extra 20% saving on top of 40% + 2% NI

  let bestNet = -Infinity;
  let optimalAmount = 0;
  let bestPensionBoost = 0;
  let bestPARecovered = 0;

  // Test sacrifice amounts from £0 to £60k (pension annual allowance) in £500 steps
  const maxSacrifice = Math.min(grossSalary * 0.5, TAX.pensionAnnualAllowance);

  for (let sacrifice = 0; sacrifice <= maxSacrifice; sacrifice += 500) {
    const adjustedSalary = grossSalary - sacrifice;

    const employeePension = adjustedSalary * (employeePensionPercent / 100);
    const employerPension = adjustedSalary * (employerPensionPercent / 100);

    const tax = calculateIncomeTax(adjustedSalary, employeePension);
    const ni = calculateEmployeeNI(adjustedSalary);

    const netPay = adjustedSalary - tax.total - ni - employeePension;
    const totalPension = employeePension + employerPension + sacrifice;

    // Value metric: net pay + pension contributions (weighted slightly less as locked until 57)
    const combinedValue = netPay + totalPension * 0.85;

    const paWithSacrifice = personalAllowance(adjustedSalary, employeePension);
    const paWithout = personalAllowance(grossSalary, grossSalary * (employeePensionPercent / 100));
    const paRecovered = paWithSacrifice - paWithout;

    if (combinedValue > bestNet) {
      bestNet = combinedValue;
      optimalAmount = sacrifice;
      bestPensionBoost = totalPension - (grossSalary * (employeePensionPercent + employerPensionPercent) / 100);
      bestPARecovered = paRecovered;
    }
  }

  // Calculate exact net pay at optimal point
  const adjSalary = grossSalary - optimalAmount;
  const empPension = adjSalary * (employeePensionPercent / 100);
  const taxAtOptimal = calculateIncomeTax(adjSalary, empPension);
  const niAtOptimal = calculateEmployeeNI(adjSalary);
  const netPayAtOptimal = adjSalary - taxAtOptimal.total - niAtOptimal - empPension;

  // Total benefit vs no sacrifice
  const noSacPension = grossSalary * (employeePensionPercent / 100);
  const noSacTax = calculateIncomeTax(grossSalary, noSacPension);
  const noSacNI = calculateEmployeeNI(grossSalary);
  const noSacNet = grossSalary - noSacTax.total - noSacNI - noSacPension;
  const noSacTotalPension = noSacPension + grossSalary * (employerPensionPercent / 100);

  const totalBenefit = (netPayAtOptimal + bestPensionBoost + optimalAmount) - noSacNet;

  return {
    optimalSacrificeAmount: optimalAmount,
    netPayAfterSacrifice: netPayAtOptimal,
    pensionBoost: bestPensionBoost,
    personalAllowanceRecovered: bestPARecovered,
    totalBenefit,
  };
}
