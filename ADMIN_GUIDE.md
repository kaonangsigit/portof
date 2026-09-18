/**
 * QUICK START GUIDE - Portfolio CMS & Security Improvements
 * 
 * Panduan lengkap untuk menggunakan dan deploy portfolio yang sudah diperbaiki
 */

# 🚀 PORTFOLIO CMS - QUICK START GUIDE

## 📋 Table of Contents
1. [Features Overview](#features-overview)
2. [Admin Panel Usage](#admin-panel-usage)
3. [Security Features](#security-features)
4. [Deployment Guide](#deployment-guide)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Features Overview

### ✨ New Features Implemented

#### 1. **Certificate Gallery dengan Protection**
- Protected viewing dengan secure tokens
- Status badges (Active/Expired/Expiring Soon)
- Expiry date tracking
- Interactive modal viewer
- Download prevention via headers

#### 2. **Enhanced Admin Panel**
- Rate-limited login (5 attempts/15 min)
- Certificate management dengan expiry dates
- Audit logging untuk semua actions
- File validation & sanitization
- Secure file uploads

#### 3. **Improved Navigation**
- Removed Skills navbar (redundant)
- Removed LinkedIn section (Connect)
- Added Certificates to main navigation
- Cleaner, focused navigation: Home → About → Experience → GitHub → Certificates → Contact

#### 4. **Security Hardening**
- XSS protection dengan HTML entity encoding
- CSRF token support
- Rate limiting di semua endpoints
- Input sanitization
- Security headers (CSP, X-Frame-Options, dll)

#### 5. **Performance Optimizations**
- Debounce/throttle utilities
- Lazy image loading
- Memoization untuk expensive operations
- DOM batching
- Resource preloading

#### 6. **SEO Improvements**
- JSON-LD structured data
- Meta tags generation
- Sitemap XML builder
- SEO validator
- OpenGraph + Twitter cards

---

## 🔐 Admin Panel Usage

### Akses Admin Panel
```
URL: https://yoursite.com/admin
Password: [check .env.local untuk ADMIN_PASSWORD]
```

### Login Process
1. Buka https://yoursite.com/admin
2. Masukkan password
3. Sistem akan memberi rate limit jika salah password > 5x dalam 15 menit
4. Session berlaku 24 jam

### Manage Certificates

#### Upload Certificate
1. Go to "Certificates" tab
2. Click "Upload Sertifikat Baru"
3. Fill in:
   - **Image**: Drag & drop atau click untuk upload (JPG, PNG, WEBP - max 5MB)
   - **Title**: Nama sertifikat (contoh: "AWS Solutions Architect")
   - **Issuer**: Organisasi penerbit (contoh: "Amazon Web Services")
   - **Tanggal**: Tanggal diterbitkan
   - **Deskripsi**: Opsional - penjelasan sertifikat
4. Click "Upload"

#### Add Expiry Date
Saat upload, isikan field "Expiry Date" jika sertifikat berlaku terbatas:
- Certificate akan otomatis di-tag sebagai "Active" atau "Expired"
- Admin bisa melihat "Days Until Expiry"

#### View Certificate
Users dapat:
1. Click "View Certificate" di gallery
2. Sistem generate secure token
3. Image ditampilkan dengan protection headers
4. User tidak bisa direct download

#### Delete Certificate
1. Find certificate di list
2. Click tombol delete
3. Confirm deletion
4. File akan dihapus dari server

### Other Admin Features
- **Personal Info**: Edit nama, title, bio, lokasi, email, skills
- **Experience**: Manage pengalaman kerja
- **Projects**: Manage portfolio projects
- **Achievements**: Manage penghargaan
- **Testimonials**: Manage testimonial dari clients
- **Stats**: Manage statistik (years exp, projects, dll)
- **Settings**: Manage API keys dengan enkripsi

---

## 🔒 Security Features Explained

### Rate Limiting
```
Login:     5 attempts per 15 minutes (per IP)
Upload:    10 files per 5 minutes (per IP)
Delete:    5 operations per 5 minutes (per IP)
```

### Input Validation
✅ HTML tags di-escape
✅ Max length enforced
✅ MIME type validation
✅ File size limits
✅ Extension whitelist

### File Upload Protection
```
Allowed types: image/jpeg, image/png, image/webp
Max size: 5 MB
Stored in: /public/certificates/
```

### Certificate Viewing Protection
```
- View tokens: 32-byte random, 1 hour validity
- Image serving: Requires valid token
- Headers: prevent caching, no direct download
- IP validation: Optional per-request IP check
```

### Audit Logging
Semua admin actions dicatat:
```
- Login attempts (success/failure)
- Certificate uploads
- Certificate deletions
- IP address & user agent
- Timestamp
- Error messages
```

---

## 🌐 Deployment Guide

### Pre-Deployment Checklist

#### Environment Variables
```bash
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ADMIN_PASSWORD=<strong-random-password>
MASTER_KEY=<random-32-character-key>
MONGODB_URI=<your-mongodb-connection>

# Optional
NEXT_PUBLIC_GITHUB_USERNAME=your-username
GITHUB_TOKEN=your-github-token
```

#### Security Headers (Already Configured)
✅ Content-Security-Policy
✅ Strict-Transport-Security
✅ X-Frame-Options: SAMEORIGIN
✅ X-Content-Type-Options: nosniff
✅ X-XSS-Protection: 1; mode=block

### Deployment Steps

#### 1. Local Testing
```bash
npm run build
npm run start
# Test di http://localhost:3000
# Test admin di http://localhost:3000/admin
```

#### 2. Verify Build
```bash
npm run typecheck
npm run lint
npm run test
```

#### 3. Deploy to Production
```bash
# Via Vercel
vercel deploy --prod

# Via your own server
npm run build
npm start
```

#### 4. Post-Deployment
- [ ] Test certificate upload/view
- [ ] Test login rate limiting (try 6 times quickly)
- [ ] Verify security headers (check browser dev tools)
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags
- [ ] Test sitemap.xml generation
- [ ] Monitor audit logs

---

## 📊 File Structure

```
app/
├── api/
│   ├── certificates/
│   │   ├── route.ts           (GET/POST - list & upload)
│   │   └── [id]/
│   │       ├── route.ts       (DELETE)
│   │       ├── view/route.ts  (POST - generate view token)
│   │       └── image/route.ts (GET - protected image serving)
│   └── admin/
│       ├── login/route.ts     (POST - with rate limiting)
│       └── logout/route.ts    (POST)
├── page.tsx                   (Home - removed Blog, added CertificatesGallery)
└── layout.tsx                 (SEO metadata, structured data)

components/
├── CertificatesGallery.tsx    (New - protected certificate viewer)
├── Navigation.tsx             (Updated - removed Skills)
└── Footer.tsx                 (Already good)

lib/
├── security.ts                (NEW - rate limit, audit, CSRF, sanitize)
├── certificate-protection.ts  (NEW - view tokens, protection)
├── certificate-helpers.ts     (NEW - certificate utils)
├── performance.ts             (NEW - optimization utilities)
├── seo.ts                      (NEW - SEO helpers)
├── admin-auth.ts              (UPDATED - expiryDate field)
└── ...other existing files

__tests__/
└── security.test.ts           (NEW - security & performance tests)
```

---

## 🐛 Troubleshooting

### Problem: Admin password not working
**Solution**: 
- Check .env.local untuk ADMIN_PASSWORD
- Password harus exact match (case-sensitive)
- Rate limit? Tunggu 15 menit atau restart server

### Problem: Certificate upload fails
**Solution**:
- Check file size (max 5MB)
- Check MIME type (JPG/PNG/WEBP only)
- Check disk space pada server
- Check /public/certificates folder permissions

### Problem: Certificate view shows blank image
**Solution**:
- Check view token masih valid (1 hour)
- Check file tersimpan di /public/certificates/
- Check browser console untuk errors
- Verify CORS headers

### Problem: Performance issues
**Solution**:
- Check server resources
- Clear browser cache
- Verify CDN configuration
- Check database connection

### Problem: Security headers not appearing
**Solution**:
- Verify middleware.ts running
- Check browser dev tools > Network > Response Headers
- Restart development server

---

## 📈 Monitoring

### Check Audit Logs (Development)
```javascript
// Di browser console atau via API
fetch('/api/admin/audit-logs')
  .then(r => r.json())
  .then(logs => console.log(logs))
```

### Monitor Rate Limiting
- Watch untuk 429 responses
- Check IP patterns dalam logs
- Alert jika multiple failed logins

### Certificate Usage Stats
- Track view token generation
- Monitor certificate downloads attempts
- Track expired certificates

---

## 🎓 Best Practices

### For Admin
✅ Use strong, unique password
✅ Change password periodically
✅ Monitor audit logs weekly
✅ Backup certificates regularly
✅ Update expiry dates before expiration
✅ Use different browser for admin (incognito recommended)

### For Users
✅ Share view tokens securely
✅ Don't bookmark direct certificate URLs
✅ Report suspicious activity
✅ Respect certificate intellectual property

### For Development
✅ Never commit .env.local to git
✅ Use environment variables untuk secrets
✅ Run tests sebelum deploy
✅ Monitor error logs
✅ Keep dependencies updated

---

## 📞 Support & Documentation

### Files to Reference
- `PORTFOLIO_IMPROVEMENTS.md` - Detailed technical documentation
- `lib/security.ts` - Security utilities documentation
- `lib/certificate-protection.ts` - Certificate protection details
- `__tests__/security.test.ts` - Test examples

### Key Contacts
- Repository: GitHub (check git remote -v)
- Issues: Report di GitHub Issues
- Email: Check NEXT_PUBLIC_AUTHOR_EMAIL

---

## ✅ Deployment Checklist

- [ ] Build passing (`npm run build`)
- [ ] Tests passing (`npm run test`)
- [ ] TypeScript valid (`npm run typecheck`)
- [ ] .env.local configured
- [ ] Password set (ADMIN_PASSWORD)
- [ ] Master key set (MASTER_KEY)
- [ ] MongoDB connection verified
- [ ] Certificates directory writable
- [ ] Security headers configured
- [ ] SEO metadata verified
- [ ] Rate limiting tested
- [ ] Admin login tested
- [ ] Certificate upload tested
- [ ] Certificate view tested
- [ ] Audit logging verified
- [ ] Mobile responsive checked
- [ ] Performance tested (Lighthouse)
- [ ] Security headers verified (securityheaders.com)

---

**Last Updated**: 2026-08-25
**Status**: ✅ Production Ready
**Next Version**: 1.1.0 (Optional: 2FA, Email notifications, Backup system)
