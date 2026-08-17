# Implementation Plan: Portfolio Upgrade — 3 Features

## Overview

Implementasi tiga fitur upgrade portofolio Next.js 14: 3D Visual Hero (React Three Fiber), GitHub Data Real-time (Octokit + ISR), dan Admin Panel CMS (autentikasi berbasis cookie + file JSON). Setiap task menghasilkan file yang dapat diverifikasi secara incremental.

---

## Tasks

### Feature 1: 3D Visual Hero

- [x] 1. Buat `components/3d/HeroFallback.tsx`
  - Buat komponen CSS-only fallback yang merender animated gradient orbs menggunakan Tailwind (`animate-pulse`, `animate-bounce`, `animate-spin`)
  - Tidak menggunakan canvas atau WebGL apapun
  - Komponen harus `export default` tanpa props
  - _Requirements: 1.8, 1.9_

- [x] 2. Buat `components/3d/ParticleField.tsx`
  - [x] 2.1 Implementasi `ParticleField` dengan buffer geometry dan `useFrame` animation loop
    - Gunakan `PARTICLE_COUNT = 100` (minimum 80 per Requirement 1.2)
    - Generate posisi dan velocities acak dengan `useMemo`
    - Animasi partikel tiap frame via `posAttr.needsUpdate = true`
    - Tambahkan boundary wrapping agar partikel tetap dalam range [-5, 5]
    - Gunakan `document.hidden` check di `useFrame` untuk pause saat tab hidden (Page Visibility API)
    - _Requirements: 1.2, 1.10_
  - [ ]* 2.2 Tulis property test untuk `ParticleField` — Property 1: minimum 80 partikel
    - **Property 1: ParticleField renders at least 80 particles**
    - **Validates: Requirements 1.2**
    - Render komponen dengan React Testing Library + mock `@react-three/fiber`
    - Assert bahwa `PARTICLE_COUNT >= 80`

- [x] 3. Buat `components/3d/FloatingShapes.tsx`
  - [x] 3.1 Implementasi `FloatingShapes` dengan 6 shape configs dan komponen `Shape`
    - Definisikan array `SHAPES` dengan minimal 5 item (box, torus, octahedron, dodecahedron, sphere, torus ke-2)
    - Setiap shape punya `position`, `geometry`, `rotationSpeed`, dan `color`
    - Komponen `Shape` menggunakan `useFrame` untuk rotasi kontinu
    - Animasi scroll: `position.y += scrollProgress * 2` dan opacity `1 - scrollProgress`
    - Gunakan `document.hidden` check di `useFrame` untuk Page Visibility API
    - Terima prop `scrollProgress: number`
    - _Requirements: 1.3, 1.5, 1.10_
  - [ ]* 3.2 Tulis property test untuk `FloatingShapes` — Property 2: minimum 5 shapes
    - **Property 2: FloatingShapes renders at least 5 shapes**
    - **Validates: Requirements 1.3**
    - Assert bahwa `SHAPES.length >= 5`

- [x] 4. Buat `components/3d/Hero3DSceneInner.tsx`
  - [x] 4.1 Implementasi `Hero3DSceneInner` sebagai full canvas scene
    - Tambahkan WebGL detection via `canvas.getContext("webgl")` — return `<HeroFallback />` jika tidak supported
    - Setup mouse parallax: event listener `mousemove` → normalize ke [-1, 1] → `setMousePos`
    - Setup scroll handler: hitung `scrollProgress` dari `getBoundingClientRect` hero element
    - Tambahkan Page Visibility API listener
    - Render `<Canvas>` dengan `<AdaptiveDpr pixelated />`, `<PerspectiveCamera>`, lights, `<SceneCamera>`, `<ParticleField />`, `<FloatingShapes />`
    - Implementasi `SceneCamera` dengan `useFrame` — rotasi kamera max 0.05 rad per unit (lerp 0.05)
    - _Requirements: 1.1, 1.4, 1.5, 1.7, 1.8, 1.10_
  - [ ]* 4.2 Tulis property test untuk mouse parallax — Property 3
    - **Property 3: Mouse parallax rotation stays within 0.05 rad bounds**
    - **Validates: Requirements 1.4**
    - Test bahwa untuk semua mouse input dalam [-1, 1], target rotation tidak pernah melebihi `MAX_ROTATION = 0.05`
  - [ ]* 4.3 Tulis property test untuk scroll animation — Property 4
    - **Property 4: Scroll animation value is monotonically proportional to scrollProgress**
    - **Validates: Requirements 1.5**
    - Test bahwa untuk `scrollProgress` dalam [0, 1], animasi output monoton dan dalam range yang valid

