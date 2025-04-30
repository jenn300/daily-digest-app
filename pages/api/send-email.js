const { Resend } = require('resend');

const resend = new Resend('re_JmnxJ4ND_2LjUQneV5d5bhFZiHmSKVDvR');

export default async function handler(req, res) {
  try {
    const response = await fetch("https://daily-digest-app-7h8v.vercel.app/api/send-digest");
    const { headlines } = await response.json();

    const html = `
      <div style="font-family:sans-serif; padding:16px;">
        <h2>📰 Daily Digest – Your Top 10 Headlines</h2>
        <ul>
          ${headlines
            .map(
              (item) => `
              <li style="margin-bottom:12px;">
                <strong>${item.topic.toUpperCase()}</strong> — 
                <a href="${item.link}" target="_blank">${item.title}</a>
                <br/><small>${item.summary}</small><br/>
                <em style="font-size:12px; color:#888;">Source: ${item.source}</em>
              </li>
            `
            )
            .join('')}
        </ul>
      </div>
    `;

    const email = await resend.emails.send({
      from: 'Daily Digest <onboarding@resend.dev>',
      to: 'jennifertsang300@gmail.com',
      subject: 'Your Daily News Digest – Top 10 Headlines',
      html
    });

    res.status(200).json({ status: 'Email sent', data: email });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: error.message });
  }
}
