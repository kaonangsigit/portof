# 📝 Panduan Kustomisasi Portfolio

Panduan lengkap untuk menyesuaikan portfolio Anda menggunakan file konfigurasi data terpusat.

## 📂 File Utama

**`lib/data.ts`** - File konfigurasi utama yang berisi semua data portfolio Anda.

Semua komponen portfolio menggunakan data dari file ini, sehingga Anda hanya perlu mengubah satu file untuk memperbarui seluruh website.

---

## 🚀 Langkah Cepat

1. Buka file `lib/data.ts`
2. Cari bagian yang ingin Anda ubah (lihat panduan di bawah)
3. Ganti dengan informasi pribadi Anda
4. Simpan file - perubahan akan otomatis terlihat!

---

## 📋 Daftar Isi

- [Informasi Pribadi](#-informasi-pribadi)
- [Social Media & Kontak](#-social-media--kontak)
- [Skills & Teknologi](#-skills--teknologi)
- [About Features](#-about-features)
- [Pengalaman Kerja](#-pengalaman-kerja)
- [Pendidikan](#-pendidikan)
- [Sertifikasi](#-sertifikasi)
- [Metadata SEO](#-metadata-seo)
- [Featured Projects](#-featured-projects)
- [Konten Teks](#-konten-teks)
- [Konfigurasi GitHub](#-konfigurasi-github)

---

## 👤 Informasi Pribadi

**Lokasi dalam file:** `personalInfo`

```typescript
export const personalInfo: PersonalInfo = {
  name: 'Kao Nangprakoso',           // ✏️ Ganti dengan nama Anda
  title: 'Full Stack Developer',     // ✏️ Jabatan profesional Anda
  tagline: 'I build exceptional...',  // ✏️ Tagline singkat di hero section
  bio: [                              // ✏️ Array berisi paragraf bio Anda
    "Paragraf pertama tentang Anda...",
    "Paragraf kedua...",
    "Paragraf ketiga..."
  ],
  profileImage: '/profile.jpg',       // ✏️ Path ke foto profil (di folder /public)
  yearsExperience: 5,                 // ✏️ Pengalaman dalam tahun
  projectsCompleted: 50,              // ✏️ Jumlah project selesai
  availability: {
    status: 'available',              // ✏️ 'available' | 'busy' | 'unavailable'
    message: 'Currently available...' // ✏️ Pesan ketersediaan
  }
};
```

### Cara Mengubah Foto Profil:
1. Letakkan foto Anda di folder `public/` (contoh: `public/profile.jpg`)
2. Update `profileImage: '/profile.jpg'` sesuai nama file Anda

---

## 🔗 Social Media & Kontak

**Lokasi dalam file:** `socialLinks` dan `contactSocialLinks`

```typescript
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/kaonangprakoso', // ✏️ URL GitHub Anda
    username: '@kaonangprakoso',                // ✏️ Username GitHub
    color: 'hover:text-gray-300',
  },
  // Tambahkan lebih banyak social media...
];
```

### Menambah Social Media Baru:

```typescript
import { Twitter } from 'lucide-react'; // Import icon

// Tambahkan ke array socialLinks:
{
  name: 'Twitter',
  icon: Twitter,
  href: 'https://twitter.com/yourhandle',
  username: '@yourhandle',
  color: 'hover:text-blue-400',
}
```

### Menghapus Social Media:
Hapus objek social media yang tidak ingin ditampilkan dari array.

---

## 💻 Skills & Teknologi

**Lokasi dalam file:** `skillCategories`

```typescript
export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',              // ✏️ Nama kategori
    skills: [
      { 
        name: 'React',              // ✏️ Nama teknologi
        icon: SiReact,              // Icon dari react-icons/si
        color: 'text-cyan-400'      // ✏️ Warna Tailwind CSS
      },
      // Skill lainnya...
    ],
  },
  // Kategori lainnya...
];
```

### Menambah Skill Baru:

1. Import icon dari `react-icons/si`:
```typescript
import { SiVuedotjs } from 'react-icons/si';
```

2. Tambahkan ke kategori yang sesuai:
```typescript
{ name: 'Vue.js', icon: SiVuedotjs, color: 'text-green-500' }
```

### Menambah Kategori Baru:

```typescript
{
  title: 'Mobile Development',
  skills: [
    { name: 'React Native', icon: SiReact, color: 'text-cyan-400' },
    { name: 'Flutter', icon: SiFlutter, color: 'text-blue-400' },
  ],
}
```

### Mencari Icon:
- Kunjungi: https://react-icons.github.io/react-icons/
- Cari "Simple Icons" untuk icon teknologi
- Copy nama import (contoh: `SiReact`)

---

## ⭐ About Features

**Lokasi dalam file:** `aboutFeatures`

Fitur/karakteristik yang ditampilkan di About section.

```typescript
export const aboutFeatures: AboutFeature[] = [
  {
    icon: Code,                           // Icon dari lucide-react
    title: 'Clean Code',                  // ✏️ Judul fitur
    description: 'Writing maintainable...' // ✏️ Deskripsi
  },
  // Fitur lainnya...
];
```

### Icon tersedia dari Lucide:
- `Code`, `Rocket`, `Users`, `Zap`, `Award`, `Target`, `Lightbulb`, dll.
- Lihat: https://lucide.dev/icons/

---

## 💼 Pengalaman Kerja

**Lokasi dalam file:** `workExperience`

```typescript
export const workExperience: WorkExperience[] = [
  {
    company: 'Tech Company Inc.',         // ✏️ Nama perusahaan
    position: 'Senior Full Stack Developer', // ✏️ Posisi
    period: '2022 - Present',             // ✏️ Periode bekerja
    location: 'Jakarta, Indonesia',       // ✏️ Lokasi
    description: 'Leading development...', // ✏️ Deskripsi pekerjaan
    technologies: ['React', 'Node.js'],   // ✏️ Teknologi yang digunakan
    achievements: [                       // ✏️ (Opsional) Pencapaian
      'Improved performance by 40%',
      'Led a team of 5 developers',
    ],
  },
  // Pengalaman lainnya...
];
```

---

## 🎓 Pendidikan

**Lokasi dalam file:** `education`

```typescript
export const education: Education[] = [
  {
    institution: 'University of Technology', // ✏️ Nama universitas
    degree: 'Bachelor of Science',           // ✏️ Gelar
    field: 'Computer Science',               // ✏️ Jurusan
    period: '2015 - 2019',                   // ✏️ Periode
    location: 'Jakarta, Indonesia',          // ✏️ Lokasi
    gpa: '3.8/4.0',                          // ✏️ (Opsional) IPK
    achievements: [                          // ✏️ (Opsional) Prestasi
      'Dean\'s List for 6 semesters',
    ],
  },
];
```

---

## 🏆 Sertifikasi

**Lokasi dalam file:** `certifications`

```typescript
export const certifications: Certification[] = [
  {
    name: 'AWS Certified Solutions Architect', // ✏️ Nama sertifikat
    issuer: 'Amazon Web Services',             // ✏️ Penerbit
    date: 'June 2023',                         // ✏️ Tanggal
    credentialId: 'AWS-12345',                 // ✏️ (Opsional) ID
    credentialUrl: 'https://...',              // ✏️ (Opsional) URL verifikasi
  },
];
```

---

## 🔍 Metadata SEO

**Lokasi dalam file:** `siteMetadata`

Penting untuk SEO dan social media sharing!

```typescript
export const siteMetadata: SiteMetadata = {
  title: 'Kao Nangprakoso | Full Stack Developer',  // ✏️ Judul website
  description: 'Full Stack Developer...',            // ✏️ Deskripsi
  keywords: [                                        // ✏️ Kata kunci SEO
    'developer',
    'portfolio',
    'web development',
  ],
  author: 'Kao Nangprakoso',                        // ✏️ Nama author
  siteUrl: 'https://yourwebsite.com',               // ✏️ URL website Anda
  locale: 'en_US',                                  // Locale (en_US, id_ID)
  ogImage: '/og-image.jpg',                         // ✏️ Gambar untuk sharing
};
```

### Membuat OG Image:
1. Buat gambar 1200x630px dengan desain menarik
2. Simpan di `public/og-image.jpg`
3. Gambar ini akan muncul saat link dibagikan di social media

---

## 🚀 Featured Projects

**Lokasi dalam file:** `featuredProjects`

Projects manual sebagai fallback jika GitHub API gagal.

```typescript
export const featuredProjects: FeaturedProject[] = [
  {
    name: 'E-Commerce Platform',          // ✏️ Nama project
    description: 'Full-featured...',      // ✏️ Deskripsi
    technologies: ['Next.js', 'Stripe'],  // ✏️ Teknologi
    githubUrl: 'https://github.com/...',  // ✏️ (Opsional) URL GitHub
    liveUrl: 'https://demo.com',          // ✏️ (Opsional) URL Live Demo
    imageUrl: '/projects/ecommerce.jpg',  // ✏️ (Opsional) Screenshot
  },
];
```

---

## 📝 Konten Teks

**Lokasi dalam file:** `content`

Semua teks label dan tombol di website.

```typescript
export const content = {
  hero: {
    greeting: 'Hi, my name is',           // ✏️ Greeting text
    cta: {
      primary: 'View My Work',            // ✏️ Tombol utama
      secondary: 'Get In Touch',          // ✏️ Tombol sekunder
    },
  },
  contact: {
    form: {
      nameLabel: 'Name',                  // ✏️ Label form
      namePlaceholder: 'Your name',       // ✏️ Placeholder
      // dst...
    },
  },
  // Bagian lainnya...
};
```

**Tip:** Ubah bagian ini untuk membuat website dalam bahasa Indonesia!

---

## 🔧 Konfigurasi GitHub

**Lokasi dalam file:** `githubConfig`

```typescript
export const githubConfig = {
  username: 'kaonangprakoso',           // ✏️ Username GitHub Anda
  maxRepos: 6,                          // ✏️ Maks repo yang ditampilkan
  excludeRepos: ['username'],           // ✏️ Repo yang tidak ditampilkan
  sortBy: 'updated',                    // 'updated' | 'stars' | 'created'
};
```

---

## 🎨 Tips Kustomisasi

### 1. Warna Tema
Warna utama (biru) dapat diubah di `tailwind.config.ts`:
```typescript
colors: {
  primary: colors.blue,  // ✏️ Ganti dengan warna lain
}
```

### 2. Font
Font dapat diubah di `app/layout.tsx`:
```typescript
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"],
});
```

### 3. Animasi
Semua animasi menggunakan Framer Motion. Anda dapat menyesuaikannya di masing-masing komponen.

---

## ✅ Checklist Kustomisasi

Gunakan checklist ini untuk memastikan Anda telah mengubah semua data:

- [ ] Nama dan title di `personalInfo`
- [ ] Bio dan tagline
- [ ] Foto profil di `/public/profile.jpg`
- [ ] Pengalaman dan jumlah project
- [ ] Link GitHub di `socialLinks`
- [ ] Link LinkedIn
- [ ] Email
- [ ] Social media lainnya
- [ ] Skills dan kategori skills
- [ ] Pengalaman kerja
- [ ] Pendidikan
- [ ] Sertifikasi
- [ ] Metadata SEO (title, description, keywords)
- [ ] Site URL
- [ ] OG Image untuk social sharing
- [ ] Featured projects
- [ ] Username GitHub di `githubConfig`

---

## 🐛 Troubleshooting

### Foto profil tidak muncul?
- Pastikan file ada di folder `public/`
- Nama file harus sama dengan `profileImage` di `data.ts`
- Format yang didukung: JPG, PNG, WebP

### Icon tidak muncul?
- Pastikan sudah import icon dari `lucide-react` atau `react-icons`
- Untuk icon teknologi, gunakan `react-icons/si`
- Untuk icon UI, gunakan `lucide-react`

### Perubahan tidak terlihat?
- Simpan file `lib/data.ts`
- Refresh browser (Cmd/Ctrl + Shift + R)
- Restart development server jika perlu

### Error TypeScript?
- Pastikan struktur data sesuai dengan tipe yang sudah didefinisikan
- Perhatikan field yang required vs optional (bertanda `?`)

---

## 📚 Resources

- **Lucide Icons**: https://lucide.dev/icons/
- **React Icons**: https://react-icons.github.io/react-icons/
- **Tailwind CSS Colors**: https://tailwindcss.com/docs/customizing-colors
- **Google Fonts**: https://fonts.google.com/

---

## 💡 Tips Tambahan

1. **Backup**: Selalu backup `lib/data.ts` sebelum membuat perubahan besar
2. **Konsistensi**: Gunakan format yang sama untuk semua entries (misal: format tanggal)
3. **SEO**: Isi semua metadata dengan lengkap untuk SEO yang optimal
4. **Gambar**: Kompres gambar untuk performa website yang lebih baik
5. **Testing**: Test di berbagai browser dan device setelah mengubah data

---

## 📞 Butuh Bantuan?

Jika Anda mengalami kesulitan, cek:
- `README.md` - Dokumentasi umum
- `DEVELOPMENT.md` - Panduan development
- `TROUBLESHOOTING.md` - Solusi masalah umum

Selamat mengkustomisasi portfolio Anda! 🎉
