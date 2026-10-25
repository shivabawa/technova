import React, { useState, useEffect, useRef } from 'react';
import { HERO_IDS, BY_ID, CATS, money, off } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductArt';

export function Hero() {
  const { setQuickViewProduct } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const stageRef = useRef(null);
  const autoPlayRef = useRef(null);

  const currentProductId = HERO_IDS[currentIdx];
  const currentProduct = BY_ID[currentProductId];
  const discount = off(currentProduct);

  // Auto-rotate hero stage
  useEffect(() => {
    const startTimer = () => {
      autoPlayRef.current = setInterval(() => {
        handleStageChange((currentIdx + 1) % HERO_IDS.length);
      }, 5500);
    };

    startTimer();
    return () => clearInterval(autoPlayRef.current);
  }, [currentIdx]);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleStageChange = (idx) => {
    setIsSwapping(true);
    setCurrentIdx(idx);
    setTimeout(() => {
      setIsSwapping(false);
    }, 400);
  };

  // Pointer move effect for 3D stage lighting
  const handlePointerMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    stageRef.current.style.setProperty('--mx', `${mx}px`);
    stageRef.current.style.setProperty('--my', `${my}px`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      stopAutoPlay();
      handleStageChange((currentIdx + 1) % HERO_IDS.length);
    } else if (e.key === 'ArrowLeft') {
      stopAutoPlay();
      handleStageChange((currentIdx - 1 + HERO_IDS.length) % HERO_IDS.length);
    }
  };

  return (
    <section className="hero" id="hero">
      {/* Premium Hero Video Background */}
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          id="heroBgVideo"
          className="hero-bg-video playing"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=80"
        >
          <source src="hero-headphones.mp4" type="video/mp4" />
          <source
            src="https://cdn.coverr.co/videos/coverr-close-up-of-a-young-man-putting-on-his-headphones-1437/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-video-badge show">
          <span className="live-dot"></span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
          <span>Spatial Audio 360° Studio Live</span>
        </div>
      </div>

      <div className="wrap hero-grid">
        {/* Left Hero Copy */}
        <div className="hero-copy">
          <h1>
            <span className="l1">The Future of</span>{' '}
            <span className="l2">Technology,</span>{' '}
            <span className="l3">Delivered.</span>
          </h1>
          <p className="hero-sub">
            Phones, laptops, audio and more. Every device is verified, covered by a 2-year warranty
            and at your door in two days.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#shop">
              Shop all devices
            </a>
            <a className="btn btn-ghost" href="#deal">
              See today's deal
            </a>
          </div>
          <ul className="trust">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12l5 5L21 6" />
              </svg>
              2-year warranty
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12l5 5L21 6" />
              </svg>
              30-day returns
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12l5 5L21 6" />
              </svg>
              Secure checkout
            </li>
          </ul>
        </div>

        {/* Right 3D Interactive Stage */}
        <div
          className="stage"
          id="stage"
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onMouseEnter={stopAutoPlay}
          onFocus={stopAutoPlay}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Interactive featured product showcase"
        >
          <div className="stage-glow" aria-hidden="true"></div>
          <div className="stage-ring" aria-hidden="true"></div>

          {/* Current Product Art */}
          <div className={`stage-art ${isSwapping ? 'swap' : ''}`} id="stageArt">
            <ProductImage product={currentProduct} className="stage-img" />
          </div>

          {/* Current Product Info & Action */}
          <div className={`stage-info ${isSwapping ? 'swap' : ''}`} id="stageInfo">
            <div>
              <h3>{currentProduct.name}</h3>
              <div className="specs">
                {currentProduct.specs.slice(0, 3).map((s, idx) => (
                  <span key={idx}>{s[1]}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="price">
                {money(currentProduct.price)}
                {discount > 0 && <small>{money(currentProduct.old)}</small>}
              </div>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setQuickViewProduct(currentProduct)}
              >
                View details
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="stage-tabs" role="tablist" aria-label="Featured devices">
            {HERO_IDS.map((id, n) => {
              const prod = BY_ID[id];
              const tabLabel = CATS.find((c) => c.id === prod.cat)?.tab || 'Device';
              const isSelected = n === currentIdx;
              return (
                <button
                  key={id}
                  role="tab"
                  id={`st${n}`}
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => {
                    stopAutoPlay();
                    handleStageChange(n);
                  }}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
