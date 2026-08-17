# 📁 Project Structure | Struktur Proyek

Complete file tree with descriptions of every file and folder.
Pohon file lengkap dengan deskripsi setiap file dan folder.

---

## 🗂️ Root Directory

```
portfolio/
├── .github/                    # GitHub workflows and CI/CD configurations
├── .vscode/                    # VSCode editor settings
├── app/                        # Next.js 14 App Router directory
├── components/                 # React components
├── config/                     # Configuration files
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries and helpers
├── public/                     # Static assets
├── scripts/                    # Build and deployment scripts
├── types/                      # TypeScript type definitions
├── .dockerignore              # Docker ignore patterns
├── .editorconfig              # Editor configuration
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables (gitignored)
├── .eslintrc.js               # ESLint configuration
├── .eslintrc.json             # ESLint JSON config
├── .gitignore                 # Git ignore patterns
├── .prettierignore            # Prettier ignore patterns
├── .prettierrc                # Prettier configuration
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker container definition
├── jsconfig.json              # JavaScript configuration
├── middleware.ts              # Next.js middleware
├── netlify.toml               # Netlify deployment config
├── next.config.js             # Next.js configuration
├── package.json               # NPM dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment config
```

---

## 📱 `/app` - Next.js App Router

Main application directory using Next.js 14 App Router.
Direktori aplikasi utama menggunakan Next.js 14 App Router.

```
app/
├── api/                       # API routes
│   └── github/               # GitHub integration endpoints
│       ├── profile/          # GitHub profile data
│       │   └── route.ts      # GET /api/github/profile
│       └── repos/            # GitHub repositories data
│           └── route.ts      # GET /api/github/repos
├── error.tsx                 # Global error boundary
├── globals.css               # Global CSS styles
├── icon.tsx                  # Dynamic favicon generator
├── layout.tsx                # Root layout component
├── loading.tsx               # Global loading state
├── manifest.ts               # PWA manifest generator
├── not-found.tsx             # 404 page
├── opengraph-image.tsx       # Dynamic OG image generator
├── page.tsx                  # Homepage
├── robots.ts                 # Robots.txt generator
└── sitemap.ts                # Sitemap.xml generator
```

### API Routes Description

- **`/api/github/profile/route.ts`**: Fetches GitHub user profile with caching
- **`/api/github/repos/route.ts`**: Fetches GitHub repositories with filtering and sorting

---

## 🧩 `/components` - React Components

Reusable UI components organized by feature.
Komponen UI yang dapat digunakan kembali, diatur berdasarkan fitur.

```
components/
├── ui/                        # Base UI components
│   ├── Badge.tsx             # Badge component for tags
│   ├── Button.tsx            # Reusable button component
│   ├── Card.tsx              # Card container component
│   ├── Spinner.tsx           # Loading spinner
│   └── index.ts              # UI components barrel export
├── About.tsx                 # About section
├── Contact.tsx               # Contact form section
├── Footer.tsx                # Site footer
├── Hero.tsx                  # Hero/landing section
├── Navigation.tsx            # Main navigation bar
├── Projects.tsx              # Projects showcase section
└── Skills.tsx                # Skills/tech stack section
```

### Component Details

#### UI Components (`/components/ui`)
- **Badge**: Customizable badge with variants (primary, secondary, success, warning, error)
- **Button**: Full-featured button with loading states, sizes, and variants
- **Card**: Container with header, content, and footer sections
- **Spinner**: Loading indicator with size options

#### Feature Components
- **Navigation**: Responsive navbar with mobile menu and smooth scroll
- **Hero**: Landing section with animated introduction
- **About**: Personal information and bio section
- **Skills**: Tech stack display with icons and proficiency levels
- **Projects**: GitHub projects grid with filtering
- **Contact**: Contact form with validation
- **Footer**: Site footer with social links

---

## 🪝 `/hooks` - Custom React Hooks

Reusable React hooks for common functionality.
Hook React yang dapat digunakan kembali untuk fungsi umum.

