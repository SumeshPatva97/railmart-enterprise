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
  User,
  Plus,
  Edit,
  XCircle,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Loader2,
  X,
  ShieldCheck,
} from 'lucide-react';

function SectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-slate-800 rounded"></div>
            <div className="h-5 w-24 bg-slate-800 rounded-full"></div>
          </div>
          <div className="h-4 w-52 bg-slate-800/80 rounded"></div>
          <div className="h-12 w-full bg-slate-800/50 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Granular loading states per section/API
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // In-flight async request states (Prevent duplicate clicks)
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [accountAlert, setAccountAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile Edit State
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Refund Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRefundOrder, setSelectedRefundOrder] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: true,
  });

  // Support ticket modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');

  // Fetch individual section APIs
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders((await res.json()).orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) setAddresses((await res.json()).addresses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) setWishlist((await res.json()).wishlist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch('/api/crm/tickets');
      if (res.ok) setTickets((await res.json()).tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });

    // Load initial tab API data
    fetchOrders();
    fetchAddresses();
    fetchWishlist();
    fetchTickets();
  }, [user]);

  // Handle Profile Update (Disabled for System Admin)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role === 'ADMIN') {
      alert('System Admin profiles are read-only.');
      return;
    }
    if (isSubmittingProfile) return;
    setIsSubmittingProfile(true);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        setAccountAlert({ type: 'success', message: 'Profile updated successfully!' });
        setShowEditProfile(false);
        setTimeout(() => setAccountAlert(null), 4000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Handle Customer Cancel Order
  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (processingOrderId === orderId) return;
    if (!confirm(`Are you sure you want to cancel Order #${orderNumber}?`)) return;
    setProcessingOrderId(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o)));
        setAccountAlert({ type: 'success', message: `Order #${orderNumber} cancelled successfully!` });
        setTimeout(() => setAccountAlert(null), 4000);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to cancel order.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Handle Customer Refund Request
  const handleRequestRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefundOrder || isSubmittingRefund) return;
    setIsSubmittingRefund(true);

    try {
      const res = await fetch(`/api/orders/${selectedRefundOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REFUND_REQUESTED',
          notes: refundReason,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedRefundOrder.id ? { ...o, status: 'REFUND_REQUESTED' } : o))
        );
        setShowRefundModal(false);
        const orderNum = selectedRefundOrder.orderNumber;
        setSelectedRefundOrder(null);
        setRefundReason('');
        setAccountAlert({
          type: 'success',
          message: `Refund request for Order #${orderNum} submitted successfully! Admin will review your request.`,
        });
        setTimeout(() => setAccountAlert(null), 5000);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit refund request.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingAddress) return;
    setIsSubmittingAddress(true);

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr),
      });

      if (res.ok) {
        const data = await res.json();
        setAddresses((prev) => [data.address, ...prev]);
        setShowAddressModal(false);
        setNewAddr({
          label: 'Home',
          fullName: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: true,
        });
        setAccountAlert({ type: 'success', message: 'Delivery address added successfully!' });
        setTimeout(() => setAccountAlert(null), 4000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add address.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg || isSubmittingTicket) return;
    setIsSubmittingTicket(true);

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
        setAccountAlert({ type: 'success', message: 'Support ticket raised successfully!' });
        setTimeout(() => setAccountAlert(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-white">Please sign in to view your account.</div>;
  }

  const isAdminUser = user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-railway-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                    isAdminUser
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-railway-500/20 text-railway-400 border-railway-500/30'
                  }`}
                >
                  {user.role} ACCOUNT
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-railway-400" /> {user.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-railway-400" /> {user.phone || 'No phone set'}</span>
              </div>
            </div>
          </div>

          {/* System Admin gets read-only badge; regular Customer gets Edit Profile button */}
          {isAdminUser ? (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> System Admin Profile (Protected)
            </div>
          ) : (
            <button
              onClick={() => setShowEditProfile(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4 text-railway-400" /> Edit Profile (Phone / Email)
            </button>
          )}
        </div>

        {accountAlert && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs font-extrabold flex items-center justify-between shadow-lg ${
              accountAlert.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {accountAlert.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{accountAlert.message}</span>
            </div>
            <button onClick={() => setAccountAlert(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Account Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setActiveTab('orders');
              if (orders.length === 0) fetchOrders();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('addresses');
              if (addresses.length === 0) fetchAddresses();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'addresses' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Address Book ({addresses.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('wishlist');
              if (wishlist.length === 0) fetchWishlist();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'wishlist' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('tickets');
              if (tickets.length === 0) fetchTickets();
            }}
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
            {loadingOrders ? (
              <SectionSkeleton count={3} />
            ) : orders.length > 0 ? (
              orders.map((ord) => {
                const isProcessingThis = processingOrderId === ord.id;
                const canCancel = ord.status === 'PENDING' || ord.status === 'CONFIRMED';
                const canRefund = ord.status === 'DELIVERED';
                const isRefundRequested = ord.status === 'REFUND_REQUESTED';
                const isRefunded = ord.status === 'REFUNDED';
                const isCancelled = ord.status === 'CANCELLED';

                return (
                  <div key={ord.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-extrabold text-white">#{ord.orderNumber}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              isCancelled
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                : isRefundRequested
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : isRefunded
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-railway-500/20 text-railway-400 border-railway-500/30'
                            }`}
                          >
                            {ord.status === 'REFUND_REQUESTED' ? 'REFUND REQUESTED' : ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Placed on: {formatDate(ord.createdAt)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {canCancel && (
                          <button
                            disabled={isProcessingThis}
                            onClick={() => handleCancelOrder(ord.id, ord.orderNumber)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessingThis ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Cancel Order
                              </>
                            )}
                          </button>
                        )}

                        {canRefund && (
                          <button
                            disabled={isProcessingThis}
                            onClick={() => {
                              setSelectedRefundOrder(ord);
                              setShowRefundModal(true);
                            }}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Request Refund
                          </button>
                        )}

                        {isRefundRequested && (
                          <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                            Refund Under Review
                          </span>
                        )}

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
                );
              })
            ) : (
              <p className="text-xs text-slate-400">No past orders found.</p>
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Saved Delivery Addresses</h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="bg-railway-600 hover:bg-railway-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {loadingAddresses ? (
              <SectionSkeleton count={2} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="bg-railway-500/20 text-railway-400 border border-railway-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-emerald-400 font-bold">Default Address</span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{addr.fullName}</h4>
                    <p className="text-xs text-slate-300">{addr.street}</p>
                    <p className="text-xs text-slate-400">{addr.city}, {addr.state} - {addr.zipCode}, {addr.country}</p>
                    <p className="text-xs text-slate-400">Phone: {addr.phone}</p>
                  </div>
                ))}

                {addresses.length === 0 && (
                  <p className="text-xs text-slate-400 col-span-2">No saved addresses yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          loadingWishlist ? (
            <SectionSkeleton count={3} />
          ) : (
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

              {wishlist.length === 0 && (
                <p className="text-xs text-slate-400 col-span-3">Your wishlist is currently empty.</p>
              )}
            </div>
          )
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

            {loadingTickets ? (
              <SectionSkeleton count={2} />
            ) : (
              tickets.map((tkt) => (
                <div key={tkt.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white">{tkt.ticketNumber} &bull; {tkt.subject}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">{tkt.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">Created: {formatDate(tkt.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Request Refund Modal */}
      {showRefundModal && selectedRefundOrder && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingRefund) setShowRefundModal(false);
          }}
        >
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Request Refund for Order #{selectedRefundOrder.orderNumber}</h3>
            </div>

            <form onSubmit={handleRequestRefundSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Total Order Amount</label>
                <input
                  type="text"
                  readOnly
                  value={formatCurrency(selectedRefundOrder.totalAmount)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-railway-400 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Reason for Refund Request</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Received incorrect specification, RDSO test inspection failed..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmittingRefund}
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRefund}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-600/30 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmittingRefund ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                    </>
                  ) : (
                    'Submit Refund Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal (Name, Email, Phone) - Accessible only for Customers */}
      {showEditProfile && !isAdminUser && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingProfile) setShowEditProfile(false);
          }}
        >
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Edit Customer Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmittingProfile}
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="px-5 py-2 bg-railway-600 text-white rounded-xl font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmittingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...
                    </>
                  ) : (
                    'Save Profile Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingAddress) setShowAddressModal(false);
          }}
        >
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Add Delivery Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Label</label>
                  <input
                    type="text"
                    placeholder="Home / Office / Depot"
                    value={newAddr.label}
                    onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Full Name</label>
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Phone</label>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Zip Code</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddr.zipCode}
                    onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Street Address</label>
                <input
                  type="text"
                  placeholder="House/Plot #, Railway Depot Road"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmittingAddress}
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAddress}
                  className="px-5 py-2 bg-railway-600 text-white rounded-xl font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmittingAddress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Address...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingTicket) setShowTicketModal(false);
          }}
        >
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
                  disabled={isSubmittingTicket}
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="px-4 py-2 bg-railway-600 text-white rounded-xl font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmittingTicket ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
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
