# Panduan Lengkap: Image Requirements untuk Portfolio Website

## 📋 Daftar Lengkap Gambar yang Dibutuhkan

### 1. Profile Photo
- **Path**: `public/images/profile.jpg`
- **Dimensi**: 400x400px (persegi)
- **Format**: JPEG atau PNG
- **Ukuran Max**: 500KB
- **Penggunaan**: Hero section, About section
- **Tips**: 
  - Gunakan foto dengan pencahayaan baik
  - Background sederhana/blur
  - Tampilan profesional tapi approachable
  - Hindari selfie, gunakan foto yang difoto orang lain

### 2. Open Graph Image
- **Path**: `public/images/og-image.png`
- **Dimensi**: 1200x630px (rasio 1.91:1)
- **Format**: PNG
- **Ukuran Max**: 1MB
- **Penggunaan**: Social media preview (Facebook, Twitter, LinkedIn)
- **Tips**:
  - Sertakan nama Anda
  - Tambahkan tagline/job title
  - Gunakan brand colors
  - Text harus readable di ukuran kecil
  - Test di Facebook Sharing Debugger

### 3. Project Screenshots
- **Path**: `public/images/projects/`
- **Naming**: `project-name.png` atau `project-name.jpg`
- **Dimensi**: 1920x1080px (16:9 ratio) atau 1440x900px
- **Format**: PNG (untuk UI) atau JPG (untuk photos)
- **Ukuran Max**: 500KB per image
- **Jumlah**: Minimal 3-6 project screenshots
- **Tips**:
  - Capture di desktop resolution tinggi
  - Zoom browser ke 100%
  - Hide browser chrome atau gunakan mockup
  - Crop untuk fokus pada main features
  - Blur atau hide sensitive data
  - Pertimbangkan gunakan Screely atau Mockuphone untuk mockup

### 4. Testimonial Avatars
- **Path**: `public/images/testimonials/`
- **Naming**: `john-doe.jpg` (lowercase, dash-separated)
- **Dimensi**: 200x200px (persegi)
- **Format**: JPEG atau PNG
- **Ukuran Max**: 100KB per image
- **Jumlah**: Sesuai jumlah testimonials
- **Tips**:
  - Minta izin sebelum gunakan foto orang lain
  - Crop ke square aspect ratio
  - UI akan render sebagai circle
  - Alternatif: gunakan UI Avatars atau DiceBear

### 5. Tech Stack Logos
- **Path**: `public/images/logos/`
- **Naming**: `react.svg`, `nextjs.svg`, `typescript.svg`, etc.
- **Dimensi**: Vector (SVG) atau 128x128px / 256x256px (PNG)
- **Format**: SVG (preferred) atau PNG
- **Ukuran Max**: 50KB per logo
- **Jumlah**: Sesuai tech stack yang digunakan (biasanya 8-15 logos)
- **Sumber**: Simple Icons, DevIcon, atau official websites
- **Tips**:
  - Gunakan official logos
  - Konsisten style (semua monochrome atau semua colored)
  - SVG lebih baik untuk scalability
  - Transparent background untuk PNG

### 6. Resume/CV PDF
- **Path**: `public/resume.pdf`
- **Format**: PDF
- **Ukuran Max**: 2MB
- **Tips**:
  - Maksimal 2 halaman
  - Professional formatting
  - Embed fonts
  - Test bisa dibuka di berbagai PDF readers