- [x] 5. Buat `components/3d/Hero3DScene.tsx` (wrapper dengan dynamic import)
  - Import `Hero3DSceneInner` menggunakan `next/dynamic` dengan `{ ssr: false }`
  - Wrap dengan `<Suspense fallback={<HeroFallback />}>`
  - Export default `Hero3DScene`
  - _Requirements: 1.6, 1.9_

- [x] 6. Update `components/Hero.tsx` untuk integrasi `Hero3DScene`
  - Import `Hero3DScene` dari `./3d/Hero3DScene`
  - Tambahkan `<Hero3DScene />` di dalam `<section id="home">` sebelum konten teks
  - Pastikan konten teks tetap ada dengan `relative z-10`
  - Pertahankan semua konten Hero yang sudah ada
  - _Requirements: 1.1_

- [x] 7. Checkpoint Feature 1
  - Ensure all tests pass, ask the user if questions arise.

---

### Feature 2: GitHub Data Real-time

- [x] 8. Update `lib/github.ts` — tambah types, fungsi, dan exports
  - [x] 8.1 Tambahkan TypeScript interfaces: `GitHubProfile`, `GitHubRepo`, `GitHubStats`
    - Interface harus sesuai dengan shape data yang dikembalikan GitHub API
    - Export semua interfaces
    - _Requirements: 2.1, 2.2, 2.4, 2.11_
  - [x] 8.2 Tambahkan fungsi `fetchGitHubProfile` dan `fetchGitHubRepos` dengan ISR headers
    - `fetchGitHubProfile`: fetch `GET /users/{username}` dengan `next: { revalidate: 3600 }`
    - `fetchGitHubRepos`: fetch `GET /users/{username}/repos?sort=updated&per_page=100` dengan ISR
    - Fungsi `buildHeaders()`: sertakan `Authorization: Bearer ${token}` jika token ada, log warning jika tidak ada
    - Throw error dengan pesan informatif jika response bukan OK
    - _Requirements: 2.1, 2.2, 2.9_
  - [x] 8.3 Tambahkan fungsi `computeGitHubStats` dan `getTopRepos`
    - `computeGitHubStats(repos, profile)`: hitung `totalStars`, `totalForks`, `publicRepos`, `followers`, `topLanguages` (max 5, sorted by count desc)
    - `getTopRepos(repos, n=6)`: filter non-fork, sort by `updated_at` desc, slice ke n
    - Kedua fungsi harus pure (tidak ada side effects)
    - _Requirements: 2.3, 2.4, 2.5, 2.11_
  - [ ]* 8.4 Tulis property test untuk `computeGitHubStats` — Property 8
    - **Property 8: GitHub stats aggregation is correct for any repo array**
    - **Validates: Requirements 2.4, 2.5, 2.11**
    - Gunakan fast-check: generate array repos acak, assert totalStars === sum(stargazers_count), dll
    - Assert topLanguages.length <= 5 dan sorted descending
  - [ ]* 8.5 Tulis property test untuk `getTopRepos` — Property 7
    - **Property 7: Top repos are bounded, non-fork, and sorted by updated_at**
    - **Validates: Requirements 2.3**
    - Gunakan fast-check: generate array repos acak, assert result.length <= 6, semua bukan fork, sorted desc

- [x] 9. Buat `app/api/github/profile/route.ts`
  - Implementasi `GET` handler yang memanggil `fetchGitHubProfile()`
  - Set `export const revalidate = 3600`
  - Set Cache-Control header: `public, s-maxage=3600, stale-while-revalidate=7200`
  - Return 500 dengan pesan error jika fetch gagal
  - _Requirements: 2.1_

