# Backend API - LKMO Recipes

Backend API untuk aplikasi resep makanan menggunakan Node.js, Express, dan MongoDB.

## Fitur

- ✅ Authentication (Register, Login, JWT)
- ✅ Upload Resep dengan gambar
- ✅ CRUD Resep
- ✅ Profil User
- ✅ Save/Unsave Resep
- ✅ Follow/Unfollow User
- ✅ Upload gambar profil
- ✅ Search & Filter Resep
- ✅ Pagination
- ✅ Admin Dashboard & Management

## Teknologi

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM untuk MongoDB
- **JWT** - Authentication
- **Multer** - File upload
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Copy file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

3. Edit file `.env` dan sesuaikan konfigurasi:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lkmo-recipes
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
```

4. Pastikan MongoDB sudah berjalan (atau gunakan MongoDB Atlas)

5. Buat admin user pertama kali:
```bash
npm run create-admin
```
Default credentials:
- Email: `admin@lkmo.com`
- Password: `admin123456`

📖 **Panduan lengkap setup admin: [ADMIN_SETUP.md](./ADMIN_SETUP.md)**

6. Jalankan server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Recipes

- `GET /api/recipes` - Get semua resep (dengan filter & pagination)
- `GET /api/recipes/:id` - Get detail resep
- `POST /api/recipes` - Buat resep baru (protected)
- `PUT /api/recipes/:id` - Update resep (protected, owner only)
- `DELETE /api/recipes/:id` - Hapus resep (protected, owner only)
- `POST /api/recipes/:id/save` - Save/Unsave resep (protected)

**Query Parameters untuk GET /api/recipes:**
- `category` - Filter by category (breakfast, lunch, dinner, snack)
- `search` - Search recipes
- `author` - Filter by author ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sort` - Sort by (createdAt, rating, prepTime)

### Users

- `GET /api/users/profile` - Get current user profile dengan recipes (protected)
- `PUT /api/users/profile` - Update profil (protected)
- `GET /api/users/:id` - Get user profile by ID
- `GET /api/users/:id/recipes` - Get recipes by user
- `POST /api/users/:id/follow` - Follow/Unfollow user (protected)

### Admin (Admin Only)

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users with pagination
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/recipes` - Get all recipes with pagination
- `DELETE /api/admin/recipes/:id` - Delete recipe
- `GET /api/admin/reviews` - Get all reviews with pagination
- `DELETE /api/admin/reviews/:id` - Delete review

### Health Check

- `GET /api/health` - Check server status

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // untuk validation errors
}
```

## Authentication

Gunakan JWT token untuk mengakses protected routes. Setelah login/register, simpan token dan kirim di header:

```
Authorization: Bearer <token>
```

## Upload File

- Format: JPEG, JPG, PNG, GIF, WEBP
- Max size: 5MB (dapat dikonfigurasi di `.env`)
- File disimpan di folder `uploads/`
- URL file: `/uploads/<filename>`

## Struktur Folder

```
lkmo-be/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── uploads/         # Uploaded files
├── server.js        # Entry point
├── package.json
└── .env            # Environment variables
```

## Deployment

### Menggunakan MongoDB Atlas (Recommended)

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (pilih Cloud Provider: AWS/GCP/Azure dan Region)
3. **ISI TAGS** dengan informasi project (penting!)
4. Copy connection string ke `MONGODB_URI` di `.env`
5. Pastikan IP address sudah di-whitelist

**📖 Panduan lengkap setup MongoDB: [MONGODB_SETUP.md](./MONGODB_SETUP.md)**

### Deploy ke Platform (Vercel, Railway, Render, dll)

1. Set environment variables di platform
2. Pastikan MongoDB Atlas connection string sudah benar
3. Set `NODE_ENV=production`
4. Deploy code

### Environment Variables untuk Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lkmo-recipes
JWT_SECRET=strong-secret-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.com
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Email Configuration (Required untuk Reset Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# Atau gunakan SMTP untuk Production
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=apikey
# SMTP_PASS=your-api-key
# EMAIL_FROM=noreply@yourdomain.com
```

**📖 Panduan lengkap setup email: [EMAIL_SETUP.md](./EMAIL_SETUP.md)**  
**📖 Panduan setup email di Render: [RENDER_EMAIL_SETUP.md](./RENDER_EMAIL_SETUP.md)**

## Testing API

Anda dapat menggunakan tools seperti:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- curl

### Contoh Request

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Create Recipe (with image):**
```bash
curl -X POST http://localhost:5000/api/recipes \
  -H "Authorization: Bearer <token>" \
  -F "title=Nasi Goreng" \
  -F "category=lunch" \
  -F "prepTime=15" \
  -F "ingredients=[\"Nasi\",\"Telur\",\"Kecap\"]" \
  -F "steps=[\"Panaskan minyak\",\"Masukkan nasi\",\"Aduk rata\"]" \
  -F "image=@/path/to/image.jpg"
```

## Catatan

- Pastikan folder `uploads/` ada dan dapat ditulis
- Untuk production, gunakan service seperti AWS S3, Cloudinary, atau storage service lainnya untuk menyimpan gambar
- Jangan commit file `.env` ke repository
- Pastikan `JWT_SECRET` kuat dan aman di production
- Setelah membuat admin, segera ubah password default untuk keamanan

