# Quick Start Guide

## Instalasi Cepat

### 1. Install Dependencies
```bash
cd lkmo-be
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di folder `lkmo-be` dengan isi:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lkmo-recipes
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
FRONTEND_URL=http://localhost:5173
```

### 3. Pastikan MongoDB Berjalan

**Opsi A: MongoDB Lokal**
- Install MongoDB dari https://www.mongodb.com/try/download/community
- Jalankan MongoDB service

**Opsi B: MongoDB Atlas (Recommended)**
- Daftar di https://www.mongodb.com/cloud/atlas
- Buat cluster gratis (M0 Free tier)
- Pilih Cloud Provider (AWS/GCP/Azure) dan Region
- **ISI TAGS** dengan info project (penting!)
- Buat database user dan whitelist IP
- Copy connection string ke `MONGODB_URI`

**📖 Untuk panduan detail setup MongoDB, lihat [MONGODB_SETUP.md](./MONGODB_SETUP.md)**

### 4. Jalankan Server

```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:5000`

### 5. Test API

Buka browser atau gunakan Postman/curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Struktur Folder

```
lkmo-be/
├── models/          # Database models (User, Recipe)
├── routes/          # API routes (auth, recipes, users)
├── middleware/      # Custom middleware (auth, upload, error)
├── uploads/         # Folder untuk file upload (auto-created)
├── server.js        # Entry point
├── package.json
└── README.md        # Dokumentasi lengkap
```

## API Endpoints Utama

- `POST /api/auth/register` - Registrasi
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (perlu token)

- `GET /api/recipes` - Get semua resep
- `GET /api/recipes/:id` - Get detail resep
- `POST /api/recipes` - Buat resep baru (perlu token)
- `PUT /api/recipes/:id` - Update resep (perlu token)
- `DELETE /api/recipes/:id` - Hapus resep (perlu token)

- `GET /api/users/profile` - Get profil user (perlu token)
- `PUT /api/users/profile` - Update profil (perlu token)

Lihat `README.md` untuk dokumentasi lengkap.

## Troubleshooting

**Error: Cannot find module**
```bash
npm install
```

**Error: MongoDB connection failed**
- Pastikan MongoDB berjalan
- Check connection string di `.env`

**Error: Port already in use**
- Ganti `PORT` di `.env` atau hentikan aplikasi lain yang menggunakan port 5000

**Upload tidak bekerja**
- Pastikan folder `uploads/` ada dan dapat ditulis
- Check `MAX_FILE_SIZE` di `.env`

