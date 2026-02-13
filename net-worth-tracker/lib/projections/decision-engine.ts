import {
  MortgageTerms,
  AssetAllocation,
  OverpaymentVsInvestResult,
  UK_TAX_YEAR_2024_25 as TAX,
} from "./types";
import { calculateIncomeTax, calculateEmployeeNI } from "./tax-engine";
import { overpaymentAnalysis } from "./property-engine";
import { expectedMonthlyReturn } from "./investment-engine";

// ─── Mortgage Overpayment vs ISA vs Pension ──────────────────────────

/**
 * Compare £1 extra going to mortgage overpayment vs ISA vs pension.
 * Takes into account tax rates, investment returns, and pension tax relief.
 */
export function compareOverpaymentVsInvest(
  monthlyAmount: number,
  mortgage: MortgageTerms,
  isaAllocation: AssetAllocation,
  grossSalary: number,
  pensionEmployeePercent: number,
  pensionEmployerPercent: number,
  projectionMonths: number = 300, // 25 years
): OverpaymentVsInvestResult {
  // 1. Mortgage overpayment scenario
  const overpayment = overpaymentAnalysis(mortgage, monthlyAmount);

  // 2. ISA scenario — tax-free growth
  const monthlyReturn = expectedMonthlyReturn(isaAllocation);
  let isaBalance = 0;
  for (let m = 0; m < projectionMonths; m++) {
    isaBalance = (isaBalance + monthlyAmount) * (1 + monthlyReturn);
  }
  // ISA: no tax on gains
  const isaTotalContributed = monthlyAmount * projectionMonths;
  const isaGains = isaBalance - isaTotalContributed;

  // 3. Pension scenario — with tax relief
  // Net cost to employee is monthlyAmount, but gross contribution depends on marginal rate
  const adjustedIncome = grossSalary - grossSalary * (pensionEmployeePercent / 100);
  const taxResult = calculateIncomeTax(grossSalary, grossSalary * (pensionEmployeePercent / 100));

  // Determine marginal rate
  let marginalRate = 0.20; // basic
  if (adjustedIncome > TAX.personalAllowanceTaperThreshold) {
    marginalRate = 0.40; // higher (could be 0.60 with taper but use 0.40 for simplicity)
  }
  if (adjustedIncome > TAX.additionalRateThreshold) {
    marginalRate = 0.45;
  }

  // If in the £100k-£125,140 taper zone, effective marginal is ~60%
  if (adjustedIncome > TAX.personalAllowanceTaperThreshold && adjustedIncome <= TAX.additionalRateThreshold) {
    marginalRate = 0.60; // 40% tax + 20% taper effect
  }

  // Gross pension contribution from net amount
  const grossPensionContrib = monthlyAmount / (1 - marginalRate);
  const taxRelief = grossPensionContrib - monthlyAmount;

  // NI saving if via salary sacrifice
  const niSaving = monthlyAmount * (TAX.niRate + TAX.niEmployerRate);

  // Pension growth (same allocation as ISA for comparison)
  let pensionBalance = 0;
  for (let m = 0; m < projectionMonths; m++) {
    pensionBalance = (pensionBalance + grossPensionContrib) * (1 + monthlyReturn);
  }

  // Pension: 25% tax-free lump sum, rest taxed at assumed 20% in drawdown
  const taxFreePortion = pensionBalance * 0.25;
  const taxablePortion = pensionBalance * 0.75;
  const pensionNetValue = taxFreePortion + taxablePortion * 0.80; // assume basic rate in retirement

  // Break-even rate: mortgage rate where investing in ISA = overpaying
  const totalISAReturned = isaBalance;
  const totalOverpaymentSaved = overpayment.interestSaved;

  // Simple break-even: if mortgage rate < expected investment return, invest
  const annualInvestReturn = (Math.pow(1 + monthlyReturn, 12) - 1) * 100;
  const breakEvenRate = annualInvestReturn; // approximately

  // Determine recommendation
  let recommendation: string;
  if (mortgage.interestRate > annualInvestReturn) {
    recommendation = "Overpay mortgage — your mortgage rate exceeds expected investment returns.";
  } else if (marginalRate >= 0.40) {
    recommendation = "Pension via salary sacrifice — the tax relief at your marginal rate makes this the most efficient use of capital, especially if you're in the personal allowance taper zone.";
  } else {
    recommendation = "ISA — tax-free growth with full flexibility. Your mortgage rate is low enough that investing is likely to outperform overpayment.";
  }

  return {
    overpaymentScenario: {
      interestSaved: overpayment.interestSaved,
      yearsReduced: overpayment.monthsReduced / 12,
      totalCost: monthlyAmount * projectionMonths,
    },
    isaScenario: {
      projectedValue: isaBalance,
      taxOnGains: 0, // ISA is tax-free
      netValue: isaBalance,
    },
    pensionScenario: {
      projectedValue: pensionBalance,
      taxRelief: taxRelief * projectionMonths,
      employerNISaving: niSaving * projectionMonths,
      netValue: pensionNetValue,
    },
    recommendation,
    breakEvenRate,
  };
}

