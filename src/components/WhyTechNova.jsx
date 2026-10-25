import React from 'react';

export function WhyTechNova() {
  return (
    <section className="section" id="why">
      <div className="wrap">
        <div className="section-head">
          <h2>Buy with confidence</h2>
          <p>The boring parts of buying electronics, handled properly.</p>
        </div>
        <div className="why-grid">
          <article>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
              <circle cx="7" cy="18" r="1.6" />
              <circle cx="17" cy="18" r="1.6" />
            </svg>
            <h3>Two-day delivery</h3>
            <p>Tracked from our warehouse to your door. Free on orders over ₹4,999.</p>
          </article>
          <article>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" />
            </svg>
            <h3>30-day returns</h3>
            <p>Changed your mind? Send it back in original condition for a full refund.</p>
          </article>
          <article>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <h3>2-year warranty</h3>
            <p>Every device is covered against defects, not just the ones that cost more.</p>
          </article>
          <article>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
              <rect x="3" y="13" width="4" height="6" rx="2" />
              <rect x="17" y="13" width="4" height="6" rx="2" />
            </svg>
            <h3>Help from people</h3>
            <p>Chat with a product specialist from 8am to 10pm, every day.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
