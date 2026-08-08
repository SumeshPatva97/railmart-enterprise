'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ProductType } from '@/types';
import { Star, ShoppingCart, Heart, ShieldCheck, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products?featured=true', { signal });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }
    fetchFeatured();

    return () => {
      controller.abort();
    };
  }, []);

  const handleAddToCart = async (product: ProductType) => {
    await addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Official & In-Stock</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">D Enterprise Team Tatkal Softwares</h2>
          <p className="text-slate-400 text-sm mt-3">
            All 12 High-Speed IRCTC Tatkal software tools & browser extensions by Super Master Bhimdada.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const mainImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
              const isFav = isWishlisted(product.id);
              const discountedPrice = product.price * (1 - product.discount / 100);

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
                >
                  <div className="relative h-56 bg-slate-950 overflow-hidden">
                    <Link href={`/products/${product.slug}`} className="block w-full h-full cursor-pointer">
                      <img
                        src={mainImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                      {product.discount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          {product.discount}% OFF
                        </span>
                      )}
                      <span className="bg-railway-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                        {product.gstPercent}% GST
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-all z-20 ${
                        isFav
                          ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mb-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-slate-500">({product.reviewsCount})</span>
                      </div>

                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-sm font-bold text-white group-hover:text-railway-400 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-1">SKU: {product.sku}</p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-white">{formatCurrency(discountedPrice)}</span>
                        {product.discount > 0 && (
                          <span className="text-xs text-slate-500 line-through">{formatCurrency(product.price)}</span>
                        )}
                      </div>

                      <div className="mt-3">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            addedId === product.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-railway-600 hover:bg-railway-500 text-white shadow-lg shadow-railway-600/20'
                          }`}
                        >
                          {addedId === product.id ? (
                            <>
                              <Check className="w-4 h-4" /> Added to Cart
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
