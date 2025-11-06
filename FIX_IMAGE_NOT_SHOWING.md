# 🔧 Fix: Gambar Tidak Muncul di Production (Deploy)

## ❌ Masalah

Gambar muncul di localhost tapi **tidak muncul** saat di-deploy ke production (Vercel).

## 🔍 Penyebab Utama

**Penyebab paling umum:** `VITE_API_URL` tidak di-set dengan benar di Vercel, sehingga frontend masih menggunakan default `http://localhost:5000` yang tidak bisa diakses dari production.

## ✅ Solusi

### Langkah 1: Cek Environment Variables di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project frontend Anda
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
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com/api`
     - **PENTING**: Ganti `your-backend-name` dengan nama backend Render Anda
     - **PENTING**: Tambahkan `/api` di akhir
     - **PENTING**: Gunakan `https://` (bukan `http://`)
   - **Environment**: Pilih **Production**, **Preview**, dan **Development**
   - Klik **Save**

### Langkah 3: Redeploy Frontend

Setelah menambah/update environment variable:

1. Buka Vercel Dashboard → **Deployments**
2. Klik **"..."** pada deployment terbaru
3. Pilih **"Redeploy"**
4. Tunggu hingga deploy selesai

**Atau** push perubahan baru ke GitHub (Vercel akan auto-redeploy)

### Langkah 4: Verifikasi

1. Buka website production Anda di browser
2. Buka **Developer Tools** (F12)
3. Buka tab **Console**
4. Cari log: `🖼️ Image URL Debug:` atau `🖼️ Final Image URL:`
5. Pastikan URL menunjukkan backend Render Anda (bukan `localhost:5000`)

## 🔍 Debugging

### Cara Cek URL Gambar yang Digunakan

1. Buka website production
2. Buka **Developer Tools** (F12)
3. Buka tab **Console**
4. Scroll ke atas dan cari log yang dimulai dengan `🖼️`
5. Periksa apakah `viteApiUrl` menunjukkan URL backend Render Anda

### Cara Test URL Gambar Langsung

1. Buka website production
2. Klik kanan pada gambar yang tidak muncul → **Inspect**
3. Lihat atribut `src` pada tag `<img>`
4. Copy URL tersebut
5. Buka URL tersebut di tab baru browser
6. Jika muncul error 404 atau tidak bisa diakses, berarti URL salah

### Contoh URL yang Benar

✅ **Benar:**
```
https://lkmo-backend.onrender.com/uploads/image-1234567890-123456789.png
```

❌ **Salah:**
```
http://localhost:5000/uploads/image-1234567890-123456789.png
```

## 🐛 Troubleshooting

### Masalah 1: VITE_API_URL sudah di-set tapi gambar masih tidak muncul

**Solusi:**
1. Pastikan sudah **redeploy** setelah set environment variable
2. Cek di Console apakah ada error CORS
3. Pastikan backend sudah running dan tidak sleep (untuk Render free tier)
4. Cek apakah path gambar di database sudah benar (harus dimulai dengan `/uploads/`)

### Masalah 2: Gambar muncul di localhost tapi tidak di production

**Penyebab:**
- `VITE_API_URL` tidak di-set di Vercel
- Environment variable hanya di-set untuk Development, tidak untuk Production

**Solusi:**
1. Pastikan `VITE_API_URL` di-set untuk **Production** environment di Vercel
2. Redeploy frontend

### Masalah 3: Error 404 saat mengakses gambar

**Penyebab:**
- Backend tidak menyajikan file statis dengan benar
- File tidak ada di server backend

**Solusi:**
1. Cek apakah backend menyajikan file statis di route `/uploads`
2. Pastikan file gambar ada di folder `uploads` di backend
3. Cek log backend untuk error saat mengakses file

### Masalah 4: CORS Error

**Penyebab:**
- Backend tidak mengizinkan request dari domain frontend

**Solusi:**
1. Pastikan `FRONTEND_URL` di-set di Render dengan URL Vercel Anda
2. Restart backend service di Render

## 📋 Checklist

- [ ] `VITE_API_URL` sudah di-set di Vercel
- [ ] `VITE_API_URL` menggunakan format: `https://your-backend.onrender.com/api`
- [ ] Environment variable di-set untuk **Production** (bukan hanya Development)
- [ ] Sudah redeploy frontend setelah set environment variable
- [ ] Backend sudah running dan tidak sleep
- [ ] `FRONTEND_URL` sudah di-set di Render dengan URL Vercel
- [ ] Tidak ada error di Console browser
- [ ] URL gambar di Console menunjukkan backend Render (bukan localhost)

## 💡 Tips

1. **Selalu test di production** setelah set environment variable
2. **Gunakan Console browser** untuk debugging URL gambar
3. **Pastikan backend tidak sleep** (untuk Render free tier, bisa sleep setelah 15 menit tidak aktif)
4. **Cek Network tab** di Developer Tools untuk melihat request gambar yang gagal

## 📞 Masih Bermasalah?

Jika masih bermasalah setelah mengikuti langkah-langkah di atas:

1. Screenshot error di Console browser
2. Screenshot environment variables di Vercel
3. Cek log backend di Render untuk error saat mengakses file statis
4. Pastikan backend service sudah running dan tidak error

