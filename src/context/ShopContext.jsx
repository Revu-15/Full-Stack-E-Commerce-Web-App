import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api.js';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('nexcart_theme') || 'light');

  // ── Auth State ────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@nexcart.com';

  // ── Cart & Save For Later ──────────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_saved_later');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Wishlist State ────────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Recently Viewed Products ─────────────────────────────────────────────
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Search History ────────────────────────────────────────────────────────
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_search_history');
      return saved ? JSON.parse(saved) : ['iPhone 15 Pro', 'MacBook Pro M3', 'Nike Air Jordan', 'Sony Headphones', 'Dyson Airwrap'];
    } catch {
      return [];
    }
  });

  // ── Coupon State ─────────────────────────────────────────────────────────
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ── Modals & Drawers ──────────────────────────────────────────────────────
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [activeProductModal, setActiveProductModal] = useState(null);

  // ── Search & Filter State ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // ── Categories List ───────────────────────────────────────────────────────
  const [categoriesList, setCategoriesList] = useState([]);

  // ── Toast Alerts ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  // ── Sync Theme ────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexcart_theme', theme);
  }, [theme]);

  // ── Sync localStorage ──────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('nexcart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nexcart_saved_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    localStorage.setItem('nexcart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nexcart_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('nexcart_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexcart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexcart_user');
    }
  }, [user]);

  // ── Load categories on mount ──────────────────────────────────────────────
  useEffect(() => {
    const loadCats = async () => {
      try {
        const cats = await api.fetchCategories();
        if (Array.isArray(cats)) setCategoriesList(cats);
      } catch (err) {
        console.warn('Could not load categories:', err);
      }
    };
    loadCats();
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  // ── Recently Viewed Tracker ───────────────────────────────────────────────
  const trackRecentlyViewed = product => {
    if (!product || !product.id) return;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // ── Search History Actions ────────────────────────────────────────────────
  const addSearchHistory = query => {
    if (!query || !query.trim()) return;
    const q = query.trim();
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== q.toLowerCase());
      return [q, ...filtered].slice(0, 8);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('nexcart_search_history');
  };

  // ── Auth Actions ──────────────────────────────────────────────────────────
  const loginUser = async (email, password) => {
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setIsAuthOpen(false);
      addToast(`Welcome back to NexCart, ${res.user.name.split(' ')[0]}! 👋`, 'success');
      return res;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const res = await api.register(name, email, password);
      setUser(res.user);
      setIsAuthOpen(false);
      addToast('Account created successfully! Welcome to NexCart.', 'success');
      return res;
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logoutUser = () => {
    api.logout();
    setUser(null);
    setCart([]);
    setAppliedCoupon(null);
    addToast('You have signed out of NexCart.', 'info');
  };

  // ── Cart & Save For Later Actions ─────────────────────────────────────────
  const addToCart = (product, quantity = 1, color = null, size = null) => {
    setCart(prev => {
      const selectedColor = color || (product.colors && product.colors[0]) || null;
      const selectedSize = size || (product.sizes && product.sizes[0]) || null;
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, selectedColor, selectedSize }];
    });
    addToast(`Added "${product.title}" to cart!`, 'success');
  };

  const removeFromCart = id => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const saveForLater = item => {
    setCart(prev => prev.filter(i => i.id !== item.id));
    setSavedForLater(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
    addToast(`Saved "${item.title}" for later.`, 'info');
  };

  const moveToCartFromSaved = item => {
    setSavedForLater(prev => prev.filter(i => i.id !== item.id));
    addToCart(item, item.quantity || 1, item.selectedColor, item.selectedSize);
  };

  const removeSavedItem = id => {
    setSavedForLater(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // ── Wishlist Actions ──────────────────────────────────────────────────────
  const toggleWishlist = product => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.title}" from Wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      }
      addToast(`Added "${product.title}" to Wishlist! ❤️`, 'success');
      return [...prev, product];
    });
  };

  const moveToCartFromWishlist = product => {
    toggleWishlist(product);
    addToCart(product, 1);
  };

  // ── Cart Calculations ─────────────────────────────────────────────────────
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = cartSubtotal > 50 || cartSubtotal === 0 ? 0 : 9.99;
  const taxAmount = Math.round((cartSubtotal - discountAmount) * 0.05 * 100) / 100;
  const cartTotal = Math.max(0, Number((cartSubtotal - discountAmount + shippingFee + taxAmount).toFixed(2)));

  // ── Print Invoice Helper ──────────────────────────────────────────────────
  const openInvoiceModal = order => {
    setActiveInvoiceOrder(order);
    setIsInvoiceOpen(true);
  };

  return (
    <ShopContext.Provider
      value={{
        // Theme
        theme,
        toggleTheme,

        // Auth
        user,
        setUser,
        isAdmin,
        loginUser,
        registerUser,
        logoutUser,
        isAuthOpen,
        setIsAuthOpen,

        // Cart & Save For Later
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        saveForLater,
        moveToCartFromSaved,
        removeSavedItem,
        clearCart,
        cartSubtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        cartTotal,

        // Coupons
        appliedCoupon,
        setAppliedCoupon,

        // Wishlist
        wishlist,
        toggleWishlist,
        moveToCartFromWishlist,
        isWishlistOpen,
        setIsWishlistOpen,

        // Recently Viewed & Search History
        recentlyViewed,
        trackRecentlyViewed,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,

        // Modals & Navigation Controls
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isAdminOpen,
        setIsAdminOpen,
        isInvoiceOpen,
        setIsInvoiceOpen,
        activeInvoiceOrder,
        openInvoiceModal,
        activeProductModal,
        setActiveProductModal: (prod) => {
          if (prod) trackRecentlyViewed(prod);
          setActiveProductModal(prod);
        },

        // Filters & Search State
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        minDiscount,
        setMinDiscount,
        inStockOnly,
        setInStockOnly,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        sortBy,
        setSortBy,
        categoriesList,

        // Toast Notifications
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
