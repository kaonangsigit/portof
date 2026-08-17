# 📖 Development Guide | Panduan Pengembangan

Comprehensive development guide with best practices, code organization, and how to add new features.
Panduan pengembangan komprehensif dengan praktik terbaik, organisasi kode, dan cara menambahkan fitur baru.

---

## 📋 Table of Contents | Daftar Isi

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Organization](#code-organization)
4. [Best Practices](#best-practices)
5. [Adding New Features](#adding-new-features)
6. [Component Development](#component-development)
7. [API Development](#api-development)
8. [Styling Guide](#styling-guide)
9. [Testing Guide](#testing-guide)
10. [Debugging](#debugging)
11. [Common Tasks](#common-tasks)
12. [Performance Optimization](#performance-optimization)

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
- Node.js 18+ 
- npm 9+ or yarn 1.22+
- Git

# Optional
- Docker (for containerized development)
- VSCode (recommended editor)
```

### Initial Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd portfolio

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Add your GitHub token
# Edit .env.local and add:
# GITHUB_TOKEN=your_github_token
# GITHUB_USERNAME=your_username

# 5. Start development server
npm run dev

# 6. Open browser
# Navigate to http://localhost:3000
```

### Verification

```bash
# Run verification script
npm run verify

# Should output:
# ✓ Node.js version
# ✓ Dependencies installed
# ✓ Environment variables configured
# ✓ Build successful
```

---

## 🔄 Development Workflow

### Daily Development Flow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start dev server
npm run dev

# 4. Make changes and test
# ... code changes ...

# 5. Check for errors
npm run lint
npm run type-check

# 6. Commit changes
git add .
git commit -m "feat: add new feature"

# 7. Push to remote
git push origin feature/your-feature-name

# 8. Create pull request
# Use GitHub UI or gh CLI
```

### Git Commit Convention

Follow **Conventional Commits**:

```bash
# Format
<type>(<scope>): <description>

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
style:    # Formatting, missing semicolons, etc.
refactor: # Code restructuring
test:     # Adding tests
chore:    # Maintenance

# Examples
feat(projects): add filter by language
fix(api): handle GitHub rate limit error
docs(readme): update installation steps
style(button): adjust padding and colors
refactor(hooks): extract common logic
```

### Branch Naming

```bash
# Format: <type>/<description>

feature/add-blog-section
fix/github-api-timeout
docs/update-readme
refactor/component-structure
```

---

## 📁 Code Organization

### File Naming Conventions

```
Components:       PascalCase     → Hero.tsx, Navigation.tsx
Utilities:        camelCase      → fetcher.ts, validation.ts
Constants:        UPPER_SNAKE    → API_ENDPOINTS, CACHE_TTL
Types/Interfaces: PascalCase     → GitHubRepo, ApiResponse
Hooks:            camelCase      → useGitHub.ts, useTheme.ts
```

### Directory Structure Rules

```
/app              → Next.js pages and API routes
/components       → React components
  /ui             → Base/reusable UI components
/hooks            → Custom React hooks
/lib              → Business logic and utilities
/types            → TypeScript type definitions
/config           → Configuration files
/public           → Static assets
/scripts          → Build and deployment scripts
```

### Import Order

```typescript
// 1. External dependencies
import React from 'react';
import { motion } from 'framer-motion';

// 2. Internal components
import { Button } from '@/components/ui/Button';
import { Hero } from '@/components/Hero';

// 3. Hooks
import { useGitHub } from '@/hooks/useGitHub';

// 4. Utils and helpers
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/helpers';

// 5. Types
import type { Project } from '@/types';

// 6. Styles
import styles from './styles.module.css';
```

### Path Aliases

```typescript
// Configured in tsconfig.json
{
  "@/*": "./*",
  "@/components/*": "./components/*",
  "@/lib/*": "./lib/*",
  "@/hooks/*": "./hooks/*",
  "@/types/*": "./types/*"
}

// Usage
import { Button } from '@/components/ui/Button';
import { useGitHub } from '@/hooks/useGitHub';
```

---

## ✅ Best Practices

### 1. TypeScript Best Practices

```typescript
// ✅ DO: Use explicit types for public APIs
export function fetchRepos(username: string): Promise<Repo[]> {
  // ...
}

// ❌ DON'T: Use 'any'
function process(data: any) { } // Bad

// ✅ DO: Use specific types
function process(data: GitHubRepo) { } // Good

// ✅ DO: Use type inference for simple cases
const count = 5; // Type inferred as number

// ✅ DO: Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email?: string; // Optional property
}

// ✅ DO: Use enums for fixed values
enum Status {
  Pending = 'pending',
  Success = 'success',
  Error = 'error'
}

// ✅ DO: Use generics for reusable logic
function identity<T>(value: T): T {
  return value;
}
```

### 2. React Best Practices

```typescript
// ✅ DO: Use functional components
export function MyComponent({ title }: Props) {
  return <div>{title}</div>;
}

// ❌ DON'T: Use class components (unless necessary)
class MyComponent extends React.Component { }

// ✅ DO: Destructure props
function Button({ onClick, children, variant }: ButtonProps) { }

// ❌ DON'T: Use props directly
function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.children}</button>;
}

// ✅ DO: Use early returns
function Component({ data }: Props) {
  if (!data) return <Spinner />;
  if (data.error) return <Error />;
  return <Content data={data} />;
}

// ✅ DO: Extract complex logic to custom hooks
function useUserData(id: string) {
  const [user, setUser] = useState(null);
  // ... fetch logic
  return user;
}

// ✅ DO: Memoize expensive computations
const sortedItems = useMemo(() => 
  items.sort((a, b) => a.date - b.date),
  [items]
);

// ✅ DO: Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 3. Performance Best Practices

```typescript
// ✅ DO: Lazy load heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false
});

// ✅ DO: Use React.memo for expensive renders
export const ExpensiveComponent = memo(function ExpensiveComponent(props) {
  // ... expensive render logic
});

// ✅ DO: Optimize images
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  priority // For LCP
  placeholder="blur"
/>

// ✅ DO: Use proper loading states
function Projects() {
  const { data, loading, error } = useGitHub();
  
  if (loading) return <ProjectsSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;
  
  return <ProjectsList projects={data} />;
}
```

### 4. Security Best Practices

```typescript
// ✅ DO: Validate and sanitize inputs
function ContactForm() {
  const handleSubmit = (data: FormData) => {
    const validated = contactSchema.parse(data);
    const sanitized = sanitize(validated);
    // ... process
  };
}

// ✅ DO: Use environment variables for secrets
const token = process.env.GITHUB_TOKEN; // Server only!

// ❌ DON'T: Expose secrets to client
const apiKey = process.env.API_KEY; // Will be exposed!

// ✅ DO: Use NEXT_PUBLIC_ prefix for client vars
const publicUrl = process.env.NEXT_PUBLIC_SITE_URL;

// ✅ DO: Implement rate limiting
const limiter = new RateLimiter({ max: 100, windowMs: 900000 });

// ✅ DO: Add security headers
headers.set('X-Content-Type-Options', 'nosniff');
headers.set('X-Frame-Options', 'DENY');
```

### 5. Accessibility Best Practices

```typescript
// ✅ DO: Use semantic HTML
<nav>
  <ul>
    <li><a href="#about">About</a></li>
  </ul>
</nav>

// ✅ DO: Add ARIA labels
<button aria-label="Close modal" onClick={close}>
  <X />
</button>

// ✅ DO: Manage focus
const buttonRef = useRef<HTMLButtonElement>(null);
useEffect(() => {
  buttonRef.current?.focus();
}, []);

// ✅ DO: Use proper alt text
<Image src="/profile.jpg" alt="John Doe, Software Engineer" />

// ✅ DO: Ensure keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  onClick={handleClick}
>
  Click me
</div>
```

---

## 🎨 Adding New Features

### Feature Development Checklist

```
□ Plan the feature
□ Create feature branch
□ Write types/interfaces
□ Implement component/logic
□ Add styling
□ Write tests
□ Update documentation
□ Test in browser
□ Check accessibility
□ Review performance
□ Create pull request
```

### Example: Adding a Blog Section

#### Step 1: Plan the Feature

```markdown
## Blog Section Feature

**Requirements:**
- Display list of blog posts
- Each post shows title, excerpt, date
- Click to read full post
- Filter by category
- Search functionality

**Files to create:**
- /app/blog/page.tsx
- /app/blog/[slug]/page.tsx
- /components/BlogList.tsx
- /components/BlogPost.tsx
- /lib/blog.ts
- /types/blog.ts
```

#### Step 2: Create Types

```typescript
// types/blog.ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: Date;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}
```

#### Step 3: Create API/Data Layer

```typescript
// lib/blog.ts
import { BlogPost } from '@/types/blog';

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Fetch from CMS, file system, or API
  const response = await fetch('/api/blog/posts');
  return response.json();
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`/api/blog/posts/${slug}`);
  return response.json();
}

export function filterPosts(
  posts: BlogPost[],
  category?: string,
  search?: string
): BlogPost[] {
  let filtered = posts;
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (search) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return filtered;
}
```

#### Step 4: Create Components

```typescript
// components/BlogList.tsx
'use client';

import { useState } from 'react';
import { BlogPost } from '@/types/blog';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  
  const filtered = filterPosts(posts, filter, search);
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="mb-8 flex gap-4">
          <input
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="tech">Tech</option>
            <option value="design">Design</option>
          </select>
        </div>
        
        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <Card key={post.id}>
              <Card.Header>
                <Badge>{post.category}</Badge>
                <h3 className="text-xl font-bold mt-2">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(post.date)}
                </p>
              </Card.Header>
              <Card.Content>
                <p>{post.excerpt}</p>
              </Card.Content>
              <Card.Footer>
                <Button asChild>
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### Step 5: Create Pages

```typescript
// app/blog/page.tsx
import { getBlogPosts } from '@/lib/blog';
import { BlogList } from '@/components/BlogList';

export const metadata = {
  title: 'Blog | Your Name',
  description: 'Articles about web development, design, and technology'
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return (
    <main>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-600">
            Thoughts on web development and design
          </p>
        </div>
      </section>
      
      <BlogList posts={posts} />
    </main>
  );
}
```

```typescript
// app/blog/[slug]/page.tsx
import { getBlogPost, getBlogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getBlogPost(params.slug);
  return {
    title: `${post.title} | Your Name`,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Badge>{post.category}</Badge>
        <h1 className="text-4xl font-bold mt-4 mb-2">{post.title}</h1>
        <p className="text-gray-500 mb-8">
          {formatDate(post.date)} · {post.author.name}
        </p>
        
        <div className="prose prose-lg max-w-none">
          {/* Render markdown content */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
}
```

#### Step 6: Update Navigation

```typescript
// components/Navigation.tsx
const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' }, // Add this
  { href: '#contact', label: 'Contact' }
];
```

#### Step 7: Test the Feature

```bash
# Start dev server
npm run dev

# Test in browser:
# - Navigate to /blog
# - Search and filter posts
# - Click to read post
# - Check responsive design
# - Test keyboard navigation
# - Verify accessibility

# Check for errors
npm run lint
npm run type-check
```

---

## 🧱 Component Development

### Component Template

```typescript
// components/MyComponent.tsx
'use client'; // Only if using hooks/client features

import { useState } from 'react';
import { cn } from '@/lib/utils';

// 1. Define props interface
export interface MyComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

// 2. Component implementation
export function MyComponent({
  title,
  description,
  variant = 'default',
  className,
  children
}: MyComponentProps) {
  // 3. State
  const [isOpen, setIsOpen] = useState(false);
  
  // 4. Derived state
  const variantStyles = {
    default: 'bg-gray-100',
    primary: 'bg-blue-500',
    secondary: 'bg-green-500'
  };
  
  // 5. Event handlers
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  // 6. Render
  return (
    <div className={cn('p-4 rounded-lg', variantStyles[variant], className)}>
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
      
      <button onClick={handleToggle}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// 7. Display name (for debugging)
MyComponent.displayName = 'MyComponent';
```

### Compound Component Pattern

```typescript
// components/ui/Card.tsx
export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-lg border bg-white shadow', className)}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
};

Card.Content = function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-6 pb-6', className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-6 pb-6 pt-0', className)}>
      {children}
    </div>
  );
};

// Usage
<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Content>
    <p>Content</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

## 🔌 API Development

### API Route Template

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { cache } from '@/lib/cache';

// 1. Define request schema
const requestSchema = z.object({
  id: z.string(),
  filters: z.object({
    category: z.string().optional(),
    limit: z.number().optional()
  }).optional()
});

// 2. GET handler
export async function GET(request: NextRequest) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Validate
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }
    
    // Check cache
    const cacheKey = `example:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info('Cache hit', { key: cacheKey });
      return NextResponse.json(cached);
    }
    
    // Fetch data
    const data = await fetchData(id);
    
    // Cache result
    cache.set(cacheKey, data, 3600000); // 1 hour
    
    // Return response
    return NextResponse.json(data);
    
  } catch (error) {
    logger.error('GET /api/example error', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 3. POST handler
export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json();
    
    // Validate
    const validated = requestSchema.parse(body);
    
    // Process
    const result = await processData(validated);
    
    // Return
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    logger.error('POST /api/example error', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 4. Configure route
export const runtime = 'edge'; // Optional: use edge runtime
export const dynamic = 'force-dynamic'; // Optional: disable caching
```

---

## 🎨 Styling Guide

### Tailwind Best Practices

```typescript
// ✅ DO: Use Tailwind utilities
<div className="flex items-center justify-between p-4 bg-blue-500 rounded-lg">

// ✅ DO: Use cn() helper for conditional classes
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes',
  className
)}>

// ✅ DO: Extract repeated patterns
const buttonStyles = {
  base: 'px-4 py-2 rounded-lg font-medium transition',
  variant: {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  }
};

// ✅ DO: Use Tailwind config for custom values
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    }
  }
};

// Usage
<div className="bg-brand-500 text-brand-50">
```

### Responsive Design

```typescript
// Mobile-first approach
<div className="
  w-full           // Mobile: full width
  md:w-1/2         // Tablet: half width
  lg:w-1/3         // Desktop: third width
  p-4              // Mobile: padding 1rem
  md:p-6           // Tablet: padding 1.5rem
  lg:p-8           // Desktop: padding 2rem
">
```

### Dark Mode

```typescript
// Add dark mode classes
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border-gray-200 dark:border-gray-700
">
```

---

## 🧪 Testing Guide

### Unit Testing (Future)

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

```
□ Desktop Chrome
□ Desktop Firefox
□ Desktop Safari
□ Mobile iOS Safari
□ Mobile Android Chrome
□ Tablet view
□ Dark mode
□ Keyboard navigation
□ Screen reader (VoiceOver/NVDA)
□ Slow 3G network
□ Offline mode (if PWA)
```

---

## 🐛 Debugging

### Common Issues

```typescript
// Issue: Component not re-rendering
// Solution: Check dependencies in useEffect/useMemo
useEffect(() => {
  // This should include all dependencies
}, [dependency1, dependency2]);

// Issue: Stale closure
// Solution: Use functional updates
setCount(prevCount => prevCount + 1);

// Issue: Hydration mismatch
// Solution: Use useEffect for client-only code
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;

// Issue: Memory leak
// Solution: Cleanup in useEffect
useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

### Debug Tools

```typescript
// React DevTools
// - Install browser extension
// - Inspect component tree
// - Check props and state

// Next.js debugging
// - Check .next/cache
// - Review build output
// - Use console.log with identifiers

// Network debugging
// - Chrome DevTools Network tab
// - Check API responses
// - Monitor cache headers
```

---

## 📝 Common Tasks

### Add a New Page

```bash
# 1. Create page file
touch app/new-page/page.tsx

# 2. Add content
# app/new-page/page.tsx
export const metadata = {
  title: 'New Page'
};

export default function NewPage() {
  return <main>New Page Content</main>;
}

# 3. Add to navigation (if needed)
```

### Add a New Component

```bash
# 1. Create component file
touch components/NewComponent.tsx

# 2. Implement component
# 3. Export from index if in ui/
# 4. Use in pages
```

### Add a New API Route

```bash
# 1. Create route file
mkdir -p app/api/new-endpoint
touch app/api/new-endpoint/route.ts

# 2. Implement handlers
# 3. Add to API documentation
```

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all packages (carefully!)
npm update

# Audit security
npm audit
npm audit fix
```

---

## ⚡ Performance Optimization

### Bundle Analysis

```bash
# Install analyzer
npm install @next/bundle-analyzer

# Update next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"
  quality={85}
  placeholder="blur"
/>
```

### Code Splitting

```typescript
// Dynamic imports
const DynamicComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Spinner />,
  ssr: false
});

// Route-based splitting (automatic with Next.js)
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

This guide will help you maintain consistent, high-quality code throughout the project.
Panduan ini akan membantu Anda mempertahankan kode yang konsisten dan berkualitas tinggi di seluruh proyek.
