const { Resend } = require('resend');

const resend = new Resend('re_JmnxJ4ND_2LjUQneV5d5bhFZiHmSKVDvR'); // your actual Resend API key

export default async function handler(req, res) {
  const headlines = [
    {
      topic: "NBA",
      title: "LeBron James scores 42 in clutch win 🏀",
      summary: "James leads Lakers to a 3-1 series lead in the playoffs.",
      link: "https://example.com/lebron-headline"
    },
    {
      topic: "Venture Capital",
      title: "AI startup raises $150M to fight fraud 💰",
      summary: "Series C funding led by Sequoia Capital.",
      link: "https://example.com/vc-headline"
    }
  ];

  const html = `
    <div style="font-family:sans-serif; padding:16px;">
      <h2>📰 Daily Digest – Your Top News</h2>
      <ul>
        ${headlines
          .map(
            (item) => `
            <li style="margin-bottom:12px;">
              <strong>${item.topic}:</strong>
              <a href="${item.link}" target="_blank">${item.title}</a>
              <br/><small>${item.summary}</small>
            </li>
          `
          )
          .join('')}
      </ul>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Daily Digest <onboarding@resend.dev>', // verified sender
      to: 'jennifertsang300@gmail.com', // your email ✅
      subject: 'Your Daily News Digest',
      html
    });

    res.status(200).json({ status: 'Email sent', data });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: error.message });
  }
}
