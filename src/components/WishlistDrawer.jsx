import React from 'react';
import { useStore } from '../context/StoreContext';
import { BY_ID, money } from '../data/products';
import { ProductImage } from './ProductArt';

export function WishlistDrawer() {
  const { isWishOpen, setIsWishOpen, wish, toggleWish, addToCart } = useStore();

  if (!isWishOpen) return null;

  return (
    <>
      <div className="overlay show" onClick={() => setIsWishOpen(false)}></div>
      <aside
        className="drawer show"
        id="wishDrawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishTitle"
      >
        <header>
          <h2 id="wishTitle">Wishlist</h2>
          <button
            className="icon-btn"
            type="button"
            aria-label="Close wishlist"
            onClick={() => setIsWishOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="drawer-body">
          {wish.length === 0 ? (
            <div className="drawer-empty">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
              <h3>Your wishlist is empty</h3>
              <p>Tap the heart on any product to save it here.</p>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  setIsWishOpen(false);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse products
              </button>
            </div>
          ) : (
            wish.map((id) => {
              const prod = BY_ID[id];
              if (!prod) return null;
              return (
                <div className="line" key={id}>
                  <div className="thumb">
                    <ProductImage product={prod} className="thumb-img" />
                  </div>
                  <div>
                    <h4>{prod.name}</h4>
                    <small>{prod.brand}</small>
                    <button
                      className="rm"
                      type="button"
                      onClick={() => toggleWish(id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="right">
                    <b>{money(prod.price)}</b>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '8px 14px', fontSize: '14px' }}
                      type="button"
                      onClick={() => addToCart(id, 0, 1)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
