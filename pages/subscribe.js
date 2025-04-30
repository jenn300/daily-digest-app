import { useState } from 'react';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    setStatus(data.status);
    setEmail('');
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 40 }}>
      <h1>📩 Subscribe to the Daily Digest</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ padding: 10, fontSize: 16, width: 300 }}
        />
        <button type="submit" style={{ marginLeft: 10, padding: 10, fontSize: 16 }}>
          Subscribe
        </button>
      </form>
      {status === 'ok' && <p style={{ color: 'green' }}>You're subscribed!</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Something went wrong.</p>}
    </div>
  );
}
