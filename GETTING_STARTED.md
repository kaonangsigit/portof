# Getting Started Guide

**Complete step-by-step walkthrough for absolute beginners**

This guide will walk you through setting up and running your portfolio website from scratch. No prior experience required!

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [First Run](#first-run)
- [Understanding the Basics](#understanding-the-basics)
- [Making Your First Changes](#making-your-first-changes)
- [Next Steps](#next-steps)

---

## Prerequisites

### What You Need

Before starting, ensure you have these tools installed on your computer:

#### 1. Node.js (Required)

**What is it?** JavaScript runtime that allows you to run this project.

**Installation:**

**macOS:**
```bash
# Using Homebrew
brew install node@18

# OR download from nodejs.org
# Visit: https://nodejs.org/
```

**Windows:**
```bash
# Download installer from nodejs.org
# Visit: https://nodejs.org/
# Choose "LTS" version
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs
```

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

#### 2. Git (Required)

**What is it?** Version control system to manage your code.

**Installation:**

**macOS:**
```bash
# Usually pre-installed, if not:
brew install git
```

**Windows:**
```bash
# Download from git-scm.com
# Visit: https://git-scm.com/download/win
```

**Linux:**
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo dnf install git      # Fedora
```

**Verify installation:**
```bash
git --version  # Should show version number
```

#### 3. Code Editor (Recommended)

**Visual Studio Code** - Free, powerful code editor

Download from: https://code.visualstudio.com/

**Recommended VS Code Extensions:**
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

---

## Installation

### Step 1: Get the Code

If you have this folder already, skip to Step 2.

```bash
# Clone the repository (if applicable)
git clone <your-repository-url>
cd Portofolio
```

### Step 2: Install Dependencies

This downloads all the libraries and tools the project needs.

```bash
npm install
```

**What happens:** npm reads `package.json` and downloads all dependencies into `node_modules/` folder.

**Time:** 2-5 minutes depending on internet speed.

**Troubleshooting:**
```bash
# If you get errors, try:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Step 3: Set Up Environment Variables

Environment variables store sensitive information and configuration.

```bash
# Copy the example file
cp .env.example .env.local
```

**Edit `.env.local` with your information:**

```bash
# Open in your editor
code .env.local  # VS Code
# OR
nano .env.local  # Terminal editor
```

**Required variables:**
```bash
# Base URL - change this in production
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email API - for contact form (optional for now)
RESEND_API_KEY=your_resend_api_key_here

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Getting API Keys:**

**Resend (Email):**
1. Visit https://resend.com
2. Sign up for free account
3. Create API key in dashboard
4. Copy key to `.env.local`

**Google Analytics (Optional):**
1. Visit https://analytics.google.com
2. Create account/property
3. Get tracking ID (G-XXXXXXXXXX)
4. Copy to `.env.local`

---

## Project Structure

Understanding where everything lives:

```
Portofolio/
│
├── app/                      # Pages & routing (Next.js App Router)
│   ├── layout.tsx           # Root layout (wraps all pages)
│   ├── page.tsx             # Homepage (/)
│   ├── about/               
│   │   └── page.tsx         # About page (/about)
│   ├── projects/            
│   │   └── page.tsx         # Projects page (/projects)
│   └── contact/             
│       └── page.tsx         # Contact page (/contact)
│
├── components/               # Reusable UI components
│   ├── Hero.tsx             # Hero section component
│   ├── Navigation.tsx       # Navigation bar
│   ├── Projects.tsx         # Projects showcase
│   ├── Skills.tsx           # Skills display
│   ├── Contact.tsx          # Contact form
│   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   └── ScrollToTop.tsx      # Scroll to top button
│
├── lib/                      # Utility functions & data
│   ├── data.ts              # Your portfolio data (CUSTOMIZE THIS!)
│   ├── seo.ts               # SEO utilities
│   └── analytics.ts         # Analytics tracking
│
├── public/                   # Static files (images, icons)
│   ├── images/              # Your images go here
│   ├── favicon.ico          # Browser tab icon
│   └── manifest.json        # PWA configuration
│
├── styles/                   # Global styles
│   └── globals.css          # Global CSS
│
├── .env.local               # Environment variables (DO NOT COMMIT)
├── .env.example             # Example env file (safe to commit)
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies & scripts
```

---

## First Run

### Start the Development Server

```bash
npm run dev
```

**What happens:**
- Next.js starts a development server
- Your site is available at `http://localhost:3000`
- Hot reload is enabled (changes update automatically)
- Terminal shows compilation status

**Output you should see:**
```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Ready in 2.3s
```

### Open Your Browser

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You should see your portfolio website!

**Troubleshooting:**

**Port 3000 already in use:**
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# OR use a different port
npm run dev -- -p 3001
```

**Page not loading:**
- Check terminal for errors
- Ensure `npm install` completed successfully
- Try clearing browser cache (Ctrl+Shift+R / Cmd+Shift+R)

---

## Understanding the Basics

### How Pages Work

In Next.js 14 with App Router, pages are defined by folder structure:

```
app/
├── page.tsx           → http://localhost:3000/
├── about/
│   └── page.tsx       → http://localhost:3000/about
└── projects/
    └── page.tsx       → http://localhost:3000/projects
```

**Example page (`app/page.tsx`):**
```tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to my portfolio</h1>
    </div>
  );
}
```

### How Components Work

Components are reusable pieces of UI:

**Example (`components/Button.tsx`):**
```tsx
type ButtonProps = {
  text: string;
  onClick: () => void;
};

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  );
}
```

**Using the component:**
```tsx
import Button from '@/components/Button';