- [x] 10. Update `app/api/github/stats/route.ts`
  - Ganti implementasi existing dengan panggilan ke `fetchGitHubProfile()`, `fetchGitHubRepos()`, dan `computeGitHubStats()`
  - Gunakan `Promise.all` untuk fetch paralel
  - Set `export const revalidate = 3600`
  - Return JSON dengan field: `totalStars`, `totalForks`, `publicRepos`, `followers`, `topLanguages`
  - _Requirements: 2.4, 2.5, 2.11_

- [x] 11. Buat komponen-komponen GitHub display
  - [x] 11.1 Buat `components/github/GitHubSkeleton.tsx`
    - Render skeleton loading untuk: title bar, 4 stat cards, language bar, contribution graph placeholder, 6 repo cards
    - Semua elemen menggunakan `animate-pulse` Tailwind
    - _Requirements: 2.7_
  - [x] 11.2 Buat `components/github/GitHubStats.tsx`
    - Terima prop `stats: GitHubStats`
    - Render 4 stat cards: Total Stars ⭐, Total Forks 🍴, Public Repos 📦, Followers 👥
    - Grid layout `grid-cols-2 md:grid-cols-4`
    - _Requirements: 2.4_
  - [x] 11.3 Buat `components/github/RepoCard.tsx`
    - Terima prop `repo: GitHubRepo`
    - Render sebagai anchor tag ke `repo.html_url` dengan `target="_blank" rel="noopener noreferrer"`
    - Tampilkan: nama repo, description (truncated), language, stars, forks
    - _Requirements: 2.3_
  - [x] 11.4 Buat `components/github/LanguageChart.tsx`
    - Terima prop `languages: Array<{ language: string; count: number }>`
    - Render bar chart horizontal menggunakan div dengan width proportional
    - Max 5 languages
    - _Requirements: 2.5_
  - [x] 11.5 Buat `components/github/ContributionGraph.tsx`
    - Terima prop `username: string`
    - Embed `<img src={https://ghchart.rshah.org/${username}} alt="GitHub contribution chart for {username}" />`
    - _Requirements: 2.6_

- [ ] 12. Buat `components/github/GitHubSection.tsx`
  - [x] 12.1 Implementasi container client component dengan fetch state management
    - State: `stats` (FetchState\<GitHubStats\>), `repos` (FetchState\<GitHubRepo[]\>)
    - Fetch paralel dari `/api/github/stats` dan `/api/github/repos` via `Promise.all`
    - Tampilkan `<GitHubSkeleton />` saat loading
    - Tampilkan error message + tombol "Retry" saat fetch gagal
    - _Requirements: 2.7, 2.8_
  - [x] 12.2 Integrasikan semua sub-komponen dan link profil GitHub
    - Render: `<GitHubStats>`, `<LanguageChart>`, `<ContributionGraph>`, grid 6 `<RepoCard>`
    - Tambahkan link ke profil GitHub dengan `target="_blank" rel="noopener noreferrer"`
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.10_
  - [ ]* 12.3 Tulis property test untuk error state — Property 9
    - **Property 9: GitHubSection renders Retry button for any non-200 API response**
    - **Validates: Requirements 2.8**
    - Mock fetch untuk return berbagai error status (400, 401, 404, 500)
    - Assert tombol "Retry" selalu muncul
  - [ ]* 12.4 Tulis unit test untuk link profil GitHub — Property 10
    - **Property 10: GitHub profile link has correct URL and security attributes**
    - **Validates: Requirements 2.10**
    - Assert `href=https://github.com/{username}`, `target=_blank`, `rel=noopener noreferrer`

- [x] 13. Tambahkan `GitHubSection` ke `app/page.tsx`
  - Import `GitHubSection` dari `@/components/github/GitHubSection`
  - Tambahkan `<GitHubSection />` di antara section yang sudah ada (setelah Projects, sebelum Contact)
  - _Requirements: 2.1_

- [x] 14. Checkpoint Feature 2
  - Ensure all tests pass, ask the user if questions arise.

---

### Feature 3: Admin Panel CMS

