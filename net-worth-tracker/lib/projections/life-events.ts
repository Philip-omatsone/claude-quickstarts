import {
  LifeEvent,
  ChildEventParams,
  CareerBreakParams,
  CareerChangeParams,
  InheritanceParams,
  RedundancyParams,
  PartTimeParams,
  RetirementParams,
  PropertyMoveParams,
  InflationRates,
} from "./types";

// ─── Life Event Impact Calculation ───────────────────────────────────

export interface MonthlyImpact {
  person1IncomeMultiplier: number; // 1.0 = no change, 0.0 = no income
  person2IncomeMultiplier: number;
  person1SalaryOverride: number | null; // null = no override
  person2SalaryOverride: number | null;
  additionalExpenses: number;
  lumpSumIncome: number;
  lumpSumExpense: number;
  newMortgage: PropertyMoveParams | null;
}

const DEFAULT_IMPACT: MonthlyImpact = {
  person1IncomeMultiplier: 1.0,
  person2IncomeMultiplier: 1.0,
  person1SalaryOverride: null,
  person2SalaryOverride: null,
  additionalExpenses: 0,
  lumpSumIncome: 0,
  lumpSumExpense: 0,
  newMortgage: null,
};

/**
 * Calculate the combined impact of all enabled life events for a given month.
 */
export function calculateLifeEventImpact(
  events: LifeEvent[],
  monthIndex: number,
  inflation: InflationRates,
): MonthlyImpact {
  const impact = { ...DEFAULT_IMPACT };

  for (const event of events) {
    if (!event.enabled) continue;

    const eventStart = event.startMonth;
    const eventEnd = event.durationMonths
      ? eventStart + event.durationMonths
      : Infinity;

    if (monthIndex < eventStart || monthIndex >= eventEnd) continue;

    const monthsIntoEvent = monthIndex - eventStart;

    switch (event.params.type) {
      case "child":
        applyChildEvent(impact, event.params, monthsIntoEvent, inflation);
        break;
      case "career_break":
        applyCareerBreak(impact, event.params);
        break;
      case "career_change":
        applyCareerChange(impact, event.params);
        break;
      case "inheritance":
        applyInheritance(impact, event.params, monthsIntoEvent);
        break;
      case "redundancy":
        applyRedundancy(impact, event.params, monthsIntoEvent);
        break;
      case "part_time":
        applyPartTime(impact, event.params);
        break;
      case "retirement":
        applyRetirement(impact, event.params);
        break;
      case "property_move":
        applyPropertyMove(impact, event.params, monthsIntoEvent);
        break;
    }
  }

  return impact;
}

// ─── Individual Event Handlers ───────────────────────────────────────

function applyChildEvent(
  impact: MonthlyImpact,
  params: ChildEventParams,
  monthsIn: number,
  inflation: InflationRates,
): void {
  // Income reduction for specified person
  if (monthsIn < params.incomeReductionMonths) {
    const multiplier = 1 - params.incomeReductionPercent / 100;
    if (params.person === "person1") {
      impact.person1IncomeMultiplier *= multiplier;
    } else {
      impact.person2IncomeMultiplier *= multiplier;
    }
  }

  // Nursery costs (typically months 12-48 of child's life, i.e. age 1-4)
  // Assume nursery starts ~12 months after birth event
  const nurseryStart = 12;
  const nurseryEnd = nurseryStart + params.nurseryMonths;
  if (monthsIn >= nurseryStart && monthsIn < nurseryEnd) {
    const yearsIn = monthsIn / 12;
    const inflatedCost = params.nurseryCostMonthly * Math.pow(1 + params.childcareCostInflation / 100, yearsIn);
    impact.additionalExpenses += inflatedCost;
  }

  // School fees (if private)
  if (params.schoolFeeMonthly > 0) {
    const schoolStart = nurseryEnd; // school starts after nursery
    const schoolEnd = schoolStart + params.schoolFeeMonths;
    if (monthsIn >= schoolStart && monthsIn < schoolEnd) {
      const yearsIn = monthsIn / 12;
      const inflatedCost = params.schoolFeeMonthly * Math.pow(1 + inflation.educationCosts / 100, yearsIn);
      impact.additionalExpenses += inflatedCost;
    }
  }
}

function applyCareerBreak(impact: MonthlyImpact, params: CareerBreakParams): void {
  const multiplier = 1 - params.incomeReductionPercent / 100;
  if (params.person === "person1") {
    impact.person1IncomeMultiplier *= multiplier;
  } else {
    impact.person2IncomeMultiplier *= multiplier;
  }
}