export default function Page() {
  return <Button text="Click me" onClick={() => alert('Clicked!')} />;
}
```

### How Data Works

Your portfolio data lives in `lib/data.ts`:

```typescript
export const personalInfo = {
  name: "Your Name",
  title: "Full-Stack Developer",
  email: "your@email.com",
  // ...
};

export const projects = [
  {
    title: "Project 1",
    description: "Description here",
    // ...
  },
];
```

This data is imported and used in components:

```tsx
import { personalInfo } from '@/lib/data';

export default function Hero() {
  return <h1>{personalInfo.name}</h1>;
}
```

---

## Making Your First Changes

### Change 1: Update Your Name

**File:** `lib/data.ts`

**Find this:**
```typescript
export const personalInfo = {
  name: "Kao Nangprakoso",
  // ...
};
```

**Change to:**
```typescript
export const personalInfo = {
  name: "Your Name",  // ← Your actual name
  // ...
};
```

**Save the file** - The page updates automatically!

### Change 2: Update Your Bio

**File:** `lib/data.ts`

**Find this:**
```typescript
export const personalInfo = {
  // ...
  bio: "Passionate full-stack developer...",
};
```

**Change to your bio:**
```typescript
export const personalInfo = {
  // ...
  bio: "Your professional bio here. Describe what you do!",
};
```

### Change 3: Add a Project

**File:** `lib/data.ts`

**Add to the projects array:**
```typescript
export const projects = [
  // ... existing projects
  {
    title: "My Awesome Project",
    description: "What this project does",
    longDescription: "Detailed description...",
    image: "/images/projects/my-project.png",
    technologies: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/yourusername/project",
    demo: "https://project-demo.com",
    featured: true,
  },
];
```

**Don't forget to add the image:**
- Place image in `public/images/projects/my-project.png`

### Change 4: Update Social Links

**File:** `lib/data.ts`

```typescript
export const personalInfo = {
  // ...
  github: "your-github-username",
  linkedin: "your-linkedin-username",
  twitter: "your-twitter-handle",
};
```

### Change 5: Customize Colors

**File:** `tailwind.config.ts`

**Find the colors section:**
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',   // ← Lightest shade
        // ... more shades
        900: '#1e3a8a',  // ← Darkest shade
      },
    },
  },
},
```

**Use a color generator:**
- Visit https://uicolors.app/create
- Pick your primary color
- Copy the generated shades
- Replace in config

---

## Development Workflow

### Typical Development Session

```bash
# 1. Start development server
npm run dev

# 2. Make changes in your editor
# 3. Check browser - changes appear automatically
# 4. Check terminal for any errors

# 5. When done, stop server
# Press Ctrl+C in terminal
```

### Testing Changes

```bash
# Check for TypeScript errors
npm run type-check

# Check for code style issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

### Before Committing

```bash
# Run all checks
npm run build  # Ensures production build works
npm run lint   # Checks code quality
npm run test   # Runs tests (if any)
```

---

## Common Tasks

### Adding a New Page

1. Create folder in `app/`: `app/blog/`
2. Create `page.tsx` inside: `app/blog/page.tsx`
3. Add content:

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'My blog posts',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Blog</h1>
      <p>Blog content here...</p>
    </div>
  );
}
```

4. Access at: `http://localhost:3000/blog`

### Adding Images

1. Place image in `public/images/`
2. Use in components:

```tsx
import Image from 'next/image';

<Image
  src="/images/your-image.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

### Updating Styles

**Using Tailwind Classes:**
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  Content
</div>
```

**Custom CSS:**
1. Add to `styles/globals.css`
2. Use in components

---

## Next Steps

Now that you have the basics:

1. **Customize Your Portfolio**
   - Read [CUSTOMIZATION.md](./CUSTOMIZATION.md)
   - Update all personal information
   - Add your projects
   - Add your images

2. **Learn the Technologies**
   - **Next.js**: [nextjs.org/learn](https://nextjs.org/learn)
   - **React**: [react.dev/learn](https://react.dev/learn)
   - **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs)
   - **Tailwind**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

3. **Prepare for Deployment**
   - Read [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Set up Vercel account
   - Deploy your portfolio

4. **Explore Advanced Features**
   - Add blog functionality
   - Implement CMS
   - Add animations
   - Optimize performance

---

## Getting Help

**Stuck? Here's how to get help:**

1. **Check Documentation**
   - Read relevant .md files in this project
   - Check official docs for the technology

2. **Search Online**
   - Google your error message
   - Check Stack Overflow
   - Read Next.js discussions

3. **Debug Yourself**
   - Check browser console (F12)
   - Check terminal output
   - Add console.log() statements

4. **Ask for Help**
   - Open GitHub issue
   - Ask in Next.js Discord
   - Post on Stack Overflow

---

## Glossary

**Common terms you'll encounter:**

- **npm**: Node Package Manager - installs project dependencies
- **Component**: Reusable piece of UI (like a button or card)
- **Props**: Data passed to components
- **State**: Data that changes over time
- **Route**: URL path that shows a specific page
- **Build**: Process of creating production-ready code
- **Deploy**: Publishing your website to the internet
- **Environment Variable**: Configuration value (like API keys)
- **Hot Reload**: Automatic page update when you save changes
- **TypeScript**: JavaScript with type checking
- **Tailwind**: Utility-first CSS framework

---

**Congratulations!** You now know the basics of working with this portfolio project. Continue to [CUSTOMIZATION.md](./CUSTOMIZATION.md) to make it truly yours!
