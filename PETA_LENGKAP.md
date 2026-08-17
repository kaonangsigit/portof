# 🗺️ PETA LENGKAP PROJECT PORTFOLIO

> **Visual Guide untuk Navigasi Project Anda**

---

## 📁 STRUKTUR DIREKTORI PROJECT

```
📦 Portofolio/
│
├── 📂 app/                          # ⭐⭐⭐ Next.js 14 App Router
│   ├── 📄 page.tsx                  # 🔥 HALAMAN UTAMA (Homepage)
│   ├── 📄 layout.tsx                # Layout wrapper untuk semua halaman
│   ├── 📄 globals.css               # 🎨 Global CSS styles
│   ├── 📄 error.tsx                 # Error handling page
│   ├── 📄 loading.tsx               # Loading state
│   ├── 📄 not-found.tsx             # 404 page
│   ├── 📄 manifest.ts               # PWA manifest
│   ├── 📄 robots.ts                 # SEO robots.txt
│   ├── 📄 sitemap.ts                # SEO sitemap
│   └── 📂 api/                      # API routes
│       └── 📂 contact/              # Contact form API
│
├── 📂 components/                   # ⭐⭐⭐ REACT COMPONENTS
│   ├── 📄 Hero.tsx                  # 🔥 Hero section (halaman depan)
│   ├── 📄 About.tsx                 # 🔥 About section
│   ├── 📄 Skills.tsx                # 🔥 Skills section
│   ├── 📄 Projects.tsx              # 🔥 Projects section
│   ├── 📄 Contact.tsx               # 🔥 Contact section
│   ├── 📄 Navigation.tsx            # Navigation bar
│   ├── 📄 Footer.tsx                # Footer
│   ├── 📄 Experience.tsx            # Work experience
│   ├── 📄 Education.tsx             # Education section
│   ├── 📄 Achievements.tsx          # Achievements/Certifications
│   ├── 📄 Stats.tsx                 # Statistics section
│   ├── 📄 Testimonials.tsx          # Testimonials (optional)
│   ├── 📄 ThemeToggle.tsx           # Dark/Light mode toggle
│   ├── 📄 BackToTop.tsx             # Scroll to top button
│   ├── 📄 LoadingScreen.tsx         # Loading screen
│   ├── 📄 ErrorBoundary.tsx         # Error boundary wrapper
│   └── 📂 ui/                       # Reusable UI components
│       ├── 📄 Button.tsx
│       ├── 📄 Card.tsx
│       ├── 📄 Badge.tsx
│       └── ...
│
├── 📂 lib/                          # ⭐⭐⭐ LIBRARY & UTILITIES
│   ├── 📄 data.ts                   # 🔥🔥🔥 FILE TERPENTING! (EDIT INI)
│   ├── 📄 github.ts                 # GitHub API integration
│   ├── 📄 constants.ts              # Konstanta aplikasi
│   ├── 📄 config.ts                 # Konfigurasi aplikasi
│   ├── 📄 metadata.ts               # SEO metadata helpers
│   ├── 📄 seo.ts                    # SEO utilities
│   ├── 📄 analytics.ts              # Analytics integration
│   ├── 📄 email.ts                  # Email utilities
│   └── 📄 utils.ts                  # Helper functions
│
├── 📂 hooks/                        # Custom React Hooks
│   ├── 📄 useTheme.ts               # Theme management
│   ├── 📄 useScrollSpy.ts           # Active section tracking
│   ├── 📄 useMediaQuery.ts          # Responsive breakpoints
│   ├── 📄 useGitHub.ts              # GitHub data fetching
│   └── 📄 useIntersectionObserver.ts # Scroll animations
│
├── 📂 types/                        # TypeScript type definitions
│   └── 📄 index.ts                  # Global types
│
├── 📂 public/                       # ⭐⭐⭐ STATIC FILES (GAMBAR, FONT, DLL)
│   ├── 📷 profile.jpg               # 🔥 FOTO PROFIL ANDA (TAMBAHKAN INI!)
│   ├── 📷 og-image.jpg              # Open Graph image untuk social media
│   ├── 📷 favicon.ico               # Website icon
│   ├── 📂 projects/                 # Screenshots project
│   │   ├── ecommerce.jpg
│   │   ├── taskmanager.jpg
│   │   └── weather.jpg
│   ├── 📂 screenshots/              # Screenshots untuk dokumentasi
│   └── 📂 testimonials/             # Foto untuk testimonials
│
├── 📂 scripts/                      # Automation scripts
│   ├── 📄 verify-setup.js           # Verify project setup
│   ├── 📄 pre-deploy-check.js       # Pre-deployment checks
│   └── 📄 info.js                   # Project info
│
├── 📂 __tests__/                    # Test files
│   └── ...
│
├── 📄 .env.example                  # ⭐⭐ Environment variables template
├── 📄 .env.local                    # 🔥🔥 YOUR ENV VARS (BUAT FILE INI!)
│
├── 📄 package.json                  # Dependencies & scripts
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 vercel.json                   # Vercel deployment config
│
├── 📄 README.md                     # Dokumentasi project
├── 📄 UNTUK_ANDA.md                 # 🔥 Panduan khusus untuk Anda!
└── 📄 PETA_LENGKAP.md               # 🔥 File ini (peta project)
```

