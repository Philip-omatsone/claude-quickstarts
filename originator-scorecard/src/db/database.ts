import Dexie, { type Table } from 'dexie';
import type { Originator, FinancialMetric, Headline, Covenant, OriginatorAnalysis, DocumentReport } from '../types';

export class OriginatorDatabase extends Dexie {
  originators!: Table<Originator, string>;
  metrics!: Table<FinancialMetric, string>;
  headlines!: Table<Headline, string>;
  covenants!: Table<Covenant, string>;
  analyses!: Table<OriginatorAnalysis, string>;
  documents!: Table<DocumentReport, string>;

  constructor() {
    super('OriginatorDashboard');
    this.version(2).stores({
      originators: 'id, name, sector, region, createdAt',
      metrics: 'id, originatorId, metricType, period, date, [originatorId+metricType], [originatorId+period]',
      headlines: 'id, originatorId, date, category, impact, createdAt',
      covenants: 'id, originatorId, name, type, ragStatus, createdAt',
    });
    this.version(3).stores({
      originators: 'id, name, sector, region, createdAt',
      metrics: 'id, originatorId, metricType, period, date, [originatorId+metricType], [originatorId+period]',
      headlines: 'id, originatorId, date, category, impact, createdAt',
      covenants: 'id, originatorId, name, type, ragStatus, createdAt',
      analyses: 'id, originatorId, generatedAt',
      documents: 'id, originatorId, uploadedAt',
    });
    // v4: re-seed with updated dates (2025-2026 periods, Feb 2026 headlines)
    this.version(4).stores({
      originators: 'id, name, sector, region, createdAt',
      metrics: 'id, originatorId, metricType, period, date, [originatorId+metricType], [originatorId+period]',
      headlines: 'id, originatorId, date, category, impact, createdAt',
      covenants: 'id, originatorId, name, type, ragStatus, createdAt',
      analyses: 'id, originatorId, generatedAt',
      documents: 'id, originatorId, uploadedAt',
    }).upgrade(async (tx) => {
      // Clear all seed data so it gets re-seeded with current dates
      await tx.table('originators').clear();
      await tx.table('metrics').clear();
      await tx.table('headlines').clear();
      await tx.table('covenants').clear();
      await tx.table('analyses').clear();
    });
  }
}

export const db = new OriginatorDatabase();