### 7. Favicon Set (Optional)
- **Path**: `public/favicon.ico`, `public/favicon-32x32.png`, dll
- **Tools**: Use Favicon Generator (https://realfavicongenerator.net/)
- **Formats**: ICO, PNG (multiple sizes), SVG
- **Tips**: Generate dari logo atau initial

---

## 🛠️ Tools & Resources

### Image Optimization Tools
1. **TinyPNG** - https://tinypng.com/
   - PNG & JPEG compression
   - Batch upload support
   
2. **Squoosh** - https://squoosh.app/
   - Google's image optimizer
   - Format conversion
   
3. **ImageOptim (Mac)** - https://imageoptim.com/
   - Desktop app untuk batch optimization
   
4. **SVGOMG** - https://jakearchibald.github.io/svgomg/
   - SVG optimization

### Screenshot & Mockup Tools
1. **Screely** - https://screely.com/
   - Instant browser mockup
   
2. **Mockuphone** - https://mockuphone.com/
   - Device mockups
   
3. **Cleanshot X (Mac)** - https://cleanshot.com/
   - Professional screenshot tool
   
4. **Screenshot.rocks** - https://screenshot.rocks/
   - Beautiful browser mockups

### Icon & Logo Resources
1. **Simple Icons** - https://simpleicons.org/
   - SVG icons untuk brand logos
   - Free & open source
   
2. **DevIcon** - https://devicon.dev/
   - Programming language icons
   
3. **Lucide Icons** - https://lucide.dev/
   - Beautiful open-source icons
   
4. **Heroicons** - https://heroicons.com/
   - By Tailwind CSS team

### Avatar Generators (Fallback)
1. **UI Avatars** - https://ui-avatars.com/
   - Generate avatars from initials
   
2. **DiceBear** - https://dicebear.com/
   - Diverse avatar styles

### Design Tools
1. **Canva** - https://canva.com/
   - OG image, resume design
   
2. **Figma** - https://figma.com/
   - Professional design tool

---

## 📐 Spesifikasi Format Detail

### JPEG vs PNG vs SVG
- **JPEG**: Untuk photos (profile, backgrounds)
  - Smaller file size
  - Lossy compression
  - No transparency
  
- **PNG**: Untuk graphics, logos (jika bukan SVG), UI screenshots
  - Lossless compression
  - Transparency support
  - Larger file size
  
- **SVG**: Untuk icons dan logos
  - Vector format (scalable)
  - Smallest file size
  - Perfect di semua screen sizes

### Responsive Images Best Practices
```jsx
// Next.js Image Component
import Image from 'next/image'

// Untuk static images
<Image 
  src="/images/profile.jpg"
  alt="Profile photo"
  width={400}
  height={400}
  priority // untuk above-the-fold images
  quality={85} // 75-90 recommended
/>

// Untuk dynamic images
<Image 
  src={project.image}
  alt={project.title}
  width={1920}
  height={1080}
  loading="lazy" // default behavior
/>
```

---

## ✅ Checklist Sebelum Launch

### Images
- [ ] Profile photo added dan optimized
- [ ] OG image created dan tested (Facebook Debugger)
- [ ] Minimal 3 project screenshots added
- [ ] All project images optimized (<500KB each)
- [ ] Testimonial avatars added (if applicable)
- [ ] Tech stack logos collected (SVG preferred)
- [ ] Resume PDF uploaded dan tested
- [ ] All images memiliki proper alt text
- [ ] Favicon set generated dan added

### Optimization
- [ ] Semua images di-compress dengan TinyPNG/Squoosh
- [ ] SVG files di-optimize dengan SVGOMG
- [ ] Images menggunakan Next.js Image component
- [ ] Priority attribute diset untuk hero images
- [ ] Lazy loading diaktifkan untuk below-fold images

### Testing
- [ ] Images load dengan baik di desktop
- [ ] Images load dengan baik di mobile
- [ ] OG image muncul dengan benar di social media
- [ ] Resume PDF bisa didownload
- [ ] Lighthouse performance score checked
- [ ] Images tidak block page rendering

---

## 📱 Responsive Considerations

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Image Sizes per Breakpoint
Pertimbangkan untuk serve different image sizes:
```jsx
<Image 
  src="/images/project.jpg"
  alt="Project"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  width={1920}
  height={1080}
/>
```

---

## 🚀 Performance Tips

1. **Compress semua images** sebelum upload
2. **Gunakan WebP format** jika browser support (Next.js handles otomatis)
3. **Lazy load** images yang below the fold
4. **Priority load** hero images
5. **Use placeholder** blur untuk better UX
6. **Optimize SVG** untuk remove unnecessary metadata
7. **CDN** untuk serve images jika traffic tinggi
8. **Monitor** image load performance dengan Lighthouse

---

## 📞 Troubleshooting

### Image tidak muncul
- Check file path benar (case-sensitive)
- Check file extension sesuai
- Check Next.js public folder structure
- Check browser console untuk errors

### Image terlalu besar/lambat
- Compress dengan tools yang disebutkan
- Check file size < maximum recommended
- Use Next.js Image optimization
- Consider WebP format

### OG image tidak muncul di social media
- Test dengan Facebook Sharing Debugger
- Check file path accessible publicly
- Verify meta tags di head
- Clear social media cache

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- Check Next.js Image documentation
- Gunakan tools yang tercantum di guide ini
- Test dengan Lighthouse untuk performance insights

Good luck dengan portfolio website Anda! 🚀
