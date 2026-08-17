# 🎨 Customization Guide

Complete guide to customizing your portfolio website.

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

## Table of Contents

1. [Personal Information](#personal-information)
2. [Colors and Theme](#colors-and-theme)
3. [Typography](#typography)
4. [Components](#components)
5. [Content](#content)
6. [Images and Assets](#images-and-assets)
7. [Animations](#animations)
8. [SEO and Metadata](#seo-and-metadata)

---

## Personal Information

### Site Configuration

Edit `config/site.ts`:

```typescript
export const siteConfig = {
  name: "Your Name",
  description: "Full-stack developer portfolio showcasing projects and skills",
  url: "https://yourdomain.com",
  ogImage: "https://yourdomain.com/og.jpg",
  links: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    email: "mailto:your.email@example.com",
  },
  creator: {
    name: "Your Name",
    email: "your.email@example.com",
  },
};
```

### Environment Variables

Edit `.env.local`:

```env
# GitHub Integration
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username

# Site Information
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_AUTHOR_NAME="Your Full Name"
NEXT_PUBLIC_AUTHOR_EMAIL="your.email@example.com"
NEXT_PUBLIC_AUTHOR_LOCATION="Your City, Country"

# Social Media
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourusername
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourusername
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourusername
```

---

## Colors and Theme

### Primary Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      // Custom primary color
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main primary
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      // Add your custom colors
      accent: {
        light: '#f0f9ff',
        DEFAULT: '#0ea5e9',
        dark: '#0369a1',
      },
    },
  },
}
```

### Global CSS Variables

Edit `app/globals.css`:

```css
:root {
  /* Light mode */
  --background: 255 255 255;
  --foreground: 17 24 39;
  --primary: 59 130 246;
  --secondary: 156 163 175;
  --accent: 14 165 233;
}

.dark {
  /* Dark mode */
  --background: 17 24 39;
  --foreground: 243 244 246;
  --primary: 96 165 250;
  --secondary: 107 114 128;
  --accent: 56 189 248;
}
```

### Gradient Backgrounds

Add custom gradients to `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  },
}
```

Usage in components:
```tsx
<div className="bg-gradient-primary">
  {/* Your content */}
</div>
```

---

## Typography

### Font Family

Edit `app/layout.tsx`:

```typescript
import { Inter, Poppins, Roboto } from 'next/font/google';

// Choose your font
const font = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

// Or use multiple fonts
const heading = Poppins({ 
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
});

const body = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
});
```

Update `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      body: ['var(--font-body)', 'system-ui', 'sans-serif'],
    },
  },
}
```

### Font Sizes

Customize font sizes in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    fontSize: {
      'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      'display': ['3rem', { lineHeight: '1.2' }],
      'title': ['2rem', { lineHeight: '1.3' }],
    },
  },
}
```

---

## Components

### Hero Section

Edit `components/Hero.tsx`:

```tsx
export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Hi, I'm Your Name
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
          Full Stack Developer & UI/UX Designer
        </p>
        <p className="text-lg max-w-2xl mb-8">
          I build beautiful, functional web applications 
          that solve real-world problems.
        </p>
        {/* Add your custom CTAs */}
      </div>
    </section>
  );
}
```

### About Section

Edit `components/About.tsx`:

```tsx
export default function About() {
  const features = [
    {
      icon: "💻",
      title: "Full Stack Development",
      description: "Building scalable web applications with modern technologies",
    },
    {
      icon: "🎨",
      title: "UI/UX Design",
      description: "Creating beautiful and intuitive user interfaces",
    },
    // Add more features
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">About Me</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Your biography here. Tell your story, background, and what you do.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Skills Section

Edit `components/Skills.tsx`:

```tsx
const skills = {
  Frontend: [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    // Add your skills
  ],
  Backend: [
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    // Add your skills
  ],
  Tools: [
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    // Add your skills
  ],
};
```

### Contact Section

Edit `components/Contact.tsx`:

```tsx
const socialLinks = [
  {
    name: "Email",
    url: "mailto:your.email@example.com",
    icon: Mail,
    color: "text-red-500",
  },
  {
    name: "GitHub",
    url: "https://github.com/yourusername",
    icon: Github,
    color: "text-gray-900 dark:text-white",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/yourusername",
    icon: Linkedin,
    color: "text-blue-600",
  },
  // Add more social links
];
```

---

## Content

### Adding Blog Posts (Future)

Create MDX files in `content/blog/`:

```mdx
---
title: "My First Blog Post"
date: "2026-07-19"
description: "This is my first blog post"
tags: ["nextjs", "typescript", "web-dev"]
author: "Your Name"
image: "/images/blog/post-1.jpg"
---

