"use client";
import { useState, useRef } from "react";
import type {
  ParsedCVData,
  WorkExperience,
  Education,
  SkillGroup,
} from "@/lib/cv-parser";

type Phase =
  | "upload"
  | "loading"
  | "review"
  | "fallback"
  | "saving"
  | "success"
  | "error";

const inp =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function CVUploader() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [parseErr, setParseErr] = useState("");
  const [data, setData] = useState<ParsedCVData | null>(null);
  const [merge, setMerge] = useState<"replace" | "merge">("merge");
  const [errMsg, setErrMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File) {
    setFileErr(null);
    if (f.type !== "application/pdf")
      return setFileErr("Hanya file PDF yang didukung");
    if (f.size > 10 * 1024 * 1024)
      return setFileErr("Ukuran file melebihi batas 10 MB");
    setFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setPhase("loading");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/cv-parse", {
        method: "POST",
        body: fd,
      });
      const result = await res.json();
      if (!res.ok) {
        setPhase("error");
        setErrMsg(result.error ?? "Upload gagal");
        return;
      }
      if (result.fallback) {
        setRawText(result.rawText ?? "");
        setParseErr(result.error ?? "AI parsing gagal");
        setPhase("fallback");
      } else {
        setData(result.parsedData);
        setPhase("review");
      }
    } catch (e) {
      setPhase("error");
      setErrMsg(e instanceof Error ? e.message : "Error");
    }
  }

  async function handleSave() {
    if (!data) return;
    setPhase("saving");
    try {
      const res = await fetch("/api/admin/cv-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData: data, mergeStrategy: merge }),
      });
      const result = await res.json();
      if (!res.ok) {
        setPhase("review");
        setErrMsg(result.error ?? "Gagal menyimpan");
        return;
      }
      setPhase("success");
      setTimeout(() => {
        setPhase("upload");
        setFile(null);
        setData(null);
        setErrMsg("");
      }, 3000);
    } catch (e) {
      setPhase("review");
      setErrMsg(e instanceof Error ? e.message : "Error");
    }
  }

  // Work Experience helpers
  function updateExp(i: number, patch: Partial<WorkExperience>) {
    if (!data) return;
    const exps = [...data.work_experience];
    exps[i] = { ...exps[i], ...patch };
    setData({ ...data, work_experience: exps });
  }
  function addExp() {
    if (!data) return;
    setData({
      ...data,
      work_experience: [
        ...data.work_experience,
        {
          id: crypto.randomUUID(),
          company: "",
          role: "",
          startDate: "",
          endDate: "present",
          description: "",
          achievements: [],
          technologies: [],
        },
      ],
    });
  }
  function removeExp(i: number) {
    if (!data) return;
    setData({
      ...data,
      work_experience: data.work_experience.filter((_, idx) => idx !== i),
    });
  }

  // Education helpers
  function updateEdu(i: number, patch: Partial<Education>) {
    if (!data) return;
    const edus = [...data.education];
    edus[i] = { ...edus[i], ...patch };
    setData({ ...data, education: edus });
  }
  function addEdu() {
    if (!data) return;
    setData({
      ...data,
      education: [
        ...data.education,
        {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [],
        },
      ],
    });
  }
  function removeEdu(i: number) {
    if (!data) return;
    setData({
      ...data,
      education: data.education.filter((_, idx) => idx !== i),
    });
  }

  // --- RENDER ---

  if (phase === "upload" || phase === "error")
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Import CV
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload PDF CV kamu. AI akan otomatis mengekstrak work experience,
            education, skills, dan personal info. Kamu bisa review dan edit
            hasilnya sebelum disimpan.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) pickFile(f);
            }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              drag
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && pickFile(e.target.files[0])
              }
            />
            <p className="text-3xl mb-2">📄</p>
            {file ? (
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag &amp; drop PDF atau klik untuk pilih
                </p>
                <p className="text-xs text-gray-400 mt-1">Max 10 MB</p>
              </div>
            )}
          </div>

          {fileErr && (
            <p role="alert" className="text-red-500 text-sm mt-2">
              {fileErr}
            </p>
          )}
          {phase === "error" && errMsg && (
            <p role="alert" className="text-red-500 text-sm mt-2">
              ✗ {errMsg}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || !!fileErr}
            className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload &amp; Parse dengan AI
          </button>
        </div>
      </div>
    );

  if (phase === "loading")
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
        <p className="text-gray-600 dark:text-gray-400">
          Mengekstrak dan mem-parsing CV dengan AI...
        </p>
        <p className="text-xs text-gray-400">
          Ini mungkin memakan waktu 10–30 detik
        </p>
      </div>
    );

  if (phase === "fallback")
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          AI Parsing Gagal
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            ⚠️ {parseErr}
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
            Pastikan OpenAI atau Gemini API key sudah dikonfigurasi di tab
            Settings.
          </p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Teks hasil ekstraksi PDF:
        </p>
        <textarea
          value={rawText}
          readOnly
          rows={12}
          className={`${inp} font-mono text-xs resize-none`}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigator.clipboard.writeText(rawText)}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
          >
            Copy Teks
          </button>
          <button
            onClick={() => setPhase("upload")}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
          >
            ← Upload Ulang
          </button>
        </div>
      </div>
    );

  if (phase === "success")
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="text-5xl">✅</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Data CV Berhasil Disimpan!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Data sudah tersimpan ke portofolio kamu.
        </p>
      </div>
    );

  if (phase === "saving")
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
        <p className="text-gray-600 dark:text-gray-400">
          Menyimpan ke portofolio...
        </p>
      </div>
    );

  // REVIEW phase
  if (!data) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Review Hasil Parsing CV
        </h2>
        <button
          onClick={() => setPhase("upload")}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          ← Upload ulang
        </button>
      </div>

      {errMsg && (
        <p role="alert" className="text-red-500 text-sm mb-4">
          ✗ {errMsg}
        </p>
      )}

      {/* Merge Strategy */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-5 shadow-sm">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          Strategi Penyimpanan
        </h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="merge"
              value="merge"
              checked={merge === "merge"}
              onChange={() => setMerge("merge")}
              className="text-blue-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Merge
              </p>
              <p className="text-xs text-gray-500">
                Tambahkan ke data existing
              </p>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="merge"
              value="replace"
              checked={merge === "replace"}
              onChange={() => setMerge("replace")}
              className="text-blue-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Replace All
              </p>
              <p className="text-xs text-gray-500 text-red-500">
                Timpa semua data existing
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-5 shadow-sm">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Personal Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["name", "title", "email", "location", "phone"] as const).map(
            (field) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                  {field}
                </label>
                <input
                  value={
                    (data.personal_info as unknown as Record<string, string>)[field] ?? ""
                  }
                  onChange={(e) =>
                    setData({
                      ...data,
                      personal_info: {
                        ...data.personal_info,
                        [field]: e.target.value,
                      },
                    })
                  }
                  className={inp}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Work Experience ({data.work_experience.length})
          </h3>
          <button
            onClick={addExp}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg"
          >
            + Tambah
          </button>
        </div>
        <div className="space-y-6">
          {data.work_experience.map((exp, i) => (
            <div
              key={exp.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">
                  #{i + 1}
                </span>
                <button
                  onClick={() => removeExp(i)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company *
                  </label>
                  <input
                    value={exp.company}
                    onChange={(e) => updateExp(i, { company: e.target.value })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role *
                  </label>
                  <input
                    value={exp.role}
                    onChange={(e) => updateExp(i, { role: e.target.value })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date (YYYY-MM)
                  </label>
                  <input
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExp(i, { startDate: e.target.value })
                    }
                    className={inp}
                    placeholder="2022-01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    value={exp.endDate}
                    onChange={(e) => updateExp(i, { endDate: e.target.value })}
                    className={inp}
                    placeholder="present atau 2023-12"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) =>
                    updateExp(i, { description: e.target.value })
                  }
                  rows={2}
                  className={`${inp} resize-none`}
                />
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  value={exp.technologies.join(", ")}
                  onChange={(e) =>
                    updateExp(i, {
                      technologies: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className={inp}
                />
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Achievements (satu per baris)
                </label>
                <textarea
                  value={exp.achievements.join("\n")}
                  onChange={(e) =>
                    updateExp(i, {
                      achievements: e.target.value
                        .split("\n")
                        .filter(Boolean),
                    })
                  }
                  rows={3}
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Education ({data.education.length})
          </h3>
          <button
            onClick={addEdu}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg"
          >
            + Tambah
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div
              key={edu.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">
                  #{i + 1}
                </span>
                <button
                  onClick={() => removeEdu(i)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Institution *
                  </label>
                  <input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEdu(i, { institution: e.target.value })
                    }
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Degree *
                  </label>
                  <input
                    value={edu.degree}
                    onChange={(e) => updateEdu(i, { degree: e.target.value })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEdu(i, { startDate: e.target.value })
                    }
                    className={inp}
                    placeholder="2019-08"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    value={edu.endDate}
                    onChange={(e) => updateEdu(i, { endDate: e.target.value })}
                    className={inp}
                    placeholder="2023-06"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Achievements (satu per baris)
                </label>
                <textarea
                  value={edu.achievements.join("\n")}
                  onChange={(e) =>
                    updateEdu(i, {
                      achievements: e.target.value
                        .split("\n")
                        .filter(Boolean),
                    })
                  }
                  rows={2}
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Skills (
          {data.skills.reduce((acc, g) => acc + g.items.length, 0)} items)
        </h3>
        <div className="space-y-4">
          {data.skills.map((group, gi) => (
            <div
              key={gi}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <input
                value={group.category}
                onChange={(e) => {
                  const sk = [...data.skills];
                  sk[gi] = { ...sk[gi], category: e.target.value };
                  setData({ ...data, skills: sk });
                }}
                className={`${inp} font-medium mb-3`}
                placeholder="Category name"
              />
              <div className="space-y-2">
                {group.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-2">
                    <input
                      value={item.name}
                      onChange={(e) => {
                        const sk = [...data.skills];
                        sk[gi].items[ii] = { ...item, name: e.target.value };
                        setData({ ...data, skills: sk });
                      }}
                      className={`${inp} flex-1`}
                      placeholder="Skill name"
                    />
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {item.level}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={item.level}
                      onChange={(e) => {
                        const sk = [...data.skills];
                        sk[gi].items[ii] = {
                          ...item,
                          level: Number(e.target.value),
                        };
                        setData({ ...data, skills: sk });
                      }}
                      className="w-24"
                    />
                    <button
                      onClick={() => {
                        const sk = [...data.skills];
                        sk[gi].items = sk[gi].items.filter(
                          (_, idx) => idx !== ii
                        );
                        setData({ ...data, skills: sk });
                      }}
                      className="text-xs text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const sk = [...data.skills];
                    sk[gi].items.push({ name: "", level: 75 });
                    setData({ ...data, skills: sk });
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add skill
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setData({
                ...data,
                skills: [
                  ...data.skills,
                  { category: "New Category", items: [] },
                ],
              })
            }
            className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 -mx-4 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Review semua data sebelum menyimpan
        </p>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm"
        >
          Simpan ke Portofolio
        </button>
      </div>
    </div>
  );
}
