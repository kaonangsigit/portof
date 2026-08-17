# Requirements Document

## Introduction

Penambahan dua fitur baru pada Admin Panel (`/admin`) portofolio Next.js 14 yang sudah ada:

1. **API Key Manager** — Tab baru "Settings" di Admin Panel untuk mengelola API keys dan konfigurasi layanan eksternal (GitHub Token, Google Analytics, OpenAI, Gemini, Resend, SendGrid, Custom Webhook) tanpa harus mengedit file `.env` secara manual. Keys disimpan terenkripsi di `content/api-keys.json` menggunakan AES-256, hanya dapat diakses oleh admin terautentikasi.

2. **CV Upload & AI Parsing** — Tab baru "Import CV" di Admin Panel untuk upload file PDF CV, ekstrak teks secara otomatis, kirim ke AI (OpenAI GPT-4o atau Gemini), parse hasilnya menjadi data terstruktur (work experience, education, skills, personal info), beri kesempatan admin untuk mereview dan mengedit, lalu simpan langsung ke file JSON di `content/`.

Kedua fitur ini diintegrasikan ke dalam Admin Panel yang sudah ada dengan menambah tab baru pada `AdminNav` dan komponen baru yang di-lazy load via `next/dynamic`. Proyek menggunakan Next.js 14.2.28, App Router, TypeScript, Tailwind CSS, dengan konten tersimpan di `content/*.json` dan auth berbasis Session Cookie `admin_session`.

---

## Glossary

- **Admin Panel**: Halaman Next.js di route `/admin` yang dilindungi Session Cookie `admin_session`, tempat admin mengelola konten portofolio.
- **AdminNav**: Komponen `components/admin/AdminNav.tsx` yang menampilkan tab navigasi Admin Panel; `Tab` type harus diperluas untuk tab baru.
- **Session Cookie**: Cookie HTTP-only bernama `admin_session` yang diterbitkan setelah login berhasil dan divalidasi sebelum setiap operasi write.
- **Content Store**: Kumpulan file JSON di `content/` (`personal.json`, `skills.json`, `experience.json`, `projects.json`, `certificates.json`, dll.) yang menjadi sumber data CMS.
- **API Key Store**: File `content/api-keys.json` yang menyimpan kumpulan API key dalam format terenkripsi AES-256.
- **MASTER_KEY**: Environment variable yang digunakan sebagai kunci enkripsi/dekripsi AES-256 untuk API Key Store.
- **Encrypted Entry**: Satu record di API Key Store, terdiri dari field `id` (string identifier key), `ciphertext` (nilai key yang terenkripsi AES-256-GCM, base64), dan `iv` (initialization vector, base64).
- **API Key Form**: Komponen UI di tab "Settings" yang menampilkan daftar field per API key dengan nilai ter-mask dan tombol reveal/save.
- **Masked Value**: Representasi nilai API key di UI yang menampilkan karakter `****` untuk menyembunyikan nilai sebenarnya.
- **Connection Test**: Validasi konektivitas per API key — misalnya request ke `https://api.github.com/user` untuk GitHub Token, atau validasi format regex untuk Google Analytics ID (`^G-[A-Z0-9]+$`).
- **CV Uploader**: Komponen `components/admin/CVUploader.tsx` di tab "Import CV" yang menangani upload PDF dan menampilkan progress parsing.
- **PDF Extractor**: Modul server-side yang mengekstrak teks mentah dari file PDF menggunakan `pdf-parse` atau `pdfjs-dist`.
- **AI Parser**: Fungsi server-side yang mengirim teks CV ke OpenAI GPT-4o atau Gemini API dengan prompt terstruktur dan menerima respons JSON.
- **Parsed CV Data**: Objek JSON terstruktur hasil AI Parser yang memiliki field: `work_experience[]`, `education[]`, `skills[]`, `personal_info`.
- **WorkExperience**: Objek dengan field: `id` (string), `company` (string), `role` (string), `startDate` (string YYYY-MM), `endDate` (string YYYY-MM atau `"present"`), `description` (string), `achievements` (string[]), `technologies` (string[]).
- **Education**: Objek dengan field: `id` (string), `institution` (string), `degree` (string), `startDate` (string YYYY-MM), `endDate` (string YYYY-MM), `description` (string), `achievements` (string[]).
- **SkillGroup**: Objek dengan field: `category` (string), `items` (array of `{name: string, level: number}`).
- **PersonalInfo**: Objek dengan field: `name` (string), `title` (string), `email` (string), `location` (string), `phone` (string, opsional).
- **CV Review Form**: UI di tab "Import CV" setelah parsing berhasil, menampilkan hasil parsed CV yang dapat diedit per item sebelum disimpan.
- **Merge Strategy**: Opsi yang dipilih admin sebelum menyimpan — "Replace All" (timpa semua data existing) atau "Merge" (tambahkan ke data existing tanpa menghapus).
- **Hot-reload Config**: Mekanisme membaca ulang nilai dari API Key Store pada setiap request ke API route, sehingga perubahan key langsung berlaku tanpa restart server.

