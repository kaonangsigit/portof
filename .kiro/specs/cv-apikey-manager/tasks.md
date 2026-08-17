# Implementation Plan: CV Upload & API Key Manager

## Overview

Implementasi dua fitur baru pada Admin Panel Next.js 14: **API Key Manager** (tab "Settings") untuk mengelola API keys terenkripsi AES-256-GCM, dan **CV Upload & AI Parsing** (tab "Import CV") untuk mengupload PDF CV dan mem-parsing-nya secara otomatis via OpenAI/Gemini. Kedua fitur diintegrasikan ke `AdminNav` dan `app/admin/page.tsx` yang sudah ada.

---

## Tasks

- [x] 1. Setup dependencies, environment, dan file konten awal
  - Install `pdf-parse` dan `@types/pdf-parse` ke `package.json`
  - Tambahkan `MASTER_KEY=your-secret-key` ke `.env.example` dan `.env.local` (jika belum ada)
  - Buat `content/api-keys.json` dengan isi `[]`
  - Buat `content/education.json` dengan isi `[]`
  - _Requirements: 1.2.4, 1.2.5, 2.3.10_

- [x] 2. Implementasi `lib/api-key-store.ts`
  - [x] 2.1 Buat modul `lib/api-key-store.ts` dengan tipe `EncryptedEntry`, `ApiKeyId`, dan `API_KEY_DEFINITIONS`
    - Definisikan interface `EncryptedEntry { id, ciphertext, iv }`
    - Definisikan `type ApiKeyId` union untuk 7 key yang didukung
    - Definisikan `API_KEY_DEFINITIONS` record dengan `label` dan `placeholder` per key
    - _Requirements: 1.2.4, 1.2.5_
  
  - [x] 2.2 Implementasi fungsi `getDerivedKey`, `readApiKeys`, `writeApiKey`, `getApiKey`, `deleteApiKey`
    - `getDerivedKey()`: ambil `MASTER_KEY` dari env, throw jika tidak ada, gunakan `crypto.scryptSync` 32-byte
    - `readApiKeys()`: baca `content/api-keys.json`, return `[]` jika tidak ada/gagal
    - `writeApiKey(id, value)`: enkripsi AES-256-GCM dengan IV random 16 byte, simpan `authTag(16)+ciphertext` base64
    - `getApiKey(id)`: baca store, dekripsi entry yang sesuai, return `null` jika tidak ada
    - `deleteApiKey(id)`: filter entry dan tulis ulang file
    - _Requirements: 1.2.4, 1.2.6, 1.5.20_

  - [ ]* 2.3 Tulis property test untuk enkripsi round-trip (`lib/api-key-store.ts`)
    - **Property 1: AES-256-GCM Encryption Round-Trip**
    - Gunakan `fast-check` untuk generate arbitrary non-empty string sebagai `value` dan arbitrary `ApiKeyId`
    - Assert bahwa `getApiKey(id)` setelah `writeApiKey(id, value)` mengembalikan `value` yang persis sama
    - **Validates: Requirements 1.2.4, 1.3.9**

- [x] 3. Implementasi API routes untuk API Key Manager
  - [x] 3.1 Buat `app/api/admin/api-keys/route.ts` — handler GET dan PUT
    - `GET /api/admin/api-keys`: validasi session → return list `{ id, label, configured }[]` (masked, tanpa nilai)
    - `GET /api/admin/api-keys?reveal={keyId}`: validasi session → dekripsi dan return `{ id, value }` untuk satu key
    - `PUT /api/admin/api-keys`: validasi session → parse body `{ id, value }` → panggil `writeApiKey(id, value)` → return `{ success, id }`
    - Return 401 jika session invalid, 500 jika `MASTER_KEY` tidak ada, 400 jika `id`/`value` missing
    - _Requirements: 1.2.6, 1.2.7, 1.3.8, 1.3.9, 1.3.11, 1.3.12, 1.3.13_

  - [x] 3.2 Buat `app/api/admin/api-keys/test/route.ts` — handler GET connection test
    - `GET /api/admin/api-keys/test?key={keyId}`: validasi session → baca key dari store → jalankan test logic per key
    - `github_token`: fetch `https://api.github.com/user` dengan `Authorization: Bearer {token}`, return login
    - `google_analytics_id`: validasi regex `^G-[A-Z0-9]+$`, return "Valid format" atau error
    - `openai_api_key`: fetch `https://api.openai.com/v1/models` dengan Authorization header
    - `gemini_api_key`: fetch `https://generativelanguage.googleapis.com/v1/models?key={key}`
    - `resend_api_key`: fetch `https://api.resend.com/domains` dengan Authorization header
    - `sendgrid_api_key`: fetch `https://api.sendgrid.com/v3/user/profile` dengan Authorization header
    - `custom_webhook_url`: `new URL(value)` untuk validasi format, return "Valid URL" atau error
    - Return `{ success: boolean, message: string }`
    - _Requirements: 1.4.14, 1.4.15, 1.4.16, 1.4.17, 1.4.18, 1.4.19_

  - [ ]* 3.3 Tulis property test untuk validator regex dan URL (`route.ts` test helpers)
    - **Property 8: Regex-Based Key Validators Are Consistent**
    - Test `google_analytics_id`: string matching `^G-[A-Z0-9]+$` → "Valid format"; string lain → error
    - Test `custom_webhook_url`: string parseable oleh `new URL()` → "Valid URL"; string lain → error
    - **Validates: Requirements 1.4.15, 1.4.19**

