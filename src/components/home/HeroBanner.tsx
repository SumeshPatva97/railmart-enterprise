'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { ProductType } from '@/types';

export function TypewriterText({
  words = [
    '12 High-Speed Tatkal Ticket Booking Software',
    'Instant Auto-Captcha & Bypass Solutions',
    'Multi-PNR & High Speed Browser Extensions',
    'Super Master Bhimdada 24/7 Dedicated Support',
  ],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-flex items-baseline">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">
        {text}
      </span>
      <span className="w-1.5 h-8 sm:h-10 ml-1.5 bg-amber-400 animate-pulse rounded-full inline-block" />
    </span>
  );
}

export function HeroBanner() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchHeroProducts() {
      try {
        const res = await fetch(`/api/products?limit=50&_t=${Date.now()}`, {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products)) {
            // Strictly check catalog visibility and non-deleted active status
            const catalogVisibleProducts = data.products.filter(
              (p: ProductType) =>
                p.isVisible !== false &&
                (p.is_deleted === 0 || p.is_deleted === undefined) &&
                p.status !== 'DRAFT'
            );

            // Prioritize items with Homepage Card ON (isFeatured: true)
            const heroFeatured = catalogVisibleProducts.filter((p: ProductType) => Boolean(p.isFeatured));
            const remaining = catalogVisibleProducts.filter((p: ProductType) => !Boolean(p.isFeatured));

            // Select up to 6 products
            const finalSelection = (heroFeatured.length > 0 ? [...heroFeatured, ...remaining] : catalogVisibleProducts).slice(0, 6);
            setProducts(finalSelection);
          }
          if (data.pagination?.total) {
            setTotalCount(data.pagination.total);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load hero banner products:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchHeroProducts();
    return () => controller.abort();
  }, []);

  // Helper to extract clean subtitle/feature tag
  const getProductSubtitle = (product: ProductType, index: number) => {
    if (product.features) {
      try {
        const parsed = typeof product.features === 'string' ? JSON.parse(product.features) : product.features;
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string' && parsed[0].trim()) {
          return parsed[0];
        }
      } catch {
        // use fallback tag
      }
    }

    const fallbackTags: Record<string, string> = {
      gadar: 'Multi PNR Support',
      star: 'Smart Automation',
      'pro-max': 'High-Speed Engine',
      hitman: 'Smart Assistant',
      superman: 'Workflow Master',
      bts: '10% Wallet Cashback',
      window: 'Windows Optimized',
      ocean: 'Auto Captcha Bypass',
      ranger: 'High Speed Engine',
      bingo: 'Fast Checkout Engine',
    };

    const searchKey = `${product.slug || ''} ${product.name || ''}`.toLowerCase();
    for (const [key, tag] of Object.entries(fallbackTags)) {
      if (searchKey.includes(key)) {
        return tag;
      }
    }

    const defaultTags = ['Multi PNR Support', 'Smart Automation', 'High-Speed Engine', 'Smart Assistant', 'Workflow Master', '10% Wallet Cashback'];
    return defaultTags[index % defaultTags.length] || '100% Genuine';
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 border-b border-slate-900">
      {/* Background Animated Gradient Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-railway-600/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Staggered Fade-in & Slide-up Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="space-y-6 text-left"
        >
          {/* Badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg shadow-amber-500/10"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Official Tatkal Software Portal (denterpriese.softvps.in)</span>
          </motion.div>

          {/* Typewriter Main Headline */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="space-y-2"
          >
            <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-400 uppercase tracking-wider">
              D ENTERPRISE TEAM PRESENTS
            </h2>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] min-h-[90px] sm:min-h-[110px]">
              <TypewriterText />
            </h1>
          </motion.div>

          {/* Sub-text description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl"
          >
            Procure verified high-speed Tatkal booking solutions including{' '}
            <strong className="text-amber-300 font-bold">
              GADAR, STAR_TS, PRO MAX, HITMAN, SUPERMAN, BTS, WINDOW TS, OCEAN EXTENSION & RANGER
            </strong>{' '}
            with dedicated configuration assistance.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full"
          >
            <Link
              href="/products"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 group w-full sm:w-auto hover:scale-105 active:scale-95"
            >
              <span>Explore All {totalCount > 0 ? totalCount : 12} Softwares</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://wa.me/918521012621"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 text-sm font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10"
            >
              <Send className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 8521012621)</span>
            </a>
          </motion.div>

          {/* Super Master Bhimdada Notice Box */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 text-xs text-slate-300 space-y-2 backdrop-blur-md shadow-xl"
          >
            <div className="font-bold text-amber-400 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                📢 MESSAGE FROM SUPER MASTER BHIMDADA :-
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                7:30 AM - 12:00 AM Support
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Software, VPS, IP, Booking ID aur anya related services available hain. Fast support ke liye contact desk:{' '}
              <a href="tel:8521012621" className="text-white hover:text-amber-400 font-bold underline transition-colors">
                8521012621
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column: Anti-Gravity Floating Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* Framer Motion Anti-Gravity Floating Card */}
          <motion.div
            animate={{
              y: [0, -18, 0],
              rotate: [0, 0.8, -0.8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full max-w-lg"
          >
            {/* Ambient Background Glow Layer */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/40 via-sky-500/30 to-emerald-500/40 rounded-3xl blur-xl opacity-75 animate-pulse" />

            <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 bg-slate-900/90 p-6 sm:p-7 backdrop-blur-2xl shadow-2xl space-y-5">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <span className="text-xs font-mono text-slate-400 ml-2">denterpriese.softvps.in</span>
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 shadow-sm">
                  ⚡ {totalCount > 0 ? totalCount : 12} Softwares Live
                </span>
              </div>

              {/* Showcase Grid of Catalog-Visible Products (Max 6 limit) */}
              <div className="grid grid-cols-2 gap-3 text-left">
                {loading && products.length === 0 ? (
                  // Elegant Skeleton Loaders (6 items)
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 animate-pulse space-y-2"
                    >
                      <div className="h-2.5 bg-slate-800 rounded w-3/4" />
                      <div className="h-4 bg-amber-500/20 rounded w-1/2" />
                      <div className="h-2 bg-slate-800/80 rounded w-2/3" />
                    </div>
                  ))
                ) : (
                  products.slice(0, 6).map((product, idx) => {
                    const currentPrice = Math.max(0, product.price - (product.discount || 0));
                    const cleanName =
                      product.name.replace(/Tatkal (Software|Extension)/gi, '').trim() || product.name;
                    const subtitle = getProductSubtitle(product, idx);
                    const tagColor =
                      idx % 3 === 0
                        ? 'text-emerald-400'
                        : idx % 3 === 1
                        ? 'text-cyan-400'
                        : 'text-amber-400';

                    return (
                      <Link
                        key={product.id || idx}
                        href={`/products/${product.slug}`}
                        className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/90 hover:border-amber-500/60 hover:bg-slate-900/90 transition-all block group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide truncate group-hover:text-amber-200 transition-colors">
                            {idx + 1}) {cleanName}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20">
                              OFF
                            </span>
                          )}
                        </div>

                        {/* Current Real Price Display */}
                        <div className="flex items-baseline gap-1.5 my-0.5">
                          <span className="text-sm sm:text-base font-black text-amber-400 group-hover:text-yellow-300 transition-colors">
                            ₹{currentPrice.toLocaleString('en-IN')}/-
                          </span>
                          {product.discount > 0 && (
                            <span className="text-[10px] text-slate-500 line-through">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Feature / Subtitle Highlight */}
                        <span className={`text-[10px] ${tagColor} block font-medium truncate`}>
                          {subtitle}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Bottom Trust Tag */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/70">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> 100% Genuine Software
                </span>
                
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroBanner;