---

## 🎯 QUICK TASK INDEX

> **"Saya ingin mengubah X, edit file Y"**

### 🔥 SERING DIUBAH (WAJIB DIKUSTOMISASI)

| Saya ingin... | Edit file ini | Baris |
|---------------|---------------|-------|
| ✏️ Ubah nama, bio, title saya | `lib/data.ts` | 156-187 |
| 🔗 Ubah link social media | `lib/data.ts` | 193-222 |
| 💻 Ubah skills/teknologi | `lib/data.ts` | 253-290 |
| 💼 Ubah pengalaman kerja | `lib/data.ts` | 323-357 |
| 🎓 Ubah pendidikan | `lib/data.ts` | 363-377 |
| 🏆 Ubah sertifikasi | `lib/data.ts` | 383-402 |
| 🚀 Ubah featured projects | `lib/data.ts` | 447-472 |
| 🌐 Ubah GitHub username | `lib/data.ts` | 564 |
| 🖼️ Ganti foto profil | `public/profile.jpg` | - |
| 🔑 Setup GitHub token | `.env.local` | 19-21 |

### 🎨 STYLING & DESIGN

| Saya ingin... | Edit file ini | Keterangan |
|---------------|---------------|------------|
| 🎨 Ubah warna tema | `tailwind.config.ts` | Colors configuration |
| 🖌️ Ubah font | `app/layout.tsx` | Font imports |
| 📐 Ubah spacing/layout | `tailwind.config.ts` | Spacing configuration |
| 🌙 Ubah dark mode colors | `app/globals.css` | CSS variables |

### 📝 KONTEN & TEKS

| Saya ingin... | Edit file ini | Baris |
|---------------|---------------|-------|
| 📝 Ubah teks hero section | `lib/data.ts` | 500-506 |
| 📝 Ubah teks about section | `lib/data.ts` | 508-510 |
| 📝 Ubah teks skills section | `lib/data.ts` | 512-518 |
| 📝 Ubah teks projects section | `lib/data.ts` | 520-524 |
| 📝 Ubah teks contact section | `lib/data.ts` | 526-546 |
| 📝 Ubah footer text | `lib/data.ts` | 548-557 |

### ⚙️ KONFIGURASI & SEO

| Saya ingin... | Edit file ini | Keterangan |
|---------------|---------------|------------|
| 🌐 Ubah metadata SEO | `lib/data.ts` | Baris 420-439 |
| 🤖 Ubah robots.txt | `app/robots.ts` | SEO crawling rules |
| 🗺️ Ubah sitemap | `app/sitemap.ts` | SEO sitemap config |
| 🔗 Ubah URL website | `.env.local` | NEXT_PUBLIC_SITE_URL |
| 📊 Setup analytics | `.env.local` | NEXT_PUBLIC_GA_ID |

---

## 🚨 FILE YANG JANGAN DIUBAH (KECUALI ANDA TAHU YANG ANDA LAKUKAN)

### 🔴 LEVEL BAHAYA TINGGI - JANGAN SENTUH!

```
❌ package.json              # Dependencies management (jangan edit manual)
❌ package-lock.json         # Lock file (jangan hapus!)
❌ node_modules/             # Dependencies folder (generated otomatis)
❌ .next/                    # Build output (generated otomatis)
❌ .git/                     # Git metadata (jangan sentuh!)
```

### 🟡 LEVEL MENENGAH - HATI-HATI!

```
⚠️ next.config.js           # Next.js config (advanced)
⚠️ tsconfig.json            # TypeScript config (advanced)
⚠️ tailwind.config.ts       # Tailwind config (boleh ubah warna)
⚠️ middleware.ts            # Request middleware (advanced)
⚠️ app/layout.tsx           # Root layout (hati-hati!)
```

### 🟢 AMAN UNTUK DIUBAH

