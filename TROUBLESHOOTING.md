# 🔧 Troubleshooting Guide

Common issues and solutions for your portfolio website.

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Development Server Issues](#development-server-issues)
3. [GitHub API Issues](#github-api-issues)
4. [Build and Deployment Issues](#build-and-deployment-issues)
5. [Styling and UI Issues](#styling-and-ui-issues)
6. [Performance Issues](#performance-issues)
7. [Browser and Compatibility Issues](#browser-and-compatibility-issues)

---

## Installation Issues

### Issue: `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Update Node.js:**
   ```bash
   # Check current version
   node -v
   
   # Should be 18.x or higher
   # Download from https://nodejs.org/
   ```

4. **Try different package manager:**
   ```bash
   # Using yarn
   yarn install
   
   # Using pnpm
   pnpm install
   
   # Using bun
   bun install
   ```

---

### Issue: Module not found errors

**Symptoms:**
```
Error: Cannot find module 'framer-motion'
```

**Solutions:**

1. **Install missing dependencies:**
   ```bash
   npm install framer-motion lucide-react react-icons @octokit/rest
   ```

2. **Verify package.json:**
   - Check that all dependencies are listed
   - Ensure version numbers are correct

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Development Server Issues

### Issue: Port 3000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Use different port:**
   ```bash
   PORT=3001 npm run dev
   ```

2. **Kill process on port 3000:**
   
   **MacOS/Linux:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```
   
   **Windows:**
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

3. **Close other Next.js instances:**
   - Check terminal for other running dev servers
   - Close unnecessary terminal windows

---

### Issue: Changes not reflecting

**Symptoms:**
- Code changes don't appear in browser
- Old content still showing

**Solutions:**

1. **Hard refresh browser:**
   - **Chrome/Edge:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - **Firefox:** `Ctrl+F5` or `Cmd+Shift+R`
   - **Safari:** `Cmd+Option+R`

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Disable browser cache:**
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Disable cache"

4. **Check file watcher limits (Linux):**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

### Issue: Hot reload not working

**Symptoms:**
- Must manually refresh to see changes
- Server doesn't detect file changes

**Solutions:**

1. **Restart development server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Check file extensions:**
   - Ensure files have correct extensions (.tsx, .ts, .jsx, .js)
   - Check that files are in watched directories

3. **Update Next.js:**
   ```bash
   npm install next@latest
   ```

---

## GitHub API Issues

### Issue: Repositories not loading

**Symptoms:**
- Loading spinner stays forever
- Console error: "Failed to fetch repositories"
- Empty repository list

**Solutions:**

1. **Check environment variables:**
   ```bash
   # Verify .env.local exists
   cat .env.local
   
   # Should contain:
   GITHUB_TOKEN=ghp_...
   GITHUB_USERNAME=your_username
   ```

2. **Verify GitHub token:**
   - Go to https://github.com/settings/tokens
   - Check token hasn't expired
   - Verify token has correct permissions:
     - `public_repo`
     - `read:user`

3. **Test API manually:**
   ```bash
   # In new terminal while dev server running
   curl http://localhost:3000/api/github/repos
   ```

4. **Check browser console:**
   - Press F12 to open DevTools
   - Look for error messages in Console tab
   - Check Network tab for failed requests

5. **Verify username:**
   ```bash
   # Check if username exists
   curl https://api.github.com/users/YOUR_USERNAME
   ```

---

### Issue: GitHub API rate limit exceeded

**Symptoms:**
```json
{
  "error": "API rate limit exceeded"
}
```

**Solutions:**

1. **Use authenticated token:**
   - Unauthenticated: 60 requests/hour
   - Authenticated: 5,000 requests/hour

2. **Wait for reset:**
   - Check when limit resets: https://api.github.com/rate_limit
   - Usually resets after 1 hour

3. **Increase cache duration:**
   ```typescript
   // In app/api/github/repos/route.ts
   export const revalidate = 7200; // 2 hours instead of 1
   ```

4. **Use secondary token:**
   - Create additional GitHub account
   - Generate token for that account
   - Switch tokens in `.env.local`

---

### Issue: "Bad credentials" error

**Symptoms:**
```json
{
  "error": "Failed to fetch repositories",
  "message": "Bad credentials"
}
```

**Solutions:**

1. **Regenerate GitHub token:**
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens
   - Delete old token
   - Generate new token with correct permissions
   - Update `.env.local`

2. **Check token format:**
   - Should start with `ghp_`
   - No spaces or quotes around token
   - No extra characters

3. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## Build and Deployment Issues

### Issue: Build fails

**Symptoms:**
```
Error: Build failed
Type error: ...
```

**Solutions:**

1. **Check TypeScript errors:**
   ```bash
   npm run type-check
   ```

2. **Fix linting errors:**
   ```bash
   npm run lint
   npm run lint -- --fix
   ```

3. **Clean build:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

4. **Check environment variables:**
   - Ensure all required env vars are set
   - In production, set them in hosting platform

5. **Review error messages:**
   - Read full error output
   - Check file and line number mentioned
   - Look for common issues:
     - Missing imports
     - Type errors
     - Syntax errors

---

### Issue: Build succeeds but app crashes

**Symptoms:**
- Build completes successfully
- App crashes when accessed
- 500 Internal Server Error

**Solutions:**

1. **Check server logs:**
   ```bash
   npm run build
   npm run start
   # Check terminal for errors
   ```

2. **Verify environment variables:**
   ```bash
   # Production environment must have:
   GITHUB_TOKEN=...
   GITHUB_USERNAME=...
   ```

3. **Test locally:**
   ```bash
   # Build and run production build locally
   npm run build
   npm run start
   ```

4. **Check API routes:**
   - Test each API endpoint
   - Verify they return valid responses

---

### Issue: Images not loading in production

**Symptoms:**
- Images work locally but not in production
- 404 errors for images

**Solutions:**

1. **Check image paths:**
   ```tsx
   // Correct (relative to public folder)
   <img src="/images/profile.jpg" />
   
   // Incorrect
   <img src="./images/profile.jpg" />
   <img src="images/profile.jpg" />
   ```

2. **Use Next.js Image component:**
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src="/images/profile.jpg"
     width={500}
     height={500}
     alt="Profile"
   />
   ```

3. **Configure image domains:**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'avatars.githubusercontent.com',
         },
       ],
     },
   };
   ```

4. **Verify files exist:**
   - Check `public/` folder
   - Ensure images are committed to git
   - Verify deployment includes images

---

## Styling and UI Issues

### Issue: Tailwind styles not applied

**Symptoms:**
- No styling visible
- Plain HTML without CSS

**Solutions:**

1. **Check Tailwind configuration:**
   ```typescript
   // tailwind.config.ts
   content: [
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
     "./components/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   ```

2. **Verify globals.css import:**
   ```typescript
   // app/layout.tsx
   import './globals.css';
   ```

3. **Check globals.css has Tailwind directives:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Restart development server:**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### Issue: Dark mode not working

**Symptoms:**
- Dark mode toggle doesn't work
- Colors don't change

**Solutions:**

1. **Check CSS variables:**
   ```css
   /* app/globals.css */
   :root {
     --background: 255 255 255;
   }
   
   .dark {
     --background: 17 24 39;
   }
   ```

2. **Verify Tailwind dark mode config:**
   ```typescript
   // tailwind.config.ts
   module.exports = {
     darkMode: 'class', // or 'media'
   };
   ```

3. **Test manually:**
   - Open DevTools
   - Add `class="dark"` to `<html>` element
   - Check if colors change

---

### Issue: Responsive design broken

**Symptoms:**
- Mobile menu not working
- Layout breaks on mobile
- Content overflows

**Solutions:**

1. **Check viewport meta tag:**
   ```tsx
   // app/layout.tsx
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

2. **Test with DevTools:**
   - Press F12
   - Click device toolbar icon
   - Test different screen sizes

3. **Check responsive classes:**
   ```tsx
   // Correct
   <div className="text-sm md:text-base lg:text-lg">
   
   // May break on mobile
   <div className="w-[1200px]">
   ```

4. **Use container classes:**
   ```tsx
   <div className="container mx-auto px-4 md:px-6 lg:px-8">
   ```

---

## Performance Issues

### Issue: Slow page load

**Symptoms:**
- Pages take long to load
- Sluggish animations
- High bundle size

**Solutions:**

1. **Analyze bundle size:**
   ```bash
   npm run build
   # Check output for large bundles
   ```

2. **Optimize images:**
   - Use WebP format
   - Compress images (TinyPNG, Squoosh)
   - Use appropriate dimensions
   - Implement lazy loading

3. **Use dynamic imports:**
   ```tsx
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
   });
   ```

4. **Check network requests:**
   - Open DevTools Network tab
   - Look for slow or large requests
   - Optimize or cache heavy requests

5. **Enable compression:**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
   };
   ```

---

### Issue: High Lighthouse score but feels slow

**Symptoms:**
- Good Lighthouse metrics
- Feels sluggish in real use

**Solutions:**

1. **Optimize animations:**
   ```css
   /* Use transform and opacity for animations */
   .animate {
     transform: translateY(0);
     opacity: 1;
     will-change: transform, opacity;
   }
   ```

2. **Reduce animation duration:**
   ```typescript
   // tailwind.config.ts
   animation: {
     'fade-in': 'fadeIn 0.3s ease-in-out', // Faster
   }
   ```

3. **Optimize re-renders:**
   ```tsx
   import { memo } from 'react';
   
   export default memo(function Component() {
     // Component code
   });
   ```

---

## Browser and Compatibility Issues

### Issue: Works in Chrome but not Safari

**Solutions:**

1. **Check CSS compatibility:**
   - Test with `-webkit-` prefixes
   - Avoid cutting-edge CSS features
   - Use autoprefixer (included in Next.js)

2. **Test JavaScript features:**
   - Check for unsupported APIs
   - Add polyfills if needed

3. **Check console errors:**
   - Open Safari DevTools
   - Look for specific error messages

---

### Issue: Mobile browser issues

**Solutions:**

1. **Test on real devices:**
   - Use BrowserStack or similar
   - Test on actual iOS/Android devices

2. **Check touch events:**
   - Use both `onClick` and `onTouchStart`
   - Test touch interactions

3. **Fix viewport issues:**
   ```tsx
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
   ```

---

## Bahasa Indonesia

## Daftar Isi

1. [Masalah Instalasi](#masalah-instalasi)
2. [Masalah Development Server](#masalah-development-server)
3. [Masalah GitHub API](#masalah-github-api)
4. [Masalah Build dan Deployment](#masalah-build-dan-deployment)

---

## Masalah Instalasi

### Masalah: `npm install` gagal

**Gejala:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solusi:**

1. **Bersihkan npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Gunakan legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Update Node.js:**
   ```bash
   # Cek versi saat ini
   node -v
   
   # Harus 18.x atau lebih tinggi
   # Download dari https://nodejs.org/
   ```

---

## Masalah Development Server

### Masalah: Port 3000 sudah digunakan

**Solusi:**

1. **Gunakan port berbeda:**
   ```bash
   PORT=3001 npm run dev
   ```

2. **Matikan proses di port 3000:**
   ```bash
   # MacOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

---

### Masalah: Perubahan tidak terlihat

**Solusi:**

1. **Hard refresh browser:**
   - **Chrome:** `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
   - **Firefox:** `Ctrl+F5`
   - **Safari:** `Cmd+Option+R`

2. **Bersihkan cache Next.js:**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## Masalah GitHub API

### Masalah: Repository tidak muncul

**Solusi:**

1. **Cek environment variables:**
   ```bash
   cat .env.local
   
   # Harus berisi:
   GITHUB_TOKEN=ghp_...
   GITHUB_USERNAME=username_anda
   ```

2. **Verifikasi GitHub token:**
   - Buka https://github.com/settings/tokens
   - Pastikan token belum expired
   - Pastikan token punya permission:
     - `public_repo`
     - `read:user`

3. **Test API secara manual:**
   ```bash
   curl http://localhost:3000/api/github/repos
   ```

---

### Masalah: "Bad credentials" error

**Solusi:**

1. **Generate ulang GitHub token:**
   - Buka GitHub Settings → Developer Settings → Personal Access Tokens
   - Hapus token lama
   - Generate token baru
   - Update `.env.local`

2. **Restart development server:**
   ```bash
   npm run dev
   ```

---

## Masalah Build dan Deployment

### Masalah: Build gagal

**Solusi:**

1. **Cek TypeScript errors:**
   ```bash
   npm run type-check
   ```

2. **Fix linting errors:**
   ```bash
   npm run lint
   ```

3. **Clean build:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

---

### Masalah: Gambar tidak muncul di production

**Solusi:**

1. **Cek path gambar:**
   ```tsx
   // Benar
   <img src="/images/profile.jpg" />
   
   // Salah
   <img src="./images/profile.jpg" />
   ```

2. **Gunakan Next.js Image:**
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src="/images/profile.jpg"
     width={500}
     height={500}
     alt="Profile"
   />
   ```

---

## Bantuan Lebih Lanjut

Jika masalah masih berlanjut:

1. **Cek dokumentasi:**
   - [README.md](./README.md)
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)

2. **Cek browser console:**
   - Tekan F12
   - Lihat tab Console dan Network

3. **Buat issue di GitHub:**
   - Sertakan pesan error lengkap
   - Jelaskan langkah untuk reproduce
   - Sertakan screenshot jika perlu

4. **Search GitHub issues:**
   - Cek apakah ada yang punya masalah serupa
   - Lihat solusi yang sudah ada

---

**Masih butuh bantuan?** Buat issue di repository GitHub dengan detail masalah Anda.
