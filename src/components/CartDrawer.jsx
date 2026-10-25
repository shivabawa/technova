import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BY_ID, FREE_SHIP, money } from '../data/products';
import { ProductImage } from './ProductArt';

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    promo,
    applyPromo,
    updateCartQty,
    removeFromCart,
    cartTotals,
    setIsCheckoutOpen
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  if (!isCartOpen) return null;

  const after = cartTotals.sub - cartTotals.disc;
  const leftForFreeShip = FREE_SHIP - after;
  const percentFree = Math.min(100, Math.max(0, (after / FREE_SHIP) * 100));

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const res = applyPromo(promoInput);
    setPromoMessage(res);
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="overlay show" onClick={() => setIsCartOpen(false)}></div>
      <aside
        className="drawer show"
        id="cartDrawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cartTitle"
      >
        <header>
          <h2 id="cartTitle">Your cart</h2>
          <button
            className="icon-btn"
            type="button"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {/* Free Shipping Meter */}
        {cart.length > 0 && (
          <div className="ship-meter">
            {leftForFreeShip > 0 ? (
              <>
                Add <strong>{money(leftForFreeShip)}</strong> more for free delivery
                <div className="bar">
                  <i style={{ width: `${percentFree}%` }}></i>
                </div>
              </>
            ) : (
              <>
                You've unlocked <strong>free delivery</strong>
                <div className="bar">
                  <i style={{ width: '100%' }}></i>
                </div>
              </>
            )}
          </div>
        )}

        {/* Cart Body */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 4h2.5l2 11h10l2-8H7" />
                <circle cx="9" cy="19.5" r="1.3" />
                <circle cx="17" cy="19.5" r="1.3" />
              </svg>
              <h3>Your cart is empty</h3>
              <p>Add a device and it will show up here.</p>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start shopping
              </button>
            </div>
          ) : (
            cart.map((line) => {
              const prod = BY_ID[line.id];
              const lineKey = `${line.id}:${line.c}`;
              const col = prod.colors[line.c] || prod.colors[0];

              return (
                <div className="line" key={lineKey}>
                  <div className="thumb">
                    <ProductImage product={prod} className="thumb-img" />
                  </div>
                  <div>
                    <h4>{prod.name}</h4>
                    <small>{col.n}</small>
                    <div className="qty">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${prod.name}`}
                        onClick={() => {
                          if (line.q <= 1) removeFromCart(lineKey);
                          else updateCartQty(lineKey, -1);
                        }}
                      >
                        −
                      </button>
                      <output>{line.q}</output>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${prod.name}`}
                        onClick={() => updateCartQty(lineKey, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="right">
                    <b>{money(prod.price * line.q)}</b>
                    <button
                      className="rm"
                      type="button"
                      onClick={() => removeFromCart(lineKey)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <footer>
            <form className="promo" onSubmit={handlePromoSubmit}>
              <label className="sr" htmlFor="promoInput">
                Promo code
              </label>
              <input
                id="promoInput"
                placeholder="Promo code (e.g. TECHNOVA10)"
                value={promoInput || promo}
                onChange={(e) => setPromoInput(e.target.value)}
                autoComplete="off"
              />
              <button className="btn btn-ghost" type="submit">
                Apply
              </button>
            </form>

            <p className="promo-msg" role="status">
              {promoMessage ? (
                <span style={{ color: promoMessage.success ? 'var(--ok)' : 'var(--sale)' }}>
                  {promoMessage.message}
                </span>
              ) : promo ? (
                <span style={{ color: 'var(--ok)' }}>
                  {promo} applied: {Math.round((cartTotals.rate || 0.1) * 100)}% off
                </span>
              ) : null}
            </p>

            <div className="sum">
              <span>Subtotal</span>
              <span>{money(cartTotals.sub)}</span>
            </div>

            {cartTotals.disc > 0 && (
              <div className="sum">
                <span>Discount</span>
                <span className="disc">−{money(cartTotals.disc)}</span>
              </div>
            )}

            <div className="sum">
              <span>Delivery</span>
              <span>{cartTotals.ship ? money(cartTotals.ship) : 'Free'}</span>
            </div>

            <div className="sum total">
              <span>Total</span>
              <span>{money(cartTotals.total)}</span>
            </div>

            <button
              className="btn btn-primary full"
              type="button"
              onClick={handleCheckoutClick}
            >
              Checkout
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
