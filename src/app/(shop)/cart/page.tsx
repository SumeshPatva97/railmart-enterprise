'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cartItems, totals, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Cart is Currently Empty</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm text-center">
          Explore our certified railway benders, signaling lamps, and electrical tools to add equipment to your cart.
        </p>
        <Link
          href="/products"
          className="mt-6 bg-railway-600 hover:bg-railway-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
        >
          Browse Equipment Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-8">Equipment Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const prod = item.product;
              const unitPrice = prod.price * (1 - prod.discount / 100);
              const itemTotal = unitPrice * item.quantity;
              const imgUrl = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80';

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800">
                      <img src={imgUrl} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <Link href={`/products/${prod.slug}`}>
                        <h3 className="text-sm font-bold text-white hover:text-railway-400 transition-colors line-clamp-1">
                          {prod.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">SKU: {prod.sku}</p>
                      <p className="text-xs text-railway-400 font-bold mt-1">
                        {formatCurrency(unitPrice)} <span className="text-[10px] text-slate-500">(+18% GST)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-white">{formatCurrency(itemTotal)}</span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Order Summary</h3>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-bold text-white">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Estimated GST (18% Input Credit):</span>
                  <span className="font-bold text-white">+{formatCurrency(totals.taxAmount)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Insured Freight Delivery Fee:</span>
                  <span className="font-bold text-white">
                    {totals.shippingFee === 0 ? 'FREE' : formatCurrency(totals.shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-800 text-sm font-black text-white">
                  <span>Grand Total:</span>
                  <span className="text-railway-400 text-base">{formatCurrency(totals.totalAmount)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-railway-600 hover:bg-railway-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-xl shadow-railway-600/30 flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