---

## Requirements

### Requirement 1: API Key Manager — Tab Settings

**User Story:** Sebagai admin portofolio, saya ingin mengelola API keys untuk layanan eksternal langsung dari Admin Panel agar tidak perlu mengedit file `.env` secara manual dan keys tersimpan aman.

#### Acceptance Criteria

**1.1 — Integrasi Tab ke Admin Panel**

1. THE AdminNav SHALL menampilkan tab "Settings" dengan identifier `"settings"` sebagai bagian dari daftar tab yang dapat diklik, setelah tab yang sudah ada.

2. WHEN admin mengklik tab "Settings", THE Admin Panel SHALL merender komponen `ApiKeyManager` yang di-lazy load menggunakan `next/dynamic` dengan `ssr: false`.

3. WHILE admin belum terautentikasi, THE Admin Panel SHALL menampilkan form login dan tidak merender komponen `ApiKeyManager`.

**1.2 — Penyimpanan Keys Terenkripsi**

4. THE API Key Store SHALL menyimpan setiap API key sebagai Encrypted Entry di `content/api-keys.json` menggunakan algoritma AES-256-GCM dengan IV unik per entri.

5. THE API Key Store SHALL mendukung field key berikut dengan identifier masing-masing: `github_token`, `google_analytics_id`, `openai_api_key`, `gemini_api_key`, `resend_api_key`, `sendgrid_api_key`, `custom_webhook_url`.

6. IF environment variable `MASTER_KEY` tidak terdefinisi atau kosong, THEN THE endpoint `/api/admin/api-keys` SHALL mengembalikan status 500 dan pesan error `"MASTER_KEY environment variable is not configured"`.

7. THE endpoint `/api/admin/api-keys` SHALL memvalidasi keberadaan Session Cookie `admin_session` yang valid sebelum memproses request, dan mengembalikan status 401 jika tidak valid.

**1.3 — Tampilan UI**

8. WHEN komponen `ApiKeyManager` dimuat, THE ApiKeyManager SHALL menampilkan satu field per API key yang terdaftar, dengan label deskriptif (contoh: "GitHub Token"), Masked Value (`****`), tombol "Reveal", dan tombol "Save".

9. WHEN admin mengklik tombol "Reveal" pada sebuah field, THE ApiKeyManager SHALL men-dekripsi nilai dari API Key Store menggunakan `MASTER_KEY` dan menampilkan nilai asli dalam field input teks tersebut, serta mengubah tombol "Reveal" menjadi "Hide".

10. WHEN admin mengklik tombol "Hide" pada sebuah field yang sedang direveal, THE ApiKeyManager SHALL kembali menampilkan Masked Value dan menyembunyikan nilai asli.

