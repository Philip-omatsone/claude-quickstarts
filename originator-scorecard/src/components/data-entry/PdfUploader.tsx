import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { FileText, Check, AlertCircle, Loader2, Info, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../../db/database';
import { extractTextFromPdf, extractMetricsFromText } from '../../utils/pdf-extractor';
import { extractMetricsWithAi, analyseDocument, hasApiKey } from '../../utils/claude-api';
import type { AiExtractedMetric } from '../../utils/claude-api';
import type { MetricType, MetricUnit } from '../../types';

const UNIT_MAP: Record<string, MetricUnit> = {
  revenue: 'currency',
  net_income: 'currency',
  operating_income: 'currency',
  total_assets: 'currency',
  total_aum: 'currency',
  new_advance_volume: 'currency',
  avg_deal_size: 'currency',
  bad_debt_ratio: 'percentage',
  provision_coverage: 'percentage',
  npl_ratio: 'percentage',
  dpd_30: 'percentage',
  dpd_60: 'percentage',
  dpd_90: 'percentage',
  write_off_rate: 'percentage',
  recovery_rate: 'percentage',
  cost_to_income: 'percentage',
  return_on_assets: 'percentage',
  approval_rate: 'percentage',
  warehouse_utilisation: 'percentage',
  weighted_avg_yield: 'percentage',
  hp_split: 'percentage',
  finance_lease_split: 'percentage',
  operating_lease_split: 'percentage',
  live_contracts: 'number',
  avg_contract_term: 'months',
  weighted_avg_term: 'months',
};

interface ExtractedMetricRow {
  label: string;
  value: number;
  type: string;
  unit: MetricUnit;
  confidence: 'high' | 'medium' | 'low';
  context?: string;
  selected: boolean;
}

interface DocumentSummary {
  summary: string;
  reportType: string;
  keyFindings: string[];
  riskFactors: string[];
  positiveIndicators: string[];
}

export default function PdfUploader() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [extractedText, setExtractedText] = useState('');
  const [extractedMetrics, setExtractedMetrics] = useState<ExtractedMetricRow[]>([]);
  const [documentSummary, setDocumentSummary] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');
  const [imported, setImported] = useState(false);
  const [originatorId, setOriginatorId] = useState('');
  const [period, setPeriod] = useState(`${new Date().getFullYear()}-FY`);
  const [useAi, setUseAi] = useState(true);
  const [showText, setShowText] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const apiKeyAvailable = hasApiKey();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setImported(false);
    setLoading(true);
    setDocumentSummary(null);
    setExtractedMetrics([]);

    try {
      // Step 1: Extract text from PDF
      setLoadingStage('Extracting text from PDF...');
      const text = await extractTextFromPdf(file);
      setExtractedText(text);

      if (useAi && apiKeyAvailable) {
        // AI-powered extraction
        setLoadingStage('Claude is analysing the document...');

        // Run metric extraction and document analysis in parallel
        const [metricsResult, docResult] = await Promise.all([
          extractMetricsWithAi(text),
          analyseDocument(text),
        ]);

        // Auto-detect originator and period from AI response
        if (metricsResult.companyName && originators) {
          const match = originators.find(
            (o) => o.name.toLowerCase().includes(metricsResult.companyName!.toLowerCase()) ||
                   metricsResult.companyName!.toLowerCase().includes(o.name.toLowerCase())
          );
          if (match) setOriginatorId(match.id);
        }
        if (metricsResult.reportPeriod) {
          setPeriod(metricsResult.reportPeriod);
        }

        // Set metrics
        setExtractedMetrics(
          metricsResult.metrics.map((m: AiExtractedMetric) => ({
            label: m.label,
            value: m.value,
            type: m.type,
            unit: m.unit,
            confidence: m.confidence,
            context: m.context,
            selected: m.confidence !== 'low',
          }))
        );

        // Set document summary
        setDocumentSummary({
          summary: docResult.summary,
          reportType: docResult.reportType,
          keyFindings: docResult.keyFindings,
          riskFactors: docResult.riskFactors,
          positiveIndicators: docResult.positiveIndicators,
        });

        if (metricsResult.metrics.length === 0) {
          setError('Claude could not extract any metrics from this document. It may be image-based or non-financial.');
        }
      } else {
        // Regex fallback
        setLoadingStage('Extracting metrics with pattern matching...');
        const metrics = extractMetricsFromText(text);
        setExtractedMetrics(
          metrics.map((m) => ({
            ...m,
            unit: UNIT_MAP[m.type] ?? 'number',
            selected: m.confidence !== 'low',
          }))
        );
        if (metrics.length === 0) {
          setError('No metrics found with pattern matching. Try enabling AI analysis for better results.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PDF.');
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  }

  async function handleImport() {
    if (!originatorId) {
      setError('Please select an originator');
      return;
    }

    const selected = extractedMetrics.filter((m) => m.selected);
    if (selected.length === 0) return;

    const now = new Date();
    const periodDate = parsePeriodToDate(period);

    for (const metric of selected) {
      await db.metrics.add({
        id: uuid(),
        originatorId,
        metricType: (metric.type as MetricType) || 'custom',
        label: metric.label,
        value: metric.value,
        period,
        date: periodDate,
        unit: metric.unit,
        source: 'pdf',
        createdAt: now,
      });
    }

    // Save document report if we have a summary
    if (documentSummary) {
      const fileName = fileRef.current?.files?.[0]?.name ?? 'Unknown';
      await db.documents.add({
        id: uuid(),
        originatorId,
        fileName,
        summary: documentSummary.summary,
        reportType: documentSummary.reportType,
        reportPeriod: period,
        keyFindings: documentSummary.keyFindings,
        riskFactors: documentSummary.riskFactors,
        positiveIndicators: documentSummary.positiveIndicators,
        metricsExtracted: selected.length,
        uploadedAt: now,
      });
    }

    setImported(true);
    setExtractedMetrics([]);
    setExtractedText('');
    setDocumentSummary(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  const confidenceColor = (c: string) => {
    switch (c) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-red-500 bg-red-50';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Upload area */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <FileText size={32} className="mx-auto text-text-secondary mb-2" />
        <p className="text-sm text-text-secondary mb-1">
          Upload a PDF annual report or financial statement
        </p>
        <p className="text-xs text-text-secondary mb-3">
          {apiKeyAvailable
            ? 'Claude AI will analyse the document and extract metrics automatically'
            : 'Set your API key in the Claude Assistant panel to enable AI-powered analysis'}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={handleFile}
          className="text-sm"
        />
      </div>

      {/* AI toggle */}
      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useAi && apiKeyAvailable}
            onChange={(e) => setUseAi(e.target.checked)}
            disabled={!apiKeyAvailable}
            className="rounded"
          />
          <Sparkles size={14} className={useAi && apiKeyAvailable ? 'text-accent' : 'text-gray-400'} />
          <span className={apiKeyAvailable ? 'text-text-primary' : 'text-text-secondary'}>
            AI-powered analysis
          </span>
        </label>
        {!apiKeyAvailable && (
          <span className="text-xs text-text-secondary">(API key required)</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 p-3 bg-accent/5 text-accent rounded-md text-sm">
          <Loader2 size={16} className="animate-spin" />
          {loadingStage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {imported && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          <Check size={16} />
          Metrics imported successfully!
        </div>
      )}

      {/* Document summary from AI */}
      {documentSummary && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-accent/5 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              <h4 className="text-sm font-semibold text-text-primary">AI Document Analysis</h4>
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                {documentSummary.reportType}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-text-primary">{documentSummary.summary}</p>

            {documentSummary.keyFindings.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Key Findings</h5>
                <ul className="space-y-1">
                  {documentSummary.keyFindings.map((f, i) => (
                    <li key={i} className="text-xs text-text-primary flex gap-2">
                      <span className="text-accent shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {documentSummary.positiveIndicators.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-green-700 mb-1">Positive Indicators</h5>
                  <ul className="space-y-1">
                    {documentSummary.positiveIndicators.map((p, i) => (
                      <li key={i} className="text-xs text-text-primary flex gap-1">
                        <span className="text-green-600 shrink-0">+</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {documentSummary.riskFactors.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-red-700 mb-1">Risk Factors</h5>
                  <ul className="space-y-1">
                    {documentSummary.riskFactors.map((r, i) => (
                      <li key={i} className="text-xs text-text-primary flex gap-1">
                        <span className="text-red-500 shrink-0">!</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extracted metrics */}
      {extractedMetrics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Extracted Metrics
              <span className="text-xs text-text-secondary ml-2">
                ({extractedMetrics.length} found)
              </span>
            </h4>
          </div>

          <div className="flex gap-3">
            <select
              value={originatorId}
              onChange={(e) => setOriginatorId(e.target.value)}
              className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select originator...</option>
              {originators?.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Period (e.g., 2025-FY)"
              className="w-36 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="border border-border rounded-md overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 border-b border-border text-xs text-text-secondary font-medium">
              <span className="w-5" />
              <span className="flex-1">Metric</span>
              <span className="w-24 text-right">Value</span>
              <span className="w-20 text-center">Confidence</span>
            </div>
            {extractedMetrics.map((m, i) => (
              <div key={i} className="border-b border-border last:border-0">
                <div className="flex items-center gap-3 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={m.selected}
                    onChange={() => {
                      const updated = [...extractedMetrics];
                      updated[i] = { ...updated[i], selected: !updated[i].selected };
                      setExtractedMetrics(updated);
                    }}
                    className="shrink-0"
                  />
                  <span className="text-sm flex-1">
                    {m.label}
                    <span className="text-xs text-text-secondary ml-1">({m.type})</span>
                  </span>
                  <span className="text-sm font-medium w-24 text-right">
                    {m.unit === 'currency'
                      ? `£${m.value.toLocaleString()}`
                      : m.unit === 'percentage'
                        ? `${m.value}%`
                        : m.value.toLocaleString()}
                  </span>
                  <span className={`text-xs w-20 text-center capitalize px-2 py-0.5 rounded-full ${confidenceColor(m.confidence)}`}>
                    {m.confidence}
                  </span>
                </div>
                {m.context && (
                  <div className="px-3 pb-2 pl-10">
                    <p className="text-[11px] text-text-secondary italic truncate" title={m.context}>
                      "{m.context}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleImport}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Import Selected ({extractedMetrics.filter((m) => m.selected).length})
          </button>
        </div>
      )}

      {/* Extracted text (collapsible) */}
      {extractedText && (
        <div>
          <button
            onClick={() => setShowText(!showText)}
            className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            {showText ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Raw Extracted Text
          </button>
          {showText && (
            <textarea
              readOnly
              value={extractedText}
              className="w-full h-48 border border-border rounded-md p-3 text-xs font-mono bg-gray-50 resize-y mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
}

function parsePeriodToDate(period: string): Date {
  const [yearStr, rest] = period.split('-');
  const year = parseInt(yearStr);
  if (isNaN(year)) return new Date();
  if (!rest || rest === 'FY') return new Date(year, 11, 31);
  const quarter = parseInt(rest.replace('Q', ''));
  if (isNaN(quarter)) return new Date(year, 11, 31);
  return new Date(year, quarter * 3 - 1, 28);
}
