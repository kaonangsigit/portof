# Requirements Document

## Introduction

Upgrade portofolio Next.js 14 yang sudah ada (App Router, TypeScript, Tailwind CSS) dengan tiga fitur utama:

1. **3D Visual Hero** — Mengganti Hero section statis dengan tampilan 3D interaktif menggunakan React Three Fiber (`@react-three/fiber`, `@react-three/drei`, `three`) yang sudah terpasang di `package.json`. Menampilkan partikel 3D, floating geometric shapes, respons mouse, dan animasi scroll-triggered.

2. **GitHub Data Real-time** — Menggantikan data hardcoded di `lib/data.ts` dengan fetch langsung ke GitHub API menggunakan `lib/github.ts` dan `@octokit/rest` yang sudah ada. Menampilkan repo terbaru, statistik agregat, contribution graph, dan bahasa favorit dengan caching ISR dan proper loading/error state.

3. **Admin Panel CMS** — Halaman `/admin` dengan autentikasi berbasis environment variable (`ADMIN_PASSWORD`). Memungkinkan upload sertifikat drag-drop, manajemen project (tambah/edit/hapus), dan edit personal info. Semua data disimpan dalam file JSON di folder `content/`, memanfaatkan API endpoint yang sudah ada (`/api/certificates`, `/api/content`, `/api/projects`).

Proyek berada di `/Users/kaonangprakoso/Desktop/Portofolio`. GitHub username: `kaonangsigit`.

---

## Glossary

- **3D Scene**: Canvas WebGL yang dirender oleh React Three Fiber di dalam Hero section.
- **Hero Section**: Komponen `components/Hero.tsx` yang menjadi bagian pertama yang terlihat di halaman utama.
- **ParticleField**: Sub-komponen yang merender partikel 3D bergerak dalam 3D Scene.
- **FloatingShapes**: Sub-komponen yang merender bentuk geometri 3D melayang (box, torus, octahedron, dll).
- **WebGL Fallback**: Tampilan Hero alternatif yang dirender tanpa canvas WebGL ketika browser tidak mendukung WebGL.
- **GitHub Stats**: Data agregat dari GitHub API yang mencakup total stars, total forks, jumlah repo, dan jumlah followers.
- **GitHubSection**: Komponen React yang menampilkan data GitHub real-time di halaman utama.
- **ISR**: Incremental Static Regeneration — mekanisme revalidasi cache Next.js menggunakan `next: { revalidate: N }` pada `fetch()`.
- **CMS Loader**: Modul `lib/cms-loader.ts` yang sudah ada, membaca data dari file JSON di folder `content/`.
- **Admin Panel**: Halaman Next.js di route `/admin` yang dilindungi password untuk mengelola konten portofolio.
- **Content Store**: Kumpulan file JSON di folder `content/` (`personal.json`, `skills.json`, `experience.json`, `projects.json`, `certificates.json`) yang menjadi sumber data CMS.
- **Session Cookie**: Cookie HTTP-only yang diterbitkan saat login Admin Panel berhasil untuk menjaga sesi autentikasi.
- **Certificate**: Objek yang merepresentasikan sertifikat dengan field: `id`, `title`, `issuer`, `date`, `image` (path relatif ke `public/certificates/`), dan `description`.
- **Project**: Objek yang merepresentasikan proyek dengan field: `id`, `title`, `description`, `longDescription`, `technologies`, `githubUrl`, `liveUrl`, `image`, `featured`, `category`.
- **Drag-Drop Zone**: Area UI di Admin Panel tempat user men-drag file gambar untuk diupload.
- **Preview Mode**: Mode tampilan di Admin Panel yang menampilkan tampilan perubahan sebelum disimpan ke Content Store.
- **Scroll-Triggered Animation**: Animasi pada 3D Scene yang merespons posisi scroll halaman menggunakan Intersection Observer atau scroll event.
- **Mouse Parallax**: Efek perpindahan elemen 3D relatif terhadap posisi kursor mouse.

