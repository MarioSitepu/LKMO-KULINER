# Email Setup untuk Reset Password

Panduan untuk mengkonfigurasi email service agar fitur reset password dapat mengirim OTP via email.

## Opsi 1: Gmail (Recommended untuk Development)

### Menggunakan Gmail App Password

1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Aktifkan **2-Step Verification** jika belum
3. Buat **App Password**:
   - Buka [App Passwords](https://myaccount.google.com/apppasswords)
   - Pilih "Mail" dan "Other (Custom name)"
   - Masukkan nama: "LKMO Backend"
   - Copy password 16 karakter yang di-generate (tanpa spasi)

4. Tambahkan ke `.env` atau Render Environment:
```env
EMAIL_USER=yangpentingmakan0@gmail.com
EMAIL_PASS=<APP_PASSWORD_16_DIGIT>
EMAIL_FROM=yangpentingmakan0@gmail.com
```

### Menggunakan SMTP Gmail (Recommended untuk Render)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=yangpentingmakan0@gmail.com
SMTP_PASS=<APP_PASSWORD_16_DIGIT>
EMAIL_FROM=yangpentingmakan0@gmail.com

# Optional fallback untuk development
EMAIL_USER=yangpentingmakan0@gmail.com
EMAIL_PASS=<APP_PASSWORD_16_DIGIT>
```

Setelah menambahkan variabel di Render:
- Klik **Save Changes**, lalu **Restart** service backend.
- Jika Gmail mengirim email keamanan "blocked sign-in", buka email tersebut dan pilih **Yes, it was me**.

## Opsi 2: SMTP Server Lain

Jika menggunakan SMTP server lain (misalnya SendGrid, Mailgun, dll):

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
```

## Opsi 3: Development Mode (Tanpa Email)

Untuk development, jika tidak ingin setup email, sistem akan menampilkan OTP di console:

```env
NODE_ENV=development
```

OTP akan ditampilkan di console backend saat request OTP.

## Testing

Setelah setup, test dengan:
1. Buka aplikasi web
2. Klik "Lupa password?" di halaman login
3. Masukkan email
4. Cek email inbox atau console backend (development mode)

## Troubleshooting

### Email tidak terkirim

1. **Cek SMTP credentials**: Pastikan username dan password benar
2. **Cek firewall**: Pastikan port 587 atau 465 tidak diblokir
3. **Gmail App Password**: Pastikan menggunakan App Password, bukan password biasa
4. **Development mode**: Cek console backend untuk melihat OTP

### Error: Authentication failed

- Pastikan menggunakan App Password untuk Gmail
- Pastikan 2-Step Verification sudah aktif
- Cek apakah account diblokir atau suspended

### Error: Connection timeout

- Cek koneksi internet
- Pastikan SMTP host dan port benar
- Coba gunakan port 465 dengan SMTP_SECURE=true

## Environment Variables

Tambahkan ke file `.env`:

```env
# Email Configuration
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_FROM=noreply@example.com

# Atau gunakan SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Production

Untuk production, gunakan email service professional seperti:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Pay as you go)
- **Resend** (Free tier: 3,000 emails/month)

Contoh konfigurasi SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

