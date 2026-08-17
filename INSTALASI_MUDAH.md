# 🚀 INSTALASI MUDAH - Portfolio Website

## Panduan Instalasi Super Simpel untuk Pemula

**Waktu yang Dibutuhkan**: 30-60 menit  
**Tingkat Kesulitan**: Mudah - Tinggal copy-paste!

---

## 📋 YANG PERLU DISIAPKAN DULU

### 1. Instal Node.js
**Apa itu?** Program yang dibutuhkan untuk menjalankan website ini.

**Cara Instal:**
1. Buka https://nodejs.org
2. Download versi "LTS" (yang direkomendasikan)
3. Klik file yang didownload dan ikuti petunjuknya
4. Klik "Next" terus sampai selesai

**Cara Cek Sudah Berhasil:**
```bash
node --version
```
Kalau muncul angka seperti `v18.17.0` atau `v20.x.x` berarti sudah berhasil! ✅

### 2. Instal Git (Opsional, tapi direkomendasikan)
**Apa itu?** Program untuk download dan kelola kode.

**Cara Instal:**
1. Buka https://git-scm.com
2. Download untuk sistem operasi kamu
3. Instal dengan klik "Next" terus

**Cara Cek:**
```bash
git --version
```
Kalau muncul `git version 2.x.x` berarti berhasil! ✅

---

## 🎯 LANGKAH 1: DOWNLOAD PROJECT

### Cara 1: Pakai Git (Direkomendasikan)
```bash
# 1. Buka Terminal atau Command Prompt
# 2. Pindah ke folder yang kamu mau (misalnya Desktop)
cd Desktop

# 3. Download project
git clone https://github.com/username/portfolio.git

# 4. Masuk ke folder project
cd portfolio
```

**Apa yang terjadi?**  
Project akan didownload ke folder `Desktop/portfolio`

### Cara 2: Download Manual (Kalau tidak ada Git)
1. Buka folder project di komputer
2. Sudah ada file-file yang lengkap
3. Buka Terminal/Command Prompt di folder tersebut

**Cara buka Terminal di folder:**
- **Windows**: Klik kanan di folder → "Open in Terminal" atau "Git Bash Here"
- **Mac**: Klik kanan di folder → "Services" → "New Terminal at Folder"
- **Linux**: Klik kanan → "Open Terminal Here"

---

## 🎯 LANGKAH 2: INSTAL DEPENDENCIES

**Apa itu dependencies?** File-file pendukung yang dibutuhkan website.

```bash
npm install
```

**Apa yang terjadi?**  
- Akan muncul banyak teks di layar (ini normal!)
- Folder `node_modules` akan dibuat otomatis
- Proses ini butuh 2-5 menit tergantung internet kamu

**Kalau berhasil, kamu akan lihat:**
```
added 312 packages in 2m
```

**Kalau ada error:**
```bash
# Coba perintah ini
npm cache clean --force
npm install
```

---

## 🎯 LANGKAH 3: SETTING ENVIRONMENT VARIABLES

**Apa itu?** File konfigurasi yang berisi informasi pribadi kamu.

### Step by Step:

```bash
# 1. Copy file contoh
# Untuk Mac/Linux:
cp .env.example .env.local

# Untuk Windows (Command Prompt):
copy .env.example .env.local

# Untuk Windows (PowerShell):
Copy-Item .env.example .env.local
```

### 2. Buka File `.env.local`
Buka dengan aplikasi text editor apapun (Notepad, VS Code, Sublime, dll)

### 3. Isi Informasi Ini (WAJIB):

