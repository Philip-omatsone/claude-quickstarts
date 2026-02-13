import {
  TaxBreakdown,
  PensionAllowance,
  StampDutyResult,
  StudentLoanPlan,
  SalarySacrificeComparison,
  UK_TAX_YEAR_2024_25 as TAX,
} from "./types";

// ─── Income Tax ──────────────────────────────────────────────────────

/**
 * Calculate the personal allowance after taper for incomes above £100k.
 * Allowance reduces by £1 for every £2 of income above £100k.
 */
export function personalAllowance(grossIncome: number, pensionContributions: number = 0): number {
  const adjustedIncome = grossIncome - pensionContributions;
  if (adjustedIncome <= TAX.personalAllowanceTaperThreshold) {
    return TAX.personalAllowance;
  }
  const reduction = Math.floor((adjustedIncome - TAX.personalAllowanceTaperThreshold) / 2);
  return Math.max(0, TAX.personalAllowance - reduction);
}

/**
 * Calculate full UK income tax for a given annual gross income.
 * Accounts for pension relief (reducing taxable income) and personal allowance taper.
 */
export function calculateIncomeTax(
  grossAnnualIncome: number,
  pensionContribution: number = 0,
  marriageAllowanceReceived: number = 0,
): { total: number; basic: number; higher: number; additional: number; personalAllowance: number } {
  const pa = personalAllowance(grossAnnualIncome, pensionContribution) + marriageAllowanceReceived;
  const taxableIncome = Math.max(0, grossAnnualIncome - pensionContribution - pa);

  let basic = 0;
  let higher = 0;
  let additional = 0;

  if (taxableIncome > 0) {
    // Basic rate band
    const basicBand = Math.min(taxableIncome, TAX.basicRateLimit);
    basic = basicBand * TAX.basicRate;

    // Higher rate band
    const higherBand = Math.min(
      Math.max(0, taxableIncome - TAX.basicRateLimit),
      TAX.additionalRateThreshold - TAX.personalAllowance - TAX.basicRateLimit,
    );
    higher = higherBand * TAX.higherRate;

    // Additional rate band
    const additionalBand = Math.max(0, taxableIncome - (TAX.additionalRateThreshold - pa));
    // Recalculate: additional rate applies above £125,140 of gross minus PA
    const additionalThresholdTaxable = TAX.additionalRateThreshold - TAX.personalAllowance;
    const additionalActual = Math.max(0, taxableIncome - additionalThresholdTaxable);
    if (additionalActual > 0) {
      // Recalculate higher band correctly
      const higherBandCorrect = Math.min(
        Math.max(0, taxableIncome - TAX.basicRateLimit),
        additionalThresholdTaxable - TAX.basicRateLimit,
      );
      higher = higherBandCorrect * TAX.higherRate;
      additional = additionalActual * TAX.additionalRate;
    }
  }

  return {
    total: basic + higher + additional,
    basic,
    higher,
    additional,
    personalAllowance: pa,
  };
}

// ─── National Insurance ──────────────────────────────────────────────

export function calculateEmployeeNI(grossAnnualIncome: number): number {
  if (grossAnnualIncome <= TAX.niPrimaryThreshold) return 0;

  const mainBand = Math.min(grossAnnualIncome, TAX.niUpperEarningsLimit) - TAX.niPrimaryThreshold;
  const upperBand = Math.max(0, grossAnnualIncome - TAX.niUpperEarningsLimit);

  return mainBand * TAX.niRate + upperBand * TAX.niUpperRate;
}

export function calculateEmployerNI(grossAnnualIncome: number): number {
  if (grossAnnualIncome <= TAX.niEmployerThreshold) return 0;
  return (grossAnnualIncome - TAX.niEmployerThreshold) * TAX.niEmployerRate;
}

// ─── Student Loan ────────────────────────────────────────────────────

export function calculateStudentLoan(grossAnnualIncome: number, plan: StudentLoanPlan | null): number {
  if (!plan) return 0;

  const thresholds: Record<StudentLoanPlan, { threshold: number; rate: number }> = {
    plan1: { threshold: TAX.studentLoanPlan1Threshold, rate: TAX.studentLoanPlan1Rate },
    plan2: { threshold: TAX.studentLoanPlan2Threshold, rate: TAX.studentLoanPlan2Rate },
    plan4: { threshold: TAX.studentLoanPlan4Threshold, rate: TAX.studentLoanPlan4Rate },
    plan5: { threshold: TAX.studentLoanPlan5Threshold, rate: TAX.studentLoanPlan5Rate },
    postgrad: { threshold: TAX.studentLoanPostgradThreshold, rate: TAX.studentLoanPostgradRate },
  };

  const { threshold, rate } = thresholds[plan];
  return Math.max(0, (grossAnnualIncome - threshold) * rate);
}