// ─── "One More Year" Analysis ────────────────────────────────────────

/**
 * Calculate how much one additional year of work impacts retirement outcome.
 */
export function oneMoreYearAnalysis(
  currentAge: number,
  grossSalary: number,
  monthlySavings: number,
  currentNetWorth: number,
  pensionPot: number,
  expectedReturnRate: number, // annual %
  targetAnnualSpend: number,
  pensionContribPercent: number,
): {
  retireNow: { sustainableYears: number; monthlyDrawdown: number };
  retireOneMoreYear: { sustainableYears: number; monthlyDrawdown: number; additionalNetWorth: number };
  benefit: { extraNetWorth: number; extraSustainableYears: number };
} {
  const monthlyReturn = Math.pow(1 + expectedReturnRate / 100, 1 / 12) - 1;

  // Scenario 1: Retire now
  const totalNow = currentNetWorth + pensionPot;
  const sustainableYearsNow = estimateSustainableYears(
    totalNow, targetAnnualSpend, expectedReturnRate,
  );

  // Scenario 2: Work one more year
  // Additional savings from 12 months of work
  let additionalSavings = 0;
  let projectedNW = currentNetWorth;
  let projectedPension = pensionPot;

  for (let m = 0; m < 12; m++) {
    // Investment growth on existing assets
    projectedNW *= (1 + monthlyReturn);
    projectedPension *= (1 + monthlyReturn);

    // New savings
    projectedNW += monthlySavings;
    projectedPension += grossSalary / 12 * (pensionContribPercent / 100);
  }

  const totalAfterYear = projectedNW + projectedPension;
  const additionalNetWorth = totalAfterYear - totalNow;

  const sustainableYearsAfter = estimateSustainableYears(
    totalAfterYear, targetAnnualSpend, expectedReturnRate,
  );

  return {
    retireNow: {
      sustainableYears: sustainableYearsNow,
      monthlyDrawdown: targetAnnualSpend / 12,
    },
    retireOneMoreYear: {
      sustainableYears: sustainableYearsAfter,
      monthlyDrawdown: targetAnnualSpend / 12,
      additionalNetWorth,
    },
    benefit: {
      extraNetWorth: additionalNetWorth,
      extraSustainableYears: sustainableYearsAfter - sustainableYearsNow,
    },
  };
}

/**
 * Estimate how many years a pot can sustain a given annual withdrawal,
 * assuming growth at the given rate.
 */
function estimateSustainableYears(
  pot: number,
  annualWithdrawal: number,
  annualReturnPercent: number,
): number {
  if (annualWithdrawal <= 0) return Infinity;
  if (pot <= 0) return 0;

  const r = annualReturnPercent / 100;
  let balance = pot;
  let years = 0;

  // If return > withdrawal rate, it's sustainable indefinitely
  if (pot * r >= annualWithdrawal) return 100; // cap at 100

  while (balance > 0 && years < 100) {
    balance = balance * (1 + r) - annualWithdrawal;
    years++;
  }

  return years;
}

// ─── Break-Even Rate Calculator ──────────────────────────────────────

/**
 * Calculate the mortgage interest rate at which overpaying the mortgage
 * exactly equals investing (after tax).
 * Above this rate: overpay. Below: invest.
 */
export function calculateBreakEvenRate(
  investmentReturnPercent: number,
  marginalTaxRate: number,
  isISA: boolean = true,
): number {
  // ISA returns are tax-free, so break-even = investment return
  if (isISA) return investmentReturnPercent;

  // GIA: returns are taxed at CGT rate (roughly)
  const afterTaxReturn = investmentReturnPercent * (1 - marginalTaxRate);
  return afterTaxReturn;
}
