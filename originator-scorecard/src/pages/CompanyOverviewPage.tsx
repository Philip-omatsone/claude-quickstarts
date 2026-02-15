import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import {
  Sparkles, Loader2, AlertCircle, TrendingUp, TrendingDown, Minus,
  Shield, AlertTriangle, CheckCircle, RefreshCw, FileText, Clock,
} from 'lucide-react';
import { db } from '../db/database';
import { analyseCompany, hasApiKey } from '../utils/claude-api';
import { formatValue } from '../utils/format';
import type { OriginatorAnalysis } from '../types';

export default function CompanyOverviewPage() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const metrics = useLiveQuery(() => db.metrics.toArray(), []);
  const covenants = useLiveQuery(() => db.covenants.toArray(), []);
  const analyses = useLiveQuery(() => db.analyses.orderBy('generatedAt').reverse().toArray(), []);
  const documents = useLiveQuery(() => db.documents.orderBy('uploadedAt').reverse().toArray(), []);

  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKeyAvailable = hasApiKey();

  // Get the latest analysis for selected originator
  const latestAnalysis = analyses?.find((a) => a.originatorId === selectedOrgId);
  const orgDocuments = documents?.filter((d) => d.originatorId === selectedOrgId) ?? [];
  const selectedOrg = originators?.find((o) => o.id === selectedOrgId);

  async function generateAnalysis() {
    if (!selectedOrgId || !metrics || !covenants) return;

    setLoading(true);
    setError('');

    try {
      const orgName = selectedOrg?.name ?? 'Unknown';
      const orgMetrics = metrics.filter((m) => m.originatorId === selectedOrgId);
      const orgCovenants = covenants.filter((c) => c.originatorId === selectedOrgId);

      // Build metrics context string
      const periodGroups = new Map<string, { label: string; value: number; unit: string }[]>();
      for (const m of orgMetrics) {
        if (!periodGroups.has(m.period)) periodGroups.set(m.period, []);
        periodGroups.get(m.period)!.push({ label: m.label, value: m.value, unit: m.unit });
      }

      let metricsCtx = '';
      const sortedPeriods = [...periodGroups.keys()].sort();
      for (const period of sortedPeriods) {
        metricsCtx += `\n${period}:\n`;
        for (const m of periodGroups.get(period)!) {
          metricsCtx += `  ${m.label}: ${formatValue(m.value, m.unit)}\n`;
        }
      }

      let covenantsCtx = '';
      if (orgCovenants.length > 0) {
        for (const c of orgCovenants) {
          covenantsCtx += `  ${c.name}: threshold ${c.threshold} (${c.direction}), current ${c.currentLevel}, headroom ${c.headroomPercent.toFixed(1)}%, status ${c.ragStatus}, trend ${c.trend}\n`;
        }
      } else {
        covenantsCtx = '  No covenants recorded.';
      }

      const result = await analyseCompany(orgName, metricsCtx, covenantsCtx);

      // Save to database
      await db.analyses.add({
        id: uuid(),
        originatorId: selectedOrgId,
        summary: result.summary,
        strengths: result.strengths,
        risks: result.risks,
        outlook: result.outlook,
        keyMetrics: result.keyMetrics,
        creditAssessment: result.creditAssessment,
        recommendedActions: result.recommendedActions,
        generatedAt: new Date(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis.');
    } finally {
      setLoading(false);
    }
  }

  const trendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp size={12} className="text-green-600" />;
      case 'deteriorating': return <TrendingDown size={12} className="text-red-500" />;
      default: return <Minus size={12} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Company Overview</h2>
          <p className="text-xs text-text-secondary mt-1">AI-powered originator analysis and intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 min-w-[200px]"
          >
            <option value="">Select originator...</option>
            {originators?.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          {selectedOrgId && apiKeyAvailable && (
            <button
              onClick={generateAnalysis}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : latestAnalysis ? (
                <RefreshCw size={14} />
              ) : (
                <Sparkles size={14} />
              )}
              {loading ? 'Analysing...' : latestAnalysis ? 'Refresh Analysis' : 'Generate Analysis'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* No originator selected */}
      {!selectedOrgId && (
        <div className="text-center py-16 text-text-secondary">
          <Sparkles size={48} className="mx-auto mb-4 text-accent/30" />
          <p className="text-sm">Select an originator to view AI-powered analysis</p>
          {!apiKeyAvailable && (
            <p className="text-xs mt-2">Set your API key in the Claude Assistant panel to enable analysis</p>
          )}
        </div>
      )}

      {/* No analysis yet */}
      {selectedOrgId && !latestAnalysis && !loading && (
        <div className="text-center py-12 text-text-secondary border-2 border-dashed border-border rounded-lg">
          <Sparkles size={36} className="mx-auto mb-3 text-accent/40" />
          <p className="text-sm font-medium mb-1">No analysis generated yet</p>
          <p className="text-xs">
            {apiKeyAvailable
              ? 'Click "Generate Analysis" to have Claude analyse this originator\'s data'
              : 'Set your Anthropic API key in the Claude Assistant panel first'}
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-12 text-accent">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Claude is analysing {selectedOrg?.name}...</span>
        </div>
      )}

      {/* Analysis results */}
      {latestAnalysis && !loading && (
        <div className="space-y-4">
          {/* Summary card */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-accent/5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">Executive Summary</h3>
              </div>
              <span className="text-[10px] text-text-secondary flex items-center gap-1">
                <Clock size={10} />
                {latestAnalysis.generatedAt.toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm text-text-primary leading-relaxed">{latestAnalysis.summary}</p>
            </div>
          </div>

          {/* Key metrics from AI */}
          {latestAnalysis.keyMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {latestAnalysis.keyMetrics.map((km, i) => (
                <div key={i} className="border border-border rounded-lg p-3">
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">{km.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-text-primary">{km.value}</span>
                    {trendIcon(km.trend)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strengths, Risks, Credit side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-green-50 border-b border-border flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <h4 className="text-xs font-semibold text-green-800">Strengths</h4>
              </div>
              <ul className="p-4 space-y-2">
                {latestAnalysis.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-text-primary flex gap-2">
                    <span className="text-green-500 shrink-0 mt-0.5">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-red-50 border-b border-border flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-600" />
                <h4 className="text-xs font-semibold text-red-800">Risks</h4>
              </div>
              <ul className="p-4 space-y-2">
                {latestAnalysis.risks.map((r, i) => (
                  <li key={i} className="text-xs text-text-primary flex gap-2">
                    <span className="text-red-400 shrink-0 mt-0.5">!</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Credit Assessment */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
              <Shield size={14} className="text-primary" />
              <h4 className="text-xs font-semibold text-text-primary">Credit Assessment</h4>
            </div>
            <div className="p-4">
              <p className="text-sm text-text-primary">{latestAnalysis.creditAssessment}</p>
            </div>
          </div>

          {/* Outlook + Recommended Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-accent/5 border-b border-border flex items-center gap-2">
                <TrendingUp size={14} className="text-accent" />
                <h4 className="text-xs font-semibold text-text-primary">Outlook</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-text-primary">{latestAnalysis.outlook}</p>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-50 border-b border-border flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-600" />
                <h4 className="text-xs font-semibold text-amber-800">Recommended Actions</h4>
              </div>
              <ul className="p-4 space-y-2">
                {latestAnalysis.recommendedActions.map((a, i) => (
                  <li key={i} className="text-xs text-text-primary flex gap-2">
                    <span className="text-amber-500 shrink-0 font-bold">{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Uploaded documents for this originator */}
          {orgDocuments.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-border flex items-center gap-2">
                <FileText size={14} className="text-text-secondary" />
                <h4 className="text-xs font-semibold text-text-primary">Uploaded Documents</h4>
              </div>
              <div className="divide-y divide-border">
                {orgDocuments.map((doc) => (
                  <div key={doc.id} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text-primary">{doc.fileName}</span>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{doc.reportType}</span>
                        {doc.reportPeriod && (
                          <span className="bg-accent/10 text-accent px-2 py-0.5 rounded">{doc.reportPeriod}</span>
                        )}
                        <span>{doc.metricsExtracted} metrics</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary">{doc.summary}</p>
                    <div className="flex gap-4 mt-2">
                      {doc.keyFindings.length > 0 && (
                        <span className="text-[10px] text-text-secondary">{doc.keyFindings.length} findings</span>
                      )}
                      {doc.riskFactors.length > 0 && (
                        <span className="text-[10px] text-red-500">{doc.riskFactors.length} risks flagged</span>
                      )}
                      <span className="text-[10px] text-text-secondary">
                        {doc.uploadedAt.toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
