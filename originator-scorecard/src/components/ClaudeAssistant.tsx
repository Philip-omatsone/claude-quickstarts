import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { formatValue } from '../utils/format';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'Compare credit quality across originators',
  'Which originator has the highest concentration risk?',
  'Summarise the latest quarter performance',
  'Flag any concerning trends',
  'What is the overall portfolio health?',
];

export default function ClaudeAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const metrics = useLiveQuery(() => db.metrics.toArray(), []);
  const covenants = useLiveQuery(() => db.covenants.toArray(), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const stored = localStorage.getItem('claude_api_key');
    if (stored) {
      setApiKey(stored);
      setShowApiKeyInput(false);
    }
  }, []);

  function saveApiKey() {
    if (apiKey.trim()) {
      localStorage.setItem('claude_api_key', apiKey.trim());
      setShowApiKeyInput(false);
    }
  }

  function buildContext(): string {
    if (!originators || !metrics) return 'No data loaded yet.';
    const orgMap = new Map(originators.map((o) => [o.id, o.name]));

    let ctx = 'ORIGINATOR DASHBOARD DATA:\n\n';
    ctx += `Originators: ${originators.map((o) => `${o.name} (${o.sector}, ${o.region ?? 'UK'})`).join('; ')}\n\n`;

    // Latest metrics per originator
    const latestByOrg = new Map<string, Map<string, { label: string; value: number; unit: string; period: string }>>();
    for (const m of metrics) {
      const orgName = orgMap.get(m.originatorId) ?? 'Unknown';
      if (!latestByOrg.has(orgName)) latestByOrg.set(orgName, new Map());
      const existing = latestByOrg.get(orgName)!.get(m.metricType);
      if (!existing || m.period > existing.period) {
        latestByOrg.get(orgName)!.set(m.metricType, { label: m.label, value: m.value, unit: m.unit, period: m.period });
      }
    }

    for (const [orgName, metricsMap] of latestByOrg) {
      ctx += `${orgName} (latest metrics):\n`;
      for (const [, m] of metricsMap) {
        ctx += `  - ${m.label}: ${formatValue(m.value, m.unit)} (${m.period})\n`;
      }
      ctx += '\n';
    }

    if (covenants && covenants.length > 0) {
      ctx += 'COVENANTS:\n';
      for (const c of covenants) {
        ctx += `  - ${orgMap.get(c.originatorId)}: ${c.name} - threshold ${c.threshold}, current ${c.currentLevel}, status ${c.ragStatus}, trend ${c.trend}\n`;
      }
    }

    return ctx;
  }

  async function sendMessage(text: string) {
    if (!text.trim() || !apiKey) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = buildContext();
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
          max_tokens: 1024,
          system: `You are an AI analyst embedded in a British Business Bank originator monitoring dashboard. You have access to real-time data about asset finance originators. Be concise, specific, and reference actual data points. Use British English. Format currency in GBP (£). Here is the current data:\n\n${context}`,
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error: ${response.status} - ${err}`);
      }

      const data = await response.json();
      const assistantContent = data.content?.[0]?.text ?? 'No response received.';
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'Failed to reach Claude API. Check your API key and try again.'}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-border shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-primary text-white">
        <div>
          <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-heading)' }}>Claude Assistant</h3>
          <p className="text-[10px] text-slate-300">AI-powered portfolio analysis</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X size={16} /></button>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="p-4 border-b border-border bg-gray-50">
          <label className="block text-xs font-medium text-text-primary mb-1">Anthropic API Key</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30"
              onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
            />
            <button onClick={saveApiKey} className="px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover">Save</button>
          </div>
          <p className="text-[10px] text-text-secondary mt-1">Stored locally in your browser only.</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-text-secondary text-center">Ask Claude about your originator portfolio</p>
            <div className="space-y-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-3 py-2 rounded-md text-xs text-accent hover:bg-accent/5 border border-border transition-colors"
                  disabled={!apiKey || showApiKeyInput}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-text-primary'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <Loader2 size={14} className="animate-spin text-accent" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKey && !showApiKeyInput ? 'Ask Claude...' : 'Enter API key first'}
            className="flex-1 border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30"
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
            disabled={!apiKey || showApiKeyInput || loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || !apiKey || showApiKeyInput || loading}
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
        {!showApiKeyInput && apiKey && (
          <button onClick={() => setShowApiKeyInput(true)} className="text-[10px] text-text-secondary hover:text-accent mt-1">Change API key</button>
        )}
      </div>
    </div>
  );
}
