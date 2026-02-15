interface ExtractedMetric {
  label: string;
  value: number;
  type: string;
  confidence: 'high' | 'medium' | 'low';
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  // Use unpkg CDN as fallback — more reliable than CloudFlare for pdf.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Group text items by Y position to reconstruct lines/rows
    const items = content.items.filter(
      (item): item is { str: string; transform: number[]; width: number; height: number } =>
        'str' in item && item.str.trim().length > 0
    );

    if (items.length === 0) continue;

    // Sort by Y (descending = top to bottom) then X (left to right)
    const sorted = [...items].sort((a, b) => {
      const yDiff = b.transform[5] - a.transform[5];
      if (Math.abs(yDiff) > 3) return yDiff; // different line
      return a.transform[4] - b.transform[4]; // same line, sort by X
    });

    // Group into lines based on Y proximity
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let lastY = sorted[0]?.transform[5] ?? 0;

    for (const item of sorted) {
      const y = item.transform[5];
      if (Math.abs(y - lastY) > 3) {
        if (currentLine.length > 0) lines.push(currentLine);
        currentLine = [];
        lastY = y;
      }
      currentLine.push(item.str);
    }
    if (currentLine.length > 0) lines.push(currentLine);

    // Join each line with tab separators (preserves table structure)
    const pageText = lines.map((line) => line.join('\t')).join('\n');
    fullText += pageText + '\n\n';
  }

  return fullText;
}

// Build a pattern that matches a label, some separator, then a number
function buildPattern(
  labelPattern: string,
  type: string,
  label: string,
  unit: 'currency' | 'percentage' | 'ratio' = 'currency'
): MetricPattern {
  if (unit === 'percentage') {
    return {
      regex: new RegExp(
        `${labelPattern}[:\\s\\t]+([\\d,.]+)\\s*%`,
        'gi'
      ),
      type,
      label,
      unit,
      valueGroup: 1,
    };
  }

  return {
    regex: new RegExp(
      `${labelPattern}[:\\s\\t]+[£$]?\\s*([\\d,]+(?:\\.\\d+)?)\\s*(?:(million|billion|mn|bn|m|b|k|thousand))?`,
      'gi'
    ),
    type,
    label,
    unit,
    valueGroup: 1,
    multiplierGroup: 2,
  };
}

interface MetricPattern {
  regex: RegExp;
  type: string;
  label: string;
  unit: 'currency' | 'percentage' | 'ratio';
  valueGroup: number;
  multiplierGroup?: number;
}

function getMultiplier(str?: string): number {
  if (!str) return 1;
  switch (str.toLowerCase()) {
    case 'billion':
    case 'bn':
    case 'b':
      return 1_000_000_000;
    case 'million':
    case 'mn':
    case 'm':
      return 1_000_000;
    case 'thousand':
    case 'k':
      return 1_000;
    default:
      return 1;
  }
}

