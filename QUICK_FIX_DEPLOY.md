# 🚀 Quick Fix untuk Masalah Deployment

## ❌ Masalah: Network Error + Google OAuth Error

### Langkah 1: Fix Google OAuth (PENTING!)

**Ini adalah langkah yang paling penting untuk fix Google OAuth error:**

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project Anda
3. **APIs & Services** → **Credentials**
4. Klik **OAuth 2.0 Client ID** Anda
5. Scroll ke bagian **Authorized JavaScript origins**
6. **TAMBAHKAN:**
   ```
   https://ikmo-kuliner.vercel.app
   ```
7. Scroll ke bagian **Authorized redirect URIs**
8. **TAMBAHKAN:**
   ```
   https://ikmo-kuliner.vercel.app
   ```
9. **Klik SAVE** (penting!)
10. **Tunggu 5-10 menit** (Google perlu waktu untuk update)

### Langkah 2: Verifikasi Environment Variables

#### Di Render (Backend):
1. Buka Render Dashboard → Service → Environment
2. Pastikan:
   ```
   FRONTEND_URL=https://ikmo-kuliner.vercel.app
   ```
   (Tidak ada trailing slash `/`)

3. Pastikan `GOOGLE_CLIENT_ID` sudah di-set dengan nilai yang benar

#### Di Vercel (Frontend):
1. Buka Vercel Dashboard → Settings → Environment Variables
2. Pastikan:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```
   (Ganti `your-backend-name` dengan nama backend Render Anda)

3. Pastikan `VITE_GOOGLE_CLIENT_ID` sama dengan `GOOGLE_CLIENT_ID` di backend

### Langkah 3: Restart Services

#### Render (Backend):
1. Buka Render Dashboard → Service
2. Klik **"Manual Deploy"**
3. Pilih **"Clear build cache & deploy"**
4. Klik **"Deploy latest commit"**

#### Vercel (Frontend):
1. Buka Vercel Dashboard → Deployments
2. Klik **"..."** pada deployment terbaru
3. Pilih **"Redeploy"**

### Langkah 4: Test

1. Buka `https://ikmo-kuliner.vercel.app` di **Incognito/Private mode**
2. Coba register dengan email
3. Coba login dengan Google

---

## ✅ Checklist Cepat

Setelah melakukan semua langkah di atas, pastikan:

- [ ] Authorized Origins di Google Cloud Console sudah include `https://ikmo-kuliner.vercel.app`
- [ ] Authorized Redirect URIs di Google Cloud Console sudah include `https://ikmo-kuliner.vercel.app`
- [ ] Sudah save di Google Cloud Console
- [ ] Sudah tunggu 5-10 menit
- [ ] `FRONTEND_URL` di Render = `https://ikmo-kuliner.vercel.app` (tanpa trailing slash)
- [ ] `VITE_API_URL` di Vercel = URL backend Render + `/api`
- [ ] `GOOGLE_CLIENT_ID` di Render = `VITE_GOOGLE_CLIENT_ID` di Vercel (tanpa prefix `VITE_`)
- [ ] Backend sudah di-restart
- [ ] Frontend sudah di-redeploy
- [ ] Test di incognito mode

---

## 🔍 Cara Cek Backend URL

1. Buka Render Dashboard
2. Klik service backend Anda
3. Copy URL di bagian atas (contoh: `https://lkmo-backend.onrender.com`)
4. Tambahkan `/api` di akhir: `https://lkmo-backend.onrender.com/api`
5. Paste ke `VITE_API_URL` di Vercel

---

## 🆘 Masih Error?

Lihat panduan lengkap di `TROUBLESHOOTING_DEPLOY.md`

