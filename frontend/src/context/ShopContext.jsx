import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api.js';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('auraluxe_theme') || 'dark');
  
  // User Mode (Customer vs Admin)
  const [isAdmin, setIsAdmin] = useState(false);

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('auraluxe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('auraluxe_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Promo Code
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Modal Controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'featured',
    inStock: false
  });

  // Toast Alerts
  const [toasts, setToasts] = useState([]);

  // Sync Theme to HTML root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('auraluxe_theme', theme);
  }, [theme]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('auraluxe_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('auraluxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Actions
  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          ...product,
          quantity,
          selectedColor,
          selectedSize
        }];
      }
    });

    addToast(`Added "${product.title}" to your cart!`, 'success');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.title}" from wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        addToast(`Added "${product.title}" to wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = cartSubtotal > 100 || cartSubtotal === 0 ? 0 : 15.00;
  const taxAmount = (cartSubtotal - discountAmount) * 0.08;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + taxAmount);

  return (
    <ShopContext.Provider
      value={{
        theme,
        toggleTheme,
        isAdmin,
        setIsAdmin,
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
        appliedCoupon,
        setAppliedCoupon,
        wishlist,
        toggleWishlist,
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
        filters,
        setFilters,
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
