'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Clock,
  TrendingUp,
  Package,
  Shield,
  Briefcase,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons'>('overview');

  // Products Sub-tab: 'active' (is_deleted = 0) vs 'trash' (is_deleted = 1)
  const [productSubTab, setProductSubTab] = useState<'active' | 'trash'>('active');

  // Product Add Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    features: '',
    isVisible: true,
    imageUrlInput: '',
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);

  const fetchProductsList = async () => {
    try {
      const res = await fetch('/api/products?includeDeleted=true&adminView=true&limit=100');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function loadAdminData() {
      if (!user || user.role !== 'ADMIN') return;
      setLoading(true);
      try {
        const [statsRes, ordRes, catRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/orders'),
          fetch('/api/categories'),
        ]);

        if (statsRes.ok) setStats((await statsRes.json()).stats);
        if (ordRes.ok) setOrders((await ordRes.json()).orders || []);
        if (catRes.ok) setCategories((await catRes.json()).categories || []);
        await fetchProductsList();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [user]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Image Upload Handler (PNG, JPG, JPEG) converting to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImgs: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.match('image/(png|jpg|jpeg)')) {
        alert(`File ${file.name} is not a valid PNG, JPG, or JPEG image.`);
        processed++;
        if (processed === files.length) setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          newImgs.push(result);
        }
        processed++;
        if (processed === files.length) {
          setUploadedImages((prev) => [...prev, ...newImgs]);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allImages = [...uploadedImages];
      if (newProd.imageUrlInput.trim()) {
        allImages.push(newProd.imageUrlInput.trim());
      }

      if (allImages.length === 0) {
        // Fallback placeholder image if none uploaded
        allImages.push('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80');
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          features: newProd.features.split('\n').filter(Boolean),
          images: allImages,
          isVisible: newProd.isVisible,
        }),
      });

      if (res.ok) {
        await fetchProductsList();
        setShowAddProduct(false);
        setNewProd({
          name: '',
          sku: '',
          categoryId: '',
          price: '',
          stock: '',
          description: '',
          features: '',
          isVisible: true,
          imageUrlInput: '',
        });
        setUploadedImages([]);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to create product.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Visibility in Catalog
  const handleToggleVisibility = async (slug: string, currentVisibility: boolean) => {
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.slug === slug ? { ...p, isVisible: !currentVisibility } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Soft Delete Product (Set is_deleted = 1)
  const handleSoftDeleteProduct = async (slug: string) => {
    if (!confirm('Are you sure you want to move this product to Trash? It will not be deleted from the database.')) return;
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.slug === slug ? { ...p, is_deleted: 1 } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Restore Soft-Deleted Product (Set is_deleted = 0)
  const handleRestoreProduct = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_deleted: 0 }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.slug === slug ? { ...p, is_deleted: 0 } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-rose-400 font-bold">Access Denied. Admin privileges required.</div>;
  }

  // Filter products by sub-tab (Active vs Trash)
  const activeProducts = products.filter((p) => p.is_deleted === 0 || !p.is_deleted);
  const trashProducts = products.filter((p) => p.is_deleted === 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              <h1 className="text-3xl font-extrabold text-white">RailMart Admin Portal</h1>
            </div>
            <p className="text-slate-400 text-xs mt-1">Manage railway products, inventory stock, order fulfillment, and metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/crm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Briefcase className="w-4 h-4" /> Open Enterprise CRM Hub
            </Link>
          </div>
        </div>

        {/* Analytics Stat Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Total Revenue</p>
                <h3 className="text-2xl font-black text-white mt-1">{formatCurrency(stats.totalRevenue)}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Total Orders</p>
                <h3 className="text-2xl font-black text-white mt-1">{stats.totalOrders}</h3>
              </div>
              <div className="p-3 bg-railway-500/10 text-railway-400 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Pending Orders</p>
                <h3 className="text-2xl font-black text-white mt-1">{stats.pendingOrders}</h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Registered Users</p>
                <h3 className="text-2xl font-black text-white mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Admin Section Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'overview' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Order Fulfillment Desk ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'products' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipment Inventory ({products.length})
          </button>
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === 'overview' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Live Customer Orders & Dispatch Timeline</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{ord.orderNumber}</td>
                      <td className="p-4">
                        <p className="font-semibold text-white">{ord.user?.name}</p>
                        <p className="text-[10px] text-slate-400">{ord.user?.email}</p>
                      </td>
                      <td className="p-4 font-bold text-railway-400">{formatCurrency(ord.totalAmount)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-white px-2 py-1 rounded-lg"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`/api/orders/${ord.id}/invoice`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-railway-400 hover:underline font-bold text-[11px]"
                        >
                          View Invoice
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products Manager */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Product Sub-tabs (Active vs Trash) */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setProductSubTab('active')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    productSubTab === 'active'
                      ? 'bg-railway-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Active Products ({activeProducts.length})
                </button>
                <button
                  onClick={() => setProductSubTab('trash')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    productSubTab === 'trash'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Trash / Soft-Deleted ({trashProducts.length})
                </button>
              </div>

              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-railway-600 hover:bg-railway-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-railway-600/30"
              >
                <Plus className="w-4 h-4" /> Add New Railway Product
              </button>
            </div>

            {/* Active Products Table */}
            {productSubTab === 'active' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-center">Catalog Visibility</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activeProducts.map((p) => {
                      const mainImg = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80';
                      const isVisible = p.isVisible !== false;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden">
                              <img src={mainImg} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-railway-400">{p.sku}</td>
                          <td className="p-4 font-bold text-white">{p.name}</td>
                          <td className="p-4">{p.category?.name}</td>
                          <td className="p-4 font-extrabold text-white">{formatCurrency(p.price)}</td>
                          <td className="p-4 font-bold text-emerald-400">{p.stock} units</td>
                          <td className="p-4 text-center">
                            <label className="inline-flex items-center cursor-pointer gap-2">
                              <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={() => handleToggleVisibility(p.slug, isVisible)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-railway-600 relative"></div>
                              <span className={`text-[11px] font-bold ${isVisible ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {isVisible ? 'Visible' : 'Hidden'}
                              </span>
                            </label>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleSoftDeleteProduct(p.slug)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                              title="Soft Delete (Moves to Trash)"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {activeProducts.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          No active products in inventory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Trash / Soft-Deleted Products Table */}
            {productSubTab === 'trash' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Soft-Deleted Products are preserved in the database (is_deleted = 1) and hidden from customers. You can restore them anytime.</span>
                </div>
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status Key</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {trashProducts.map((p) => {
                      const mainImg = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80';

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden opacity-60">
                              <img src={mainImg} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-400">{p.sku}</td>
                          <td className="p-4 font-bold text-slate-300 line-through">{p.name}</td>
                          <td className="p-4 font-extrabold text-slate-400">{formatCurrency(p.price)}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              is_deleted = 1
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleRestoreProduct(p.slug)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs shadow-md shadow-emerald-600/20"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Restore Product
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {trashProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Trash is currently empty. No soft-deleted products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Railway Product</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hydraulic Rail Bender 100-Ton"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. RM-TRK-099"
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500 uppercase font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Category</label>
                  <select
                    value={newProd.categoryId}
                    onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="145000"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed specifications, RDSO standards compliance..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
                  required
                />
              </div>

              {/* Product Image Upload Section [png, jpg, jpeg] */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="text-slate-200 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-railway-400" /> Upload Product Image (PNG, JPG, JPEG)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Formats: .png, .jpg, .jpeg</span>
                </label>

                <div className="flex items-center gap-3">
                  <label className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors border border-slate-700 inline-flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-railway-400" /> Choose Image Files
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      multiple
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {isUploading && <span className="text-xs text-railway-400 animate-pulse font-bold">Uploading & processing image...</span>}
                </div>

                {/* Uploaded Image Previews */}
                {uploadedImages.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pt-2">
                    {uploadedImages.map((imgSrc, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0">
                        <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(idx)}
                          className="absolute top-0 right-0 bg-rose-600 text-white p-0.5 rounded-bl hover:bg-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Image URL Input */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="text-[11px] text-slate-400 block mb-1">Or Paste Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newProd.imageUrlInput}
                    onChange={(e) => setNewProd({ ...newProd, imageUrlInput: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Visibility Checkbox */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">Visible in Product List</span>
                  <span className="text-[10px] text-slate-400">If checked, product will be visible in customer catalog.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProd.isVisible}
                    onChange={(e) => setNewProd({ ...newProd, isVisible: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-railway-600"></div>
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-railway-600 hover:bg-railway-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-railway-600/30"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