- [x] 15. Setup content store dan directories
  - [x] 15.1 Buat folder `content/` dengan 4 file JSON awal
    - `content/personal.json`: objek dengan name, title, subtitle, bio, email, location, availability, skills (array kosong)
    - `content/skills.json`: array kosong `[]`
    - `content/projects.json`: array kosong `[]`
    - `content/certificates.json`: array kosong `[]`
    - _Requirements: 3.2.10, 3.3.15, 3.4.22_
  - [x] 15.2 Buat folder `public/certificates/` dengan `.gitkeep`
    - Folder harus ada agar file upload bisa ditulis
    - _Requirements: 3.2.9_
  - [x] 15.3 Tambahkan `ADMIN_PASSWORD` ke `.env.example` dan `.env.local`
    - Di `.env.example`: `ADMIN_PASSWORD=your_admin_password_here`
    - Di `.env.local`: `ADMIN_PASSWORD=admin123` (nilai placeholder aman untuk development)
    - _Requirements: 3.1.1, 3.1.3, 3.5.24_

- [x] 16. Buat `lib/admin-auth.ts`
  - Implementasi `hashPassword(password: string): string` menggunakan `crypto.createHash("sha256")`
  - Implementasi `createSessionToken(): string` menggunakan `crypto.randomBytes(32)`
  - Implementasi `validateSession(cookieValue: string | undefined): boolean` — parse format `{token}:{createdAt}`, validasi age < 24 jam
  - Implementasi `buildSessionCookie(token: string): string` — set HttpOnly, SameSite=Strict, Max-Age=86400, Secure hanya jika production
  - Export semua interfaces: `AdminSession`, `Certificate`, `Project`, `PersonalInfo`
  - _Requirements: 3.1.3, 3.1.6, 3.5.24, 3.5.25, 3.5.26_

- [x] 17. Buat `lib/cms-loader.ts`
  - Implementasi `readContent<T>(type: ContentType): Promise<T>` — baca file JSON dari `content/` folder
  - Implementasi `writeContent<T>(type: ContentType, data: T): Promise<void>` — tulis JSON dengan pretty print (2 spaces)
  - Implementasi `ensureContentDir(): Promise<void>` — buat folder jika belum ada
  - Type `ContentType = "certificates" | "projects" | "personal" | "skills"`
  - Gunakan `path.join(process.cwd(), "content")` sebagai base path
  - _Requirements: 3.2.10, 3.3.15, 3.4.22_

- [x] 18. Buat API routes autentikasi admin
  - [x] 18.1 Buat `app/api/admin/login/route.ts`
    - Validasi `ADMIN_PASSWORD` env var ada — return 500 jika tidak ada
    - Hash input password dan compare dengan hash(`ADMIN_PASSWORD`)
    - Jika cocok: buat token, set `Set-Cookie` header, return 200
    - Jika tidak cocok: return 401 dengan `{ error: "Password salah" }`
    - _Requirements: 3.1.3, 3.1.4, 3.1.5_
  - [x] 18.2 Buat `app/api/admin/logout/route.ts`
    - POST handler: hapus cookie dengan `Max-Age=0`
    - Return 200 `{ success: true }`
    - _Requirements: 3.1.6_
  - [ ]* 18.3 Tulis property test untuk login — Property 11
    - **Property 11: Wrong password never issues a session cookie**
    - **Validates: Requirements 3.1.4**
    - Gunakan fast-check: generate password string acak (bukan ADMIN_PASSWORD)
    - Assert response tidak 200 dan tidak ada `Set-Cookie: admin_session`

- [x] 19. Buat API routes certificates
  - [x] 19.1 Buat `app/api/certificates/route.ts`
    - `GET`: validasi session, kembalikan `readContent("certificates")`
    - `POST`: validasi session → parse FormData → validasi file size (max 5 MB) → validasi MIME type → tulis file ke `public/certificates/` → append ke JSON
    - Validasi `title` dan `issuer` wajib diisi
    - Return 400 dengan pesan spesifik untuk file size dan type errors
    - _Requirements: 3.2.9, 3.2.10, 3.2.11, 3.2.12, 3.5.24_
  - [x] 19.2 Buat `app/api/certificates/[id]/route.ts`
    - `DELETE`: validasi session → cari cert by id → hapus file dari `public/certificates/` → update JSON → return 200
    - Return 404 jika id tidak ditemukan
    - _Requirements: 3.2.13, 3.5.24_
  - [ ]* 19.3 Tulis property test untuk file upload validation — Properties 13 & 14
    - **Property 13: Upload rejects files > 5 MB**
    - **Property 14: Upload rejects unsupported MIME types**
    - **Validates: Requirements 3.2.11, 3.2.12**
    - Test berbagai kombinasi ukuran dan tipe file

