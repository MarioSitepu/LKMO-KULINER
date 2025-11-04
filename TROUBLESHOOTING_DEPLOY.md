# 🐛 Troubleshooting Deployment Issues

Panduan untuk mengatasi masalah umum setelah deployment.

## 🔴 Masalah 1: Network Error saat Daftar/Login dengan Email

### Gejala:
- Error "Network Error" saat mencoba register atau login
- Request gagal dengan status error

### Penyebab:
1. **CORS Error** - Backend tidak mengizinkan origin frontend
2. **Backend URL salah** - `VITE_API_URL` tidak benar
3. **Backend tidak running** - Service di Render sleep atau error

### Solusi:

#### 1. Cek Backend URL di Vercel

Pastikan `VITE_API_URL` di Vercel sudah benar:

1. Buka **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**
2. Cek nilai `VITE_API_URL`
3. Format harus: `https://your-backend-name.onrender.com/api`
4. Pastikan:
   - Menggunakan `https://` (bukan `http://`)
   - Ada `/api` di akhir
   - Tidak ada trailing slash setelah `/api`

#### 2. Cek Backend Health

Test apakah backend sudah running:

```bash
curl https://your-backend-name.onrender.com/api/health
```

Atau buka di browser:
```
https://your-backend-name.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

Jika error atau tidak bisa diakses:
- Backend mungkin sleep (Render free tier)
- Tunggu 30 detik dan coba lagi
- Atau cek logs di Render dashboard

#### 3. Cek CORS Configuration

Pastikan `FRONTEND_URL` di Render sudah benar:

1. Buka **Render Dashboard** → **Service** → **Environment**
2. Cek nilai `FRONTEND_URL`
3. Harus sama dengan URL frontend Vercel: `https://ikmo-kuliner.vercel.app`
4. Pastikan tidak ada trailing slash

Setelah update, **restart service** di Render:
- Settings → Manual Deploy → Clear build cache & deploy

#### 4. Cek Browser Console

Buka browser console (F12) dan cek:
- Tab **Console** - ada error CORS?
- Tab **Network** - request ke backend berhasil atau gagal?
- Lihat detail error di Network tab

Error yang mungkin muncul:
- `CORS policy: No 'Access-Control-Allow-Origin' header`
- `Failed to fetch`
- `Network Error`

---

## 🔴 Masalah 2: Google OAuth Error "Can't continue with google.com"

### Gejala:
- Error: "Can't continue with google.com"
- "Something went wrong" saat klik Google Sign-In

### Penyebab:
1. **Authorized Origins belum di-set** di Google Cloud Console
2. **GOOGLE_CLIENT_ID tidak sesuai** antara backend dan frontend
3. **Domain production belum ditambahkan** di Google Cloud Console

### Solusi:

#### 1. Update Authorized Origins di Google Cloud Console

**PENTING:** Ini adalah langkah yang paling penting!

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project Anda
3. Pergi ke **APIs & Services** → **Credentials**
4. Klik pada **OAuth 2.0 Client ID** Anda
5. Di bagian **Authorized JavaScript origins**, tambahkan:
   ```
   https://ikmo-kuliner.vercel.app
   ```
   Juga pastikan ada:
   ```
   http://localhost:5173
   ```

6. Di bagian **Authorized redirect URIs**, tambahkan:
   ```
   https://ikmo-kuliner.vercel.app
   ```
   Juga pastikan ada:
   ```
   http://localhost:5173
   ```

7. **Klik Save**

8. **Tunggu 5-10 menit** untuk perubahan diterapkan (Google cache)

#### 2. Verifikasi GOOGLE_CLIENT_ID

Pastikan `GOOGLE_CLIENT_ID` sama di semua tempat:

**Backend (Render):**
```
GOOGLE_CLIENT_ID=xxxxx-xxxxx.apps.googleusercontent.com
```

**Frontend (Vercel):**
```
VITE_GOOGLE_CLIENT_ID=xxxxx-xxxxx.apps.googleusercontent.com
```

**Cara cek:**
1. Buka Render Dashboard → Environment → cek `GOOGLE_CLIENT_ID`
2. Buka Vercel Dashboard → Settings → Environment Variables → cek `VITE_GOOGLE_CLIENT_ID`
3. Pastikan nilainya **sama persis** (tanpa prefix `VITE_` di backend)

