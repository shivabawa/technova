import React from 'react';
import { CATS, PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { CategoryImage } from './ProductArt';

export function CategoryRail() {
  const { setSelectedCat, setSearchQuery } = useStore();

  const handleSelectCategory = (catId) => {
    setSelectedCat(catId);
    setSearchQuery('');
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section" id="categories">
      <div className="wrap">
        <div className="section-head">
          <h2>Shop by category</h2>
          <p>Nine categories, one standard: every product is tested before it ships.</p>
        </div>
        <div className="cat-rail" id="catRail">
          {CATS.map((c) => {
            const count = PRODUCTS.filter((p) => p.cat === c.id).length;
            return (
              <button
                key={c.id}
                className="cat"
                type="button"
                onClick={() => handleSelectCategory(c.id)}
              >
                <div className="art">
                  <CategoryImage category={c} />
                </div>
                <strong>{c.label}</strong>
                <span>{count} products</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
