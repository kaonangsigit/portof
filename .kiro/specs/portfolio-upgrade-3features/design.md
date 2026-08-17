# Design Document — Portfolio Upgrade 3 Features

## Overview

Dokumen ini mendeskripsikan arsitektur teknis untuk tiga fitur upgrade portofolio Next.js 14:
1. **3D Visual Hero** — React Three Fiber hero section interaktif
2. **GitHub Data Real-time** — Fetch GitHub API dengan ISR dan client-side state
3. **Admin Panel CMS** — Halaman `/admin` terproteksi password untuk manajemen konten

Stack: Next.js 14.2.28 (App Router), TypeScript, Tailwind CSS, `@react-three/fiber`, `@react-three/drei`, `three`, `@octokit/rest`

---

## Architecture Overview

```
app/
  page.tsx               ← Hero3DScene + GitHubSection terintegrasi
  admin/
    layout.tsx           ← Admin shell (auth guard)
    page.tsx             ← Dashboard admin
  api/
    admin/
      login/route.ts     ← POST login, issue cookie
      logout/route.ts    ← POST logout, clear cookie
    github/
      profile/route.ts   ← GET profil GitHub (ISR 3600s)
      repos/route.ts     ← GET daftar repo (ISR 3600s) [sudah ada]
      stats/route.ts     ← GET stats agregat [sudah ada, diupdate]
    certificates/
      route.ts           ← GET/POST sertifikat
      [id]/route.ts      ← DELETE sertifikat
    projects/
      route.ts           ← GET/POST projects
      [id]/route.ts      ← PUT/DELETE project
    content/route.ts     ← GET/PUT konten JSON

components/
  3d/
    Hero3DScene.tsx      ← Canvas + camera setup
    ParticleField.tsx    ← 80+ partikel
    FloatingShapes.tsx   ← 5+ geometri melayang
    HeroFallback.tsx     ← CSS fallback tanpa WebGL
  github/
    GitHubSection.tsx    ← Container utama
    GitHubStats.tsx      ← Kartu statistik agregat
    RepoCard.tsx         ← Kartu per repository
    LanguageChart.tsx    ← Bar chart top 5 bahasa
    ContributionGraph.tsx← Embed ghchart.rshah.org
    GitHubSkeleton.tsx   ← Loading skeleton
  admin/
    AdminNav.tsx         ← Tab navigasi admin
    CertificateUploader.tsx
    ProjectForm.tsx
    PersonalInfoForm.tsx
    LoginForm.tsx

lib/
  github.ts              ← fetchGitHubProfile, fetchGitHubRepos [update]
  cms-loader.ts          ← readContent, writeContent, appendContent
  admin-auth.ts          ← validateSession, createSessionToken

content/
  personal.json
  skills.json
  projects.json
  certificates.json

middleware.ts            ← Update: tambah /admin route protection
```

---

## Feature 1: 3D Visual Hero

### Component Hierarchy

```
Hero.tsx (existing)
  └── Suspense fallback={<HeroFallback />}
        └── Hero3DScene (dynamic import, SSR disabled)
              ├── Canvas (@react-three/fiber)
              │     ├── PerspectiveCamera (drei)
              │     ├── ambientLight + directionalLight
              │     ├── ParticleField
              │     └── FloatingShapes
              └── Mouse/Scroll event listeners
```

### File: `components/3d/Hero3DScene.tsx`

```typescript
"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroFallback from "./HeroFallback";

// SSR disabled — Three.js requires browser canvas API
const Hero3DSceneInner = dynamic(
  () => import("./Hero3DSceneInner"),
  { ssr: false }
);

export default function Hero3DScene() {
  return (
    <Suspense fallback={<HeroFallback />}>
      <Hero3DSceneInner />
    </Suspense>
  );
}
```

### File: `components/3d/Hero3DSceneInner.tsx`

