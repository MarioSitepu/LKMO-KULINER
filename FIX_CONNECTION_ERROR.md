# 🔧 Fix: "Tidak dapat terhubung ke server"

## ❌ Masalah

Error: "Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti."

Ini terjadi saat login atau register tidak bisa terhubung ke backend.

## 🔍 Penyebab Utama

**Penyebab paling umum:** `VITE_API_URL` tidak di-set di Vercel, sehingga frontend masih menggunakan default `http://localhost:5000/api` yang tidak bisa diakses dari production.

## ✅ Solusi

### Langkah 1: Cek Environment Variables di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project **Ikmo-kuliner** (atau nama project Anda)
3. Klik **Settings** → **Environment Variables**
4. Cari `VITE_API_URL`

**Jika tidak ada atau salah:**

### Langkah 2: Set VITE_API_URL di Vercel

1. **Cari URL Backend Render Anda:**
   - Buka Render Dashboard
   - Klik service backend Anda
   - Copy URL yang muncul di bagian atas (contoh: `https://lkmo-backend.onrender.com`)

2. **Tambahkan Environment Variable:**
   - Di Vercel, klik **"Add New"**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-name.onrender.com/api`
     - **PENTING:** Ganti `your-backend-name` dengan nama backend Render Anda
     - **PENTING:** Tambahkan `/api` di akhir
     - **PENTING:** Gunakan `https://` (bukan `http://`)
   - Environment: Pilih **Production**, **Preview**, dan **Development**
   - Klik **Save**

### Langkah 3: Redeploy Frontend

Setelah menambah/update environment variable:

1. Buka Vercel Dashboard → **Deployments**
2. Klik **"..."** pada deployment terbaru
3. Pilih **"Redeploy"**
4. Tunggu hingga deploy selesai

**Atau** push perubahan baru ke GitHub (Vercel akan auto-redeploy)

### Langkah 4: Verifikasi

1. Buka `https://ikmo-kuliner.vercel.app` di browser
2. Buka **Developer Tools** (F12)
3. Buka tab **Console**
4. Cari log: `🔗 API URL: https://...`
5. Pastikan URL menunjukkan backend Render Anda (bukan `localhost:5000`)

## 🔍 Debugging

### Cara Cek API URL yang Digunakan

1. Buka browser console (F12)
2. Lihat log saat halaman load
3. Cari: `🔗 API URL: ...`

Jika masih muncul `http://localhost:5000/api`, berarti:
- `VITE_API_URL` belum di-set di Vercel
- Atau belum di-redeploy setelah set environment variable

### Cara Test Backend Langsung

Test apakah backend berjalan:

```bash
# Ganti dengan URL backend Render Anda
curl https://your-backend-name.onrender.com/api/health
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

### Cek Network Tab di Browser

1. Buka Developer Tools (F12)
2. Tab **Network**
3. Coba login/register
4. Lihat request ke `/api/auth/login` atau `/api/auth/register`
5. Cek:
   - **Status**: 200 (sukses), 4xx/5xx (error), atau failed (network error)
   - **Request URL**: Harus menunjukkan backend Render (bukan localhost)
   - **Response**: Lihat error detail jika ada

## 📋 Checklist

- [ ] `VITE_API_URL` sudah di-set di Vercel Dashboard
- [ ] Value `VITE_API_URL` = `https://your-backend.onrender.com/api` (dengan `/api`)
- [ ] Tidak ada typo di URL
- [ ] Menggunakan `https://` (bukan `http://`)
- [ ] Frontend sudah di-redeploy setelah set environment variable
- [ ] Backend health check berhasil (`/api/health`)
- [ ] Browser console menunjukkan API URL yang benar (bukan localhost)
- [ ] Network tab menunjukkan request ke URL backend yang benar

## 🚨 Masalah Lainnya

### Backend Sleep (Render Free Tier)

Jika backend di Render free tier, service akan sleep setelah 15 menit tidak aktif.

**Solusi:**
1. Tunggu 30 detik setelah request pertama (cold start)
2. Atau upgrade ke paid plan

### CORS Error

Jika muncul CORS error di console:
- Pastikan `FRONTEND_URL` di Render = `https://ikmo-kuliner.vercel.app`
- Restart backend setelah update environment variable

### Backend Error

Jika backend mengembalikan error:
- Cek logs di Render Dashboard → Logs
- Cek apakah MongoDB connection OK
- Cek apakah semua environment variables sudah benar

## 📞 Informasi yang Diperlukan

Jika masih error, siapkan:
1. Screenshot dari Vercel Environment Variables
2. Screenshot dari browser console (F12)
3. Screenshot dari Network tab (saat coba login/register)
4. URL backend Render Anda
5. Status backend health check

---

## ✅ Setelah Fix

Setelah semua langkah di atas:
1. Clear browser cache atau gunakan incognito mode
2. Test login/register
3. Pastikan tidak ada error di console
4. Pastikan request ke backend berhasil

