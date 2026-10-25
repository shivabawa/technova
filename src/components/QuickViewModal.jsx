import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { money, stars, off, catLabel, MAX_QTY } from '../data/products';
import { ProductImage } from './ProductArt';

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWish, isWishlisted } = useStore();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const p = quickViewProduct;
  const discount = off(p);
  const isLowStock = p.stock <= 8;
  const wished = isWishlisted(p.id);
  const currentColor = p.colors[selectedColorIdx] || p.colors[0];

  const handleClose = () => {
    setQuickViewProduct(null);
    setSelectedColorIdx(0);
    setQuantity(1);
  };

  const handleAdd = () => {
    addToCart(p.id, selectedColorIdx, quantity, true);
    handleClose();
  };

  return (
    <div
      className="modal show"
      id="quickModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qvName"
      onClick={(e) => {
        if (e.target.id === 'quickModal') handleClose();
      }}
    >
      <div className="modal-card qv">
        <button
          className="icon-btn modal-close"
          type="button"
          aria-label="Close product details"
          onClick={handleClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="qv-media">
          <ProductImage
            product={p}
            className="qv-img"
            alt={`${p.name} - ${currentColor.n}`}
            fallbackHue={currentColor.h}
          />
        </div>

        <div className="qv-info">
          <span className="brand">
            {p.brand} · {catLabel(p.cat)}
          </span>
          <h2 id="qvName">{p.name}</h2>

          <div className="rating">
            <span className="stars" aria-hidden="true">
              {stars(p.rating)}
            </span>
            <span>
              {p.rating} from {p.reviews.toLocaleString('en-IN')} reviews
            </span>
          </div>

          <p className="desc">{p.desc}</p>

          <div className="price-row">
            <span className="price">{money(p.price)}</span>
            {discount > 0 && (
              <>
                <span className="was">{money(p.old)}</span>
                <span className="off">Save {money(p.old - p.price)}</span>
              </>
            )}
          </div>

          {/* Color Swatches */}
          <div className="swatches" role="radiogroup" aria-label="Color">
            <span className="label">
              Color: <strong>{currentColor.n}</strong>
            </span>
            {p.colors.map((c, idx) => (
              <button
                key={c.n}
                className="swatch"
                role="radio"
                aria-checked={idx === selectedColorIdx}
                aria-label={c.n}
                type="button"
                style={{ background: `hsl(${c.h} 75% 55%)` }}
                onClick={() => setSelectedColorIdx(idx)}
              ></button>
            ))}
          </div>

          {/* Technical Specs List */}
          <div className="spec-list">
            {p.specs.map((s, idx) => (
              <div key={idx}>
                <span>{s[0]}</span>
                {s[1]}
              </div>
            ))}
          </div>

          {/* Stock Availability */}
          <div className={`stock ${isLowStock ? 'low' : ''}`}>
            {isLowStock ? `Only ${p.stock} left in stock` : 'In stock, ships within 24 hours'}
          </div>

          {/* Actions: Quantity, Add to Cart, Wishlist */}
          <div className="qv-actions">
            <div className="qty" aria-label="Quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>
              <output>{quantity}</output>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((prev) => Math.min(MAX_QTY, prev + 1))}
              >
                +
              </button>
            </div>

            <button className="btn btn-primary" type="button" onClick={handleAdd}>
              Add to cart · {money(p.price * quantity)}
            </button>

            <button
              className="wish"
              type="button"
              aria-pressed={wished}
              aria-label={`${wished ? 'Remove from' : 'Add to'} wishlist`}
              onClick={() => toggleWish(p.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
