# 🔧 Fix: 404 Not Found untuk Gambar di Production

## ❌ Masalah

Gambar mendapatkan **404 Not Found** saat diakses di production:
```
Request URL: https://lkmo-backend.onrender.com/uploads/image-xxx.png
Status Code: 404 Not Found
```

## 🔍 Penyebab Utama

**Masalah paling umum di Render (Free Tier):** File yang di-upload **tidak persisten** karena Render menggunakan **ephemeral filesystem**.

### Penjelasan:
- File yang di-upload disimpan di folder `uploads/` di server
- Setiap kali server **restart** atau **rebuild**, file di folder `uploads/` akan **hilang**
- File hanya tersimpan di memory/disk sementara, tidak permanen
- Ini adalah batasan dari Render free tier

## ✅ Solusi

### Solusi 1: Upload Ulang Gambar (Sementara)

1. **Upload ulang semua gambar** yang hilang melalui aplikasi
2. **Catatan**: File akan hilang lagi jika server restart

**Kekurangan:**
- Tidak permanen
- File hilang saat server restart/rebuild
- Tidak praktis untuk production

### Solusi 2: Gunakan Cloud Storage (REKOMENDASI)

Gunakan cloud storage seperti **Cloudinary**, **AWS S3**, atau **Google Cloud Storage** untuk menyimpan gambar secara permanen.

#### A. Cloudinary (Paling Mudah)

1. **Daftar di Cloudinary:**
   - Buka [cloudinary.com](https://cloudinary.com)
   - Daftar akun gratis (free tier cukup untuk development)

2. **Install package:**
   ```bash
   cd lkmo-be
   npm install cloudinary multer-storage-cloudinary
   ```

3. **Update upload middleware:**
   - Ganti multer disk storage dengan Cloudinary storage
   - Simpan URL Cloudinary ke database (bukan path lokal)

4. **Update environment variables:**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**Keuntungan:**
- ✅ File tersimpan permanen
- ✅ CDN untuk loading cepat
- ✅ Free tier cukup untuk development
- ✅ Auto optimization (resize, compress)

#### B. AWS S3

1. **Setup AWS S3 bucket**
2. **Install AWS SDK**
3. **Update upload middleware**

**Keuntungan:**
- ✅ File tersimpan permanen
- ✅ Scalable
- ✅ Reliable

**Kekurangan:**
- ❌ Setup lebih kompleks
- ❌ Perlu setup AWS account

### Solusi 3: Upgrade ke Render Paid Plan

Render paid plan menyediakan **persistent disk** yang membuat file tersimpan permanen.

**Keuntungan:**
- ✅ File tersimpan permanen
- ✅ Tidak perlu ubah kode

**Kekurangan:**
- ❌ Perlu bayar (mulai dari $7/bulan)

## 🔍 Verifikasi Masalah

### Cara Cek Apakah File Ada di Server:

1. **Cek log backend di Render:**
   - Buka Render Dashboard → Service backend → Logs
   - Cari log: `📁 Uploads directory exists: true/false`

2. **Test langsung:**
   - Buka URL gambar di browser: `https://lkmo-backend.onrender.com/uploads/image-xxx.png`
   - Jika 404 → File tidak ada di server

3. **Cek apakah file baru bisa di-upload:**
   - Upload gambar baru melalui aplikasi
   - Cek apakah gambar baru muncul
   - Jika muncul → Upload berhasil, tapi file lama hilang

## 📋 Checklist Troubleshooting

- [ ] File baru bisa di-upload dan muncul
- [ ] File lama tidak muncul (404)
- [ ] Server sudah restart/rebuild setelah upload file lama
- [ ] Menggunakan Render free tier
- [ ] File hilang setelah server restart

Jika semua checklist tercentang → **Masalah: Ephemeral filesystem di Render**

## 💡 Rekomendasi

Untuk production, **WAJIB** menggunakan cloud storage seperti Cloudinary karena:
1. ✅ File tersimpan permanen
2. ✅ Tidak hilang saat server restart
3. ✅ CDN untuk loading cepat
4. ✅ Auto optimization
5. ✅ Free tier cukup untuk development

## 🚀 Quick Fix (Sementara)

Jika perlu solusi cepat sementara:

1. **Upload ulang semua gambar** yang hilang
2. **Jangan restart server** di Render (atau file akan hilang lagi)
3. **Rencanakan migrasi ke Cloudinary** untuk solusi permanen

## 📞 Masih Bermasalah?

Jika masih bermasalah setelah mengikuti langkah-langkah di atas:

1. Cek log backend di Render untuk error
2. Pastikan folder `uploads/` ada dan bisa diakses
3. Test upload file baru dan cek apakah muncul
4. Pertimbangkan migrasi ke Cloudinary untuk solusi permanen

