# 📁 FILE INDEX - Complete Project File Directory

## Complete Alphabetical Index of All Files

This document provides a comprehensive alphabetical index of every file in the project with descriptions.

**Total Files:** 150+ files  
**Last Updated:** July 19, 2026  
**Project:** Modern Portfolio Website

---

## 📋 Table of Contents

- [Root Directory Files](#root-directory-files)
- [Configuration Files](#configuration-files)
- [Documentation Files](#documentation-files)
- [App Directory](#app-directory)
- [Components Directory](#components-directory)
- [Library Directory](#library-directory)
- [Hooks Directory](#hooks-directory)
- [Types Directory](#types-directory)
- [Public Directory](#public-directory)
- [Scripts Directory](#scripts-directory)
- [Tests Directory](#tests-directory)
- [GitHub Directory](#github-directory)
- [VSCode Directory](#vscode-directory)

---

## Root Directory Files

### `.babelrc`
- **Type:** Configuration
- **Purpose:** Babel transpiler configuration for Jest testing
- **Contains:** Preset configurations for Next.js and TypeScript

### `.dockerignore`
- **Type:** Configuration
- **Purpose:** Specifies files/folders to exclude from Docker builds
- **Contains:** node_modules, .next, .git, documentation files

### `.editorconfig`
- **Type:** Configuration
- **Purpose:** Maintains consistent coding styles across different editors
- **Contains:** Indent style, charset, line endings

### `.env.example`
- **Type:** Template
- **Purpose:** Example environment variables template
- **Contains:** GITHUB_TOKEN, GITHUB_USERNAME, NEXT_PUBLIC_SITE_URL examples

### `.env.local`
- **Type:** Configuration (Gitignored)
- **Purpose:** Local environment variables (not committed to Git)
- **Contains:** Your actual API tokens and credentials

### `.eslintrc.js`
- **Type:** Configuration
- **Purpose:** ESLint configuration for JavaScript/JSX
- **Contains:** Linting rules for JavaScript files

### `.eslintrc.json`
- **Type:** Configuration
- **Purpose:** ESLint configuration for TypeScript
- **Contains:** Next.js ESLint rules, TypeScript settings

### `.gitignore`
- **Type:** Configuration
- **Purpose:** Specifies intentionally untracked files for Git
- **Contains:** node_modules, .next, .env.local, OS files

### `.nvmrc`
- **Type:** Configuration
- **Purpose:** Specifies Node.js version for NVM
- **Contains:** Node version 18.x

### `.prettierignore`
- **Type:** Configuration
- **Purpose:** Files to exclude from Prettier formatting
- **Contains:** .next, node_modules, build directories

### `.prettierrc`
- **Type:** Configuration
- **Purpose:** Prettier code formatting rules
- **Contains:** Semi-colons, quotes, trailing commas settings

### `check.bat`
- **Type:** Script (Windows)
- **Purpose:** Quick check script for Windows
- **Contains:** Commands to verify setup

### `check.sh`
- **Type:** Script (Unix/Mac)
- **Purpose:** Quick check script for Unix systems
- **Contains:** Commands to verify setup

### `Dockerfile`
- **Type:** Configuration
- **Purpose:** Docker container configuration for deployment
- **Contains:** Multi-stage build instructions

### `docker-compose.yml`
- **Type:** Configuration
- **Purpose:** Docker Compose orchestration configuration
- **Contains:** Service definitions for development and production

### `jest.config.js`
- **Type:** Configuration
- **Purpose:** Jest testing framework configuration
- **Contains:** Test environment, module mappings, coverage settings

### `jest.setup.js`
- **Type:** Configuration
- **Purpose:** Jest setup file that runs before tests
- **Contains:** Testing Library setup, custom matchers

### `jsconfig.json`
- **Type:** Configuration
- **Purpose:** JavaScript project configuration (for non-TS files)
- **Contains:** Path mappings, compiler options

### `LICENSE`
- **Type:** Legal
- **Purpose:** MIT License for the project
- **Contains:** Open source license terms

### `make-all-executable.sh`
- **Type:** Script
- **Purpose:** Makes all shell scripts executable
- **Contains:** chmod commands for all .sh files

### `make-executable.sh`
- **Type:** Script
- **Purpose:** Makes specific scripts executable
- **Contains:** chmod commands

### `middleware.ts`
- **Type:** Source Code
- **Purpose:** Next.js middleware for request processing
- **Contains:** Security headers, logging, rate limiting

### `netlify.toml`
- **Type:** Configuration
- **Purpose:** Netlify deployment configuration
- **Contains:** Build settings, redirects, headers

### `next.config.js`
- **Type:** Configuration
- **Purpose:** Next.js framework configuration
- **Contains:** Image domains, webpack config, environment variables

### `package.json`
- **Type:** Configuration
- **Purpose:** Node.js project manifest
- **Contains:** Dependencies, scripts, project metadata

### `package-lock.json`
- **Type:** Configuration (Auto-generated)
- **Purpose:** Locked versions of dependencies
- **Contains:** Exact dependency tree for reproducible installs

### `postcss.config.js`
- **Type:** Configuration
- **Purpose:** PostCSS configuration for CSS processing
- **Contains:** Tailwind CSS and Autoprefixer plugins

### `quick-check.bat`
- **Type:** Script (Windows)
- **Purpose:** Quick verification for Windows
- **Contains:** Fast check commands

### `quick-check.sh`
- **Type:** Script (Unix/Mac)
- **Purpose:** Quick verification for Unix systems
- **Contains:** Fast check commands

### `setup.bat`
- **Type:** Script (Windows)
- **Purpose:** Automated setup for Windows
- **Contains:** Installation and configuration commands

### `setup.sh`
- **Type:** Script (Unix/Mac)
- **Purpose:** Automated setup for Unix systems
- **Contains:** Installation and configuration commands

### `setup-complete.bat`
- **Type:** Script (Windows)
- **Purpose:** Post-setup completion script for Windows
- **Contains:** Verification and next steps

### `setup-complete.sh`
- **Type:** Script (Unix/Mac)
- **Purpose:** Post-setup completion script for Unix
- **Contains:** Verification and next steps

### `tailwind.config.ts`
- **Type:** Configuration
- **Purpose:** Tailwind CSS framework configuration
- **Contains:** Theme customization, plugins, colors

### `tsconfig.json`
- **Type:** Configuration
- **Purpose:** TypeScript compiler configuration
- **Contains:** Compiler options, path mappings, strict mode

### `vercel.json`
- **Type:** Configuration
- **Purpose:** Vercel deployment configuration
- **Contains:** Build settings, routes, headers

### `verify.bat`
- **Type:** Script (Windows)
- **Purpose:** Verification script for Windows
- **Contains:** Comprehensive checks

### `verify.sh`
- **Type:** Script (Unix/Mac)
- **Purpose:** Verification script for Unix systems
- **Contains:** Comprehensive checks

### `verify-complete.bat`
- **Type:** Script (Windows)
- **Purpose:** Complete verification for Windows
- **Contains:** All checks before deployment

### `verify-complete.sh`
- **Type:** Script (Unix/Mac)
- **Purpose:** Complete verification for Unix
- **Contains:** All checks before deployment

---

## Configuration Files

### `cypress.config.ts`
- **Location:** Root
- **Purpose:** Cypress E2E testing configuration
- **Contains:** Test settings, base URL, viewport sizes

### `next.config.js`
- **Location:** Root
- **Purpose:** Next.js configuration
- **Contains:** Image optimization, webpack, redirects

---

## Documentation Files

### `00-DOCUMENTATION-SUMMARY.md`
- **Purpose:** Summary of all documentation
- **Contains:** Overview of documentation structure

### `00-IMPLEMENTATION-SUMMARY.md`
- **Purpose:** Implementation progress summary
- **Contains:** What's implemented and what's pending

### `00-READ-FIRST.md`
- **Purpose:** First document to read
- **Contains:** Quick start and navigation guide

### `00-START-HERE-FIRST.md`
- **Purpose:** Getting started guide
- **Contains:** Step-by-step setup instructions

### `API_DOCUMENTATION.md`
- **Purpose:** API documentation
- **Contains:** API routes, endpoints, usage examples

### `ARCHITECTURE.md`
- **Purpose:** Technical architecture documentation
- **Contains:** System design, data flow, patterns used

### `BUILD_SUMMARY.md`
- **Purpose:** Build process summary
- **Contains:** Build steps, optimization, output

### `CHANGELOG.md`
- **Purpose:** Project change log
- **Contains:** Version history, updates, bug fixes

### `COMPLETE.md`
- **Purpose:** Project completion summary
- **Contains:** What's complete and ready to use

### `COMPLETION_SUMMARY.md`
- **Purpose:** Completion status overview
- **Contains:** Feature completion status

### `COMPLETION-NOTICE.md`
- **Purpose:** Completion notice
- **Contains:** Project completion announcement

### `COMPONENTS_COMPLETE.md`
- **Purpose:** Components completion status
- **Contains:** List of completed components

### `COMPONENTS_CREATED.md`
- **Purpose:** New components documentation
- **Contains:** Newly created components list

### `COMPONENTS_SETUP.md`
- **Purpose:** Component setup guide
- **Contains:** How components are structured

### `CONTRIBUTING.md`
- **Purpose:** Contribution guidelines
- **Contains:** How to contribute to the project

### `CUSTOMIZATION_GUIDE.md`
- **Purpose:** Customization instructions
- **Contains:** Step-by-step customization guide

### `CUSTOMIZATION_INSTRUCTIONS.md`
- **Purpose:** Detailed customization steps
- **Contains:** How to customize every aspect

### `CUSTOMIZATION.md`
- **Purpose:** Customization overview
- **Contains:** Quick customization reference

### `DATA_CONFIG_COMPLETE.md`
- **Purpose:** Data configuration completion
- **Contains:** Data setup completion status

### `DATA_CONFIGURATION.md`
- **Purpose:** Data configuration guide
- **Contains:** How to configure data files

### `DEPLOYMENT_CHECKLIST.md`
- **Purpose:** Pre-deployment checklist
- **Contains:** Steps before deploying

### `DEPLOYMENT.md`
- **Purpose:** Deployment guide
- **Contains:** How to deploy to various platforms

### `DEVELOPMENT.md`
- **Purpose:** Development guide
- **Contains:** Development best practices

### `DOCS-INDEX.md`
- **Purpose:** Documentation index
- **Contains:** Links to all documentation

### `DOCUMENTATION_INDEX.md`
- **Purpose:** Complete documentation index
- **Contains:** Organized documentation links

### `DOCUMENTATION-COMPLETE.md`
- **Purpose:** Documentation completion status
- **Contains:** What documentation is complete

### `ENV.md`
- **Purpose:** Environment variables guide
- **Contains:** How to set up environment variables

### `EXECUTIVE-SUMMARY.md`
- **Purpose:** Executive project summary
- **Contains:** High-level project overview

### `FAQ.md`
- **Purpose:** Frequently Asked Questions
- **Contains:** Common questions and answers

### `FEATURES.md`
- **Purpose:** Features documentation
- **Contains:** Complete feature list with descriptions

### `FILE_INDEX.md`
- **Purpose:** This file - Complete file index
- **Contains:** Alphabetical list of all files

### `FINAL_CHECKLIST.txt`
- **Purpose:** Final checklist before deployment
- **Contains:** Text format checklist

### `FINAL_PROJECT_STATUS.txt`
- **Purpose:** Final project status
- **Contains:** Plain text status report

### `FINAL_SUMMARY.md`
- **Purpose:** Final project summary
- **Contains:** Complete project overview

### `FINAL_SUMMARY.txt`
- **Purpose:** Text version of final summary
- **Contains:** Plain text summary

### `FINAL_VERIFICATION.txt`
- **Purpose:** Final verification log
- **Contains:** Verification results

### `FINAL-SUMMARY.md`
- **Purpose:** Markdown final summary
- **Contains:** Formatted final overview

### `GETTING_STARTED.md`
- **Purpose:** Getting started guide
- **Contains:** Quick start instructions

### `HELPER_SCRIPTS_COMPLETE.md`
- **Purpose:** Helper scripts documentation
- **Contains:** List of helper scripts and usage

### `IMAGE_REQUIREMENTS.md`
- **Purpose:** Image requirements guide
- **Contains:** Image specifications and formats

### `IMPLEMENTATION_COMPLETE_SUMMARY.md`
- **Purpose:** Implementation completion summary
- **Contains:** What's been implemented

### `IMPLEMENTATION_COMPLETE.md`
- **Purpose:** Implementation completion notice
- **Contains:** Completion announcement

### `IMPLEMENTATION_DATA_CONFIG.md`
- **Purpose:** Data configuration implementation
- **Contains:** How data config is implemented

### `IMPLEMENTATION_SUMMARY.md`
- **Purpose:** Implementation overview
- **Contains:** Summary of implementation

### `INSTALLATION_COMPLETE.md`
- **Purpose:** Installation completion guide
- **Contains:** Post-installation steps

### `LANGKAH_SELANJUTNYA.md`
- **Purpose:** Indonesian next steps guide
- **Contains:** Complete guide for fresh graduates in Indonesian

### `MASTER_INDEX.md`
- **Purpose:** Master index of all documentation
- **Contains:** Central navigation document

### `MULAI-DISINI.md`
- **Purpose:** Indonesian start here guide
- **Contains:** Getting started in Indonesian

### `NEW_COMPONENTS_SUMMARY.md`
- **Purpose:** New components summary
- **Contains:** Recently added components

### `PACKAGE-LOCK-INFO.md`
- **Purpose:** Package lock information
- **Contains:** About package-lock.json

### `PROJECT_COMPLETE.md`
- **Purpose:** Project completion document
- **Contains:** Project completion details

### `PROJECT_COMPLETION_REPORT.txt`
- **Purpose:** Completion report
- **Contains:** Text format completion report

### `PROJECT_FINAL_SUMMARY.md`
- **Purpose:** Ultimate project summary
- **Contains:** Comprehensive final summary

### `PROJECT_STATUS.txt`
- **Purpose:** Project status report
- **Contains:** Current project status

### `PROJECT_STRUCTURE.md`
- **Purpose:** Project structure documentation
- **Contains:** File and folder organization

### `PROJECT_SUMMARY.md`
- **Purpose:** Project summary overview
- **Contains:** Quick project overview

### `QUICK_CUSTOMIZATION.md`
- **Purpose:** Quick customization guide
- **Contains:** Fast customization steps

### `QUICK_REFERENCE.md`
- **Purpose:** Quick reference guide
- **Contains:** Quick lookup for commands

### `QUICK_START.md`
- **Purpose:** Quick start guide
- **Contains:** Fast setup instructions

### `QUICK-REFERENCE.md`
- **Purpose:** Alternate quick reference
- **Contains:** Command reference

### `QUICKSTART.md`
- **Purpose:** Quickstart guide
- **Contains:** Get started quickly

### `README_COMPONENTS.md`
- **Purpose:** Components README
- **Contains:** Component documentation

### `README-FIRST.md`
- **Purpose:** Read first document
- **Contains:** Initial guidance

### `README-ID.md`
- **Purpose:** Indonesian README
- **Contains:** Full documentation in Indonesian

### `README.md`
- **Purpose:** Main project README
- **Contains:** Primary documentation and guide

### `REUSABLE_COMPONENTS_GUIDE.md`
- **Purpose:** Reusable components guide
- **Contains:** How to use reusable components

### `SCRIPTS_IMPLEMENTATION_SUMMARY.md`
- **Purpose:** Scripts implementation summary
- **Contains:** Helper scripts overview

### `SCRIPTS_README.md`
- **Purpose:** Scripts documentation
- **Contains:** Script usage guide

### `SECURITY.md`
- **Purpose:** Security documentation
- **Contains:** Security features and practices

### `SETUP_CHECKLIST.md`
- **Purpose:** Setup checklist
- **Contains:** Step-by-step setup checklist

### `SETUP_COMPLETE.md`
- **Purpose:** Setup completion guide
- **Contains:** Post-setup instructions

### `SETUP_GUIDE.md`
- **Purpose:** Detailed setup guide
- **Contains:** Complete setup instructions

### `SETUP_IMAGES.md`
- **Purpose:** Image setup guide
- **Contains:** How to add images

### `START_HERE.md`
- **Purpose:** Start here guide
- **Contains:** Getting started instructions

### `START-HERE.md`
- **Purpose:** Alternate start guide
- **Contains:** Initial steps

### `START-HERE.txt`
- **Purpose:** Text version start guide
- **Contains:** Plain text getting started

### `TESTING_SETUP_COMPLETE.md`
- **Purpose:** Testing setup completion
- **Contains:** Testing configuration status

### `TESTING.md`
- **Purpose:** Testing guide
- **Contains:** How to run tests

### `TODO.md`
- **Purpose:** TODO list
- **Contains:** Pending tasks and features

### `TROUBLESHOOTING.md`
- **Purpose:** Troubleshooting guide
- **Contains:** Common issues and solutions

### `VERIFICATION_CHECKLIST.md`
- **Purpose:** Verification checklist
- **Contains:** Pre-deployment verification steps

---

## App Directory

### `app/layout.tsx`
- **Purpose:** Root layout component
- **Contains:** HTML structure, metadata, providers

### `app/page.tsx`
- **Purpose:** Homepage component
- **Contains:** All main sections (Hero, About, Skills, Projects, Contact)

### `app/error.tsx`
- **Purpose:** Error boundary component
- **Contains:** Error UI and recovery

### `app/loading.tsx`
- **Purpose:** Loading state component
- **Contains:** Loading spinner/skeleton

### `app/not-found.tsx`
- **Purpose:** 404 page component
- **Contains:** Custom 404 page UI

### `app/globals.css`
- **Purpose:** Global styles
- **Contains:** Tailwind directives, custom CSS

### `app/icon.tsx`
- **Purpose:** Dynamic favicon generation
- **Contains:** Favicon configuration

### `app/manifest.ts`
- **Purpose:** PWA manifest generation
- **Contains:** App metadata for PWA

### `app/opengraph-image.tsx`
- **Purpose:** Dynamic OG image generation
- **Contains:** Open Graph image configuration

### `app/robots.ts`
- **Purpose:** Dynamic robots.txt generation
- **Contains:** Crawling rules for search engines

### `app/sitemap.ts`
- **Purpose:** Dynamic sitemap generation
- **Contains:** Site structure for SEO

### `app/api/github/profile/route.ts`
- **Purpose:** GitHub profile API route
- **Contains:** Fetches GitHub user profile data

### `app/api/github/repos/route.ts`
- **Purpose:** GitHub repositories API route
- **Contains:** Fetches user repositories from GitHub

### `app/api/github/stats/route.ts`
- **Purpose:** GitHub stats API route
- **Contains:** Fetches GitHub statistics

---

## Components Directory

### `components/About.tsx`
- **Purpose:** About section component
- **Contains:** Bio, features, statistics

### `components/Achievements.tsx`
- **Purpose:** Achievements section component
- **Contains:** Display achievements and milestones

### `components/BackToTop.tsx`
- **Purpose:** Back to top button component
- **Contains:** Scroll to top functionality

### `components/Blog.tsx`
- **Purpose:** Blog section component (optional)
- **Contains:** Blog posts display

### `components/Contact.tsx`
- **Purpose:** Contact section component
- **Contains:** Social links and contact form

### `components/Education.tsx`
- **Purpose:** Education section component
- **Contains:** Educational background display

### `components/Experience.tsx`
- **Purpose:** Work experience component
- **Contains:** Job history timeline

### `components/Footer.tsx`
- **Purpose:** Footer component
- **Contains:** Footer content, links, copyright

### `components/Hero.tsx`
- **Purpose:** Hero section component
- **Contains:** Landing section with CTA

### `components/Navigation.tsx`
- **Purpose:** Navigation bar component
- **Contains:** Site navigation and mobile menu

### `components/Projects.tsx`
- **Purpose:** Projects section component
- **Contains:** GitHub projects display

### `components/ScrollToTop.tsx`
- **Purpose:** Scroll to top utility component
- **Contains:** Scroll functionality

### `components/Skills.tsx`
- **Purpose:** Skills section component
- **Contains:** Technology stack display

### `components/Stats.tsx`
- **Purpose:** Statistics component
- **Contains:** Metrics and counters

### `components/Testimonials.tsx`
- **Purpose:** Testimonials component (optional)
- **Contains:** Client testimonials display

### `components/ThemeToggle.tsx`
- **Purpose:** Dark mode toggle component
- **Contains:** Theme switching functionality

### `components/index.ts`
- **Purpose:** Component exports barrel file
- **Contains:** Exports all components

### `components/ui/Badge.tsx`
- **Purpose:** Badge UI component
- **Contains:** Reusable badge element

### `components/ui/Button.tsx`
- **Purpose:** Button UI component
- **Contains:** Reusable button element

### `components/ui/Card.tsx`
- **Purpose:** Card UI component
- **Contains:** Reusable card element

### `components/ui/Spinner.tsx`
- **Purpose:** Loading spinner component
- **Contains:** Loading animation

### `components/ui/index.ts`
- **Purpose:** UI components barrel file
- **Contains:** Exports all UI components

---

## Library Directory

### `lib/analytics.ts`
- **Purpose:** Analytics utilities
- **Contains:** Analytics tracking functions

### `lib/cache.ts`
- **Purpose:** Caching utilities
- **Contains:** In-memory cache implementation

### `lib/config.ts`
- **Purpose:** Configuration utilities
- **Contains:** App configuration helpers

### `lib/constants.ts`
- **Purpose:** Constants definition
- **Contains:** App-wide constants

### `lib/data.ts`
- **Purpose:** Main data configuration file
- **Contains:** All customizable data (personal info, skills, etc.)

### `lib/github.ts`
- **Purpose:** GitHub API utilities
- **Contains:** GitHub integration functions

### `lib/logger.ts`
- **Purpose:** Logging utilities
- **Contains:** Logger implementation

### `lib/seo.ts`
- **Purpose:** SEO utilities
- **Contains:** Meta tags, OG data generation

### `lib/types.ts`
- **Purpose:** Type definitions
- **Contains:** TypeScript type interfaces

### `lib/utils.ts`
- **Purpose:** Utility functions
- **Contains:** Helper functions

### `lib/validation.ts`
- **Purpose:** Validation utilities
- **Contains:** Input validation functions

### `lib/api.ts`
- **Purpose:** API utilities
- **Contains:** API client functions

### `lib/format.ts`
- **Purpose:** Formatting utilities
- **Contains:** Date, number formatting

### `lib/index.ts`
- **Purpose:** Library barrel file
- **Contains:** Exports all library functions

---

## Hooks Directory

### `hooks/index.ts`
- **Purpose:** Hooks barrel file
- **Contains:** Exports all custom hooks

### `hooks/useGitHub.ts`
- **Purpose:** GitHub data fetching hook
- **Contains:** Custom hook for GitHub API

### `hooks/useIntersectionObserver.ts`
- **Purpose:** Intersection observer hook
- **Contains:** Scroll animation trigger

### `hooks/useMediaQuery.ts`
- **Purpose:** Media query hook
- **Contains:** Responsive breakpoint detection

### `hooks/useScrollPosition.ts`
- **Purpose:** Scroll position hook
- **Contains:** Track scroll position

### `hooks/useScrollSpy.ts`
- **Purpose:** Scroll spy hook
- **Contains:** Active section tracking

### `hooks/useTheme.ts`
- **Purpose:** Theme management hook
- **Contains:** Dark mode functionality

---

## Types Directory

### `types/api.ts`
- **Purpose:** API type definitions
- **Contains:** API response types

### `types/index.ts`
- **Purpose:** Types barrel file
- **Contains:** Exports all type definitions

---

## Public Directory

### `public/favicon.ico`
- **Purpose:** Website favicon
- **Contains:** ICO format favicon

### `public/favicon.svg`
- **Purpose:** SVG favicon
- **Contains:** Scalable favicon

### `public/og-image.jpg`
- **Purpose:** Open Graph image
- **Contains:** Social media preview image

### `public/profile.jpg`
- **Purpose:** Profile photo
- **Contains:** Your profile picture

### `public/resume.pdf.txt`
- **Purpose:** Resume placeholder
- **Contains:** Note about adding resume

### `public/robots.txt`
- **Purpose:** Static robots.txt
- **Contains:** Fallback crawling rules

### `public/sitemap.xml`
- **Purpose:** Static sitemap
- **Contains:** Fallback sitemap

### `public/manifest.json`
- **Purpose:** PWA manifest
- **Contains:** Progressive web app configuration

### `public/icons/`
- **Purpose:** Icon directory
- **Contains:** Various icon sizes

### `public/images/`
- **Purpose:** Images directory
- **Contains:** Project images, screenshots

---

## Scripts Directory

### `scripts/health-check.js`
- **Purpose:** Health check script
- **Contains:** Application health verification

### `scripts/info.js`
- **Purpose:** Project info script
- **Contains:** Display project information

### `scripts/make-executable.sh`
- **Purpose:** Make scripts executable
- **Contains:** chmod commands

### `scripts/pre-deploy-check.js`
- **Purpose:** Pre-deployment checks
- **Contains:** Validation before deployment

### `scripts/quick-start.sh`
- **Purpose:** Quick start script
- **Contains:** Rapid setup commands

### `scripts/README.md`
- **Purpose:** Scripts documentation
- **Contains:** How to use scripts

### `scripts/setup.ps1`
- **Purpose:** Windows setup script
- **Contains:** PowerShell setup commands

### `scripts/setup.sh`
- **Purpose:** Unix setup script
- **Contains:** Bash setup commands

### `scripts/verify-setup.js`
- **Purpose:** Setup verification
- **Contains:** Verify installation

---

## Tests Directory

### `__tests__/components/About.test.tsx`
- **Purpose:** About component tests
- **Contains:** Unit tests for About component

### `__tests__/components/BackToTop.test.tsx`
- **Purpose:** BackToTop tests
- **Contains:** Unit tests for BackToTop

### `__tests__/components/Contact.test.tsx`
- **Purpose:** Contact component tests
- **Contains:** Unit tests for Contact

### `__tests__/components/Footer.test.tsx`
- **Purpose:** Footer component tests
- **Contains:** Unit tests for Footer

### `__tests__/components/Hero.test.tsx`
- **Purpose:** Hero component tests
- **Contains:** Unit tests for Hero

### `__tests__/components/Navigation.test.tsx`
- **Purpose:** Navigation tests
- **Contains:** Unit tests for Navigation

### `__tests__/components/Projects.test.tsx`
- **Purpose:** Projects component tests
- **Contains:** Unit tests for Projects

### `__tests__/components/Skills.test.tsx`
- **Purpose:** Skills component tests
- **Contains:** Unit tests for Skills

### `__tests__/components/ThemeToggle.test.tsx`
- **Purpose:** ThemeToggle tests
- **Contains:** Unit tests for theme switching

### `cypress/e2e/accessibility.cy.ts`
- **Purpose:** Accessibility E2E tests
- **Contains:** a11y testing scenarios

### `cypress/e2e/api.cy.ts`
- **Purpose:** API E2E tests
- **Contains:** API integration tests

### `cypress/e2e/home.cy.ts`
- **Purpose:** Homepage E2E tests
- **Contains:** Full page workflow tests

### `cypress/support/commands.ts`
- **Purpose:** Cypress custom commands
- **Contains:** Reusable test commands

### `cypress/support/component.ts`
- **Purpose:** Component test support
- **Contains:** Component testing setup

### `cypress/support/e2e.ts`
- **Purpose:** E2E test support
- **Contains:** E2E testing setup

---

## GitHub Directory

### `.github/workflows/`
- **Purpose:** GitHub Actions directory
- **Contains:** CI/CD workflow files (if configured)

---

## VSCode Directory

### `.vscode/extensions.json`
- **Purpose:** Recommended VSCode extensions
- **Contains:** List of helpful extensions

### `.vscode/settings.json`
- **Purpose:** VSCode workspace settings
- **Contains:** Editor configuration for project

---

## File Statistics

### By Type

**Source Code Files:** 76
- TypeScript/TSX: 35
- Configuration: 15
- Test files: 11
- Scripts: 9
- Library utilities: 14
- Hooks: 7
- Types: 2

**Documentation Files:** 40+
- Markdown guides: 40+
- Text files: 5

**Asset Files:** 20+
- Images: Variable
- Icons: Multiple sizes
- Fonts: Configured
- Metadata: 5

**Configuration Files:** 15
- Build configs: 5
- Test configs: 3
- Deployment configs: 4
- Editor configs: 3

---

## Quick File Lookup

### Need to Edit Data?
→ `lib/data.ts`

### Need to Configure Environment?
→ `.env.local` (create from `.env.example`)

### Need to Add Images?
→ `public/` directory

### Need to Customize Components?
→ `components/` directory

### Need to Add Tests?
→ `__tests__/` or `cypress/e2e/`

### Need to Update Documentation?
→ Root `.md` files

### Need to Modify Styles?
→ `app/globals.css` or `tailwind.config.ts`

### Need to Change API Routes?
→ `app/api/` directory

---

## File Naming Conventions

### Components
- **PascalCase:** `Hero.tsx`, `Navigation.tsx`
- **Location:** `components/`

### Utilities
- **camelCase:** `utils.ts`, `validation.ts`
- **Location:** `lib/`

### Hooks
- **use prefix:** `useGitHub.ts`, `useScrollSpy.ts`
- **Location:** `hooks/`

### Tests
- **Component.test.tsx:** `Hero.test.tsx`
- **feature.cy.ts:** `home.cy.ts`
- **Location:** `__tests__/` or `cypress/`

### Configuration
- **lowercase:** `next.config.js`, `.eslintrc.json`
- **Location:** Root directory

### Documentation
- **UPPERCASE.md:** `README.md`, `FEATURES.md`
- **Location:** Root directory

---

## Important Files to Never Delete

### Critical Files
- ✅ `package.json` - Project manifest
- ✅ `next.config.js` - Next.js configuration
- ✅ `tailwind.config.ts` - Styling configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/page.tsx` - Homepage
- ✅ `lib/data.ts` - Your data configuration

### Important But Regenerable
- `package-lock.json` - Can regenerate with `npm install`
- `.next/` - Build output, auto-generated
- `node_modules/` - Dependencies, auto-installed

---

## Files You Can Safely Delete

### Optional Documentation
- Extra README variants (keep main README.md)
- Duplicate guides
- Template text files (.txt versions if .md exists)

### Optional Features
- `components/Blog.tsx` - If not using blog
- `components/Testimonials.tsx` - If not using testimonials
- `cypress/` - If not running E2E tests
- Docker files - If not using Docker

---

## Summary

**Total Project Files:** 150+
- **Must Edit:** 2-3 files (lib/data.ts, .env.local, profile.jpg)
- **May Edit:** 10-15 files (components, styles)
- **Don't Touch:** 130+ files (configs, dependencies, build files)

**Key Takeaway:** This is a comprehensive, production-ready project with everything you need. Focus on customizing `lib/data.ts` and let the rest work its magic!

---

<div align="center">

**Complete File Index**

*Last Updated: July 19, 2026*  
*Total Files Documented: 150+*

[Back to Documentation Index](DOCUMENTATION_INDEX.md) | [Main README](README.md)

</div>
