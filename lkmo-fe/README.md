# YangPentingMakan Frontend

Aplikasi web React + TypeScript untuk komunitas berbagi resep hemat ala anak kos. Proyek ini terintegrasi penuh dengan backend `lkmo-be`, mendukung autentikasi lengkap, manajemen resep, serta panel admin.

## Fitur Utama

- Beranda interaktif dengan hero section, kategori populer, dan resep terbaru yang dipanggil dari API.
- Pencarian resep dengan filter kombinasi (kategori waktu makan, rentang harga, peralatan) dan tampilan hasil adaptif.
- Detail resep lengkap: gambar fallback, informasi waktu & peralatan, harga, rating agregat, simpan resep, dan ulasan pengguna.
- Upload resep baru dengan upload gambar, input dinamis bahan/langkah, kombinasi harga, serta pilihan peralatan standar dan kustom.
- Profil pribadi: statistik ringkas, tab resep sendiri vs. resep tersimpan, edit profil dengan unggah foto, dan logout cepat.
- Profil publik & leaderboard: papan peringkat berbasis penyimpanan resep, jumlah resep, dan rating tertinggi, plus halaman profil untuk tiap kreator.
- Reset password bertahap menggunakan OTP (request → verifikasi → set password baru) serta deteksi akun Google.
- Login & register email/password, dukungan Google Identity Services, “ingat saya”, refresh token otomatis via `AuthContext`.
- Proteksi route menggunakan `ProtectedRoute` untuk halaman privat dan admin-only.
- Panel admin: dashboard statistik, daftar user dengan ubah role/hapus, moderasi resep & ulasan, dan notifikasi reset password.

## Arsitektur & Teknologi

- React 19 dengan TypeScript, Vite sebagai bundler/dev server.
- React Router DOM 7 untuk routing bersarang (layout sidebar + konten utama).
- Tailwind CSS 4 (`@tailwindcss/vite`) untuk styling utilitas.
- Context API (`AuthContext`) untuk state autentikasi dan otorisasi.
- Axios instance tunggal dengan interceptor token, timeout 30 detik, serta handling error jaringan/timeout.
- Komponen ikon dari `lucide-react`.
- Konfigurasi siap deploy (Vercel) melalui `vercel.json` dan fallback environment logging.

## Prasyarat

- Node.js >= 18
- NPM >= 9
- Backend `lkmo-be` berjalan (default `http://localhost:5000`)

## Menjalankan Secara Lokal

1. Masuk ke folder frontend:
   ```bash
   cd lkmo-fe
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Siapkan file `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=<client_id_google_identity_services>
   ```
4. Jalankan backend (`lkmo-be`) pada port 5000.
5. Mulai server pengembangan frontend:
   ```bash
   npm run dev
   ```
6. Buka `http://localhost:5173` di browser.

## Skrip NPM

- `npm run dev` – Menjalankan Vite dev server.
- `npm run build` – Build production (`tsc -b` + `vite build`).
- `npm run preview` – Menjalankan preview build.
- `npm run lint` – Menjalankan ESLint sesuai konfigurasi proyek.

## Variabel Lingkungan

| Nama                       | Contoh Nilai                        | Deskripsi |
|---------------------------|------------------------------------|-----------|
| `VITE_API_URL`            | `https://api.example.com/api`      | Basis URL backend; auto-menambahkan `/api` bila absen. Gunakan tanpa slash penutup. |
| `VITE_GOOGLE_CLIENT_ID`   | `1234567890-xxxx.apps.googleusercontent.com` | Client ID Google Identity Services untuk login dengan Google. |

> Catatan: Bila `VITE_API_URL` tidak di-set di production, aplikasi akan menampilkan log error di console pada saat load data maupun gambar.

## Struktur Direktori Penting

```
lkmo-fe/
├─ src/
│  ├─ components/        # Layout sidebar, kartu resep, route proteksi
│  ├─ contexts/          # AuthContext (state, token storage, Google login)
│  ├─ pages/             # Halaman utama (home, search, upload, admin, reset password, dsb)
│  ├─ services/api.ts    # Wrapper Axios + modul API (auth, recipe, user, admin, reset password)
│  ├─ utils/             # Helper gambar, Google OAuth, dsb
│  ├─ App.tsx            # Definisi routing bersarang
│  └─ main.tsx           # Entry React + pembungkus AuthProvider
├─ public/               # Aset statis (logo, ikon buku)
├─ App.css, index.css    # Utilitas styling global
└─ vite.config.ts        # Konfigurasi Vite + Tailwind plugin
```

