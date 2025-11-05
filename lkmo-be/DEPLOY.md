# Panduan Deployment Backend LKMO

## Persiapan Sebelum Deploy

### 1. Setup MongoDB

#### Opsi A: MongoDB Atlas (Recommended untuk Production)

1. Daftar di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (pilih free tier M0 jika untuk development)
3. Pilih Cloud Provider (AWS/GCP/Azure) - rekomendasi sesuai backend hosting
4. Pilih Region terdekat (contoh: Singapore untuk Indonesia)
5. **ISI TAGS** dengan info project (penting untuk cost tracking & organization)
   - Contoh: Project, Environment, Team, CostCenter
6. Buat database user dengan password
7. Whitelist IP address (atau gunakan `0.0.0.0/0` untuk development)
8. Copy connection string, contoh:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes
   ```

**📖 Lihat panduan lengkap di [MONGODB_SETUP.md](./MONGODB_SETUP.md)**

#### Opsi B: MongoDB Lokal

```bash
# Install MongoDB (jika belum ada)
# Windows: Download dari https://www.mongodb.com/try/download/community
# atau gunakan MongoDB Atlas

# Jalankan MongoDB
mongod
```

### 2. Environment Variables

Set environment variables berikut di platform deployment:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lkmo-recipes
JWT_SECRET=generate-strong-random-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Email Configuration (Required untuk Reset Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# Atau gunakan SMTP (untuk Production)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=apikey
# SMTP_PASS=your-api-key
# EMAIL_FROM=noreply@yourdomain.com
```

**⚠️ PENTING:**
- Ganti `JWT_SECRET` dengan string acak yang kuat
- Ganti `MONGODB_URI` dengan connection string MongoDB Anda
- Sesuaikan `FRONTEND_URL` dengan URL frontend Anda
- **Email variables HARUS di-set** untuk fitur reset password
- Untuk Gmail: gunakan App Password (bukan password biasa)
- **📖 Panduan lengkap: [RENDER_EMAIL_SETUP.md](./RENDER_EMAIL_SETUP.md)**

## Deployment Options

### 1. Railway

1. Daftar di [Railway](https://railway.app)
2. Pilih "New Project" → "Deploy from GitHub"
3. Connect repository Anda
4. Set environment variables
5. Deploy!

**Railway akan otomatis:**
- Detect Node.js
- Install dependencies
- Run `npm start`

### 2. Render

1. Daftar di [Render](https://render.com)
2. Pilih "New Web Service"
3. Connect repository
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Set environment variables
6. Deploy!

### 3. Vercel (dengan Serverless Functions)

**Note:** Vercel lebih cocok untuk frontend, tapi bisa juga untuk backend dengan beberapa modifikasi.

### 4. Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set env vars:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-connection-string
   heroku config:set JWT_SECRET=your-secret
   ```
5. Deploy: `git push heroku main`

### 5. DigitalOcean App Platform

1. Daftar di [DigitalOcean](https://www.digitalocean.com)
2. Pilih "Apps" → "Create App"
3. Connect repository
4. Configure:
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Set environment variables
6. Deploy!

## Post-Deployment Checklist

- [ ] Test endpoint `/api/health`
- [ ] Test register endpoint
- [ ] Test login endpoint
- [ ] Test upload recipe dengan gambar
- [ ] Verifikasi gambar tersimpan dan dapat diakses
- [ ] Test semua CRUD operations
- [ ] Verifikasi CORS setting sudah benar
- [ ] Pastikan MongoDB connection stable

## Upload Files Storage

**⚠️ Catatan Penting:**

Untuk production, sebaiknya gunakan cloud storage seperti:
- **AWS S3**
- **Cloudinary**
- **Google Cloud Storage**
- **Azure Blob Storage**

Storage lokal (folder `uploads/`) di platform hosting biasanya:
- ✅ Bekerja di development
- ⚠️ Temporary dan bisa hilang di beberapa platform
- ❌ Tidak ideal untuk production

### Contoh Integrasi Cloudinary

1. Install: `npm install cloudinary`
2. Setup di `middleware/upload.middleware.js`
3. Upload ke Cloudinary instead of local storage

## Troubleshooting

### Error: Cannot connect to MongoDB
- Pastikan connection string benar
- Pastikan IP address sudah di-whitelist (MongoDB Atlas)
- Pastikan username dan password benar

### Error: ENOENT uploads directory
- Pastikan folder `uploads/` dibuat di server
- Atau gunakan cloud storage

### CORS Error
- Pastikan `FRONTEND_URL` di env sesuai dengan URL frontend
- Check CORS configuration di `server.js`

### JWT Error
- Pastikan `JWT_SECRET` sudah di-set
- Pastikan secret sama di semua environment

## Monitoring

Setelah deploy, monitor:
- Server logs
- Database connections
- API response times
- Error rates

Platform seperti Railway dan Render menyediakan logging built-in.

