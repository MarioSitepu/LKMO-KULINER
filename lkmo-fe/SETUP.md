# Setup Frontend dengan Backend

## Konfigurasi

### 1. Setup Environment Variables

Buat file `.env` di folder `lkmo-fe` dengan isi:

```env
VITE_API_URL=http://localhost:5000/api
```

**Untuk Production:**
```env
VITE_API_URL=https://your-backend-url.com/api
```

### 2. Install Dependencies (jika belum)

```bash
cd lkmo-fe
npm install
```

### 3. Pastikan Backend Berjalan

Sebelum menjalankan frontend, pastikan backend sudah berjalan:

```bash
cd lkmo-be
npm install
npm run dev
```

Backend harus berjalan di `http://localhost:5000`

### 4. Jalankan Frontend

```bash
cd lkmo-fe
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## Fitur yang Sudah Terintegrasi

✅ **Authentication**
- Login - terhubung dengan backend
- Register - terhubung dengan backend
- Auto redirect jika belum login

✅ **Upload Resep**
- Form upload resep dengan validasi
- Upload gambar
- Dynamic ingredients & steps
- Equipment selection
- Terhubung dengan backend API

✅ **Profil User**
- Load data dari backend
- Edit profil dengan upload foto
- Lihat resep user
- Lihat resep tersimpan
- Logout functionality

✅ **State Management**
- AuthContext untuk manage authentication
- Token disimpan di localStorage
- Auto redirect jika token expired

## Troubleshooting

### Error: Cannot connect to backend
- Pastikan backend sudah berjalan di `http://localhost:5000`
- Check `VITE_API_URL` di file `.env`
- Check console browser untuk error detail

### Error: CORS Error
- Pastikan `FRONTEND_URL` di backend `.env` sudah benar
- Default: `FRONTEND_URL=http://localhost:5173`

### Error: 401 Unauthorized
- Token mungkin expired, silakan login kembali
- Check apakah token ada di localStorage

### Upload gambar tidak bekerja
- Pastikan backend folder `uploads/` dapat ditulis
- Check ukuran file (max 5MB)
- Check format file (JPEG, PNG, GIF, WEBP)

## Testing

1. **Test Register:**
   - Buka `/register`
   - Isi form dan submit
   - Harus redirect ke home setelah sukses

2. **Test Login:**
   - Buka `/login`
   - Login dengan email/password yang sudah didaftarkan
   - Harus redirect ke home

3. **Test Upload Resep:**
   - Login terlebih dahulu
   - Buka `/upload`
   - Isi semua field dan submit
   - Harus redirect ke profile setelah sukses

4. **Test Edit Profil:**
   - Buka `/profile`
   - Click "Edit Profil"
   - Update data dan submit
   - Harus update di profile page

## API Endpoints yang Digunakan

Frontend menggunakan endpoint berikut:

- `POST /api/auth/register` - Registrasi
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/users/profile` - Get user profile dengan recipes
- `PUT /api/users/profile` - Update profile
- `GET /api/recipes` - Get semua resep
- `GET /api/recipes/:id` - Get detail resep
- `POST /api/recipes` - Create resep
- `POST /api/recipes/:id/save` - Save/unsave resep

Lihat `lkmo-be/README.md` untuk dokumentasi API lengkap.