// ─── Dividends ───────────────────────────────────────────────────────

export function calculateDividendTax(
  dividendIncome: number,
  otherTaxableIncome: number,
): number {
  if (dividendIncome <= 0) return 0;

  const taxableDividends = Math.max(0, dividendIncome - TAX.dividendAllowance);
  if (taxableDividends <= 0) return 0;

  // Determine which band the dividends fall into based on total income
  const totalIncome = otherTaxableIncome + dividendIncome;
  let tax = 0;

  // Space remaining in basic rate band after other income
  const basicBandRemaining = Math.max(0, TAX.higherRateThreshold - otherTaxableIncome);
  const higherBandTop = TAX.additionalRateThreshold;
  const higherBandRemaining = Math.max(0, higherBandTop - Math.max(otherTaxableIncome, TAX.higherRateThreshold));

  // Dividends in basic rate band
  const dividendsInBasic = Math.min(taxableDividends, basicBandRemaining);
  tax += dividendsInBasic * TAX.dividendBasicRate;

  // Dividends in higher rate band
  const dividendsInHigher = Math.min(
    Math.max(0, taxableDividends - dividendsInBasic),
    higherBandRemaining,
  );
  tax += dividendsInHigher * TAX.dividendHigherRate;

  // Dividends in additional rate band
  const dividendsInAdditional = Math.max(
    0,
    taxableDividends - dividendsInBasic - dividendsInHigher,
  );
  tax += dividendsInAdditional * TAX.dividendAdditionalRate;

  return tax;
}

// ─── Capital Gains Tax ───────────────────────────────────────────────

export function calculateCGT(
  gains: number,
  taxableIncome: number,
  isProperty: boolean = false,
): number {
  const taxableGains = Math.max(0, gains - TAX.cgtAllowance);
  if (taxableGains <= 0) return 0;

  const basicBandRemaining = Math.max(0, TAX.higherRateThreshold - taxableIncome);

  const basicRate = isProperty ? TAX.cgtBasicRateProperty : TAX.cgtBasicRateOther;
  const higherRate = isProperty ? TAX.cgtHigherRateProperty : TAX.cgtHigherRateOther;

  const gainsInBasic = Math.min(taxableGains, basicBandRemaining);
  const gainsInHigher = taxableGains - gainsInBasic;

  return gainsInBasic * basicRate + gainsInHigher * higherRate;
}

// ─── High Income Child Benefit Charge ────────────────────────────────

export function calculateHICBC(
  highestEarnerIncome: number,
  numberOfChildren: number,
): number {
  if (numberOfChildren <= 0 || highestEarnerIncome <= TAX.hicbcThreshold) return 0;

  const weeklyBenefit =
    TAX.childBenefitWeeklyFirstChild +
    Math.max(0, numberOfChildren - 1) * TAX.childBenefitWeeklySubsequent;
  const annualBenefit = weeklyBenefit * 52;

  if (highestEarnerIncome >= TAX.hicbcFullCharge) return annualBenefit;

  // Linear taper between £60k and £80k
  const excessIncome = highestEarnerIncome - TAX.hicbcThreshold;
  const range = TAX.hicbcFullCharge - TAX.hicbcThreshold;
  const chargePercent = Math.min(1, excessIncome / range);
  return annualBenefit * chargePercent;
}

// ─── Stamp Duty (SDLT) ──────────────────────────────────────────────

