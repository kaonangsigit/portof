# 🚀 START HERE - Portfolio Project

**English** | [Bahasa Indonesia](#bahasa-indonesia)

---

## Welcome!

This is your complete, production-ready portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Everything is set up and ready to customize.

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your information

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` - Your portfolio is running!

## 📁 Project Structure

```
Portofolio/
├── 00-READ-FIRST.md          ← YOU ARE HERE
├── GETTING_STARTED.md         ← Detailed beginner guide
├── README.md                  ← Project overview
├── DEPLOYMENT.md              ← Deploy to production
├── CUSTOMIZATION.md           ← Make it yours
├── CONTRIBUTING.md            ← Contribute guidelines
├── CHANGELOG.md               ← Version history
│
├── app/                       ← Next.js 14 App Router
│   ├── page.tsx              ← Homepage
│   ├── projects/             ← Projects page
│   ├── about/                ← About page
│   ├── contact/              ← Contact page
│   ├── layout.tsx            ← Root layout
│   └── manifest.ts           ← PWA manifest
│
├── components/               ← React components
│   ├── Hero.tsx             ← Hero section
│   ├── Projects.tsx         ← Projects showcase
│   ├── Skills.tsx           ← Skills display
│   ├── Contact.tsx          ← Contact form
│   ├── Navigation.tsx       ← Navigation bar
│   ├── ThemeToggle.tsx      ← Dark mode toggle
│   └── ScrollToTop.tsx      ← Scroll button
│
├── lib/                     ← Utilities
│   ├── data.ts             ← Portfolio data
│   ├── seo.ts              ← SEO utilities
│   └── analytics.ts        ← Analytics tracking
│
├── public/                  ← Static assets
│   ├── images/             ← Your images
│   └── manifest.json       ← PWA config
│
└── styles/                  ← Global styles
    └── globals.css
```

## 🎯 What to Customize First

### 1. Personal Information (5 minutes)
**File:** `lib/data.ts`
```typescript
export const personalInfo = {
  name: "Your Name",           // ← Change this
  email: "you@email.com",      // ← Change this
  github: "yourusername",      // ← Change this
  // ... more fields
};
```

### 2. Projects (10 minutes)
**File:** `lib/data.ts`
```typescript
export const projects = [
  {
    title: "Your Project",     // ← Add your projects
    description: "...",
    // ... more fields
  },
];
```

### 3. Environment Variables (2 minutes)
**File:** `.env.local`
```bash
NEXT_PUBLIC_GA_ID=your-ga-id         # Optional
RESEND_API_KEY=your-resend-key       # For contact form
```

### 4. Images (5 minutes)
- Add your photo to `public/images/profile.jpg`
- Add project screenshots to `public/images/projects/`

## 📚 Important Documentation

| Document | Purpose | Read When |
|----------|---------|-----------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Step-by-step setup | You're a beginner |
| [CUSTOMIZATION.md](./CUSTOMIZATION.md) | Complete customization guide | Ready to personalize |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to production | Ready to launch |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical deep dive | Want to understand structure |
| [API.md](./API.md) | API routes documentation | Working with backend |
| [TESTING.md](./TESTING.md) | Testing guide | Writing tests |

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Code Quality
npm run format           # Format code
npm run type-check       # Check TypeScript

# Deployment
npm run deploy           # Deploy to Vercel
```

## 🆘 Troubleshooting Quick Links

### Installation Issues
- **Port 3000 already in use**: Run `lsof -ti:3000 | xargs kill -9`
- **Node version error**: Run `nvm use` or check [GETTING_STARTED.md](./GETTING_STARTED.md#node-version)
- **npm install fails**: Delete `node_modules` and `package-lock.json`, run `npm install` again

### Development Issues
- **Page not found**: Check file naming in `app/` directory
- **CSS not loading**: Check `tailwind.config.ts` content paths
- **Images not showing**: Verify paths in `public/` directory
- **API route errors**: Check `.env.local` configuration

### Build Issues
- **TypeScript errors**: Run `npm run type-check` for details
- **Build fails**: Check [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)
- **Environment variables**: Ensure all required vars are set

## 🎓 Learning Resources

- **Next.js 14**: [nextjs.org/docs](https://nextjs.org/docs)
- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React**: [react.dev](https://react.dev)

## 📞 Get Help

1. Check [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup
2. Read [CUSTOMIZATION.md](./CUSTOMIZATION.md) for customization help
3. See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
4. Search issues on GitHub
5. Open a new issue if problem persists

## ✅ Checklist Before Launch

- [ ] Customize personal information in `lib/data.ts`
- [ ] Add your projects and descriptions
- [ ] Upload your images to `public/images/`
- [ ] Set up environment variables in `.env.local`
- [ ] Test contact form
- [ ] Run `npm run build` successfully
- [ ] Test in different browsers
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Set up Google Analytics (optional)
- [ ] Add custom domain (optional)
- [ ] Deploy to Vercel

## 🎉 Next Steps

1. **Now**: Read [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed walkthrough
2. **Next**: Customize using [CUSTOMIZATION.md](./CUSTOMIZATION.md)
3. **Then**: Deploy using [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Finally**: Share your portfolio with the world!

---

# Bahasa Indonesia

## Selamat Datang!

Ini adalah website portofolio Anda yang lengkap dan siap produksi, dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS. Semuanya sudah siap untuk dikustomisasi.

## ⚡ Mulai Cepat (3 Langkah)

```bash
# 1. Install dependensi
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan informasi Anda

# 3. Jalankan development server
npm run dev
```

Kunjungi `http://localhost:3000` - Portofolio Anda sudah berjalan!

## 🎯 Yang Harus Dikustomisasi Pertama

### 1. Informasi Pribadi (5 menit)
**File:** `lib/data.ts`
```typescript
export const personalInfo = {
  name: "Nama Anda",           // ← Ubah ini
  email: "email@anda.com",     // ← Ubah ini
  github: "username-anda",     // ← Ubah ini
  // ... field lainnya
};
```

### 2. Proyek (10 menit)
**File:** `lib/data.ts`
```typescript
export const projects = [
  {
    title: "Proyek Anda",      // ← Tambahkan proyek Anda
    description: "...",
    // ... field lainnya
  },
];
```

### 3. Environment Variables (2 menit)
**File:** `.env.local`
```bash
NEXT_PUBLIC_GA_ID=ga-id-anda         # Opsional
RESEND_API_KEY=resend-key-anda       # Untuk form kontak
```

### 4. Gambar (5 menit)
- Tambahkan foto Anda ke `public/images/profile.jpg`
- Tambahkan screenshot proyek ke `public/images/projects/`

## 📚 Dokumentasi Penting

| Dokumen | Tujuan | Baca Kapan |
|---------|--------|------------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Panduan setup langkah demi langkah | Anda pemula |
| [CUSTOMIZATION.md](./CUSTOMIZATION.md) | Panduan kustomisasi lengkap | Siap personalisasi |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy ke produksi | Siap launch |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Penjelasan teknis mendalam | Ingin paham struktur |

## 🔧 Perintah Umum

```bash
# Development
npm run dev              # Jalankan dev server
npm run build            # Build untuk produksi
npm run start            # Jalankan production server
npm run lint             # Cek kualitas kode

# Testing
npm run test             # Jalankan test
npm run test:watch       # Mode watch
npm run test:coverage    # Laporan coverage

# Kualitas Kode
npm run format           # Format kode
npm run type-check       # Cek TypeScript

# Deployment
npm run deploy           # Deploy ke Vercel
```

## 🆘 Troubleshooting

### Masalah Instalasi
- **Port 3000 sudah digunakan**: Jalankan `lsof -ti:3000 | xargs kill -9`
- **Error versi Node**: Jalankan `nvm use` atau cek [GETTING_STARTED.md](./GETTING_STARTED.md#node-version)
- **npm install gagal**: Hapus `node_modules` dan `package-lock.json`, jalankan `npm install` lagi

### Masalah Development
- **Halaman tidak ditemukan**: Cek penamaan file di direktori `app/`
- **CSS tidak loading**: Cek path di `tailwind.config.ts`
- **Gambar tidak muncul**: Verifikasi path di direktori `public/`
- **Error API route**: Cek konfigurasi `.env.local`

## ✅ Checklist Sebelum Launch

- [ ] Kustomisasi informasi pribadi di `lib/data.ts`
- [ ] Tambahkan proyek dan deskripsi Anda
- [ ] Upload gambar Anda ke `public/images/`
- [ ] Setup environment variables di `.env.local`
- [ ] Test form kontak
- [ ] Jalankan `npm run build` dengan sukses
- [ ] Test di berbagai browser
- [ ] Cek responsiveness mobile
- [ ] Verifikasi semua link berfungsi
- [ ] Setup Google Analytics (opsional)
- [ ] Tambahkan custom domain (opsional)
- [ ] Deploy ke Vercel

## 🎉 Langkah Selanjutnya

1. **Sekarang**: Baca [GETTING_STARTED.md](./GETTING_STARTED.md) untuk panduan detail
2. **Lalu**: Kustomisasi menggunakan [CUSTOMIZATION.md](./CUSTOMIZATION.md)
3. **Kemudian**: Deploy menggunakan [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Akhirnya**: Bagikan portofolio Anda ke dunia!

---

Made with ❤️ using Next.js 14
