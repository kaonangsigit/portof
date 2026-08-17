"use client";
import { useState, useEffect } from "react";

interface Props {
  contentType: string;
  title: string;
  placeholder: string;
  defaultItem: object;
}

export default function SimpleListForm({ contentType, title, placeholder, defaultItem }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [jsonText, setJsonText] = useState("[]");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/content?type=${contentType}`).then(r => r.json()).then(d => {
      const arr = Array.isArray(d) ? d : [];
      setItems(arr);
      setJsonText(JSON.stringify(arr, null, 2));
    }).catch(() => {});
  }, [contentType]);

  function handleAdd() {
    const newItem = { ...defaultItem, id: `item-${Date.now()}` };
    const updated = [...items, newItem];
    setItems(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  }

  async function handleSave() {
    try {
      const parsed = JSON.parse(jsonText);
      setSaving(true); setError(null);
      const res = await fetch(`/api/content?type=${contentType}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setItems(parsed);
      setToast("Berhasil disimpan!");
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON tidak valid");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {toast && <div role="alert" className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-green-500">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm rounded-lg text-gray-700 dark:text-gray-300">+ Tambah Item</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Edit JSON langsung. {placeholder}</p>
      {error && <p role="alert" className="text-red-500 text-sm mb-2">{error}</p>}
      <textarea
        value={jsonText}
        onChange={e => setJsonText(e.target.value)}
        rows={20}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        spellCheck={false}
      />
    </div>
  );
}
