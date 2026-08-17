"use client";
import { useState, useEffect, useRef } from "react";
import type { Certificate } from "@/lib/admin-auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function CertificateUploader() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [desc, setDesc] = useState("");
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCerts(d))
      .catch(() => {});
  }, []);

  function pick(f: File) {
    setErr(null);
    if (!ALLOWED.includes(f.type))
      return setErr("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
    if (f.size > MAX_SIZE) return setErr("File melebihi batas 5 MB.");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim() || !issuer.trim())
      return setErr("File, title, dan issuer wajib diisi.");
    setUploading(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("issuer", issuer);
    fd.append("date", date);
    fd.append("description", desc);
    try {
      const res = await fetch("/api/certificates", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload gagal");
      setCerts((p) => [data, ...p]);
      setFile(null);
      setPreview(null);
      setTitle("");
      setIssuer("");
      setDesc("");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Error");
    } finally {
      setUploading(false);
    }
  }

  async function del(id: string) {
    const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    if (res.ok) setCerts((p) => p.filter((c) => c.id !== id));
    setDelId(null);
  }

  const inp =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Sertifikat
      </h2>

      {/* Upload form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Upload Sertifikat Baru
        </h3>
        <form onSubmit={submit} className="space-y-4">
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
              if (f) pick(f);
            }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              drag
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-32 mx-auto rounded object-contain"
              />
            ) : (
              <div>
                <p className="text-3xl mb-2">📁</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag &amp; drop atau klik untuk pilih file
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP — max 5 MB
                </p>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inp}
                placeholder="Nama sertifikat"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issuer *
              </label>
              <input
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className={inp}
                placeholder="Penerbit"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deskripsi
              </label>
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className={inp}
                placeholder="Opsional"
              />
            </div>
          </div>

          {err && (
            <p role="alert" className="text-red-500 text-sm">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* Certificate list */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Daftar Sertifikat ({certs.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
          >
            {c.image && (
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-4">
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                {c.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {c.issuer} · {c.date}
              </p>
              {delId === c.id ? (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => del(c.id)}
                    className="flex-1 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => setDelId(null)}
                    className="flex-1 py-1 text-xs border border-gray-300 rounded text-gray-600 dark:text-gray-300"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDelId(c.id)}
                  className="mt-3 text-xs text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
        {!certs.length && (
          <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
            Belum ada sertifikat
          </p>
        )}
      </div>
    </div>
  );
}