- [ ] 4. Implementasi komponen `components/admin/ApiKeyManager.tsx`
  - [x] 4.1 Buat `components/admin/ApiKeyManager.tsx` dengan state management per field
    - Definisikan `FieldState` interface: `{ revealed, currentValue, dirty, saving, testing, saveStatus, saveMessage, testStatus, testMessage }`
    - On mount: fetch `GET /api/admin/api-keys` untuk status `configured` tiap key
    - Render satu row per `API_KEY_DEFINITIONS` entry: label, input (masked atau plaintext), tombol Reveal/Hide, Save, Test
    - _Requirements: 1.1.1, 1.1.2, 1.3.8_

  - [x] 4.2 Implementasi logika reveal/hide, save, dan test
    - Reveal: fetch `GET /api/admin/api-keys?reveal={id}` → set `revealed: true`, `currentValue`
    - Hide: set `revealed: false`, `currentValue: ""`
    - Save: fetch `PUT /api/admin/api-keys` dengan `{ id, value: currentValue }` → tampilkan loading → sukses/error inline
    - Test: fetch `GET /api/admin/api-keys/test?key={id}` → tampilkan hasil inline di bawah field
    - Auto-hide notifikasi sukses setelah 3 detik
    - _Requirements: 1.3.9, 1.3.10, 1.3.11, 1.3.12, 1.3.13, 1.4.14–1.4.19_

- [~] 5. Checkpoint — API Key Manager
  - Pastikan semua tests pass. Verifikasi bahwa tab Settings muncul di AdminNav setelah langkah 7, `lib/api-key-store.ts` dapat mengenkripsi dan mendekripsi, dan API routes mengembalikan 401 tanpa session.

- [x] 6. Implementasi `lib/cv-parser.ts`
  - [x] 6.1 Buat `lib/cv-parser.ts` dengan `extractTextFromPDF` dan `validateParsedCV`
    - `extractTextFromPDF(buffer)`: dynamic import `pdf-parse`, return teks mentah; throw jika gagal
    - `validateParsedCV(jsonString)`: strip markdown code fences, `JSON.parse`, validasi array `work_experience`, `education`, `skills` dan object `personal_info`; throw jika invalid
    - Definisikan `CV_PROMPT` string untuk schema JSON
    - _Requirements: 2.3.10, 2.4.13, 2.4.17, 2.4.18_

  - [x] 6.2 Implementasi `parseWithOpenAI`, `parseWithGemini`, dan `parseCVText`
    - `parseWithOpenAI(rawText, apiKey)`: POST ke `https://api.openai.com/v1/chat/completions` dengan model `gpt-4o`, panggil `validateParsedCV` pada respons
    - `parseWithGemini(rawText, apiKey)`: POST ke Gemini REST endpoint, panggil `validateParsedCV` pada respons
    - `parseCVText(rawText)`: coba OpenAI dulu → fallback Gemini → fallback `{ parsedData: null, fallback: true }`
    - _Requirements: 2.4.12, 2.4.14, 2.4.15, 2.4.16_

  - [ ]* 6.3 Tulis property test untuk `validateParsedCV`
    - **Property 9: AI Response Validation Guards Against Malformed JSON**
    - Gunakan `fast-check` untuk generate arbitrary string yang bukan JSON valid → assert throw
    - Generate JSON valid tapi tanpa field wajib → assert throw
    - Generate JSON valid dengan semua field wajib → assert return `ParsedCVData`
    - **Validates: Requirements 2.4.17, 2.4.18**