---

## Requirements

### Requirement 1: 3D Visual Hero Section

**User Story:** Sebagai pengunjung portofolio, saya ingin melihat Hero section yang memiliki visual 3D interaktif dengan partikel dan bentuk geometri melayang agar portofolio terlihat modern dan menarik perhatian.

#### Acceptance Criteria

1. WHEN halaman utama dimuat dan WebGL tersedia, THE Hero Section SHALL merender 3D Scene menggunakan React Three Fiber di atas konten teks Hero yang sudah ada.

2. THE ParticleField SHALL merender minimal 80 partikel 3D yang bergerak secara kontinu di dalam 3D Scene dengan kecepatan dan arah yang bervariasi.

3. THE FloatingShapes SHALL merender minimal 5 bentuk geometri 3D (antara lain box, torus, octahedron) yang berputar dan melayang di dalam 3D Scene.

4. WHEN posisi kursor mouse berpindah di atas Hero Section, THE 3D Scene SHALL menggeser posisi kamera atau rotasi scene secara proporsional terhadap delta posisi kursor (Mouse Parallax) dengan faktor maksimal 0.05 radian per piksel.

5. WHEN pengguna men-scroll halaman sehingga Hero Section mulai keluar dari viewport, THE 3D Scene SHALL menerapkan Scroll-Triggered Animation berupa perubahan posisi atau opasitas elemen 3D proporsional terhadap persentase scroll.

6. THE Hero Section SHALL menggunakan `React.lazy` atau dynamic import dengan `next/dynamic` untuk memuat komponen React Three Fiber, sehingga bundle 3D tidak dimasukkan dalam initial page load.

7. THE 3D Scene SHALL merender dengan target frame rate minimal 30 fps pada perangkat desktop dengan GPU terintegrasi, diukur menggunakan `PerformanceObserver` atau `stats.js` di development mode.

8. IF browser tidak mendukung WebGL atau terjadi error saat inisialisasi 3D Scene, THEN THE Hero Section SHALL menampilkan WebGL Fallback berupa Hero Section versi CSS/Tailwind yang fungsional lengkap tanpa canvas 3D.

9. THE 3D Scene SHALL menggunakan `<Suspense>` dengan fallback yang menampilkan Hero Section statis selama komponen 3D dimuat.

10. WHILE 3D Scene aktif, THE ParticleField dan FloatingShapes SHALL berhenti menghitung animasi (pause render loop) ketika tab browser tidak aktif menggunakan Page Visibility API untuk menghemat resource.

---

### Requirement 2: GitHub Data Real-time

**User Story:** Sebagai pengunjung portofolio, saya ingin melihat data GitHub yang akurat dan terkini (bukan hardcoded) agar saya dapat menilai aktivitas pengembangan yang sebenarnya.

#### Acceptance Criteria

1. THE GitHubSection SHALL mengambil data profil GitHub dari endpoint `/api/github/profile` yang memanggil `fetchGitHubProfile()` dari `lib/github.ts` dengan revalidasi ISR setiap 3600 detik.

2. THE GitHubSection SHALL mengambil daftar repository GitHub dari endpoint `/api/github/repos` yang memanggil `fetchGitHubRepos()` dari `lib/github.ts` dengan revalidasi ISR setiap 3600 detik.

3. THE GitHubSection SHALL menampilkan maksimal 6 repository paling baru berdasarkan field `updated_at` dari GitHub API.

4. THE GitHubSection SHALL menghitung dan menampilkan GitHub Stats agregat yang terdiri dari: total stars (jumlah `stargazers_count` dari semua repo), total forks (jumlah `forks_count` dari semua repo), jumlah repo publik (dari profil), dan jumlah followers (dari profil).

