export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}\u00a3${(abs / 1_000_000_000).toFixed(1)}bn`;
  if (abs >= 1_000_000) return `${sign}\u00a3${(abs / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000) return `${sign}\u00a3${(abs / 1_000).toFixed(0)}k`;
  return `${sign}\u00a3${abs.toFixed(0)}`;
}

export function formatCurrencyAxis(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}\u00a3${(abs / 1_000_000_000).toFixed(1)}bn`;
  if (abs >= 1_000_000) return `${sign}\u00a3${(abs / 1_000_000).toFixed(0)}m`;
  if (abs >= 1_000) return `${sign}\u00a3${(abs / 1_000).toFixed(0)}k`;
  return `${sign}\u00a3${abs.toFixed(0)}`;
}

export function formatValue(value: number, unit: string): string {
  if (unit === 'currency') return formatCurrency(value);
  if (unit === 'percentage') return `${value.toFixed(1)}%`;
  if (unit === 'ratio') return value.toFixed(2);
  if (unit === 'months') return `${value.toFixed(0)} mo`;
  return value.toLocaleString();
}

export function formatCompactNumber(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}bn`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}k`;
  return `${sign}${abs.toFixed(0)}`;
}

export function parsePeriodToDate(period: string): Date {
  const [yearStr, rest] = period.split('-');
  const year = parseInt(yearStr);
  if (isNaN(year)) return new Date();
  if (!rest || rest === 'FY') return new Date(year, 11, 31);
  const quarter = parseInt(rest.replace('Q', ''));
  if (isNaN(quarter)) return new Date(year, 11, 31);
  return new Date(year, quarter * 3 - 1, 28);
}

export function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${year}-Q${quarter}`;
}

export function getPeriodOptions(): string[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
  const periods: string[] = [];
  for (let y = currentYear; y >= currentYear - 2; y--) {
    const maxQ = y === currentYear ? currentQuarter : 4;
    for (let q = maxQ; q >= 1; q--) {
      periods.push(`${y}-Q${q}`);
    }
    if (y < currentYear) {
      periods.push(`${y}-FY`);
    }
  }
  return periods;
}

export const ORIGINATOR_COLORS = [
  '#1B2A4A', '#00A3A1', '#E85D75', '#F5A623', '#6C5CE7',
  '#00B894', '#FD79A8', '#636E72',
];
