# 🚀 Deployment Guide

Complete guide for deploying your portfolio to various platforms.

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment-recommended)
3. [Netlify Deployment](#netlify-deployment)
4. [AWS Amplify Deployment](#aws-amplify-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Custom Server Deployment](#custom-server-deployment)
7. [Post-Deployment](#post-deployment)
8. [Continuous Deployment](#continuous-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### 1. Update Personal Information

- [ ] Update `config/site.ts` with your information
- [ ] Update name and intro in `components/Hero.tsx`
- [ ] Update bio in `components/About.tsx`
- [ ] Update skills in `components/Skills.tsx`
- [ ] Update contact info in `components/Contact.tsx`
- [ ] Update metadata in `app/layout.tsx`
- [ ] Replace `public/profile.jpg` with your photo

### 2. Update Domain References

- [ ] Update site URL in `config/site.ts`
- [ ] Update domain in `app/sitemap.ts`
- [ ] Update domain in `app/robots.ts`
- [ ] Update Open Graph image URLs
- [ ] Update canonical URLs

### 3. Environment Variables

- [ ] `GITHUB_TOKEN` is set and valid
- [ ] `GITHUB_USERNAME` is correct
- [ ] Test GitHub API endpoints locally
- [ ] Prepare environment variables for production

### 4. Code Quality

```bash
# Run all checks
npm run type-check    # Check TypeScript types
npm run lint          # Check code quality
npm run build         # Test production build
```

- [ ] All TypeScript checks pass
- [ ] No ESLint errors
- [ ] Build succeeds without errors
- [ ] Test all pages in production build

### 5. Testing

- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS Safari, Chrome Mobile)
- [ ] Test all navigation links
- [ ] Verify GitHub repositories load
- [ ] Test contact links
- [ ] Check responsive design
- [ ] Verify animations work smoothly

### 6. Performance

- [ ] Optimize images (compress, resize)
- [ ] Remove console.logs from production code
- [ ] Check bundle size (`npm run build` output)
- [ ] Test loading speed
- [ ] Run Lighthouse audit locally

### 7. SEO

- [ ] Verify meta tags are correct
- [ ] Test Open Graph preview (use [opengraph.xyz](https://www.opengraph.xyz/))
- [ ] Check sitemap generates correctly
- [ ] Verify robots.txt is accessible

## 📦 Vercel Deployment (Recommended)

### Why Vercel?
- Made by Next.js creators
- Zero configuration
- Automatic HTTPS
- Global CDN
- Generous free tier
- Automatic deployments

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     - `GITHUB_TOKEN`: Your GitHub token
     - `GITHUB_USERNAME`: Your GitHub username
   - Add for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your site at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - Wait for DNS propagation (can take 24-48 hours)

### Automatic Deployments
- Every push to `main` triggers a production deployment
- Pull requests get preview deployments
- Preview URLs are automatically generated

## 🌐 Netlify Deployment

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - These should be auto-detected

4. **Environment Variables**
   - Go to Site Settings → Build & deploy → Environment
   - Add:
     - `GITHUB_TOKEN`
     - `GITHUB_USERNAME`

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Visit your site at `random-name.netlify.app`

6. **Custom Domain**
   - Go to Domain settings
   - Add custom domain
   - Configure DNS

## ☁️ AWS Amplify Deployment

### Steps

1. **Push to GitHub** (same as above)

2. **AWS Amplify Console**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect GitHub repository
   - Select your repository and branch

3. **Build Settings**
   - Auto-detected for Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

4. **Environment Variables**
   - Add `GITHUB_TOKEN` and `GITHUB_USERNAME`
   - In App settings → Environment variables

5. **Deploy**
   - Review and deploy
   - Wait for build
   - Access your site

## 🐳 Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Update `next.config.js`:
```javascript
module.exports = {
  output: 'standalone',
  // ... rest of config
};
```

### Build and Run

```bash
# Build
docker build -t portfolio .

# Run
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=your_token \
  -e GITHUB_USERNAME=your_username \
  portfolio
```

## 📊 Post-Deployment

### 1. Verify Deployment
- [ ] Visit deployed URL
- [ ] Check all pages load
- [ ] Test navigation
- [ ] Verify GitHub repos load
- [ ] Test on mobile
- [ ] Check dark mode

### 2. SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Verify meta tags
- [ ] Check Open Graph preview

### 3. Analytics (Optional)
- [ ] Add Google Analytics
- [ ] Add Vercel Analytics
- [ ] Set up error tracking (Sentry)

### 4. Performance
- [ ] Run Lighthouse audit
- [ ] Check PageSpeed Insights
- [ ] Verify Core Web Vitals
- [ ] Test load times

### 5. Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor API rate limits

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm run type-check
```

## 🔧 Troubleshooting

### Build Fails
- Check environment variables are set
- Verify Node.js version (18+)
- Clear cache and rebuild
- Check for TypeScript errors

### GitHub API Not Working
- Verify token is valid
- Check token has correct permissions
- Confirm username is correct
- Check API rate limits

### Slow Performance
- Enable image optimization
- Check bundle size
- Verify CDN is working
- Test API response times

### Custom Domain Issues
- Verify DNS settings
- Wait for propagation (24-48 hours)
- Check SSL certificate status
- Clear browser cache

## 📚 Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [AWS Amplify Docs](https://docs.amplify.aws)

---

## Bahasa Indonesia

## Daftar Isi

1. [Checklist Pra-Deployment](#checklist-pra-deployment)
2. [Deployment Vercel](#deployment-vercel-direkomendasikan)
3. [Deployment Netlify](#deployment-netlify)
4. [Deployment Docker](#deployment-docker)
5. [Pasca-Deployment](#pasca-deployment)
6. [Troubleshooting](#troubleshooting-1)

---

## Checklist Pra-Deployment

### 1. Update Informasi Personal

- [ ] Update `config/site.ts` dengan informasi Anda
- [ ] Update nama dan intro di `components/Hero.tsx`
- [ ] Update bio di `components/About.tsx`
- [ ] Update keahlian di `components/Skills.tsx`
- [ ] Update info kontak di `components/Contact.tsx`
- [ ] Update metadata di `app/layout.tsx`
- [ ] Ganti `public/profile.jpg` dengan foto Anda

### 2. Update Referensi Domain

- [ ] Update URL site di `config/site.ts`
- [ ] Update domain di `app/sitemap.ts`
- [ ] Update domain di `app/robots.ts`
- [ ] Update URL Open Graph image
- [ ] Update canonical URLs

### 3. Environment Variables

- [ ] `GITHUB_TOKEN` sudah diset dan valid
- [ ] `GITHUB_USERNAME` sudah benar
- [ ] Test endpoint GitHub API secara lokal
- [ ] Siapkan environment variables untuk production

### 4. Kualitas Kode

```bash
# Jalankan semua pengecekan
npm run type-check    # Cek TypeScript types
npm run lint          # Cek kualitas kode
npm run build         # Test production build
```

- [ ] Semua pengecekan TypeScript lulus
- [ ] Tidak ada error ESLint
- [ ] Build berhasil tanpa error
- [ ] Test semua halaman di production build

### 5. Testing

- [ ] Test di desktop (Chrome, Firefox, Safari)
- [ ] Test di mobile devices (iOS Safari, Chrome Mobile)
- [ ] Test semua link navigasi
- [ ] Verifikasi GitHub repositories muncul
- [ ] Test link kontak
- [ ] Cek desain responsif
- [ ] Verifikasi animasi berjalan smooth

### 6. Performa

- [ ] Optimalkan gambar (compress, resize)
- [ ] Hapus console.logs dari production code
- [ ] Cek bundle size (output dari `npm run build`)
- [ ] Test kecepatan loading
- [ ] Jalankan audit Lighthouse secara lokal

### 7. SEO

- [ ] Verifikasi meta tags sudah benar
- [ ] Test preview Open Graph (gunakan [opengraph.xyz](https://www.opengraph.xyz/))
- [ ] Cek sitemap generate dengan benar
- [ ] Verifikasi robots.txt dapat diakses

---

## Deployment Vercel (Direkomendasikan)

### Mengapa Vercel?
- Dibuat oleh pembuat Next.js
- Konfigurasi otomatis
- HTTPS otomatis
- Global CDN
- Free tier yang generous
- Deployment otomatis

### Langkah-langkah

#### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username-anda/portfolio.git
git push -u origin main
```

#### 2. Deploy ke Vercel

- Kunjungi https://vercel.com
- Login dengan GitHub
- Klik "New Project"
- Import repository GitHub Anda
- Vercel akan auto-detect pengaturan Next.js

#### 3. Tambahkan Environment Variables

- Masuk ke Project Settings → Environment Variables
- Tambahkan:
  - `GITHUB_TOKEN`: Token GitHub Anda
  - `GITHUB_USERNAME`: Username GitHub Anda
- Tambahkan untuk semua environment (Production, Preview, Development)

#### 4. Deploy

- Klik "Deploy"
- Tunggu deployment selesai (biasanya 1-2 menit)
- Kunjungi site Anda di `nama-project.vercel.app`

#### 5. Custom Domain (Opsional)

- Masuk ke Project Settings → Domains
- Klik "Add Domain"
- Masukkan domain Anda (contoh: `portofolio-anda.com`)
- Ikuti instruksi konfigurasi DNS:

**Untuk apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Untuk subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

- Tunggu propagasi DNS (bisa 24-48 jam)
- SSL certificate akan otomatis disetup

### Deployment Otomatis

- Setiap push ke branch `main` akan trigger deployment production
- Pull request akan mendapatkan preview deployment
- URL preview otomatis di-generate
- Comment di PR dengan link preview

---

## Deployment Netlify

### Langkah-langkah

#### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username-anda/portfolio.git
git push -u origin main
```

#### 2. Deploy ke Netlify

- Kunjungi https://netlify.com
- Login dengan GitHub
- Klik "Add new site" → "Import an existing project"
- Pilih GitHub
- Pilih repository Anda

#### 3. Build Settings

- Build command: `npm run build`
- Publish directory: `.next`
- Netlify akan auto-detect untuk Next.js

#### 4. Environment Variables

- Masuk ke Site Settings → Build & deploy → Environment
- Tambahkan:
  - `GITHUB_TOKEN`
  - `GITHUB_USERNAME`

#### 5. Deploy

- Klik "Deploy site"
- Tunggu build selesai
- Kunjungi site Anda di `random-name.netlify.app`

#### 6. Custom Domain

- Masuk ke Domain settings
- Klik "Add custom domain"
- Masukkan domain Anda
- Ikuti instruksi DNS configuration
- Netlify akan auto-setup SSL

---

## Deployment Docker

### Dockerfile

Buat file `Dockerfile` di root project:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Update next.config.js

```javascript
module.exports = {
  output: 'standalone',
  // ... konfigurasi lainnya
};
```

### Build dan Run

```bash
# Build Docker image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=token_anda \
  -e GITHUB_USERNAME=username_anda \
  portfolio
```

### Docker Compose (Opsional)

Buat `docker-compose.yml`:

```yaml
version: '3.8'
services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_USERNAME=${GITHUB_USERNAME}
    restart: unless-stopped
```

Jalankan dengan:
```bash
docker-compose up -d
```

---

## Pasca-Deployment

### 1. Verifikasi Deployment

- [ ] Kunjungi URL deployed
- [ ] Cek semua halaman dapat load
- [ ] Test navigasi
- [ ] Verifikasi GitHub repos muncul
- [ ] Test di mobile
- [ ] Cek dark mode (jika ada)

### 2. Setup SEO

#### Google Search Console

1. Kunjungi https://search.google.com/search-console
2. Tambahkan property dengan URL site Anda
3. Verifikasi ownership (gunakan tag HTML atau DNS)
4. Submit sitemap: `https://domain-anda.com/sitemap.xml`

#### Bing Webmaster Tools

1. Kunjungi https://www.bing.com/webmasters
2. Tambahkan site Anda
3. Verifikasi ownership
4. Submit sitemap

### 3. Analytics (Opsional)

#### Google Analytics

```tsx
// app/layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `}
</Script>
```

#### Vercel Analytics

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 4. Performa

- [ ] Jalankan Lighthouse audit di Chrome DevTools
- [ ] Cek PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Verifikasi Core Web Vitals
- [ ] Test loading times dari berbagai lokasi

### 5. Monitoring

#### Uptime Monitoring

Gunakan layanan seperti:
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

#### Error Tracking

Setup Sentry untuk tracking error:

```bash
npm install @sentry/nextjs
```

---

## Troubleshooting

### Build Gagal

**Masalah:** Build error di deployment platform

**Solusi:**

1. **Cek environment variables:**
   ```bash
   # Pastikan semua env vars sudah diset
   GITHUB_TOKEN=...
   GITHUB_USERNAME=...
   ```

2. **Cek Node.js version:**
   - Pastikan menggunakan Node.js 18.x atau lebih tinggi
   - Tambahkan di `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

3. **Cek TypeScript errors:**
   ```bash
   npm run type-check
   ```

### GitHub API Tidak Bekerja

**Masalah:** Repositories tidak muncul di production

**Solusi:**

1. Verifikasi token di production environment
2. Cek token belum expired
3. Pastikan token punya permission yang benar
4. Test API endpoint secara langsung:
   ```bash
   curl https://domain-anda.com/api/github/repos
   ```

### Gambar Tidak Muncul

**Masalah:** Images 404 di production

**Solusi:**

1. Pastikan gambar ada di folder `public/`
2. Gunakan path yang benar:
   ```tsx
   // Benar
   <img src="/images/profile.jpg" />
   
   // Salah
   <img src="./images/profile.jpg" />
   ```

3. Verifikasi gambar ter-commit ke git
4. Cek next.config.js untuk image domains

### Performa Lambat

**Solusi:**

1. Optimalkan gambar (compress dengan TinyPNG)
2. Enable Vercel/Netlify CDN
3. Cek bundle size
4. Implement lazy loading
5. Enable compression di next.config.js

### Custom Domain Tidak Bekerja

**Solusi:**

1. Verifikasi DNS settings benar
2. Tunggu propagasi DNS (24-48 jam)
3. Cek DNS dengan: `nslookup domain-anda.com`
4. Clear browser cache
5. Test dengan mode incognito
6. Cek SSL certificate sudah aktif

---

## Tips Tambahan

### Optimasi Performa

1. **Compress Images:**
   - Gunakan WebP format
   - Compress dengan TinyPNG atau Squoosh
   - Ukuran maksimal 500KB per gambar

2. **Enable Caching:**
   ```javascript
   // next.config.js
   module.exports = {
     headers: async () => [
       {
         source: '/images/:path*',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
     ],
   };
   ```

3. **Optimize Fonts:**
   ```tsx
   // Gunakan display: 'swap' untuk faster loading
   const inter = Inter({ 
     subsets: ['latin'],
     display: 'swap',
   });
   ```

### Security Headers

Tambahkan di `middleware.ts` jika belum ada:

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}
```

---

**Butuh Bantuan?** Lihat [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) atau buat issue di GitHub.

**Terakhir Diupdate:** 2026-07-19