```
✅ lib/data.ts              # 100% AMAN - Edit sepuasnya!
✅ .env.local               # Environment variables Anda
✅ public/*                 # Gambar dan static files
✅ README.md                # Dokumentasi
✅ UNTUK_ANDA.md           # Panduan ini
```

---

## 🎨 COLOR CODE: TINGKAT KEPENTINGAN FILE

### 🔥🔥🔥 CRITICAL (Wajib Edit)

**File yang HARUS Anda ubah untuk kustomisasi:**

1. **`lib/data.ts`** - DATA UTAMA PORTFOLIO
   - 🎯 Priority: URGENT
   - ⏱️ Time: 30-60 menit
   - 📍 Semua konten website ada di sini!

2. **`.env.local`** - ENVIRONMENT VARIABLES
   - 🎯 Priority: URGENT
   - ⏱️ Time: 10 menit
   - 📍 GitHub token, email, site URL

3. **`public/profile.jpg`** - FOTO PROFIL
   - 🎯 Priority: HIGH
   - ⏱️ Time: 5 menit
   - 📍 Foto profil Anda

### 🔥🔥 IMPORTANT (Disarankan Edit)

**File yang sebaiknya Anda ubah:**

4. **`public/og-image.jpg`** - SOCIAL MEDIA IMAGE
   - 🎯 Priority: MEDIUM
   - ⏱️ Time: 15 menit
   - 📍 Gambar untuk share di social media

5. **`README.md`** - DOKUMENTASI PROJECT
   - 🎯 Priority: MEDIUM
   - ⏱️ Time: 20 menit
   - 📍 Info tentang project di GitHub

### 🔥 OPTIONAL (Boleh Edit Nanti)

**File yang bisa diubah kalau mau custom lebih lanjut:**

6. **`tailwind.config.ts`** - CUSTOM COLORS/THEME
   - 🎯 Priority: LOW
   - ⏱️ Time: 30 menit+
   - 📍 Ubah warna, font, spacing

7. **`components/*.tsx`** - CUSTOM COMPONENTS
   - 🎯 Priority: LOW
   - ⏱️ Time: Varies
   - 📍 Ubah tampilan/layout sections

---

## 📋 CHEAT SHEET: FILE LOCATIONS

### 💡 "Dimana file X?"

**Q: Dimana saya ubah nama dan bio saya?**  
A: `lib/data.ts` baris 156-187

**Q: Dimana saya tambah GitHub token?**  
A: `.env.local` baris 19 (buat file ini dari `.env.example`)

**Q: Dimana saya taruh foto profil?**  
A: `public/profile.jpg` (nama file harus persis ini!)

**Q: Dimana saya ubah warna website?**  
A: `tailwind.config.ts` bagian `colors`

**Q: Dimana saya ubah teks di hero section?**  
A: `lib/data.ts` baris 500-506

**Q: Dimana saya tambah skill baru?**  
A: `lib/data.ts` baris 253-290

**Q: Dimana saya ubah pengalaman kerja?**  
A: `lib/data.ts` baris 323-357

**Q: Dimana component Hero/About/Skills ada?**  
A: Folder `components/` → `Hero.tsx`, `About.tsx`, `Skills.tsx`, dll

**Q: Dimana file CSS utama?**  
A: `app/globals.css`

**Q: Dimana konfigurasi Vercel?**  
A: `vercel.json`

---

## 🔄 WORKFLOW: EDIT → TEST → DEPLOY

### Step-by-Step Development Workflow:

```
1️⃣ EDIT
   └─ Ubah file yang diperlukan (biasanya lib/data.ts)
   
2️⃣ SAVE
   └─ Ctrl/Cmd + S untuk save
   
3️⃣ TEST LOKAL
   └─ Browser auto-reload di localhost:3000
   └─ Cek apakah perubahan sudah benar
   
4️⃣ GIT COMMIT
   └─ git add .
   └─ git commit -m "Update: [deskripsi perubahan]"
   
5️⃣ PUSH TO GITHUB
   └─ git push
   
6️⃣ AUTO DEPLOY
   └─ Vercel otomatis deploy (tunggu 1-2 menit)
   └─ Cek website live Anda
```

---

## 🎯 QUICK REFERENCE: COMMON TASKS

### Task 1: Ubah Informasi Pribadi

