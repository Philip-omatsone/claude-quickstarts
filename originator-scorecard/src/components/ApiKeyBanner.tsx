import { useState, useEffect } from 'react';
import { Key, Check, X, Sparkles } from 'lucide-react';

export default function ApiKeyBanner() {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('claude_api_key');
    if (stored) {
      setHasKey(true);
      setApiKey(stored);
    }
  }, []);

  function saveKey() {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    localStorage.setItem('claude_api_key', trimmed);
    setHasKey(true);
    setShowInput(false);
    setSaved(true);
    // Trigger re-render across app
    window.dispatchEvent(new Event('apikey-changed'));
    setTimeout(() => setSaved(false), 3000);
  }

  function clearKey() {
    localStorage.removeItem('claude_api_key');
    setApiKey('');
    setHasKey(false);
    setShowInput(false);
    window.dispatchEvent(new Event('apikey-changed'));
  }

  // Don't show anything if key is set and not editing
  if (hasKey && !showInput) {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-green-50 border-b border-green-200">
        <div className="flex items-center gap-2 text-xs text-green-700">
          <Sparkles size={12} />
          <span>AI features enabled</span>
          {saved && <span className="text-green-600 font-medium">— Key saved!</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInput(true)}
            className="text-[10px] text-green-600 hover:text-green-800 underline"
          >
            Change key
          </button>
          <button
            onClick={clearKey}
            className="text-[10px] text-red-500 hover:text-red-700 underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
      <div className="flex items-center gap-3">
        <Key size={16} className="text-amber-600 shrink-0" />
        <div className="flex-1">
          {!showInput ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">Anthropic API Key Required</p>
                <p className="text-xs text-amber-600">
                  Enter your API key to enable AI-powered analysis, PDF extraction, and company overviews.
                </p>
              </div>
              <button
                onClick={() => setShowInput(true)}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 transition-colors shrink-0 ml-4"
              >
                Set API Key
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium text-amber-800 mb-2">
                Enter your Anthropic API key (stored locally in your browser only)
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="flex-1 border border-amber-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  onKeyDown={(e) => e.key === 'Enter' && saveKey()}
                  autoFocus
                />
                <button
                  onClick={saveKey}
                  disabled={!apiKey.trim()}
                  className="px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Check size={12} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    if (!hasKey) setApiKey('');
                  }}
                  className="px-2 py-1.5 text-amber-600 hover:text-amber-800"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
