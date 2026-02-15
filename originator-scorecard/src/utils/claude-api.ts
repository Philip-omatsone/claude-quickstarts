import type { MetricType, MetricUnit } from '../types';

function getApiKey(): string | null {
  return localStorage.getItem('claude_api_key');
}

async function callClaude(
  system: string,
  userMessage: string,
  maxTokens = 4096
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Anthropic API key not set. Open the Claude Assistant panel and enter your key.');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    if (response.status === 401) throw new Error('Invalid API key. Check your Anthropic API key in the Claude Assistant panel.');
    throw new Error(`Claude API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? '';
}

// --- PDF metric extraction via Claude ---

export interface AiExtractedMetric {
  label: string;
  value: number;
  type: MetricType | 'custom';
  unit: MetricUnit;
  confidence: 'high' | 'medium' | 'low';
  context: string; // the sentence/line where the value was found
}

const METRIC_EXTRACTION_SYSTEM = `You are a financial data extraction specialist working for the British Business Bank.
You extract structured financial metrics from PDF text of UK asset finance company reports.

You MUST respond with valid JSON only — no markdown, no explanation, no surrounding text.

Return a JSON object with this exact structure:
{
  "companyName": "string or null if not identifiable",
  "reportPeriod": "string like '2025-FY' or '2025-Q2' or null",
  "metrics": [
    {
      "label": "Human-readable label e.g. 'Revenue'",
      "value": 49000000,
      "type": "one of: revenue, net_income, operating_income, bad_debt_ratio, provision_coverage, npl_ratio, total_assets, total_aum, warehouse_utilisation, live_contracts, weighted_avg_term, dpd_30, dpd_60, dpd_90, write_off_rate, recovery_rate, new_advance_volume, avg_deal_size, approval_rate, weighted_avg_yield, cost_to_income, return_on_assets, hp_split, finance_lease_split, operating_lease_split, avg_contract_term, residual_value_exposure, custom",
      "unit": "one of: currency, percentage, ratio, number, months",
      "confidence": "high, medium, or low",
      "context": "the exact sentence or line the value was found in"
    }
  ]
}

Rules:
- Currency values should be in full GBP (e.g. £49m = 49000000). If the report header says "(£m)" or "(£'000)", scale all values accordingly.
- Percentage values should be raw numbers (e.g. 2.5% = 2.5)
- Include ALL financial metrics you can find, not just the ones you're sure about
- Set confidence to "low" for values you're uncertain about
- If a metric doesn't map to a known type, use "custom"
- Look for: revenue/turnover, profit before/after tax, net income, total assets, AuM, bad debt ratios, NPL ratios, arrears data, covenant information, cost-to-income, return on assets, contract volumes, deal sizes, lease splits, etc.`;

export async function extractMetricsWithAi(pdfText: string): Promise<{
  companyName: string | null;
  reportPeriod: string | null;
  metrics: AiExtractedMetric[];
}> {
  const truncated = pdfText.slice(0, 30000); // stay within token limits
  const raw = await callClaude(
    METRIC_EXTRACTION_SYSTEM,
    `Extract all financial metrics from this PDF text:\n\n${truncated}`
  );

  // Parse JSON — handle potential markdown code blocks
  const jsonStr = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error('Claude returned invalid JSON. Please try again or use manual entry.');
  }
}

// --- Company overview analysis ---

export interface CompanyAnalysis {
  summary: string;
  strengths: string[];
  risks: string[];
  outlook: string;
  keyMetrics: { label: string; value: string; trend: 'improving' | 'stable' | 'deteriorating' }[];
  creditAssessment: string;
  recommendedActions: string[];
}

const COMPANY_ANALYSIS_SYSTEM = `You are a senior credit analyst at the British Business Bank, specialising in UK asset finance originators.
You produce concise, data-driven company overviews for internal stakeholders.

You MUST respond with valid JSON only — no markdown, no explanation, no surrounding text.

Return a JSON object with this structure:
{
  "summary": "2-3 sentence overview of the company's current position",
  "strengths": ["strength 1", "strength 2", ...],
  "risks": ["risk 1", "risk 2", ...],
  "outlook": "1-2 sentence forward-looking view",
  "keyMetrics": [
    { "label": "Revenue", "value": "£49m", "trend": "improving" },
    ...
  ],
  "creditAssessment": "1-2 sentence overall credit quality assessment",
  "recommendedActions": ["action 1", "action 2", ...]
}

Use British English. Be specific — reference actual numbers. Flag any covenant concerns.`;

export async function analyseCompany(
  companyName: string,
  metricsContext: string,
  covenantsContext: string
): Promise<CompanyAnalysis> {
  const raw = await callClaude(
    COMPANY_ANALYSIS_SYSTEM,
    `Analyse this originator:\n\nCompany: ${companyName}\n\nMetrics:\n${metricsContext}\n\nCovenants:\n${covenantsContext}`
  );

  const jsonStr = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error('Claude returned invalid analysis. Please try again.');
  }
}

// --- PDF document analysis (full report summary) ---

export interface DocumentAnalysis {
  summary: string;
  companyName: string | null;
  reportType: string;
  reportPeriod: string | null;
  keyFindings: string[];
  riskFactors: string[];
  positiveIndicators: string[];
}

const DOCUMENT_ANALYSIS_SYSTEM = `You are a financial analyst at the British Business Bank reviewing an originator's PDF report.
Produce a structured summary of the document.

You MUST respond with valid JSON only — no markdown, no explanation.

Return:
{
  "summary": "3-4 sentence executive summary of the document",
  "companyName": "string or null",
  "reportType": "e.g. 'Annual Report', 'Quarterly Update', 'Investor Presentation'",
  "reportPeriod": "e.g. '2025-FY' or '2025-Q2' or null",
  "keyFindings": ["finding 1", "finding 2", ...],
  "riskFactors": ["risk 1", ...],
  "positiveIndicators": ["positive 1", ...]
}

Use British English. Be specific and data-driven.`;

export async function analyseDocument(pdfText: string): Promise<DocumentAnalysis> {
  const truncated = pdfText.slice(0, 30000);
  const raw = await callClaude(
    DOCUMENT_ANALYSIS_SYSTEM,
    `Analyse this document:\n\n${truncated}`
  );

  const jsonStr = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error('Claude returned invalid analysis. Please try again.');
  }
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}
