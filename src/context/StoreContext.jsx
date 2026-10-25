import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PRODUCTS, BY_ID, PROMOS, FREE_SHIP, SHIP_FEE, MAX_QTY, MAX_PRICE } from '../data/products';

const StoreContext = createContext(null);

const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('technova.' + key) || localStorage.getItem('nexora.' + key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('technova.' + key, JSON.stringify(value));
    } catch {
      // storage unavailable
    }
  }
};

export function StoreProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = storage.get('theme', null);
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    storage.set('theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F8FAFC' : '#070A12');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      toast(`Switched to ${next} mode`);
      return next;
    });
  }, []);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, actionLabel, onAction) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6);
    const newToast = { id, msg, actionLabel, onAction, exiting: false };
    setToasts(prev => [...prev.slice(-2), newToast]);

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 3600);
  }, []);

  // Wishlist state
  const [wish, setWish] = useState(() => storage.get('wish', []).filter(id => BY_ID[id]));

  useEffect(() => {
    storage.set('wish', wish);
  }, [wish]);

  const toggleWish = useCallback((id) => {
    setWish(prev => {
      const exists = prev.includes(id);
      const name = BY_ID[id]?.name || 'Product';
      if (exists) {
        toast(`Removed from wishlist`);
        return prev.filter(x => x !== id);
      } else {
        toast(`Saved to wishlist`);
        return [...prev, id];
      }
    });
  }, [toast]);

  const isWishlisted = useCallback((id) => wish.includes(id), [wish]);

  // Cart state
  const [cart, setCart] = useState(() => storage.get('cart', []).filter(l => BY_ID[l.id]));
  const [promo, setPromo] = useState(() => storage.get('promo', ''));

  useEffect(() => {
    storage.set('cart', cart);
    storage.set('promo', promo);
  }, [cart, promo]);

  const addToCart = useCallback((id, c = 0, q = 1, openCartDrawer = false) => {
    const prod = BY_ID[id];
    if (!prod) return;

    setCart(prev => {
      const exIndex = prev.findIndex(l => l.id === id && l.c === c);
      if (exIndex > -1) {
        const copy = [...prev];
        const newQty = copy[exIndex].q + q;
        if (newQty > MAX_QTY) {
          toast(`Limit of ${MAX_QTY} per product`);
          copy[exIndex] = { ...copy[exIndex], q: MAX_QTY };
        } else {
          toast(`${prod.name} added`, 'View cart', () => setIsCartOpen(true));
          copy[exIndex] = { ...copy[exIndex], q: newQty };
        }
        return copy;
      } else {
        toast(`${prod.name} added`, 'View cart', () => setIsCartOpen(true));
        return [...prev, { id, c, q: Math.min(q, MAX_QTY) }];
      }
    });

    if (openCartDrawer) {
      setIsCartOpen(true);
    }
  }, [toast]);

  const updateCartQty = useCallback((lineKey, delta) => {
    setCart(prev => {
      return prev.map(l => {
        const k = `${l.id}:${l.c}`;
        if (k !== lineKey) return l;
        const newQ = l.q + delta;
        if (newQ > MAX_QTY) {
          toast(`Limit of ${MAX_QTY} per product`);
          return l;
        }
        return newQ > 0 ? { ...l, q: newQ } : l;
      });
    });
  }, [toast]);

  const removeFromCart = useCallback((lineKey) => {
    setCart(prev => {
      const target = prev.find(l => `${l.id}:${l.c}` === lineKey);
      if (!target) return prev;
      const prod = BY_ID[target.id];
      const copyTarget = { ...target };
      toast(`${prod?.name || 'Item'} removed`, 'Undo', () => {
        setCart(current => [...current, copyTarget]);
      });
      return prev.filter(l => `${l.id}:${l.c}` !== lineKey);
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromo('');
  }, []);

  const applyPromo = useCallback((code) => {
    const clean = code.trim().toUpperCase();
    if (PROMOS[clean]) {
      setPromo(clean);
      toast(`Promo ${clean} applied!`);
      return { success: true, message: `${clean} applied: ${Math.round(PROMOS[clean] * 100)}% off` };
    }
    return { success: false, message: clean ? "That code isn't valid. Check the spelling and try again." : 'Enter a promo code first.' };
  }, [toast]);

  const cartTotals = useMemo(() => {
    const sub = cart.reduce((s, l) => s + (BY_ID[l.id]?.price || 0) * l.q, 0);
    const rate = PROMOS[promo] || 0;
    const disc = Math.round(sub * rate);
    const ship = !cart.length || sub - disc >= FREE_SHIP ? 0 : SHIP_FEE;
    return {
      sub,
      disc,
      ship,
      total: sub - disc + ship,
      rate,
      itemCount: cart.reduce((s, l) => s + l.q, 0)
    };
  }, [cart, promo]);

  // User auth state
  const [user, setUser] = useState(() => storage.get('user', null));

  useEffect(() => {
    storage.set('user', user);
  }, [user]);

  const login = useCallback((userData) => {
    setUser(userData);
    toast(`Welcome back, ${userData.name}!`);
    setAuthModalTab(null);
  }, [toast]);

  const loginDemo = useCallback(() => {
    const demoUser = {
      name: 'Shiva Sharma',
      email: 'shiva@technova.in',
      phone: '9876543210',
      joined: '2026',
      role: 'Verified Member'
    };
    setUser(demoUser);
    toast('Welcome back, Shiva!');
    setAuthModalTab(null);
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
    toast('You have been signed out.');
  }, [toast]);

  // Modal / Drawer visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishOpen, setIsWishOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState(null); // 'login' | 'signup' | null

  // Prevent background scroll when modal/drawer is open
  const isAnyModalOpen = isCartOpen || isWishOpen || !!quickViewProduct || isCheckoutOpen || !!authModalTab;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add('locked');
    } else {
      document.body.classList.remove('locked');
    }
  }, [isAnyModalOpen]);

  // Shop filters state
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState(0);
  const [saleOnly, setSaleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleBrand = useCallback((brand) => {
    setSelectedBrands(prev => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCat('all');
    setSelectedBrands(new Set());
    setMaxPrice(MAX_PRICE);
    setMinRating(0);
    setSaleOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  }, []);

  const value = {
    theme,
    toggleTheme,
    toasts,
    toast,
    wish,
    toggleWish,
    isWishlisted,
    cart,
    promo,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    applyPromo,
    cartTotals,
    user,
    login,
    loginDemo,
    logout,
    isCartOpen,
    setIsCartOpen,
    isWishOpen,
    setIsWishOpen,
    quickViewProduct,
    setQuickViewProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    authModalTab,
    setAuthModalTab,
    isAnyModalOpen,
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
    setSearchQuery,
    sortBy,
    setSortBy,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    resetFilters
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
