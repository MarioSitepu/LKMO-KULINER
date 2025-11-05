# Setup Admin User

Panduan untuk membuat akun admin pertama kali.

## Cara Membuat Admin User

### Opsi 1: Menggunakan Script (Recommended)

1. Pastikan file `.env` sudah dikonfigurasi dengan benar (termasuk `MONGODB_URI`)

2. Jalankan script untuk membuat admin:
   ```bash
   npm run create-admin
   ```

3. Default credentials:
   - **Email**: `admin@lkmo.com`
   - **Password**: `admin123456`

4. Script akan:
   - Membuat user admin baru jika belum ada
   - Atau mengupdate user yang sudah ada menjadi admin

### Opsi 2: Menggunakan Environment Variables

Anda bisa custom email dan password dengan menambahkan ke file `.env`:

```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Admin Name
```

Kemudian jalankan:
```bash
npm run create-admin
```

### Opsi 3: Manual via MongoDB

Jika ingin membuat admin secara manual:

1. Login ke MongoDB (MongoDB Compass, MongoDB Atlas, atau mongo shell)

2. Pilih database yang digunakan

3. Cari collection `users` dan insert document baru:
   ```json
   {
     "name": "Admin LKMO",
     "email": "admin@lkmo.com",
     "password": "<hashed_password>",
     "role": "admin",
     "createdAt": new Date(),
     "updatedAt": new Date()
   }
   ```

4. **PENTING**: Password harus di-hash menggunakan bcrypt. Anda bisa menggunakan script Node.js atau online bcrypt generator.

## Cara Login sebagai Admin

1. Buka aplikasi web di browser

2. Klik tombol **"Masuk"** di sidebar

3. Masukkan credentials:
   - Email: `admin@lkmo.com`
   - Password: `admin123456`

4. Setelah login berhasil, Anda akan melihat menu **"Admin"** di sidebar

5. Klik menu **"Admin"** untuk mengakses dashboard admin

## Fitur Admin

Setelah login sebagai admin, Anda dapat:

- 📊 **Dashboard**: Melihat statistik lengkap (total users, recipes, reviews, dll)
- 👥 **Manage Users**: Mengelola semua users, mengubah role, menghapus user
- 🍳 **Manage Recipes**: Mengelola semua resep, menghapus resep
- ⭐ **Manage Reviews**: Mengelola semua review, menghapus review

## Keamanan

⚠️ **PENTING**: 
- Setelah login pertama kali, segera ubah password admin melalui fitur edit profile
- Jangan share credentials admin ke orang yang tidak berwenang
- Untuk production, gunakan password yang kuat dan unik
- Pertimbangkan untuk menggunakan environment variables untuk menyimpan credentials admin

## Troubleshooting

### Script tidak berjalan
- Pastikan MongoDB sudah terhubung (cek `MONGODB_URI` di `.env`)
- Pastikan semua dependencies sudah terinstall (`npm install`)

### User sudah ada tapi tidak bisa login

**Cek apakah admin user sudah dibuat:**
```bash
npm run check-admin
```

**Jika admin belum ada atau perlu reset password:**
```bash
npm run create-admin
```

**Pastikan:**
- User memiliki field `role: 'admin'` di database
- Password sudah benar (script akan reset password ke `admin123456`)
- Email di-normalize menjadi lowercase (admin@lkmo.com)

**Jika masih tidak bisa login:**
1. Pastikan backend server sedang running (`npm run dev`)
2. Cek apakah email di database sudah lowercase
3. Coba reset password lagi dengan menjalankan `npm run create-admin`
4. Cek console browser (F12) untuk melihat error message
5. Pastikan `VITE_API_URL` di frontend `.env` mengarah ke backend yang benar

### Tidak muncul menu Admin
- Pastikan user sudah login
- Pastikan user memiliki `role: 'admin'` di database
- Coba logout dan login kembali untuk refresh token
- Cek di browser console apakah ada error saat mengambil data user

