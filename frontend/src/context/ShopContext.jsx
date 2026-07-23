import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api.js';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('auraluxe_theme') || 'dark');

  // ── Auth State ────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── User Mode (Customer vs Admin) ─────────────────────────────────────────
  const isAdmin = user?.role === 'ADMIN';

  // ── Cart State (synced with backend for logged-in users) ──────────────────
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('auraluxe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Wishlist State ────────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('auraluxe_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Coupon ────────────────────────────────────────────────────────────────
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ── Modal Controls ────────────────────────────────────────────────────────
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);

  // ── Filters State ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'featured',
    inStock: false,
  });

  // ── Toast Alerts ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  // ── Sync Theme ────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('auraluxe_theme', theme);
  }, [theme]);

  // ── Sync local cart to localStorage (guest mode) ──────────────────────────
  useEffect(() => {
    if (!user) {
      localStorage.setItem('auraluxe_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    localStorage.setItem('auraluxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ── Initialize auth on mount ──────────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const token = api.getAccessToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setUser(res?.data?.user ?? null);
      } catch {
        api.clearTokens();
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // ── Auth Actions ──────────────────────────────────────────────────────────

  const loginUser = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res?.data?.user ?? null);
    setIsAuthOpen(false);
    addToast(`Welcome back, ${res?.data?.user?.name?.split(' ')[0] ?? 'there'}! 👋`, 'success');
    return res;
  };

  const registerUser = async (name, email, password, confirmPassword) => {
    const res = await api.register(name, email, password, confirmPassword);
    addToast('Account created! Please check your email to verify.', 'success');
    return res;
  };

  const logoutUser = async () => {
    await api.logout();
    setUser(null);
    setCart([]);
    setAppliedCoupon(null);
    addToast('You have been signed out.', 'info');
  };

  // ── Cart Actions ──────────────────────────────────────────────────────────

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    // For guest users: keep in local state
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, selectedColor, selectedSize }];
    });
    addToast(`Added "${product.title || product.name}" to your cart!`, 'success');
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // ── Wishlist Actions ──────────────────────────────────────────────────────

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.title || product.name}" from wishlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      }
      addToast(`Added "${product.title || product.name}" to wishlist!`, 'success');
      return [...prev, product];
    });
  };

  // ── Cart Calculations ─────────────────────────────────────────────────────

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = cartSubtotal > 1000 || cartSubtotal === 0 ? 0 : 99;
  const taxAmount = Math.round((cartSubtotal - discountAmount) * 0.18 * 100) / 100;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + taxAmount);

  return (
    <ShopContext.Provider
      value={{
        // Theme
        theme,
        toggleTheme,

        // Auth
        user,
        isAdmin,
        authLoading,
        loginUser,
        registerUser,
        logoutUser,
        isAuthOpen,
        setIsAuthOpen,

        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        cartTotal,

        // Coupon
        appliedCoupon,
        setAppliedCoupon,

        // Wishlist
        wishlist,
        toggleWishlist,

        // Modals
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isAdminOpen,
        setIsAdminOpen,
        activeProductModal,
        setActiveProductModal,

        // Filters
        filters,
        setFilters,

        // Toasts
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
