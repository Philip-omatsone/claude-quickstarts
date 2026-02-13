"use client";

import { useState, useEffect } from "react";
import { ApiConnection, LineItem } from "@/lib/types";
import {
  loadConnections,
  updateConnection,
  disconnectProvider,
  fetchMonzoBalances,
  fetchTrading212Balances,
} from "@/lib/api-connections";
import { X, Plug, Unplug, RefreshCw, Eye, EyeOff, ExternalLink } from "lucide-react";

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

  useEffect(() => {
    setConnections(loadConnections());
  }, []);

  const handleConnect = (provider: "monzo" | "trading212") => {
    if (provider === "monzo") {
      setEditingKey(provider);
      setKeyInput("");
      setShowKey(false);
      setError(
        "Monzo requires OAuth2 authentication. You'll need to create an OAuth2 client at developers.monzo.com, then paste your access token here.",
      );
    } else {
      setEditingKey(provider);
      setKeyInput("");
      setShowKey(false);
      setError(null);
    }
  };

  const handleSaveKey = (provider: "monzo" | "trading212") => {
    if (!keyInput.trim()) return;

    const updated = updateConnection(provider, {
      connected: true,
      apiKey: keyInput.trim(),
    });
    setConnections(updated);
    setEditingKey(null);
    setKeyInput("");
    setError(null);
    setSuccess(`${provider === "monzo" ? "Monzo" : "Trading 212"} connected successfully.`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDisconnect = (provider: "monzo" | "trading212") => {
    const updated = disconnectProvider(provider);
    setConnections(updated);
    setSuccess(null);
    setError(null);
  };

  const handleSync = async (connection: ApiConnection) => {
    setSyncing(connection.provider);
    setError(null);

    try {
      let items: LineItem[];

      if (connection.provider === "monzo") {
        items = await fetchMonzoBalances(connection.apiKey!);
      } else {
        items = await fetchTrading212Balances(connection.apiKey!);
      }

      if (items.length === 0) {
        setError("No data returned. Check your API key and try again.");
        setSyncing(null);
        return;
      }

      // Update last sync time
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
      setError(`Failed to sync ${connection.label}: ${message}`);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative min-h-full flex items-start justify-center p-4 pt-12">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
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

          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-slate-500">
              Connect your financial accounts to automatically pull in balances.
              Your API keys are stored locally in your browser.
            </p>

            {success && (
              <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                {success}
              </div>
            )}

            {error && (
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                {error}
              </div>
            )}

            {connections.map((conn) => (
              <div
                key={conn.provider}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        conn.provider === "monzo"
                          ? "bg-gradient-to-br from-red-500 to-pink-500"
                          : "bg-gradient-to-br from-blue-500 to-indigo-600"
                      }`}
                    >
                      {conn.provider === "monzo" ? "M" : "T"}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {conn.label}
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

                {/* API key input */}
                {editingKey === conn.provider && (
                  <div className="mt-3 space-y-2">
                    <label className="block text-xs font-medium text-slate-600">
                      {conn.provider === "monzo"
                        ? "Access Token"
                        : "API Key"}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showKey ? "text" : "password"}
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value)}
                          placeholder={
                            conn.provider === "monzo"
                              ? "eyJhbGciOi..."
                              : "Your API key from Settings > API"
                          }
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
                        onClick={() =>
                          handleSaveKey(conn.provider as "monzo" | "trading212")
                        }
                        disabled={!keyInput.trim()}
                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                    </div>
                    <a
                      href={
                        conn.provider === "monzo"
                          ? "https://developers.monzo.com/"
                          : "https://www.trading212.com/en/api"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Get your API key
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
                        onClick={() =>
                          handleDisconnect(
                            conn.provider as "monzo" | "trading212",
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        <Unplug className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleConnect(conn.provider as "monzo" | "trading212")
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      <Plug className="w-3.5 h-3.5" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
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