```typescript
"use client";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, AdaptiveDpr } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import ParticleField from "./ParticleField";
import FloatingShapes from "./FloatingShapes";
import HeroFallback from "./HeroFallback";

interface SceneProps {
  mouseX: number; // normalized -1 to 1
  mouseY: number; // normalized -1 to 1
  scrollProgress: number; // 0 to 1
}

export default function Hero3DSceneInner() {
  const [webglSupported, setWebglSupported] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // WebGL detection
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    // Mouse parallax handler
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };

    // Scroll handler
    const onScroll = () => {
      const hero = document.getElementById("home");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      setScrollProgress(progress);
    };

    // Page Visibility API — pause animation when tab hidden
    const onVisibilityChange = () => {
      // Canvas rendering pauses automatically via useFrame check
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!webglSupported) return <HeroFallback />;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas>
        <AdaptiveDpr pixelated />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SceneCamera mouseX={mousePos.x} mouseY={mousePos.y} scrollProgress={scrollProgress} />
        <ParticleField />
        <FloatingShapes scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

// Camera controller with mouse parallax — max 0.05 rad/unit
function SceneCamera({ mouseX, mouseY, scrollProgress }: SceneProps) {
  const MAX_ROTATION = 0.05;
  useFrame((state) => {
    if (document.hidden) return; // Page Visibility API pause
    state.camera.rotation.y += (mouseX * MAX_ROTATION - state.camera.rotation.y) * 0.05;
    state.camera.rotation.x += (mouseY * MAX_ROTATION - state.camera.rotation.x) * 0.05;
    state.camera.position.z = 5 + scrollProgress * 2; // zoom out on scroll
  });
  return null;
}
```

### File: `components/3d/ParticleField.tsx`

```typescript
"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 100; // >= 80 per Requirement 1.2

export default function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);

  // Generate random positions once
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (document.hidden || !meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posAttr.array[i * 3] += velocities[i * 3];
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2];
      // Wrap around bounds
      if (Math.abs(posAttr.array[i * 3]) > 5) velocities[i * 3] *= -1;
      if (Math.abs(posAttr.array[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posAttr.array[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.7} />
    </points>
  );
}
```

### File: `components/3d/FloatingShapes.tsx`

```typescript
"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShapeConfig {
  position: [number, number, number];
  geometry: "box" | "torus" | "octahedron" | "dodecahedron" | "sphere";
  rotationSpeed: [number, number, number];
  color: string;
}

// Minimum 5 shapes per Requirement 1.3
const SHAPES: ShapeConfig[] = [
  { position: [-3, 1, -2], geometry: "box", rotationSpeed: [0.01, 0.02, 0], color: "#3b82f6" },
  { position: [3, -1, -3], geometry: "torus", rotationSpeed: [0.02, 0, 0.01], color: "#8b5cf6" },
  { position: [0, 2, -4], geometry: "octahedron", rotationSpeed: [0, 0.01, 0.02], color: "#06b6d4" },
  { position: [-2, -2, -2], geometry: "dodecahedron", rotationSpeed: [0.015, 0.005, 0.01], color: "#10b981" },
  { position: [2, 2, -1], geometry: "sphere", rotationSpeed: [0.005, 0.02, 0.015], color: "#f59e0b" },
  { position: [-1, 0, -5], geometry: "torus", rotationSpeed: [0.01, 0.015, 0.005], color: "#ec4899" },
];

function Shape({ config, scrollProgress }: { config: ShapeConfig; scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (document.hidden || !meshRef.current) return;
    meshRef.current.rotation.x += config.rotationSpeed[0];
    meshRef.current.rotation.y += config.rotationSpeed[1];
    meshRef.current.rotation.z += config.rotationSpeed[2];
    // Scroll-triggered: fade out and move up
    meshRef.current.position.y = config.position[1] + scrollProgress * 2;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 1 - scrollProgress;
  });

  return (
    <mesh ref={meshRef} position={config.position}>
      {config.geometry === "box" && <boxGeometry args={[0.5, 0.5, 0.5]} />}
      {config.geometry === "torus" && <torusGeometry args={[0.4, 0.15, 16, 100]} />}
      {config.geometry === "octahedron" && <octahedronGeometry args={[0.4]} />}
      {config.geometry === "dodecahedron" && <dodecahedronGeometry args={[0.4]} />}
      {config.geometry === "sphere" && <sphereGeometry args={[0.35, 32, 32]} />}
      <meshStandardMaterial color={config.color} transparent wireframe />
    </mesh>
  );
}

export default function FloatingShapes({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {SHAPES.map((shape, i) => (
        <Shape key={i} config={shape} scrollProgress={scrollProgress} />
      ))}
    </>
  );
}
```

### File: `components/3d/HeroFallback.tsx`

