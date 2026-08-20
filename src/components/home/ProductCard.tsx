'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Zap, ArrowRight } from 'lucide-react';
import { ProductType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: ProductType;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const isFav = typeof isWishlisted === 'function' ? isWishlisted(product.id) : false;

  const mainImg =
    product.images && product.images.length > 0
      ? product.images[0].url
      : '/images/products/gadar.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-[1.03]"
    >
      {/* Background Subtle Gradient Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card Media Header */}
      <div className="relative h-56 bg-slate-950 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full cursor-pointer">
          <img
            src={mainImg}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Discount & Feature Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount > 0 && (
            <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-md">
              {product.discount}% OFF
            </span>
          )}
          <span className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            High Speed Tatkal
          </span>
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2.5 rounded-full border backdrop-blur-md transition-colors z-20 ${
            isFav
              ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-lg shadow-rose-500/20'
              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-rose-400 hover:border-slate-700'
          }`}
          title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Card Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 relative z-10">
        <div>
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
            <span className="text-slate-500">({product.reviewsCount || 45})</span>
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-amber-400 transition-colors">
            <h3 className="font-heading text-sm sm:text-base font-bold text-white line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">SKU: {product.sku}</p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-slate-500 line-through">
                {formatCurrency(product.price * (1 + product.discount / 100))}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => addToCart(product, 1)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </motion.button>

            <Link
              href={`/products/${product.slug}`}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-3 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1 hover:gap-2 group/btn"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
