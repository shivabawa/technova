import React, { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = email.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) {
      setStatus({
        type: 'ok',
        message: 'Subscribed. Your first email arrives this week.'
      });
      setEmail('');
    } else {
      setStatus({
        type: 'err',
        message: 'Enter a valid email, like you@example.com.'
      });
    }
  };

  return (
    <section className="section" id="newsletter">
      <div className="wrap">
        <div className="news">
          <div>
            <h2>Get launch alerts and first access to deals</h2>
            <p>One email a week. Unsubscribe in one click.</p>
          </div>
          <form id="newsForm" onSubmit={handleSubmit} noValidate>
            <label className="sr" htmlFor="newsEmail">
              Email address
            </label>
            <input
              id="newsEmail"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
            {status.message && (
              <p className={`form-msg ${status.type}`} role="status">
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
