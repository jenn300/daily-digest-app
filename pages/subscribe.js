const { Resend } = require('resend');

const resend = new Resend('re_JmnxJ4ND_2LjUQneV5d5bhFZiHmSKVDvR');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }

  try {
    const response = await fetch('https://daily-digest-app-7h8v.vercel.app/api/send-digest');
    const { headlines } = await response.json();

    const html = `
      <div style="font-family:sans-serif; padding:16px;">
        <h2>📰 Welcome! Here are today's headlines:</h2>
        <ul>
          ${headlines
            .map(
              (item) => `
              <li style="margin-bottom:12px;">
                <strong>${item.topic.toUpperCase()}</strong> — 
                <a href="${item.link}" target="_blank">${item.title}</a>
                <br/><small>${item.summary}</small>
              </li>`
            )
            .join('')}
        </ul>
      </div>
    `;

    await resend.emails.send({
      from: 'Daily Digest <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to the Daily Digest!',
      html
    });

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Error subscribing user:', err);
    return res.status(500).json({ status: 'error', message: 'Could not send email' });
  }
}