export function calculateStampDuty(
  price: number,
  isAdditional: boolean = false,
  isFirstTimeBuyer: boolean = false,
): StampDutyResult {
  // Standard SDLT bands (from April 2025)
  const standardBands = [
    { from: 0, to: 125000, rate: 0 },
    { from: 125000, to: 250000, rate: 0.02 },
    { from: 250000, to: 925000, rate: 0.05 },
    { from: 925000, to: 1500000, rate: 0.10 },
    { from: 1500000, to: Infinity, rate: 0.12 },
  ];

  // First time buyer bands (up to £625k)
  const ftbBands = [
    { from: 0, to: 300000, rate: 0 },
    { from: 300000, to: 500000, rate: 0.05 },
    { from: 500000, to: 925000, rate: 0.05 },
    { from: 925000, to: 1500000, rate: 0.10 },
    { from: 1500000, to: Infinity, rate: 0.12 },
  ];

  const baseBands = isFirstTimeBuyer && price <= 625000 ? ftbBands : standardBands;
  const additionalSurcharge = isAdditional ? 0.05 : 0;

  const bands: StampDutyResult["bands"] = [];
  let totalTax = 0;

  for (const band of baseBands) {
    if (price <= band.from) break;
    const taxableInBand = Math.min(price, band.to) - band.from;
    const effectiveRate = band.rate + additionalSurcharge;
    const tax = taxableInBand * effectiveRate;
    totalTax += tax;
    if (taxableInBand > 0) {
      bands.push({ from: band.from, to: Math.min(price, band.to), rate: effectiveRate, tax });
    }
  }

  return {
    propertyPrice: price,
    isAdditional,
    isFirstTimeBuyer,
    stampDuty: Math.round(totalTax),
    effectiveRate: price > 0 ? (totalTax / price) * 100 : 0,
    bands,
  };
}

// ─── Pension Allowance ───────────────────────────────────────────────

export function calculatePensionAllowance(
  grossIncome: number,
  carryForward: [number, number, number] = [0, 0, 0],
): PensionAllowance {
  let annualAllowance = TAX.pensionAnnualAllowance;
  let tapered = false;

  // Taper for high earners (threshold income > £260k AND adjusted income > £260k)
  if (grossIncome > TAX.pensionTaperAdjustedIncome) {
    const reduction = Math.floor((grossIncome - TAX.pensionTaperAdjustedIncome) / 2);
    annualAllowance = Math.max(TAX.pensionMinTaperedAllowance, annualAllowance - reduction);
    tapered = true;
  }

  const totalCarryForward = carryForward[0] + carryForward[1] + carryForward[2];

  return {
    annualAllowance,
    tapered,
    taperedAllowance: annualAllowance,
    carryForward,
    totalAvailable: annualAllowance + totalCarryForward,
    usedThisYear: 0,
    remaining: annualAllowance + totalCarryForward,
  };
}

// ─── Marriage Allowance ──────────────────────────────────────────────

export function calculateMarriageAllowanceBenefit(
  lowerEarnerIncome: number,
  higherEarnerIncome: number,
): { transferable: boolean; taxSaving: number } {
  // Lower earner must earn less than personal allowance
  // Higher earner must be basic rate taxpayer (not higher)
  if (lowerEarnerIncome >= TAX.personalAllowance) {
    return { transferable: false, taxSaving: 0 };
  }
  if (higherEarnerIncome > TAX.higherRateThreshold) {
    return { transferable: false, taxSaving: 0 };
  }

  const taxSaving = TAX.marriageAllowanceAmount * TAX.basicRate;
  return { transferable: true, taxSaving };
}

// ─── Full Tax Breakdown ──────────────────────────────────────────────

