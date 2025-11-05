# 🔧 Fix: Register Timeout & 404 Error di Production

## ❌ Masalah

Saat daftar di web yang sudah di-deploy, muncul error:
- **Timeout**: Request timeout setelah 30 detik
- **404 Error**: Request failed with status code 404

## 🔍 Penyebab

### 1. Timeout Error
- Backend server di Render/Railway **sedang sleep** (free tier)
- Backend server tidak berjalan
- MongoDB connection timeout
- Network issues

### 2. 404 Error
- `VITE_API_URL` **tidak di-set** di Vercel environment variables
- URL backend **salah** atau tidak lengkap
- Backend route tidak ditemukan

## ✅ Solusi

### Langkah 1: Cek Environment Variables di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project frontend Anda
3. Klik **Settings** → **Environment Variables**
4. Cari `VITE_API_URL`

**Jika tidak ada atau salah:**

### Langkah 2: Set VITE_API_URL di Vercel

1. **Cari URL Backend Anda:**
   - Jika menggunakan **Render**: Buka Render Dashboard → Service backend → Copy URL (contoh: `https://lkmo-backend.onrender.com`)
   - Jika menggunakan **Railway**: Buka Railway Dashboard → Service → Copy URL
   - Jika menggunakan **Heroku**: Buka Heroku Dashboard → App → Settings → Copy URL

2. **Tambahkan Environment Variable:**
   - Di Vercel, klik **"Add New"**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com`
     - **PENTING**: Ganti `your-backend-name` dengan nama backend Anda
     - **PENTING**: Gunakan `https://` (bukan `http://`)
     - **CATATAN**: Kode akan otomatis menambahkan `/api` jika belum ada, jadi tidak perlu tambahkan `/api` di akhir
     - **OPSIONAL**: Bisa juga langsung set `https://your-backend-name.onrender.com/api` (keduanya akan bekerja)
   - **Environment**: Pilih **Production**, **Preview**, dan **Development**
   - Klik **Save**

### Langkah 3: Cek Backend Server

#### Jika menggunakan Render (Free Tier):

1. **Backend mungkin sedang sleep:**
   - Free tier Render akan sleep setelah 15 menit tidak ada traffic
   - Request pertama setelah sleep akan **lambat** (cold start)
   - Tunggu beberapa detik dan coba lagi

2. **Cek apakah backend running:**
   - Buka Render Dashboard
   - Klik service backend Anda
   - Cek status: Harus **Live** (bukan **Sleeping**)
   - Jika Sleeping, klik **Manual Deploy** atau tunggu request pertama

3. **Test backend endpoint:**
   - Buka browser
   - Kunjungi: `https://your-backend-name.onrender.com/api/health`
   - Harus muncul: `{"status":"OK","message":"Server is running"}`
   - Jika error, backend tidak running

#### Jika menggunakan Railway/Heroku:

1. Cek status di dashboard
2. Pastikan service **Active** dan **Running**
3. Test endpoint `/api/health`

### Langkah 4: Redeploy Frontend

Setelah menambah/update `VITE_API_URL`:

1. Buka Vercel Dashboard → **Deployments**
2. Klik **"..."** pada deployment terbaru
3. Pilih **"Redeploy"**
4. Tunggu hingga deploy selesai

**Atau** push perubahan baru ke GitHub (Vercel akan auto-redeploy)

### Langkah 5: Verifikasi

1. Buka website yang sudah di-deploy di browser
2. Buka **Developer Tools** (F12)
3. Buka tab **Console**
4. Cari log: `🔗 API URL: https://...`
5. **Pastikan URL menunjukkan backend Anda** (bukan `localhost:5000`)

6. Coba daftar lagi:
   - Jika masih timeout: Backend mungkin sedang sleep, tunggu 10-15 detik
   - Jika 404: Pastikan `VITE_API_URL` sudah benar dan sudah redeploy

## 🔍 Debugging

### Cara Cek API URL yang Digunakan

1. Buka website di browser
2. Tekan **F12** (Developer Tools)
3. Buka tab **Console**
4. Cari log: `🔗 API URL: ...`

**Jika masih menunjukkan `http://localhost:5000/api`:**
- `VITE_API_URL` tidak di-set di Vercel
- Atau belum redeploy setelah set environment variable

### Cara Test Backend Manual

1. Buka browser atau Postman
2. Test endpoint health:
   ```
   GET https://your-backend-name.onrender.com/api/health
   ```
3. Test endpoint register:
   ```
   POST https://your-backend-name.onrender.com/api/auth/register
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

### Error Messages yang Ditingkatkan

Sekarang error messages lebih informatif:
- **Timeout**: "Request timeout. Server mungkin sedang sleep (free tier). Silakan tunggu beberapa detik dan coba lagi..."
- **Network Error**: "Tidak dapat terhubung ke server. Pastikan backend sudah running..."
- **404 Error**: "Endpoint tidak ditemukan (404). Pastikan VITE_API_URL sudah benar..."

## 📋 Checklist

- [ ] `VITE_API_URL` sudah di-set di Vercel
- [ ] Value `VITE_API_URL` menggunakan `https://` (bukan `http://`)
- [ ] Value `VITE_API_URL` diakhiri dengan `/api`
- [ ] Frontend sudah diredeploy setelah set environment variable
- [ ] Backend server status **Live** (bukan Sleeping)
- [ ] Endpoint `/api/health` bisa diakses
- [ ] Console browser menunjukkan URL backend yang benar

## 🚨 Masih Error?

### Jika masih timeout:
1. Cek apakah backend menggunakan free tier (mungkin sedang sleep)
2. Tunggu 15-30 detik dan coba lagi
3. Pertimbangkan upgrade ke paid tier untuk menghindari sleep

### Jika masih 404:
1. Double-check `VITE_API_URL` di Vercel
2. Pastikan URL benar: `https://your-backend.onrender.com/api`
3. Test endpoint di browser: `https://your-backend.onrender.com/api/health`
4. Cek backend logs untuk melihat request yang masuk

### Cek Console Browser untuk Detail Error:
- Buka Developer Tools (F12)
- Tab **Console**: Lihat error messages
- Tab **Network**: Lihat request/response detail

## 📞 Support

Jika masih bermasalah setelah mengikuti langkah-langkah di atas:
1. Screenshot error message
2. Screenshot Console browser (F12)
3. Screenshot Network tab (request yang gagal)
4. Cek backend logs di Render/Railway dashboard

