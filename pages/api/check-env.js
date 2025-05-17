// pages/api/check-env.js
export default function handler(req, res) {
    res.status(200).json({
      BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST,
      BREVO_SMTP_PORT: process.env.BREVO_SMTP_PORT,
      BREVO_SMTP_USER: process.env.BREVO_SMTP_USER ? '✅ Set' : '❌ Not Set',
      BREVO_SMTP_PASS: process.env.BREVO_SMTP_PASS ? '✅ Set' : '❌ Not Set',
    });
  }