11. WHEN admin mengubah nilai sebuah field dan mengklik tombol "Save" untuk field tersebut, THE ApiKeyManager SHALL mengirim request `PUT /api/admin/api-keys/{keyId}` dengan nilai baru, dan menampilkan indikator loading selama request berlangsung.

12. WHEN request save berhasil, THE ApiKeyManager SHALL menampilkan notifikasi sukses inline di bawah field tersebut dan kembali menampilkan Masked Value.

13. IF request save gagal, THEN THE ApiKeyManager SHALL menampilkan pesan error inline di bawah field tersebut dan mempertahankan nilai yang sedang diedit.

**1.4 — Validasi & Connection Test**

14. WHEN admin mengklik tombol "Test" pada field `github_token`, THE ApiKeyManager SHALL mengirim request ke `GET /api/admin/api-keys/test?key=github_token` yang melakukan request ke `https://api.github.com/user` menggunakan token tersebut, dan menampilkan hasil berupa username GitHub atau pesan error.

15. WHEN admin mengklik tombol "Test" pada field `google_analytics_id`, THE ApiKeyManager SHALL memvalidasi format menggunakan regex `^G-[A-Z0-9]+$` dan menampilkan "Valid format" atau "Format tidak valid: harus diawali G- diikuti karakter alfanumerik".

16. WHEN admin mengklik tombol "Test" pada field `openai_api_key`, THE ApiKeyManager SHALL mengirim request ke `GET /api/admin/api-keys/test?key=openai_api_key` yang melakukan request ke `https://api.openai.com/v1/models` menggunakan Authorization header, dan menampilkan "Connected" atau pesan error HTTP.

17. WHEN admin mengklik tombol "Test" pada field `gemini_api_key`, THE ApiKeyManager SHALL mengirim request ke `GET /api/admin/api-keys/test?key=gemini_api_key` yang melakukan validasi ke Gemini API endpoint, dan menampilkan "Connected" atau pesan error.

18. WHEN admin mengklik tombol "Test" pada field `resend_api_key`, THE ApiKeyManager SHALL mengirim request ke `GET /api/admin/api-keys/test?key=resend_api_key` yang melakukan request ke Resend API `/domains` endpoint, dan menampilkan "Connected" atau pesan error.

19. WHEN admin mengklik tombol "Test" pada field `custom_webhook_url`, THE ApiKeyManager SHALL memvalidasi format URL menggunakan konstruktor `URL` JavaScript dan menampilkan "Valid URL" atau "Format URL tidak valid".

**1.5 — Hot-reload Config**

20. WHEN sebuah API route di Next.js App Router membutuhkan nilai API key (contoh: GitHub Token di `/api/github/repos`), THE route handler SHALL membaca nilai dari API Key Store melalui fungsi `getApiKey(keyId)` pada setiap request, bukan dari cache in-memory statik, sehingga perubahan key langsung berlaku tanpa restart server.

---

### Requirement 2: CV Upload & AI Parsing — Tab Import CV

**User Story:** Sebagai admin portofolio, saya ingin mengupload file PDF CV dan mengekstrak datanya secara otomatis menggunakan AI agar data work experience, education, skills, dan personal info di portofolio dapat diperbarui dengan cepat tanpa input manual.

#### Acceptance Criteria

**2.1 — Integrasi Tab ke Admin Panel**

1. THE AdminNav SHALL menampilkan tab "Import CV" dengan identifier `"import-cv"` sebagai bagian dari daftar tab yang dapat diklik.

2. WHEN admin mengklik tab "Import CV", THE Admin Panel SHALL merender komponen `CVUploader` yang di-lazy load menggunakan `next/dynamic` dengan `ssr: false`.

3. WHILE admin belum terautentikasi, THE Admin Panel SHALL menampilkan form login dan tidak merender komponen `CVUploader`.

**2.2 — Upload File PDF**

4. THE CVUploader SHALL menampilkan area drag-and-drop yang menerima file dengan MIME type `application/pdf`.