export function calculateFullTaxBreakdown(
  grossAnnualIncome: number,
  pensionContribution: number = 0,
  studentLoanPlan: StudentLoanPlan | null = null,
  dividendIncome: number = 0,
  capitalGains: number = 0,
  capitalGainsIsProperty: boolean = false,
  numberOfChildren: number = 0,
  marriageAllowanceReceived: number = 0,
): TaxBreakdown {
  // Income tax
  const incomeTaxResult = calculateIncomeTax(
    grossAnnualIncome,
    pensionContribution,
    marriageAllowanceReceived,
  );

  // NI
  const employeeNI = calculateEmployeeNI(grossAnnualIncome - (pensionContribution > 0 ? pensionContribution : 0));
  const employerNI = calculateEmployerNI(grossAnnualIncome);

  // Student loan
  const studentLoan = calculateStudentLoan(grossAnnualIncome, studentLoanPlan);

  // Dividends
  const taxableEmploymentIncome = Math.max(0, grossAnnualIncome - pensionContribution - incomeTaxResult.personalAllowance);
  const dividendTax = calculateDividendTax(dividendIncome, taxableEmploymentIncome);

  // CGT
  const cgt = calculateCGT(capitalGains, taxableEmploymentIncome, capitalGainsIsProperty);

  // HICBC
  const hicbc = calculateHICBC(grossAnnualIncome, numberOfChildren);

  const totalDeductions =
    incomeTaxResult.total + employeeNI + studentLoan + dividendTax + hicbc;

  const netIncome = grossAnnualIncome - totalDeductions - pensionContribution;

  // Marginal rate calculation: what tax on the next £1?
  let marginalRate = TAX.basicRate + TAX.niRate; // 28%
  const adjustedIncome = grossAnnualIncome - pensionContribution;
  if (adjustedIncome > TAX.personalAllowanceTaperThreshold && adjustedIncome < TAX.additionalRateThreshold) {
    // In the taper zone: 40% + 2% NI + 40% taper effect = 62% effective
    marginalRate = TAX.higherRate + TAX.niUpperRate + TAX.higherRate; // 60% + NI
  } else if (adjustedIncome > TAX.higherRateThreshold) {
    marginalRate = TAX.higherRate + TAX.niUpperRate; // 42%
  }
  if (adjustedIncome > TAX.additionalRateThreshold) {
    marginalRate = TAX.additionalRate + TAX.niUpperRate; // 47%
  }

  return {
    grossIncome: grossAnnualIncome,
    personalAllowance: incomeTaxResult.personalAllowance,
    taxableIncome: Math.max(0, grossAnnualIncome - pensionContribution - incomeTaxResult.personalAllowance),
    incomeTax: incomeTaxResult.total,
    basicRateTax: incomeTaxResult.basic,
    higherRateTax: incomeTaxResult.higher,
    additionalRateTax: incomeTaxResult.additional,
    employeeNI,
    employerNI,
    studentLoanRepayment: studentLoan,
    dividendTax,
    capitalGainsTax: cgt,
    highIncomeChildBenefitCharge: hicbc,
    totalDeductions,
    netIncome,
    effectiveTaxRate: grossAnnualIncome > 0 ? (totalDeductions / grossAnnualIncome) * 100 : 0,
    marginalTaxRate: marginalRate * 100,
  };
}

// ─── Salary Sacrifice Comparison ─────────────────────────────────────

export function compareSalarySacrifice(
  grossSalary: number,
  employeePensionPercent: number,
  employerPensionPercent: number,
  sacrificeAmount: number,
): SalarySacrificeComparison {
  // Without sacrifice
  const pensionNoSac = grossSalary * (employeePensionPercent / 100);
  const employerNoSac = grossSalary * (employerPensionPercent / 100);
  const taxNoSac = calculateIncomeTax(grossSalary, pensionNoSac);
  const niNoSac = calculateEmployeeNI(grossSalary);
  const employerNINoSac = calculateEmployerNI(grossSalary);
  const netNoSac = grossSalary - taxNoSac.total - niNoSac - pensionNoSac;

  // With sacrifice
  const adjustedSalary = grossSalary - sacrificeAmount;
  const pensionSac = adjustedSalary * (employeePensionPercent / 100);
  const employerSac = adjustedSalary * (employerPensionPercent / 100);
  const taxSac = calculateIncomeTax(adjustedSalary, pensionSac);
  const niSac = calculateEmployeeNI(adjustedSalary);
  const employerNISac = calculateEmployerNI(adjustedSalary);
  const employerNISaving = employerNINoSac - employerNISac;

  const totalPensionSac = pensionSac + employerSac + sacrificeAmount + employerNISaving;
  const netSac = adjustedSalary - taxSac.total - niSac - pensionSac;

  return {
    withoutSacrifice: {
      grossSalary,
      incomeTax: taxNoSac.total,
      employeeNI: niNoSac,
      employerNI: employerNINoSac,
      netPay: netNoSac,
      pensionContribution: pensionNoSac + employerNoSac,
      totalPensionInflow: pensionNoSac + employerNoSac,
    },
    withSacrifice: {
      grossSalary,
      adjustedSalary,
      incomeTax: taxSac.total,
      employeeNI: niSac,
      employerNI: employerNISac,
      netPay: netSac,
      pensionContribution: pensionSac + employerSac + sacrificeAmount,
      employerNISaving,
      totalPensionInflow: totalPensionSac,
    },
    netBenefit: (netSac + totalPensionSac) - (netNoSac + pensionNoSac + employerNoSac),
    pensionBoost: totalPensionSac - (pensionNoSac + employerNoSac),
  };
}
