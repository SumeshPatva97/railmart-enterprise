'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ProductType, CategoryType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Search, Star, ShoppingCart, Heart, SlidersHorizontal, Check, ChevronDown } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Mobile Filter Drawer Toggle
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Sync selectedCategory & searchQuery state with URL searchParams dynamically when Navbar/URL changes
  useEffect(() => {
    const catFromUrl = searchParams.get('category') || '';
    const searchFromUrl = searchParams.get('search') || '';
    if (catFromUrl !== selectedCategory) {
      setSelectedCategory(catFromUrl);
    }
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const catController = new AbortController();
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories', { signal: catController.signal });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }
    fetchCategories();
    return () => {
      catController.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (searchQuery) params.set('search', searchQuery);
        if (sortOption) params.set('sort', sortOption);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (minRating) params.set('minRating', minRating);

        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [selectedCategory, searchQuery, sortOption, minPrice, maxPrice, minRating]);

  // Handler to select category and sync browser URL bar
  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategory(catSlug);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (catSlug) {
        url.searchParams.set('category', catSlug);
      } else {
        url.searchParams.delete('category');
      }
      window.history.pushState(null, '', url.toString());
    }
  };

  const handleAddToCart = async (product: ProductType) => {
    await addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-6 sm:mb-8 border-b border-slate-800 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Tatkal Booking Software & Extensions Catalog</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse all 12 High-Speed IRCTC Tatkal Softwares: GADAR, STAR_TS, PRO MAX, HITMAN, SUPERMAN, BTS, PANDA, WINDOW TS, AVATAR, OCEAN EXTENSION, BINGO & RANGER.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-xs font-bold text-white shadow-md"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-railway-400" /> Filter Inventory
              {selectedCategory && (
                <span className="bg-railway-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                  1 Active Filter
                </span>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMobileFilter ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Filter Sidebar */}
          <div className={`lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-6 ${
            showMobileFilter ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-railway-400" /> Filter Inventory
              </h3>
              {(selectedCategory || searchQuery || minPrice || maxPrice || minRating) && (
                <button
                  onClick={() => {
                    handleCategorySelect('');
                    setSearchQuery('');
                    setMinPrice('');
                    setMaxPrice('');
                    setMinRating('');
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Category</label>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-railway-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  All Divisions
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors truncate ${
                      selectedCategory === cat.slug
                        ? 'bg-railway-600 text-white font-bold'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5★ & Above</option>
                <option value="4.0">4.0★ & Above</option>
              </select>
            </div>
          </div>

          {/* Catalog Listing */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search catalog SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 whitespace-nowrap">Sort By:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none w-full sm:w-auto"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const mainImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                  const isFav = isWishlisted(product.id);
                  const discountedPrice = product.price * (1 - product.discount / 100);

                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden shadow-lg"
                    >
                      <div className="relative h-48 sm:h-52 bg-slate-950 overflow-hidden">
                        <Link href={`/products/${product.slug}`} className="block w-full h-full cursor-pointer">
                          <img
                            src={mainImg}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                          {product.discount > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>

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

                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
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
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
                <p className="text-slate-400 text-sm">No software found matching your filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading Catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
