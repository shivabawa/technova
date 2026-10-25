import React from 'react';
import { CATS } from '../data/products';
import { useStore } from '../context/StoreContext';

export function Footer() {
  const { setSelectedCat, setSearchQuery, user, setAuthModalTab, setIsWishOpen } = useStore();

  const handleCategoryClick = (catId) => {
    setSelectedCat(catId);
    setSearchQuery('');
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccountClick = () => {
    if (user) {
      setIsWishOpen(true);
    } else {
      setAuthModalTab('login');
    }
  };

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        {/* Brand Column */}
        <div>
          <a className="logo" href="#top" aria-label="TechNova home">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="url(#lg)" />
              <path
                d="M8 10h16M16 10v14"
                fill="none"
                stroke="var(--bg)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>TechNova</span>
          </a>
          <p className="foot-note">The Future of Technology, Delivered.</p>
        </div>

        {/* Shop Categories Column */}
        <div>
          <h3>Shop</h3>
          <ul id="footCats">
            {CATS.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => handleCategoryClick(c.id)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3>Support</h3>
          <ul>
            <li>
              <a href="#why">Delivery</a>
            </li>
            <li>
              <a href="#why">Returns</a>
            </li>
            <li>
              <a href="#why">Warranty</a>
            </li>
            <li>
              <a href="#newsletter">Contact us</a>
            </li>
            <li>
              <button
                className="foot-auth-link"
                type="button"
                onClick={handleAccountClick}
              >
                {user ? `My Account (${(user.name || '').split(' ')[0]})` : 'Account / Sign In'}
              </button>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h3>Company</h3>
          <ul>
            <li>
              <a href="#reviews">Reviews</a>
            </li>
            <li>
              <a href="#deal">Today's deal</a>
            </li>
            <li>
              <a href="#top">Back to top</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap legal">
        <span>© 2026 TechNova. Built with React & Vite. Demo storefront: products, brands and orders are fictional.</span>
      </div>
    </footer>
  );
}
