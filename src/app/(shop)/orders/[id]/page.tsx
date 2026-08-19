'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle2, Clock, Package, FileText, ArrowLeft, ShieldCheck, Copy, Check } from 'lucide-react';
import { DLoader } from '@/components/common/Preloader';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
        } else {
          setError(data.error || 'Order not found or access denied.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-slate-950 py-20">
        <DLoader size="md" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center text-white space-y-4">
        <p className="text-rose-400 font-bold">{error || 'Order not found.'}</p>
        <Link href="/account" className="inline-block text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">
          View All Orders
        </Link>
      </div>
    );
  }

  const shippingAddr = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
  const utrPayment = order.payments && order.payments.length > 0 ? order.payments[0].transactionId : null;

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        {/* Success Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white">Order Received Successfully!</h1>
                <p className="text-xs text-slate-400 mt-0.5">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/api/orders/${order.id}/invoice`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors border border-slate-700"
              >
                <FileText className="w-4 h-4 text-railway-400" /> Invoice HTML
              </a>
            </div>
          </div>

          {/* Payment Status Info Callout */}
          {order.paymentStatus === 'PENDING_VERIFICATION' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Clock className="w-5 h-5 flex-shrink-0 animate-spin-slow" />
                <span>Payment Verification Pending</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you for your payment! We have received your submitted UTR reference. Our finance team will verify the transaction with Freecharge (Axis Bank) and update your order to <strong className="text-white">CONFIRMED</strong> shortly.
              </p>
              {utrPayment && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400">Submitted UTR / Transaction ID:</span>
                  <div className="flex items-center gap-2 font-mono font-bold text-white">
                    <span>{utrPayment}</span>
                    <button
                      onClick={() => handleCopyUtr(utrPayment)}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy UTR"
                    >
                      {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {order.paymentStatus === 'COMPLETED' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>Payment Verified & Confirmed! Your items are scheduled for dispatch.</span>
            </div>
          )}

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-t border-slate-800 pt-6">
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Shipping Address:</span>
              <p className="font-bold text-white">{shippingAddr?.fullName}</p>
              <p className="text-slate-300">{shippingAddr?.street}</p>
              <p className="text-slate-300">
                {shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.zipCode}
              </p>
              <p className="text-slate-400 mt-1">Phone: {shippingAddr?.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-bold text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-bold text-amber-400">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Status:</span>
                <span className="font-bold text-railway-400">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Items Summary Table */}
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-railway-400" /> Items Summary
            </h3>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl text-xs border border-slate-800/80">
                  <div>
                    <p className="font-bold text-white">{item.product?.name || 'Equipment Item'}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-extrabold text-white">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Amount Paid / Payable:</span>
                <span className="text-railway-400">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
