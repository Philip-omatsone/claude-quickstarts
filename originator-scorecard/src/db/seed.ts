import { v4 as uuid } from 'uuid';
import { db } from './database';
import type { MetricType, MetricUnit, HeadlineCategory, HeadlineImpact } from '../types';

const SEED_VERSION = '2026-02';

export async function seedDemoData() {
  const currentSeedVersion = localStorage.getItem('seed_version');
  if (currentSeedVersion !== SEED_VERSION) {
    // Clear stale seed data and re-seed with updated dates
    await db.originators.clear();
    await db.metrics.clear();
    await db.headlines.clear();
    await db.covenants.clear();
    await db.analyses.clear();
    localStorage.setItem('seed_version', SEED_VERSION);
  }

  const count = await db.originators.count();
  if (count > 0) return;

  const now = new Date();

  // Create three originators with asset finance focus
  const org1Id = uuid();
  const org2Id = uuid();
  const org3Id = uuid();

  await db.originators.bulkAdd([
    { id: org1Id, name: 'Aldermore Asset Finance', sector: 'Asset Finance', region: 'South East', createdAt: now },
    { id: org2Id, name: 'Close Brothers Leasing', sector: 'Asset Finance', region: 'London', createdAt: now },
    { id: org3Id, name: 'Shawbrook Business Finance', sector: 'Asset Finance', region: 'North West', createdAt: now },
  ]);

  const periods = ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2'];
  const baseDate = new Date('2025-03-31');

  interface MetricDef { metricType: MetricType; label: string; unit: MetricUnit; values: Record<string, number[]> }

  const metricDefs: MetricDef[] = [
    // Portfolio Overview
    { metricType: 'total_aum', label: 'Total AuM', unit: 'currency', values: {
      [org1Id]: [850000000, 890000000, 920000000, 980000000, 1020000000, 1060000000],
      [org2Id]: [620000000, 640000000, 660000000, 700000000, 730000000, 760000000],
      [org3Id]: [410000000, 430000000, 450000000, 470000000, 490000000, 510000000],
    }},
    { metricType: 'warehouse_utilisation', label: 'Warehouse Utilisation', unit: 'percentage', values: {
      [org1Id]: [72, 75, 78, 82, 79, 76],
      [org2Id]: [65, 68, 71, 74, 72, 69],
      [org3Id]: [80, 83, 86, 89, 85, 82],
    }},
    { metricType: 'live_contracts', label: 'Live Contracts', unit: 'number', values: {
      [org1Id]: [4200, 4350, 4500, 4680, 4820, 4950],
      [org2Id]: [3100, 3200, 3300, 3450, 3550, 3650],
      [org3Id]: [2050, 2120, 2200, 2280, 2350, 2420],
    }},
    { metricType: 'weighted_avg_term', label: 'Wtd Avg Remaining Term', unit: 'months', values: {
      [org1Id]: [42, 41, 40, 39, 40, 41],
      [org2Id]: [36, 35, 35, 34, 35, 36],
      [org3Id]: [48, 47, 46, 45, 46, 47],
    }},
    // Credit Quality
    { metricType: 'bad_debt_ratio', label: 'Bad Debt Ratio', unit: 'percentage', values: {
      [org1Id]: [1.4, 1.5, 1.6, 1.5, 1.4, 1.3],
      [org2Id]: [1.8, 2.0, 2.2, 2.1, 1.9, 1.8],
      [org3Id]: [2.5, 2.7, 3.0, 2.8, 2.6, 2.4],
    }},
    { metricType: 'npl_ratio', label: 'NPL Ratio', unit: 'percentage', values: {
      [org1Id]: [2.1, 2.3, 2.5, 2.3, 2.2, 2.0],
      [org2Id]: [2.8, 3.0, 3.3, 3.1, 2.9, 2.7],
      [org3Id]: [3.5, 3.8, 4.1, 3.9, 3.6, 3.4],
    }},
    { metricType: 'dpd_30', label: '30+ DPD Arrears', unit: 'percentage', values: {
      [org1Id]: [3.2, 3.5, 3.8, 3.4, 3.1, 2.9],
      [org2Id]: [4.1, 4.5, 4.8, 4.4, 4.0, 3.8],
      [org3Id]: [5.2, 5.6, 6.0, 5.7, 5.3, 5.0],
    }},
    { metricType: 'dpd_60', label: '60+ DPD Arrears', unit: 'percentage', values: {
      [org1Id]: [1.5, 1.7, 1.9, 1.7, 1.5, 1.4],
      [org2Id]: [2.0, 2.3, 2.5, 2.3, 2.1, 1.9],
      [org3Id]: [2.8, 3.1, 3.4, 3.2, 2.9, 2.7],
    }},
    { metricType: 'dpd_90', label: '90+ DPD Arrears', unit: 'percentage', values: {
      [org1Id]: [0.8, 0.9, 1.0, 0.9, 0.8, 0.7],
      [org2Id]: [1.1, 1.3, 1.5, 1.3, 1.2, 1.0],
      [org3Id]: [1.6, 1.8, 2.0, 1.9, 1.7, 1.5],
    }},
    { metricType: 'provision_coverage', label: 'Provision Coverage', unit: 'percentage', values: {
      [org1Id]: [108, 106, 103, 105, 108, 110],
      [org2Id]: [95, 93, 90, 92, 95, 97],
      [org3Id]: [85, 82, 78, 80, 84, 87],
    }},
    { metricType: 'write_off_rate', label: 'Write-off Rate', unit: 'percentage', values: {
      [org1Id]: [0.4, 0.5, 0.5, 0.4, 0.4, 0.3],
      [org2Id]: [0.7, 0.8, 0.9, 0.8, 0.7, 0.6],
      [org3Id]: [1.1, 1.2, 1.4, 1.3, 1.1, 1.0],
    }},
    { metricType: 'recovery_rate', label: 'Recovery Rate', unit: 'percentage', values: {
      [org1Id]: [72, 70, 68, 70, 73, 75],
      [org2Id]: [65, 63, 60, 62, 65, 67],
      [org3Id]: [55, 52, 48, 50, 54, 57],
    }},
    // Origination
    { metricType: 'new_advance_volume', label: 'New Advance Volume', unit: 'currency', values: {
      [org1Id]: [120000000, 130000000, 125000000, 145000000, 150000000, 155000000],
      [org2Id]: [85000000, 92000000, 88000000, 100000000, 105000000, 110000000],
      [org3Id]: [55000000, 60000000, 57000000, 65000000, 68000000, 72000000],
    }},
    { metricType: 'avg_deal_size', label: 'Average Deal Size', unit: 'currency', values: {
      [org1Id]: [185000, 190000, 188000, 195000, 198000, 202000],
      [org2Id]: [142000, 145000, 143000, 148000, 150000, 153000],
      [org3Id]: [95000, 98000, 96000, 100000, 102000, 105000],
    }},
    { metricType: 'approval_rate', label: 'Approval Rate', unit: 'percentage', values: {
      [org1Id]: [68, 67, 65, 66, 69, 71],
      [org2Id]: [72, 71, 69, 70, 73, 74],
      [org3Id]: [62, 60, 58, 59, 63, 65],
    }},
    { metricType: 'weighted_avg_yield', label: 'Wtd Avg Yield', unit: 'percentage', values: {
      [org1Id]: [7.2, 7.3, 7.4, 7.3, 7.1, 7.0],
      [org2Id]: [8.1, 8.2, 8.4, 8.3, 8.0, 7.9],
      [org3Id]: [9.5, 9.7, 9.9, 9.8, 9.4, 9.2],
    }},
    // Financials
    { metricType: 'revenue', label: 'Revenue', unit: 'currency', values: {
      [org1Id]: [38000000, 40000000, 42000000, 45000000, 47000000, 49000000],
      [org2Id]: [28000000, 29000000, 30000000, 32000000, 34000000, 35000000],
      [org3Id]: [18000000, 19000000, 20000000, 21000000, 22000000, 23000000],
    }},
    { metricType: 'operating_income', label: 'Operating Income', unit: 'currency', values: {
      [org1Id]: [15000000, 16000000, 17000000, 18000000, 19000000, 20000000],
      [org2Id]: [10000000, 10500000, 11000000, 12000000, 12500000, 13000000],
      [org3Id]: [6000000, 6200000, 6500000, 7000000, 7300000, 7600000],
    }},
    { metricType: 'net_income', label: 'Net Income', unit: 'currency', values: {
      [org1Id]: [11000000, 11500000, 12000000, 13000000, 13500000, 14000000],
      [org2Id]: [7500000, 7800000, 8000000, 8500000, 9000000, 9300000],
      [org3Id]: [4200000, 4400000, 4600000, 4900000, 5100000, 5300000],
    }},
    { metricType: 'cost_to_income', label: 'Cost-to-Income Ratio', unit: 'percentage', values: {
      [org1Id]: [55, 54, 53, 52, 51, 50],
      [org2Id]: [62, 61, 60, 58, 57, 56],
      [org3Id]: [68, 67, 66, 64, 63, 62],
    }},
    { metricType: 'return_on_assets', label: 'Return on Assets', unit: 'percentage', values: {
      [org1Id]: [1.3, 1.3, 1.4, 1.4, 1.4, 1.5],
      [org2Id]: [1.1, 1.1, 1.2, 1.2, 1.2, 1.3],
      [org3Id]: [0.9, 0.9, 1.0, 1.0, 1.0, 1.1],
    }},
    { metricType: 'total_assets', label: 'Total Assets', unit: 'currency', values: {
      [org1Id]: [900000000, 940000000, 970000000, 1030000000, 1070000000, 1110000000],
      [org2Id]: [660000000, 680000000, 700000000, 740000000, 770000000, 800000000],
      [org3Id]: [440000000, 460000000, 480000000, 500000000, 520000000, 540000000],
    }},
    // Asset finance specific
    { metricType: 'hp_split', label: 'HP Split', unit: 'percentage', values: {
      [org1Id]: [45, 44, 43, 42, 41, 40],
      [org2Id]: [55, 54, 53, 52, 51, 50],
      [org3Id]: [38, 37, 36, 36, 35, 35],
    }},
    { metricType: 'finance_lease_split', label: 'Finance Lease Split', unit: 'percentage', values: {
      [org1Id]: [35, 36, 37, 38, 39, 40],
      [org2Id]: [30, 31, 32, 33, 34, 35],
      [org3Id]: [42, 43, 44, 44, 45, 45],
    }},
    { metricType: 'operating_lease_split', label: 'Operating Lease Split', unit: 'percentage', values: {
      [org1Id]: [20, 20, 20, 20, 20, 20],
      [org2Id]: [15, 15, 15, 15, 15, 15],
      [org3Id]: [20, 20, 20, 20, 20, 20],
    }},
    { metricType: 'avg_contract_term', label: 'Avg Contract Term', unit: 'months', values: {
      [org1Id]: [48, 48, 49, 49, 50, 50],
      [org2Id]: [36, 36, 37, 37, 38, 38],
      [org3Id]: [54, 54, 55, 55, 56, 56],
    }},
  ];

  const metrics = metricDefs.flatMap((def) =>
    Object.entries(def.values).flatMap(([orgId, values]) =>
      periods.map((period, i) => {
        const date = new Date(baseDate);
        date.setMonth(date.getMonth() + i * 3);
        return {
          id: uuid(),
          originatorId: orgId,
          metricType: def.metricType,
          label: def.label,
          value: values[i],
          period,
          date,
          unit: def.unit,
          source: 'manual' as const,
          createdAt: now,
        };
      }),
    ),
  );

  await db.metrics.bulkAdd(metrics);

  // Headlines
  const headlineDefs = [
    { title: 'Aldermore reports 12% AuM growth in Q2 2026', source: 'Financial Times', category: 'earnings' as HeadlineCategory, impact: 'high' as HeadlineImpact, date: new Date('2026-02-14'), originatorId: org1Id },
    { title: 'FCA tightens asset finance lending standards for 2026', source: 'Reuters', category: 'regulatory' as HeadlineCategory, impact: 'high' as HeadlineImpact, date: new Date('2026-02-10') },
    { title: 'UK SME lending outlook upgraded by Bank of England', source: 'Bloomberg', category: 'market' as HeadlineCategory, impact: 'medium' as HeadlineImpact, date: new Date('2026-02-05') },
    { title: 'Close Brothers Leasing arrears tick up in Q4 2025', source: 'S&P Global', category: 'risk' as HeadlineCategory, impact: 'high' as HeadlineImpact, date: new Date('2026-01-28'), originatorId: org2Id },
    { title: 'British Business Bank expands Enable Funding programme', source: 'GOV.UK', category: 'general' as HeadlineCategory, impact: 'medium' as HeadlineImpact, date: new Date('2026-01-20') },
    { title: 'Shawbrook launches new digital onboarding platform', source: 'Finextra', category: 'general' as HeadlineCategory, impact: 'low' as HeadlineImpact, date: new Date('2026-01-12'), originatorId: org3Id },
    { title: 'Asset finance new business volumes up 8% YoY', source: 'FLA', category: 'market' as HeadlineCategory, impact: 'medium' as HeadlineImpact, date: new Date('2025-12-18') },
    { title: 'Aldermore achieves BBB+ credit rating upgrade', source: 'Moody\'s', category: 'earnings' as HeadlineCategory, impact: 'high' as HeadlineImpact, date: new Date('2025-12-05'), originatorId: org1Id },
  ];

  const headlines = headlineDefs.map((h) => ({
    id: uuid(),
    ...h,
    createdAt: now,
  }));

  await db.headlines.bulkAdd(headlines);

  // Covenants
  const covenants = [
    // Aldermore
    { originatorId: org1Id, name: 'Bad Debt Ratio', type: 'financial' as const, metricType: 'bad_debt_ratio' as const, threshold: 3.0, direction: 'below' as const, currentLevel: 1.3, trend: 'improving' as const },
    { originatorId: org1Id, name: 'NPL Ratio', type: 'financial' as const, metricType: 'npl_ratio' as const, threshold: 5.0, direction: 'below' as const, currentLevel: 2.0, trend: 'improving' as const },
    { originatorId: org1Id, name: 'Provision Coverage', type: 'financial' as const, metricType: 'provision_coverage' as const, threshold: 90, direction: 'above' as const, currentLevel: 110, trend: 'improving' as const },
    { originatorId: org1Id, name: 'Warehouse Utilisation', type: 'portfolio' as const, metricType: 'warehouse_utilisation' as const, threshold: 90, direction: 'below' as const, currentLevel: 76, trend: 'improving' as const },
    { originatorId: org1Id, name: 'Cost-to-Income', type: 'financial' as const, metricType: 'cost_to_income' as const, threshold: 70, direction: 'below' as const, currentLevel: 50, trend: 'improving' as const },
    // Close Brothers
    { originatorId: org2Id, name: 'Bad Debt Ratio', type: 'financial' as const, metricType: 'bad_debt_ratio' as const, threshold: 3.0, direction: 'below' as const, currentLevel: 1.8, trend: 'stable' as const },
    { originatorId: org2Id, name: 'NPL Ratio', type: 'financial' as const, metricType: 'npl_ratio' as const, threshold: 5.0, direction: 'below' as const, currentLevel: 2.7, trend: 'improving' as const },
    { originatorId: org2Id, name: 'Provision Coverage', type: 'financial' as const, metricType: 'provision_coverage' as const, threshold: 90, direction: 'above' as const, currentLevel: 97, trend: 'improving' as const },
    { originatorId: org2Id, name: 'Warehouse Utilisation', type: 'portfolio' as const, metricType: 'warehouse_utilisation' as const, threshold: 90, direction: 'below' as const, currentLevel: 69, trend: 'improving' as const },
    { originatorId: org2Id, name: 'Cost-to-Income', type: 'financial' as const, metricType: 'cost_to_income' as const, threshold: 70, direction: 'below' as const, currentLevel: 56, trend: 'improving' as const },
    // Shawbrook
    { originatorId: org3Id, name: 'Bad Debt Ratio', type: 'financial' as const, metricType: 'bad_debt_ratio' as const, threshold: 3.0, direction: 'below' as const, currentLevel: 2.4, trend: 'improving' as const },
    { originatorId: org3Id, name: 'NPL Ratio', type: 'financial' as const, metricType: 'npl_ratio' as const, threshold: 5.0, direction: 'below' as const, currentLevel: 3.4, trend: 'improving' as const },
    { originatorId: org3Id, name: 'Provision Coverage', type: 'financial' as const, metricType: 'provision_coverage' as const, threshold: 90, direction: 'above' as const, currentLevel: 87, trend: 'improving' as const },
    { originatorId: org3Id, name: 'Warehouse Utilisation', type: 'portfolio' as const, metricType: 'warehouse_utilisation' as const, threshold: 90, direction: 'below' as const, currentLevel: 82, trend: 'deteriorating' as const },
    { originatorId: org3Id, name: 'Cost-to-Income', type: 'financial' as const, metricType: 'cost_to_income' as const, threshold: 70, direction: 'below' as const, currentLevel: 62, trend: 'improving' as const },
  ].map((c) => {
    const headroomAbsolute = c.direction === 'below'
      ? c.threshold - c.currentLevel
      : c.currentLevel - c.threshold;
    const headroomPercent = (headroomAbsolute / c.threshold) * 100;
    let ragStatus: 'green' | 'amber' | 'red';
    if (headroomPercent > 30) ragStatus = 'green';
    else if (headroomPercent > 10) ragStatus = 'amber';
    else ragStatus = 'red';
    return {
      id: uuid(),
      ...c,
      headroomAbsolute,
      headroomPercent,
      ragStatus,
      createdAt: now,
    };
  });

  await db.covenants.bulkAdd(covenants);
}
