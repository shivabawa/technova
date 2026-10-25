import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { money, stars, off, catLabel } from '../data/products';
import { ProductImage } from './ProductArt';

export function ProductCard({ product }) {
  const { toggleWish, isWishlisted, addToCart, setQuickViewProduct } = useStore();
  const [isPopping, setIsPopping] = useState(false);

  const wished = isWishlisted(product.id);
  const discount = off(product);

  const handleWishClick = (e) => {
    e.stopPropagation();
    setIsPopping(true);
    toggleWish(product.id);
    setTimeout(() => setIsPopping(false), 400);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product.id, 0, 1);
  };

  const badgeContent = (() => {
    if (discount >= 15 && product.badge === 'Sale') {
      return <span className="badge sale">-{discount}%</span>;
    }
    if (product.badge) {
      const isSale = /sale|deal/i.test(product.badge);
      return <span className={`badge ${isSale ? 'sale' : ''}`}>{product.badge}</span>;
    }
    return null;
  })();

  return (
    <article className="card" data-id={product.id}>
      <div className="media">
        {badgeContent}

        {/* Wishlist toggle button */}
        <button
          className={`wish ${isPopping ? 'pop' : ''}`}
          type="button"
          aria-pressed={wished}
          aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`}
          onClick={handleWishClick}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </button>

        {/* Product Media triggering Quick View */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          aria-label={`Quick view ${product.name}`}
          style={{ display: 'block', width: '100%', height: '100%', border: 0, padding: 0 }}
        >
          <ProductImage product={product} className="card-img" />
        </button>
      </div>

      <div className="body">
        <span className="brand">
          {product.brand} · {catLabel(product.cat)}
        </span>

        <h3>
          <button type="button" onClick={() => setQuickViewProduct(product)}>
            {product.name}
          </button>
        </h3>

        <div className="rating">
          <span className="stars" aria-hidden="true">
            {stars(product.rating)}
          </span>
          <span>
            {product.rating} ({product.reviews.toLocaleString('en-IN')})
          </span>
        </div>

        <div className="price-row">
          <span className="price">{money(product.price)}</span>
          {discount > 0 && (
            <>
              <span className="was">{money(product.old)}</span>
              <span className="off">{discount}% off</span>
            </>
          )}
        </div>

        <button className="add" type="button" onClick={handleAddToCart}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