## Alur Autentikasi & Otorisasi

- Token JWT dan data user disimpan di `localStorage` setelah login/register.
- `AuthContext` memuat user/token dari storage saat inisialisasi, menambahkan header Authorization ke setiap request melalui interceptor.
- `ProtectedRoute` mencegah akses halaman privat, mengarahkan ke `/login` saat belum autentik, dan menampilkan pesan “Akses Ditolak” untuk route admin ketika role bukan admin.
- Dukungan login Google melalui Google Identity Services (`initializeGoogleSignIn`, `renderGoogleButton`, `triggerGoogleSignIn`) dengan deteksi error apabila `VITE_GOOGLE_CLIENT_ID` tidak disediakan.

## Integrasi Fitur Konten Resep

- **Beranda** menarik data `recipeAPI.getLatest` dan statistik kategori populer dengan fallback gambar lokal.
- **Pencarian** menggunakan `recipeAPI.getAll` dengan parameter dinamis (`search`, `category`, `priceRange`, `equipment`, `limit`). Perubahan filter otomatis memicu pencarian ulang dan menyediakan tombol reset.
- **Detail Resep** memanfaatkan `recipeAPI.getById`, menampilkan metadata lengkap, daftar bahan, langkah, ulasan, serta aksi simpan/unsave dan submit ulasan (rating 1–5). Error fallback gambar ditangani via `imageUtils`.
- **Upload Resep** mengirim `FormData` multipart ke `recipeAPI.create` dengan validasi sisi frontend (minimal bahan/step, harga opsional dengan format ribuan, equipment kustom).
- **Profil** memanggil `userAPI.getProfile` untuk menampilkan statistik, resep sendiri, serta resep tersimpan. Tab switching dilakukan di sisi state.
- **Leaderboard & Profil Publik** mengonsumsi `userAPI.getLeaderboard` dan `userAPI.getUserById`, memungkinkan navigasi ke halaman profil kreator lain.
- **Reset Password** memanfaatkan `passwordResetAPI` (request OTP → verifikasi → set password). Aplikasi mendeteksi akun Google dan menyarankan login Google ketika diperlukan.
- **Panel Admin** memanfaatkan `adminAPI` untuk dashboard statistik, daftar user, resep, dan ulasan. Halaman admin lain (`AdminUsersPage`, `AdminRecipesPage`, `AdminReviewsPage`) menyediakan pencarian, pagination, dan aksi CRUD dasar.

## Skenario Uji Manual yang Disarankan

- Registrasi dan login (email/password) serta login dengan Google.
- Alur reset password lengkap (request OTP → verifikasi → set password baru) dan verifikasi handling rate-limit error.
- Upload resep baru termasuk upload gambar, equipment kustom, dan verifikasi tampilan di halaman detail.
- Simpan resep, beri ulasan, dan cek pembaruan rating.
- Edit profil: ubah nama/bio/lokasi/foto, pastikan hasilnya tercermin di profil pengguna dan kartu resep.
- Gunakan pencarian dengan kombinasi filter, termasuk skenario tanpa hasil dan tombol reset.
- Akses halaman admin menggunakan akun admin, uji penghapusan user/resep/ulasan, dan periksa akurasi statistik dashboard.

## Troubleshooting Singkat

- **Tidak bisa terhubung ke backend**: pastikan backend aktif di port 5000 dan `VITE_API_URL` sudah benar.
- **Gambar tidak muncul**: cek konsol untuk URL final (`imageUtils`) dan pastikan backend menyajikan file statis `/uploads`.
- **Error 401 berulang**: token kemungkinan kadaluarsa. Logout otomatis akan memaksa pengguna login ulang.
- **Timeout request** (30 detik): backend mungkin sleep (mis. Render free tier). Jalankan ulang backend lalu refresh.

---

Dokumentasi backend tersedia di `lkmo-be/README.md` dan panduan integrasi tambahan terdapat di `SETUP.md` dan `ENV_VARIABLES.md` pada repositori ini.