#### 3. Rebuild Frontend di Vercel

Setelah update environment variables:

1. Buka **Vercel Dashboard** → **Deployments**
2. Klik **"..."** pada deployment terbaru
3. Pilih **"Redeploy"**
4. Atau push perubahan baru ke GitHub (Vercel akan auto-rebuild)

#### 4. Clear Browser Cache

1. Buka browser di **Incognito/Private mode**
2. Atau clear cache browser:
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Atau hard refresh: Ctrl+Shift+R

#### 5. Test Google OAuth

1. Buka `https://ikmo-kuliner.vercel.app/login`
2. Klik tombol "Masuk dengan Google"
3. Cek browser console untuk error detail

---

## 🔍 Checklist Debugging

### Network Error Checklist:
- [ ] Backend health check berhasil (`/api/health`)
- [ ] `VITE_API_URL` di Vercel sudah benar
- [ ] `FRONTEND_URL` di Render sudah benar (sama dengan URL Vercel)
- [ ] Backend service sudah restart setelah update env vars
- [ ] Tidak ada CORS error di browser console
- [ ] Backend tidak sleep (coba akses dulu, tunggu 30 detik, coba lagi)

### Google OAuth Checklist:
- [ ] `https://ikmo-kuliner.vercel.app` sudah ditambahkan di **Authorized JavaScript origins**
- [ ] `https://ikmo-kuliner.vercel.app` sudah ditambahkan di **Authorized redirect URIs**
- [ ] Sudah save di Google Cloud Console
- [ ] Sudah tunggu 5-10 menit setelah save
- [ ] `GOOGLE_CLIENT_ID` di Render sama dengan `VITE_GOOGLE_CLIENT_ID` di Vercel
- [ ] Frontend sudah di-redeploy setelah update env vars
- [ ] Browser cache sudah di-clear atau menggunakan incognito mode

---

## 🚨 Quick Fix untuk Network Error

Jika masih error setelah semua langkah di atas:

### 1. Update CORS di Backend (Temporary)

Jika perlu, update `FRONTEND_URL` di Render dengan format yang lebih spesifik:

```
FRONTEND_URL=https://ikmo-kuliner.vercel.app
```

**Tidak ada:**
- Trailing slash (`/`)
- Path tambahan
- `http://` (harus `https://`)

### 2. Test Backend Langsung

Test register endpoint langsung:

```bash
curl -X POST https://your-backend-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://ikmo-kuliner.vercel.app" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Jika berhasil, berarti backend OK, masalahnya di frontend atau CORS.

---

## 📝 Logs yang Perlu Dicek

### Render Logs:
1. Buka **Render Dashboard** → **Service** → **Logs**
2. Cari error terkait:
   - MongoDB connection
   - CORS errors
   - JWT errors
   - Route not found

### Vercel Logs:
1. Buka **Vercel Dashboard** → **Deployments** → **Functions**
2. Cek build logs untuk error

### Browser Console:
1. Buka browser console (F12)
2. Cek tab **Console** dan **Network**
3. Screenshot error untuk debugging

---

## 🆘 Masih Error?

Jika masih error setelah semua langkah:

1. **Cek Render Dashboard** → Logs untuk detail error backend
2. **Cek Browser Console** → Screenshot error
3. **Test Backend Health** → Pastikan backend running
4. **Cek Environment Variables** → Pastikan semua sudah benar
5. **Cek Google Cloud Console** → Pastikan Authorized Origins sudah benar

---

## 📞 Informasi yang Diperlukan untuk Debugging

Jika masih error, siapkan informasi berikut:

1. **URL Backend Render:** `https://...`
2. **URL Frontend Vercel:** `https://ikmo-kuliner.vercel.app`
3. **Screenshot error di browser console**
4. **Screenshot Render logs**
5. **Status backend health check** (`/api/health`)
6. **Daftar Authorized Origins di Google Cloud Console**

---

## ✅ Setelah Fix Berhasil

Setelah semua berfungsi, pastikan:

- [ ] Register dengan email berhasil
- [ ] Login dengan email berhasil
- [ ] Google OAuth login berhasil
- [ ] Tidak ada error di console
- [ ] Semua fitur utama berfungsi

