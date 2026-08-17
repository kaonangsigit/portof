# Portfolio Helper Scripts and Configuration

This document provides an overview of all the helper scripts and additional configuration files added to the project.

## 📂 Directory Structure

```
/
├── scripts/                      # Helper scripts directory
│   ├── setup.sh                 # Unix setup script
│   ├── setup.ps1                # Windows setup script
│   ├── verify-setup.js          # Setup verification
│   ├── pre-deploy-check.js      # Pre-deployment checks
│   ├── health-check.js          # Health check script
│   ├── make-executable.sh       # Make scripts executable
│   └── README.md                # Scripts documentation
├── .github/workflows/
│   ├── ci.yml                   # CI pipeline
│   └── deploy.yml               # Deployment workflow
├── .vscode/
│   ├── settings.json            # VSCode settings
│   └── extensions.json          # Recommended extensions
├── docker-compose.yml           # Docker compose config
├── Dockerfile                   # Docker configuration
├── .dockerignore               # Docker ignore file
├── vercel.json                  # Vercel deployment config
└── netlify.toml                 # Netlify deployment config
```

## 🚀 Setup Scripts

### Bash Setup Script (`scripts/setup.sh`)
Automated setup for Linux/macOS:
- Checks Node.js version (requires v18+)
- Verifies npm and git installation
- Installs dependencies
- Creates .env.local from template
- Runs verification checks

**Usage:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### PowerShell Setup Script (`scripts/setup.ps1`)
Windows-compatible setup script with the same functionality.

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

## ✅ Verification Scripts

### Setup Verification (`scripts/verify-setup.js`)
Checks:
- Required files and directories
- Package.json scripts
- Environment variables
- Dependencies installation
- Critical dependencies (next, react, react-dom)

**Usage:**
```bash
npm run verify
```

### Pre-Deployment Check (`scripts/pre-deploy-check.js`)
Comprehensive deployment readiness check:
- Environment variable validation
- ESLint execution
- TypeScript type checking
- Production build test
- Console.log detection
- TODO/FIXME comment detection
- Deployment config verification
- Sensitive data scanning

**Usage:**
```bash
npm run predeploy
```

## 🐳 Docker Configuration

### Dockerfile
Multi-stage build with 4 stages:
- **deps**: Install dependencies
- **builder**: Build the application
- **development**: Development environment
- **production**: Optimized production image

Features:
- Alpine Linux base (smaller image size)
- Non-root user for security
- Health check endpoint
- Proper signal handling with dumb-init

### docker-compose.yml
Two service configurations:
- **portfolio**: Development mode with hot reload
- **portfolio-prod**: Production mode (profile: production)

**Usage:**
```bash
# Development
npm run docker:dev

# Production
npm run docker:prod

# Build image
npm run docker:build
```

## 🔄 GitHub Actions

### CI Workflow (`.github/workflows/ci.yml`)
Runs on push/PR to main/develop:
- Linting with ESLint
- Type checking with TypeScript
- Production build test

### Deploy Workflow (`.github/workflows/deploy.yml`)
Automated deployment on push to main:
- Runs all CI checks
- Deploys to Vercel (requires secrets)

**Required Secrets:**
- `GITHUB_TOKEN`
- `GITHUB_USERNAME`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🛠️ VSCode Configuration

### Settings (`.vscode/settings.json`)
- Prettier as default formatter
- Format on save enabled
- ESLint auto-fix on save
- Tailwind CSS IntelliSense
- TypeScript workspace version

### Recommended Extensions (`.vscode/extensions.json`)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

## 📦 NPM Scripts

Added scripts to `package.json`:

```json
{
  "setup": "bash scripts/setup.sh",
  "setup:windows": "powershell -ExecutionPolicy Bypass -File scripts/setup.ps1",
  "verify": "node scripts/verify-setup.js",
  "predeploy": "node scripts/pre-deploy-check.js",
  "docker:build": "docker build -t portfolio:latest .",
  "docker:dev": "docker-compose up portfolio",
  "docker:prod": "docker-compose --profile production up portfolio-prod"
}
```

## 🚢 Deployment Configuration

### Vercel (`vercel.json`)
- Next.js framework detection
- Environment variable mapping
- Security headers
- Clean URLs enabled

### Netlify (`netlify.toml`)
- Build command configuration
- Next.js plugin integration
- Security headers
- SPA fallback routing

## 🔧 Usage Examples

### Initial Setup
```bash
# Clone repository
git clone <your-repo>
cd portfolio

# Run setup (Linux/macOS)
npm run setup

# Run setup (Windows)
npm run setup:windows
```

### Development
```bash
# Regular development
npm run dev

# Docker development
npm run docker:dev
```

### Pre-Deployment
```bash
# Run all checks
npm run predeploy

# If all checks pass, deploy
git push origin main  # Auto-deploys via GitHub Actions
```

### Manual Deployment
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Docker production
npm run docker:prod
```

## 🔒 Security Features

All configurations include:
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Non-root user in Docker
- Environment variable validation
- Sensitive data detection
- No telemetry in production

## 📝 Notes

- Shell scripts are designed to be cross-platform compatible
- All scripts include proper error handling
- Colored output for better user experience
- Scripts exit with appropriate status codes for CI/CD
- Docker images use Alpine Linux for minimal size
- Health checks included for production monitoring

## 🤝 Contributing

When adding new scripts:
1. Follow existing patterns
2. Add error handling
3. Include colored output
4. Update this documentation
5. Test on multiple platforms
6. Make shell scripts executable

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