function applyCareerChange(impact: MonthlyImpact, params: CareerChangeParams): void {
  if (params.person === "person1") {
    impact.person1SalaryOverride = params.newSalary;
  } else {
    impact.person2SalaryOverride = params.newSalary;
  }
}

function applyInheritance(impact: MonthlyImpact, params: InheritanceParams, monthsIn: number): void {
  // Lump sum received in the first month of the event
  if (monthsIn === 0) {
    impact.lumpSumIncome += params.amount;
  }
}

function applyRedundancy(
  impact: MonthlyImpact,
  params: RedundancyParams,
  monthsIn: number,
): void {
  // First month: receive redundancy pay
  if (monthsIn === 0) {
    // Statutory: capped at £643/week, rate depends on age/service
    const statutoryPay = params.statutoryWeeks * 643;
    // Contractual: notice period pay + multiplier
    const contractualPay = params.contractualMonths * (params.contractualMultiplier * 643 * 4);
    impact.lumpSumIncome += statutoryPay + contractualPay;
  }

  // No income during the redundancy period
  if (params.person === "person1") {
    impact.person1IncomeMultiplier = 0;
  } else {
    impact.person2IncomeMultiplier = 0;
  }
}

function applyPartTime(impact: MonthlyImpact, params: PartTimeParams): void {
  const multiplier = 1 - params.hoursReductionPercent / 100;
  if (params.person === "person1") {
    impact.person1IncomeMultiplier *= multiplier;
  } else {
    impact.person2IncomeMultiplier *= multiplier;
  }
}

function applyRetirement(impact: MonthlyImpact, params: RetirementParams): void {
  if (params.person === "person1") {
    impact.person1IncomeMultiplier = 0;
  } else {
    impact.person2IncomeMultiplier = 0;
  }
}

function applyPropertyMove(
  impact: MonthlyImpact,
  params: PropertyMoveParams,
  monthsIn: number,
): void {
  if (monthsIn === 0) {
    // Proceeds from sale
    impact.lumpSumIncome += params.salePrice;
    // Costs: purchase + stamp duty + fees
    impact.lumpSumExpense += params.purchasePrice + params.stampDuty + params.movingCosts;
    // Set up new mortgage
    impact.newMortgage = params;
  }
}

// ─── Helper: Create Default Events ──────────────────────────────────

let _idCounter = 0;
function nextId(): string {
  return `event_${++_idCounter}_${Date.now().toString(36)}`;
}

export function createChildEvent(
  startMonth: number,
  person: "person1" | "person2" = "person2",
): LifeEvent {
  return {
    id: nextId(),
    type: "child",
    name: "Baby",
    startMonth,
    durationMonths: 216, // 18 years
    enabled: true,
    params: {
      type: "child",
      nurseryCostMonthly: 1500,
      nurseryMonths: 36,
      schoolFeeMonthly: 0, // state school by default
      schoolFeeMonths: 0,
      childcareCostInflation: 5,
      incomeReductionPercent: 20,
      incomeReductionMonths: 12,
      person,
    },
  };
}

export function createCareerBreakEvent(
  startMonth: number,
  durationMonths: number,
  person: "person1" | "person2",
): LifeEvent {
  return {
    id: nextId(),
    type: "career_break",
    name: `Career Break (${person === "person1" ? "Person 1" : "Person 2"})`,
    startMonth,
    durationMonths,
    enabled: true,
    params: {
      type: "career_break",
      person,
      incomeReductionPercent: 100,
    },
  };
}

export function createInheritanceEvent(
  startMonth: number,
  amount: number,
): LifeEvent {
  return {
    id: nextId(),
    type: "inheritance",
    name: "Inheritance",
    startMonth,
    durationMonths: 1,
    enabled: true,
    params: {
      type: "inheritance",
      amount,
      taxable: false,
    },
  };
}

export function createRetirementEvent(
  startMonth: number,
  person: "person1" | "person2",
  targetIncome: number,
): LifeEvent {
  return {
    id: nextId(),
    type: "retirement",
    name: `Retirement (${person === "person1" ? "Person 1" : "Person 2"})`,
    startMonth,
    enabled: true,
    params: {
      type: "retirement",
      person,
      targetAnnualIncome: targetIncome,
    },
  };
}
