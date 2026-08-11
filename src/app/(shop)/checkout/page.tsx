'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { MapPin, CreditCard, Check, Lock, AlertCircle, QrCode, Building2, Copy, CheckCircle2, Info } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totals, couponCode, clearCart } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI_QR' | 'COD'>('UPI_QR');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // New Address form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Site Office',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const UPI_ID = 'bdada@freecharge';
  const PAYEE_NAME = 'ROHIT DIXIT';

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch('/api/addresses');
        if (res.ok) {
          const data = await res.json();
          setAddresses(data.addresses || []);
          const def = data.addresses.find((a: any) => a.isDefault);
          if (def) setSelectedAddressId(def.id);
          else if (data.addresses.length > 0) setSelectedAddressId(data.addresses[0].id);
          else setShowNewAddress(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (user) fetchAddresses();
  }, [user]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAddr, isDefault: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses((prev) => [data.address, ...prev]);
        setSelectedAddressId(data.address.id);
        setShowNewAddress(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAddressFilled = () => {
    if (!showNewAddress && selectedAddressId && addresses.some((a) => a.id === selectedAddressId)) {
      return true;
    }
    return (
      newAddr.fullName.trim() !== '' &&
      newAddr.phone.trim() !== '' &&
      newAddr.street.trim() !== '' &&
      newAddr.city.trim() !== '' &&
      newAddr.state.trim() !== '' &&
      newAddr.zipCode.trim() !== ''
    );
  };

  const handlePlaceOrder = async () => {
    setValidationError(null);

    // Validation 1: Address
    if (!isAddressFilled()) {
      setValidationError('Please fill in and save your Shipping Address & Dispatch Details before confirming your order.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validation 2: UTR / Reference ID for Online Payments
    if (paymentMethod === 'UPI_QR' && !utrNumber.trim()) {
      setValidationError('Please enter your 12-digit UPI UTR or Transaction ID after completing payment.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      let selectedAddrObj = addresses.find((a) => a.id === selectedAddressId);

      if (!selectedAddrObj && showNewAddress) {
        const saveRes = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newAddr, isDefault: true }),
        });
        if (saveRes.ok) {
          const data = await saveRes.json();
          selectedAddrObj = data.address;
        } else {
          selectedAddrObj = newAddr;
        }
      }

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: selectedAddrObj,
          billingAddress: selectedAddrObj,
          paymentMethod,
          utrNumber: utrNumber.trim(),
          couponCode,
          notes,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.error || 'Failed to place order.');
        setLoading(false);
        return;
      }

      const order = orderData.order;

      await clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      alert(err.message || 'Payment processing error.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center text-white">
        <p>Your cart is empty. Please add items before checkout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-railway-400" />
          <h1 className="text-3xl font-extrabold text-white">256-Bit SSL Direct Secure Checkout</h1>
        </div>

        {validationError && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-xs font-bold shadow-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Shipping Address */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-railway-400" /> 1. Shipping Address & Dispatch Details
                </h2>
                {addresses.length > 0 && !showNewAddress && (
                  <button
                    onClick={() => setShowNewAddress(true)}
                    className="text-xs text-railway-400 font-bold hover:underline"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {!showNewAddress && addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setValidationError(null);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'bg-railway-600/10 border-railway-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs text-white mb-1">
                        <span>{addr.label}</span>
                        {selectedAddressId === addr.id && <Check className="w-4 h-4 text-railway-400" />}
                      </div>
                      <p className="text-xs font-semibold text-slate-200">{addr.fullName}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{addr.street}</p>
                      <p className="text-[11px] text-slate-400">
                        {addr.city}, {addr.state} - {addr.zipCode}
                      </p>
                      <p className="text-[11px] text-slate-400">Ph: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleCreateAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Address Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Site Office"
                      value={newAddr.label}
                      onChange={(e) => {
                        setNewAddr({ ...newAddr, label: e.target.value });
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={newAddr.fullName}
                      onChange={(e) => {
                        setNewAddr({ ...newAddr, fullName: e.target.value });
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Mobile Phone Number</label>
                    <input
                      type="text"
                      placeholder="10-digit mobile number"
                      value={newAddr.phone}
                      onChange={(e) => {
                        setNewAddr({ ...newAddr, phone: e.target.value });
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      placeholder="6-digit PIN code"
                      value={newAddr.zipCode}
                      onChange={(e) => {
                        setNewAddr({ ...newAddr, zipCode: e.target.value });
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-slate-400 block mb-1">Street / Workshop / Site Address</label>
                    <input
                      type="text"
                      placeholder="House/Plot No, Street, Landmark"
                      value={newAddr.street}
                      onChange={(e) => {
                        setNewAddr({ ...newAddr, street: e.target.value });
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => {
                        setNewAddr({ ...newAddr, city: e.target.value });
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddr.state}
                      onChange={(e) => {
                        setNewAddr({ ...newAddr, state: e.target.value });
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="bg-railway-600 hover:bg-railway-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs"
                    >
                      Save Shipping Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddress(false)}
                        className="text-xs text-slate-400 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Direct Payment Method Selection */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-railway-400" /> 2. Direct Bank Online Payment
                </h2>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Zero Gateway Fee
                </span>
              </div>

              {/* Payment Tabs / Radio options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    setPaymentMethod('UPI_QR');
                    setValidationError(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'UPI_QR'
                      ? 'bg-railway-600/15 border-railway-500 text-white shadow-lg shadow-railway-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center gap-1.5 text-white">
                      <QrCode className="w-4 h-4 text-railway-400" /> UPI QR Payment
                    </span>
                    {paymentMethod === 'UPI_QR' && <Check className="w-4 h-4 text-railway-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">GPay / PhonePe / Paytm / BHIM</p>
                </div>

                <div
                  onClick={() => {
                    setPaymentMethod('COD');
                    setValidationError(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'COD'
                      ? 'bg-railway-600/15 border-railway-500 text-white shadow-lg shadow-railway-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-white">Cash on Delivery</span>
                    {paymentMethod === 'COD' && <Check className="w-4 h-4 text-railway-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Pay upon delivery</p>
                </div>
              </div>

              {/* UPI QR Payment Detail Block */}
              {paymentMethod === 'UPI_QR' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* QR Code Container */}
                    <div className="bg-white p-3 rounded-2xl border-4 border-railway-500/30 shadow-2xl flex flex-col items-center flex-shrink-0">
                      <div className="relative w-48 h-64">
                        <Image
                          src="/images/upi-qr.jpg"
                          alt="Freecharge Axis Bank UPI QR Code"
                          fill
                          className="object-contain rounded-lg"
                          unoptimized
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 mt-1 uppercase tracking-wider">
                        Scan to Pay with Any UPI App
                      </span>
                    </div>

                    {/* Payment Info & Copy UPI ID */}
                    <div className="space-y-4 flex-1">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Payee Name:</span>
                          <span className="font-bold text-white text-sm">{PAYEE_NAME}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-2">
                          <span>Linked Bank:</span>
                          <span className="font-bold text-slate-200">Freecharge Biz (Axis Bank)</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-2">
                          <span>Payable Amount:</span>
                          <span className="font-extrabold text-railway-400 text-base">
                            {formatCurrency(totals.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Copyable UPI Box */}
                      <div className="bg-slate-900 border border-railway-500/40 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="text-xs">
                          <span className="text-slate-400 text-[10px] block">Official UPI ID:</span>
                          <span className="font-extrabold text-white font-mono text-sm">{UPI_ID}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="bg-railway-600 hover:bg-railway-500 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          {copiedUpi ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" /> Copy UPI ID
                            </>
                          )}
                        </button>
                      </div>

                      {/* Instructions */}
                      <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <p className="font-bold text-slate-300 flex items-center gap-1 mb-1">
                          <Info className="w-3.5 h-3.5 text-railway-400" /> Payment Steps:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-400">
                          <td>Scan the QR Code above or copy the UPI ID into your UPI App.</td>
                          <td>Enter amount: <strong className="text-white">{formatCurrency(totals.totalAmount)}</strong> and pay.</td>
                          <td>Copy the 12-digit <strong className="text-white">UTR / Transaction ID</strong> from your UPI receipt and enter it below.</td>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* UTR Input Section */}
                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Enter 12-Digit UTR / Transaction ID *</span>
                      <span className="text-[10px] font-normal text-slate-400">(Required for payment verification)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423456789012 or 421298765432"
                      value={utrNumber}
                      onChange={(e) => {
                        setUtrNumber(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-900 border border-railway-500/50 rounded-xl p-3 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-railway-400"
                    />
                  </div>
                </div>
              )}

              {/* COD Option */}
              {paymentMethod === 'COD' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400">
                  <p className="text-slate-300 font-semibold mb-1">Cash on Delivery Selected</p>
                  <p>You can pay in cash or via UPI to our delivery partner when your order arrives at your workshop or site address.</p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Totals Card */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 sticky top-6">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Final Order Review</h3>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[180px]">
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span className="font-bold text-white">
                      {formatCurrency(item.product.price * (1 - item.product.discount / 100) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-semibold">{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>-{formatCurrency(totals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Payable Amount:</span>
                  <span className="text-railway-400">{formatCurrency(totals.totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-railway-600 hover:bg-railway-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-xl shadow-railway-600/30 flex items-center justify-center gap-2"
              >
                {loading ? 'Confirming Order...' : `Confirm & Place Order ${formatCurrency(totals.totalAmount)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
