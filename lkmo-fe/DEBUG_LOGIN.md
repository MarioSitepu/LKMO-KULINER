# Debug Login Error

## Cara Debug Error Login

### 1. Buka Developer Tools
Tekan `F12` di browser untuk membuka Developer Tools

### 2. Cek Console Tab
Lihat error yang muncul di tab **Console**:
- `Login error detail:` - Error detail
- `Login response:` - Response dari server (jika sukses)
- `Error response:` - Response error (jika gagal)

### 3. Cek Network Tab
1. Buka tab **Network**
2. Coba login lagi
3. Cari request ke `/api/auth/login`
4. Klik request tersebut
5. Lihat:
   - **Status Code**: 200 (sukses), 400 (bad request), 401 (unauthorized), 500 (server error)
   - **Response**: Lihat data yang dikembalikan server
   - **Headers**: Cek Content-Type dan lainnya

## Error Messages Umum

### "Tidak dapat terhubung ke server"
**Penyebab:**
- Backend tidak berjalan
- Port 5000 tidak tersedia
- Firewall memblokir

**Solusi:**
```bash
cd lkmo-be
npm run dev
```

Pastikan muncul:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### "Email atau password salah"
**Penyebab:**
- Email tidak terdaftar
- Password salah
- Typo saat input

**Solusi:**
- Pastikan sudah register
- Cek email dan password di database
- Pastikan tidak ada typo

### "Format response tidak valid dari server"
**Penyebab:**
- Backend mengembalikan format response yang tidak sesuai
- Error di backend saat generate token

**Solusi:**
- Cek console backend untuk error
- Pastikan JWT_SECRET sudah di-set di `.env`
- Test API langsung dengan curl/Postman

### "Token tidak ditemukan dalam response"
**Penyebab:**
- Backend tidak mengembalikan token
- Struktur response berbeda

**Solusi:**
- Cek Network tab → Response
- Pastikan response memiliki `data.token`

## Test API Langsung

Test backend langsung tanpa frontend:

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

Jika berhasil, harus return:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "...",
      "email": "..."
    }
  }
}
```

## Checklist

Sebelum mencoba login, pastikan:

- [ ] Backend berjalan (`npm run dev` di folder lkmo-be)
- [ ] MongoDB berjalan atau MongoDB Atlas connection OK
- [ ] File `.env` di backend ada dan JWT_SECRET di-set
- [ ] File `.env` di frontend ada dengan `VITE_API_URL=http://localhost:5000/api`
- [ ] User sudah terdaftar (test dengan register dulu)
- [ ] Email dan password benar (tidak ada typo)
- [ ] Tidak ada error di console browser
- [ ] Tidak ada error di console backend

## Debug Step-by-Step

1. **Buka Console Browser** (F12 → Console)
2. **Coba Login**
3. **Lihat Error Message** yang muncul
4. **Buka Network Tab** (F12 → Network)
5. **Lihat Request ke `/api/auth/login`**
6. **Cek Status Code dan Response**
7. **Cek Console Backend** untuk error detail
8. **Copy Error Message** untuk dicari solusinya

## Informasi yang Diperlukan untuk Debug

Jika masih error, siapkan informasi berikut:

1. **Error Message** di console browser
2. **Status Code** di Network tab
3. **Response Body** dari Network tab
4. **Error di Console Backend**
5. **Email yang digunakan** (untuk verifikasi user ada di database)