// Check if the text context suggests values are in a particular unit (e.g. "£m" header)
function detectImpliedMultiplier(text: string): number {
  // Look for header indicators like "(£m)", "(£'000)", "(£ million)", "in £m"
  const mMatch = /\(?\s*[£$]\s*'?(?:m|mn|million)\s*\)?/i.test(text);
  const kMatch = /\(?\s*[£$]\s*'?(?:000|k|thousand)\s*\)?/i.test(text);
  const bMatch = /\(?\s*[£$]\s*'?(?:bn|b|billion)\s*\)?/i.test(text);

  if (bMatch) return 1_000_000_000;
  if (mMatch) return 1_000_000;
  if (kMatch) return 1_000;
  return 1;
}

export function extractMetricsFromText(text: string): ExtractedMetric[] {
  const metrics: ExtractedMetric[] = [];
  const seen = new Set<string>();

  const impliedMultiplier = detectImpliedMultiplier(text);

  const patterns: MetricPattern[] = [
    // Financials — currency values
    buildPattern('(?:total\\s+)?revenue', 'revenue', 'Revenue'),
    buildPattern('(?:total\\s+)?(?:turnover|sales)', 'revenue', 'Revenue'),
    buildPattern('net\\s+(?:profit|income)', 'net_income', 'Net Income'),
    buildPattern('(?:profit|income)\\s+after\\s+tax', 'net_income', 'Net Income'),
    buildPattern('(?:profit|income)\\s+before\\s+tax', 'operating_income', 'Operating Income'),
    buildPattern('operating\\s+(?:profit|income)', 'operating_income', 'Operating Income'),
    buildPattern('total\\s+assets', 'total_assets', 'Total Assets'),
    buildPattern('(?:total\\s+)?assets\\s+under\\s+management', 'total_aum', 'Assets Under Management'),
    buildPattern('(?:total\\s+)?(?:aum|AUM)', 'total_aum', 'Assets Under Management'),
    buildPattern('(?:new\\s+)?(?:advance|lending)\\s+volume', 'new_advance_volume', 'New Advance Volume'),
    buildPattern('(?:new\\s+)?(?:origination|business)\\s+volume', 'new_advance_volume', 'New Advance Volume'),
    buildPattern('(?:average|avg)\\s+deal\\s+size', 'avg_deal_size', 'Average Deal Size'),

    // Credit quality — percentages
    buildPattern('bad\\s+debt\\s+(?:ratio|rate|charge)', 'bad_debt_ratio', 'Bad Debt Ratio', 'percentage'),
    buildPattern('(?:provision|impairment)\\s+(?:coverage|ratio)', 'provision_coverage', 'Provision Coverage', 'percentage'),
    buildPattern('(?:npl|non[- ]?performing\\s+loan)\\s+ratio', 'npl_ratio', 'NPL Ratio', 'percentage'),
    buildPattern('(?:dpd|days\\s+past\\s+due)\\s*(?:>\\s*)?30', 'dpd_30', 'DPD 30+', 'percentage'),
    buildPattern('(?:dpd|days\\s+past\\s+due)\\s*(?:>\\s*)?60', 'dpd_60', 'DPD 60+', 'percentage'),
    buildPattern('(?:dpd|days\\s+past\\s+due)\\s*(?:>\\s*)?90', 'dpd_90', 'DPD 90+', 'percentage'),
    buildPattern('write[- ]?off\\s+rate', 'write_off_rate', 'Write-off Rate', 'percentage'),
    buildPattern('recovery\\s+rate', 'recovery_rate', 'Recovery Rate', 'percentage'),
    buildPattern('(?:cost[- ]to[- ]income|CIR|efficiency)\\s+ratio', 'cost_to_income', 'Cost-to-Income Ratio', 'percentage'),
    buildPattern('return\\s+on\\s+assets', 'return_on_assets', 'Return on Assets', 'percentage'),
    buildPattern('approval\\s+rate', 'approval_rate', 'Approval Rate', 'percentage'),
    buildPattern('(?:warehouse|facility)\\s+(?:utilisation|utilization)', 'warehouse_utilisation', 'Warehouse Utilisation', 'percentage'),
    buildPattern('(?:weighted\\s+)?(?:avg|average)\\s+yield', 'weighted_avg_yield', 'Weighted Average Yield', 'percentage'),

    // Asset finance specific — percentages
    buildPattern('(?:hp|hire\\s+purchase)\\s+(?:split|%|proportion)', 'hp_split', 'HP Split', 'percentage'),
    buildPattern('(?:finance\\s+)?lease\\s+(?:split|%|proportion)', 'finance_lease_split', 'Finance Lease Split', 'percentage'),
    buildPattern('(?:operating\\s+)?lease\\s+(?:split|%|proportion)', 'operating_lease_split', 'Operating Lease Split', 'percentage'),
  ];

  for (const pattern of patterns) {
    let match;
    // Reset regex state
    pattern.regex.lastIndex = 0;
    while ((match = pattern.regex.exec(text)) !== null) {
      const rawValue = match[pattern.valueGroup];
      if (!rawValue) continue;

      let value = parseFloat(rawValue.replace(/,/g, ''));
      if (isNaN(value) || value === 0) continue;

      // Apply explicit multiplier from match, or fall back to implied multiplier
      if (pattern.multiplierGroup && match[pattern.multiplierGroup]) {
        value *= getMultiplier(match[pattern.multiplierGroup]);
      } else if (pattern.unit === 'currency' && impliedMultiplier > 1) {
        value *= impliedMultiplier;
      }

      // Deduplicate: keep the first match for each metric type
      const key = `${pattern.type}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Determine confidence based on match quality
      const confidence: ExtractedMetric['confidence'] =
        pattern.unit === 'percentage' && (value < 0 || value > 200)
          ? 'low'
          : 'high';

      metrics.push({
        label: pattern.label,
        value,
        type: pattern.type,
        confidence,
      });
    }
  }

  // Also try to extract number-of-contracts / live contracts as plain numbers
  const contractPatterns = [
    { regex: /(?:live|active|total)\s+contracts[:\s\t]+([\d,]+)/gi, type: 'live_contracts', label: 'Live Contracts' },
    { regex: /(?:number|no\.?)\s+(?:of\s+)?contracts[:\s\t]+([\d,]+)/gi, type: 'live_contracts', label: 'Live Contracts' },
    { regex: /(?:weighted\s+)?(?:avg|average)\s+(?:contract\s+)?term[:\s\t]+([\d.]+)\s*(?:months|mths)/gi, type: 'avg_contract_term', label: 'Avg Contract Term' },
    { regex: /(?:weighted\s+)?(?:avg|average)\s+term[:\s\t]+([\d.]+)\s*(?:months|mths)/gi, type: 'weighted_avg_term', label: 'Weighted Avg Term' },
  ];

  for (const { regex, type, label } of contractPatterns) {
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (isNaN(value) || value === 0) continue;
      const key = type;
      if (seen.has(key)) continue;
      seen.add(key);
      metrics.push({ label, value, type, confidence: 'medium' });
      break;
    }
  }

  return metrics;
}
