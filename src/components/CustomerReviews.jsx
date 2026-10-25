import React from 'react';

const REVIEWS = [
  {
    id: 1,
    stars: '★★★★★',
    text: 'The laptop arrived a day early, sealed and with the invoice inside. Setup took ten minutes.',
    author: 'Arjun M.',
    location: 'Bengaluru · Tata Titan Book 14',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    initial: 'A'
  },
  {
    id: 2,
    stars: '★★★★★',
    text: 'I asked support to compare two headphones. They gave a straight answer, not a sales pitch.',
    author: 'Priya S.',
    location: 'Chandigarh · boAt Nirvana ANC',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    initial: 'P'
  },
  {
    id: 3,
    stars: '★★★★☆',
    text: "Returned a monitor that wasn't right for my desk. Refund landed in three days, no argument.",
    author: 'Rohan K.',
    location: 'Pune · Zebronics Curved Arc 27',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    initial: 'R'
  }
];

export function CustomerReviews() {
  return (
    <section className="section" id="reviews">
      <div className="wrap">
        <div className="section-head">
          <h2>What customers say</h2>
          <p>Based on 12,400+ verified orders.</p>
        </div>
        <div className="reviews">
          {REVIEWS.map((rev) => (
            <figure key={rev.id}>
              <div className="stars" aria-label="Rating">
                {rev.stars}
              </div>
              <blockquote>{rev.text}</blockquote>
              <figcaption>
                <span className="avatar">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {rev.initial}
                </span>
                <span>
                  <strong>{rev.author}</strong>
                  {rev.location}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
