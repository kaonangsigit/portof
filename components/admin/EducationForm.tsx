"use client";
import { useState, useEffect } from "react";

interface EduItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  achievements: string; // newline-separated in form, array in JSON
}

const EMPTY: EduItem = {
  id: "", institution: "", degree: "", period: "",
  description: "", achievements: "",
};

const INP = "w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function EducationForm() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/content?type=education")
      .then(r => r.json())
      .then(d => Array.isArray(d) && setItems(d))
      .catch(() => {});
  }, []);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.institution.trim() || !form.degree.trim()) {
      showToast("error", "Institution dan Degree wajib diisi");
      return;
    }
    setSaving(true);

    const entry = {
      id: editId ?? `edu-${Date.now()}`,
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      period: form.period.trim(),
      description: form.description.trim(),
      achievements: form.achievements
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean),
    };

    const updated = editId
      ? items.map(i => (i.id === editId ? entry : i))
      : [...items, entry];

    try {
      const res = await fetch("/api/content?type=education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      setItems(updated);
      setForm(EMPTY);
      setEditId(null);
      showToast("success", editId ? "Education diperbarui!" : "Education ditambahkan!");
    } catch {
      showToast("error", "Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      id: item.id,
      institution: item.institution ?? "",
      degree: item.degree ?? "",
      period: item.period ?? "",
      description: item.description ?? "",
      achievements: (item.achievements ?? []).join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function del(id: string) {
    if (!confirm("Hapus pendidikan ini?")) return;
    const updated = items.filter(i => i.id !== id);
    await fetch("/api/content?type=education", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setItems(updated);
    showToast("success", "Dihapus.");
  }

  function cancel() {
    setForm(EMPTY);
    setEditId(null);
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Form */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-5">
          {editId ? "✏️ Edit Education" : "➕ Tambah Education"}
        </h2>

        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Institusi *</label>
              <input
                value={form.institution}
                onChange={e => setForm({ ...form, institution: e.target.value })}
                className={INP}
                placeholder="Universitas / Sekolah"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gelar / Program *</label>
              <input
                value={form.degree}
                onChange={e => setForm({ ...form, degree: e.target.value })}
                className={INP}
                placeholder="S1 Teknik Informatika"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Periode</label>
              <input
                value={form.period}
                onChange={e => setForm({ ...form, period: e.target.value })}
                className={INP}
                placeholder="2018 – 2022"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Deskripsi
              <span className="ml-2 text-slate-500">({form.description.length}/400)</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              maxLength={400}
              className={`${INP} resize-none`}
              placeholder="Jurusan, fokus studi, dll."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Pencapaian
              <span className="ml-2 text-slate-500">(satu per baris)</span>
            </label>
            <textarea
              value={form.achievements}
              onChange={e => setForm({ ...form, achievements: e.target.value })}
              rows={3}
              className={`${INP} resize-none`}
              placeholder={"IPK 3.8\nJuara 1 Hackathon\nBeasiswa penuh"}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              {saving ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancel}
                className="px-6 py-2.5 border border-slate-600 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
          Daftar Education ({items.length})
        </h3>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <p className="text-4xl mb-3">🎓</p>
            <p className="text-slate-400 text-sm">Belum ada data education. Tambahkan di atas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-5
                  flex items-start justify-between gap-4 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="text-2xl shrink-0 mt-0.5">🎓</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-tight">{item.degree}</p>
                    <p className="text-blue-400 text-sm mt-0.5">{item.institution}</p>
                    {item.period && (
                      <p className="text-slate-500 text-xs mt-1">{item.period}</p>
                    )}
                    {item.description && (
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.achievements?.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {item.achievements.slice(0, 3).map((a: string, i: number) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="text-blue-400">✓</span>{a}
                          </li>
                        ))}
                        {item.achievements.length > 3 && (
                          <li className="text-xs text-slate-600">
                            +{item.achievements.length - 3} lainnya...
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(item.id)}
                    className="px-3 py-1.5 text-xs bg-red-900/40 hover:bg-red-900/70 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