```
hooks/
├── index.ts                   # Barrel export for all hooks
├── useGitHub.ts              # GitHub API data fetching
├── useIntersectionObserver.ts # Scroll-based animations
├── useMediaQuery.ts          # Responsive breakpoint detection
├── useScrollPosition.ts      # Track scroll position
├── useScrollSpy.ts           # Active section detection
└── useTheme.ts               # Dark/light theme management
```

### Hook Descriptions

- **`useGitHub`**: Fetches and caches GitHub profile and repository data
- **`useIntersectionObserver`**: Triggers animations when elements enter viewport
- **`useMediaQuery`**: Detects responsive breakpoints (mobile, tablet, desktop)
- **`useScrollPosition`**: Tracks current scroll position for navbar effects
- **`useScrollSpy`**: Highlights active navigation item based on scroll
- **`useTheme`**: Manages theme state with localStorage persistence

---

## 📚 `/lib` - Utility Libraries

Core utilities, helpers, and business logic.
Utilitas inti, helper, dan logika bisnis.

```
lib/
├── cache.ts                  # In-memory caching implementation
├── constants.ts              # Application constants
├── fetcher.ts                # API fetching utilities
├── github.ts                 # GitHub API integration
├── helpers.ts                # General helper functions
├── index.ts                  # Library barrel export
├── logger.ts                 # Logging utilities
├── types.ts                  # Shared TypeScript types
├── utils.ts                  # General utilities (cn, formatters)
└── validation.ts             # Input validation functions
```

### Library Details

- **cache.ts**: Time-based in-memory cache with TTL support
- **constants.ts**: API endpoints, rate limits, cache durations
- **fetcher.ts**: Type-safe fetch wrapper with error handling
- **github.ts**: GitHub API client using Octokit
- **helpers.ts**: Date formatting, string manipulation, array utilities
- **logger.ts**: Structured logging with levels (info, warn, error)
- **types.ts**: Shared TypeScript interfaces and types
- **utils.ts**: Tailwind class merging, formatters, validators
- **validation.ts**: Form and data validation functions

---

## 🎨 `/public` - Static Assets

Public static files served directly.
File statis publik yang dilayani langsung.

```
public/
├── favicon.ico               # Browser favicon
├── favicon.svg               # SVG favicon for modern browsers
├── manifest.json             # PWA manifest
├── og-image.jpg              # Open Graph preview image
├── profile.jpg               # Profile photo
├── robots.txt                # Search engine instructions
└── sitemap.xml               # XML sitemap
```

---

## 🔧 `/scripts` - Automation Scripts

Build, deployment, and maintenance scripts.
Skrip build, deployment, dan pemeliharaan.

```
scripts/
├── health-check.js           # Application health verification
├── info.js                   # Display project information
├── make-executable.sh        # Make scripts executable (Unix)
├── pre-deploy-check.js       # Pre-deployment validation
├── quick-start.sh            # Quick start script
├── README.md                 # Scripts documentation
├── setup.ps1                 # Windows setup script
├── setup.sh                  # Unix/Mac setup script
└── verify-setup.js           # Verify installation
```

### Script Descriptions

- **health-check.js**: Verifies all dependencies and configuration
- **info.js**: Displays project info, versions, and system details
- **pre-deploy-check.js**: Runs validation before deployment
- **setup.sh / setup.ps1**: Automated setup for Unix/Windows
- **verify-setup.js**: Confirms successful installation

---

## 🔤 `/types` - TypeScript Types

Global TypeScript type definitions.
Definisi tipe TypeScript global.

```
types/
├── api.ts                    # API response types
└── index.ts                  # Type exports
```

### Type Definitions

- **api.ts**: GitHub API response shapes, error types
- **index.ts**: Global type exports and re-exports

---

## ⚙️ `/config` - Configuration

Application configuration files.
File konfigurasi aplikasi.

```
config/
└── site.ts                   # Site metadata and settings
```

### Configuration Details

- **site.ts**: Site name, description, author info, social links, SEO metadata

