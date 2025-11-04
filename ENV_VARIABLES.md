# 📝 Environment Variables Configuration

Dokumentasi lengkap untuk environment variables yang diperlukan untuk aplikasi LKMO.

## 🎯 Backend Environment Variables (Render)

Tambahkan di **Render Dashboard** → **Environment** tab:

```env
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database - MongoDB Atlas Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority

# JWT Configuration
# Generate secret yang kuat: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d

# Frontend URL - Set setelah frontend di-deploy
# Contoh: https://your-app.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app

# File Upload Settings
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### 🔑 Cara Generate JWT_SECRET

Di terminal/command prompt:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Atau menggunakan PowerShell (Windows):

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌐 Frontend Environment Variables (Vercel)

Tambahkan di **Vercel Dashboard** → **Settings** → **Environment Variables**:

```env
# API URL - URL backend Render Anda
# Format: https://your-backend-name.onrender.com/api
VITE_API_URL=https://lkmo-backend.onrender.com/api

# Google OAuth Client ID
# Harus sama dengan GOOGLE_CLIENT_ID di backend
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**⚠️ PENTING:**
- Semua variable di Vercel untuk frontend harus diawali dengan `VITE_`
- URL harus menggunakan `https://` (bukan `http://`)
- Pastikan tidak ada trailing slash di akhir URL (kecuali memang diperlukan)

---

## 📋 Deskripsi Variable

### Backend Variables

| Variable | Required | Deskripsi | Default |
|----------|----------|-----------|---------|
| `NODE_ENV` | ✅ | Environment mode (`production` atau `development`) | - |
| `PORT` | ✅ | Port untuk server | `5000` |
| `MONGODB_URI` | ✅ | MongoDB connection string | - |
| `JWT_SECRET` | ✅ | Secret key untuk JWT token encryption | - |
| `JWT_EXPIRE` | ❌ | JWT token expiry time | `7d` |
| `FRONTEND_URL` | ✅ | URL frontend untuk CORS | - |
| `MAX_FILE_SIZE` | ❌ | Maximum file upload size (bytes) | `5242880` (5MB) |
| `UPLOAD_PATH` | ❌ | Folder untuk menyimpan uploads | `uploads` |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth Client ID (jika menggunakan Google login) | - |

### Frontend Variables

| Variable | Required | Deskripsi | Default |
|----------|----------|-----------|---------|
| `VITE_API_URL` | ✅ | Base URL untuk API backend | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | ❌ | Google OAuth Client ID | - |

---

## 🔄 Urutan Setup Environment Variables

### 1. Setup Backend (Render)

1. Deploy backend ke Render terlebih dahulu
2. Set semua backend variables **kecuali** `FRONTEND_URL`
3. Catat URL backend: `https://lkmo-backend.onrender.com`

### 2. Setup Frontend (Vercel)

1. Deploy frontend ke Vercel
2. Set `VITE_API_URL` dengan URL backend Render: `https://lkmo-backend.onrender.com/api`
3. Set `VITE_GOOGLE_CLIENT_ID` (jika menggunakan Google login)
4. Catat URL frontend: `https://your-app.vercel.app`

### 3. Update Backend FRONTEND_URL

1. Kembali ke Render dashboard
2. Update `FRONTEND_URL` dengan URL frontend Vercel
3. Restart service (Settings → Manual Deploy)

---

## ✅ Checklist Environment Variables

### Backend (Render)
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI` (dari MongoDB Atlas)
- [ ] `JWT_SECRET` (generated, minimal 32 karakter)
- [ ] `JWT_EXPIRE=7d`
- [ ] `FRONTEND_URL` (set setelah frontend deploy)
- [ ] `MAX_FILE_SIZE=5242880`
- [ ] `UPLOAD_PATH=uploads`
- [ ] `GOOGLE_CLIENT_ID` (jika menggunakan Google login)

### Frontend (Vercel)
- [ ] `VITE_API_URL` (URL backend Render)
- [ ] `VITE_GOOGLE_CLIENT_ID` (jika menggunakan Google login)

---

## 🐛 Troubleshooting

### Variable tidak terbaca

**Backend:**
- Pastikan variable sudah di-set di Render dashboard
- Restart service setelah menambah/ubah variable
- Pastikan tidak ada typo di nama variable

**Frontend:**
- Pastikan variable diawali dengan `VITE_`
- Build ulang setelah menambah/ubah variable (Vercel auto-rebuild)
- Pastikan tidak ada typo di nama variable

### CORS Error

- Pastikan `FRONTEND_URL` di backend sesuai dengan URL frontend
- Pastikan menggunakan `https://` (bukan `http://`)
- Restart backend setelah update `FRONTEND_URL`

### API tidak bisa diakses

- Pastikan `VITE_API_URL` sudah benar
- Pastikan backend sudah live
- Pastikan URL menggunakan `https://`
- Pastikan tidak ada trailing slash di `VITE_API_URL` (kecuali memang diperlukan)

---

## 📚 Referensi

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Connection String](https://docs.atlas.mongodb.com/connect-to-cluster/)
- [Google OAuth Setup](GOOGLE_OAUTH_SETUP.md)


