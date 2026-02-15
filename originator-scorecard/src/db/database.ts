import Dexie, { type Table } from 'dexie';
import type { Originator, FinancialMetric, Headline } from '../types';

export class OriginatorDatabase extends Dexie {
  originators!: Table<Originator, string>;
  metrics!: Table<FinancialMetric, string>;
  headlines!: Table<Headline, string>;

  constructor() {
    super('OriginatorDashboard');
    this.version(1).stores({
      originators: 'id, name, sector, createdAt',
      metrics: 'id, originatorId, metricType, period, date, [originatorId+metricType], [originatorId+period]',
      headlines: 'id, originatorId, date, category, createdAt',
    });
  }
}

export const db = new OriginatorDatabase();