```typescript
// File: lib/data.ts (baris 156)

export const personalInfo: PersonalInfo = {
  name: 'Nama Lengkap Anda',           // ← UBAH INI
  title: 'Job Title Anda',              // ← UBAH INI
  tagline: 'Tagline Anda',              // ← UBAH INI
  bio: [
    "Paragraf 1 tentang Anda",          // ← UBAH INI
    "Paragraf 2 tentang Anda",          // ← UBAH INI
  ],
  profileImage: '/profile.jpg',
  yearsExperience: 5,                   // ← UBAH INI
  projectsCompleted: 50,                // ← UBAH INI
  availability: {
    status: 'available',                // ← UBAH INI
    message: 'Available for work',      // ← UBAH INI
  },
};
```

**Lokasi:** `/Users/kaonangprakoso/Library/Mobile Documents/com~apple~CloudDocs/Portofolio/lib/data.ts:156`

---

### Task 2: Tambah/Ubah Social Media

```typescript
// File: lib/data.ts (baris 193)

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/USERNAME',    // ← GANTI USERNAME
    username: '@USERNAME',                  // ← GANTI USERNAME
    color: 'hover:text-gray-300',
  },
  // ... tambahkan social media lain
];
```

**Lokasi:** `/Users/kaonangprakoso/Library/Mobile Documents/com~apple~CloudDocs/Portofolio/lib/data.ts:193`

---

### Task 3: Tambah Skill Baru

```typescript
// File: lib/data.ts (baris 253)

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact, color: 'text-cyan-400' },
      // ← TAMBAHKAN SKILL BARU DI SINI
      { name: 'Vue.js', icon: SiVuedotjs, color: 'text-green-500' },
    ],
  },
];
```

