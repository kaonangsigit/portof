"use client";
import { useState, useEffect } from "react";

interface Exp {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string;  // stored as \n-separated string in form, array in JSON
  technologies: string; // stored as comma-separated string in form, array in JSON
  current: boolean;
}

const EMPTY = { id: "", company: "", role: "", period: "", description: "", achievements: "", technologies: "", current: false };

export default function ExperienceForm() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content?type=experience").then(r => r.json()).then(d => Array.isArray(d) && setItems(d)).catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    setSaving(true);
    const entry = {
      id: editId ?? `exp-${Date.now()}`,
      company: form.company,
      role: form.role,
      period: form.period,
      description: form.description,
      achievements: form.achievements.split("\n").map(s => s.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map(s => s.trim()).filter(Boolean),
      current: form.current,
    };
    let updated: any[];
    if (editId) {
      updated = items.map(i => i.id === editId ? entry : i);
    } else {
      updated = [...items, entry];
    }
    try {
      const res = await fetch("/api/content?type=experience", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
      if (!res.ok) throw new Error();
      setItems(updated);
      setForm(EMPTY); setEditId(null);
    } catch { alert("Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({ id: item.id, company: item.company, role: item.role, period: item.period, description: item.description, achievements: (item.achievements || []).join("\n"), technologies: (item.technologies || []).join(", "), current: item.current ?? false });
  }

  async function del(id: string) {
    if (!confirm("Hapus experience ini?")) return;
    const updated = items.filter(i => i.id !== id);
    await fetch("/api/content?type=experience", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setItems(updated);
  }

  const inp = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{editId ? "Edit Experience" : "Tambah Experience"}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Perusahaan *</label><input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inp} required /></div>
            <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Posisi *</label><input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inp} required /></div>
            <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Periode</label><input value={form.period} onChange={e => setForm({...form, period: e.target.value})} className={inp} placeholder="2022 - Present" /></div>
            <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies</label><input value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} className={inp} placeholder="React, Node.js, TypeScript" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className={`${inp} resize-none`} /></div>
          <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Achievements (satu per baris)</label><textarea value={form.achievements} onChange={e => setForm({...form, achievements: e.target.value})} rows={3} className={`${inp} resize-none`} placeholder={"Meningkatkan performa 40%\nMemimpin tim 3 developer"} /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.current} onChange={e => setForm({...form, current: e.target.checked})} className="rounded" /><span className="text-sm text-gray-700 dark:text-gray-300">Posisi saat ini</span></label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">{saving ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }} className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg text-gray-700 dark:text-gray-300">Batal</button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-start justify-between gap-4 shadow-sm">
            <div><p className="font-medium text-sm text-gray-900 dark:text-white">{i.role} <span className="text-gray-400">@</span> {i.company}</p><p className="text-xs text-gray-500">{i.period}{i.current ? " · Sekarang" : ""}</p></div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(i)} className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Edit</button>
              <button onClick={() => del(i.id)} className="text-xs px-3 py-1 text-red-500 hover:text-red-700">Hapus</button>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-gray-500 text-center py-8">Belum ada experience</p>}
      </div>
    </div>
  );
}
