import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, catLabel, money } from '../data/products';
import { ProductImage } from './ProductArt';

export function Header() {
  const {
    theme,
    toggleTheme,
    wish,
    cart,
    cartTotals,
    user,
    logout,
    loginDemo,
    setIsCartOpen,
    setIsWishOpen,
    setQuickViewProduct,
    setAuthModalTab,
    searchQuery,
    setSearchQuery,
    setSelectedCat
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [isSuggestVisible, setIsSuggestVisible] = useState(false);
  const [selectedSuggestIndex, setSelectedSuggestIndex] = useState(-1);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);

  // Scroll detection for header blur shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        setIsSuggestVisible(true);
      }
      if (e.key === 'Escape') {
        setIsSuggestVisible(false);
        setIsUserMenuOpen(false);
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSuggestVisible(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active section observer
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = ['shop', 'categories', 'deal', 'why', 'reviews'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Matching products for search suggestions
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) =>
      `${p.name} ${p.brand} ${catLabel(p.cat)}`.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSuggestVisible(true);
    setSelectedSuggestIndex(-1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!searchResults.length) return;
      setSelectedSuggestIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!searchResults.length) return;
      setSelectedSuggestIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestIndex > -1 && searchResults[selectedSuggestIndex]) {
        setQuickViewProduct(searchResults[selectedSuggestIndex]);
        setIsSuggestVisible(false);
      } else {
        setIsSuggestVisible(false);
        const shopSection = document.getElementById('shop');
        if (shopSection) {
          shopSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleSelectProduct = (product) => {
    setQuickViewProduct(product);
    setIsSuggestVisible(false);
  };

  const wishCount = wish.length;
  const cartCount = cartTotals.itemCount;

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`} id="siteHeader">
      <div className="wrap header-row">
        {/* Mobile menu toggle */}
        <button
          className="icon-btn menu-btn"
          id="menuBtn"
          aria-label="Open menu"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Brand Logo */}
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
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="var(--c1)" />
                <stop offset="1" stopColor="var(--c2)" />
              </linearGradient>
            </defs>
          </svg>
          <span>TechNova</span>
        </a>

        {/* Primary Desktop Nav */}
        <nav className={`main-nav ${isMobileNavOpen ? 'open' : ''}`} id="mainNav" aria-label="Primary">
          <a
            href="#shop"
            className={activeSection === 'shop' ? 'active' : ''}
            onClick={() => setIsMobileNavOpen(false)}
          >
            Shop
          </a>
          <a
            href="#categories"
            className={activeSection === 'categories' ? 'active' : ''}
            onClick={() => setIsMobileNavOpen(false)}
          >
            Categories
          </a>
          <a
            href="#deal"
            className={activeSection === 'deal' ? 'active' : ''}
            onClick={() => setIsMobileNavOpen(false)}
          >
            Today's deal
          </a>
          <a
            href="#why"
            className={activeSection === 'why' ? 'active' : ''}
            onClick={() => setIsMobileNavOpen(false)}
          >
            Why TechNova
          </a>
          <a
            href="#reviews"
            className={activeSection === 'reviews' ? 'active' : ''}
            onClick={() => setIsMobileNavOpen(false)}
          >
            Reviews
          </a>

          {/* Mobile Auth Nav section */}
          <div className="nav-auth-mobile">
            {user ? (
              <div className="mobile-user-card">
                <div className="avatar-lg">{(user.name || 'U').charAt(0).toUpperCase()}</div>
                <div className="info">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <button
                  className="btn-logout"
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    logout();
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <div className="auth-mobile-row">
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      setAuthModalTab('login');
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      setAuthModalTab('signup');
                    }}
                  >
                    Sign Up
                  </button>
                </div>
                <button
                  className="auth-demo-btn"
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    loginDemo();
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
                  </svg>
                  Quick Demo Login
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Live Search */}
        <div
          className={`search ${isSearchOpenMobile ? 'open' : ''}`}
          ref={searchContainerRef}
          role="search"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <input
            ref={searchInputRef}
            id="searchInput"
            type="search"
            placeholder="Search phones, laptops, audio…"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSuggestVisible(true)}
            onKeyDown={handleSearchKeyDown}
            autoComplete="off"
            aria-label="Search products"
            aria-expanded={isSuggestVisible && searchResults.length > 0}
          />
          <kbd aria-hidden="true">/</kbd>

          {/* Autocomplete Suggestion Dropdown */}
          {isSuggestVisible && searchQuery.trim().length > 0 && (
            <ul className="suggest" role="listbox">
              {searchResults.length > 0 ? (
                searchResults.map((p, idx) => (
                  <li
                    key={p.id}
                    role="option"
                    aria-selected={idx === selectedSuggestIndex}
                    onClick={() => handleSelectProduct(p)}
                  >
                    <span className="thumb">
                      <ProductImage product={p} className="thumb-img" />
                    </span>
                    <span>
                      <strong>{p.name}</strong>
                      <small>
                        {catLabel(p.cat)} · {money(p.price)}
                      </small>
                    </span>
                  </li>
                ))
              ) : (
                <li className="none" role="option">
                  No products match "{searchQuery}". Try a brand or category.
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Theme switch button */}
          <button
            className="icon-btn theme-btn"
            id="themeBtn"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={toggleTheme}
          >
            <svg className="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Mobile search toggle */}
          <button
            className="icon-btn search-btn"
            id="searchBtn"
            aria-label="Search products"
            onClick={() => {
              setIsSearchOpenMobile((prev) => !prev);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
          </button>

          {/* Wishlist button with count */}
          <button
            className="icon-btn"
            id="wishBtn"
            aria-label={`Open wishlist, ${wishCount} items`}
            onClick={() => setIsWishOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
            {wishCount > 0 && <span className="count">{wishCount}</span>}
          </button>

          {/* Cart button with count */}
          <button
            className="icon-btn"
            id="cartBtn"
            aria-label={`Open cart, ${cartCount} items`}
            onClick={() => setIsCartOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2.5l2 11h10l2-8H7" />
              <circle cx="9" cy="19.5" r="1.3" />
              <circle cx="17" cy="19.5" r="1.3" />
            </svg>
            {cartCount > 0 && <span className="count bump">{cartCount}</span>}
          </button>

          {/* User Auth Section */}
          <div className="auth-bar" ref={userMenuRef}>
            {user ? (
              <div className="auth-logged-in">
                <div className="user-pill-wrap">
                  <button
                    className="user-pill-btn"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="Account menu"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  >
                    <span className="user-avatar">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </span>
                    <span className="user-name">{(user.name || 'Account').split(' ')[0]}</span>
                    <svg className="chevron-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-menu-dropdown" role="menu">
                      <div className="user-dropdown-info">
                        <span className="user-badge-role">VERIFIED MEMBER</span>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-link"
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsWishOpen(true);
                        }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                        </svg>
                        <span>My Wishlist</span>
                        <span className="dropdown-badge">{wishCount}</span>
                      </button>
                      <button
                        className="dropdown-link"
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsCartOpen(true);
                        }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 4h2.5l2 11h10l2-8H7" />
                          <circle cx="9" cy="19.5" r="1.3" />
                          <circle cx="17" cy="19.5" r="1.3" />
                        </svg>
                        <span>My Cart</span>
                        <span className="dropdown-badge">{cartCount}</span>
                      </button>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-link logout"
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="auth-logged-out">
                <button
                  className="btn btn-ghost btn-sm auth-btn-login"
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                >
                  Log In
                </button>
                <button
                  className="btn btn-primary btn-sm auth-btn-signup"
                  type="button"
                  onClick={() => setAuthModalTab('signup')}
                >
                  Sign Up
                </button>
                <button
                  className="icon-btn auth-mobile-icon-btn"
                  aria-label="Account / Sign in"
                  title="Sign In"
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Promotional Announcement */}
      <div className="promo-bar">
        Free delivery on orders ₹99 and above · Use code <strong>TECHNOVA10</strong> for 10% off your first order
      </div>
    </header>
  );
}