# Your Blog Post Title

Your content here in Markdown format.

## Subheading

More content...
```

### Adding Projects Manually

Create a projects data file `lib/projects.ts`:

```typescript
export const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce platform with payment integration",
    image: "/images/projects/ecommerce.jpg",
    tech: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
    github: "https://github.com/yourusername/ecommerce",
    demo: "https://ecommerce-demo.com",
    featured: true,
  },
  // Add more projects
];
```

---

## Images and Assets

### Profile Photo

Replace `public/profile.jpg` with your photo:
- Recommended size: 500x500px or larger
- Format: JPG, PNG, or WebP
- Keep file size under 500KB

### Project Images

Add project screenshots to `public/images/projects/`:
- Recommended size: 1200x630px (Open Graph ratio)
- Use descriptive filenames: `project-name.jpg`
- Optimize images before adding (use TinyPNG or similar)

### Favicon and Icons

Generate favicons using [favicon.io](https://favicon.io/):
1. Upload your logo
2. Download the package
3. Replace files in `public/`:
   - `favicon.ico`
   - `icon.png` (used by `app/icon.tsx`)

### Open Graph Images

Create OG images (1200x630px) for social media sharing:
- `public/og.jpg` - Default OG image
- `public/og-home.jpg` - Homepage OG image
- Use tools like [og-image.vercel.app](https://og-image.vercel.app/)

---

## Animations

### Framer Motion Animations

Customize animations in components:

```tsx
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Component() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h1 variants={fadeInUp}>
        Your Heading
      </motion.h1>
      <motion.p variants={fadeInUp}>
        Your paragraph
      </motion.p>
    </motion.div>
  );
}
```

### CSS Animations

Add custom animations in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.5s ease-out',
      'slide-down': 'slideDown 0.5s ease-out',
      'scale-in': 'scaleIn 0.5s ease-out',
      'bounce-slow': 'bounce 3s infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      slideDown: {
        '0%': { transform: 'translateY(-20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      scaleIn: {
        '0%': { transform: 'scale(0.9)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
    },
  },
}
```

---

## SEO and Metadata

