# 📝 Template Environment Variables untuk Backend

File ini berisi template environment variables yang diperlukan untuk backend.  
**Copy dan paste ke Render Dashboard → Environment Variables**

## 🔧 Environment Variables untuk Render

Set semua variable berikut di **Render Dashboard** → **Environment** tab:

```env
# Environment Mode
NODE_ENV=production

# Server Configuration
PORT=5000

# Database - MongoDB Atlas Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
# Ganti dengan connection string MongoDB Atlas Anda
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority

# JWT Configuration
# Generate secret dengan: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d

# Frontend URL - Set setelah frontend di-deploy ke Vercel
# Format: https://your-app-name.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Google OAuth (Optional - jika menggunakan Google Login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 📋 Penjelasan Variable (Baris 5-20)

| Baris | Variable | Deskripsi | Contoh/Format |
|-------|----------|-----------|---------------|
| 5 | `NODE_ENV` | Mode environment | `production` |
| 8 | `PORT` | Port server | `5000` |
| 11 | `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| 14 | `JWT_SECRET` | Secret untuk JWT token | Random 32+ chars |
| 15 | `JWT_EXPIRE` | JWT expiry time | `7d` |
| 18 | `FRONTEND_URL` | URL frontend untuk CORS | `https://...` |
| 21 | `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| 22 | `UPLOAD_PATH` | Folder uploads | `uploads` |
| 25 | `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |

## ⚠️ Catatan Penting

1. **MONGODB_URI**: 
   - Dapatkan dari MongoDB Atlas
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority`
   - Ganti `<username>`, `<password>`, dan `<cluster>` dengan nilai yang sebenarnya

2. **JWT_SECRET**:
   - **PENTING**: Generate secret yang kuat
   - Minimal 32 karakter
   - Jangan gunakan secret yang sama untuk development dan production
   - Generate dengan command:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

3. **FRONTEND_URL**:
   - Set **SETELAH** frontend di-deploy ke Vercel
   - Format: `https://your-app-name.vercel.app`
   - Tanpa trailing slash di akhir
   - Menggunakan `https://` (bukan `http://`)

4. **GOOGLE_CLIENT_ID**:
   - Hanya diperlukan jika menggunakan Google OAuth login
   - Dapatkan dari Google Cloud Console atau copy dari file `.env` lokal Anda
   - Format: `xxxxx-xxxxx.apps.googleusercontent.com`
   - **PENTING**: Harus sama persis dengan nilai yang ada di:
     - File `.env` backend lokal (jika sudah ada)
     - `VITE_GOOGLE_CLIENT_ID` di frontend (tanpa prefix `VITE_`)
   - Jangan gunakan placeholder, ganti dengan nilai yang sebenarnya

## 🔄 Urutan Setup

1. **Setup MongoDB Atlas** → Dapatkan `MONGODB_URI`
2. **Generate JWT_SECRET** → Copy secret yang dihasilkan
3. **Deploy Backend ke Render** → Set semua variable **kecuali** `FRONTEND_URL`
4. **Deploy Frontend ke Vercel** → Dapatkan URL frontend
5. **Update FRONTEND_URL** → Set di Render dengan URL frontend Vercel
6. **Restart Service** → Di Render dashboard

## ✅ Checklist

Saat setup di Render, pastikan semua variable berikut sudah di-set:

- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI` (dari MongoDB Atlas)
- [ ] `JWT_SECRET` (generated, minimal 32 karakter)
- [ ] `JWT_EXPIRE=7d`
- [ ] `FRONTEND_URL` (set setelah frontend deploy)
- [ ] `MAX_FILE_SIZE=5242880`
- [ ] `UPLOAD_PATH=uploads`
- [ ] `GOOGLE_CLIENT_ID` (jika menggunakan Google login)

## 🐛 Troubleshooting

Jika ada error setelah deploy:

1. **Cek semua variable sudah di-set** di Render dashboard
2. **Pastikan tidak ada typo** di nama variable
3. **Pastikan nilai variable benar** (terutama MONGODB_URI dan JWT_SECRET)
4. **Restart service** setelah menambah/ubah variable
5. **Cek logs** di Render dashboard untuk detail error

