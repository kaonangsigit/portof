"use client";
import { useState, useEffect } from "react";
import type { Project } from "@/lib/admin-auth";

const EMPTY = { title: "", description: "", technologies: "", githubUrl: "", liveUrl: "", category: "Full Stack", featured: false };

export default function ProjectForm() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [errs, setErrs] = useState<{ title?: string; description?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => Array.isArray(d) && setProjects(d)).catch(() => {});
  }, []);

  function validate() {
    const e: typeof errs = {};
    if (!form.title.trim()) e.title = "Title wajib diisi";
    if (!form.description.trim()) e.description = "Description wajib diisi";
    setErrs(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const body = { ...form, technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean) };
    const url = editId ? `/api/projects/${editId}` : "/api/projects";
    try {
      const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal");
      if (editId) setProjects(p => p.map(pr => pr.id === editId ? data : pr));
      else setProjects(p => [...p, data]);
      setForm(EMPTY); setEditId(null); setErrs({});
    } catch (ex) { alert(ex instanceof Error ? ex.message : "Error"); }
    finally { setSubmitting(false); }
  }

  function startEdit(p: Project) {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description, technologies: p.technologies.join(", "), githubUrl: p.githubUrl ?? "", liveUrl: p.liveUrl ?? "", category: p.category, featured: p.featured });
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects(p => p.filter(pr => pr.id !== id));
    setDelId(null);
  }

  const inp = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{editId ? "Edit Project" : "Tambah Project"}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inp} />
              {errs.title && <p className="text-red-500 text-xs mt-1">{errs.title}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp}>
                {["Full Stack","Frontend","Backend","Mobile","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={`${inp} resize-none`} />
            {errs.description && <p className="text-red-500 text-xs mt-1">{errs.description}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies (comma-separated)</label>
            <input value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} className={inp} placeholder="React, TypeScript, Node.js" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
              <input type="url" value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Live URL</label>
              <input type="url" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} className={inp} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">{submitting ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }} className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg text-gray-700 dark:text-gray-300">Batal</button>}
          </div>
        </form>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daftar Projects ({projects.length})</h3>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-start justify-between gap-4 shadow-sm">
            <div><p className="font-medium text-sm text-gray-900 dark:text-white">{p.title}</p><p className="text-xs text-gray-500 dark:text-gray-400">{p.category} · {p.technologies.slice(0,3).join(", ")}</p></div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
              {delId === p.id
                ? <><button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg">Hapus</button><button onClick={() => setDelId(null)} className="text-xs px-3 py-1 border border-gray-300 rounded-lg text-gray-600 dark:text-gray-300">Batal</button></>
                : <button onClick={() => setDelId(p.id)} className="text-xs px-3 py-1 text-red-500 hover:text-red-700">Hapus</button>
              }
            </div>
          </div>
        ))}
        {!projects.length && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">Belum ada project</p>}
      </div>
    </div>
  );
}
