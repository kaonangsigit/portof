"use client";
import { useState, useEffect } from "react";

const INP = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

interface StatItem { label: string; value: string; icon: string; }

const STAT_ICONS = ["✓","📊","🔌","📅","🚀","⭐","💼","📝"];

export default function HeroForm() {
  // ── Personal data fields ─────────────────────────────────────
  const [name,         setName]         = useState("");
  const [role,         setRole]         = useState("");
  const [subtitle,     setSubtitle]     = useState("");
  const [bio,          setBio]          = useState("");
  const [availability, setAvailability] = useState("");
  const [heroRoles,    setHeroRoles]    = useState(""); // comma-separated
  const [techStack,    setTechStack]    = useState(""); // comma-separated
  const [newTech,      setNewTech]      = useState("");
  const [techArr,      setTechArr]      = useState<string[]>([]);

  // ── Stats ────────────────────────────────────────────────────
  const [stats, setStats] = useState<StatItem[]>([
    { label: "Documents Validated", value: "200+", icon: "✓"  },
    { label: "Data Records",        value: "1000+", icon: "📊" },
    { label: "APIs Tested",         value: "50+",  icon: "🔌" },
    { label: "Years Experience",    value: "2+",   icon: "📅" },
  ]);

  // ── UI state ─────────────────────────────────────────────────
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingStats,    setSavingStats]    = useState(false);
  const [toast, setToast] = useState<{ type: "success"|"error"; msg: string }|null>(null);

  function showToast(type: "success"|"error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Load data ─────────────────────────────────────────────────
  useEffect(() => {
    // Personal
    fetch("/api/content?type=personal")
      .then(r => r.json())
      .then(d => {
        if (!d || typeof d !== "object") return;
        setName(d.name ?? "");
        setRole(d.title ?? "");
        setSubtitle(d.subtitle ?? "");
        setBio(d.bio ?? "");
        setAvailability(d.availability ?? "");
        const roles = Array.isArray(d.heroRoles) ? d.heroRoles : [];
        setHeroRoles(roles.join(", "));
        const tech = Array.isArray(d.techStack) ? d.techStack : [];
        setTechArr(tech);
      })
      .catch(() => {});

    // Stats
    fetch("/api/content?type=stats")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setStats(d); })
      .catch(() => {});
  }, []);

  // ── Save personal ────────────────────────────────────────────
  async function savePersonal(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { showToast("error", "Nama wajib diisi"); return; }
    setSavingPersonal(true);
    try {
      const current = await fetch("/api/content?type=personal").then(r => r.json()).catch(() => ({}));
      const updated = {
        ...current,
        name: name.trim(),
        title: role.trim(),
        subtitle: subtitle.trim(),
        bio: bio.trim(),
        availability: availability.trim(),
        heroRoles: heroRoles.split(",").map(s => s.trim()).filter(Boolean),
        techStack: techArr,
      };
      const res = await fetch("/api/content?type=personal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      showToast("success", "Hero info tersimpan!");
    } catch { showToast("error", "Gagal menyimpan. Coba lagi."); }
    finally { setSavingPersonal(false); }
  }

  // ── Save stats ───────────────────────────────────────────────
  async function saveStats(e: React.FormEvent) {
    e.preventDefault();
    setSavingStats(true);
    try {
      const res = await fetch("/api/content?type=stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });
      if (!res.ok) throw new Error();
      showToast("success", "Stats tersimpan!");
    } catch { showToast("error", "Gagal menyimpan stats."); }
    finally { setSavingStats(false); }
  }

  // ── Tech stack helpers ───────────────────────────────────────
  function addTech() {
    const t = newTech.trim();
    if (t && !techArr.includes(t)) { setTechArr([...techArr, t]); setNewTech(""); }
  }
  function removeTech(t: string) { setTechArr(techArr.filter(x => x !== t)); }

  // ── Stats helpers ────────────────────────────────────────────
  function updateStat(i: number, field: keyof StatItem, val: string) {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }
  function addStat() {
    setStats(prev => [...prev, { label: "Label Baru", value: "0+", icon: "📊" }]);
  }
  function removeStat(i: number) {
    setStats(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="max-w-4xl space-y-8">

      {/* Toast */}
      {toast && (
        <div role="alert" className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓" : "✗"} {toast.msg}
        </div>
      )}

      {/* ── SECTION 1: Hero Info ──────────────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">🎬 Hero Info</h2>
          <p className="text-xs text-slate-400 mt-1">Nama, role, bio, availability, rotating roles</p>
        </div>

        <form onSubmit={savePersonal} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap *</label>
              <input value={name} onChange={e => setName(e.target.value)} className={INP} placeholder="Kaonang Sigit Prakoso" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Title / Role Utama</label>
              <input value={role} onChange={e => setRole(e.target.value)} className={INP} placeholder="QA Engineer & Backend Developer" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subtitle</label>
              <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className={INP} placeholder="Quality Assurance • API Development • Data Analysis" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status Availability</label>
              <input value={availability} onChange={e => setAvailability(e.target.value)} className={INP} placeholder="Open to Work" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Bio
              <span className="ml-2 text-slate-500 font-normal">({bio.length}/500)</span>
            </label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={500}
              className={`${INP} resize-none`} placeholder="QA Engineer and Backend Developer with 2+ years..." />
          </div>

          {/* Rotating Roles */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Rotating Roles
              <span className="ml-2 text-slate-500 font-normal">pisahkan koma — muncul di &ldquo;I&apos;m a...&rdquo;</span>
            </label>
            <input value={heroRoles} onChange={e => setHeroRoles(e.target.value)} className={INP}
              placeholder="QA Engineer, Backend Developer, API Tester, Data Analyst" />
            {/* Preview */}
            {heroRoles && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {heroRoles.split(",").map(s => s.trim()).filter(Boolean).map((r, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">{r}</span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={savingPersonal}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
            {savingPersonal ? "Menyimpan..." : "💾 Simpan Hero Info"}
          </button>
        </form>
      </div>

      {/* ── SECTION 2: Tech Stack Pills ───────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">⚡ Tech Stack Pills</h2>
          <p className="text-xs text-slate-400 mt-1">Muncul di bagian bawah teks Hero</p>
        </div>

        <div className="flex gap-2">
          <input value={newTech} onChange={e => setNewTech(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
            className={`${INP} flex-1`} placeholder="Tambah teknologi (e.g., Python)" />
          <button type="button" onClick={addTech}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
            + Tambah
          </button>
        </div>

        {techArr.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {techArr.map(t => (
              <div key={t} className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/15
                border border-blue-500/30 text-blue-300 text-xs rounded-full">
                {t}
                <button onClick={() => removeTech(t)} className="hover:text-red-400 transition-colors font-bold">×</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Belum ada tech stack. Tambahkan di atas.</p>
        )}

        <button type="button" onClick={async () => {
            setSavingPersonal(true);
            try {
              const current = await fetch("/api/content?type=personal").then(r => r.json()).catch(() => ({}));
              await fetch("/api/content?type=personal", {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...current, techStack: techArr }),
              });
              showToast("success", "Tech stack tersimpan!");
            } catch { showToast("error", "Gagal menyimpan."); }
            finally { setSavingPersonal(false); }
          }}
          disabled={savingPersonal}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
          {savingPersonal ? "Menyimpan..." : "💾 Simpan Tech Stack"}
        </button>
      </div>

      {/* ── SECTION 3: Stats ──────────────────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">📊 Stats</h2>
            <p className="text-xs text-slate-400 mt-1">Angka di bottom bar Hero + floating badges di foto</p>
          </div>
          <button type="button" onClick={addStat}
            className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            + Tambah
          </button>
        </div>

        <form onSubmit={saveStats} className="space-y-3">
          {stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[2rem_1fr_1fr_2rem_auto] gap-2 items-center">
              {/* Icon picker */}
              <select value={s.icon} onChange={e => updateStat(i, "icon", e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-lg text-white text-sm px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STAT_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <input value={s.label} onChange={e => updateStat(i, "label", e.target.value)}
                className={INP} placeholder="Label (e.g., APIs Tested)" />
              <input value={s.value} onChange={e => updateStat(i, "value", e.target.value)}
                className={INP} placeholder="Nilai (e.g., 50+)" />
              <span className="text-xs text-slate-500 text-center leading-none">#{i+1}</span>
              <button type="button" onClick={() => removeStat(i)}
                className="px-2.5 py-1.5 text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors">
                ✕
              </button>
            </div>
          ))}

          {/* Live preview */}
          {stats.length > 0 && (
            <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Preview</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {stats.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-white/3 border border-white/5 text-center">
                    <span className="text-base">{s.icon}</span>
                    <span className="text-lg font-black text-white">{s.value}</span>
                    <span className="text-[9px] text-slate-500">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={savingStats}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
            {savingStats ? "Menyimpan..." : "💾 Simpan Stats"}
          </button>
        </form>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-500/8 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-blue-300 leading-relaxed">
          💡 <strong>Cara edit Hero:</strong>
          <br />• <strong>Hero Info</strong> — nama, rotating roles, bio, status
          <br />• <strong>Tech Stack</strong> — pills di bawah teks Hero (Python, FastAPI, dll)
          <br />• <strong>Stats</strong> — angka floating di foto + bar bawah (200+, 50+, 1000+, dll)
          <br />• <strong>Foto profil</strong> — edit di tab Personal Info
          <br />Perubahan langsung tampil setelah simpan + refresh browser.
        </p>
      </div>
    </div>
  );
}
