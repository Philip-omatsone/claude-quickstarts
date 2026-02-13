"use client";

import { useState, useEffect } from "react";
import { ApiConnection, LineItem, ProviderType } from "@/lib/types";
import {
  loadConnections,
  updateConnection,
  disconnectProvider,
  fetchProviderData,
  PROVIDER_META,
} from "@/lib/api-connections";
import { X, Plug, Unplug, RefreshCw, Eye, EyeOff, ExternalLink, AlertTriangle } from "lucide-react";

interface ApiSettingsProps {
  onSync: (provider: string, items: LineItem[]) => void;
  onClose: () => void;
}

export default function ApiSettings({ onSync, onClose }: ApiSettingsProps) {
  const [connections, setConnections] = useState<ApiConnection[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    setConnections(loadConnections());
  }, []);

  const handleConnect = (provider: ProviderType) => {
    const meta = PROVIDER_META.find((m) => m.provider === provider);
    setEditingKey(provider);
    setKeyInput("");
    setShowKey(false);

    if (meta && !meta.hasPublicApi && meta.workaround) {
      setError(meta.workaround);
    } else if (provider === "monzo") {
      setError(
        "Monzo requires OAuth2 authentication. You'll need to create an OAuth2 client at developers.monzo.com, then paste your access token here.",
      );
    } else {
      setError(null);
    }
  };

  const handleSaveKey = (provider: ProviderType) => {
    if (!keyInput.trim()) return;

    const updated = updateConnection(provider, {
      connected: true,
      apiKey: keyInput.trim(),
    });
    setConnections(updated);
    setEditingKey(null);
    setKeyInput("");
    setError(null);
    const meta = PROVIDER_META.find((m) => m.provider === provider);
    setSuccess(`${meta?.label || provider} connected successfully.`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDisconnect = (provider: ProviderType) => {
    const updated = disconnectProvider(provider);
    setConnections(updated);
    setSuccess(null);
    setError(null);
  };

  const handleSync = async (connection: ApiConnection) => {
    setSyncing(connection.provider);
    setError(null);

    try {
      const items = await fetchProviderData(connection.provider, connection.apiKey!);

      if (items.length === 0) {
        setError("No data returned. Check your API key and try again.");
        setSyncing(null);
        return;
      }

      const updated = updateConnection(connection.provider, {
        lastSync: new Date().toISOString(),
      });
      setConnections(updated);

      onSync(connection.provider, items);
      setSuccess(
        `Synced ${items.length} account${items.length > 1 ? "s" : ""} from ${connection.label}.`,
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed";
      setError(message);
    } finally {
      setSyncing(null);
    }
  };

  const categories = [
    { value: "all", label: "All" },
    { value: "banking", label: "Banking" },
    { value: "savings", label: "Savings" },
    { value: "investment", label: "Investment" },
    { value: "pension", label: "Pension" },
    { value: "property", label: "Property" },
    { value: "credit", label: "Credit" },
  ];

  const filteredMeta = PROVIDER_META.filter(
    (m) => filterCategory === "all" || m.category === filterCategory,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative min-h-full flex items-start justify-center p-4 pt-12">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Plug className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                API Connections
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <p className="text-sm text-slate-500">
              Connect your financial accounts to automatically pull in balances.
              Your API keys are stored locally in your browser.
            </p>

            {/* Category filter */}
            <div className="flex gap-1 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                    filterCategory === cat.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {success && (
              <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                {success}
              </div>
            )}

            {error && (
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-700 flex gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {filteredMeta.map((meta) => {
              const conn = connections.find((c) => c.provider === meta.provider);
              if (!conn) return null;

              return (
                <div
                  key={meta.provider}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${meta.color}`}
                      >
                        {meta.initial}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          {meta.label}
                          {!meta.hasPublicApi && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                              Manual
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {conn.connected ? (
                            <span className="text-emerald-600">
                              Connected
                              {conn.lastSync &&
                                ` \u00b7 Last sync: ${new Date(conn.lastSync).toLocaleDateString("en-GB")}`}
                            </span>
                          ) : (
                            "Not connected"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workaround notice for providers without public API */}
                  {!meta.hasPublicApi && meta.workaround && editingKey !== meta.provider && !conn.connected && (
                    <div className="mt-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
                      {meta.workaround}
                    </div>
                  )}

                  {/* API key input */}
                  {editingKey === meta.provider && (
                    <div className="mt-3 space-y-2">
                      <label className="block text-xs font-medium text-slate-600">
                        {meta.keyLabel}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showKey ? "text" : "password"}
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder={`Enter ${meta.keyLabel.toLowerCase()}`}
                            className="w-full px-3 py-2 pr-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showKey ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => handleSaveKey(meta.provider)}
                          disabled={!keyInput.trim()}
                          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                      </div>
                      {meta.helpUrl && (
                        <a
                          href={meta.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                        >
                          {meta.hasPublicApi ? "Get your API key" : "Visit provider"}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    {conn.connected ? (
                      <>
                        <button
                          onClick={() => handleSync(conn)}
                          disabled={syncing === conn.provider}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${syncing === conn.provider ? "animate-spin" : ""}`}
                          />
                          {syncing === conn.provider
                            ? "Syncing..."
                            : "Sync Now"}
                        </button>
                        <button
                          onClick={() => handleDisconnect(meta.provider)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          <Unplug className="w-3.5 h-3.5" />
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(meta.provider)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <Plug className="w-3.5 h-3.5" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
