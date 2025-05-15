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

    // 3. Build HTML email with unsubscribe link
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333333;">👋 Welcome to Daily Digest</h2>
        <p style="font-size: 16px; color: #555555;">
          Thanks for subscribing! You'll now receive a daily summary of the top stories curated just for you.
        </p>
        <h3>Today's Headlines:</h3>
        <ul>
          ${headlines.map(item => `
            <li style="margin-bottom:12px;">
              <strong>${item.topic.toUpperCase()}</strong> — 
              <a href="${item.link}" target="_blank">${item.title}</a>
              <br/><small>${item.summary}</small>
            </li>
          `).join('')}
        </ul>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 14px; color: #999999; margin-top: 20px;">
          If you didn’t subscribe or want to unsubscribe, you can do so 
          <a href="https://daily-digest-app-7h8v.vercel.app/unsubscribe?email=${encodeURIComponent(email)}" style="color: #1a73e8;">here</a>.
        </p>
      </div>
    `;

    // 4. Setup SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: parseInt(process.env.BREVO_SMTP_PORT),
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
      }
    });

    // 5. Send welcome email
    const info = await transporter.sendMail({
      from: `Daily Digest <${process.env.BREVO_SMTP_USER}>`,
      to: email,
      subject: 'Welcome to the Daily Digest!',
      html
    });

    console.log("📬 Brevo sendMail() response:", info);

    return res.status(200).json({ status: 'ok' });

  } catch (err) {
    console.error("❌ Error in /api/subscribe:", err);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}