```bash
# Ganti dengan username GitHub kamu
GITHUB_USERNAME=usernamekamu
NEXT_PUBLIC_GITHUB_USERNAME=usernamekamu

# GitHub Token (baca cara dapat di bawah)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Email kamu
CONTACT_EMAIL=email@kamu.com
EMAIL_FROM=noreply@kamu.com

# Website kamu (ganti saat sudah online)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# API Key untuk email (pilih salah satu)
RESEND_API_KEY=re_xxxxxxxxxxxx
# ATAU
# SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

### 📝 Cara Dapat GitHub Token:

1. Buka https://github.com/settings/tokens
2. Klik "Generate new token" → "Generate new token (classic)"
3. Kasih nama: "Portfolio Website"
4. Centang kotak: `public_repo`
5. Klik "Generate token" di bawah
6. **COPY TOKEN-NYA SEKARANG** (tidak bisa dilihat lagi nanti!)
7. Paste ke file `.env.local` di bagian `GITHUB_TOKEN=`

### 📧 Cara Dapat API Key Email (Resend - Paling Mudah):

1. Buka https://resend.com
2. Sign up gratis (pakai email)
3. Setelah masuk, klik "API Keys"
4. Klik "Create API Key"
5. Kasih nama: "Portfolio Contact Form"
6. Copy API key yang muncul
7. Paste ke `.env.local` di bagian `RESEND_API_KEY=`

**Gratis?** Ya! Resend kasih 3,000 email/bulan gratis.

---

## 🎯 LANGKAH 4: GANTI FOTO DAN GAMBAR

### Foto Profil Kamu:
```bash
# Taruh foto kamu di:
public/profile.jpg
```
**Tips:**
- Ukuran: 400x400 pixel atau lebih
- Format: JPG atau PNG
- Nama file: `profile.jpg` (harus persis!)

### OG Image (Gambar untuk Social Media):
```bash
# Taruh gambar di:
public/og-image.jpg
```
**Tips:**
- Ukuran: 1200x630 pixel (ukuran standar)
- Format: JPG atau PNG
- Ini gambar yang muncul kalau kamu share di Facebook/Twitter

### Resume/CV (Opsional):
```bash
# Taruh file PDF resume kamu di:
public/resume.pdf
```
**Tips:**
- Hapus file `resume.pdf.txt` yang ada
- Ganti dengan file PDF resume kamu
- Nama file: `resume.pdf`

---

## 🎯 LANGKAH 5: ISI DATA PRIBADI KAMU

Buka file: `lib/data.ts`

Cari dan ganti informasi ini:

```typescript
// Ganti dengan info kamu
export const personalInfo = {
  name: "Nama Kamu",
  title: "Full Stack Developer",
  email: "email@kamu.com",
  phone: "+62 812-3456-7890",
  location: "Jakarta, Indonesia",
  // ... dan seterusnya
}
```

**File ini berisi:**
- Info pribadi kamu
- Daftar skills
- Project portfolio
- Pengalaman kerja
- Pendidikan
- Dan lain-lain

**Tips:** Edit perlahan, jangan hapus struktur kode-nya, cuma ganti isinya aja!

---

## 🎯 LANGKAH 6: JALANKAN WEBSITE

```bash
npm run dev
```

**Apa yang terjadi?**  
- Server akan jalan di komputer kamu
- Akan muncul teks: `Ready - started server on 0.0.0.0:3000`
- Website bisa dibuka di browser!

### Buka Browser:
```
http://localhost:3000
```

**BOOM! Website kamu sudah jalan!** 🎉

**Yang kamu lihat:**
- Website portfolio kamu live di komputer
- Setiap kali kamu edit file, otomatis refresh
- Coba klik-klik semua menu

---

## 🎯 LANGKAH 7: CEK SEMUANYA BERFUNGSI

### Cek 1: Lihat Semua Halaman
- [ ] Homepage muncul
- [ ] Foto profil muncul
- [ ] Semua section tampil (About, Skills, Projects, dll)
- [ ] Navigasi berfungsi
- [ ] Theme toggle (terang/gelap) berfungsi

### Cek 2: Test Contact Form
- [ ] Isi form kontak
- [ ] Klik "Send Message"
- [ ] Cek email kamu, harusnya dapat email

### Cek 3: Test GitHub Integration
- [ ] Section "Projects" menampilkan repo GitHub kamu
- [ ] Stats menampilkan data dari GitHub

**Kalau ada yang tidak jalan:** Lihat bagian "Troubleshooting" di bawah!

---

## 🎯 LANGKAH 8: BUILD UNTUK PRODUCTION

Sebelum deploy online, test dulu build production:

```bash
# Stop server dev (tekan Ctrl+C)

# Build untuk production
npm run build
```

**Apa yang terjadi?**
- Next.js akan compile website kamu
- Optimasi gambar, CSS, JavaScript
- Proses ini 1-3 menit

**Kalau berhasil, akan muncul:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (14/14)
✓ Finalizing page optimization
```

**Test hasil build:**
```bash
npm run start
```

Buka lagi `http://localhost:3000` - Ini versi yang akan online!

---

## 🎯 LANGKAH 9: DEPLOY ONLINE (GRATIS!)

### Cara 1: Deploy ke Vercel (Paling Mudah & Gratis)

1. **Daftar Vercel:**
   - Buka https://vercel.com
   - Klik "Sign Up"
   - Login pakai GitHub

2. **Import Project:**
   - Klik "Add New..." → "Project"
   - Pilih repository portfolio kamu
   - Klik "Import"

3. **Configure:**
   - Framework Preset: Next.js (otomatis terdeteksi)
   - Root Directory: `./`
   - Klik "Environment Variables"
   - Copy semua isi dari `.env.local` kamu
   - Paste satu per satu (nama dan value)

4. **Deploy:**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - **WEBSITE KAMU ONLINE!** 🚀

5. **Dapat URL:**
   ```
   https://portfolio-username.vercel.app
   ```

### Cara 2: Deploy ke Netlify (Alternatif Gratis)