---

## 🐳 Docker Files

```
├── Dockerfile                # Multi-stage production build
├── docker-compose.yml        # Dev and prod container orchestration
└── .dockerignore             # Docker build exclusions
```

---

## 📝 Configuration Files

### Build & Bundler
- **next.config.js**: Next.js configuration with image optimization, redirects
- **tsconfig.json**: TypeScript compiler options
- **jsconfig.json**: JavaScript path aliases

### Styling
- **tailwind.config.ts**: Tailwind theme, colors, animations
- **postcss.config.js**: PostCSS plugins

### Code Quality
- **.eslintrc.js / .eslintrc.json**: Linting rules
- **.prettierrc**: Code formatting rules
- **.editorconfig**: Editor consistency

### Deployment
- **vercel.json**: Vercel deployment settings
- **netlify.toml**: Netlify build configuration

---

## 📄 Documentation Files

```
├── 00-IMPLEMENTATION-SUMMARY.md    # Implementation overview
├── 00-READ-FIRST.md               # Getting started guide
├── API_DOCUMENTATION.md           # API endpoints documentation
├── BUILD_SUMMARY.md               # Build process summary
├── CHANGELOG.md                   # Version history
├── COMPONENTS_COMPLETE.md         # Components inventory
├── CONTRIBUTING.md                # Contribution guidelines
├── CUSTOMIZATION.md               # Customization guide
├── DEPLOYMENT.md                  # Deployment instructions
├── DEVELOPMENT.md                 # Development guide
├── ENV.md                         # Environment variables
├── FAQ.md                         # Frequently asked questions
├── FEATURES.md                    # Feature list
├── GETTING_STARTED.md             # Quick start guide
├── QUICK_START.md                 # Fast setup guide
├── README.md                      # Main readme
├── SECURITY.md                    # Security guidelines
├── TROUBLESHOOTING.md             # Common issues and solutions
└── LICENSE                        # License file
```

---

## 🔐 Environment Files

```
├── .env.example               # Template with all required variables
└── .env.local                 # Your local environment (not committed)
```

Required variables:
- `GITHUB_TOKEN`: Personal access token for GitHub API
- `GITHUB_USERNAME`: Your GitHub username
- `NEXT_PUBLIC_SITE_URL`: Production URL

---

## 🚫 Ignore Files

```
├── .gitignore                # Git ignore patterns
├── .dockerignore             # Docker ignore patterns
└── .prettierignore           # Prettier ignore patterns
```

---

## 📊 Total File Count

| Category | Count |
|----------|-------|
| TypeScript/TSX files | 46 |
| Configuration files | 15 |
| Documentation files | 25+ |
| Scripts | 9 |
| Static assets | 7 |
| **TOTAL** | **100+** |

---

## 🎯 Key Directories Summary

1. **`/app`** - Next.js pages, layouts, API routes
2. **`/components`** - React UI components
3. **`/hooks`** - Custom React hooks
4. **`/lib`** - Core utilities and business logic
5. **`/public`** - Static assets
6. **`/scripts`** - Automation and deployment
7. **`/types`** - TypeScript definitions
8. **`/config`** - Application settings

---

## 🔍 Finding Files

### By Feature
- **GitHub Integration**: `/app/api/github`, `/lib/github.ts`, `/hooks/useGitHub.ts`
- **Styling**: `/app/globals.css`, `tailwind.config.ts`
- **SEO**: `/app/sitemap.ts`, `/app/robots.ts`, `/app/opengraph-image.tsx`
- **Components**: `/components` and `/components/ui`

### By Purpose
- **Business Logic**: `/lib`
- **Type Definitions**: `/types`, `/lib/types.ts`
- **API Routes**: `/app/api`
- **Configuration**: Root config files + `/config`

---

This structure follows Next.js 14 best practices with App Router, providing a scalable and maintainable architecture.
Struktur ini mengikuti praktik terbaik Next.js 14 dengan App Router, menyediakan arsitektur yang scalable dan maintainable.
