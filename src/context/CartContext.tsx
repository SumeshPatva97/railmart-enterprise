'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { ProductType, CartItemType } from '@/types';

interface CartTotals {
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
}

interface CartContextType {
  cartItems: CartItemType[];
  wishlistIds: string[];
  totals: CartTotals;
  couponCode: string | null;
  appliedCoupon: any | null;
  addToCart: (product: ProductType, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [totals, setTotals] = useState<CartTotals>({
    subtotal: 0,
    taxAmount: 0,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 0,
  });
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      setWishlistIds([]);
      setTotals({ subtotal: 0, taxAmount: 0, shippingFee: 0, discountAmount: 0, totalAmount: 0 });
      return;
    }

    try {
      const [cartRes, wishRes] = await Promise.all([
        fetch('/api/cart'),
        fetch('/api/wishlist'),
      ]);

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData.cart?.items || []);
        if (cartData.totals) {
          setTotals(cartData.totals);
        }
      }

      if (wishRes.ok) {
        const wishData = await wishRes.json();
        const ids = (wishData.wishlist || []).map((w: any) => w.productId);
        setWishlistIds(ids);
      }
    } catch (err) {
      console.error('Failed to load cart/wishlist', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (product: ProductType, quantity = 1) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity }),
    });

    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    const diff = quantity - item.quantity;
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: item.productId, quantity: diff }),
    });

    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
    await refreshCart();
  };

  const clearCart = async () => {
    await fetch('/api/cart', { method: 'DELETE' });
    await refreshCart();
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal: totals.subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setCouponCode(code);
        setAppliedCoupon(data.coupon);
        // Recalculate totals with discount
        let disc = 0;
        if (data.coupon.discountType === 'PERCENTAGE') {
          disc = (totals.subtotal * data.coupon.value) / 100;
          if (data.coupon.maxDiscount && disc > data.coupon.maxDiscount) {
            disc = data.coupon.maxDiscount;
          }
        } else {
          disc = data.coupon.value;
        }

        setTotals((prev) => ({
          ...prev,
          discountAmount: Math.round(disc * 100) / 100,
          totalAmount: Math.max(0, Math.round((prev.subtotal + prev.taxAmount + prev.shippingFee - disc) * 100) / 100),
        }));

        return { success: true, message: data.message };
      }
      return { success: false, message: data.error };
    } catch (err: any) {
      return { success: false, message: err.message || 'Coupon error' };
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    await refreshCart();
  };

  const isWishlisted = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistIds,
        totals,
        couponCode,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        toggleWishlist,
        isWishlisted,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
