'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ProductType, ReviewType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  CheckCircle2,
  FileText,
  Plus,
  Minus,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          if (data.product.images?.length > 0) {
            setSelectedImg(data.product.images[0].url);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-slate-400">Loading Equipment Specs...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-white">Product Not Found.</div>;
  }

  const isFav = isWishlisted(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);
  const gstAmount = (discountedPrice * product.gstPercent) / 100;
  const totalPriceWithGst = discountedPrice + gstAmount;

  let featuresList: string[] = [];
  try {
    featuresList = typeof product.features === 'string' ? JSON.parse(product.features) : product.features || [];
  } catch {
    featuresList = [product.features];
  }

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    router.push('/checkout');
  };

  const reviewsList: ReviewType[] = product.reviews || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 sm:h-[450px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
              <img
                src={selectedImg || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full border backdrop-blur-md transition-all ${
                  isFav
                    ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(img.url)}
                    className={`w-20 h-20 rounded-xl bg-slate-900 border-2 overflow-hidden flex-shrink-0 transition-all ${
                      selectedImg === img.url ? 'border-railway-500' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs & Pricing */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-railway-500/10 text-railway-400 border border-railway-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {product.category?.name || 'Railway Equipment'}
                </span>
                <span className="text-xs text-slate-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{product.name}</h1>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">({product.reviewsCount} verified reviews)</span>
                <span className="text-slate-700">&bull;</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units ready)
                </span>
              </div>
            </div>

            {/* Pricing Breakdown Box */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">{formatCurrency(discountedPrice)}</span>
                {product.discount > 0 && (
                  <span className="text-base text-slate-500 line-through">{formatCurrency(product.price)}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    SAVE {product.discount}%
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="flex items-center justify-between">
                  <span>Base Price:</span>
                  <span className="text-slate-200 font-semibold">{formatCurrency(discountedPrice)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>GST ({product.gstPercent}% input credit):</span>
                  <span className="text-slate-200 font-semibold">+{formatCurrency(gstAmount)}</span>
                </p>
                <p className="flex items-center justify-between font-bold text-white pt-1 text-sm">
                  <span>Total Incl. GST:</span>
                  <span className="text-railway-400">{formatCurrency(totalPriceWithGst)}</span>
                </p>
              </div>
            </div>

            {/* Quantity Modifier & Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 uppercase">Quantity:</span>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-railway-600 hover:bg-railway-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-xl shadow-railway-600/30 flex items-center justify-center gap-2"
                >
                  Buy Now & Checkout
                </button>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-center text-xs text-slate-400">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-railway-400 mb-1" />
                <span>RDSO Certified</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-railway-400 mb-1" />
                <span>Insured Freight</span>
              </div>
              <div className="flex flex-col items-center">
                <FileText className="w-5 h-5 text-railway-400 mb-1" />
                <span>18% GST Invoice</span>
              </div>
            </div>

            {/* Features Specification */}
            <div className="pt-4 border-t border-slate-900">
              <h3 className="text-sm font-bold text-white mb-3">Technical Specifications</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {featuresList.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-railway-400 mt-1.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 pt-12 border-t border-slate-900">
          <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews & Inspection Notes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-railway-600 flex items-center justify-center text-xs font-bold text-white">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-white">{rev.user?.name || 'Verified Contractor'}</span>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-10">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No customer reviews yet. Be the first to leave a review!</p>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-4">
              <h3 className="text-sm font-bold text-white">Leave an Inspection Review</h3>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Rating</label>
                <div className="flex items-center gap-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)}>
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Comment</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share build quality, RDSO specs, and field performance..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              <button
                onClick={() => {
                  alert('Thank you! Your inspection review has been submitted for approval.');
                  setReviewComment('');
                }}
                className="w-full bg-railway-600 hover:bg-railway-500 text-white font-bold py-2.5 text-xs rounded-xl transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
