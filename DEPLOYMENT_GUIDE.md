# 🚀 Panduan Deployment LKMO

Panduan lengkap untuk deploy aplikasi LKMO ke **Vercel** (Frontend) dan **Render** (Backend).

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Deploy Backend ke Render](#deploy-backend-ke-render)
3. [Deploy Frontend ke Vercel](#deploy-frontend-ke-vercel)
4. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
5. [Setup MongoDB Atlas](#setup-mongodb-atlas)
6. [Setup Google OAuth](#setup-google-oauth)
7. [Testing Setelah Deploy](#testing-setelah-deploy)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Persiapan

### Checklist Sebelum Deploy

- [ ] Code sudah di-push ke GitHub
- [ ] MongoDB Atlas sudah setup
- [ ] Google OAuth Client ID sudah dibuat
- [ ] Semua environment variables sudah disiapkan

---

## 🔧 Deploy Backend ke Render

### Langkah 1: Buat Akun Render

1. Daftar di [Render.com](https://render.com)
2. Login dengan GitHub account (disarankan)

### Langkah 2: Buat Web Service

1. Klik **"New +"** → **"Web Service"**
2. Connect repository GitHub Anda
3. Pilih branch `main` (atau branch yang ingin di-deploy)

### Langkah 3: Konfigurasi Service

**Basic Settings:**
- **Name**: `lkmo-backend` (atau nama yang Anda inginkan)
- **Region**: Pilih region terdekat (contoh: Singapore)
- **Branch**: `main`
- **Root Directory**: `lkmo-be` (penting!)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Pilih **Free** (untuk mulai)

### Langkah 4: Set Environment Variables

Klik tab **"Environment"** dan tambahkan:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-app.vercel.app
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**⚠️ PENTING:**
- Ganti semua nilai placeholder dengan nilai yang sebenarnya
- `JWT_SECRET` harus random string yang kuat (minimal 32 karakter)
- `MONGODB_URI` adalah connection string dari MongoDB Atlas
- `FRONTEND_URL` akan di-set setelah frontend di-deploy
- `GOOGLE_CLIENT_ID` harus diganti dengan nilai yang sama dengan yang ada di file `.env` lokal Anda (atau dari Google Cloud Console)
  - Format: `xxxxx-xxxxx.apps.googleusercontent.com`
  - Harus sama dengan `GOOGLE_CLIENT_ID` di `.env` backend
  - Harus sama dengan `VITE_GOOGLE_CLIENT_ID` di frontend (tanpa prefix `VITE_`)

### Langkah 5: Deploy

1. Klik **"Create Web Service"**
2. Render akan otomatis build dan deploy aplikasi
3. Tunggu hingga status menjadi **"Live"**
4. Catat URL backend Anda: `https://lkmo-backend.onrender.com` (contoh)

**Catatan:**
- Free tier di Render akan sleep setelah 15 menit tidak aktif
- Request pertama setelah sleep mungkin lambat (cold start)
- Untuk production, pertimbangkan upgrade ke paid plan

---

## 🌐 Deploy Frontend ke Vercel

### Langkah 1: Buat Akun Vercel

1. Daftar di [Vercel.com](https://vercel.com)
2. Login dengan GitHub account

### Langkah 2: Import Project

1. Klik **"Add New..."** → **"Project"**
2. Import repository GitHub Anda
3. Pilih repository LKMO

### Langkah 3: Konfigurasi Project

**Framework Preset:**
- Vite akan terdeteksi otomatis

**Root Directory:**
- Set ke `lkmo-fe` (penting!)

**Build Settings:**
- Build Command: `npm run build` (otomatis)
- Output Directory: `dist` (otomatis)
- Install Command: `npm install` (otomatis)

### Langkah 4: Set Environment Variables

Klik **"Environment Variables"** dan tambahkan:

```env
VITE_API_URL=https://lkmo-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**⚠️ PENTING:**
- Ganti `https://lkmo-backend.onrender.com/api` dengan URL backend Render Anda
- `VITE_GOOGLE_CLIENT_ID` harus diganti dengan nilai yang sama dengan yang ada di file `.env` lokal frontend Anda
  - Format: `xxxxx-xxxxx.apps.googleusercontent.com`
  - Harus sama dengan `GOOGLE_CLIENT_ID` di backend (tanpa prefix `VITE_`)
  - Copy dari file `.env` lokal atau dari Google Cloud Console

### Langkah 5: Deploy

1. Klik **"Deploy"**
2. Vercel akan otomatis build dan deploy
3. Tunggu hingga selesai
4. Catat URL frontend Anda: `https://your-app.vercel.app`

### Langkah 6: Update Backend FRONTEND_URL

Setelah frontend di-deploy, kembali ke Render dan update:

```
FRONTEND_URL=https://your-app.vercel.app
```

Lalu restart service di Render (Settings → Manual Deploy → Clear build cache & deploy)

---

## 🔐 Konfigurasi Environment Variables

### Backend (Render)

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Port server | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret untuk JWT token | Random string (32+ chars) |
| `JWT_EXPIRE` | JWT expiry time | `7d` |
| `FRONTEND_URL` | URL frontend production | `https://your-app.vercel.app` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| `UPLOAD_PATH` | Upload folder | `uploads` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |

### Frontend (Vercel)

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `VITE_API_URL` | URL backend API | `https://lkmo-backend.onrender.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |

**Generate JWT_SECRET:**
```bash
# Di terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Setup MongoDB Atlas

### Langkah 1: Buat Cluster

1. Daftar di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (pilih **M0 Free** untuk development)
3. Pilih region: **Singapore** (atau terdekat)
4. Tunggu hingga cluster siap (5-10 menit)

### Langkah 2: Setup Database User

1. Klik **"Database Access"** → **"Add New Database User"**
2. Username: `lkmo-user` (atau sesuai keinginan)
3. Password: Generate password yang kuat (simpan!)
4. Database User Privileges: **Read and write to any database**

### Langkah 3: Whitelist IP Address

1. Klik **"Network Access"** → **"Add IP Address"**
2. Untuk Render: Klik **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - ⚠️ Untuk production, lebih baik whitelist IP Render saja
3. Klik **"Confirm"**

### Langkah 4: Get Connection String

1. Klik **"Database"** → **"Connect"**
2. Pilih **"Connect your application"**
3. Copy connection string, contoh:
   ```
   mongodb+srv://lkmo-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Ganti `<password>` dengan password user Anda
5. Tambahkan database name: `/lkmo-recipes` di akhir (sebelum `?`)
6. Hasil akhir:
   ```
   mongodb+srv://lkmo-user:YourPassword@cluster0.xxxxx.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
   ```

---

## 🔑 Setup Google OAuth

### Langkah 1: Buat OAuth Client

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih atau buat project
3. Pergi ke **APIs & Services** → **Credentials**
4. Klik **"Create Credentials"** → **"OAuth client ID"**
5. Pilih **"Web application"**

### Langkah 2: Configure OAuth Consent Screen

Jika belum setup:
1. Klik **"Configure Consent Screen"**
2. Pilih **External** (untuk testing)
3. Isi form yang diperlukan
4. Save

### Langkah 3: Set Authorized Origins

Tambahkan **Authorized JavaScript origins**:
- `http://localhost:5173` (development)
- `https://your-app.vercel.app` (production - frontend)

Tambahkan **Authorized redirect URIs**:
- `http://localhost:5173` (development)
- `https://your-app.vercel.app` (production - frontend)

### Langkah 4: Copy Client ID

1. Salin **Client ID** yang dihasilkan (format: `xxxxx-xxxxx.apps.googleusercontent.com`)
2. Gunakan di environment variables dengan **nilai yang sama**:
   - **Backend (Render)**: `GOOGLE_CLIENT_ID=xxxxx-xxxxx.apps.googleusercontent.com`
   - **Frontend (Vercel)**: `VITE_GOOGLE_CLIENT_ID=xxxxx-xxxxx.apps.googleusercontent.com`
   - **Backend .env lokal**: `GOOGLE_CLIENT_ID=xxxxx-xxxxx.apps.googleusercontent.com`
   - **Frontend .env lokal**: `VITE_GOOGLE_CLIENT_ID=xxxxx-xxxxx.apps.googleusercontent.com`

**⚠️ PENTING:**
- Nilai `GOOGLE_CLIENT_ID` harus **sama persis** di semua tempat (backend, frontend, development, production)
- Jika sudah ada di file `.env` lokal, copy nilai tersebut ke Render dan Vercel
- Jangan gunakan placeholder `your-google-client-id.apps.googleusercontent.com`, ganti dengan nilai yang sebenarnya

---

## ✅ Testing Setelah Deploy

### 1. Test Backend Health

```bash
curl https://lkmo-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

### 2. Test Frontend

1. Buka URL frontend Vercel
2. Cek apakah halaman load dengan benar
3. Test register/login
4. Test upload recipe
5. Test semua fitur utama

### 3. Test API dari Frontend

1. Buka browser console (F12)
2. Cek Network tab
3. Pastikan tidak ada CORS error
4. Pastikan API calls berhasil

---

## 🐛 Troubleshooting

### Error: Cannot connect to MongoDB

**Solusi:**
- Pastikan connection string benar (termasuk password)
- Pastikan IP sudah di-whitelist di MongoDB Atlas
- Pastikan database user sudah dibuat
- Cek logs di Render dashboard

### Error: CORS Error

**Solusi:**
- Pastikan `FRONTEND_URL` di backend sesuai dengan URL frontend
- Restart service di Render setelah update env vars
- Pastikan URL menggunakan `https://` (bukan `http://`)

### Error: 401 Unauthorized

**Solusi:**
- Pastikan `JWT_SECRET` sudah di-set
- Pastikan token dikirim di header Authorization
- Cek apakah token expired

### Frontend tidak bisa connect ke backend

**Solusi:**
- Pastikan `VITE_API_URL` di Vercel sudah benar
- Pastikan backend sudah live di Render
- Cek browser console untuk error detail
- Pastikan tidak ada typo di URL

### Upload gambar tidak berfungsi

**Catatan:**
- Render free tier menggunakan ephemeral storage
- File upload akan hilang setelah restart
- Untuk production, gunakan cloud storage (S3, Cloudinary, dll)

**Solusi temporary:**
- File akan tersimpan selama service tidak restart
- Untuk production, pertimbangkan integrasi cloud storage

### Render service sleep

**Masalah:**
- Free tier Render sleep setelah 15 menit tidak aktif
- Request pertama setelah sleep mungkin lambat

**Solusi:**
- Upgrade ke paid plan (tidak akan sleep)
- Atau gunakan service seperti [UptimeRobot](https://uptimerobot.com) untuk ping service setiap 5 menit

---

## 📝 Checklist Post-Deployment

- [ ] Backend health check berhasil
- [ ] Frontend dapat diakses
- [ ] Register user berhasil
- [ ] Login berhasil
- [ ] Upload recipe berhasil
- [ ] Google OAuth login berhasil
- [ ] CORS tidak ada error
- [ ] Semua fitur utama berfungsi
- [ ] Environment variables sudah benar
- [ ] MongoDB connection stable

---

## 🎉 Selesai!

Aplikasi Anda sekarang sudah live! 

**URL Frontend:** `https://your-app.vercel.app`  
**URL Backend:** `https://lkmo-backend.onrender.com`

---

## 📚 Referensi

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Google OAuth Setup](https://developers.google.com/identity/gsi/web)

---

**Pertanyaan atau masalah?** Cek logs di dashboard Render dan Vercel untuk detail error.


