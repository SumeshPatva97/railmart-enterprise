'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductType } from '@/types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from '@/components/common/ScrollReveal';

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products?featured=true&limit=6', { signal });
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

  const top6Products = products.slice(0, 6);

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-900 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official & In-Stock</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            D Enterprise Team Tatkal Softwares
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Top High-Speed Tatkal Ticket Booking software tools & browser extensions by Super Master Bhimdada.
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {top6Products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* View More Button */}
            <ScrollReveal direction="up" delay={0.2} className="text-center mt-14">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm px-9 py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/40 group"
              >
                <span>Explore All Available Softwares</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
