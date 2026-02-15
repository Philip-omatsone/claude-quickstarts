export interface CsvRow {
  originator: string;
  metric: string;
  value: number;
  period: string;
  [key: string]: string | number;
}

export function parseCsv(text: string): { headers: string[]; rows: CsvRow[] } {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = parseLine(lines[0]).map((h) => h.trim().toLowerCase());

  const originatorIdx = headers.findIndex((h) =>
    ['originator', 'company', 'name', 'entity'].includes(h),
  );
  const metricIdx = headers.findIndex((h) =>
    ['metric', 'metric_type', 'type', 'indicator'].includes(h),
  );
  const valueIdx = headers.findIndex((h) => ['value', 'amount', 'figure'].includes(h));
  const periodIdx = headers.findIndex((h) => ['period', 'date', 'quarter', 'year'].includes(h));

  if (originatorIdx === -1 || valueIdx === -1) {
    return { headers, rows: [] };
  }

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length < Math.max(originatorIdx, valueIdx) + 1) continue;

    const numValue = parseFloat(cols[valueIdx]);
    if (isNaN(numValue)) continue;

    rows.push({
      originator: cols[originatorIdx]?.trim() ?? '',
      metric: metricIdx >= 0 ? cols[metricIdx]?.trim() ?? 'custom' : 'custom',
      value: numValue,
      period: periodIdx >= 0 ? cols[periodIdx]?.trim() ?? '' : '',
    });
  }

  return { headers, rows };
}

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