- [x] 7. Implementasi API routes untuk CV Upload & Parsing
  - [x] 7.1 Buat `app/api/admin/cv-parse/route.ts`
    - `POST /api/admin/cv-parse`: validasi session → parse `request.formData()` → ekstrak `file`
    - Validasi MIME type `application/pdf` dan ukuran ≤ 10 MB → 400 jika invalid
    - `extractTextFromPDF(buffer)` → 422 jika gagal dengan `{ parsedData: null, rawText: null, error: "Gagal mengekstrak teks dari PDF" }`
    - `parseCVText(rawText)` → return 200 dengan `{ parsedData, rawText, fallback }`
    - _Requirements: 2.2.8, 2.2.9, 2.3.10, 2.3.11, 2.4.12–2.4.18, 2.7.33_

  - [x] 7.2 Buat `app/api/admin/cv-save/route.ts`
    - `POST /api/admin/cv-save`: validasi session → parse JSON body `{ parsedData, mergeStrategy }`
    - Validasi payload: minimal satu field tidak kosong → 400
    - Validasi setiap `WorkExperience`: `company` dan `role` tidak kosong → 400
    - Validasi setiap `Education`: `institution` dan `degree` tidak kosong → 400
    - Apply merge strategy ke `content/experience.json`, `content/education.json`, `content/skills.json`, `content/personal.json`
    - Return 200 `{ success: true, updatedFiles: [...] }`
    - _Requirements: 2.6.26, 2.6.27, 2.6.28, 2.6.29, 2.6.30, 2.6.31, 2.6.32, 2.7.33, 2.7.34, 2.7.35, 2.7.36_

  - [ ]* 7.3 Tulis property test untuk replace strategy
    - **Property 3: Replace Strategy Produces Exact File Contents**
    - Gunakan `fast-check` untuk generate arbitrary `WorkExperience[]` payload
    - Assert bahwa setelah `replace`, isi `experience.json` persis sama dengan payload (count dan ID match)
    - **Validates: Requirements 2.6.28**

  - [ ]* 7.4 Tulis property test untuk merge strategy
    - **Property 4: Merge Strategy Preserves Existing Items**
    - Gunakan `fast-check` untuk generate arbitrary existing items + arbitrary payload items
    - Assert bahwa setelah `merge`, semua item existing + semua item baru ada di file (superset)
    - **Validates: Requirements 2.6.29**

  - [ ]* 7.5 Tulis property test untuk personal info merge
    - **Property 5: Personal Info Merge Preserves Unrelated Fields**
    - Generate arbitrary `personal.json` dengan field extra (`bio`, `availability`, dll.) + arbitrary `personal_info` payload
    - Assert bahwa field yang tidak ada di `{ name, title, email, location, phone }` tetap tidak berubah
    - **Validates: Requirements 2.6.30**

  - [ ]* 7.6 Tulis property test untuk validasi payload sebelum write
    - **Property 6: Invalid Items Are Rejected Before Any Write**
    - Generate arbitrary payload dengan minimal satu `WorkExperience` yang `company` atau `role` kosong
    - Assert bahwa endpoint return 400 dan tidak ada file yang berubah di filesystem
    - **Validates: Requirements 2.7.35, 2.7.36**

  - [ ]* 7.7 Tulis property test untuk auth rejection
    - **Property 2: Unauthenticated Requests Are Always Rejected**
    - Generate arbitrary request body untuk `/api/admin/api-keys`, `/api/admin/cv-parse`, `/api/admin/cv-save`
    - Assert bahwa tanpa cookie `admin_session` valid, semua return 401
    - **Validates: Requirements 1.2.7, 2.2.9, 2.6.27**

