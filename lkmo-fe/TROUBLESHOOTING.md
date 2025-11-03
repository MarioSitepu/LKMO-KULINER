# Troubleshooting - Masalah Umum

## 1. Registrasi Gagal

### Cek Backend
```bash
# Pastikan backend berjalan
cd lkmo-be
npm run dev

# Cek apakah server berjalan di http://localhost:5000
# Buka browser: http://localhost:5000/api/health
```

### Cek Environment Variables Backend
Pastikan file `.env` di folder `lkmo-be` ada dan berisi:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lkmo-recipes
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**⚠️ PENTING:** 
- `JWT_SECRET` harus di-set, jika tidak registrasi akan gagal
- `MONGODB_URI` harus benar dan MongoDB harus berjalan

### Cek MongoDB
```bash
# Pastikan MongoDB berjalan
# Windows: Cek di Services atau jalankan:
mongod

# Atau gunakan MongoDB Atlas (cloud)
```

### Cek Console Browser
Buka Developer Tools (F12) dan cek:
- Tab **Console** - untuk error JavaScript
- Tab **Network** - untuk melihat request/response

### Error Messages Umum

**"Tidak dapat terhubung ke server"**
- Backend tidak berjalan
- Port 5000 digunakan aplikasi lain
- Firewall memblokir koneksi

**"Email sudah terdaftar"**
- Email sudah digunakan, coba email lain

**"Validasi gagal"**
- Nama minimal 2 karakter
- Email harus valid
- Password minimal 6 karakter

**"Error saat registrasi" (500)**
- Check console backend untuk error detail
- Pastikan MongoDB connection OK
- Pastikan JWT_SECRET sudah di-set

## 2. Login Gagal

### Cek apakah user sudah terdaftar
- Pastikan sudah register terlebih dahulu
- Cek email/password benar

### Error "Email atau password salah"
- Email atau password tidak cocok
- Pastikan tidak ada typo

## 3. Upload Resep Gagal

### Cek Authentication
- Pastikan sudah login
- Token mungkin expired, coba login lagi

### Cek File Upload
- Max size: 5MB
- Format: JPEG, PNG, GIF, WEBP
- Pastikan folder `uploads/` di backend ada dan dapat ditulis

## 4. Error CORS

Jika muncul error CORS di console:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solusi:**
1. Pastikan `FRONTEND_URL` di backend `.env` benar:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```
2. Restart backend setelah mengubah `.env`

## 5. Error 401 Unauthorized

- Token expired atau invalid
- Silakan login kembali
- Token akan otomatis dihapus dan redirect ke login

## 6. Environment Variables Frontend

Pastikan file `.env` di folder `lkmo-fe` ada:
```env
VITE_API_URL=http://localhost:5000/api
```

**Note:** Setelah mengubah `.env`, restart development server!

## Debugging Tips

### 1. Check Network Tab
- Buka Developer Tools (F12)
- Tab Network
- Lihat request ke `/api/auth/register`
- Cek Status Code dan Response

### 2. Check Backend Logs
- Lihat console tempat backend berjalan
- Cari error messages
- Copy error untuk debugging

### 3. Test API Langsung
Gunakan curl atau Postman untuk test backend:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

### 4. Check MongoDB Connection
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/lkmo-recipes
```

## Quick Fix Checklist

- [ ] Backend berjalan di port 5000
- [ ] MongoDB berjalan atau MongoDB Atlas connection OK
- [ ] File `.env` di backend ada dan JWT_SECRET di-set
- [ ] File `.env` di frontend ada dengan VITE_API_URL
- [ ] Frontend dan backend di-restart setelah mengubah `.env`
- [ ] CORS setting di backend sudah benar
- [ ] Tidak ada error di console browser
- [ ] Tidak ada error di console backend

