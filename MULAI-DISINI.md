# 🎓 MULAI DISINI - Panduan untuk Fresh Graduate

> **Selamat datang!** Ini adalah panduan lengkap untuk membantu Anda setup portfolio website dalam **5 menit**. Tidak perlu pengalaman coding yang advanced!

---

## 📚 Daftar Isi

- [Kenapa Anda Butuh Portfolio Website?](#-kenapa-anda-butuh-portfolio-website)
- [Apa yang Akan Anda Dapatkan?](#-apa-yang-akan-anda-dapatkan)
- [Setup Super Cepat (5 Menit)](#-setup-super-cepat-5-menit)
- [Kustomisasi Data Anda](#-kustomisasi-data-anda)
- [Cara Menambahkan Project](#-cara-menambahkan-project)
- [Deploy ke Internet (GRATIS)](#-deploy-ke-internet-gratis)
- [Tips & Trik](#-tips--trik)
- [Troubleshooting Umum](#-troubleshooting-umum)
- [Langkah Selanjutnya](#-langkah-selanjutnya)

---

## 🎯 Kenapa Anda Butuh Portfolio Website?

Sebagai fresh graduate atau junior developer, portfolio website adalah **wajib** karena:

✅ **Menonjol dari kandidat lain** - 90% pelamar hanya punya CV  
✅ **Tunjukkan skill Anda** - Bukan hanya cerita, tapi bukti nyata  
✅ **Professional branding** - Kesan pertama yang powerful  
✅ **24/7 online resume** - Recruiter bisa lihat kapan saja  
✅ **Share dengan mudah** - Satu link untuk semua  
✅ **Gratis selamanya** - Tidak perlu bayar hosting

> 💡 **Fakta:** 76% recruiter cek online presence kandidat sebelum interview!

---

## 🎁 Apa yang Akan Anda Dapatkan?

Portfolio website ini sudah **siap pakai** dengan fitur:

### ✨ Fitur Utama

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| 🎨 **Modern Design** | Clean, professional, eye-catching | ✅ Sudah ada |
| 📱 **Responsive** | Perfect di mobile, tablet, desktop | ✅ Sudah ada |
| ⚡ **Super Cepat** | Loading < 1 detik | ✅ Sudah ada |
| 🐙 **GitHub Integration** | Project otomatis dari GitHub | ✅ Sudah ada |
| 🌐 **SEO Optimized** | Mudah ditemukan di Google | ✅ Sudah ada |
| 🎭 **Smooth Animations** | Animasi profesional | ✅ Sudah ada |
| 📧 **Contact Section** | Social media & email links | ✅ Sudah ada |
| 🎓 **About Section** | Bio, experience, education | ✅ Sudah ada |

### 🛠️ Tech Stack (Anda tidak perlu menguasai semua ini!)

- **Next.js 14** - Framework React terbaru
- **TypeScript** - JavaScript dengan type safety
- **Tailwind CSS** - Styling modern
- **Framer Motion** - Animasi smooth

**Good news:** Anda hanya perlu edit **1 file** untuk semua data Anda! 🎉

---

## 🚀 Setup Super Cepat (5 Menit)

### Langkah 1: Persiapan (2 menit)

#### A. Install Node.js

Node.js adalah software yang dibutuhkan untuk menjalankan website ini.

**Cek apakah sudah punya:**
```bash
node -v
```

Jika muncul versi (misal: `v18.17.0`), Anda sudah punya! ✅

Jika belum:
1. Download dari [nodejs.org](https://nodejs.org/)
2. Pilih versi **LTS** (yang direkomendasikan)
3. Install seperti aplikasi biasa
4. Restart terminal/command prompt

#### B. Pastikan Git Terinstall

```bash
git --version
```

Jika belum punya, download dari [git-scm.com](https://git-scm.com/)

### Langkah 2: Download & Setup (2 menit)

#### Untuk macOS / Linux:

```bash
# 1. Clone (download) proyek ini
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# 2. Jalankan setup otomatis (MAGIC! ✨)
npm run setup

# 3. Tunggu sampai selesai (1-2 menit)
```

#### Untuk Windows:

```powershell
# 1. Buka PowerShell atau Command Prompt
# Clone proyek
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# 2. Jalankan setup otomatis
npm run setup:windows

# 3. Tunggu sampai selesai
```

**Apa yang dilakukan script setup?**
- ✅ Mengecek versi Node.js
- ✅ Menginstall semua dependencies yang dibutuhkan
- ✅ Membuat file konfigurasi
- ✅ Memverifikasi semua sudah beres

### Langkah 3: Jalankan Website (1 menit)

```bash
npm run dev
```

**Selamat! 🎉** Buka browser dan kunjungi: **http://localhost:3000**

Anda akan melihat website portfolio berjalan di komputer Anda!

---

## 📝 Kustomisasi Data Anda

Sekarang saatnya bikin website ini jadi **milik Anda**!

### File yang Perlu Anda Edit

Anda hanya perlu edit **2 file utama**:

1. **`lib/data.ts`** - Semua data pribadi Anda (90% kustomisasi ada di sini!)
2. **`.env.local`** - Environment variables (GitHub token, dll)

### Panduan Edit `lib/data.ts`

Buka file ini dengan code editor favorit Anda (VS Code, Sublime, Notepad++, dll)

#### 1️⃣ Informasi Pribadi

Cari bagian ini dan edit:

```typescript
export const personalInfo: PersonalInfo = {
  name: 'Nama Lengkap Anda',              // ⬅️ GANTI
  title: 'Full Stack Developer',          // ⬅️ GANTI (contoh: "Frontend Developer", "UI/UX Designer")
  tagline: 'Deskripsi singkat Anda',      // ⬅️ GANTI
  
  bio: [
    'Paragraf pertama tentang Anda',      // ⬅️ GANTI
    'Paragraf kedua...',                  // ⬅️ GANTI
    'Paragraf ketiga...',                 // ⬅️ GANTI
  ],
  
  profileImage: '/profile.jpg',           // ⬅️ Nama file foto Anda
  yearsExperience: 2,                     // ⬅️ GANTI
  projectsCompleted: 15,                  // ⬅️ GANTI
  
  availability: {
    status: 'available',                  // 'available' / 'busy' / 'unavailable'
    message: 'Tersedia untuk freelance'  // ⬅️ GANTI
  }
};
```

**Tips Bio:**
- Paragraf 1: Siapa Anda dan apa yang Anda lakukan
- Paragraf 2: Keahlian dan teknologi yang Anda kuasai
- Paragraf 3: Hobi/minat di luar coding

#### 2️⃣ Social Media & Kontak

```typescript
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/username-anda',        // ⬅️ GANTI
    username: '@username-anda',                      // ⬅️ GANTI
    color: 'hover:text-gray-300',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/in/username-anda',  // ⬅️ GANTI
    username: 'Nama Anda',                           // ⬅️ GANTI
    color: 'hover:text-blue-400',
  },
  {
    name: 'Email',
    icon: Mail,
    href: 'mailto:email.anda@example.com',          // ⬅️ GANTI
    username: 'email.anda@example.com',             // ⬅️ GANTI
    color: 'hover:text-red-400',
  },
];
```

**Tidak punya LinkedIn?** Buat sekarang! Gratis dan penting untuk job hunting.

#### 3️⃣ Skills & Teknologi

Edit sesuai keahlian Anda:

```typescript
export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact, color: 'text-cyan-400' },
      { name: 'Next.js', icon: SiNextdotjs, color: 'text-white' },
      // Tambah atau hapus sesuai skill Anda
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500' },
      // Hapus jika Anda fokus frontend saja
    ],
  },
  // Tambah kategori baru jika perlu
];
```

**Tips:**
- Jangan bohong tentang skill!
- Hanya masukkan yang benar-benar Anda kuasai
- Kalau baru belajar, bisa tulis "Learning" di section terpisah

#### 4️⃣ Pengalaman Kerja

```typescript
export const workExperience: WorkExperience[] = [
  {
    company: 'Nama Perusahaan',               // ⬅️ GANTI
    position: 'Frontend Developer Intern',    // ⬅️ GANTI
    period: '2025 - Sekarang',               // ⬅️ GANTI
    location: 'Jakarta, Indonesia',           // ⬅️ GANTI
    description: 'Apa yang Anda kerjakan',   // ⬅️ GANTI
    technologies: ['React', 'TypeScript'],    // ⬅️ GANTI
    achievements: [
      'Achievement 1',                        // ⬅️ GANTI
      'Achievement 2',
    ],
  },
  // Tambah pengalaman lain...
];
```

**Belum punya pengalaman kerja?**
- Masukkan project pribadi
- Freelance work
- Volunteer work
- Organisasi kampus
- Atau hapus section ini sementara

#### 5️⃣ Pendidikan

```typescript
export const education: Education[] = [
  {
    institution: 'Nama Universitas',          // ⬅️ GANTI
    degree: 'Bachelor of Science',            // ⬅️ GANTI
    field: 'Computer Science',                // ⬅️ GANTI
    period: '2019 - 2023',                    // ⬅️ GANTI
    location: 'Jakarta, Indonesia',           // ⬅️ GANTI
    gpa: '3.8/4.0',                          // ⬅️ GANTI (optional)
    achievements: [
      'Dean\'s List',                         // ⬅️ GANTI
      'Best Final Project',
    ],
  },
];
```

#### 6️⃣ GitHub Configuration

Ini penting untuk integrasi GitHub!

```typescript
export const githubConfig = {
  username: 'github-username-anda',    // ⬅️ GANTI dengan username GitHub Anda
  maxRepos: 6,                         // Jumlah project yang ditampilkan
  excludeRepos: [],                    // Repo yang tidak ingin ditampilkan
  sortBy: 'updated',                   // 'updated', 'stars', atau 'created'
};
```

#### 7️⃣ SEO Metadata

```typescript
export const siteMetadata: SiteMetadata = {
  title: 'Nama Anda | Full Stack Developer',     // ⬅️ GANTI
  description: 'Deskripsi untuk SEO',            // ⬅️ GANTI
  keywords: ['developer', 'portfolio', 'react'], // ⬅️ GANTI
  author: 'Nama Anda',                           // ⬅️ GANTI
  siteUrl: 'https://namaanda.com',               // ⬅️ GANTI (nanti setelah deploy)
  ogImage: '/og-image.jpg',
};
```

### Edit `.env.local`

File ini untuk konfigurasi yang bersifat rahasia.

```env
# GitHub API (untuk menampilkan repositories Anda)
GITHUB_TOKEN=your_token_here               # ⬅️ GANTI
GITHUB_USERNAME=your_github_username       # ⬅️ GANTI

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # Nanti ganti setelah deploy
NEXT_PUBLIC_AUTHOR_NAME="Nama Anda"        # ⬅️ GANTI
NEXT_PUBLIC_AUTHOR_EMAIL="email@anda.com"  # ⬅️ GANTI
```

#### Cara Mendapatkan GitHub Token:

1. Login ke GitHub
2. Klik foto profil (kanan atas) → **Settings**
3. Scroll ke bawah → **Developer settings**
4. Klik **Personal access tokens** → **Tokens (classic)**
5. Klik **Generate new token (classic)**
6. Isi form:
   - **Note:** "Portfolio Website"
   - **Expiration:** 90 days atau No expiration
   - **Scope:** Centang **public_repo** saja
7. Klik **Generate token**
8. **COPY token** (hanya muncul sekali!)
9. Paste ke `.env.local`

**PENTING:** Jangan share token ini ke siapapun!

### Tambahkan Foto Profil

1. Siapkan foto Anda (recommended: 400x400px, JPG/PNG)
2. Copy foto ke folder `public/`
3. Rename jadi `profile.jpg` (atau sesuai yang di `lib/data.ts`)

```bash
portfolio/
  └── public/
      └── profile.jpg  # ⬅️ Foto Anda di sini
```

**Tips Foto:**
- Gunakan foto profesional
- Background plain/simple
- Wajah jelas terlihat
- Pencahayaan bagus
- Senyum! 😊

---

## 🎨 Cara Menambahkan Project

Ada 2 cara:

### Cara 1: Otomatis dari GitHub (Recommended)

Jika Anda sudah setup GitHub token, project akan **otomatis muncul** dari GitHub repositories Anda!

**Tips:**
- Pastikan repo Anda **public**
- Tambahkan **description** yang jelas di GitHub
- Gunakan **topics/tags** untuk kategorisasi
- Tambahkan **README.md** yang informatif
- Deploy project Anda dan tambahkan link di GitHub **About**

### Cara 2: Manual (Featured Projects)

Edit di `lib/data.ts`:

```typescript
export const featuredProjects: FeaturedProject[] = [
  {
    name: 'Nama Project',                           // ⬅️ GANTI
    description: 'Deskripsi singkat project',       // ⬅️ GANTI
    technologies: ['React', 'Node.js', 'MongoDB'],  // ⬅️ GANTI
    githubUrl: 'https://github.com/you/project',    // ⬅️ GANTI
    liveUrl: 'https://project-live.com',            // ⬅️ GANTI (optional)
    imageUrl: '/projects/project1.jpg',             // ⬅️ GANTI (optional)
  },
  // Tambah project lain...
];
```

**Belum punya project?**
- Buat simple project dulu (Todo app, Weather app, dll)
- Clone tutorial project dan modifikasi
- Contribute ke open source
- Buat portfolio website ini jadi project pertama! 😉

---

## 🌐 Deploy ke Internet (GRATIS)

Setelah semuanya siap, saatnya publish ke internet!

### Deploy ke Vercel (Paling Mudah & Gratis) ⭐

Vercel adalah platform dari pembuat Next.js. **100% GRATIS untuk personal projects!**

#### Langkah demi Langkah:

**1. Push ke GitHub**

```bash
# Di folder project Anda
git add .
git commit -m "Initial commit - My portfolio"

# Buat repository baru di GitHub (via website)
# Lalu push:
git remote add origin https://github.com/username/portfolio.git
git branch -M main
git push -u origin main
```

**2. Deploy ke Vercel**

1. Buka [vercel.com](https://vercel.com/)
2. Klik **Sign Up** (gunakan akun GitHub)
3. Authorize Vercel untuk akses GitHub
4. Klik **New Project**
5. Import repository portfolio Anda
6. Vercel auto-detect Next.js ✅
7. Tambahkan **Environment Variables:**
   - Klik "Environment Variables"
   - Tambahkan satu per satu:
     - `GITHUB_TOKEN` = (token Anda)
     - `GITHUB_USERNAME` = (username GitHub)
     - `NEXT_PUBLIC_SITE_URL` = (nanti update setelah deploy)
     - `NEXT_PUBLIC_AUTHOR_NAME` = (nama Anda)
     - `NEXT_PUBLIC_AUTHOR_EMAIL` = (email Anda)
8. Klik **Deploy**

**Tunggu 2-3 menit...**

**🎉 SELAMAT!** Website Anda sudah live!

Anda akan dapat URL seperti: `https://namaanda.vercel.app`

#### Update Site URL

Setelah deploy, update environment variable:

1. Di Vercel dashboard, buka project Anda
2. **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_SITE_URL`
4. Ganti jadi URL Vercel Anda (misal: `https://namaanda.vercel.app`)
5. **Save**
6. Redeploy: **Deployments** → klik **...** → **Redeploy**

#### Custom Domain (Optional)

Kalau punya domain sendiri (misal: `namaanda.com`):

1. Di Vercel: **Settings** → **Domains**
2. Tambahkan domain Anda
3. Ikuti instruksi untuk setup DNS
4. Tunggu beberapa menit sampai active

**Dimana beli domain?**
- [Namecheap](https://www.namecheap.com/) - ~$10/tahun
- [GoDaddy](https://www.godaddy.com/)
- [Niagahoster](https://www.niagahoster.co.id/) (Indonesia)

### Deploy ke Netlify (Alternatif)

Kalau prefer Netlify:

1. Buka [netlify.com](https://www.netlify.com/)
2. Sign up dengan GitHub
3. **Add new site** → **Import an existing project**
4. Pilih repository Anda
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Tambahkan environment variables (sama seperti Vercel)
7. **Deploy**

---

## 💡 Tips & Trik

### Tips Membuat Portfolio yang Menarik

#### 1. Content is King
- **Bio yang personal:** Jangan copy-paste template. Tulis dengan gaya Anda sendiri
- **Project yang berkualitas:** Lebih baik 3 project bagus daripada 10 project biasa saja
- **Update rutin:** Tambahkan project baru setiap bulan

#### 2. Foto Profil Professional
- Gunakan foto yang jelas dan profesional
- Senyum dan tatap kamera
- Background plain/simple
- Pakaian semi-formal
- **Jangan:** Selfie, foto liburan, foto blur

#### 3. Project Descriptions
- Jelaskan **masalah** yang dipecahkan
- Highlight **teknologi** yang digunakan
- Sebutkan **role** Anda jika team project
- Tambahkan **screenshots** atau **demo video**

#### 4. Skills Section
- Jujur tentang skill level
- Kelompokkan berdasarkan kategori
- Fokus pada skill yang **relevan** dengan job target
- Jangan list semua teknologi yang pernah disentuh

#### 5. SEO Optimization
- Gunakan nama asli di title (misal: "John Doe | Full Stack Developer")
- Description jelas dan include keywords
- Update meta tags di `lib/data.ts`

### Tips GitHub Profile

Karena portfolio ini integrate dengan GitHub:

1. **Polish Your GitHub Profile**
   - Tambahkan profile README
   - Pin 6 best repositories
   - Gunakan clear repository names

2. **Repository Best Practices**
   - Setiap repo harus punya README yang jelas
   - Tambahkan screenshots di README
   - Gunakan topics/tags
   - Update description
   - Tambahkan live demo link jika ada

3. **Contribution Graph**
   - Commit secara konsisten
   - Green squares = active developer 💪

### Optimization Tips

#### Performance
```bash
# Sebelum deploy, cek build size
npm run build

# Optimize images (gunakan format WebP)
# Next.js akan auto-optimize

# Lazy load components yang berat
```

#### SEO
- Update `siteMetadata` di `lib/data.ts`
- Buat `og-image.jpg` (1200x630px) untuk social sharing
- Submit sitemap ke Google Search Console

---

## 🐛 Troubleshooting Umum

### 1. "Port 3000 already in use"

**Solusi:**
```bash
# Option A: Gunakan port lain
PORT=3001 npm run dev

# Option B: Kill process di port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### 2. "Module not found"

**Solusi:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### 3. GitHub Projects Tidak Muncul

**Cek:**
- ✅ GITHUB_TOKEN ada di `.env.local`
- ✅ GITHUB_USERNAME benar
- ✅ Token punya scope `public_repo`
- ✅ Repositories Anda **public** (bukan private)

**Debug:**
- Buka browser console (F12)
- Cek ada error merah?
- Lihat Network tab, apakah API call sukses?

### 4. Foto Tidak Muncul

**Cek:**
- ✅ Foto ada di folder `public/`
- ✅ Nama file sesuai di `lib/data.ts`
- ✅ Path benar (harus dimulai dengan `/`)
- ✅ Restart dev server

**Contoh benar:**
```typescript
profileImage: '/profile.jpg'  // ✅ Benar
profileImage: 'profile.jpg'   // ❌ Salah (kurang /)
```

### 5. Build Error

**Solusi:**
```bash
# Clean everything
rm -rf node_modules .next package-lock.json

# Fresh install
npm install

# Try build
npm run build
```

### 6. TypeScript Errors

**Cek:**
```bash
npm run type-check
```

**Common issues:**
- Missing type definitions
- Wrong import paths
- Typo di property names

### 7. Styling Tidak Muncul

**Solusi:**
```bash
# Restart dev server
# Ctrl+C untuk stop
npm run dev

# Clear browser cache (Ctrl+Shift+R)
```

### 8. Git Issues

**"fatal: not a git repository"**
```bash
git init
git add .
git commit -m "Initial commit"
```

**Can't push to GitHub**
```bash
# Check remote
git remote -v

# Set correct remote
git remote set-url origin https://github.com/username/portfolio.git
```

---

## 🎓 Langkah Selanjutnya

Setelah portfolio Anda live, apa selanjutnya?

### Minggu 1-2: Polish Content
- [ ] Review semua teks, pastikan tidak ada typo
- [ ] Tambahkan foto profil profesional
- [ ] Update bio dengan lebih personal
- [ ] Pastikan semua link berfungsi

### Minggu 3-4: Tambah Content
- [ ] Tambahkan minimal 3 project berkualitas
- [ ] Update GitHub repositories dengan README yang baik
- [ ] Buat screenshots untuk setiap project
- [ ] Deploy project-project Anda

### Bulan 2: Optimize & Share
- [ ] Submit sitemap ke Google Search Console
- [ ] Optimize images untuk loading cepat
- [ ] Test di berbagai devices
- [ ] Share portfolio di LinkedIn
- [ ] Tambahkan link di CV Anda

### Ongoing: Maintain & Update
- [ ] Tambahkan project baru setiap bulan
- [ ] Update skills sesuai learning
- [ ] Monitor analytics (jika ada)
- [ ] Respond ke feedback
- [ ] Keep learning new tech!

### Level Up Your Portfolio

#### Fitur Tambahan yang Bisa Ditambah:
- 📝 **Blog Section** - Tulis artikel teknikal
- 💬 **Testimonials** - Dari client/colleague
- 📊 **GitHub Stats** - Contribution graph
- 🎨 **Dark/Light Mode Toggle** - Sudah siap, tinggal implement
- 📧 **Contact Form** - Integration dengan EmailJS/Formspree
- 🗺️ **Interactive Resume** - Timeline experience
- 📱 **PWA** - Progressive Web App
- 🌐 **Multi-language** - English + Indonesian

#### Resources untuk Belajar:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🎉 Selamat!

Anda sudah berhasil membuat portfolio website profesional!

### Checklist Final:

- [ ] Website berjalan di local (localhost:3000)
- [ ] Semua data sudah diganti dengan data Anda
- [ ] Foto profil sudah ditambahkan
- [ ] GitHub integration berfungsi
- [ ] Semua link social media benar
- [ ] Sudah di-deploy ke internet
- [ ] URL sudah dishare ke LinkedIn
- [ ] Domain custom sudah disetup (optional)

### Share Your Success!

Jangan lupa share portfolio Anda:

1. **Update LinkedIn:**
   - Tambahkan portfolio URL di section "Website"
   - Post announcement dengan screenshot
   - Tambahkan ke CV Anda

2. **Update GitHub:**
   - Pin repository ini di profile
   - Tambahkan link ke website di bio

3. **Share di Social Media:**
   - Twitter/X dengan hashtag #100DaysOfCode
   - Instagram Story
   - Facebook

4. **Tell Your Network:**
   - Send ke teman-teman
   - Share di grup developer
   - Minta feedback

---

## 📞 Butuh Bantuan?

Jangan ragu untuk minta bantuan!

### Resources:
- 📖 **[README Lengkap](README-ID.md)** - Dokumentasi detail
- 🔧 **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Solusi masalah umum
- 🎨 **[Customization Guide](CUSTOMIZATION_GUIDE.md)** - Kustomisasi advanced

### Contact:
- 📧 **Email:** your.email@example.com
- 💬 **GitHub Issues:** [Buat issue baru](https://github.com/yourusername/portfolio/issues)
- 💼 **LinkedIn:** Connect dan tanya

### Community:
- Join grup developer Indonesia
- Follow developer communities
- Contribute ke open source

---

## 💝 Pesan Penutup

> **"The expert in anything was once a beginner."**

Setiap developer senior pernah ada di posisi Anda sekarang. Yang membedakan adalah **action**.

Anda sudah ambil langkah pertama dengan membuat portfolio ini. **Well done!** 🎉

Sekarang tinggal:
1. Keep building projects
2. Keep learning
3. Keep sharing
4. Keep improving

**Your portfolio is not finished. It's just the beginning.**

Good luck dengan job hunting Anda! 🚀

---

<div align="center">

**Dibuat dengan ❤️ untuk Fresh Graduates**

**Questions? [Open an Issue](https://github.com/yourusername/portfolio/issues)**

[⬆ Kembali ke Atas](#-mulai-disini---panduan-untuk-fresh-graduate)

</div>
