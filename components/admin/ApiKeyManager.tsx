"use client";
import { useState, useEffect } from "react";
import type { ApiKeyId } from "@/lib/api-key-store";

interface KeyInfo {
  id: ApiKeyId;
  label: string;
  placeholder: string;
  description: string;
  configured: boolean;
}

interface FieldState {
  // What the user is typing — always editable, always reflects input value
  inputValue: string;
  // Decrypted value fetched from server after Reveal
  revealedValue: string;
  showValue: boolean;    // toggle plain text vs password masking
  saving: boolean;
  testing: boolean;
  saveStatus: "idle" | "success" | "error";
  saveMsg: string;
  testStatus: "idle" | "success" | "error";
  testMsg: string;
}

const DEFAULT_FIELD: FieldState = {
  inputValue: "",
  revealedValue: "",
  showValue: false,
  saving: false,
  testing: false,
  saveStatus: "idle",
  saveMsg: "",
  testStatus: "idle",
  testMsg: "",
};

const inpBase = "flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono";

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<KeyInfo[]>([]);
  const [fields, setFields] = useState<Record<string, FieldState>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/api-keys")
      .then(r => r.json())
      .then(data => {
        if (data.keys) {
          setKeys(data.keys);
          const init: Record<string, FieldState> = {};
          data.keys.forEach((k: KeyInfo) => { init[k.id] = { ...DEFAULT_FIELD }; });
          setFields(init);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update(id: string, patch: Partial<FieldState>) {
    setFields(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  // Derive what value is currently "active" for saving
  function getActiveValue(f: FieldState): string {
    // User's typed input takes priority
    if (f.inputValue.trim()) return f.inputValue.trim();
    // Otherwise the revealed value
    return f.revealedValue.trim();
  }

  async function reveal(id: ApiKeyId) {
    update(id, { saving: true, saveMsg: "" });
    try {
      const res = await fetch(`/api/admin/api-keys?reveal=${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal reveal");
      update(id, { revealedValue: data.value, showValue: true, saving: false });
    } catch (e) {
      update(id, { saving: false, saveStatus: "error", saveMsg: e instanceof Error ? e.message : "Error" });
    }
  }

  async function save(id: ApiKeyId, value: string) {
    if (!value) return;
    update(id, { saving: true, saveStatus: "idle" });
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan");
      update(id, { saving: false, inputValue: "", revealedValue: "", showValue: false, saveStatus: "success", saveMsg: "Tersimpan!" });
      setKeys(prev => prev.map(k => k.id === id ? { ...k, configured: true } : k));
      setTimeout(() => update(id, { saveStatus: "idle", saveMsg: "" }), 3000);
    } catch (e) {
      update(id, { saving: false, saveStatus: "error", saveMsg: e instanceof Error ? e.message : "Gagal" });
    }
  }

  async function test(id: ApiKeyId) {
    update(id, { testing: true, testStatus: "idle", testMsg: "" });
    try {
      const res = await fetch(`/api/admin/api-keys/test?key=${id}`);
      const data = await res.json();
      update(id, { testing: false, testStatus: data.success ? "success" : "error", testMsg: data.message });
    } catch (e) {
      update(id, { testing: false, testStatus: "error", testMsg: e instanceof Error ? e.message : "Error" });
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings — API Keys</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Paste API key langsung ke field, lalu klik Save. Keys disimpan terenkripsi (AES-256-GCM).
        </p>
      </div>

      <div className="space-y-4">
        {keys.map(key => {
          const f = fields[key.id] ?? DEFAULT_FIELD;
          // Determine what's displayed in the input
          const displayValue = f.inputValue !== "" ? f.inputValue : f.revealedValue;
          const activeValue = getActiveValue(f);
          const hasUnsaved = activeValue.length > 0;

          return (
            <div key={key.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{key.label}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{key.description}</p>
                </div>
                {key.configured && !hasUnsaved && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full shrink-0">
                    ✓ Configured
                  </span>
                )}
                {hasUnsaved && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full shrink-0">
                    Unsaved
                  </span>
                )}
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  type={f.showValue ? "text" : "password"}
                  value={displayValue}
                  onChange={e => update(key.id, { inputValue: e.target.value, saveStatus: "idle" })}
                  placeholder={key.configured ? `${key.placeholder} (sudah dikonfigurasi — paste untuk ganti)` : key.placeholder}
                  className={inpBase}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />

                {/* Show/Hide toggle */}
                <button
                  type="button"
                  onClick={() => update(key.id, { showValue: !f.showValue })}
                  className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shrink-0"
                  title={f.showValue ? "Sembunyikan nilai" : "Tampilkan nilai"}
                >
                  {f.showValue ? "Hide" : "Show"}
                </button>

                {/* Reveal existing value from server */}
                {key.configured && !f.revealedValue && !f.inputValue && (
                  <button
                    type="button"
                    onClick={() => reveal(key.id as ApiKeyId)}
                    disabled={f.saving}
                    className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 shrink-0"
                  >
                    {f.saving ? "..." : "Reveal"}
                  </button>
                )}

                {/* Save */}
                {hasUnsaved && (
                  <button
                    type="button"
                    onClick={() => save(key.id as ApiKeyId, activeValue)}
                    disabled={f.saving}
                    className="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 shrink-0"
                  >
                    {f.saving ? "Saving..." : "Save"}
                  </button>
                )}

                {/* Test */}
                {key.configured && (
                  <button
                    type="button"
                    onClick={() => test(key.id as ApiKeyId)}
                    disabled={f.testing}
                    className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 shrink-0"
                  >
                    {f.testing ? "Testing..." : "Test"}
                  </button>
                )}
              </div>

              {/* Status messages */}
              {f.saveStatus !== "idle" && (
                <p className={`text-xs mt-2 ${f.saveStatus === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {f.saveStatus === "success" ? "✓" : "✗"} {f.saveMsg}
                </p>
              )}
              {f.testStatus !== "idle" && (
                <p className={`text-xs mt-2 ${f.testStatus === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {f.testStatus === "success" ? "✓" : "✗"} {f.testMsg}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 text-center">
        Keys dienkripsi AES-256-GCM · MASTER_KEY dari environment variable
      </p>
    </div>
  );
}