5. WHEN admin men-drag file PDF ke area drag-and-drop atau mengklik tombol "Pilih File", THE CVUploader SHALL menampilkan nama file dan ukuran file yang dipilih sebelum upload.

6. IF file yang dipilih bukan berformat PDF (MIME type bukan `application/pdf`), THEN THE CVUploader SHALL menampilkan pesan error "Hanya file PDF yang didukung" dan tidak melanjutkan ke tahap upload.

7. IF file PDF yang dipilih berukuran lebih dari 10 MB, THEN THE CVUploader SHALL menampilkan pesan error "Ukuran file melebihi batas 10 MB" dan tidak melanjutkan ke tahap upload.

8. WHEN admin mengklik tombol "Upload & Parse", THE CVUploader SHALL mengirim file ke endpoint `POST /api/admin/cv-parse` via `multipart/form-data` dan menampilkan indikator loading dengan pesan "Mengekstrak teks dari PDF...".

9. THE endpoint `POST /api/admin/cv-parse` SHALL memvalidasi keberadaan Session Cookie `admin_session` yang valid sebelum memproses request, dan mengembalikan status 401 jika tidak valid.

**2.3 — Ekstraksi Teks dari PDF**

10. THE endpoint `POST /api/admin/cv-parse` SHALL menggunakan `pdf-parse` atau `pdfjs-dist` untuk mengekstrak teks mentah dari file PDF yang diupload.

11. IF proses ekstraksi teks PDF gagal, THEN THE endpoint SHALL mengembalikan status 422 dengan field `rawText: null` dan `error: "Gagal mengekstrak teks dari PDF"`.

**2.4 — AI Parsing**

12. THE endpoint `POST /api/admin/cv-parse` SHALL mengirim teks hasil ekstraksi ke OpenAI GPT-4o (menggunakan `openai_api_key` dari API Key Store) atau ke Gemini API (menggunakan `gemini_api_key` dari API Key Store) dengan prompt terstruktur yang meminta output JSON berformat Parsed CV Data.

13. THE prompt terstruktur yang dikirim ke AI SHALL meminta output JSON dengan schema: `{ work_experience: WorkExperience[], education: Education[], skills: SkillGroup[], personal_info: PersonalInfo }` beserta instruksi bahwa field yang tidak ditemukan diisi dengan nilai default kosong.

14. WHEN `openai_api_key` tersedia di API Key Store, THE endpoint SHALL menggunakan OpenAI GPT-4o sebagai AI Parser utama.

15. IF `openai_api_key` tidak tersedia atau kosong, THEN THE endpoint SHALL menggunakan Gemini API sebagai fallback AI Parser menggunakan `gemini_api_key` dari API Key Store.

16. IF kedua API key (`openai_api_key` dan `gemini_api_key`) tidak tersedia, THEN THE endpoint SHALL mengembalikan respons dengan field `parsedData: null`, `rawText` berisi teks mentah hasil ekstraksi PDF, dan `fallback: true` agar admin dapat mengedit manual.

17. WHEN AI Parser mengembalikan respons, THE endpoint SHALL memvalidasi bahwa respons dapat di-parse sebagai JSON valid dengan schema Parsed CV Data, dan mengembalikan status 200 dengan field `parsedData` yang berisi hasil parsing.

18. IF AI mengembalikan respons yang tidak dapat di-parse sebagai JSON valid, THEN THE endpoint SHALL mengembalikan respons dengan field `parsedData: null`, `rawText` berisi teks mentah, dan `fallback: true`.

**2.5 — CV Review Form**

19. WHEN endpoint `/api/admin/cv-parse` mengembalikan `parsedData` yang valid, THE CVUploader SHALL beralih ke tampilan CV Review Form yang menampilkan hasil parsing dalam form yang dapat diedit per item.

20. THE CV Review Form SHALL menampilkan section "Work Experience" berisi daftar WorkExperience yang dapat diedit, dengan field: `company`, `role`, `startDate`, `endDate`, `description`, `achievements` (textarea list), `technologies` (comma-separated input).

