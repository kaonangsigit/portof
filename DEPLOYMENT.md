# Deployment Guide — Kaonang Portfolio

Panduan lengkap untuk deploy ke Vercel dengan MongoDB Atlas agar data CMS tersimpan permanen.

---

## Stack

| Layer | Service | Biaya |
|-------|---------|-------|
| Hosting | Vercel | Free |
| Database | MongoDB Atlas | Free (512 MB) |
| Email | Resend | Free (3.000/bulan) |
| Media | `/public/images/` → Vercel static | Free |
| Domain | Custom (beli sendiri) | ~$10-15/tahun |

---

## 1. Setup MongoDB Atlas (Database)

### 1.1 Buat Cluster

1. Buka [cloud.mongodb.com](https://cloud.mongodb.com) → **Create account**
2. **Create Cluster** → pilih **M0 Free Shared** → Region: Singapore → **Create**
3. Tunggu ~3 menit sampai cluster aktif

### 1.2 Buat Database User

1. Sidebar → **Database Access** → **Add New Database User**
2. Username: `portfolio-user`
3. Password: generate yang kuat, **simpan password ini**
4. Role: **Atlas Admin** (atau `readWrite` on database `portfolio`)
5. **Add User**

### 1.3 Whitelist IP

1. Sidebar → **Network Access** → **Add IP Address**
2. Pilih **Allow Access from Anywhere** (`0.0.0.0/0`)
   > Ini diperlukan agar Vercel serverless functions bisa connect
3. **Confirm**

### 1.4 Dapat Connection String

1. Cluster → **Connect** → **Connect your application**
2. Driver: **Node.js**, Version: **5.5 or later**
3. Copy connection string, contoh:
   ```
   mongodb+srv://portfolio-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Ganti `<password>` dengan password yang dibuat tadi

---

## 2. Environment Variables

Buat file `.env.local` (copy dari `.env.example`):

```bash
cp .env.example .env.local
```

Isi semua variabel:

```env
# ── WAJIB ─────────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://portfolio-user:PASSWORD@cluster0.xxx.mongodb.net/portfolio?retryWrites=true&w=majority

# ── Site ──────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_NAME="Kaonang Sigit Prakoso"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# ── GitHub (untuk section GitHub activity) ───────────────────
NEXT_PUBLIC_GITHUB_USERNAME=kaonangsigit
GITHUB_TOKEN=ghp_xxxxxxxxxxxx        # Settings → Developer settings → Token

# ── Social Links ──────────────────────────────────────────────
NEXT_PUBLIC_GITHUB_URL=https://github.com/kaonangsigit
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/kaonang-sigit-prakoso

# ── Admin CMS ─────────────────────────────────────────────────
ADMIN_PASSWORD=pilih_password_kuat_min_12_karakter
MASTER_KEY=random_string_minimal_32_karakter_abcdefghij123456

# ── Email (untuk contact form) ────────────────────────────────
EMAIL_PROVIDER=resend
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=kaonang@youremail.com
RESEND_API_KEY=re_xxxxxxxxxxxx       # resend.com → API Keys

# ── Analytics (opsional) ──────────────────────────────────────
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> **⚠️ PENTING:** Jangan commit `.env.local` ke Git. File ini sudah ada di `.gitignore`.

---

## 3. Deploy ke Vercel

### 3.1 Push ke GitHub

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### 3.2 Import ke Vercel

1. Buka [vercel.com](https://vercel.com) → **New Project**
2. **Import** repository GitHub kamu
3. Framework: **Next.js** (auto-detect)
4. **Add Environment Variables** → masukkan SEMUA variabel dari `.env.local`
   > Cara cepat: Vercel mendukung paste seluruh isi `.env.local` sekaligus
5. **Deploy**

### 3.3 Set Custom Domain

1. Vercel Dashboard → Project → **Settings** → **Domains**
2. **Add Domain** → masukkan domain kamu (e.g. `kaonang.dev`)
3. Ikuti instruksi DNS di registrar domain kamu:
   - **CNAME**: `www` → `cname.vercel-dns.com`
   - **A Record**: `@` → `76.76.21.21`
4. Tunggu propagasi DNS (~5-30 menit)

---

## 4. Verify Deployment

Setelah deploy berhasil:

```bash
# Test public API
curl https://yourdomain.com/api/content-public?type=personal

# Test health check
curl https://yourdomain.com/api/health
```

### Cek MongoDB connection:
Buka `https://yourdomain.com/api/health` → pastikan status `"database": "connected"`

---

## 5. Cara Pakai CMS Admin Panel

1. Buka `https://yourdomain.com/admin`
2. Login dengan `ADMIN_PASSWORD` yang sudah di-set
3. Edit bagian yang ingin diubah:
   - **Personal Info** — nama, bio, lokasi, availability
   - **Experience** — riwayat pekerjaan
   - **Education** — riwayat pendidikan
   - **Skills** — keahlian teknis
   - **Achievements** — pencapaian
   - **Testimonials** — testimonial klien/kolega
   - **Stats** — statistik angka di Hero section
4. Klik **Save** → data tersimpan ke MongoDB dan langsung tampil di website

### Cara update foto profil:
- Upload foto ke folder `public/images/` dengan nama `profile.jpeg`
- Commit dan push → Vercel auto-redeploy

---

## 6. Alur Data CMS

```
User edit di /admin
       ↓
PUT /api/content?type=xxx  (butuh auth cookie)
       ↓
MongoDB Atlas
  collection: "content"
  document: { type: "personal", data: {...}, updatedAt: Date }
       ↓
GET /api/content-public?type=xxx  (public, no auth)
       ↓
1. Coba baca dari content/xxx.json (file lokal)
2. Jika tidak ada → baca dari MongoDB ← DATA TETAP ADA SETELAH DEPLOY
3. Jika tidak ada → return [] (komponen pakai static fallback)
```

---

## 7. GitHub Token (untuk GitHub section)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** → nama: "Portfolio"
3. Scopes: centang `public_repo`, `read:user`
4. **Generate** → copy token → masukkan ke `GITHUB_TOKEN` di Vercel

---

## 8. Email via Resend (untuk contact form)

1. Buka [resend.com](https://resend.com) → buat akun gratis
2. **API Keys** → **Create API Key** → copy
3. **Domains** → tambah domain kamu → verifikasi DNS
4. Masukkan ke env:
   ```
   RESEND_API_KEY=re_xxxxx
   EMAIL_FROM=noreply@yourdomain.com
   CONTACT_EMAIL=email_kamu@gmail.com
   ```

---

## 9. Troubleshooting

| Error | Solusi |
|-------|--------|
| `MongoServerError: bad auth` | Password salah di connection string, cek karakter spesial di-encode |
| `Network timeout` | IP tidak di-whitelist di MongoDB Atlas Network Access |
| `ADMIN_PASSWORD not set` | Tambah env var di Vercel dashboard |
| `GitHub section kosong` | Cek `NEXT_PUBLIC_GITHUB_USERNAME` dan `GITHUB_TOKEN` valid |
| CMS edit tidak muncul setelah save | Cek MongoDB connection, lihat log di Vercel Functions tab |
| Build error `MONGODB_URI` | Pastikan env var sudah ditambah di Vercel, bukan hanya `.env.local` |

---

## 10. Checklist Sebelum Go Live

- [ ] MongoDB Atlas cluster running
- [ ] Semua env vars diset di Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` diisi domain yang benar
- [ ] Admin panel bisa login
- [ ] Contact form bisa kirim email
- [ ] GitHub section menampilkan data
- [ ] Foto profil tampil (`public/images/profile.jpeg`)
- [ ] SSL certificate aktif (Vercel auto-handle)
- [ ] Test di mobile (responsive check)
