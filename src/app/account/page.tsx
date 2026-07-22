'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Package,
  Heart,
  MapPin,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Send,
} from 'lucide-react';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Support ticket modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');

  useEffect(() => {
    async function loadAccountData() {
      if (!user) return;
      setLoading(true);
      try {
        const [ordRes, tktRes, wishRes, addrRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/crm/tickets'),
          fetch('/api/wishlist'),
          fetch('/api/addresses'),
        ]);

        if (ordRes.ok) setOrders((await ordRes.json()).orders || []);
        if (tktRes.ok) setTickets((await tktRes.json()).tickets || []);
        if (wishRes.ok) setWishlist((await wishRes.json()).wishlist || []);
        if (addrRes.ok) setAddresses((await addrRes.json()).addresses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAccountData();
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    try {
      const res = await fetch('/api/crm/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          message: ticketMsg,
          category: 'Order Query',
          priority: 'MEDIUM',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTickets((prev) => [data.ticket, ...prev]);
        setShowTicketModal(false);
        setTicketSubject('');
        setTicketMsg('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-white">Please sign in to view your account.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-railway-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">{user.name}</h1>
              <p className="text-xs text-slate-400">{user.email} &bull; {user.phone || 'No phone'}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-railway-500/20 text-railway-400 border border-railway-500/30">
                {user.role} ACCOUNT
              </span>
            </div>
          </div>
        </div>

        {/* Account Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'wishlist' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'addresses' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Address Book ({addresses.length})
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tickets' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Support Tickets ({tickets.length})
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length > 0 ? (
              orders.map((ord) => (
                <div key={ord.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold text-white">#{ord.orderNumber}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-railway-500/20 text-railway-400 border border-railway-500/30">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Placed on: {formatDate(ord.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`/api/orders/${ord.id}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-railway-400" /> Tax Invoice PDF
                      </a>
                    </div>
                  </div>

                  {/* Order Items preview */}
                  <div className="divide-y divide-slate-800/60">
                    {ord.items?.map((item: any) => (
                      <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-semibold">{item.product?.name || 'Equipment Item'} (x{item.quantity})</span>
                        <span className="text-white font-bold">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Payment: <strong className="text-white">{ord.paymentMethod}</strong> ({ord.paymentStatus})</span>
                    <span className="text-sm font-black text-railway-400">Total: {formatCurrency(ord.totalAmount)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No past orders found.</p>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.product?.name}</h4>
                  <p className="text-xs text-railway-400 font-bold mt-1">{formatCurrency(item.product?.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Support Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Your Technical Queries & Tickets</h3>
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-railway-600 hover:bg-railway-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Raise Support Ticket
              </button>
            </div>

            {tickets.map((tkt) => (
              <div key={tkt.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">{tkt.ticketNumber} &bull; {tkt.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">{tkt.status}</span>
                </div>
                <p className="text-xs text-slate-400">Created: {formatDate(tkt.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Raise Railway Engineer Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. RDSO Warranty Certificate Request"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Query Message</label>
                <textarea
                  rows={4}
                  placeholder="Describe your equipment specifications or dispatch inquiry..."
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-railway-600 text-white rounded-xl font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading Profile...</div>}>
      <AccountContent />
    </Suspense>
  );
}
