# Setup Email di Render untuk Reset Password

Panduan untuk menambahkan environment variables email di Render agar fitur reset password dapat mengirim OTP.

## ⚠️ Penting

**Environment variables untuk email HARUS ditambahkan di Render** jika ingin fitur reset password bekerja di production.

## 📋 Langkah Setup di Render

### 1. Buka Render Dashboard

1. Login ke [Render Dashboard](https://dashboard.render.com)
2. Pilih service backend Anda
3. Klik **"Environment"** tab di sidebar kiri

### 2. Tambahkan Environment Variables

Klik **"Add Environment Variable"** dan tambahkan variabel berikut:

#### Opsi A: Menggunakan Gmail (Recommended untuk Development/Testing)

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
```

**Cara mendapatkan Gmail App Password:**
1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Aktifkan **2-Step Verification** jika belum
3. Buka [App Passwords](https://myaccount.google.com/apppasswords)
4. Pilih "Mail" dan "Other (Custom name)"
5. Masukkan nama: "LKMO Render"
6. Copy password yang di-generate (16 karakter, format: `xxxx xxxx xxxx xxxx`)
7. Paste ke `EMAIL_PASS` di Render (tanpa spasi)

#### Opsi B: Menggunakan SMTP Service (Recommended untuk Production)

Untuk production, gunakan email service professional:

**SendGrid (Free: 100 emails/day)**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx-your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

**Mailgun (Free: 5,000 emails/month)**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
EMAIL_FROM=noreply@yourdomain.com
```

**Resend (Free: 3,000 emails/month)**
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=re_xxxxx-your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### 3. Save dan Restart

1. Klik **"Save Changes"**
2. Render akan otomatis restart service
3. Tunggu beberapa detik hingga service siap

## ✅ Checklist Environment Variables

Pastikan semua variable berikut sudah di-set di Render:

**Required:**
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `FRONTEND_URL`
- [ ] `EMAIL_USER` atau `SMTP_HOST`
- [ ] `EMAIL_PASS` atau `SMTP_PASS`
- [ ] `EMAIL_FROM`

**Optional:**
- [ ] `GOOGLE_CLIENT_ID` (jika menggunakan Google login)
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER` (jika menggunakan SMTP)

## 🧪 Testing

Setelah setup, test dengan:

1. Buka aplikasi web yang sudah di-deploy
2. Klik "Lupa password?" di halaman login
3. Masukkan email user yang terdaftar
4. Cek email inbox untuk OTP

**Jika tidak ada email:**
- Cek logs di Render dashboard untuk error
- Pastikan semua environment variables sudah benar
- Untuk development, OTP akan muncul di console (jika `NODE_ENV=development`)

## ⚠️ Troubleshooting

### Email tidak terkirim dari Render

1. **Cek logs Render**: Buka "Logs" tab di Render dashboard
2. **Cek environment variables**: Pastikan semua sudah di-set dengan benar
3. **Gmail App Password**: Pastikan menggunakan App Password, bukan password biasa
4. **2-Step Verification**: Harus aktif untuk Gmail App Password

### Error: Authentication failed

- Gmail: Pastikan menggunakan App Password (bukan password biasa)
- SMTP: Pastikan username dan password benar
- Pastikan account tidak diblokir

### Error: Connection timeout

- Cek apakah SMTP host dan port benar
- Beberapa provider memerlukan port 465 dengan `SMTP_SECURE=true`
- Cek firewall/network restrictions

## 📝 Catatan Penting

1. **Gmail App Password**: 
   - Hanya bekerja jika 2-Step Verification aktif
   - Format: 16 karakter (contoh: `abcd efgh ijkl mnop`)
   - Masukkan di Render tanpa spasi

2. **Production**: 
   - Gunakan email service professional (SendGrid, Mailgun, dll)
   - Gmail memiliki limit rate dan bisa di-block jika terlalu banyak email

3. **Security**:
   - Jangan commit App Password ke Git
   - Hanya set di Render Environment Variables
   - Gunakan different password untuk production dan development

## 🔗 Referensi

- [Gmail App Password Setup](https://support.google.com/accounts/answer/185833)
- [SendGrid Setup](https://sendgrid.com/docs/for-developers/sending-email/getting-started-smtp/)
- [Mailgun Setup](https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp)
- [Resend Setup](https://resend.com/docs/send-with-smtp)

