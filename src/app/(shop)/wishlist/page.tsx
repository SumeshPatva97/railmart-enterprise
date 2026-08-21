'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { DLoader } from '@/components/common/Preloader';

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart, toggleWishlist } = useCart();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemove = async (productId: string) => {
    await toggleWishlist(productId);
    setWishlist((prev) => prev.filter((item) => item.product?.id !== productId && item.productId !== productId));
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-slate-950 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-rose-400">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Sign In to View Your Wishlist</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">
          Please log in to your D Enterprise account to view your saved Tatkal booking tools and software.
        </p>
        <Link
          href="/login"
          className="mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg"
        >
          Sign In to Account
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 py-20">
        <DLoader size="md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Saved Softwares</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">My Wishlist</h1>
          </div>
          <Link
            href="/products"
            className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1"
          >
            <span>Browse All Available Softwares</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Your Wishlist is Empty</h3>
            <p className="text-slate-400 text-xs mt-2">
              You haven't saved any software tools yet, or unavailable products have been automatically cleaned.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              <span>Explore Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const prod = item.product;
              if (!prod) return null;
              const unitPrice = prod.price * (1 - (prod.discount || 0) / 100);
              const imgUrl =
                prod.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80';

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-lg"
                >
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4">
                      <img
                        src={imgUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleRemove(prod.id)}
                        className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-950/80 hover:bg-rose-500 text-slate-400 hover:text-white transition-colors border border-slate-800 shadow-md"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block mb-1">
                      {prod.category?.name || 'Tatkal Booking Tool'}
                    </span>

                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="text-sm font-bold text-white hover:text-amber-400 transition-colors line-clamp-2">
                        {prod.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-sm font-black text-amber-400">{formatCurrency(unitPrice)}</span>
                      {prod.discount > 0 && (
                        <span className="text-[10px] text-slate-500 line-through block">
                          {formatCurrency(prod.price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 inline-flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
