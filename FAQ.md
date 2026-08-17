# ❓ FAQ - Frequently Asked Questions | Pertanyaan yang Sering Diajukan

Comprehensive FAQ covering common questions and issues.
FAQ komprehensif yang mencakup pertanyaan dan masalah umum.

---

## 📋 Table of Contents | Daftar Isi

1. [General Questions](#general-questions)
2. [Installation & Setup](#installation--setup)
3. [Development](#development)
4. [Customization](#customization)
5. [GitHub Integration](#github-integration)
6. [Deployment](#deployment)
7. [Performance](#performance)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Topics](#advanced-topics)

---

## 🌐 General Questions

### Q: What is this project?
**A:** This is a modern, fully-featured portfolio website built with Next.js 14, React, TypeScript, and Tailwind CSS. It showcases your projects, skills, and provides GitHub integration to automatically display your repositories.

**ID:** Ini adalah website portofolio modern yang lengkap, dibangun dengan Next.js 14, React, TypeScript, dan Tailwind CSS. Menampilkan proyek, keterampilan, dan terintegrasi dengan GitHub untuk menampilkan repositori secara otomatis.

---

### Q: What technologies are used?
**A:** 
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **API**: Next.js API Routes, Octokit
- **Deployment**: Vercel, Netlify, Docker
- **Tools**: ESLint, Prettier, Git

---

### Q: Is this production-ready?
**A:** Yes! The project includes:
- ✅ Security best practices
- ✅ Performance optimizations
- ✅ SEO configuration
- ✅ Error handling
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Docker support
- ✅ Deployment configurations

---

### Q: Do I need coding knowledge to use this?
**A:** Basic knowledge is helpful, but not required for simple customization. You can:
- **No coding needed**: Update content in config files, change colors in Tailwind
- **Basic coding**: Modify components, add sections
- **Advanced coding**: Add new features, integrate APIs

---

### Q: Is this free to use?
**A:** Yes! This is an open-source project. You can use, modify, and distribute it freely. Check the LICENSE file for details.

---

### Q: Can I use this for commercial purposes?
**A:** Yes, you can use this portfolio for personal or commercial projects.

---

## 🔧 Installation & Setup

### Q: What are the system requirements?
**A:**
```
Minimum:
- Node.js 18.0+
- npm 9.0+ or yarn 1.22+
- 4GB RAM
- 500MB disk space

Recommended:
- Node.js 20.0+
- npm 10.0+
- 8GB RAM
- 1GB disk space
```

---

### Q: How do I install Node.js?
**A:**
1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS version
3. Run the installer
4. Verify: `node --version`

**Mac (using Homebrew)**:
```bash
brew install node
```

**Windows (using Chocolatey)**:
```bash
choco install nodejs
```

---

### Q: Installation fails with permission errors
**A:**
```bash
# Don't use sudo! Fix permissions instead:

# Mac/Linux
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

### Q: Where do I get a GitHub token?
**A:**
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Add note: "Portfolio Website"
4. Select scope: `public_repo` (or just `repo` for private repos)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. Add to `.env.local`: `GITHUB_TOKEN=ghp_your_token_here`

**ID:**
1. Buka [github.com/settings/tokens](https://github.com/settings/tokens)
2. Klik "Generate new token" → "Generate new token (classic)"
3. Berikan nama: "Portfolio Website"
4. Pilih scope: `public_repo`
5. Klik "Generate token"
6. Salin token (tidak akan muncul lagi!)
7. Tambahkan ke `.env.local`: `GITHUB_TOKEN=ghp_your_token_here`

---

### Q: Do I need a GitHub token?
**A:** 
**Without token**: Limited to 60 API requests/hour (may show errors)
**With token**: 5,000 requests/hour (recommended)

The portfolio will work without a token, but you'll hit rate limits quickly.

---

### Q: Setup script fails on Windows
**A:**
```bash
# Use PowerShell (Run as Administrator)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run:
npm run setup:windows

# Or manually:
npm install
copy .env.example .env.local
# Edit .env.local with your details
npm run build
```

---

### Q: How do I verify installation is correct?
**A:**
```bash
# Run verification script
npm run verify

# Manual check:
node --version        # Should show v18+
npm --version         # Should show v9+
npm list next         # Should show next@14.2.5
```

---

## 💻 Development

### Q: How do I start the development server?
**A:**
```bash
npm run dev

# Server starts at http://localhost:3000
# Hot reload enabled - changes appear instantly
```

---

### Q: Port 3000 is already in use
**A:**
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process using port 3000
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Q: Changes don't appear in browser
**A:**
1. **Hard refresh**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. **Clear cache**: DevTools → Network → Disable cache
3. **Restart dev server**: Ctrl+C, then `npm run dev`
4. **Delete .next folder**: `rm -rf .next && npm run dev`
5. **Check console**: Look for errors in browser console

---

### Q: How do I add a new page?
**A:**
```bash
# Create file
touch app/new-page/page.tsx

# Add content
export default function NewPage() {
  return (
    <main>
      <h1>New Page</h1>
    </main>
  );
}

# Access at http://localhost:3000/new-page
```

---

### Q: Hot reload is slow
**A:**
```javascript
// next.config.js - Add turbopack (experimental)
module.exports = {
  experimental: {
    turbo: {
      loaders: {},
    },
  },
};

// Or use --turbo flag
npm run dev -- --turbo
```

---

### Q: TypeScript errors in editor
**A:**
```bash
# Install types
npm install --save-dev @types/react @types/node

# Restart TypeScript server in VSCode
Cmd+Shift+P → "TypeScript: Restart TS Server"

# Check tsconfig.json exists and is valid
```

---

### Q: ESLint errors are overwhelming
**A:**
```bash
# Auto-fix what can be fixed
npm run lint -- --fix

# Ignore specific rules temporarily
// eslint-disable-next-line @typescript-eslint/no-explicit-any

# Adjust rules in .eslintrc.json
{
  "rules": {
    "rule-name": "off"
  }
}
```

---

## 🎨 Customization

### Q: How do I change colors?
**A:**
```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',    // Main brand color
        secondary: '#your-color',  // Secondary color
        accent: '#your-color',     // Accent color
      }
    }
  }
}

// Then use in components:
<div className="bg-primary text-white">
```

---

### Q: How do I change fonts?
**A:**
```typescript
// app/layout.tsx
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const roboto = Roboto({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

// Apply to html element
<html className={`${inter.variable} ${roboto.variable}`}>
```

---

### Q: How do I change the logo?
**A:**
```typescript
// components/Navigation.tsx
// Replace the logo section:
<Link href="/">
  <Image 
    src="/logo.png"  // Place your logo in /public
    alt="Logo"
    width={40}
    height={40}
  />
  {/* Or text logo: */}
  <span className="text-xl font-bold">Your Name</span>
</Link>
```

---

### Q: How do I change profile picture?
**A:**
1. Replace `/public/profile.jpg` with your image
2. Keep the filename or update references:
```typescript
// components/Hero.tsx
<Image src="/profile.jpg" alt="Your Name" />

// If you rename it:
<Image src="/my-photo.png" alt="Your Name" />
```

---

### Q: How do I add a new section?
**A:**
```typescript
// 1. Create component
// components/Experience.tsx
export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Experience</h2>
        {/* Your content */}
      </div>
    </section>
  );
}

// 2. Add to homepage
// app/page.tsx
import { Experience } from '@/components/Experience';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience /> {/* New section */}
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}

// 3. Add to navigation
// components/Navigation.tsx
const navItems = [
  { href: '#experience', label: 'Experience' }
];
```

---

### Q: How do I remove a section?
**A:**
```typescript
// 1. Remove from homepage (app/page.tsx)
// Comment out or delete:
// <Skills />

// 2. Remove from navigation
// Delete from navItems array in Navigation.tsx

// 3. Optionally delete component file
rm components/Skills.tsx
```

---

### Q: Can I use a different CSS framework?
**A:** Yes, but you'll need to refactor all components. Tailwind is deeply integrated. Alternatives:
- **CSS Modules**: Supported out of the box
- **Styled Components**: Need to configure
- **Emotion**: Need to configure
- **Plain CSS**: Replace Tailwind classes

Not recommended unless you're comfortable with extensive refactoring.

---

## 🔗 GitHub Integration

### Q: Projects not showing up
**A:**
1. **Check token**: Verify `GITHUB_TOKEN` in `.env.local`
2. **Check username**: Verify `GITHUB_USERNAME` in `.env.local`
3. **Check API response**: Open DevTools → Network → Check `/api/github/repos`
4. **Check rate limit**: You may have hit the rate limit
5. **Restart dev server**: Changes to `.env.local` require restart

```bash
# Test API directly
curl http://localhost:3000/api/github/repos

# Should return JSON with repos
```

---

### Q: Rate limit exceeded error
**A:**
```typescript
// Check current rate limit
fetch('https://api.github.com/rate_limit', {
  headers: { 'Authorization': 'token YOUR_TOKEN' }
})

// Solutions:
1. Add GITHUB_TOKEN if you haven't
2. Increase cache duration (lib/cache.ts)
3. Wait 1 hour for limit to reset
4. Use authenticated requests (5000/hour vs 60/hour)
```

---

### Q: How do I filter which repos are shown?
**A:**
```typescript
// lib/github.ts
export async function fetchRepos() {
  const repos = await octokit.repos.listForUser({
    username: process.env.GITHUB_USERNAME,
    sort: 'updated',
    per_page: 100
  });
  
  // Add filtering
  return repos.data.filter(repo => 
    !repo.fork &&                    // Exclude forks
    !repo.archived &&                // Exclude archived
    repo.stargazers_count > 0 &&     // Must have stars
    repo.topics?.includes('portfolio') // Must have topic
  );
}
```

---

### Q: Can I show private repositories?
**A:** Yes, but:
1. Your GitHub token needs `repo` scope (not just `public_repo`)
2. Private repos will be visible on your public portfolio (security risk!)
3. Consider if you really want this

```typescript
// lib/github.ts
const repos = await octokit.repos.listForAuthenticatedUser({
  visibility: 'all', // public, private, all
  sort: 'updated'
});
```

---

### Q: How often does GitHub data update?
**A:**
- **Default cache**: 30 minutes
- **Page reload**: Uses cached data
- **Cache expiry**: Fresh fetch after 30 minutes

```typescript
// Change cache duration in lib/cache.ts
const CACHE_DURATION = {
  GITHUB_REPOS: 1800000, // 30 minutes (change this)
  GITHUB_PROFILE: 3600000 // 1 hour
};
```

---

### Q: Can I integrate with GitLab/Bitbucket?
**A:** Yes, but requires code changes:
1. Create new API route (`/api/gitlab/repos`)
2. Use GitLab/Bitbucket API client
3. Transform response to match expected format
4. Update components to use new endpoint

Example for GitLab:
```typescript
// lib/gitlab.ts
export async function fetchGitLabProjects() {
  const response = await fetch(
    `https://gitlab.com/api/v4/users/${username}/projects`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  return response.json();
}
```

---

## 🚀 Deployment

### Q: How do I deploy to Vercel?
**A:**
```bash
# Method 1: Vercel CLI
npm i -g vercel
vercel login
vercel

# Method 2: GitHub Integration
1. Push code to GitHub
2. Visit vercel.com/new
3. Import your repository
4. Add environment variables
5. Deploy!

# Method 3: Vercel button
Click "Deploy" button in README
```

---

### Q: Deployment fails with "Module not found"
**A:**
```bash
# Common causes:
1. Missing dependency in package.json
2. Case-sensitive imports (local works, Vercel fails)
3. Wrong path in import

# Fixes:
1. npm install <missing-package>
2. Check import paths match file names exactly
3. Use @ aliases: import from '@/components/...'
4. Check .gitignore isn't excluding necessary files
```

---

### Q: Environment variables not working on Vercel
**A:**
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `GITHUB_TOKEN`
   - `GITHUB_USERNAME`
   - `NEXT_PUBLIC_SITE_URL`
3. Redeploy: Deployments → ⋯ → Redeploy

**Important**: Environment variable changes require redeployment!

---

### Q: How do I deploy to Netlify?
**A:**
```bash
# Method 1: Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod

# Method 2: GitHub Integration
1. Push to GitHub
2. Visit app.netlify.com
3. New site from Git
4. Choose repository
5. Build command: npm run build
6. Publish directory: .next
7. Add environment variables
8. Deploy!
```

---

### Q: How do I use my own domain?
**A:**
**Vercel:**
1. Project Settings → Domains
2. Add your domain
3. Update DNS records at your registrar:
   - Type: A
   - Name: @
   - Value: 76.76.21.21

**Netlify:**
1. Domain settings → Add custom domain
2. Update DNS:
   - Type: CNAME
   - Name: www
   - Value: your-site.netlify.app

Wait 24-48 hours for DNS propagation.

---

### Q: HTTPS not working
**A:**
- **Vercel**: Automatic HTTPS, wait a few minutes
- **Netlify**: Automatic HTTPS, enable in settings
- **Custom server**: Use Let's Encrypt or Cloudflare

---

### Q: How do I deploy with Docker?
**A:**
```bash
# Build image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=your_token \
  -e GITHUB_USERNAME=your_username \
  portfolio

# Or use docker-compose
docker-compose up -d

# Access at http://localhost:3000
```

---

### Q: Deploy to my own VPS/server
**A:**
```bash
# 1. Install Node.js on server
# 2. Clone repository
git clone <your-repo>
cd portfolio

# 3. Install dependencies
npm ci --production

# 4. Build
npm run build

# 5. Start with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup

# 6. Setup Nginx reverse proxy
# /etc/nginx/sites-available/portfolio
server {
  listen 80;
  server_name yourdomain.com;
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

# 7. Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. Setup SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

---

## ⚡ Performance

### Q: Site is slow to load
**A:**
**Diagnose**:
```bash
# Check Lighthouse score
# Chrome DevTools → Lighthouse → Generate report

# Analyze bundle size
ANALYZE=true npm run build
```

**Common fixes**:
1. **Optimize images**: Use WebP format, proper sizing
2. **Reduce bundle size**: Remove unused dependencies
3. **Enable caching**: Check cache headers
4. **Use CDN**: Vercel/Netlify include CDN
5. **Lazy load**: Use dynamic imports for heavy components

---

### Q: Images load slowly
**A:**
```typescript
// Use Next.js Image component (already done)
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"      // Lazy load off-screen images
  quality={75}        // Reduce quality (default: 75)
  placeholder="blur"  // Show blur while loading
/>

// Optimize source images:
# Use tools like:
- imageOptim (Mac)
- squoosh.app (Web)
- sharp (CLI)

# Target sizes:
- Hero images: < 200KB
- Thumbnails: < 50KB
- Icons: SVG preferred
```

---

### Q: Bundle size is too large
**A:**
```bash
# Analyze bundle
npm install @next/bundle-analyzer
ANALYZE=true npm run build

# Common culprits and fixes:
1. moment.js → use date-fns or native Date
2. lodash → import specific functions: import debounce from 'lodash/debounce'
3. framer-motion → use CSS animations for simple cases
4. icons libraries → import specific icons only

# Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <Spinner />
});
```

---

### Q: How to improve Lighthouse score?
**A:**
**Performance**:
- ✅ Optimize images (use Next/Image)
- ✅ Minimize JavaScript
- ✅ Remove unused CSS
- ✅ Enable caching
- ✅ Use CDN

**Accessibility**:
- ✅ Add alt text to images
- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ Color contrast ratio > 4.5:1
- ✅ Keyboard navigation
- ✅ ARIA labels

**Best Practices**:
- ✅ HTTPS
- ✅ Security headers
- ✅ No console errors
- ✅ Valid meta tags

**SEO**:
- ✅ Meta description
- ✅ Title tags
- ✅ Robots.txt
- ✅ Sitemap.xml
- ✅ Semantic HTML

---

## 🔧 Troubleshooting

### Q: "Error: Cannot find module"
**A:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Verify imports use correct paths
# Use @ alias: import from '@/components/...'
```

---

### Q: "Hydration failed" error
**A:**
```typescript
// Cause: Server HTML doesn't match client HTML

// Common causes:
1. Using localStorage/window in render
2. Random IDs
3. Date/time without timezone
4. Third-party scripts

// Fix: Use useEffect for client-only code
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

return <div>{/* client-only code */}</div>;
```

---

### Q: Dark mode not working
**A:**
```typescript
// Check:
1. localStorage accessible: console.log(localStorage.getItem('theme'))
2. Theme class applied: Inspect <html> element
3. Dark mode styles defined: Check Tailwind classes
4. JavaScript enabled: Some browsers block localStorage

// Debug:
console.log('Theme:', theme);
console.log('HTML classes:', document.documentElement.classList);
```

---

### Q: Forms not submitting
**A:**
```typescript
// Check:
1. Prevent default: e.preventDefault()
2. API route exists and handles POST
3. CORS headers (if external API)
4. Form validation passing
5. Network tab for errors

// Debug:
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted');
  
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    console.log('Response:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### Q: Build fails in production
**A:**
```bash
# Common issues:
1. TypeScript errors (run: npm run type-check)
2. ESLint errors (run: npm run lint)
3. Missing environment variables
4. Import errors (case sensitivity)

# Debug locally:
npm run build
npm start

# Check build output for errors
```

---

### Q: CSS not applying
**A:**
```bash
# Check:
1. Tailwind setup correct (tailwind.config.ts)
2. PostCSS config (postcss.config.js)
3. globals.css imported in layout.tsx
4. Class names correct (no typos)
5. Browser cache cleared

# Rebuild:
rm -rf .next
npm run dev
```

---

## 🎓 Advanced Topics

### Q: How do I add authentication?
**A:**
```bash
# Install NextAuth.js
npm install next-auth

# Create [...nextauth]/route.ts
# See: https://next-auth.js.org/getting-started/example

# This portfolio doesn't need auth by default
# Only add if building admin panel or private features
```

---

### Q: How do I add a database?
**A:**
```bash
# Options:
1. Vercel Postgres (easiest with Vercel)
2. PlanetScale (MySQL)
3. MongoDB Atlas
4. Supabase (Postgres + more)

# Example with Vercel Postgres:
npm install @vercel/postgres
npm install drizzle-orm

# Create schema and migrations
# Connect in API routes
```

---

### Q: How do I add analytics?
**A:**
```typescript
// Option 1: Vercel Analytics (easiest)
npm install @vercel/analytics

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

// Option 2: Google Analytics
// Add script to layout.tsx or use next-google-analytics

// Option 3: Plausible (privacy-friendly)
// Add script tag or use next-plausible
```

---

### Q: How do I add a blog?
**A:**
```bash
# Option 1: MDX (Markdown + React components)
npm install @next/mdx @mdx-js/loader @mdx-js/react

# Create /app/blog/page.tsx and /app/blog/[slug]/page.tsx
# Store blog posts in /content as .mdx files

# Option 2: Headless CMS
- Sanity.io
- Contentful
- Strapi
- Ghost

# Option 3: Database
- Store posts in database
- Create admin panel for writing

# See DEVELOPMENT.md for blog implementation example
```

---

### Q: How do I add internationalization (i18n)?
**A:**
```bash
# Install next-intl
npm install next-intl

# Create /messages directory with translations
# messages/en.json
# messages/id.json

# Configure in next.config.js
# See: https://next-intl-docs.vercel.app/

# This is advanced - consider if you really need it
```

---

### Q: How do I add animations?
**A:**
```typescript
// Already included: Framer Motion

// Example usage:
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Or use CSS animations (lighter)
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}
```

---

### Q: Can I convert this to a template/theme?
**A:** Yes! To make it reusable:
1. Extract all personal content to config files
2. Create setup wizard script
3. Document customization options
4. Add theme variants
5. Create marketplace listing (if selling)

---

### Q: How do I contribute to this project?
**A:**
```bash
# 1. Fork repository
# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes and commit
git commit -m "feat: add amazing feature"

# 4. Push to branch
git push origin feature/amazing-feature

# 5. Open Pull Request
# Include:
- Description of changes
- Screenshots (if UI changes)
- Testing steps
```

---

### Q: Where can I get help?
**A:**
- **Documentation**: Check all .md files in project
- **Issues**: Create GitHub issue with details
- **Discussions**: GitHub Discussions for questions
- **Community**: Join Discord/Slack (if available)
- **Search**: Check closed issues for similar problems

**When asking for help, include**:
1. Node.js version: `node --version`
2. npm version: `npm --version`
3. Operating system
4. Error message (full text)
5. Steps to reproduce
6. What you've tried

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Guides](https://vercel.com/guides)
- [Web.dev](https://web.dev) - Performance & best practices

---

## 🆘 Still Stuck?

If you can't find an answer here:

1. **Search documentation**: Use Ctrl+F in docs
2. **Check GitHub Issues**: Someone may have had same problem
3. **Create new issue**: Provide details and error messages
4. **Ask in Discussions**: For general questions
5. **Read source code**: Sometimes code is the best documentation!

---

**Remember**: There are no stupid questions! If you're confused, others probably are too. Ask away!

**Ingat**: Tidak ada pertanyaan bodoh! Jika Anda bingung, orang lain mungkin juga. Tanyakan saja!