**Icon tersedia dari `react-icons/si`** (cek: https://react-icons.github.io/react-icons/icons/si/)

**Lokasi:** `/Users/kaonangprakoso/Library/Mobile Documents/com~apple~CloudDocs/Portofolio/lib/data.ts:253`

---

### Task 4: Setup Environment Variables

```bash
# File: .env.local (BUAT FILE INI dari .env.example)

# GitHub API
GITHUB_TOKEN=ghp_your_token_here                    # ← DARI GITHUB
GITHUB_USERNAME=your_username                       # ← USERNAME GITHUB ANDA
NEXT_PUBLIC_GITHUB_USERNAME=your_username           # ← USERNAME GITHUB ANDA

# Site Config
NEXT_PUBLIC_SITE_URL=https://yoursite.vercel.app   # ← URL VERCEL ANDA
NEXT_PUBLIC_SITE_NAME="Your Name - Portfolio"      # ← NAMA WEBSITE

# Contact
CONTACT_EMAIL=your.email@example.com               # ← EMAIL ANDA
```

**Lokasi:** `/Users/kaonangprakoso/Library/Mobile Documents/com~apple~CloudDocs/Portofolio/.env.local`

---

### Task 5: Ganti Foto Profil

1. Siapkan foto Anda (JPG/PNG, 500x500px recommended)
2. Rename menjadi `profile.jpg`
3. Copy ke folder `/public/`
4. Hapus foto lama (jika ada)

```
📁 public/
  ├─ profile.jpg  ← File foto Anda harus di sini
  └─ ...
```

**Lokasi:** `/Users/kaonangprakoso/Library/Mobile Documents/com~apple~CloudDocs/Portofolio/public/profile.jpg`

---

## 📊 FILE SIZE GUIDE

### 📷 Ukuran File Gambar (Recommended)

| Jenis Gambar | Ukuran Pixel | File Size | Format |
|--------------|--------------|-----------|--------|
| Profile Photo | 500x500 | < 200KB | JPG/PNG |
| OG Image | 1200x630 | < 500KB | JPG/PNG |
| Project Screenshot | 1200x800 | < 300KB | JPG/PNG/WebP |
| Favicon | 32x32 | < 10KB | ICO/PNG |

**Tips Compress Gambar:**
- Online: TinyPNG.com, Squoosh.app
- Mac: ImageOptim
- Windows: FileOptimizer

---

## 🛠️ TERMINAL COMMANDS CHEAT SHEET

### Development Commands:

```bash
# Install dependencies (PERTAMA KALI)
npm install

# Run development server (LOCALHOST)
npm run dev

# Build for production (TEST BUILD)
npm run build

# Start production server (SETELAH BUILD)
npm start

# Run linter (CEK CODE QUALITY)
npm run lint

# Run type check (CEK TYPESCRIPT)
npm run type-check

# Run tests (RUN TESTS)
npm test
```

### Git Commands:

```bash
# Cek status
git status

# Add semua perubahan
git add .

# Commit dengan message
git commit -m "Your message here"

# Push ke GitHub
git push

# Pull dari GitHub
git pull

# Cek branch
git branch

# Buat branch baru
git checkout -b new-branch-name
```

### Troubleshooting Commands:

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev

# Cek versi Node.js
node -v

# Cek versi npm
npm -v
```

---

## 🎓 LEARNING PATH

### Kalau Mau Belajar Lebih Dalam:

**1. JavaScript/TypeScript:**
- FreeCodeCamp (gratis)
- JavaScript.info
- TypeScript Handbook

**2. React:**
- React Documentation (react.dev)
- Scrimba React Course
- FreeCodeCamp React

**3. Next.js:**
- Next.js Documentation
- Next.js Learn (nextjs.org/learn)
- Lee Robinson YouTube Channel

**4. Tailwind CSS:**
- Tailwind Documentation
- Tailwind UI (examples)
- Adam Wathan YouTube

**5. Git & GitHub:**
- GitHub Skills
- Git Documentation
- Atlassian Git Tutorials

---

## 📞 HELP & SUPPORT

### Jika Stuck atau Error:

**1. Cek File `UNTUK_ANDA.md`**
   - Panduan lengkap khusus untuk Anda
   - Troubleshooting common errors

**2. Cek File `TROUBLESHOOTING.md`**
   - Solusi untuk error umum
   - Debug guide

**3. Cek File `README.md`**
   - Dokumentasi lengkap project
   - Setup guide detail

**4. Google Error Message:**
   - Copy error yang muncul
   - Google: "nextjs [error message]"
   - Biasanya ada di StackOverflow

**5. Community:**
   - Next.js Discord
   - Reddit r/nextjs
   - Stack Overflow

---

## 🗂️ FILE EXTENSIONS EXPLAINED

| Extension | Apa Itu? | Edit? |
|-----------|----------|-------|
| `.ts` | TypeScript file | ✅ Boleh |
| `.tsx` | TypeScript + React (JSX) | ✅ Boleh |
| `.js` | JavaScript file | ✅ Boleh |
| `.jsx` | JavaScript + React | ✅ Boleh |
| `.css` | Stylesheet | ✅ Boleh |
| `.json` | Configuration | ⚠️ Hati-hati |
| `.md` | Markdown (documentation) | ✅ Boleh |
| `.env` | Environment variables | ✅ Boleh |
| `.gitignore` | Git ignore rules | ⚠️ Hati-hati |

---

## 🎯 PRIORITY CHECKLIST

### ✅ MUST DO (Hari Ini):

- [ ] Baca file `UNTUK_ANDA.md` lengkap
- [ ] Baca file `PETA_LENGKAP.md` ini
- [ ] Install dependencies (`npm install`)
- [ ] Run dev server (`npm run dev`)
- [ ] Edit `lib/data.ts` dengan info Anda
- [ ] Tambahkan foto profil di `public/profile.jpg`

### ✅ SHOULD DO (Minggu Ini):

- [ ] Setup `.env.local` dengan GitHub token
- [ ] Test semua fitur di localhost
- [ ] Push ke GitHub
- [ ] Deploy ke Vercel
- [ ] Test website yang sudah live
- [ ] Share link di social media

### ✅ COULD DO (Bulan Ini):

- [ ] Custom colors di `tailwind.config.ts`
- [ ] Tambah lebih banyak projects
- [ ] Setup analytics
- [ ] Custom domain
- [ ] SEO optimization
- [ ] Add blog section

---

## 🎊 CONGRATULATIONS!

Anda sekarang punya peta lengkap project portfolio Anda! 🗺️

**Key Takeaways:**

1. 🔥 **File terpenting:** `lib/data.ts` - Edit ini untuk ubah semua konten
2. 🖼️ **Gambar:** Taruh di folder `public/`
3. 🔑 **Secrets:** Simpan di `.env.local`
4. 🚫 **Jangan sentuh:** `node_modules/`, `.next/`, `package-lock.json`
5. ✅ **Workflow:** Edit → Save → Test → Commit → Push → Auto Deploy

---

## 📚 RELATED FILES

Baca juga:
- 📖 `UNTUK_ANDA.md` - Panduan lengkap khusus untuk Anda
- 📖 `README.md` - Dokumentasi project lengkap
- 📖 `TROUBLESHOOTING.md` - Solusi error & debugging
- 📖 `DEPLOYMENT.md` - Panduan deploy detail
- 📖 `CUSTOMIZATION_GUIDE.md` - Guide kustomisasi advanced

---

**Happy Coding!** 💻

**Now you know exactly where everything is!** 🎯

---

*Last updated: 19 Juli 2026*
