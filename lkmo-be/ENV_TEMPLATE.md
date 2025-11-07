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
# (Opsional legacy) UPLOAD_PATH masih digunakan untuk development lokal
UPLOAD_PATH=uploads

# Supabase Storage (Wajib untuk penyimpanan gambar)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=lkmo-images

# Google OAuth (Optional - jika menggunakan Google Login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email Configuration (Required untuk Reset Password)
# Opsi 1: Gmail dengan App Password (Recommended untuk Development)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# Opsi 2: SMTP Server (untuk Production - SendGrid, Mailgun, dll)
# Uncomment dan gunakan jika menggunakan SMTP server lain
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key
# EMAIL_FROM=noreply@yourdomain.com

# Opsi 3: Resend (Recommended untuk Production Cepat)
# RESEND_API_KEY=re_your_api_key
# RESEND_FROM_EMAIL=YangPentingMakan <noreply@yourdomain.com>
# RESEND_REPLY_TO=support@yourdomain.com
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
| 22 | `UPLOAD_PATH` | Folder uploads legacy (opsional) | `uploads` |
| 23 | `SUPABASE_URL` | URL project Supabase | `https://xxx.supabase.co` |
| 24 | `SUPABASE_SERVICE_ROLE_KEY` | Service role key Supabase (server-side only) | `eyJhbGciOiJIUzI1NiIs...` |
| 25 | `SUPABASE_BUCKET` | Nama bucket untuk gambar | `lkmo-images` |
| 28 | `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| 31 | `EMAIL_USER` | Email untuk mengirim OTP (Gmail) | `your-email@gmail.com` |
| 32 | `EMAIL_PASS` | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| 33 | `EMAIL_FROM` | Email pengirim | `your-email@gmail.com` |
| 34 | `RESEND_API_KEY` | API key Resend (jika pakai Resend) | `re_xxx` |
| 35 | `RESEND_FROM_EMAIL` | Alamat pengirim domain terverifikasi di Resend | `Nama <noreply@domain.com>` |

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
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_BUCKET`
- [ ] `UPLOAD_PATH=uploads` (opsional, legacy)
- [ ] `GOOGLE_CLIENT_ID` (jika menggunakan Google login)
- [ ] `EMAIL_USER` (untuk reset password via Gmail)
- [ ] `EMAIL_PASS` (Gmail App Password)
- [ ] `EMAIL_FROM` (email pengirim)
- [ ] `RESEND_API_KEY` dan `RESEND_FROM_EMAIL` (jika menggunakan Resend)

## 🐛 Troubleshooting

Jika ada error setelah deploy:

1. **Cek semua variable sudah di-set** di Render dashboard
2. **Pastikan tidak ada typo** di nama variable
3. **Pastikan nilai variable benar** (terutama MONGODB_URI dan JWT_SECRET)
4. **Restart service** setelah menambah/ubah variable
5. **Cek logs** di Render dashboard untuk detail error

