"use client";
import { useState, useEffect, useRef } from "react";
import type { PersonalInfo } from "@/lib/admin-auth";

const DEF: PersonalInfo = { name: "", title: "", subtitle: "", bio: "", email: "", location: "", availability: "", skills: [] };

export default function PersonalInfoForm() {
  const [form, setForm] = useState<PersonalInfo>(DEF);
  const [skill, setSkill] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success"|"error"; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoErr, setPhotoErr] = useState<string|null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeErr, setResumeErr] = useState<string|null>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content?type=personal").then(r => r.json()).then(d => d && typeof d === "object" && setForm(prev => ({ ...DEF, ...d }))).catch(() => {});
  }, []);

  function showToast(type: "success"|"error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function uploadPhoto(file: File) {
    setUploading(true); setPhotoErr(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/profile-photo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload gagal");
      setForm(prev => ({ ...prev, profileImage: data.imageUrl } as any));
      showToast("success", "Foto profil berhasil diupload!");
    } catch (e) { setPhotoErr(e instanceof Error ? e.message : "Error"); }
    finally { setUploading(false); }
  }

  async function uploadResume(file: File) {
    setUploadingResume(true); setResumeErr(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/resume", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload gagal");
      setForm(prev => ({ ...prev, resumeUrl: data.resumeUrl } as any));
      showToast("success", "Resume berhasil diupload!");
    } catch (e) { setResumeErr(e instanceof Error ? e.message : "Error"); }
    finally { setUploadingResume(false); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/content?type=personal", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      showToast("success", "Data berhasil disimpan!");
    } catch { showToast("error", "Gagal menyimpan. Coba lagi."); }
    finally { setSaving(false); }
  }

  function addSkill() {
    const s = skill.trim();
    if (s && !form.skills.includes(s)) { setForm({ ...form, skills: [...form.skills, s] }); setSkill(""); }
  }

  const inp = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (preview) return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preview</h2>
        <button onClick={() => setPreview(false)} className="text-sm text-blue-600 hover:underline">← Kembali</button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm max-w-xl">
        {(form as any).profileImage && (
          <img src={(form as any).profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 mb-4" />
        )}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{form.name || "—"}</h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium">{form.title || "—"}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{form.subtitle || "—"}</p>
        <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm leading-relaxed">{form.bio || "—"}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500 dark:text-gray-400">Email: </span>{form.email || "—"}</div>
          <div><span className="text-gray-500 dark:text-gray-400">Location: </span>{form.location || "—"}</div>
          <div className="col-span-2"><span className="text-gray-500 dark:text-gray-400">Status: </span>{form.availability || "—"}</div>
        </div>
        {form.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.skills.map(s => <span key={s} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">{s}</span>)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {toast && <div role="alert" className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>{toast.msg}</div>}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Info</h2>
        <button type="button" onClick={() => setPreview(true)} className="text-sm px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Preview</button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        {/* Profile Photo Upload */}
        <div className="flex items-center gap-5 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="shrink-0">
            {(form as any).profileImage ? (
              <img src={(form as any).profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {form.name?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Foto Profil</p>
            <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
            <button type="button" onClick={() => photoRef.current?.click()} disabled={uploading} className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
              {uploading ? "Uploading..." : "Upload Foto"}
            </button>
            {photoErr && <p className="text-red-500 text-xs mt-1">{photoErr}</p>}
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, GIF · Max 5 MB</p>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="flex items-center gap-5 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl">📄</div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Resume / CV (PDF)</p>
            {(form as any).resumeUrl ? (
              <a href={(form as any).resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                ✓ Resume tersimpan — klik untuk lihat
              </a>
            ) : (
              <p className="text-xs text-gray-400">Belum ada resume</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <input ref={resumeRef} type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && uploadResume(e.target.files[0])} />
              <button type="button" onClick={() => resumeRef.current?.click()} disabled={uploadingResume} className="px-4 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                {uploadingResume ? "Uploading..." : "Upload Resume PDF"}
              </button>
            </div>
            {resumeErr && <p className="text-red-500 text-xs mt-1">{resumeErr}</p>}
            <p className="text-xs text-gray-400 mt-1">PDF · Max 10 MB</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["name","title","subtitle","email","location","availability"] as const).map(f => (
              <div key={f}>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{f}</label>
                <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} className={inp} />
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Social Links</label>
            <div className="space-y-2">
              {(["github","linkedin","twitter","instagram"] as const).map(platform => (
                <div key={platform} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-20 capitalize shrink-0">{platform}</span>
                  <input
                    value={((form as any).socialLinks as Record<string,string>)?.[platform] ?? ""}
                    onChange={e => setForm({ ...form, socialLinks: { ...((form as any).socialLinks || {}), [platform]: e.target.value } } as any)}
                    className={`${inp} text-xs`}
                    placeholder={`https://${platform}.com/username`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} className={`${inp} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                  {s}
                  <button type="button" onClick={() => setForm({ ...form, skills: form.skills.filter(x => x !== s) })} className="hover:text-red-500 ml-1" aria-label={`Hapus ${s}`}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={skill} onChange={e => setSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} className={`${inp} flex-1`} placeholder="Tambah skill, tekan Enter" />
              <button type="button" onClick={addSkill} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm">Add</button>
            </div>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
        </form>
      </div>
    </div>
  );
}