- [ ] 20. Buat API routes projects
  - [x] 20.1 Buat `app/api/projects/route.ts`
    - `GET`: validasi session, kembalikan `readContent("projects")`
    - `POST`: validasi session → validasi `title` + `description` wajib → buat Project dengan UUID → append ke JSON
    - Parse `technologies` dari string comma-separated jika bukan array
    - _Requirements: 3.3.15, 3.5.24_
  - [x] 20.2 Buat `app/api/projects/[id]/route.ts`
    - `PUT`: validasi session → cari by id → merge update → tulis JSON → return updated project
    - `DELETE`: validasi session → filter by id → tulis JSON → return success
    - Return 404 jika id tidak ditemukan
    - _Requirements: 3.3.16, 3.3.17, 3.5.24_
  - [ ]* 20.3 Tulis property test untuk protected endpoints — Property 12
    - **Property 12: Protected endpoints reject requests without valid session**
    - **Validates: Requirements 3.5.24**
    - Test semua verb (POST, PUT, DELETE) tanpa cookie, dengan cookie expired, dengan cookie invalid
    - Assert semua return 401

- [x] 21. Buat `app/api/content/route.ts`
  - `GET`: validasi session → validasi `type` query param (`personal` | `skills`) → return `readContent(type)`
  - `PUT`: validasi session → validasi `type` → parse body → `writeContent(type, body)` → return success
  - Return 400 untuk invalid type
  - _Requirements: 3.4.22, 3.5.24_

- [x] 22. Buat komponen-komponen admin
  - [x] 22.1 Buat `components/admin/LoginForm.tsx`
    - Form dengan field password, tombol Submit, dan area error message
    - POST ke `/api/admin/login` dengan `{ password }`
    - Jika sukses: panggil `onSuccess()` callback
    - Jika gagal: tampilkan `error` dari response JSON
    - Prop: `onSuccess: () => void`
    - _Requirements: 3.1.2, 3.1.4_
  - [x] 22.2 Buat `components/admin/AdminNav.tsx`
    - Render 3 tab buttons: Sertifikat, Projects, Personal Info
    - Highlight tab aktif dengan bg-blue-600
    - Tombol Logout: POST ke `/api/admin/logout` → panggil `onLogout()`
    - Props: `activeTab`, `onTabChange`, `onLogout`
    - _Requirements: 3.1.6, 3.2.7, 3.3.14, 3.4.19_
  - [x] 22.3 Buat `components/admin/CertificateUploader.tsx`
    - Fetch GET `/api/certificates` saat mount → tampilkan daftar sertifikat
    - Implementasi Drag-Drop Zone: `onDragOver`, `onDrop` events
    - Validasi file client-side: size <= 5 MB, type in (jpg/png/webp)
    - Preview thumbnail menggunakan `URL.createObjectURL(file)` sebelum upload
    - Form field: `title` (required), `issuer` (required), `date`, `description`
    - Submit: POST FormData ke `/api/certificates` → update list tanpa reload
    - Tombol hapus per item: tampilkan confirm dialog → DELETE `/api/certificates/{id}`
    - _Requirements: 3.2.7, 3.2.8, 3.2.9, 3.2.10, 3.2.11, 3.2.12, 3.2.13_
  - [x] 22.4 Buat `components/admin/ProjectForm.tsx`
    - Fetch GET `/api/projects` saat mount → tampilkan daftar project
    - Form fields: `title`, `description`, `technologies` (comma-separated), `githubUrl`, `liveUrl`, `category`, `featured` (checkbox)
    - Add mode (POST) dan Edit mode (PUT by id) dengan state `editingId`
    - Validasi inline: `title` dan `description` tidak boleh kosong, tampilkan error per field
    - Tombol hapus: tampilkan confirm dialog → DELETE `/api/projects/{id}`
    - _Requirements: 3.3.14, 3.3.15, 3.3.16, 3.3.17, 3.3.18_
  - [ ]* 22.5 Tulis property test untuk ProjectForm validation — Property 15
    - **Property 15: Project form prevents submit when title or description is empty**
    - **Validates: Requirements 3.3.18**
    - Test berbagai kombinasi empty/filled title dan description
  - [x] 22.6 Buat `components/admin/PersonalInfoForm.tsx`
    - Fetch GET `/api/content?type=personal` saat mount → pre-populate form
    - Form fields: `name`, `title`, `subtitle`, `bio` (textarea), `email`, `location`, `availability`
    - Daftar skills yang dapat ditambah (input + Add button) dan dihapus (x button per item)
    - Tombol "Preview": toggle `previewMode` → tampilkan card preview dengan nilai form saat ini (belum disimpan)
    - Tombol "Simpan": PUT `/api/content?type=personal` → tampilkan toast success/error
    - Jika PUT gagal: tampilkan toast error, pertahankan semua data form
    - _Requirements: 3.4.19, 3.4.20, 3.4.21, 3.4.22, 3.4.23_
  - [ ]* 22.7 Tulis property test untuk PersonalInfoForm preview — Property 16
    - **Property 16: Preview reflects current form values exactly without saving**
    - **Validates: Requirements 3.4.21**
    - Test bahwa preview card menampilkan nilai form saat ini, tidak nilai yang tersimpan
  - [ ]* 22.8 Tulis property test untuk PersonalInfoForm error handling — Property 17
    - **Property 17: Failed PUT preserves form state and shows toast**
    - **Validates: Requirements 3.4.23**
    - Mock fetch untuk return 500, assert form values unchanged dan toast error muncul

