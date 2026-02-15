import Dexie, { type Table } from 'dexie';
import type { Originator, FinancialMetric, Headline, Covenant } from '../types';

export class OriginatorDatabase extends Dexie {
  originators!: Table<Originator, string>;
  metrics!: Table<FinancialMetric, string>;
  headlines!: Table<Headline, string>;
  covenants!: Table<Covenant, string>;

  constructor() {
    super('OriginatorDashboard');
    this.version(2).stores({
      originators: 'id, name, sector, region, createdAt',
      metrics: 'id, originatorId, metricType, period, date, [originatorId+metricType], [originatorId+period]',
      headlines: 'id, originatorId, date, category, impact, createdAt',
      covenants: 'id, originatorId, name, type, ragStatus, createdAt',
    });
  }
}

export const db = new OriginatorDatabase();