1. **Daftar Netlify:**
   - Buka https://netlify.com
   - Sign up pakai GitHub

2. **Deploy:**
   - Drag & drop folder project kamu
   - ATAU connect ke GitHub repo
   - Set environment variables
   - Klik "Deploy"

3. **Done!**
   ```
   https://portfolio-username.netlify.app
   ```

---

## ✅ CARA TAU KALAU BERHASIL

### Development (Local):
```bash
npm run dev
# Kalau muncul:
# ✓ Ready in 2.3s
# ➜ Local: http://localhost:3000
# Berarti BERHASIL! ✅
```

### Build:
```bash
npm run build
# Kalau muncul:
# ✓ Compiled successfully
# Berarti BERHASIL! ✅
```

### Production:
```bash
npm run start
# Kalau muncul:
# ▲ Next.js 14.2.5
# - Local: http://localhost:3000
# Berarti BERHASIL! ✅
```

### Online:
- Buka URL Vercel/Netlify kamu
- Website muncul sempurna
- Semua fungsi jalan
- **BERHASIL! 🎉**

---

## ❌ TROUBLESHOOTING - Kalau Ada Masalah

### Masalah 1: `npm: command not found`
**Artinya:** Node.js belum terinstal

**Solusi:**
```bash
# Cek Node.js
node --version

# Kalau error, instal Node.js dari https://nodejs.org
```

### Masalah 2: `Error: Cannot find module`
**Artinya:** Dependencies belum terinstal

**Solusi:**
```bash
# Hapus folder node_modules
rm -rf node_modules

# Hapus package-lock.json
rm package-lock.json

# Instal ulang
npm install
```

### Masalah 3: `Port 3000 already in use`
**Artinya:** Port sudah dipakai program lain

**Solusi:**
```bash
# Gunakan port lain
npm run dev -- -p 3001

# Atau matikan program yang pakai port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Masalah 4: Build Error - `Type error: ...`
**Artinya:** Ada error TypeScript

**Solusi:**
```bash
# Cek error detail
npm run type-check

# Lihat file mana yang error
# Fix error di file tersebut
```

### Masalah 5: Contact Form Tidak Kirim Email
**Artinya:** Email API belum dikonfigurasi

**Solusi:**
- Cek `.env.local` sudah ada `RESEND_API_KEY`
- Cek API key benar (tidak ada spasi)
- Cek email `EMAIL_FROM` sudah diverifikasi di Resend
- Restart server: Stop (Ctrl+C) dan `npm run dev` lagi

### Masalah 6: Gambar Tidak Muncul
**Artinya:** File gambar tidak ada atau nama salah

**Solusi:**
```bash
# Cek apakah file ada
ls public/profile.jpg
ls public/og-image.jpg

# Kalau tidak ada, tambahkan gambar dengan nama yang benar
# Nama harus PERSIS: profile.jpg (bukan Profile.jpg atau profile.png)
```

### Masalah 7: GitHub Projects Tidak Muncul
**Artinya:** GitHub token atau username salah

**Solusi:**
- Cek `GITHUB_TOKEN` di `.env.local` benar
- Cek `GITHUB_USERNAME` di `.env.local` benar
- Generate token baru kalau perlu
- Restart server

### Masalah 8: Error Saat Build
```bash
# Error: "Cannot read property '...' of undefined"
```

**Solusi:**
```bash
# Hapus cache
rm -rf .next

# Build ulang
npm run build
```

### Masalah 9: Website Lambat
**Solusi:**
- Compress gambar kamu (maksimal 500KB per gambar)
- Pakai format WebP kalau bisa
- Jangan upload gambar lebih dari 2MB

### Masalah 10: Deploy Vercel Gagal
**Solusi:**
- Pastikan semua environment variables sudah diset
- Build berhasil di local: `npm run build`
- Cek Vercel logs untuk detail error
- Pastikan tidak ada file besar (>100MB)

---

## 🆘 KALAU MASIH STUCK

### 1. Cek Dokumentasi Lengkap:
```bash
# Baca file-file ini:
- README.md (Dokumentasi utama)
- TROUBLESHOOTING.md (Masalah umum)
- FAQ.md (Pertanyaan sering ditanyakan)
- QUICK_START.md (Panduan cepat)
```

### 2. Cek Status Setup:
```bash
npm run verify
```
Ini akan cek semua konfigurasi kamu dan kasih tau apa yang kurang.

### 3. Jalankan Quick Check:
```bash
# Mac/Linux:
./quick-check.sh

# Windows:
quick-check.bat
```

### 4. Lihat Error Message dengan Teliti
- Copy paste error message lengkapnya
- Search di Google dengan format: "nextjs [error message]"
- Biasanya ada solusinya di Stack Overflow

### 5. Reset Total (Kalau Desperate):
```bash
# HATI-HATI: Ini akan hapus semua dan mulai dari awal

