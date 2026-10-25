import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATS, BRANDS, MAX_PRICE, catLabel, money, off } from '../data/products';
import { ProductCard } from './ProductCard';

export function ShopSection() {
  const {
    selectedCat,
    setSelectedCat,
    selectedBrands,
    toggleBrand,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    saleOnly,
    setSaleOnly,
    searchQuery,
    sortBy,
    setSortBy,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    resetFilters
  } = useStore();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = PRODUCTS.filter((p) => {
      const matchCat = selectedCat === 'all' || p.cat === selectedCat;
      const matchBrand = !selectedBrands.size || selectedBrands.has(p.brand);
      const matchPrice = p.price <= maxPrice;
      const matchRating = p.rating >= minRating;
      const matchSale = !saleOnly || off(p) >= 12;
      const matchQuery =
        !q ||
        `${p.name} ${p.brand} ${catLabel(p.cat)} ${p.desc}`.toLowerCase().includes(q);

      return matchCat && matchBrand && matchPrice && matchRating && matchSale && matchQuery;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => off(b) - off(a));
    }

    return list;
  }, [selectedCat, selectedBrands, maxPrice, minRating, saleOnly, searchQuery, sortBy]);

  const catName = selectedCat === 'all' ? 'all categories' : catLabel(selectedCat);
  const resultText = `${filteredProducts.length} ${
    filteredProducts.length === 1 ? 'product' : 'products'
  } in ${catName}${searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ''}`;

  return (
    <section className="section" id="shop">
      <div className="wrap">
        <div className="section-head">
          <h2>All products</h2>
          <p id="resultCount" aria-live="polite">
            {resultText}
          </p>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          {/* Category Chips */}
          <div className="chips" role="group" aria-label="Filter by category">
            <button
              className="chip"
              type="button"
              aria-pressed={selectedCat === 'all'}
              onClick={() => setSelectedCat('all')}
            >
              All
            </button>
            {CATS.map((c) => (
              <button
                key={c.id}
                className="chip"
                type="button"
                aria-pressed={selectedCat === c.id}
                onClick={() => setSelectedCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Right Toolbar Tools */}
          <div className="tools-right">
            <button
              className="btn btn-ghost filter-toggle"
              type="button"
              aria-expanded={isMobileFiltersOpen}
              aria-controls="filters"
              onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filters
            </button>

            <label className="select">
              <span className="sr">Sort products</span>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
                <option value="discount">Biggest discount</option>
              </select>
            </label>
          </div>
        </div>

        {/* Shop Layout: Sidebar + Grid */}
        <div className="shop-layout">
          <aside className={`filters ${isMobileFiltersOpen ? 'open' : ''}`} id="filters" aria-label="Filters">
            {/* Brand Filter */}
            <div className="filter-block">
              <h3>Brand</h3>
              <div className="check-list">
                {BRANDS.map((brand) => {
                  const count = PRODUCTS.filter((p) => p.brand === brand).length;
                  const isChecked = selectedBrands.has(brand);
                  return (
                    <label key={brand}>
                      <input
                        type="checkbox"
                        value={brand}
                        checked={isChecked}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span>{brand}</span>
                      <em>{count}</em>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Maximum Price Slider */}
            <div className="filter-block">
              <h3>Maximum price</h3>
              <input
                type="range"
                min={5000}
                max={MAX_PRICE}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price"
              />
              <div className="range-val">
                <span>₹0</span>
                <strong>{money(maxPrice)}</strong>
              </div>
            </div>

            {/* Rating Radios */}
            <div className="filter-block">
              <h3>Customer rating</h3>
              <div className="radio-list">
                <label>
                  <input
                    type="radio"
                    name="rating"
                    value="0"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                  />
                  <span>Any rating</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="rating"
                    value="4.5"
                    checked={minRating === 4.5}
                    onChange={() => setMinRating(4.5)}
                  />
                  <span>4.5 stars and up</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="rating"
                    value="4.7"
                    checked={minRating === 4.7}
                    onChange={() => setMinRating(4.7)}
                  />
                  <span>4.7 stars and up</span>
                </label>
              </div>
            </div>

            {/* Sale Only Toggle */}
            <div className="filter-block">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                />
                <span className="track"></span>
                <span>On sale only</span>
              </label>
            </div>

            {/* Reset Button */}
            <button className="btn btn-ghost full" type="button" onClick={resetFilters}>
              Reset filters
            </button>
          </aside>

          {/* Product Grid Area */}
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4.5 4.5" />
                </svg>
                <h3>No products match these filters</h3>
                <p>Raise the maximum price, clear a brand, or reset all filters.</p>
                <button className="btn btn-primary" type="button" onClick={resetFilters}>
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
