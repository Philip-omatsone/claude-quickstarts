import type { MetricType, RagStatus, RagThreshold } from '../types';

const DEFAULT_THRESHOLDS: RagThreshold[] = [
  { metricType: 'revenue', greenMin: 5, amberMin: 0, amberMax: 5 },
  { metricType: 'net_income', greenMin: 0 },
  { metricType: 'operating_income', greenMin: 0 },
  { metricType: 'bad_debt_ratio', greenMax: 2, amberMin: 2, amberMax: 5 },
  { metricType: 'provision_coverage', greenMin: 100, amberMin: 80, amberMax: 100 },
  { metricType: 'npl_ratio', greenMax: 3, amberMin: 3, amberMax: 5 },
  { metricType: 'dpd_30', greenMax: 5, amberMin: 5, amberMax: 10 },
  { metricType: 'dpd_60', greenMax: 3, amberMin: 3, amberMax: 7 },
  { metricType: 'dpd_90', greenMax: 2, amberMin: 2, amberMax: 5 },
  { metricType: 'write_off_rate', greenMax: 1, amberMin: 1, amberMax: 3 },
  { metricType: 'recovery_rate', greenMin: 60, amberMin: 40, amberMax: 60 },
  { metricType: 'warehouse_utilisation', greenMax: 80, amberMin: 80, amberMax: 95 },
  { metricType: 'cost_to_income', greenMax: 60, amberMin: 60, amberMax: 80 },
  { metricType: 'return_on_assets', greenMin: 1, amberMin: 0.5, amberMax: 1 },
  { metricType: 'approval_rate', greenMin: 60, amberMin: 40, amberMax: 60 },
];

export function getRagStatus(
  metricType: MetricType,
  currentValue: number,
  previousValue: number | null,
  thresholds: RagThreshold[] = DEFAULT_THRESHOLDS,
): RagStatus {
  const threshold = thresholds.find((t) => t.metricType === metricType);
  if (!threshold) return 'green';

  if (metricType === 'revenue') {
    if (previousValue === null || previousValue === 0) return 'amber';
    const changePercent = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    if (changePercent > 5) return 'green';
    if (changePercent >= 0) return 'amber';
    return 'red';
  }

  if (metricType === 'net_income' || metricType === 'operating_income') {
    if (currentValue < 0) return 'red';
    if (previousValue !== null && currentValue < previousValue) return 'amber';
    return 'green';
  }

  if (
    metricType === 'bad_debt_ratio' || metricType === 'npl_ratio' ||
    metricType === 'dpd_30' || metricType === 'dpd_60' || metricType === 'dpd_90' ||
    metricType === 'write_off_rate' || metricType === 'warehouse_utilisation' ||
    metricType === 'cost_to_income'
  ) {
    if (threshold.greenMax !== undefined && currentValue < threshold.greenMax) return 'green';
    if (
      threshold.amberMin !== undefined &&
      threshold.amberMax !== undefined &&
      currentValue >= threshold.amberMin &&
      currentValue <= threshold.amberMax
    )
      return 'amber';
    return 'red';
  }

  if (
    metricType === 'provision_coverage' || metricType === 'recovery_rate' ||
    metricType === 'return_on_assets' || metricType === 'approval_rate'
  ) {
    if (threshold.greenMin !== undefined && currentValue > threshold.greenMin) return 'green';
    if (
      threshold.amberMin !== undefined &&
      threshold.amberMax !== undefined &&
      currentValue >= threshold.amberMin &&
      currentValue <= threshold.amberMax
    )
      return 'amber';
    return 'red';
  }

  return 'green';
}

export function ragColor(status: RagStatus): string {
  switch (status) {
    case 'green':
      return 'var(--color-rag-green)';
    case 'amber':
      return 'var(--color-rag-amber)';
    case 'red':
      return 'var(--color-rag-red)';
  }
}

export function ragBgClass(status: RagStatus): string {
  switch (status) {
    case 'green':
      return 'bg-rag-green/10 border-l-rag-green';
    case 'amber':
      return 'bg-rag-amber/10 border-l-rag-amber';
    case 'red':
      return 'bg-rag-red/10 border-l-rag-red';
  }
}

export function ragDotClass(status: RagStatus): string {
  switch (status) {
    case 'green':
      return 'bg-rag-green';
    case 'amber':
      return 'bg-rag-amber';
    case 'red':
      return 'bg-rag-red';
  }
}