```typescript
// Fallback CSS-only hero — rendered when WebGL unavailable or during Suspense
import { personalInfo } from "@/lib/data";

export default function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Animated CSS gradient orbs as fallback visual */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-400/20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-purple-400/20 animate-bounce" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-400/10 animate-spin" style={{ animationDuration: "8s" }} />
    </div>
  );
}
```

### Integration in `components/Hero.tsx`

```typescript
"use client";
import { personalInfo } from "@/lib/data";
import Hero3DScene from "./3d/Hero3DScene";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center ...">
      {/* 3D scene rendered behind content */}
      <Hero3DScene />
      {/* Existing content unchanged */}
      <div className="relative z-10 max-w-6xl mx-auto ...">
        {/* ... existing Hero content ... */}
      </div>
    </section>
  );
}
```

---

## Feature 2: GitHub Data Real-time

### Data Flow

```
Server (ISR):
  /api/github/profile  →  fetchGitHubProfile()  →  GitHub API
  /api/github/repos    →  fetchGitHubRepos()     →  GitHub API
  /api/github/stats    →  computed from repos+profile

Client:
  GitHubSection  →  fetch("/api/github/stats")
                →  fetch("/api/github/repos")
  Display: GitHubStats + RepoCard(x6) + LanguageChart + ContributionGraph
```

### TypeScript Types

```typescript
// lib/github.ts additions

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  publicRepos: number;
  followers: number;
  topLanguages: Array<{ language: string; count: number }>;
}
```

### Updated `lib/github.ts`

```typescript
import { siteConfig } from "@/lib/config";
import type { GitHubProfile, GitHubRepo, GitHubStats } from "./github.types";

const GITHUB_API = "https://api.github.com";

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
  if (!siteConfig.github.token) {
    console.warn("[GitHub] GITHUB_TOKEN is not set — using anonymous rate limit (60 req/hr)");
  } else {
    headers.Authorization = `Bearer ${siteConfig.github.token}`;
  }
  return headers;
}

export async function fetchGitHubProfile(username?: string): Promise<GitHubProfile> {
  const user = username ?? siteConfig.github.username;
  const res = await fetch(`${GITHUB_API}/users/${user}`, {
    headers: buildHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub profile fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchGitHubRepos(username?: string): Promise<GitHubRepo[]> {
  const user = username ?? siteConfig.github.username;
  const res = await fetch(
    `${GITHUB_API}/users/${user}/repos?sort=updated&per_page=100`,
    { headers: buildHeaders(), next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`);
  return res.json();
}

// Pure function — testable
export function computeGitHubStats(repos: GitHubRepo[], profile: GitHubProfile): GitHubStats {
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);
  const langCount: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1;
  }
  const topLanguages = Object.entries(langCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([language, count]) => ({ language, count }));

  return {
    totalStars,
    totalForks,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    topLanguages,
  };
}

