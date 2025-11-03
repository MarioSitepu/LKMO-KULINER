# Setup Google OAuth Login

Dokumentasi ini menjelaskan cara mengkonfigurasi login dan registrasi menggunakan akun Google.

## Prasyarat

1. Akun Google Developer Console
2. Aplikasi sudah dikonfigurasi di Google Cloud Console

## Langkah-langkah Setup

### 1. Membuat OAuth 2.0 Client di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih atau buat project baru
3. Aktifkan **Google+ API** (jika belum)
4. Pergi ke **APIs & Services** > **Credentials**
5. Klik **Create Credentials** > **OAuth client ID**
6. Pilih aplikasi type:
   - Untuk development: **Web application**
   - Untuk production: Pilih sesuai kebutuhan
7. Tambahkan **Authorized JavaScript origins**:
   - `http://localhost:5173` (untuk development)
   - URL production Anda (misalnya: `https://yourdomain.com`)
8. Tambahkan **Authorized redirect URIs**:
   - `http://localhost:5173` (untuk development)
   - URL production Anda
9. Salin **Client ID** yang dihasilkan

### 2. Konfigurasi Backend (.env)

Tambahkan variabel berikut di file `.env` backend (`lkmo-be/.env`):

```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Catatan:** `GOOGLE_CLIENT_ID` harus sama dengan yang digunakan di frontend.

### 3. Konfigurasi Frontend (.env)

Tambahkan variabel berikut di file `.env` frontend (`lkmo-fe/.env`):

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Catatan:** Pastikan menggunakan `VITE_` prefix untuk variabel environment di Vite.

### 4. Struktur File .env

**Backend (`lkmo-be/.env`):**
```env
# Database
MONGODB_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Frontend (`lkmo-fe/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

## Cara Menggunakan

### Di Halaman Login

1. Klik tombol **"Masuk dengan Google"**
2. Pilih akun Google yang ingin digunakan
3. Sistem akan otomatis:
   - Membuat akun baru jika email belum terdaftar
   - Login jika email sudah terdaftar

### Di Halaman Register

1. Klik tombol **"Daftar dengan Google"**
2. Pilih akun Google yang ingin digunakan
3. Sistem akan otomatis membuat akun baru

## Fitur yang Tersedia

- ✅ Login otomatis jika email sudah terdaftar
- ✅ Registrasi otomatis jika email belum terdaftar
- ✅ Foto profil dari Google akan otomatis tersimpan
- ✅ Tidak perlu password untuk user yang login via Google
- ✅ User bisa login dengan email/password atau Google (fleksibel)

## Troubleshooting

### Error: "GOOGLE_CLIENT_ID tidak ditemukan"
- Pastikan variabel `VITE_GOOGLE_CLIENT_ID` sudah ditambahkan di `.env` frontend
- Restart development server setelah menambahkan variabel

### Error: "Token Google tidak valid"
- Pastikan `GOOGLE_CLIENT_ID` di backend sama dengan frontend
- Pastikan domain/URL sudah ditambahkan di Authorized JavaScript origins di Google Cloud Console

### Google Sign-In tidak muncul
- Periksa console browser untuk error
- Pastikan script Google Identity Services berhasil dimuat
- Periksa apakah `VITE_GOOGLE_CLIENT_ID` sudah benar di `.env`

### User tidak bisa login setelah setup Google OAuth
- User yang sudah ada dengan email/password tetap bisa login normal
- User baru via Google akan otomatis dibuat tanpa password
- User bisa menggabungkan akun (jika email sama, akan otomatis terhubung)

## Catatan Keamanan

1. Jangan commit file `.env` ke repository
2. Pastikan `GOOGLE_CLIENT_ID` tidak disebarkan secara publik di production
3. Untuk production, gunakan HTTPS dan pastikan domain sudah terverifikasi di Google Cloud Console
4. Pastikan **Authorized JavaScript origins** hanya berisi domain yang valid

## Testing

1. Jalankan backend: `cd lkmo-be && npm run dev`
2. Jalankan frontend: `cd lkmo-fe && npm run dev`
3. Buka `http://localhost:5173/login`
4. Klik tombol "Masuk dengan Google"
5. Pilih akun Google
6. Verifikasi bahwa login berhasil

## Referensi

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

