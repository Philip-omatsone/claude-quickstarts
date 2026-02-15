import type { MetricType, RagStatus, RagThreshold } from '../types';

const DEFAULT_THRESHOLDS: RagThreshold[] = [
  { metricType: 'revenue', greenMin: 5, amberMin: 0, amberMax: 5 },
  { metricType: 'net_income', greenMin: 0 },
  { metricType: 'operating_income', greenMin: 0 },
  { metricType: 'bad_debt_ratio', greenMax: 2, amberMin: 2, amberMax: 5 },
  { metricType: 'provision_coverage', greenMin: 100, amberMin: 80, amberMax: 100 },
  { metricType: 'npl_ratio', greenMax: 3, amberMin: 3, amberMax: 5 },
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

  if (metricType === 'bad_debt_ratio' || metricType === 'npl_ratio') {
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

  if (metricType === 'provision_coverage') {
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
      return 'bg-rag-green/10 border-rag-green';
    case 'amber':
      return 'bg-rag-amber/10 border-rag-amber';
    case 'red':
      return 'bg-rag-red/10 border-rag-red';
  }
}
