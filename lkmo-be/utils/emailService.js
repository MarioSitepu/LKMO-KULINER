import nodemailer from 'nodemailer';

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

export const sendOTPEmail = async (email, otpCode) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@lkmo.com',
      to: email,
      subject: 'Reset Password - Kode OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">YangPentingMakan</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333;">Reset Password</h2>
            <p style="color: #666; line-height: 1.6;">
              Anda telah meminta untuk mereset password akun Anda. Gunakan kode OTP berikut untuk melanjutkan:
            </p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <h1 style="color: #f97316; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">
                ${otpCode}
              </h1>
            </div>
            <p style="color: #666; line-height: 1.6;">
              <strong>Kode ini berlaku selama 5 menit.</strong>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Jika Anda tidak meminta reset password, abaikan email ini.
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} YangPentingMakan. All rights reserved.</p>
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
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
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@lkmo.com',
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

    await transporter.sendMail(mailOptions);
    console.log(`[Admin Notification] Successfully sent to ${adminEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`[Admin Notification] Error sending to ${adminEmail}:`, error.message);
    // Don't throw error for admin notification - it's not critical
    return { success: false, error: error.message };
  }
};

