"use client";

import { useState } from "react";
import { ProjectionScenario, PersonProfile, MortgageTerms, ISAConfig, PensionConfig, InflationRates, DEFAULT_INFLATION, DEFAULT_ASSET_ALLOCATION, UK_TAX_YEAR_2024_25 as TAX } from "@/lib/projections/types";
import { ChevronDown, ChevronUp, User, Home, PiggyBank, TrendingUp, Percent, Calendar } from "lucide-react";

interface ScenarioConfigProps {
  scenario: ProjectionScenario;
  onChange: (scenario: ProjectionScenario) => void;
}

function Section({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 pt-3 bg-white border-t border-slate-100">{children}</div>}
    </div>
  );
}

function CurrencyInput({ label, value, onChange, step = 1000, hint }: { label: string; value: number; onChange: (v: number) => void; step?: number; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">&pound;</span>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={0}
          className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function PercentInput({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={0.1}
          min={0}
          max={100}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function PersonSection({ person, label, onChange }: { person: PersonProfile; label: string; onChange: (p: PersonProfile) => void }) {
  const upd = (updates: Partial<PersonProfile>) => onChange({ ...person, ...updates });
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => upd({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Birth Date</label>
          <input
            type="month"
            value={person.birthDate}
            onChange={(e) => upd({ birthDate: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <CurrencyInput label="Gross Annual Salary" value={person.grossSalary} onChange={(v) => upd({ grossSalary: v })} />
        <PercentInput label="Salary Growth %" value={person.salaryGrowthRate} onChange={(v) => upd({ salaryGrowthRate: v })} hint="Annual %" />
        <PercentInput label="Pension Contribution %" value={person.pensionContributionPercent} onChange={(v) => upd({ pensionContributionPercent: v })} />
        <PercentInput label="Employer Pension %" value={person.employerPensionPercent} onChange={(v) => upd({ employerPensionPercent: v })} />
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Salary Sacrifice</label>
          <select
            value={person.salarySacrifice ? "yes" : "no"}
            onChange={(e) => upd({ salarySacrifice: e.target.value === "yes" })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Student Loan</label>
          <select
            value={person.studentLoan || "none"}
            onChange={(e) => upd({ studentLoan: e.target.value === "none" ? null : e.target.value as PersonProfile["studentLoan"] })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="none">None</option>
            <option value="plan1">Plan 1</option>
            <option value="plan2">Plan 2</option>
            <option value="plan4">Plan 4 (Scotland)</option>
            <option value="plan5">Plan 5</option>
            <option value="postgrad">Postgrad</option>
          </select>
        </div>
        <CurrencyInput label="Current Pension Pot" value={person.currentPensionPot} onChange={(v) => upd({ currentPensionPot: v })} />
        <CurrencyInput label="Current ISA Balance" value={person.currentISA} onChange={(v) => upd({ currentISA: v })} />
        <CurrencyInput label="Current Cash" value={person.currentCash} onChange={(v) => upd({ currentCash: v })} />
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">NI Qualifying Years</label>
          <input
            type="number"
            value={Math.round(person.statePensionWeeks / 52)}
            onChange={(e) => upd({ statePensionWeeks: (parseInt(e.target.value) || 0) * 52 })}
            min={0}
            max={35}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default function ScenarioConfig({ scenario, onChange }: ScenarioConfigProps) {
  const upd = (updates: Partial<ProjectionScenario>) => onChange({ ...scenario, ...updates });
  const updHousehold = (updates: Partial<typeof scenario.household>) => upd({ household: { ...scenario.household, ...updates } });
  const updProperty = (updates: Partial<MortgageTerms>) => upd({ property: { ...scenario.property, ...updates } });
  const updISA = (updates: Partial<ISAConfig>) => upd({ isa: { ...scenario.isa, ...updates } });
  const updPension = (updates: Partial<PensionConfig>) => upd({ pension: { ...scenario.pension, ...updates } });
  const updInflation = (updates: Partial<InflationRates>) => upd({ inflation: { ...scenario.inflation, ...updates } });

  return (
    <div className="space-y-4">
      <Section title="Household Income" icon={<User className="w-4 h-4 text-blue-600" />} defaultOpen>
        <div className="space-y-6">
          <PersonSection
            person={scenario.household.person1}
            label={scenario.household.person1.name || "Person 1"}
            onChange={(p) => updHousehold({ person1: p })}
          />
          {scenario.household.person2 && (
            <PersonSection
              person={scenario.household.person2}
              label={scenario.household.person2.name || "Person 2"}
              onChange={(p) => updHousehold({ person2: p })}
            />
          )}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={scenario.household.marriageAllowanceTransfer}
                onChange={(e) => updHousehold({ marriageAllowanceTransfer: e.target.checked })}
                className="rounded border-slate-300"
              />
              Marriage Allowance Transfer
            </label>
            {!scenario.household.person2 && (
              <button
                onClick={() => updHousehold({
                  person2: {
                    name: "Person 2",
                    birthDate: "1993-01",
                    grossSalary: 40000,
                    salaryGrowthRate: 3.0,
                    pensionContributionPercent: 5,
                    employerPensionPercent: 3,
                    salarySacrifice: false,
                    studentLoan: null,
                    niCategory: "A",
                    taxCode: "1257L",
                    statePensionWeeks: 416,
                    currentPensionPot: 10000,
                    currentISA: 5000,
                    currentGIA: 0,
                    currentCash: 5000,
                  },
                })}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Person 2
              </button>
            )}
          </div>
        </div>
      </Section>

      <Section title="Property & Mortgage" icon={<Home className="w-4 h-4 text-amber-600" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Property Name</label>
            <input
              type="text"
              value={scenario.property.propertyName}
              onChange={(e) => updProperty({ propertyName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <CurrencyInput label="Property Value" value={scenario.property.propertyValue} onChange={(v) => updProperty({ propertyValue: v })} />
          <CurrencyInput label="Mortgage Balance" value={scenario.property.outstandingBalance} onChange={(v) => updProperty({ outstandingBalance: v })} />
          <PercentInput label="Interest Rate" value={scenario.property.interestRate} onChange={(v) => updProperty({ interestRate: v })} />
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Term Remaining (months)</label>
            <input
              type="number"
              value={scenario.property.termMonthsRemaining}
              onChange={(e) => updProperty({ termMonthsRemaining: parseInt(e.target.value) || 0 })}
              min={0}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Fixed Rate Ends</label>
            <input
              type="month"
              value={scenario.property.fixedRateEndDate || ""}
              onChange={(e) => updProperty({ fixedRateEndDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <CurrencyInput label="Monthly Overpayment" value={scenario.property.overpaymentMonthly} onChange={(v) => updProperty({ overpaymentMonthly: v })} step={100} />
          <PercentInput label="Max Annual Overpay %" value={scenario.property.maxOverpaymentPercent} onChange={(v) => updProperty({ maxOverpaymentPercent: v })} hint="Of original balance" />
        </div>
      </Section>

      <Section title="Investments (ISA)" icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <CurrencyInput label="Monthly ISA Contribution" value={scenario.isa.monthlyContribution} onChange={(v) => updISA({ monthlyContribution: v })} step={100} />
          <PercentInput label="Platform Fee" value={scenario.isa.platformFeePercent} onChange={(v) => updISA({ platformFeePercent: v })} hint="Annual %" />
          <PercentInput label="Equity Allocation" value={scenario.isa.allocation.equities} onChange={(v) => updISA({ allocation: { ...scenario.isa.allocation, equities: v, bonds: 100 - v - scenario.isa.allocation.cash } })} />
          <PercentInput label="Equity Expected Return" value={scenario.isa.allocation.equityReturn} onChange={(v) => updISA({ allocation: { ...scenario.isa.allocation, equityReturn: v } })} hint="Annual %" />
          <PercentInput label="Equity Volatility" value={scenario.isa.allocation.equityVolatility} onChange={(v) => updISA({ allocation: { ...scenario.isa.allocation, equityVolatility: v } })} hint="Annual std dev" />
          <PercentInput label="Bond Return" value={scenario.isa.allocation.bondReturn} onChange={(v) => updISA({ allocation: { ...scenario.isa.allocation, bondReturn: v } })} />
        </div>
      </Section>

      <Section title="Pension" icon={<PiggyBank className="w-4 h-4 text-purple-600" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Provider</label>
            <input
              type="text"
              value={scenario.pension.provider}
              onChange={(e) => updPension({ provider: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <CurrencyInput label="Current Pot" value={scenario.pension.currentPot} onChange={(v) => updPension({ currentPot: v })} />
          <PercentInput label="Employee %" value={scenario.pension.employeePercent} onChange={(v) => updPension({ employeePercent: v })} />
          <PercentInput label="Employer %" value={scenario.pension.employerPercent} onChange={(v) => updPension({ employerPercent: v })} />
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Drawdown Age</label>
            <input
              type="number"
              value={scenario.pension.drawdownAge}
              onChange={(e) => updPension({ drawdownAge: parseInt(e.target.value) || 57 })}
              min={57}
              max={75}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <CurrencyInput label="Target Retirement Income" value={scenario.pension.targetIncomeInRetirement} onChange={(v) => updPension({ targetIncomeInRetirement: v })} hint="Annual, today's money" />
          <PercentInput label="Platform Fee" value={scenario.pension.platformFeePercent} onChange={(v) => updPension({ platformFeePercent: v })} hint="Annual %" />
        </div>
      </Section>

      <Section title="Inflation Assumptions" icon={<Percent className="w-4 h-4 text-rose-600" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <PercentInput label="General CPI" value={scenario.inflation.generalCPI} onChange={(v) => updInflation({ generalCPI: v })} />
          <PercentInput label="Wage Growth" value={scenario.inflation.wageGrowth} onChange={(v) => updInflation({ wageGrowth: v })} />
          <PercentInput label="House Price Inflation" value={scenario.inflation.housePriceInflation} onChange={(v) => updInflation({ housePriceInflation: v })} />
          <PercentInput label="Education Costs" value={scenario.inflation.educationCosts} onChange={(v) => updInflation({ educationCosts: v })} />
          <PercentInput label="Rent Inflation" value={scenario.inflation.rentInflation} onChange={(v) => updInflation({ rentInflation: v })} />
        </div>
      </Section>

      <Section title="Projection Settings" icon={<Calendar className="w-4 h-4 text-slate-600" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Projection Years</label>
            <input
              type="number"
              value={Math.round(scenario.projectionMonths / 12)}
              onChange={(e) => upd({ projectionMonths: (parseInt(e.target.value) || 30) * 12 })}
              min={5}
              max={50}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <CurrencyInput label="Monthly Living Expenses" value={scenario.monthlyLivingExpenses} onChange={(v) => upd({ monthlyLivingExpenses: v })} step={100} hint="In today's money" />
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Monte Carlo Runs</label>
            <select
              value={scenario.monteCarlo.numSimulations}
              onChange={(e) => upd({ monteCarlo: { ...scenario.monteCarlo, numSimulations: parseInt(e.target.value) } })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value={1000}>1,000 (fast)</option>
              <option value={5000}>5,000</option>
              <option value={10000}>10,000 (recommended)</option>
            </select>
          </div>
        </div>
      </Section>
    </div>
  );
}