// Returns top N repos sorted by updated_at
export function getTopRepos(repos: GitHubRepo[], n = 6): GitHubRepo[] {
  return [...repos]
    .filter(r => !r.fork)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, n);
}
```

### API Routes

**`app/api/github/profile/route.ts`**
```typescript
import { NextResponse } from "next/server";
import { fetchGitHubProfile } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const profile = await fetchGitHubProfile();
    return NextResponse.json(profile, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch GitHub profile" }, { status: 500 });
  }
}
```

**`app/api/github/stats/route.ts`** (updated)
```typescript
import { NextResponse } from "next/server";
import { fetchGitHubProfile, fetchGitHubRepos, computeGitHubStats } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const [profile, repos] = await Promise.all([
      fetchGitHubProfile(),
      fetchGitHubRepos(),
    ]);
    const stats = computeGitHubStats(repos, profile);
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to compute GitHub stats" }, { status: 500 });
  }
}
```

### Client Components

**`components/github/GitHubSection.tsx`**

```typescript
"use client";
import { useState, useEffect } from "react";
import type { GitHubStats, GitHubRepo } from "@/lib/github";
import GitHubStats from "./GitHubStats";
import RepoCard from "./RepoCard";
import LanguageChart from "./LanguageChart";
import ContributionGraph from "./ContributionGraph";
import GitHubSkeleton from "./GitHubSkeleton";
import { siteConfig } from "@/lib/config";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export default function GitHubSection() {
  const username = siteConfig.github.username;
  const [stats, setStats] = useState<FetchState<GitHubStats>>({ data: null, loading: true, error: null });
  const [repos, setRepos] = useState<FetchState<GitHubRepo[]>>({ data: null, loading: true, error: null });

  const fetchData = async () => {
    setStats({ data: null, loading: true, error: null });
    setRepos({ data: null, loading: true, error: null });
    try {
      const [statsRes, reposRes] = await Promise.all([
        fetch("/api/github/stats"),
        fetch("/api/github/repos"),
      ]);
      if (!statsRes.ok) throw new Error(`Stats: ${statsRes.status}`);
      if (!reposRes.ok) throw new Error(`Repos: ${reposRes.status}`);
      const [statsData, reposData] = await Promise.all([statsRes.json(), reposRes.json()]);
      setStats({ data: statsData, loading: false, error: null });
      setRepos({ data: reposData, loading: false, error: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal mengambil data GitHub";
      setStats(s => ({ ...s, loading: false, error: msg }));
      setRepos(s => ({ ...s, loading: false, error: msg }));
    }
  };

  useEffect(() => { fetchData(); }, []);

  const isLoading = stats.loading || repos.loading;
  const hasError = stats.error || repos.error;

  if (isLoading) return <GitHubSkeleton />;

  if (hasError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{hasError}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section id="github" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">GitHub Activity</h2>
        {stats.data && <GitHubStats stats={stats.data} />}
        {stats.data && <LanguageChart languages={stats.data.topLanguages} />}
        <ContributionGraph username={username} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {repos.data?.slice(0, 6).map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            View all on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
```

**`components/github/GitHubStats.tsx`**

```typescript
import type { GitHubStats } from "@/lib/github";

const STAT_ITEMS = [
  { key: "totalStars" as const, label: "Total Stars", icon: "⭐" },
  { key: "totalForks" as const, label: "Total Forks", icon: "🍴" },
  { key: "publicRepos" as const, label: "Public Repos", icon: "📦" },
  { key: "followers" as const, label: "Followers", icon: "👥" },
];

export default function GitHubStats({ stats }: { stats: GitHubStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {STAT_ITEMS.map(item => (
        <div key={item.key} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <span className="text-2xl">{item.icon}</span>
          <p className="text-2xl font-bold mt-1">{stats[item.key]}</p>
          <p className="text-sm text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
```

**`components/github/RepoCard.tsx`**

```typescript
import type { GitHubRepo } from "@/lib/github";

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{repo.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{repo.description ?? "No description"}</p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        {repo.language && <span className="flex items-center gap-1">● {repo.language}</span>}
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴 {repo.forks_count}</span>
      </div>
    </a>
  );
}
```

**`components/github/LanguageChart.tsx`**

```typescript
interface Language { language: string; count: number; }

export default function LanguageChart({ languages }: { languages: Language[] }) {
  const max = Math.max(...languages.map(l => l.count), 1);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm">
      <h3 className="font-semibold mb-4">Top Languages</h3>
      <div className="space-y-2">
        {languages.map(({ language, count }) => (
          <div key={language} className="flex items-center gap-3">
            <span className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate">{language}</span>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="w-6 text-xs text-gray-400 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**`components/github/ContributionGraph.tsx`**

```typescript
export default function ContributionGraph({ username }: { username: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm overflow-hidden">
      <h3 className="font-semibold mb-4">Contribution Graph</h3>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://ghchart.rshah.org/${username}`}
        alt={`GitHub contribution chart for ${username}`}
        className="w-full"
        loading="lazy"
      />
    </div>
  );
}
```

**`components/github/GitHubSkeleton.tsx`**

```typescript
export default function GitHubSkeleton() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-6" />
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Feature 3: Admin Panel CMS

### Authentication Flow

```
User → GET /admin
     ↓ no cookie
     LoginForm (client component)
     ↓ POST /api/admin/login { password }
     ↓ server hashes password with SHA-256
     ↓ compare with hash(ADMIN_PASSWORD)
     ↓ match → Set-Cookie: admin_session=<token>; HttpOnly; SameSite=Strict; MaxAge=86400
     ↓ redirect to /admin dashboard

middleware.ts → match /admin/** → validate cookie → 401 or pass
```

### TypeScript Types

```typescript
// lib/admin-auth.ts types

export interface AdminSession {
  token: string;        // SHA-256 hash of timestamp+secret
  createdAt: number;    // Unix timestamp ms
  expiresAt: number;    // createdAt + 24h
}

// content/ JSON types

export interface Certificate {
  id: string;           // UUID v4
  title: string;
  issuer: string;
  date: string;         // ISO date string
  image: string;        // path: /certificates/{filename}
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  category: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  skills: string[];
}
```

### `lib/admin-auth.ts`

```typescript
import crypto from "crypto";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function createSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function validateSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  // Token is stored as: {token}:{createdAt}
  const parts = cookieValue.split(":");
  if (parts.length !== 2) return false;
  const createdAt = parseInt(parts[1], 10);
  if (isNaN(createdAt)) return false;
  return Date.now() - createdAt < SESSION_DURATION_MS;
}

export function buildSessionCookie(token: string): string {
  const value = `${token}:${Date.now()}`;
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "; Secure" : "";
  return `admin_session=${value}; HttpOnly; SameSite=Strict; Max-Age=86400; Path=/${secure}`;
}
```

### `lib/cms-loader.ts`

```typescript
import fs from "fs/promises";
import path from "path";
import type { Certificate, Project, PersonalInfo } from "./admin-auth";

const CONTENT_DIR = path.join(process.cwd(), "content");

type ContentType = "certificates" | "projects" | "personal" | "skills";

export async function readContent<T>(type: ContentType): Promise<T> {
  const filePath = path.join(CONTENT_DIR, `${type}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeContent<T>(type: ContentType, data: T): Promise<void> {
  const filePath = path.join(CONTENT_DIR, `${type}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function ensureContentDir(): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
}
```

### API Routes

**`app/api/admin/login/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSessionToken, buildSessionCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("[Admin] ADMIN_PASSWORD environment variable is not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const { password } = await req.json();
  const inputHash = hashPassword(password ?? "");
  const expectedHash = hashPassword(adminPassword);

  if (inputHash !== expectedHash) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.headers.set("Set-Cookie", buildSessionCookie(token));
  return response;
}
```

**`app/api/admin/logout/route.ts`**

```typescript
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    "admin_session=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/"
  );
  return response;
}
```

**`app/api/certificates/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Certificate } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function requireAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  return validateSession(cookie);
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const certs = await readContent<Certificate[]>("certificates");
  return NextResponse.json(certs);
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const title = form.get("title") as string;
  const issuer = form.get("issuer") as string;
  const date = form.get("date") as string;
  const description = form.get("description") as string | undefined;

  if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 });
  if (!title || !issuer) return NextResponse.json({ error: "title and issuer are required" }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Ukuran file melebihi batas 5 MB" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(process.cwd(), "public", "certificates", filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const newCert: Certificate = {
    id: randomUUID(),
    title,
    issuer,
    date: date ?? new Date().toISOString().split("T")[0],
    image: `/certificates/${filename}`,
    description,
  };

  const certs = await readContent<Certificate[]>("certificates");
  certs.push(newCert);
  await writeContent("certificates", certs);

  return NextResponse.json(newCert, { status: 201 });
}
```

**`app/api/certificates/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import { unlink } from "fs/promises";
import path from "path";
import type { Certificate } from "@/lib/admin-auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (!validateSession(cookie)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const certs = await readContent<Certificate[]>("certificates");
  const target = certs.find(c => c.id === params.id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Remove file from public/certificates/
  try {
    await unlink(path.join(process.cwd(), "public", target.image));
  } catch { /* file may already be deleted */ }

  const updated = certs.filter(c => c.id !== params.id);
  await writeContent("certificates", updated);
  return NextResponse.json({ success: true });
}
```

**`app/api/projects/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import { randomUUID } from "crypto";
import type { Project } from "@/lib/admin-auth";

function requireAuth(req: NextRequest) {
  return validateSession(req.cookies.get("admin_session")?.value);
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readContent<Project[]>("projects"));
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.title || !body.description) {
    return NextResponse.json({ error: "title and description are required" }, { status: 400 });
  }
  const newProject: Project = {
    id: randomUUID(),
    title: body.title,
    description: body.description,
    longDescription: body.longDescription,
    technologies: Array.isArray(body.technologies)
      ? body.technologies
      : (body.technologies as string).split(",").map((t: string) => t.trim()),
    githubUrl: body.githubUrl,
    liveUrl: body.liveUrl,
    image: body.image,
    featured: Boolean(body.featured),
    category: body.category ?? "Other",
  };
  const projects = await readContent<Project[]>("projects");
  projects.push(newProject);
  await writeContent("projects", projects);
  return NextResponse.json(newProject, { status: 201 });
}
```

**`app/api/projects/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import type { Project } from "@/lib/admin-auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!validateSession(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const projects = await readContent<Project[]>("projects");
  const idx = projects.findIndex(p => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  projects[idx] = { ...projects[idx], ...body, id: params.id };
  await writeContent("projects", projects);
  return NextResponse.json(projects[idx]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!validateSession(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projects = await readContent<Project[]>("projects");
  const updated = projects.filter(p => p.id !== params.id);
  if (updated.length === projects.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await writeContent("projects", updated);
  return NextResponse.json({ success: true });
}
```

**`app/api/content/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";

const ALLOWED_TYPES = ["personal", "skills"] as const;
type AllowedType = typeof ALLOWED_TYPES[number];

export async function GET(req: NextRequest) {
  if (!validateSession(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const type = req.nextUrl.searchParams.get("type") as AllowedType;
  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }
  return NextResponse.json(await readContent(type));
}

export async function PUT(req: NextRequest) {
  if (!validateSession(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const type = req.nextUrl.searchParams.get("type") as AllowedType;
  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }
  const body = await req.json();
  await writeContent(type, body);
  return NextResponse.json({ success: true });
}
```

### Admin App Router Pages

**`app/admin/layout.tsx`**

```typescript
import type { ReactNode } from "react";

// Admin layout — auth check handled client-side in page components
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
```

**`app/admin/page.tsx`**

```typescript
"use client";
import { useState, useEffect } from "react";
import LoginForm from "@/components/admin/LoginForm";
import AdminNav from "@/components/admin/AdminNav";
import CertificateUploader from "@/components/admin/CertificateUploader";
import ProjectForm from "@/components/admin/ProjectForm";
import PersonalInfoForm from "@/components/admin/PersonalInfoForm";

type Tab = "certificates" | "projects" | "personal";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("certificates");

  useEffect(() => {
    // Check auth status by calling a lightweight protected endpoint
    fetch("/api/content?type=personal")
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen">
      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} onLogout={() => setIsAuthenticated(false)} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "certificates" && <CertificateUploader />}
        {activeTab === "projects" && <ProjectForm />}
        {activeTab === "personal" && <PersonalInfoForm />}
      </main>
    </div>
  );
}
```

### Admin Components

**`components/admin/LoginForm.tsx`**

```typescript
"use client";
import { useState } from "react";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      onSuccess();
    } else {
      const data = await res.json();
      setError(data.error ?? "Password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
        <label className="block text-sm font-medium mb-2" htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600"
          required
          autoFocus
        />
        {error && <p role="alert" className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
```

**`components/admin/AdminNav.tsx`**

```typescript
"use client";
type Tab = "certificates" | "projects" | "personal";

interface AdminNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "certificates", label: "Sertifikat" },
  { id: "projects", label: "Projects" },
  { id: "personal", label: "Personal Info" },
];

export default function AdminNav({ activeTab, onTabChange, onLogout }: AdminNavProps) {
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex gap-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:text-red-700"
      >
        Logout
      </button>
    </nav>
  );
}
```

**`components/admin/CertificateUploader.tsx`** (interface summary)

```typescript
"use client";
// State: certificates[], uploadFile, title, issuer, date, description, dragActive, uploading, error

// Key behaviors:
// - onDragOver/onDrop: set dragActive, validate file type + size before setUploadFile
// - handleUpload: POST /api/certificates (FormData), on success prepend to certificates list
// - handleDelete(id): show confirm dialog, DELETE /api/certificates/{id}, filter from list

interface UploaderState {
  certificates: Certificate[];
  uploadFile: File | null;
  previewUrl: string | null; // URL.createObjectURL(file)
  title: string;
  issuer: string;
  date: string;
  description: string;
  dragActive: boolean;
  uploading: boolean;
  error: string | null;
  confirmDeleteId: string | null;
}
```

**`components/admin/ProjectForm.tsx`** (interface summary)

```typescript
"use client";
// State: projects[], editingProject (null = add mode), form fields, submitting, errors, showDelete

interface ProjectFormState {
  projects: Project[];
  editingId: string | null; // null = add mode
  title: string;
  description: string;
  technologies: string; // comma-separated input string
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  submitting: boolean;
  errors: { title?: string; description?: string };
  confirmDeleteId: string | null;
}

// handleSubmit: validates title+description non-empty, then POST or PUT
// handleDelete: show confirm, then DELETE /api/projects/{id}
```

**`components/admin/PersonalInfoForm.tsx`** (interface summary)

```typescript
"use client";
// State: form fields (name, title, subtitle, bio, email, location, availability, skills[])
// previewMode: boolean

interface PersonalFormState {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  skills: string[];
  previewMode: boolean;
  saving: boolean;
  toast: { type: "success" | "error"; message: string } | null;
}

// handleSave: PUT /api/content?type=personal, on error show toast, keep form data
// handlePreview: toggle previewMode to show card with current form values
// addSkill / removeSkill: update skills array
```

### Middleware Update

`middleware.ts` perlu update untuk validasi session cookie di route `/admin/**` API routes:

```typescript
// Add to existing middleware.ts
import { validateSession } from "@/lib/admin-auth";

// In middleware function — add before security headers logic:
if (request.nextUrl.pathname.startsWith("/api/admin/") && 
    !request.nextUrl.pathname.includes("/login")) {
  // login endpoint is public; other admin endpoints validate in route handlers
}

// Note: API route handlers (/api/certificates, /api/projects, /api/content)
// validate session internally, so middleware only needs to handle /admin page route.
// For /admin page itself, auth check is done client-side in AdminPage component.
```

### Content Store — Initial JSON Files

**`content/certificates.json`**
```json
[]
```

**`content/projects.json`**
```json
[]
```

**`content/personal.json`**
```json
{
  "name": "Kaonang Sigit Prakoso",
  "title": "Full Stack Developer",
  "subtitle": "Building modern web experiences",
  "bio": "I'm a passionate Full Stack Developer...",
  "email": "kaonang@example.com",
  "location": "Indonesia",
  "availability": "Open to opportunities",
  "skills": []
}
```

**`content/skills.json`**
```json
[]
```

---

## Error Handling Strategy

| Scenario | Handling |
|---|---|
| WebGL not available | Render `HeroFallback` CSS component |
| GitHub API 4xx/5xx | Return error state with Retry button in `GitHubSection` |
| `GITHUB_TOKEN` missing | Log warning, proceed with anonymous rate limit |
| `ADMIN_PASSWORD` missing | Return HTTP 500 from login endpoint |
| Wrong admin password | Return 401, display "Password salah" inline |
| Expired session cookie | Validated per-request in API handlers, return 401 |
| Upload file > 5 MB | Client + server validation, return 400 with message |
| Unsupported file type | Client + server validation, return 400 with message |
| Content PUT failure | Show toast notification, preserve form state |
| Missing `content/*.json` | `cms-loader.ts` propagates fs error → API returns 500 |

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | Recommended | GitHub API authenticated rate limit |
| `NEXT_PUBLIC_GITHUB_USERNAME` | Yes | GitHub username for API calls |
| `ADMIN_PASSWORD` | Yes | Admin panel login password |
| `NEXT_PUBLIC_SITE_URL` | Yes | Base URL for metadata |
| `NODE_ENV` | Auto-set | Determines Secure cookie flag |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property Reflection:** Before finalizing, redundant properties are eliminated. Properties 2 and 3 (particle count and shape count) are distinct minimum-bound invariants that cannot be merged since they test different components. Properties 4 and 5 (mouse parallax and scroll) test different input dimensions. Properties 8 and 9 (stats computation and top repos) test different pure functions. Properties 12 and 13 (file size and type rejection) test independent validation rules — both are retained. Property 10 (auth rejection for any wrong password) subsumes the specific "Password salah" error display; that becomes an example test.

---

### Property 1: ParticleField renders at least 80 particles

*For any* initialized `ParticleField` component, the number of particles in its buffer geometry's position attribute shall be at least 80.

**Validates: Requirements 1.2**

---

### Property 2: FloatingShapes renders at least 5 shapes

*For any* initialized `FloatingShapes` component, the number of `<mesh>` children rendered in the scene shall be at least 5.

**Validates: Requirements 1.3**

---

### Property 3: Mouse parallax stays within rotation bounds

*For any* normalized mouse position delta (x, y) in the range [-1, 1], the resulting camera rotation change applied per frame shall not exceed 0.05 radians in either the x or y axis.

**Validates: Requirements 1.4**

---

### Property 4: Scroll animation stays proportional within bounds

*For any* scroll progress value `p` in [0, 1], the resulting animation value (position offset or opacity) produced by the scroll handler shall be monotonically related to `p` and remain within the defined output range.

**Validates: Requirements 1.5**

---

### Property 5: WebGL fallback renders for any failure state

*For any* state where WebGL context creation returns `null` or throws an error, the `Hero3DScene` component shall render `HeroFallback` instead of the Canvas-based 3D scene.

**Validates: Requirements 1.8**

---

### Property 6: Animation pauses when tab is hidden

*For any* document visibility change to `"hidden"`, the `useFrame` render loop in `ParticleField` and `FloatingShapes` shall skip animation calculations; and *for any* change back to `"visible"`, animation shall resume.

**Validates: Requirements 1.10**

---

### Property 7: Top repos selection is correct and bounded

*For any* array of GitHub repositories, the result of `getTopRepos(repos, 6)` shall contain at most 6 items, shall exclude forked repositories, and shall be sorted by `updated_at` in descending order.

**Validates: Requirements 2.3**

---

### Property 8: GitHub stats aggregation is correct

*For any* array of GitHub repositories and a profile object, `computeGitHubStats(repos, profile)` shall return a `GitHubStats` object where:
- `totalStars` equals the sum of all `stargazers_count` values
- `totalForks` equals the sum of all `forks_count` values
- `publicRepos` equals `profile.public_repos`
- `followers` equals `profile.followers`
- `topLanguages` contains at most 5 entries, each with a non-null `language`, sorted by `count` descending

**Validates: Requirements 2.4, 2.5, 2.11**

---

### Property 9: Error state renders retry button for any API failure

*For any* non-200 response from `/api/github/stats` or `/api/github/repos`, the `GitHubSection` component shall render an error message and a "Retry" button that, when clicked, re-triggers the fetch.

**Validates: Requirements 2.8**

---

### Property 10: GitHub profile link uses correct URL and attributes

*For any* successful data fetch where `username` is defined, the rendered `GitHubSection` shall include an anchor element with `href` equal to `https://github.com/{username}`, `target="_blank"`, and `rel="noopener noreferrer"`.

**Validates: Requirements 2.10**

---

### Property 11: Wrong admin password never issues a session cookie

*For any* password string that does not equal `ADMIN_PASSWORD`, a POST to `/api/admin/login` shall return a non-200 response and shall not include a `Set-Cookie` header containing `admin_session`.

**Validates: Requirements 3.1.4**

---

### Property 12: Protected endpoints reject requests without valid session cookie

*For any* HTTP request to `/api/certificates` (POST, DELETE), `/api/projects` (POST, PUT, DELETE), or `/api/content` (PUT) that does not include a valid `admin_session` cookie, the endpoint shall return HTTP 401 and shall not modify any content store file.

**Validates: Requirements 3.5.24**

---

### Property 13: File upload rejects oversized files

*For any* file upload where the file size in bytes exceeds 5,242,880 (5 MB), the `/api/certificates` POST endpoint shall return HTTP 400 and shall not write any file to `public/certificates/` or modify `content/certificates.json`.

**Validates: Requirements 3.2.11**

---

### Property 14: File upload rejects unsupported MIME types

*For any* file upload where the file's MIME type is not one of `image/jpeg`, `image/png`, or `image/webp`, the `/api/certificates` POST endpoint shall return HTTP 400 and shall not write any file to `public/certificates/` or modify `content/certificates.json`.

**Validates: Requirements 3.2.12**

---

### Property 15: Project form validation prevents empty title or description

*For any* form submission state where `title` is empty or `description` is empty, the `ProjectForm` component shall prevent the submit action from firing and shall display at least one inline validation error message.

**Validates: Requirements 3.3.18**

---

### Property 16: Personal info preview reflects current form values

*For any* set of values entered in the `PersonalInfoForm` fields, clicking "Preview" shall render a preview card where each displayed field value exactly matches the corresponding current form state — without saving to the content store.

**Validates: Requirements 3.4.21**

---

### Property 17: Content PUT failure preserves form state and shows toast

*For any* failed PUT request to `/api/content`, the `PersonalInfoForm` component shall retain all current form field values unchanged and shall display a toast notification indicating the error.

**Validates: Requirements 3.4.23**
