import React, { useState, useEffect } from 'react';
import { BY_ID, DEAL_ID, money, off } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductArt';

export function TodaysDeal() {
  const { addToCart, setQuickViewProduct } = useStore();
  const product = BY_ID[DEAL_ID];
  const discount = off(product);

  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const diffSec = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));

      const h = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const m = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const s = String(diffSec % 60).padStart(2, '0');

      setTimeLeft({ h, m, s });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section" id="deal">
      <div className="wrap">
        <div className="deal" id="dealBox">
          <div>
            <span className="tag">Today's deal · {discount}% off</span>
            <h2>{product.name}</h2>
            <p className="lead">
              {product.desc} Price drops back to {money(product.old)} when the timer ends.
            </p>

            {/* Countdown timer */}
            <div className="timer" role="timer" aria-label="Time left on today's deal">
              <div>
                <b>{timeLeft.h}</b>
                <span>hours</span>
              </div>
              <div>
                <b>{timeLeft.m}</b>
                <span>minutes</span>
              </div>
              <div>
                <b>{timeLeft.s}</b>
                <span>seconds</span>
              </div>
            </div>

            <div className="deal-price">
              <span className="price">{money(product.price)}</span>
              <span className="was">{money(product.old)}</span>
            </div>

            <div className="deal-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => addToCart(product.id, 0, 1, true)}
              >
                Add to cart
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setQuickViewProduct(product)}
              >
                View details
              </button>
            </div>
          </div>

          <div className="art">
            <ProductImage product={product} className="deal-img" />
          </div>
        </div>
      </div>
    </section>
  );
}