- [x] 23. Buat `app/admin/layout.tsx`
  - Layout shell untuk route `/admin`
  - Render `<html>`, `<body>` dengan Tailwind class
  - Tidak ada auth guard di layout (handled client-side di page)
  - _Requirements: 3.1.1_

- [x] 24. Buat `app/admin/page.tsx`
  - Client component dengan state `isAuthenticated: boolean | null`
  - Cek auth saat mount: fetch GET `/api/content?type=personal` → jika 200 = authenticated
  - Tampilkan loading state saat `isAuthenticated === null`
  - Tampilkan `<LoginForm>` jika tidak authenticated
  - Tampilkan `<AdminNav>` + tab content jika authenticated
  - Switch antara tab: certificates (`<CertificateUploader>`), projects (`<ProjectForm>`), personal (`<PersonalInfoForm>`)
  - _Requirements: 3.1.1, 3.1.2_

- [x] 25. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks bertanda `*` adalah opsional dan bisa dilewati untuk MVP yang lebih cepat
- Setiap task merujuk ke requirement spesifik untuk traceability
- Feature 1 harus selesai sebelum Feature 2, karena keduanya diintegrasikan ke `app/page.tsx`
- `lib/admin-auth.ts` dan `lib/cms-loader.ts` (Tasks 16-17) harus selesai sebelum API routes Admin (Tasks 18-21) dibuat
- Property tests menggunakan `fast-check` untuk generative testing; mock `@react-three/fiber` dengan Jest untuk komponen 3D

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "15.1", "15.2", "15.3"] },
    { "id": 1, "tasks": ["2.1", "3.1", "8.1", "16", "17"] },
    { "id": 2, "tasks": ["2.2", "3.2", "4.1", "8.2", "8.3", "18.1", "18.2"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5", "8.4", "8.5", "18.3", "19.1", "19.2", "20.1", "20.2", "21"] },
    { "id": 4, "tasks": ["6", "9", "10", "11.1", "11.2", "11.3", "11.4", "11.5", "19.3", "20.3", "22.1", "22.2"] },
    { "id": 5, "tasks": ["12.1", "22.3", "22.4", "22.6"] },
    { "id": 6, "tasks": ["12.2", "12.3", "12.4", "22.5", "22.7", "22.8", "23"] },
    { "id": 7, "tasks": ["13", "24"] }
  ]
}
```