5. THE GitHubSection SHALL menampilkan bar chart atau daftar terurut dari maksimal 5 bahasa pemrograman paling sering digunakan, dihitung berdasarkan frekuensi `language` non-null dari semua repo.

6. THE GitHubSection SHALL merender contribution graph menggunakan data dari GitHub API endpoint `GET /users/{username}/events` atau embed gambar kontribusi dari `https://ghchart.rshah.org/{username}` dengan atribut `alt` yang deskriptif.

7. WHEN data GitHub sedang diambil dari API, THE GitHubSection SHALL menampilkan skeleton loading state untuk setiap kartu statistik dan daftar repository.

8. IF GitHub API mengembalikan status code selain 200, THEN THE GitHubSection SHALL menampilkan pesan error yang informatif beserta tombol "Retry" yang memicu ulang fetch data.

9. IF environment variable `GITHUB_TOKEN` tidak terdefinisi, THEN THE GitHubSection SHALL tetap berfungsi dengan anonymous rate limit (60 request/jam) dan mencatat warning ke server console.

10. WHEN data GitHub berhasil diambil, THE GitHubSection SHALL menampilkan link langsung ke profil GitHub (`https://github.com/{username}`) dengan target `_blank` dan `rel="noopener noreferrer"`.

11. THE endpoint `/api/github/stats` SHALL menghitung GitHub Stats secara server-side dan mengembalikan JSON dengan field: `totalStars`, `totalForks`, `publicRepos`, `followers`, `topLanguages` (array maksimal 5 item).

---

### Requirement 3: Admin Panel CMS

**User Story:** Sebagai pemilik portofolio, saya ingin memiliki halaman admin yang terlindungi password agar saya dapat mengelola konten portofolio (sertifikat, proyek, info personal) langsung dari browser tanpa harus mengedit kode.

#### Acceptance Criteria

**3.1 — Autentikasi Admin**

1. THE Admin Panel SHALL tersedia pada route `/admin` dalam Next.js App Router sebagai halaman client-side yang terproteksi.

2. WHEN pengguna mengakses `/admin` dan belum memiliki Session Cookie yang valid, THE Admin Panel SHALL menampilkan form login dengan field password.

3. WHEN pengguna memasukkan password yang cocok dengan environment variable `ADMIN_PASSWORD` dan menekan tombol Submit, THE Admin Panel SHALL menerbitkan Session Cookie HTTP-only bernama `admin_session` dengan nilai token yang di-hash menggunakan SHA-256, dengan masa berlaku 24 jam.

4. WHEN pengguna memasukkan password yang tidak cocok dengan `ADMIN_PASSWORD`, THE Admin Panel SHALL menampilkan pesan error "Password salah" dan tidak menerbitkan Session Cookie.

5. IF environment variable `ADMIN_PASSWORD` tidak terdefinisi atau kosong, THEN THE Admin Panel SHALL menampilkan error 500 dan mencatat log ke server console saat endpoint login diakses.

6. WHEN pengguna menekan tombol Logout, THE Admin Panel SHALL menghapus Session Cookie `admin_session` dan mengarahkan pengguna ke form login.

**3.2 — Upload Sertifikat**

7. WHILE pengguna terautentikasi di Admin Panel, THE Admin Panel SHALL menampilkan tab atau section "Sertifikat" yang berisi daftar sertifikat yang ada dan Drag-Drop Zone.

8. WHEN pengguna men-drag file gambar berformat JPG, PNG, atau WEBP ke Drag-Drop Zone, THE Admin Panel SHALL menampilkan preview thumbnail gambar tersebut sebelum upload.

9. WHEN pengguna mengkonfirmasi upload setelah mengisi field `title` dan `issuer` yang wajib diisi, THE Admin Panel SHALL mengirim file ke endpoint `/api/certificates` via `POST` multipart/form-data dan menyimpan file ke direktori `public/certificates/`.

