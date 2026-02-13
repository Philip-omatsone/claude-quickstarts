import {
  MortgageTerms,
  AmortisationRow,
  RemortgageScenario,
  PropertyProjection,
} from "./types";

/**
 * Calculate monthly mortgage payment using standard amortisation formula:
 * M = P[r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  balance: number,
  annualRate: number,
  termMonths: number,
): number {
  if (balance <= 0 || termMonths <= 0) return 0;
  if (annualRate <= 0) return balance / termMonths;
  const r = annualRate / 100 / 12;
  const n = termMonths;
  return (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Generate full amortisation schedule for a mortgage.
 * Includes optional overpayments and tracks cumulative interest/principal.
 */
export function generateAmortisationSchedule(
  mortgage: MortgageTerms,
  startDate: string = new Date().toISOString().slice(0, 7),
  overpaymentSchedule?: Map<number, number>, // month index → overpayment amount
): AmortisationRow[] {
  const schedule: AmortisationRow[] = [];
  let balance = mortgage.outstandingBalance;
  const monthlyRate = mortgage.interestRate / 100 / 12;
  const basePayment = mortgage.monthlyPayment || calculateMonthlyPayment(
    mortgage.outstandingBalance,
    mortgage.interestRate,
    mortgage.termMonthsRemaining,
  );

  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  const [startYear, startMonth] = startDate.split("-").map(Number);

  // Annual overpayment limit (typically 10% of original balance per year)
  const maxAnnualOverpayment = mortgage.outstandingBalance * (mortgage.maxOverpaymentPercent / 100);

  for (let month = 0; month < mortgage.termMonthsRemaining && balance > 0; month++) {
    const dateMonth = ((startMonth - 1 + month) % 12) + 1;
    const dateYear = startYear + Math.floor((startMonth - 1 + month) / 12);
    const date = `${dateYear}-${String(dateMonth).padStart(2, "0")}`;

    const openingBalance = balance;
    const interestPortion = balance * monthlyRate;
    const payment = Math.min(basePayment, balance + interestPortion);
    const principalPortion = payment - interestPortion;

    // Overpayment logic
    let overpayment = overpaymentSchedule?.get(month) ?? mortgage.overpaymentMonthly;

    // Check annual overpayment cap
    const yearStart = Math.floor(month / 12) * 12;
    let yearOverpaid = 0;
    for (let m = yearStart; m < month; m++) {
      const prevRow = schedule[m];
      if (prevRow) yearOverpaid += prevRow.overpayment;
    }
    const remainingAllowance = Math.max(0, maxAnnualOverpayment - yearOverpaid);
    overpayment = Math.min(overpayment, remainingAllowance);
    overpayment = Math.min(overpayment, balance - principalPortion); // can't overpay more than balance

    balance = Math.max(0, balance - principalPortion - overpayment);
    cumulativeInterest += interestPortion;
    cumulativePrincipal += principalPortion + overpayment;

    // Projected property value (simple linear appreciation per month)
    const monthlyAppreciation = Math.pow(1 + 0.04 / 12, month + 1); // default 4% annual
    const projectedValue = mortgage.propertyValue * monthlyAppreciation;

    schedule.push({
      month: month + 1,
      date,
      openingBalance,
      payment,
      interestPortion,
      principalPortion,
      overpayment,
      closingBalance: balance,
      cumulativeInterest,
      cumulativePrincipal,
      equity: projectedValue - balance,
    });

    if (balance <= 0) break;
  }

  return schedule;
}

/**
 * Compare different remortgage scenarios.
 * Returns an amortisation schedule for each scenario.
 */
export function compareRemortgageScenarios(
  currentMortgage: MortgageTerms,
  scenarios: RemortgageScenario[],
  startDate: string = new Date().toISOString().slice(0, 7),
): { scenario: RemortgageScenario; schedule: AmortisationRow[]; totalCost: number; totalInterest: number }[] {
  return scenarios.map((scenario) => {
    const newTermMonths = scenario.newTermYears * 12;
    const newPayment = calculateMonthlyPayment(
      currentMortgage.outstandingBalance,
      scenario.newRate,
      newTermMonths,
    );

    const newMortgage: MortgageTerms = {
      ...currentMortgage,
      interestRate: scenario.newRate,
      termMonthsRemaining: newTermMonths,
      monthlyPayment: newPayment,
    };

    const schedule = generateAmortisationSchedule(newMortgage, startDate);
    const totalInterest = schedule.reduce((sum, row) => sum + row.interestPortion, 0);
    const totalCost = totalInterest + scenario.fees;

    return { scenario, schedule, totalCost, totalInterest };
  });
}

/**
 * Project property value over time using a given appreciation rate.
 */
export function projectPropertyValue(
  currentValue: number,
  appreciationRate: number, // annual %
  months: number,
): PropertyProjection {
  const monthlyRate = Math.pow(1 + appreciationRate / 100, 1 / 12) - 1;
  const monthlyValues: number[] = [];

  for (let m = 0; m < months; m++) {
    monthlyValues.push(currentValue * Math.pow(1 + monthlyRate, m + 1));
  }

  return {
    currentValue,
    appreciationRate,
    monthlyValues,
    equityOverTime: [], // filled by combining with amortisation
  };
}

/**
 * Calculate the interest saved and years reduced by making overpayments.
 */
export function overpaymentAnalysis(
  mortgage: MortgageTerms,
  monthlyOverpayment: number,
): {
  withoutOverpayment: { totalInterest: number; totalMonths: number };
  withOverpayment: { totalInterest: number; totalMonths: number };
  interestSaved: number;
  monthsReduced: number;
} {
  const scheduleWithout = generateAmortisationSchedule({
    ...mortgage,
    overpaymentMonthly: 0,
  });

  const scheduleWith = generateAmortisationSchedule({
    ...mortgage,
    overpaymentMonthly: monthlyOverpayment,
  });

  const interestWithout = scheduleWithout.reduce((s, r) => s + r.interestPortion, 0);
  const interestWith = scheduleWith.reduce((s, r) => s + r.interestPortion, 0);

  return {
    withoutOverpayment: {
      totalInterest: interestWithout,
      totalMonths: scheduleWithout.length,
    },
    withOverpayment: {
      totalInterest: interestWith,
      totalMonths: scheduleWith.length,
    },
    interestSaved: interestWithout - interestWith,
    monthsReduced: scheduleWithout.length - scheduleWith.length,
  };
}