# Backup dulu .env.local kamu!
cp .env.local .env.backup

# Hapus semua
rm -rf node_modules
rm -rf .next
rm package-lock.json

# Instal ulang
npm install

# Restore .env.local
cp .env.backup .env.local

# Coba lagi
npm run dev
```

---

## 📚 RESOURCES TAMBAHAN

### Video Tutorial (Bahasa Indonesia):
- Next.js Tutorial: https://youtube.com/watch?v=... (cari di YouTube)
- Deploy ke Vercel: https://vercel.com/docs
- Git & GitHub Basics: https://github.com/git-guides

### Dokumentasi Resmi:
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://typescriptlang.org/docs

### Tools yang Berguna:
- VS Code: https://code.visualstudio.com (Editor kode terbaik)
- GitHub Desktop: https://desktop.github.com (GUI untuk Git)
- Postman: https://postman.com (Test API)

---

## 💡 TIPS & TRIK

### Tip 1: Gunakan VS Code
VS Code punya extensions yang membantu banget:
- ESLint (detect error otomatis)
- Prettier (format kode otomatis)
- Auto Rename Tag
- Path Intellisense

### Tip 2: Jangan Lupa Git Commit
```bash
# Setiap kali selesai edit, simpan ke Git
git add .
git commit -m "Update: apa yang kamu ubah"
git push
```

### Tip 3: Test di Berbagai Device
- Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- Test di HP kamu juga!
- Minta teman buka dari device mereka

### Tip 4: Optimasi Gambar
Compress dulu gambar kamu di:
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app

### Tip 5: Custom Domain (Opsional)
Beli domain di:
- Niagahoster: https://niagahoster.co.id
- Namecheap: https://namecheap.com
- Google Domains: https://domains.google

Terus connect ke Vercel/Netlify (ada panduannya di situs mereka).

---

## 🎓 BELAJAR LEBIH LANJUT

### Pemula Banget:
1. HTML & CSS basics
2. JavaScript fundamentals
3. React basics
4. Next.js introduction

### Udah Ngerti Dasar:
1. TypeScript
2. Advanced React patterns
3. Next.js App Router
4. API development

### Pro Level:
1. Performance optimization
2. SEO advanced
3. Testing (Jest, Cypress)
4. CI/CD pipelines

---

## 🎉 SELAMAT!

Kalau kamu sampai sini dan website kamu udah online:

**CONGRATULATIONS!** 🎊🎉🚀

Kamu sekarang punya:
- ✅ Portfolio website profesional
- ✅ Pakai teknologi modern (Next.js, React, TypeScript)
- ✅ Responsive di semua device
- ✅ SEO optimized
- ✅ Deploy online gratis!

### Apa Selanjutnya?

1. **Customize Terus:**
   - Tambah project baru
   - Update skills
   - Ganti warna sesuai selera

2. **Share Ke Semua Orang:**
   - LinkedIn profile
   - CV/Resume
   - Email signature
   - Social media

3. **Monitor & Update:**
   - Cek analytics
   - Update content rutin
   - Fix bug kalau ada

4. **Belajar Lebih Dalam:**
   - Pelajari source code-nya
   - Coba modifikasi
   - Bikin fitur baru

---

## 📞 KONTAK & BANTUAN

### Kalau Butuh Bantuan:

1. **Baca dokumentasi** di folder project (40+ file panduan!)
2. **Google error message** yang muncul
3. **Stack Overflow** - Tanya di sana
4. **GitHub Issues** - Buat issue di repo project

### Community:

- Next.js Discord: https://nextjs.org/discord
- React Discord: https://discord.gg/react
- Stackoverflow: https://stackoverflow.com

---

## ⏱️ RINGKASAN WAKTU

| Langkah | Waktu | Kesulitan |
|---------|-------|-----------|
| 1. Install Node.js | 5 menit | ⭐ Mudah |
| 2. Download Project | 2 menit | ⭐ Mudah |
| 3. npm install | 5 menit | ⭐ Mudah |
| 4. Setup .env.local | 10 menit | ⭐⭐ Sedang |
| 5. Ganti gambar | 5 menit | ⭐ Mudah |
| 6. Edit data pribadi | 20 menit | ⭐⭐ Sedang |
| 7. Test local | 5 menit | ⭐ Mudah |
| 8. Build production | 5 menit | ⭐ Mudah |
| 9. Deploy online | 10 menit | ⭐⭐ Sedang |

**TOTAL: 60-90 menit** untuk website online penuh! 🚀

---

**Dibuat dengan ❤️ untuk membantu kamu punya portfolio keren!**

**Versi**: 1.0.0  
**Terakhir Update**: 19 Juli 2026  
**Bahasa**: Indonesia 🇮🇩

---

*Semoga panduan ini membantu! Good luck dengan portfolio website-mu! 🚀✨*
