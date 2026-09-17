"use client";
import { useState, useEffect } from "react";

interface AboutData {
  title: string;
  bio: string;
}

export default function AboutForm() {
  const [form, setForm] = useState<AboutData>({ title: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/content?type=personal")
      .then(r => r.json())
      .then(d => {
        if (d) {
          setForm({
            title: d.title || "",
            bio: d.bio || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.bio.trim()) {
      showMessage("error", "Title dan Bio wajib diisi");
      return;
    }

    setSaving(true);
    try {
      // Get current personal data first
      const current = await fetch("/api/content?type=personal").then(r => r.json());
      
      // Merge with new about data
      const updated = { ...current, title: form.title, bio: form.bio };
      
      const res = await fetch("/api/content?type=personal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error();
      showMessage("success", "About berhasil disimpan!");
    } catch {
      showMessage("error", "Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.type === "success" ? "✓" : "✗"} {message.text}
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Edit About Section</h2>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title / Role
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="QA Engineer and Backend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio / Description
              <span className="ml-2 text-gray-500">({form.bio.length}/500)</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Bio ini akan muncul di header About section dan di konten About.
            </p>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={6}
              maxLength={500}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write your bio here..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>

      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 <strong>Tips:</strong> Title akan muncul sebagai judul di About section. Bio adalah deskripsi singkat tentang Anda.
        </p>
      </div>
    </div>
  );
}
