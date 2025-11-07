import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const hasResend = Boolean(process.env.RESEND_API_KEY && (process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM));
const resendClient = hasResend ? new Resend(process.env.RESEND_API_KEY) : null;

const getDefaultFromEmail = () =>
  process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_USER || 'noreply@lkmo.com';

// Create transporter
const createTransporter = () => {
  // Use SMTP from environment or use Gmail
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Fallback to Gmail OAuth or App Password
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || process.env.GMAIL_USER,
        pass: process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD
      }
    });
  }
};

const sendWithResend = async ({ to, subject, html, text }) => {
  if (!resendClient) {
    throw new Error('Resend client is not configured');
  }

  const from = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
  if (!from) {
    throw new Error('RESEND_FROM_EMAIL belum di-set');
  }

  const result = await resendClient.emails.send({
    from,
    to,
    subject,
    html,
    text,
    reply_to: process.env.RESEND_REPLY_TO || undefined
  });

  console.log('Email sent via Resend:', result.id);
  return { success: true, messageId: result.id, provider: 'resend' };
};

const sendWithNodemailer = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: getDefaultFromEmail(),
    to,
    subject,
    html,
    text
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent via Nodemailer:', info.messageId);
  return { success: true, messageId: info.messageId, provider: 'smtp' };
};

const sendEmail = async (payload) => {
  console.log(
    `[Email] Preparing to send via ${resendClient ? 'Resend' : 'SMTP'} to ${payload.to} | subject: ${payload.subject}`
  );
  if (resendClient) {
    return sendWithResend(payload);
  }

  return sendWithNodemailer(payload);
};

export const sendOTPEmail = async (email, otpCode) => {
  try {
    const mailOptions = {
      to: email,
      subject: 'Reset Password - Kode OTP',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f0fdf4; padding: 32px 16px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 45px -20px rgba(34,197,94,0.4);">
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 28px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.08em; text-transform: uppercase;">YangPentingMakan</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 12px 0 0; font-size: 14px;">Tempatnya Resep Makanan Praktis ala Anak Kos!</p>
            </div>

            <div style="padding: 36px 32px;">
              <h2 style="color: #166534; margin: 0 0 12px; font-size: 22px;">Reset Password</h2>
              <p style="color: #475569; line-height: 1.7; margin: 0 0 24px;">
                Halo! Kami menerima permintaan reset password untuk akun Anda. Masukkan kode OTP berikut pada halaman YangPentingMakan untuk melanjutkan proses reset.
              </p>

              <div style="background-color: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 14px; padding: 28px; text-align: center;">
                <p style="color: #16a34a; font-size: 14px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 12px;">Kode OTP Anda</p>
                <h1 style="color: #15803d; font-size: 42px; letter-spacing: 0.35em; margin: 0; font-family: 'Courier New', Courier, monospace;">${otpCode}</h1>
              </div>

              <ul style="color: #475569; line-height: 1.8; margin: 28px 0 0; padding: 0 0 0 18px;">
                <li style="margin-bottom: 8px;">Kode berlaku selama <strong>5 menit</strong> sejak email ini dikirim.</li>
                <li style="margin-bottom: 8px;">Demi keamanan, jangan bagikan kode ini kepada siapa pun.</li>
                <li style="margin-bottom: 8px;">Jika Anda tidak merasa meminta reset password, Anda bisa mengabaikan email ini.</li>
              </ul>
            </div>

            <div style="background-color: #f8fafc; padding: 28px; text-align: center;">
              <p style="color: #64748b; font-size: 13px; margin: 0;">
                Butuh bantuan? Balas email ini atau hubungi tim kami melalui aplikasi.
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 12px 0 0;">
                © ${new Date().getFullYear()} YangPentingMakan. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Reset Password - YangPentingMakan
        
        Kode OTP Anda: ${otpCode}
        
        Kode ini berlaku selama 5 menit.
        
        Jika Anda tidak meminta reset password, abaikan email ini.
      `
    };

    const result = await sendEmail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    // In development, log the OTP instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] OTP for ${email}: ${otpCode}`);
      return { success: true, devMode: true };
    }
    throw error;
  }
};

// Helper function to validate email format and domain
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Check if email domain is not a placeholder/test domain
  const invalidDomains = ['lkmo.com', 'example.com', 'test.com', 'localhost'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain || invalidDomains.includes(domain)) {
    console.warn(`[Email Validation] Skipping invalid email domain: ${email}`);
    return false;
  }
  
  return true;
};

export const sendPasswordResetNotification = async (adminEmail, userEmail, userName) => {
  // Validate admin email before attempting to send
  if (!isValidEmail(adminEmail)) {
    console.warn(`[Admin Notification] Skipping invalid admin email: ${adminEmail}`);
    return { success: false, error: 'Invalid admin email address', skipped: true };
  }

  try {
    const mailOptions = {
      to: adminEmail,
      subject: 'Notifikasi: User Reset Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Admin Notification</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333;">User Reset Password</h2>
            <p style="color: #666; line-height: 1.6;">
              User berikut telah berhasil mereset password mereka:
            </p>
            <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
              <p style="margin: 5px 0;"><strong>Nama:</strong> ${userName}</p>
              <p style="margin: 5px 0;"><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      `
    };

    await sendEmail(mailOptions);
    console.log(`[Admin Notification] Successfully sent to ${adminEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`[Admin Notification] Error sending to ${adminEmail}:`, error.message);
    // Don't throw error for admin notification - it's not critical
    return { success: false, error: error.message };
  }
};

