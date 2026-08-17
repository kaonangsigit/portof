# 🎨 Portfolio 3D + Auto GitHub + File CMS

A modern, professional portfolio with 3D particle effects, automatic GitHub integration, and file-based content management.

## ✨ Key Features

### 1. **3D Particle System**
- Interactive particle field with mouse tracking
- Mobile optimized (performance adaptive)
- Smooth animations using Three.js
- No dependencies on framer-motion

### 2. **Auto-Updating GitHub Integration**
- Automatically fetches latest repositories
- Real-time stats (stars, forks, languages)
- Smart caching (1-hour refresh)
- Zero manual updates needed

### 3. **File-Based CMS**
- Add certificates via markdown files
- Manage projects with frontmatter
- JSON-based configuration
- Hot-reload during development
- No database required

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Using the setup script (recommended)
chmod +x setup-portfolio.sh
./setup-portfolio.sh

# Or manually
npm install
```

### 2. Configure GitHub

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your GitHub username:
```env
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
GITHUB_TOKEN=your_github_token_here
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 📁 Project Structure

```
/
├── app/
│   ├── api/              # API routes
│   │   ├── github-auto/  # GitHub auto-fetch
│   │   ├── certificates/ # Certificates API
│   │   ├── projects/     # Projects API
│   │   └── blog/         # Blog API
│   └── page.tsx          # Main page
├── components/
│   ├── Hero3D.tsx        # 3D particle system
│   ├── Certificates.tsx  # Certificate display
│   └── ProjectsEnhanced.tsx
├── content/              # CMS Content (ADD YOUR CONTENT HERE)
│   ├── certificates/     # Certificate markdown files
│   ├── projects/         # Project markdown files
│   ├── blog/             # Blog post markdown files
│   └── data/             # JSON configuration
│       ├── personal.json
│       ├── skills.json
│       └── experience.json
├── hooks/
│   └── useGitHubAuto.ts  # GitHub auto-update hook
├── lib/
│   ├── cms-loader.ts     # CMS content loader
│   └── github-auto.ts    # GitHub API integration
└── public/
    └── images/           # Static images
```

---

## 📝 Adding Content

### Add a Certificate

Create `/content/certificates/my-cert.md`:

```markdown
---
title: "AWS Certified Solutions Architect"
issuer: "Amazon Web Services"
date: "2024-01-15"
description: "Professional cloud architecture certification"
skills: ["AWS", "Cloud", "Architecture"]
credentialUrl: "https://verify-url.com"
image: "/images/certificates/aws.jpg"
---

Detailed description of your certification...
```

### Add a Project

Create `/content/projects/my-project.md`:

```markdown
---
title: "E-Commerce Platform"
description: "Full-featured online store"
technologies: ["Next.js", "Stripe", "PostgreSQL"]
featured: true
githubUrl: "https://github.com/user/repo"
demoUrl: "https://demo.example.com"
---

Project details and features...
```

### Update Personal Info

Edit `/content/data/personal.json`:

```json
{
  "name": "Your Name",
  "title": "Full Stack Developer",
  "email": "your@email.com",
  "bio": "Your professional bio...",
  "availability": "Available for hire"
}
```

**For complete CMS documentation, see [README-CMS.md](./README-CMS.md)**

---

## 🔧 Configuration

### Environment Variables

```env
# Required
NEXT_PUBLIC_GITHUB_USERNAME=yourusername

# Optional (increases API rate limit from 60 to 5000/hour)
GITHUB_TOKEN=ghp_yourtoken

# Optional
NEXT_PUBLIC_GITHUB_REPOS_LIMIT=10
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### GitHub Token Setup

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `public_repo` (read access to public repos)
4. Copy token to `.env.local`

---

## 🎯 Features in Detail

### 3D Hero Section

The Hero section now includes an interactive 3D particle field:
- **Desktop**: 2000 particles with full interactivity
- **Mobile**: 1000 particles for optimal performance
- **Mouse Tracking**: Particles respond to cursor movement
- **Depth Animation**: Smooth z-axis movement
- **Auto-rotation**: Subtle rotation effect

### Auto GitHub Integration

Your GitHub repos are automatically:
- Fetched on page load
- Cached for 1 hour
- Displayed with live stats
- Sorted by last update
- Filtered by your preferences

No manual data entry required!

### File-Based CMS

Simply add/edit files and the portfolio updates:
- **Certificates**: Add `.md` files to `/content/certificates/`
- **Projects**: Add `.md` files to `/content/projects/`
- **Blog**: Add `.md` files to `/content/blog/`
- **Data**: Edit JSON in `/content/data/`

Hot-reload means changes appear instantly during development.

---

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
npm test           # Run tests
```

---

## 📦 Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### 3D Graphics
- `three` - 3D library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Three.js helpers

### Content Management
- `gray-matter` - Parse frontmatter
- `marked` - Markdown parser

### GitHub Integration
- `@octokit/rest` - GitHub API client

---

## 🎨 Customization

### Modify Particle Count

Edit `/components/Hero3D.tsx`:

```typescript
const particleCount = window.innerWidth < 768 ? 1000 : 2000;
// Change to your preferred values
```

### Modify Cache Duration

Edit `/lib/github-auto.ts`:

```typescript
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
// Change to your preferred duration
```

### Modify Content Types

Edit `/lib/cms-loader.ts` to add new content types or modify existing ones.

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Environment Variables for Production

Add these in your hosting dashboard:
```
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
GITHUB_TOKEN=your_token
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Build

```bash
npm run build
npm run start
```

---

## 🐛 Troubleshooting

### 3D Particles Not Showing

- Check browser WebGL support
- Look for console errors
- Verify Three.js dependencies installed
- Try clearing browser cache

### GitHub Data Not Loading

- Verify GitHub username in `.env.local`
- Check API rate limits (60/hour without token)
- Add `GITHUB_TOKEN` for 5000/hour limit
- Check browser console for errors

### Content Not Appearing

- Ensure `/content/` directories exist
- Check frontmatter syntax (YAML between `---`)
- Verify file extensions are `.md`
- Check API routes are accessible at `/api/*`

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Documentation

- **[README-CMS.md](./README-CMS.md)** - Complete CMS guide
- **[IMPLEMENTATION-COMPLETE.md](./IMPLEMENTATION-COMPLETE.md)** - Implementation details

---

## 🎉 What's Included

✅ **Working 3D particle system** with Three.js  
✅ **Auto-updating GitHub integration** with caching  
✅ **File-based CMS** for easy content management  
✅ **Certificates section** with markdown support  
✅ **Enhanced projects** combining GitHub + custom data  
✅ **Blog system** with full markdown  
✅ **Responsive design** optimized for all devices  
✅ **TypeScript** for type safety  
✅ **Production-ready** with error handling  

---

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 💬 Support

- Check documentation in `/README-CMS.md`
- Review implementation notes in `/IMPLEMENTATION-COMPLETE.md`
- Open an issue for bugs or questions

---

**Built with ❤️ using Next.js, Three.js, and modern web technologies**