- [x] 8. Implementasi komponen `components/admin/CVUploader.tsx`
  - [x] 8.1 Buat `components/admin/CVUploader.tsx` dengan fase `upload` dan validasi file
    - Implementasi state machine `UploaderPhase`: `upload | loading | review | fallback | saving | success | error`
    - Render area drag-and-drop yang menerima `application/pdf`
    - Validasi MIME type dan ukuran (≤ 10 MB) sisi klien → tampilkan error inline tanpa kirim request
    - Tampilkan nama dan ukuran file setelah dipilih
    - _Requirements: 2.2.4, 2.2.5, 2.2.6, 2.2.7_

  - [ ]* 8.2 Tulis unit test untuk validasi file di CVUploader
    - **Property 7: PDF Validator Rejects Non-PDF and Oversized Files**
    - Test bahwa non-PDF file → tampilkan error, tidak ada request ke server
    - Test bahwa file > 10 MB → tampilkan error, tidak ada request ke server
    - **Validates: Requirements 2.2.6, 2.2.7**

  - [x] 8.3 Implementasi logika upload, parsing progress, dan CV Review Form
    - Upload: fetch `POST /api/admin/cv-parse` dengan `FormData` → transisi ke fase `loading`
    - Pada sukses dengan `parsedData`: transisi ke fase `review` → render CV Review Form
    - Pada `fallback: true`: transisi ke fase `fallback` → render textarea `rawText` + pesan error + tombol copy
    - CV Review Form: section Work Experience (company, role, startDate, endDate, description, achievements, technologies), Education, Skills (dengan level 0–100), Personal Info
    - Tambahkan radio selector Merge Strategy ("Replace All" / "Merge")
    - _Requirements: 2.2.8, 2.4.19, 2.5.20–2.5.24, 2.6.25_

  - [x] 8.4 Implementasi save dari CV Review Form
    - Tombol "Simpan ke Portofolio": kirim `POST /api/admin/cv-save` dengan `{ parsedData, mergeStrategy }`
    - Transisi ke fase `saving` selama request berlangsung
    - Pada sukses: transisi ke fase `success` → tampilkan "Data CV berhasil disimpan ke portofolio" → reset ke `upload` setelah 3 detik
    - Pada error: transisi ke fase `error` dengan pesan dari response, pertahankan data di Review Form
    - _Requirements: 2.6.26, 2.6.31, 2.6.32_

- [x] 9. Update `components/admin/AdminNav.tsx` dan `app/admin/page.tsx`
  - [x] 9.1 Update `components/admin/AdminNav.tsx` — tambah dua tab baru
    - Extend `Tab` type union: tambah `"settings"` dan `"import-cv"`
    - Tambah ke array `TABS`: `{ id: "settings", label: "Settings", icon: "⚙️" }` dan `{ id: "import-cv", label: "Import CV", icon: "📄" }`
    - _Requirements: 1.1.1, 2.1.1_

  - [x] 9.2 Update `app/admin/page.tsx` — lazy load ApiKeyManager dan CVUploader
    - Tambah `const ApiKeyManager = dynamic(() => import("@/components/admin/ApiKeyManager"), { ssr: false })`
    - Tambah `const CVUploader = dynamic(() => import("@/components/admin/CVUploader"), { ssr: false })`
    - Tambah di `<main>`: `{activeTab === "settings" && <ApiKeyManager />}` dan `{activeTab === "import-cv" && <CVUploader />}`
    - _Requirements: 1.1.2, 1.1.3, 2.1.2, 2.1.3_

- [x] 10. Final checkpoint — Pastikan semua tests pass
  - Pastikan semua unit test dan property test pass
  - Verifikasi integrasi: AdminNav menampilkan tab baru, ApiKeyManager dan CVUploader merender tanpa error
  - Pastikan semua file konten (`content/api-keys.json`, `content/education.json`) tersedia
  - Tanyakan ke user jika ada pertanyaan sebelum selesai.

---

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk implementasi MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk traceability
- `lib/api-key-store.ts` dan `lib/cv-parser.ts` hanya diimport dari API routes (server-side), tidak dari client components
- Property tests menggunakan `fast-check` untuk validasi invariant universalitas sistem
- Checkpoint memastikan validasi inkremental di setiap tahap utama
- Design document menggunakan TypeScript — semua implementasi menggunakan TypeScript

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "6.1"] },
    { "id": 2, "tasks": ["2.2", "6.2"] },
    { "id": 3, "tasks": ["2.3", "6.3", "3.1", "3.2"] },
    { "id": 4, "tasks": ["3.3", "4.1", "7.1", "7.2"] },
    { "id": 5, "tasks": ["4.2", "7.3", "7.4", "7.5", "7.6", "7.7", "8.1"] },
    { "id": 6, "tasks": ["8.2", "8.3", "9.1"] },
    { "id": 7, "tasks": ["8.4", "9.2"] }
  ]
}
```
