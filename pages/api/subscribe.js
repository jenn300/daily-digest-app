import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }

  try {
    console.log("📥 Subscribing:", email);

    // 1. Save to Google Sheet
    await fetch("https://script.google.com/macros/s/AKfycbwBE6koiz40HzKTBSQDRdyoD_G-5B97dHDSa_fwrGhjRGSfk5hcjQuwU5nYmnN5_dD7PA/exec", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    // 2. Get latest headlines
    const response = await fetch('https://daily-digest-app-7h8v.vercel.app/api/send-digest');
    const { headlines } = await response.json();

    const html = `
      <div style="font-family:sans-serif; padding:16px;">
        <h2>📰 Welcome! Here are today's headlines:</h2>
        <ul>
          ${headlines.map(item => `
            <li style="margin-bottom:12px;">
              <strong>${item.topic.toUpperCase()}</strong> — 
              <a href="${item.link}" target="_blank">${item.title}</a>
              <br/><small>${item.summary}</small>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    // 3. Send welcome email via Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
  user: process.env.BREVO_SMTP_USER,
  pass: process.env.BREVO_SMTP_PASS
}

    });

    await transporter.sendMail({
      from: '"Daily Digest" <${process.env.BREVO_SMTP_USER}>',
      to: email,
      subject: 'Welcome to the Daily Digest!',
      html
    });

    console.log("✅ Email sent to:", email);
    return res.status(200).json({ status: 'ok' });

  } catch (err) {
    console.error("❌ Error in /api/subscribe:", err);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}