21. THE CV Review Form SHALL menampilkan section "Education" berisi daftar Education yang dapat diedit, dengan field: `institution`, `degree`, `startDate`, `endDate`, `description`, `achievements` (textarea list).

22. THE CV Review Form SHALL menampilkan section "Skills" berisi daftar SkillGroup yang dapat diedit, dengan kemampuan menambah/menghapus item dalam setiap group dan mengatur nilai `level` (0–100).

23. THE CV Review Form SHALL menampilkan section "Personal Info" berisi field `name`, `title`, `email`, `location`, dan `phone` (opsional) yang dapat diedit.

24. WHEN endpoint mengembalikan `fallback: true`, THE CVUploader SHALL menampilkan textarea yang berisi `rawText` beserta pesan "AI parsing gagal — edit data secara manual" dan tombol untuk menyalin teks.

**2.6 — Konfirmasi & Penyimpanan**

25. THE CV Review Form SHALL menampilkan pilihan Merge Strategy berupa dua opsi radio: "Replace All" (timpa data existing) dan "Merge" (tambahkan ke data existing).

26. WHEN admin mengklik tombol "Simpan ke Portofolio" setelah mereview data, THE CV Review Form SHALL mengirim request `POST /api/admin/cv-save` dengan payload berisi `parsedData` yang telah diedit dan `mergeStrategy` ("replace" atau "merge").

27. THE endpoint `POST /api/admin/cv-save` SHALL memvalidasi keberadaan Session Cookie `admin_session` yang valid sebelum memproses request, dan mengembalikan status 401 jika tidak valid.

28. WHEN `mergeStrategy` adalah `"replace"`, THE endpoint `POST /api/admin/cv-save` SHALL menimpa seluruh isi `content/experience.json` dengan `work_experience[]` dari payload, dan menimpa seluruh isi `content/education.json` (jika ada) dengan `education[]` dari payload, serta mengupdate `content/skills.json` dengan `skills[]` dari payload.

29. WHEN `mergeStrategy` adalah `"merge"`, THE endpoint `POST /api/admin/cv-save` SHALL menambahkan item-item dari `work_experience[]`, `education[]`, dan `skills[]` payload ke data existing di file JSON yang sesuai, tanpa menghapus entri yang sudah ada.

30. WHEN `personal_info` dalam payload tidak kosong, THE endpoint `POST /api/admin/cv-save` SHALL mengupdate field-field yang relevan di `content/personal.json` (menimpa field `name`, `title`, `email`, `location` jika tersedia di payload) tanpa menghapus field lain di personal.json.

31. WHEN request save berhasil, THE endpoint SHALL mengembalikan status 200 dan THE CVUploader SHALL menampilkan pesan sukses "Data CV berhasil disimpan ke portofolio" dan mereset tampilan ke form upload awal.

32. IF request save ke salah satu file JSON gagal (misalnya error filesystem), THEN THE endpoint SHALL mengembalikan status 500 dengan pesan error deskriptif dan THE CVUploader SHALL menampilkan pesan error tersebut tanpa menghapus data di CV Review Form.

**2.7 — Keamanan & Validasi Endpoint**

33. THE endpoint `POST /api/admin/cv-parse` SHALL membatasi ukuran request body multipart maksimal 10 MB.

34. THE endpoint `POST /api/admin/cv-save` SHALL memvalidasi bahwa payload mengandung setidaknya satu dari field `work_experience`, `education`, `skills`, atau `personal_info` yang tidak kosong sebelum melakukan operasi write ke filesystem.

35. THE endpoint `POST /api/admin/cv-save` SHALL memvalidasi bahwa setiap item `WorkExperience` dalam payload mengandung field `company` dan `role` yang tidak kosong sebelum disimpan.

36. THE endpoint `POST /api/admin/cv-save` SHALL memvalidasi bahwa setiap item `Education` dalam payload mengandung field `institution` dan `degree` yang tidak kosong sebelum disimpan.