10. WHEN upload sertifikat berhasil, THE Admin Panel SHALL memperbarui Content Store (`content/certificates.json`) dengan entri Certificate baru dan menampilkan sertifikat tersebut di daftar sertifikat Admin Panel tanpa reload halaman penuh.

11. IF file yang diupload berukuran lebih dari 5 MB, THEN THE Admin Panel SHALL menolak upload dan menampilkan pesan error "Ukuran file melebihi batas 5 MB".

12. IF file yang diupload bukan berformat JPG, PNG, atau WEBP, THEN THE Admin Panel SHALL menolak upload dan menampilkan pesan error "Format file tidak didukung".

13. WHEN pengguna menekan tombol hapus pada entri sertifikat, THE Admin Panel SHALL menampilkan dialog konfirmasi sebelum menghapus file dari `public/certificates/` dan entri dari `content/certificates.json`.

**3.3 — Manajemen Project**

14. WHILE pengguna terautentikasi di Admin Panel, THE Admin Panel SHALL menampilkan tab atau section "Projects" yang berisi daftar project dari Content Store dengan tombol Edit dan Hapus per item.

15. WHEN pengguna menekan tombol "Tambah Project" dan mengisi form dengan field `title`, `description`, `technologies` (comma-separated), `githubUrl`, `liveUrl`, `category`, dan `featured` (checkbox), THE Admin Panel SHALL mengirim data ke endpoint `/api/projects` via `POST` dan memperbarui Content Store (`content/projects.json`).

16. WHEN pengguna menekan tombol Edit pada sebuah project dan mengubah field, THE Admin Panel SHALL mengirim data ke endpoint `/api/projects/{id}` via `PUT` dan memperbarui entri yang sesuai di Content Store.

17. WHEN pengguna menekan tombol Hapus pada sebuah project dan mengkonfirmasi dialog, THE Admin Panel SHALL mengirim request ke endpoint `/api/projects/{id}` via `DELETE` dan menghapus entri dari Content Store.

18. THE form Project SHALL memvalidasi bahwa field `title` dan `description` tidak kosong sebelum mengizinkan submit, dan menampilkan pesan validasi inline.

**3.4 — Edit Personal Info**

19. WHILE pengguna terautentikasi di Admin Panel, THE Admin Panel SHALL menampilkan tab atau section "Personal Info" dengan form yang pre-populated dari data di `content/personal.json`.

20. THE form Personal Info SHALL memiliki field: `name`, `title`, `subtitle`, `bio` (textarea), `email`, `location`, `availability`, dan daftar skills yang dapat ditambah/dihapus.

21. WHEN pengguna mengklik tombol "Preview" di form Personal Info, THE Admin Panel SHALL menampilkan Preview Mode yang merender card preview dengan data terbaru dari form (belum disimpan).

22. WHEN pengguna menekan tombol "Simpan" di form Personal Info, THE Admin Panel SHALL mengirim data ke endpoint `/api/content` via `PUT` dengan parameter `type=personal` dan memperbarui `content/personal.json`.

23. IF request PUT ke `/api/content` gagal, THEN THE Admin Panel SHALL menampilkan toast notification error dan mempertahankan data form yang belum tersimpan.

**3.5 — Keamanan & Integritas Data**

24. THE endpoint `/api/certificates` (POST, DELETE), `/api/projects` (POST, PUT, DELETE), dan `/api/content` (PUT) SHALL memvalidasi keberadaan Session Cookie `admin_session` yang valid sebelum memproses request, dan mengembalikan status 401 jika tidak valid.

25. THE Admin Panel SHALL menggunakan HTTPS-only cookie (`Secure` flag) untuk Session Cookie saat berjalan di environment production (`NODE_ENV === 'production'`).

26. IF pengguna tidak aktif selama lebih dari 24 jam, THEN THE Admin Panel SHALL secara otomatis menghapus Session Cookie yang kedaluwarsa dan mengarahkan ke form login pada request berikutnya.