### Page Metadata

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Your Name - Full Stack Developer',
    template: '%s | Your Name',
  },
  description: 'Full-stack developer specializing in React, Next.js, and Node.js',
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'Web Development'],
  authors: [{ name: 'Your Name', url: 'https://yourdomain.com' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'Your Name - Full Stack Developer',
    description: 'Full-stack developer portfolio',
    siteName: 'Your Name Portfolio',
    images: [
      {
        url: 'https://yourdomain.com/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Name Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name - Full Stack Developer',
    description: 'Full-stack developer portfolio',
    creator: '@yourusername',
    images: ['https://yourdomain.com/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Sitemap

Edit `app/sitemap.ts` to include your pages:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourdomain.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add more pages
  ];
}
```

---

## Bahasa Indonesia

## Daftar Isi

1. [Informasi Personal](#informasi-personal)
2. [Warna dan Tema](#warna-dan-tema)
3. [Tipografi](#tipografi)
4. [Komponen](#komponen)
5. [Konten](#konten)
6. [Gambar dan Asset](#gambar-dan-asset)
7. [Animasi](#animasi)
8. [SEO dan Metadata](#seo-dan-metadata-1)

---

## Informasi Personal

### Konfigurasi Site

Edit `config/site.ts`:

```typescript
export const siteConfig = {
  name: "Nama Anda",
  description: "Portfolio full-stack developer yang menampilkan proyek dan keahlian",
  url: "https://domainda.com",
  ogImage: "https://domainda.com/og.jpg",
  links: {
    github: "https://github.com/usernamanda",
    linkedin: "https://linkedin.com/in/usernamanda",
    email: "mailto:email.anda@example.com",
  },
  creator: {
    name: "Nama Anda",
    email: "email.anda@example.com",
  },
};
```

### Environment Variables

Edit `.env.local`:

```env
# Integrasi GitHub
GITHUB_TOKEN=token_github_anda
GITHUB_USERNAME=username_github_anda

# Informasi Site
NEXT_PUBLIC_SITE_URL=https://domainda.com
NEXT_PUBLIC_AUTHOR_NAME="Nama Lengkap Anda"
NEXT_PUBLIC_AUTHOR_EMAIL="email.anda@example.com"
NEXT_PUBLIC_AUTHOR_LOCATION="Kota Anda, Indonesia"

# Social Media
NEXT_PUBLIC_GITHUB_URL=https://github.com/usernamanda
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/usernamanda
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/usernamanda
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/usernamanda
```

---

## Warna dan Tema

### Warna Utama

Edit `tailwind.config.ts` untuk mengubah warna tema:

```typescript
theme: {
  extend: {
    colors: {
      // Warna primary kustom
      primary: {
        50: '#eff6ff',
        500: '#3b82f6', // Warna utama
        900: '#1e3a8a',
      },
      // Tambahkan warna kustom Anda
      accent: {
        light: '#f0f9ff',
        DEFAULT: '#0ea5e9',
        dark: '#0369a1',
      },
    },
  },
}
```

### Variabel CSS Global

Edit `app/globals.css`:

```css
:root {
  /* Mode terang */
  --background: 255 255 255;
  --foreground: 17 24 39;
  --primary: 59 130 246;
}

.dark {
  /* Mode gelap */
  --background: 17 24 39;
  --foreground: 243 244 246;
  --primary: 96 165 250;
}
```

---

## Tipografi

### Font Family

Edit `app/layout.tsx` untuk mengubah font:

```typescript
import { Inter, Poppins } from 'next/font/google';

// Pilih font Anda
const font = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
```

---

## Komponen

### Bagian Hero

Edit `components/Hero.tsx`:

```tsx
export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Hai, Saya Nama Anda
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Full Stack Developer & UI/UX Designer
        </p>
        {/* Tambahkan konten Anda */}
      </div>
    </section>
  );
}
```

### Bagian About

Edit `components/About.tsx` untuk menambahkan biografi Anda.

### Bagian Skills

Edit `components/Skills.tsx` untuk menambahkan keahlian teknis Anda:

```tsx
const skills = {
  Frontend: [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    // Tambahkan keahlian Anda
  ],
  Backend: [
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    // Tambahkan keahlian Anda
  ],
};
```

---

## Konten

### Menambahkan Proyek Manual

Buat file `lib/projects.ts`:

```typescript
export const projects = [
  {
    id: 1,
    title: "Platform E-commerce",
    description: "Platform e-commerce full-stack dengan integrasi pembayaran",
    image: "/images/projects/ecommerce.jpg",
    tech: ["Next.js", "Stripe", "PostgreSQL"],
    github: "https://github.com/usernamanda/ecommerce",
    demo: "https://demo-ecommerce.com",
    featured: true,
  },
  // Tambahkan proyek lainnya
];
```

---

## Gambar dan Asset

### Foto Profil

Ganti `public/profile.jpg` dengan foto Anda:
- Ukuran disarankan: 500x500px atau lebih besar
- Format: JPG, PNG, atau WebP
- Ukuran file di bawah 500KB

### Gambar Proyek

Tambahkan screenshot proyek ke `public/images/projects/`:
- Ukuran disarankan: 1200x630px
- Gunakan nama file deskriptif: `nama-proyek.jpg`
- Optimalkan gambar sebelum menambahkan

---

## Animasi

### Animasi Framer Motion

```tsx
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Component() {
  return (
    <motion.div variants={fadeInUp}>
      Konten Anda
    </motion.div>
  );
}
```

---

## SEO dan Metadata

### Metadata Halaman

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Nama Anda - Full Stack Developer',
  description: 'Portfolio full-stack developer',
  keywords: ['Full Stack Developer', 'React', 'Next.js'],
  // Tambahkan metadata lainnya
};
```

---

**Perlu bantuan lebih lanjut?** Lihat [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) atau [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
