// pages/api/check-env.js
export default function handler(req, res) {
    res.status(200).json({ smtpHost: process.env.BREVO_SMTP_HOST });
  }
  