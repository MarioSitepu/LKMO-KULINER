# 🍳 LKMO Recipes - Platform Resep Makanan

Platform web untuk berbagi dan menemukan resep makanan dengan berbagai fitur lengkap seperti rating, review, follow system, dan pencarian canggih.

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Fitur](#fitur)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Documentation](#api-documentation)
- [Dokumentasi](#dokumentasi)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Tentang Proyek

LKMO Recipes adalah aplikasi web full-stack untuk berbagi resep makanan. Pengguna dapat:
- 📝 Membuat dan membagikan resep dengan gambar
- ⭐ Memberikan rating dan review pada resep
- 🔍 Mencari resep berdasarkan kategori, bahan, atau keyword
- 👥 Mengikuti pengguna lain dan melihat resep mereka
- 💾 Menyimpan resep favorit
- 🏆 Melihat leaderboard pengguna teratas
- 🔐 Login dengan email/password atau Google OAuth

---

## 🛠️ Teknologi yang Digunakan

### Backend (`lkmo-be`)

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Node.js** | Latest | JavaScript runtime environment |
| **Express.js** | ^4.18.2 | Web framework untuk REST API |
| **MongoDB** | ^6.20.0 | NoSQL database |
| **Mongoose** | ^8.0.3 | ODM (Object Data Modeling) untuk MongoDB |
| **JWT** | ^9.0.2 | JSON Web Token untuk autentikasi |
| **Bcryptjs** | ^2.4.3 | Password hashing |
| **Multer** | ^1.4.5-lts.1 | Middleware untuk upload file |
| **Express Validator** | ^7.0.1 | Validasi input request |
| **Google Auth Library** | ^10.5.0 | Google OAuth 2.0 authentication |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | ^16.3.1 | Environment variables management |

**Dev Dependencies:**
- **Nodemon** | ^3.0.2 | Auto-restart server saat development

### Frontend (`lkmo-fe`)

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **React** | ^19.1.1 | UI library |
| **TypeScript** | ~5.9.3 | Type-safe JavaScript |
| **Vite** | ^7.1.7 | Build tool dan dev server |
| **React Router DOM** | ^7.9.4 | Client-side routing |
| **Axios** | ^1.12.2 | HTTP client untuk API calls |
| **Tailwind CSS** | ^4.1.14 | Utility-first CSS framework |
| **Lucide React** | ^0.545.0 | Icon library |

**Dev Dependencies:**
- **ESLint** | ^9.36.0 | Code linting
- **TypeScript ESLint** | ^8.45.0 | TypeScript linting rules
- **@vitejs/plugin-react** | ^5.0.4 | Vite plugin untuk React

### Database

- **MongoDB Atlas** (Cloud) atau **MongoDB Local**
- Database: `lkmo-recipes`

### Deployment

- **Backend**: [Render](https://render.com)
- **Frontend**: [Vercel](https://vercel.com)
- **Database**: MongoDB Atlas (Cloud)

---

## ✨ Fitur

### Authentication & User Management
- ✅ Registrasi dengan email/password
- ✅ Login dengan email/password
- ✅ Login dengan Google OAuth
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ User profile management
- ✅ Upload foto profil
- ✅ Password tersimpan dalam bentuk hash (bcrypt) untuk keamanan maksimal

### Recipe Management
- ✅ Buat resep baru dengan gambar
- ✅ Edit resep (hanya pemilik)
- ✅ Hapus resep (hanya pemilik)
- ✅ Upload gambar resep
- ✅ Kategori resep (breakfast, lunch, dinner, snack)
- ✅ Filter berdasarkan kategori
- ✅ Filter berdasarkan peralatan
- ✅ Filter berdasarkan harga (murah, sedang, mahal)
- ✅ Pencarian resep (title, ingredients)
- ✅ Detail resep lengkap

### Social Features
- ✅ Save/Unsave resep
- ✅ Rating sistem (1-5 bintang)
- ✅ Review dan komentar
- ✅ Leaderboard pengguna
- ✅ Profil user dengan resep

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI dengan Tailwind CSS
- ✅ Loading states
- ✅ Error handling
- ✅ Pagination
- ✅ Search functionality

### 👥 Perspektif Pengguna (User)
- Jelajahi resep terbaru, populer, dan rekomendasi kategori langsung dari beranda.
- Gunakan pencarian lanjutan dengan filter kategori, rentang harga, dan peralatan masak.
- Lihat detail resep lengkap beserta rating, ulasan komunitas, serta simpan resep favorit untuk akses cepat.
- Upload resep pribadi dengan gambar, bahan, langkah, peralatan, dan estimasi harga yang rapi.
- Kelola profil pribadi: foto, bio, lokasi, serta pantau statistik jumlah resep dan resep tersimpan.
- Melihat kreator lain di leaderboard, ihat resep mereka, dan berpartisipasi dalam ulasan untuk meningkatkan visibilitas.
- Gunakan leaderboard untuk mencari kreator terbaik dan inspirasi resep hemat.
- Reset password melalui OTP atau lanjutkan dengan login Google secara instan.

### 🛡️ Perspektif Admin
- Akses dashboard ringkasan (total user, resep, review, admin, penambahan user/resep terbaru).
- Pantau distribusi kategori resep serta top contributor langsung dari panel utama.
- Kelola user: ubah role user ↔ admin, hapus akun, dan cari user tertentu.
- Moderasi resep publik: telusuri, cari, dan hapus resep yang melanggar kebijakan.
- Moderasi ulasan: lihat daftar review terbaru dan hapus bila tidak sesuai.
- Lihat notifikasi permintaan reset password untuk memantau aktivitas keamanan.
- Gunakan quick actions untuk bernavigasi cepat ke halaman manajemen user, resep, dan ulasan.

---

## 📁 Struktur Proyek

```
LKMO-FULL/
├── lkmo-be/                    # Backend API
│   ├── models/                 # Database models
│   │   ├── User.model.js
│   │   ├── Recipe.model.js
│   │   └── Review.model.js
│   ├── routes/                 # API routes
│   │   ├── auth.routes.js
│   │   ├── recipe.routes.js
│   │   └── user.routes.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   ├── uploads/                # Uploaded images
│   ├── server.js               # Entry point
│   ├── package.json
│   └── README.md
│
├── lkmo-fe/                    # Frontend React App
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Layout.tsx
│   │   │   ├── RecipeCard.tsx
│   │   │   └── footer.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── RecipePage.tsx
│   │   │   ├── UploadRecipePage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── SearchPage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── EquipmentPage.tsx
│   │   │   ├── PricePage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   └── EditProfilePage.tsx
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── googleAuth.ts
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static files
│   ├── package.json
│   └── vite.config.ts
│
├── ERD_DIAGRAM.md              # Database schema documentation
├── DEPLOYMENT_GUIDE.md         # Deployment guide lengkap
├── ENV_VARIABLES.md            # Environment variables guide
├── GOOGLE_OAUTH_SETUP.md       # Google OAuth setup guide
├── FIX_CONNECTION_ERROR.md     # Troubleshooting connection errors
└── README.md                   # This file
```

---

## 🚀 Instalasi

### Prasyarat

- **Node.js** (v18 atau lebih baru)
- **npm** atau **yarn**
- **MongoDB** (local atau MongoDB Atlas)
- **Git**

### Langkah Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd LKMO-FULL
```

2. **Install Backend Dependencies**
```bash
cd lkmo-be
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../lkmo-fe
npm install
```

---

## ⚙️ Konfigurasi

### Backend Configuration

1. **Buat file `.env` di folder `lkmo-be/`**
```bash
cd lkmo-be
cp .env.example .env  # Jika ada, atau buat manual
```

2. **Isi file `.env` dengan konfigurasi berikut:**
```env
# Environment
NODE_ENV=development

# Server
PORT=5000

# Database - MongoDB Connection String
# Untuk local: mongodb://localhost:27017/lkmo-recipes
# Untuk Atlas: mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
MONGODB_URI=mongodb://localhost:27017/lkmo-recipes

# JWT Configuration
# Generate secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload Settings
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_PATH=uploads

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Supabase Storage Setup

Ikuti langkah berikut untuk menghubungkan penyimpanan gambar ke Supabase:

1. **Buat proyek Supabase**
   - Masuk ke [https://supabase.com/](https://supabase.com/) dan klik *New project*.
   - Pilih organisasi, masukkan nama proyek, serta set password database (catat untuk backup).
   - Setelah proyek selesai dibuat, buka tab *Project Settings* → *General* untuk menemukan `Project URL`.

2. **Dapatkan Service Role Key**
   - Buka *Project Settings* → *API*.
   - Salin **Project URL** (format `https://xxxx.supabase.co`) dan **Service Role Key** (gunakan untuk server-side saja).

3. **Buat bucket storage**
   - Pergi ke menu *Storage* → *Buckets* → *Create bucket*.
   - Nama disarankan `lkmo-images` (atau sesuaikan, tetapi gunakan nama yang sama dengan environment variable `SUPABASE_BUCKET`).
   - Aktifkan opsi **Public bucket** agar URL gambar bisa diakses frontend.

4. **Isi environment variable backend**
   - Di file `.env` lokal backend (atau di Render setelah deploy) pastikan tiga variable ini ter-set:
     ```env
     SUPABASE_URL=https://project-id.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=service-role-key-dari-dashboard
     SUPABASE_BUCKET=lkmo-images
     ```
   - Jika menggunakan nama bucket berbeda, pastikan nilainya sama di sini dan saat membuat bucket.

5. **Restart backend**
   - Hentikan dan jalankan ulang `npm run dev` (lokal) atau klik *Restart* di Render setelah menyimpan environment variable.

6. **Uji unggah gambar**
   - Login ke aplikasi, buka halaman `Upload Resep`, unggah gambar baru, lalu pastikan gambar tampil di halaman detail resep.
   - Jika masih gagal, cek log backend; error terkait Supabase biasanya muncul bila variable belum terisi atau bucket belum public.

### Frontend Configuration

1. **Buat file `.env` di folder `lkmo-fe/`**
```bash
cd lkmo-fe
```

2. **Isi file `.env` dengan konfigurasi berikut:**
```env
# API URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Catatan:** 
- Semua environment variables di frontend harus diawali dengan `VITE_`
- Untuk production, ganti URL dengan URL production yang sesuai

---

## 🏃 Menjalankan Aplikasi

### Development Mode

#### Backend
```bash
cd lkmo-be
npm run dev
```
Server akan berjalan di `http://localhost:5000`

#### Frontend
```bash
cd lkmo-fe
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`

### Production Mode

#### Backend
```bash
cd lkmo-be
npm start
```

#### Frontend
```bash
cd lkmo-fe
npm run build
npm run preview
```

---

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url.onrender.com/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google-id-token"
}
```

### Recipe Endpoints

#### Get All Recipes
```http
GET /api/recipes?page=1&limit=12&category=lunch&search=nasi
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category (breakfast, lunch, dinner, snack)
- `search` - Search in title and ingredients
- `author` - Filter by author ID
- `sort` - Sort by (createdAt, rating, prepTime)

#### Get Recipe by ID
```http
GET /api/recipes/:id
```

#### Create Recipe
```http
POST /api/recipes
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Nasi Goreng",
  "category": "lunch",
  "prepTime": 15,
  "ingredients": ["Nasi", "Telur", "Kecap"],
  "steps": ["Panaskan minyak", "Masukkan nasi", "Aduk rata"],
  "equipment": ["Wajan", "Spatula"],
  "price": "murah",
  "image": <file>
}
```

#### Update Recipe
```http
PUT /api/recipes/:id
Authorization: Bearer <token>
```

#### Delete Recipe
```http
DELETE /api/recipes/:id
Authorization: Bearer <token>
```

#### Save/Unsave Recipe
```http
POST /api/recipes/:id/save
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Get User by ID
```http
GET /api/users/:id
```

#### Get User Recipes
```http
GET /api/users/:id/recipes
```

#### Follow/Unfollow User
```http
POST /api/users/:id/follow
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]  // untuk validation errors
}
```

---

## 📖 Dokumentasi

Proyek ini dilengkapi dengan dokumentasi lengkap:

### 📄 Dokumentasi Utama

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
   - Panduan lengkap deployment ke Vercel dan Render
   - Setup MongoDB Atlas
   - Setup Google OAuth
   - Troubleshooting deployment

2. **[ENV_VARIABLES.md](./ENV_VARIABLES.md)**
   - Daftar lengkap environment variables
   - Cara generate JWT_SECRET
   - Konfigurasi untuk development dan production

3. **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)**
   - Setup Google OAuth di Google Cloud Console
   - Konfigurasi backend dan frontend
   - Troubleshooting OAuth

4. **[ERD_DIAGRAM.md](./ERD_DIAGRAM.md)**
   - Entity Relationship Diagram database
   - Penjelasan model dan relasi
   - Query patterns yang umum

5. **[FIX_CONNECTION_ERROR.md](./FIX_CONNECTION_ERROR.md)**
   - Troubleshooting connection errors
   - CORS issues
   - Database connection problems

### 📄 Dokumentasi Backend

- **[lkmo-be/README.md](./lkmo-be/README.md)** - Dokumentasi backend API
- **[lkmo-be/QUICKSTART.md](./lkmo-be/QUICKSTART.md)** - Quick start guide
- **[lkmo-be/MONGODB_SETUP.md](./lkmo-be/MONGODB_SETUP.md)** - Setup MongoDB
- **[lkmo-be/ENV_TEMPLATE.md](./lkmo-be/ENV_TEMPLATE.md)** - Template environment variables
- **[lkmo-be/DEPLOY.md](./lkmo-be/DEPLOY.md)** - Deployment guide backend

### 📄 Dokumentasi Frontend

- **[lkmo-fe/README.md](./lkmo-fe/README.md)** - Dokumentasi frontend
- **[lkmo-fe/SETUP.md](./lkmo-fe/SETUP.md)** - Setup guide
- **[lkmo-fe/TROUBLESHOOTING.md](./lkmo-fe/TROUBLESHOOTING.md)** - Troubleshooting frontend

---

## 🚢 Deployment

### Quick Deploy

1. **Backend ke Render**
   - Connect GitHub repository
   - Set root directory: `lkmo-be`
   - Set environment variables (lihat [ENV_VARIABLES.md](./ENV_VARIABLES.md))
   - Deploy

2. **Frontend ke Vercel**
   - Connect GitHub repository
   - Set root directory: `lkmo-fe`
   - Set environment variables
   - Deploy

**Panduan lengkap:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Environment Variables untuk Production

#### Backend (Render)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
GOOGLE_CLIENT_ID=...
```

#### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=...
```

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke MongoDB

**Solusi:**
- Pastikan MongoDB sudah running (jika local)
- Cek connection string di `.env`
- Pastikan IP sudah di-whitelist (jika menggunakan Atlas)
- Cek logs di console

### CORS Error

**Solusi:**
- Pastikan `FRONTEND_URL` di backend sesuai dengan URL frontend
- Pastikan menggunakan `https://` di production
- Restart backend setelah update environment variables

### Frontend tidak bisa connect ke backend

**Solusi:**
- Pastikan `VITE_API_URL` sudah benar
- Pastikan backend sudah running
- Cek browser console untuk detail error
- Pastikan CORS sudah dikonfigurasi dengan benar

### Upload gambar tidak berfungsi

**Catatan:**
- Render free tier menggunakan ephemeral storage
- File akan hilang setelah restart
- Untuk production, gunakan cloud storage (S3, Cloudinary)

**Solusi:**
- File akan tersimpan selama service tidak restart
- Untuk production, pertimbangkan integrasi cloud storage

### Google OAuth tidak berfungsi

**Solusi:**
- Pastikan `GOOGLE_CLIENT_ID` sama di backend dan frontend
- Pastikan domain sudah ditambahkan di Google Cloud Console
- Pastikan menggunakan `https://` di production
- Lihat [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

---

## 📊 Database Schema

### Models

1. **User**
   - `_id`, `name`, `email`, `password`, `googleId`
   - `image`, `bio`, `location`
   - `followers[]`, `following[]`
   - `createdAt`, `updatedAt`

2. **Recipe**
   - `_id`, `title`, `category`, `prepTime`
   - `image`, `equipment[]`, `ingredients[]`, `steps[]`
   - `price`, `author` (FK), `rating`, `ratingsCount`
   - `savedBy[]`, `createdAt`, `updatedAt`

3. **Review**
   - `_id`, `recipe` (FK), `user` (FK)
   - `rating`, `comment`
   - `createdAt`, `updatedAt`

**Diagram lengkap:** [ERD_DIAGRAM.md](./ERD_DIAGRAM.md)

---

## 🔒 Security Features

- ✅ Password hashing dengan bcrypt
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Input validation dengan express-validator
- ✅ CORS configuration
- ✅ File upload validation
- ✅ Google OAuth 2.0

---

## 📝 Scripts

### Backend
```bash
npm start      # Production mode
npm run dev    # Development mode dengan nodemon
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Build untuk production
npm run preview  # Preview production build
npm run lint     # Lint code
```

---

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

ISC License

---

## 👤 Author

Dibuat Oleh Team LKMO Kel.7 dengan ❤️ untuk berbagi resep makanan

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek dokumentasi di folder proyek
2. Lihat [Troubleshooting](#-troubleshooting) section
3. Buka issue di repository

---

**Happy Cooking! 🍳👨‍🍳**

