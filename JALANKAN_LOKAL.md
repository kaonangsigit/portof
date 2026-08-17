# 🚀 Panduan Menjalankan Portfolio Secara Lokal

Panduan lengkap untuk menjalankan portfolio ini di komputer Anda sendiri. Cocok untuk fresh graduate dengan pengetahuan teknis dasar.

---

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Cara Install Dependencies](#cara-install-dependencies)
3. [Cara Setup Environment Variables](#cara-setup-environment-variables)
4. [Cara Jalankan Dev Server](#cara-jalankan-dev-server)
5. [Cara Update Konten](#cara-update-konten)
6. [Cara Tambah Foto Profil](#cara-tambah-foto-profil)
7. [Cara Tambah Project Screenshot](#cara-tambah-project-screenshot)
8. [Troubleshooting Umum](#troubleshooting-umum)
9. [Cara Deploy ke Production](#cara-deploy-ke-production)

---

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

### 1. Node.js 18+ 

Node.js adalah runtime JavaScript yang diperlukan untuk menjalankan aplikasi Next.js.

**Cek versi Node.js Anda:**
```bash
node -v
```

**Jika belum terinstall:**
- Download dari: https://nodejs.org/
- Pilih versi LTS (Long Term Support) 18.x atau lebih baru
- Ikuti instalasi sesuai sistem operasi Anda (Windows, macOS, Linux)

### 2. npm

npm (Node Package Manager) biasanya terinstall otomatis bersama Node.js.

**Cek versi npm Anda:**
```bash
npm -v
```

**Minimum versi yang direkomendasikan:** npm 9.x atau lebih baru

### 3. Git (Opsional tapi direkomendasikan)

Git digunakan untuk version control dan backup kode.

**Cek apakah Git terinstall:**
```bash
git --version
```

**Jika belum terinstall:**
- Windows: https://git-scm.com/download/win
- macOS: `brew install git` (jika pakai Homebrew) atau download dari https://git-scm.com/download/mac
- Linux: `sudo apt install git` (Debian/Ubuntu) atau `sudo yum install git` (RHEL/CentOS)

---

## Cara Install Dependencies

Dependencies adalah library dan package yang diperlukan untuk menjalankan aplikasi.

### Langkah-langkah:

**1. Buka Terminal/Command Prompt**

- **Windows:** Buka Command Prompt atau PowerShell
- **macOS:** Buka Terminal (Applications > Utilities > Terminal)
- **Linux:** Buka Terminal terminal Anda

**2. Masuk ke direktori portfolio**

```bash
cd /Users/kaonangprakoso/Library/Mobile\ Documents/com~apple~CloudDocs/Portofolio
```

**3. Install semua dependencies**

```bash
npm install
```

**Proses ini akan:**
- Membaca file `package.json` untuk mengetahui dependencies yang diperlukan
- Mendownload dan menginstall semua package ke folder `node_modules/`
- Membuat folder `node_modules/` jika belum ada

**Tunggu sampai muncul pesan sukses:**
```
added 200 packages, and audited 201 packages in 2m
```

**Alternative: Gunakan Automated Setup Script**

Jika Anda ingin setup otomatis, jalankan:

**Linux/macOS:**
```bash
bash scripts/setup.sh
```

**Windows:**
```powershell
npm run setup:windows
```

Script ini akan otomatis:
- ✅ Cek versi Node.js (harus 18+)
- ✅ Install semua dependencies
- ✅ Buat file `.env.local` dari template
- ✅ Verifikasi setup

---

## Cara Setup Environment Variables

Environment variables menyimpan konfigurasi sensitif seperti API keys dan informasi pribadi.

### Langkah-langkah:

**1. Copy file `.env.example` menjadi `.env.local`**

```bash
cp .env.example .env.local
```

Atau manual:
- Buka file manager Anda
- Copy file `.env.example`
- Rename menjadi `.env.local`
- Paste di direktori yang sama

**2. Buka `.env.local` dengan text editor**

```bash
nano .env.local
```

Atau buka dengan editor favorit Anda (VS Code, Sublime Text, dll)

**3. Isi nilai-nilai yang diperlukan**

Cari dan ubah bagian-bagian berikut:

### A. GitHub Configuration (WAJIB untuk project dari GitHub)

```env
GITHUB_TOKEN=ghp_your_github_personal_access_token_here
GITHUB_USERNAME=kaonangprakoso
NEXT_PUBLIC_GITHUB_USERNAME=kaonangprakoso
```

**Cara mendapatkan GitHub Token:**

1. Buka https://github.com/settings/tokens
2. Klik "Generate new token (classic)"
3. Beri nama: "Portfolio Local Dev"
4. Set expiration (saran: 30 days untuk testing)
5. Centang scope: `public_repo` (hanya read access)
6. Klik "Generate token"
7. Copy token yang muncul
8. Paste ke `GITHUB_TOKEN` di `.env.local`

**PENTING:** Jangan pernah commit atau share file `.env.local` ke publik!

### B. Email Configuration (untuk contact form)

```env
EMAIL_PROVIDER=resend
EMAIL_FROM=noreply@your-domain.com
CONTACT_EMAIL=your.email@example.com
RESEND_API_KEY=re_your_resend_api_key_here
```

**Untuk testing locally, Anda bisa gunakan email dummy:**

```env
EMAIL_PROVIDER=sendgrid
EMAIL_FROM=noreply@localhost
CONTACT_EMAIL=your.email@example.com
# SendGrid API key opsional untuk testing
```

### C. Site Configuration

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Kao Nangprakoso - Portfolio"
NEXT_PUBLIC_SITE_DESCRIPTION="Full Stack Developer Portfolio"
```

**4. Simpan file `.env.local`**

- Jika pakai `nano`: Tekan `Ctrl+O`, enter, lalu `Ctrl+X`
- Jika pakai editor GUI: Klik Save

**5. Restart dev server** setelah mengubah `.env.local`

---

## Cara Jalankan Dev Server

Dev server adalah server lokal yang memungkinkan Anda melihat perubahan secara real-time.

### Langkah-langkah:

**1. Pastikan Anda sudah install dependencies**

```bash
npm install
```

**2. Pastikan `.env.local` sudah dikonfigurasi**

```bash
ls -la .env.local
```

**3. Jalankan dev server**

```bash
npm run dev
```

**Jika muncul error port 3000 sudah dipakai:**

```bash
# Gunakan port lain
PORT=3001 npm run dev
```

**4. Buka browser**

Akses: http://localhost:3000

Anda seharusnya melihat portfolio Anda dengan:
- ✅ Hero section
- ✅ About section
- ✅ Skills section
- ✅ Projects section
- ✅ Contact section

**5. Development mode features:**

- **Hot Reload:** Perubahan di file otomatis muncul tanpa restart server
- **Error Overlay:** Jika ada error, akan muncul di browser
- **Source Maps:** Mudah debug dengan melihat file asli

**Cara stop dev server:**

Tekan `Ctrl+C` di terminal

---

## Cara Update Konten

Semua konten portfolio disimpan di satu file: `lib/data.ts`

### Struktur File `lib/data.ts`:

File ini berisi semua data yang dapat Anda customisasi. Berikut cara mengeditnya:

### A. Update Informasi Pribadi

Cari bagian `personalInfo`:

```typescript
export const personalInfo: PersonalInfo = {
  name: 'Kao Nangprakoso',                    // Ubah nama Anda
  title: 'Full Stack Developer',               // Ubah title/jabatan
  tagline: 'I build exceptional digital...',  // Ubah tagline singkat
  bio: [
    "I'm a passionate Full Stack Developer...",  // Ubah bio paragraf 1
    "I specialize in modern web technologies...", // Ubah bio paragraf 2
  ],
  profileImage: '/profile.jpg',                 // Jangan ubah path ini
  yearsExperience: 5,                           //Ubah tahun pengalaman
  projectsCompleted: 50,                        //Ubah jumlah project
  availability: {
    status: 'available', // 'available' | 'busy' | 'unavailable'
    message: 'Currently available for freelance...',
  },
};
```

### B. Update Social Media Links

Cari bagian `socialLinks`:

```typescript
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/kaonangprakoso',      // Ubah URL GitHub Anda
    username: '@kaonangprakoso',                     // Ubah username GitHub
    color: 'hover:text-gray-300',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/in/yourprofile',    // Ubah URL LinkedIn Anda
    username: 'Kao Nangprakoso',                     // Ubah nama LinkedIn
    color: 'hover:text-blue-400',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://instagram.com/yourhandle',       // Ubah URL Instagram Anda
    username: '@yourhandle',                         // Ubah username Instagram
    color: 'hover:text-pink-400',
  },
  {
    name: 'Email',
    icon: Mail,
    href: 'mailto:your.email@example.com',          // Ubah email Anda
    username: 'your.email@example.com',              // Ubah email Anda
    color: 'hover:text-red-400',
  },
];
```

### C. Update Skills & Technologies

Cari bagian `skillCategories`:

```typescript
export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact, color: 'text-cyan-400' },
      { name: 'Next.js', icon: SiNextdotjs, color: 'text-white' },
      { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-500' },
      // Tambah skill baru di sini
      // { name: 'Svelte', icon: SiSvelte, color: 'text-orange-500' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500' },
      { name: 'Express', icon: SiExpress, color: 'text-gray-400' },
    ],
  },
  {
    title: 'Database',
    skills: [
      { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-400' },
    ],
  },
  {
    title: 'Tools & DevOps',
    skills: [
      { name: 'Git', icon: SiGit, color: 'text-orange-500' },
      { name: 'Docker', icon: SiDocker, color: 'text-blue-500' },
    ],
  },
];
```

**Cara menambah skill baru:**

1. Cek library `react-icons/si` untuk icon yang tersedia
2. Import icon di bagian atas file:
   ```typescript
   import { SiReact, SiNextdotjs, SiSvelte } from 'react-icons/si';
   ```
3. Tambah ke array skills:
   ```typescript
   { name: 'Svelte', icon: SiSvelte, color: 'text-orange-500' },
   ```

### D. Update Work Experience

Cari bagian `workExperience`:

```typescript
export const workExperience: WorkExperience[] = [
  {
    company: 'Tech Company Inc.',           // Nama perusahaan
    position: 'Senior Full Stack Developer', // Jabatan
    period: '2022 - Present',               // Periode kerja
    location: 'Jakarta, Indonesia',         // Lokasi
    description: 'Leading development...',  // Deskripsi tugas
    technologies: ['React', 'Next.js', 'Node.js'], // Teknologi yang digunakan
    achievements: [                         // Pencapaian (opsional)
      'Improved application performance by 40%',
      'Led a team of 5 developers',
    ],
  },
  {
    company: 'StartUp XYZ',
    position: 'Full Stack Developer',
    period: '2020 - 2022',
    location: 'Remote',
    description: 'Developed and maintained...',
    technologies: ['React', 'Express', 'MongoDB'],
  },
];
```

### E. Update Education

Cari bagian `education`:

```typescript
export const education: Education[] = [
  {
    institution: 'University of Technology',      // Nama universitas
    degree: 'Bachelor of Science',                // Gelar
    field: 'Computer Science',                    // Bidang studi
    period: '2015 - 2019',                        // Periode studi
    location: 'Jakarta, Indonesia',               // Lokasi
    gpa: '3.8/4.0',                               // IPK (opsional)
    achievements: [                               // Prestasi (opsional)
      "Dean's List for 6 semesters",
      'Best Final Project Award',
    ],
  },
];
```

### F. Update Featured Projects

Cari bagian `featuredProjects`:

```typescript
export const featuredProjects: FeaturedProject[] = [
  {
    name: 'E-Commerce Platform',                  // Nama project
    description: 'Full-featured e-commerce...',   // Deskripsi
    technologies: ['Next.js', 'TypeScript', 'Stripe'], // Teknologi
    githubUrl: 'https://github.com/yourusername/ecommerce', // URL GitHub (opsional)
    liveUrl: 'https://ecommerce-demo.com',        // URL live demo (opsional)
    imageUrl: '/projects/ecommerce.jpg',          // Gambar project (opsional)
  },
];
```

### G. Update SEO Metadata

Cari bagian `siteMetadata`:

```typescript
export const siteMetadata: SiteMetadata = {
  title: 'Kao Nangprakoso | Full Stack Developer',     // Judul halaman
  description: 'Full Stack Developer passionate...',   // Meta description
  keywords: ['developer', 'portfolio', 'web development'], // Keywords
  author: 'Kao Nangprakoso',                          // Nama author
  siteUrl: 'https://yourwebsite.com',                 // URL website (update setelah deploy)
  locale: 'en_US',                                    // Locale
  ogImage: '/og-image.jpg',                           // OG image untuk sosmed
};
```

### H. Update Content Text

Cari bagian `content`:

```typescript
export const content = {
  hero: {
    greeting: 'Hi, my name is',
    cta: {
      primary: 'View My Work',
      secondary: 'Get In Touch',
    },
  },
  about: {
    title: 'About Me',
    greeting: "Hi, I'm Kao Nangprakoso",
  },
  skills: {
    title: 'Skills & Technologies',
    subtitle: 'Here are the technologies...',
  },
  projects: {
    title: 'Featured Projects',
    subtitle: 'Here are some of my recent works...',
    cta: 'View on GitHub',
  },
  contact: {
    title: 'Get In Touch',
    subtitle: "Have a project in mind...",
    form: {
      nameLabel: 'Name',
      emailLabel: 'Email',
      messageLabel: 'Message',
      submitButton: {
        idle: 'Send Message',
        loading: 'Sending...',
        success: 'Message Sent!',
      },
    },
  },
};
```

### Tips Update Konten:

1. **Simpan file** setelah mengubah (Ctrl+S atau Cmd+S)
2. **Refresh browser** (atau tunggu hot reload otomatis)
3. **Check browser console** (F12) untuk error messages
4. **Jangan hapus** struktur object/array yang ada
5. **Gunakan tanda petik** yang konsisten (single quotes untuk string)

---

## Cara Tambah Foto Profil

### Langkah-langkah:

**1. Siapkan foto**

Format yang direkomendasikan:
- Format: JPG atau PNG
- Ukuran: 400x400 pixels atau 800x800 pixels
- Background: Solid color atau transparent (PNG)
- Nama file: `profile.jpg` atau `profile.png`

**2. Simpan foto di folder `public/`**

```bash
# Coppy foto Anda ke folder public
cp /path/to/your/photo.jpg /Users/kaonangprakoso/Library/Mobile\ Documents/com~apple~CloudDocs/Portofolio/public/profile.jpg
```

Atau manual:
- Buka file manager
- Masuk ke folder: `public/`
- Copy foto Anda dengan nama: `profile.jpg`

**3. Verify file ada**

```bash
ls -la public/profile.jpg
```

Harus muncul seperti ini:
```
-rw-r--r--  1 user  staff  123456 Jul 19 12:00 public/profile.jpg
```

**4. Update path di `lib/data.ts` (jika perlu)**

Jika Anda menggunakan nama file berbeda:

```typescript
export const personalInfo: PersonalInfo = {
  // ... other config
  profileImage: '/profile.png',  // Ganti nama file jika berbeda
};
```

**5. Restart dev server**

Jika foto tidak muncul:
```bash
# Stop server (Ctrl+C)
# Jalankan ulang
npm run dev
```

### Troubleshooting Foto:

**Foto tidak muncul?**

1. ✅ Cek nama file di folder `public/`
2. ✅ Cek path di `lib/data.ts` cocok dengan nama file
3. ✅ Restart dev server
4. ✅ Check browser console (F12 > Console tab)
5. ✅ Pastikan foto format JPG/PNG/SVG

**Foto blur/terpotong?**

- Gunakan ukuran minimal 400x400 pixels
- Coba ukuran 800x800 untuk kualitas lebih baik

---

## Cara Tambah Project Screenshot

### Langkah-langkah:

**1. Siapkan screenshot project**

Format yang direkomendasikan:
- Format: JPG atau PNG
- Ukuran: 1200x800 pixels (aspect ratio 3:2)
- Tampilan: Full browser dengan UI lengkap
- Background: Clean tanpa banyak clutter

**2. Simpan screenshot di folder `public/images/projects/`**

```bash
# Copy screenshot project Anda
cp /path/to/your/screenshot.jpg /Users/kaonangprakoso/Library/Mobile\ Documents/com~apple~CloudDocs/Portofolio/public/images/projects/ecommerce.jpg
```

Atau manual:
- Buka file manager
- Masuk ke folder: `public/images/projects/`
- Copy screenshot dengan nama yang jelas (contoh: `ecommerce.jpg`, `taskmanager.png`)

**3. Update `lib/data.ts` dengan path screenshot**

Cari bagian `featuredProjects`:

```typescript
export const featuredProjects: FeaturedProject[] = [
  {
    name: 'E-Commerce Platform',
    description: 'Full-featured e-commerce platform...',
    technologies: ['Next.js', 'TypeScript', 'Stripe'],
    githubUrl: 'https://github.com/kaonangprakoso/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    imageUrl: '/projects/ecommerce.jpg',  // Ganti dengan nama file Anda
  },
  {
    name: 'Task Management App',
    description: 'Collaborative task management...',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    githubUrl: 'https://github.com/kaonangprakoso/taskmanager',
    liveUrl: 'https://taskmanager-demo.com',
    imageUrl: '/projects/taskmanager.jpg',  // Ganti dengan nama file Anda
  },
];
```

**4. Verify file ada**

```bash
ls -la public/images/projects/
```

Harus muncul:
```
-rw-r--r--  1 user  staff  234567 Jul 19 12:00 ecommerce.jpg
-rw-r--r--  1 user  staff  345678 Jul 19 12:00 taskmanager.jpg
```

**5. Restart dev server** (jika perlu)

```bash
npm run dev
```

### Tips Screenshot:

1. **Gunakan ukuran konsisten** untuk semua project (1200x800 recommended)
2. **Cropping yang rapi** - crop bagian yang penting saja
3. **Kompres gambar** untuk performa lebih baik (tool: TinyPNG, Squoosh)
4. **Add labels** jika perlu (contoh: "Live Demo", "View Code")
5. **Konsisten style** - semua screenshot dengan style yang sama

### Lokasi Gambar di Portfolio:

| Gambar | Folder | Nama File Default |
|--------|--------|-------------------|
| Profile photo | `/public/` | `profile.jpg` |
| OG Image (social media) | `/public/` | `og-image.jpg` |
| Project screenshots | `/public/images/projects/` | `*.jpg` |
| Testimonials avatar | `/public/images/testimonials/` | `*.jpg` |
| Logos | `/public/images/logos/` | `*.png` |

---

## Troubleshooting Umum

### Problem 1: "Port 3000 already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
```

**Solusi:**

**Opsi 1: Gunakan port lain**
```bash
PORT=3001 npm run dev
```
Akses di: http://localhost:3001

**Opsi 2: Kill process di port 3000**

macOS/Linux:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

Windows:
```powershell
netstat -ano | findstr :3000
# Catat PID dari output
taskkill /PID <PID> /F
npm run dev
```

---

### Problem 2: "Module not found"

**Error:**
```
Error: Cannot find module 'next'
```

**Solusi:**

```bash
# Install ulang dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Atau manual:
1. Hapus folder `node_modules/`
2. Hapus file `package-lock.json`
3. Jalankan: `npm install`
4. Jalankan: `npm run dev`

---

### Problem 3: ".env.local not found"

**Error:**
```
Warning: Environment variables not configured
```

**Solusi:**

```bash
# Copy file .env.example ke .env.local
cp .env.example .env.local

# Edit .env.local
nano .env.local

# Restart dev server
npm run dev
```

---

### Problem 4: "Failed to fetch GitHub repositories"

**Error di console:**
```
Failed to load GitHub repositories
```

**Penyebab:**
- GitHub token belum dikonfigurasi
- Token tidak valid atau expired
- Rate limit GitHub tercapai

**Solusi:**

**1. Check `.env.local` sudah dikonfigurasi:**
```bash
grep GITHUB .env.local
```

Harus muncul:
```
GITHUB_TOKEN=ghp_xxxxx
GITHUB_USERNAME=kaonangprakoso
```

**2. Generate GitHub token baru:**
- Buka https://github.com/settings/tokens
- Generate new token dengan scope `public_repo`
- Copy token ke `.env.local`
- Restart dev server

**3. Cek rate limit:**
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit
```

---

### Problem 5: " TypeScript errors"

**Error:**
```
Failed to compile
TypeError: Cannot read property 'map' of undefined
```

**Solusi:**

**1. Check tipe data di `lib/data.ts`:**

Pastikan semua array/objects punya struktur yang benar:

```typescript
// ❌ SALAH - missing closing bracket
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/kaonangprakoso',
  // missing closing brace

// ✅ BENAR
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/kaonangprakoso',
  },
];
```

**2. Run type check:**
```bash
npm run type-check
```

**3. Restart dev server:**
```bash
npm run dev
```

---

### Problem 6: " Images not loading"

**Error:**
- Gambar tidak muncul
- 404 error di browser console

**Solusi:**

**1. Pastikan gambar ada di folder `public/`:**
```bash
ls -la public/profile.jpg
ls -la public/images/projects/
```

**2. Check path di code:**

Jika file: `public/images/projects/myproject.jpg`

```typescript
// ✅ BENAR
imageUrl: '/images/projects/myproject.jpg'

// ❌ SALAH - tidak ada /images/
imageUrl: '/projects/myproject.jpg'
```

**3. Restart dev server:**
```bash
npm run dev
```

---

### Problem 7: " npm install hangs"

**Error:**
- Install process berhenti/tidak respons
- Muncul "network timeout"

**Solusi:**

**1. Clear npm cache:**
```bash
npm cache clean --force
```

**2. Hapus node_modules:**
```bash
rm -rf node_modules package-lock.json
```

**3. Install ulang:**
```bash
npm install
```

**4. Gunakan mirror registry (jika di Indonesia):**
```bash
npm install --registry=https://registry.npmjs.org
```

---

### Problem 8: " Next.js build fails"

**Error:**
```
Error: Build failed
```

**Solusi:**

**1. Clean build cache:**
```bash
rm -rf .next
npm run build
```

**2. Check disk space:**
```bash
df -h
```

Harus ada cukup space (> 500MB)

**3. Increase memory:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

### Problem 9: " Git not found"

**Error:**
```
'git' is not recognized as an internal or external command
```

**Solusi:**

**Install Git:**

macOS:
```bash
brew install git
# atau
xcode-select --install
```

Linux:
```bash
sudo apt update && sudo apt install git
```

Windows:
- Download dari: https://git-scm.com/download/win
- Install dengan default settings

---

### Problem 10: " npm run dev stuck at 'ready'"

**Error:**
- Dev server start tapi browser tidak terbuka
- Process tidak berhenti

**Solusi:**

**1. Update dependencies:**
```bash
npm update
npm run dev
```

**2. Check node version:**
```bash
node -v
# Harus v18.x.x atau lebih baru
```

**3. Restart dengan verbose:**
```bash
npm run dev -- --verbose
```

---

## Cara Deploy ke Production

Deploy adalah proses mempublikasikan portfolio ke internet sehingga bisa diakses orang lain.

### Opsi 1: Deploy ke Vercel (RECOMMENDED) ⭐

Vercel adalah platform hosting gratis untuk Next.js. Paling mudah dan cepat!

**Langkah-langkah:**

**1. Push code ke GitHub dulu**

```bash
# Check git status
git status

# Add semua file
git add .

# Commit
git commit -m "Initial commit - My portfolio"

# Push ke GitHub
git push origin main
```

**2. Deploy di Vercel**

1. Buka https://vercel.com/
2. Sign up/Login dengan GitHub
3. Klik "New Project"
4. Import repository portfolio Anda
5. Vercel otomatis detect Next.js ✅
6. Add environment variables:
   - `GITHUB_TOKEN` = token GitHub Anda
   - `GITHUB_USERNAME` = username GitHub Anda
   - `NEXT_PUBLIC_SITE_URL` = https://your-username.vercel.app
7. Klik "Deploy"

**3. Selesai!**

Tunggu ~2 menit, lalu buka:
```
https://your-username.vercel.app
```

**Update setelah perubahan:**

```bash
# Setiap kali update code
git add .
git commit -m "Update content"
git push origin main
# Vercel otomatis redeploy!
```

---

### Opsi 2: Deploy ke Netlify

Netlify juga menyediakan hosting gratis.

**Langkah-langkah:**

**1. Push code ke GitHub** (seperti di atas)

**2. Deploy di Netlify**

1. Buka https://netlify.com/
2. Sign up/Login
3. Klik "New site from Git"
4. Connect GitHub
5. Pilih repository portfolio
6. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_USERNAME`
8. Klik "Deploy site"

---

### Opsi 3: Deploy ke VPS/Server Sendiri

Jika Anda punya server sendiri (DigitalOcean, AWS, dll).

**Langkah-langkah:**

**1. Install dependencies:**
```bash
npm install
```

**2. Build untuk production:**
```bash
npm run build
```

**3. Start production server:**
```bash
npm start
```

**4. Gunakan PM2 untuk running di background:**
```bash
npm install -g pm2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

---

### Opsi 4: Deploy dengan Docker

Jika Anda pakai Docker.

**Langkah-langkah:**

**1. Build Docker image:**
```bash
npm run docker:build
```

**2. Run container:**
```bash
npm run docker:prod
```

Atau manual:
```bash
docker build -t portfolio:latest .
docker run -p 3000:3000 portfolio:latest
```

---

### Pre-Deployment Checklist

Sebelum deploy, pastikan:

```bash
# 1. Run pre-deploy check
npm run predeploy

# 2. Update environment variables di .env.local
#    - GITHUB_TOKEN
#    - GITHUB_USERNAME
#    - NEXT_PUBLIC_SITE_URL

# 3. Update data di lib/data.ts
#    - personalInfo
#    - socialLinks
#    - workExperience
#    - education
#    - skills
#    - featuredProjects

# 4. Test production build
npm run build

# 5. Test start production server
npm start
```

---

### Setelah Deploy

**1. Update domain (opsional)**

Jika ingin pakai custom domain:
- Beli domain (contoh: namecheap, domainesia)
- Set DNS ke Vercel/Netlify
- Add domain di Vercel/Netlify dashboard

**2. Enable SSL/HTTPS**

Vercel/Netlify otomatis provide HTTPS free!

**3. Set up analytics (opsional)**

Tambah Google Analytics:
1. Buat account di https://analytics.google.com
2. Get tracking ID
3. Add di `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

**4. Submit sitemap ke Google**

Buka: https://www.google.com/webmasters/tools/sitemap-list
Submit: https://your-domain.com/sitemap.xml

---

### Troubleshooting Deploy

**Problem 1: Build failed di Vercel**

**Solusi:**
- Check Vercel logs (Deployment > Logs)
- Pastikan `.env.local` variables sudah di-add di Vercel
- Check Node.js version (harus 18+)

**Problem 2: Environment variables tidak working**

**Solusi:**
- Add di Vercel dashboard (Settings > Environment Variables)
- Redeploy setelah add variables

**Problem 3: Image not loading**

**Solusi:**
- Check Next.js image domains config di `next.config.js`
- Pastikan domain di-allow

**Problem 4: 404 Not Found**

**Solusi:**
- Check build succeeded
- Check public files di folder `public/`
- Restart deployment

---

### Deploy Checklist Summary

✅ Code sudah di-push ke GitHub  
✅ `.env.local` sudah dikonfigurasi  
✅ `npm run predeploy` passed  
✅ Production build berhasil (`npm run build`)  
✅ Vercel/Netlify sudah configured  
✅ Environment variables sudah added  
✅ Portfolio bisa diakses di internet  

---

## 🎓 Tips untuk Fresh Graduate

### 1. Mulai dari Template yang Sudah Ada

Jangan mulai dari nol. Gunakan template ini sebagai base:
- Ubah data Anda di `lib/data.ts`
- Ganti foto profile
- Tambah project Anda
- Update skills sesuai keahlian

### 2. Fokus pada Konten, Bukan Design

Sebagai fresh graduate:
- ✅ Content yang bagus lebih penting dari design yang kompleks
- ✅ Tulis bio yang jujur dan profesional
- ✅ Jelaskan project dengan jelas
- ✅ Highlight skills yang sudah kuasai

### 3. Jangan Takut Belajar

Portfolio adalah project belajar:
- Update skills sesuai yang sedang dipelajari
- Tambah project baru setiap belajar tech baru
- Dokumentasikan proses belajar Anda

### 4. Keep it Simple

Lebih baik:
- Simple but clean design
- Clear content
- Fast loading
- Mobile friendly

Dari:
- Over-designed dengan banyak animation
- Heavy dengan banyak image
- Slow loading

### 5. Update Berkala

Portfolio bukan "set and forget":
- Update setiap belajar tech baru
- Add project baru setiap selesai
- Update contact info jika berubah
- Refresh design setiap 6-12 bulan

---

## 📞 Butuh Bantuan?

**Check dokumentasi:**
- README.md (English)
- README-ID.md (Bahasa Indonesia)

**Common issues:**
- Section Troubleshooting di atas
- GitHub Issues di repository original

**Remember:**
- Jangan takut experiment!
- Portfolio adalah cerminan profesional Anda
- Update terus seiring berkembang!

---

**Selamat menjalankan portfolio locally! 🚀**
