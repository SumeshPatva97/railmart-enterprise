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
  Edit,
  Trash2,
  RotateCcw,
  Upload,
  X,
  Image as ImageIcon,
  XCircle,
  FileText,
  Lock,
  UserPlus,
  Activity,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Filter,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center gap-4 py-3 border-b border-slate-800/60">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="h-4 bg-slate-800/70 rounded-md flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl animate-pulse flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-800 rounded"></div>
            <div className="h-7 w-28 bg-slate-700 rounded"></div>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Independent API loading booleans per tab (Granular Skeletons)
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Async action processing states (Prevent duplicate requests)
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [adminAlert, setAdminAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Tabs: 'overview' | 'products' | 'users' | 'logs'
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'logs'>('overview');

  // Order Status Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Products Sub-tab: 'active' (is_deleted = 0) vs 'trash' (is_deleted = 1)
  const [productSubTab, setProductSubTab] = useState<'active' | 'trash'>('active');

  // Product Add / Edit Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductSlug, setEditingProductSlug] = useState<string | null>(null);

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

  // Add / Edit User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
  });

  const [categories, setCategories] = useState<any[]>([]);

  // Granular Section Fetchers
  const fetchProductsList = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products?includeDeleted=true&adminView=true&limit=100');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchUsersList = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchOrdersList = async () => {
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

  useEffect(() => {
    async function loadAdminData() {
      if (!user || user.role !== 'ADMIN') return;
      setLoadingStats(true);
      try {
        const [statsRes, catRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/categories'),
        ]);

        if (statsRes.ok) setStats((await statsRes.json()).stats);
        if (catRes.ok) setCategories((await catRes.json()).categories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }

      // Fetch tab sections in background
      fetchOrdersList();
      fetchProductsList();
      fetchUsersList();
      fetchAuditLogs();
    }
    loadAdminData();
  }, [user]);

  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    if (processingOrderId === orderId) return;
    setProcessingOrderId(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        const updatedOrd = (await res.json()).order;
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updatedOrd } : o)));
        fetchAuditLogs();
        setAdminAlert({
          type: 'success',
          message: `Order #${updatedOrd.orderNumber} status updated to ${status} successfully!`,
        });
        setTimeout(() => setAdminAlert(null), 4000);
      } else {
        const err = await res.json();
        setAdminAlert({ type: 'error', message: err.error || 'Failed to update order status.' });
        setTimeout(() => setAdminAlert(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleAdminApproveRefund = async (orderId: string, orderNumber: string, amount: number) => {
    if (processingOrderId === orderId) return;
    if (!confirm(`Are you sure you want to approve full refund of ${formatCurrency(amount)} for Order #${orderNumber}?`)) return;

    await handleUpdateOrderStatus(orderId, 'REFUNDED', 'REFUNDED');
  };

  const handleAdminCancelOrder = async (orderId: string, orderNumber: string) => {
    if (processingOrderId === orderId) return;
    if (!confirm(`Are you sure you want to cancel Order #${orderNumber}?`)) return;

    await handleUpdateOrderStatus(orderId, 'CANCELLED');
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

  // Open Edit Product Modal
  const openEditModal = (p: any) => {
    let featText = '';
    try {
      featText = Array.isArray(p.features) ? p.features.join('\n') : (typeof p.features === 'string' && p.features.startsWith('[') ? JSON.parse(p.features).join('\n') : p.features);
    } catch {
      featText = p.features || '';
    }

    setEditingProductSlug(p.slug);
    setNewProd({
      name: p.name,
      sku: p.sku,
      categoryId: p.categoryId || '',
      price: String(p.price),
      stock: String(p.stock),
      description: p.description || '',
      features: featText,
      isVisible: p.isVisible !== false,
      imageUrlInput: '',
    });
    setUploadedImages(p.images?.map((img: any) => img.url) || []);
    setShowAddProduct(true);
  };

  // Handle Save (Create or Edit Product)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingProduct) return;
    setIsSubmittingProduct(true);

    try {
      const allImages = [...uploadedImages];
      if (newProd.imageUrlInput.trim()) {
        allImages.push(newProd.imageUrlInput.trim());
      }

      if (allImages.length === 0) {
        allImages.push('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80');
      }

      const isEdit = Boolean(editingProductSlug);
      const url = isEdit ? `/api/products/${editingProductSlug}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProd.name,
          sku: newProd.sku,
          categoryId: newProd.categoryId,
          price: newProd.price,
          stock: newProd.stock,
          description: newProd.description,
          features: newProd.features.split('\n').filter(Boolean),
          images: allImages,
          isVisible: newProd.isVisible,
        }),
      });

      if (res.ok) {
        await fetchProductsList();
        await fetchAuditLogs();
        setShowAddProduct(false);
        setEditingProductSlug(null);
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
        setAdminAlert({ type: 'success', message: `Product ${isEdit ? 'updated' : 'created'} successfully!` });
        setTimeout(() => setAdminAlert(null), 4000);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save product.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingProduct(false);
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
        fetchAuditLogs();
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
        fetchAuditLogs();
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
        fetchAuditLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Customer Modal
  const openEditUserModal = (u: any) => {
    setEditingUser(u);
    setUserFormData({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      password: '',
      role: u.role || 'CUSTOMER',
    });
    setShowAddUserModal(true);
  };

  // Handle Save User (Create or Edit Customer)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingUser) return;
    setIsSubmittingUser(true);

    try {
      const isEdit = Boolean(editingUser);
      const url = '/api/admin/users';
      const method = isEdit ? 'PUT' : 'POST';

      const bodyData = isEdit
        ? { userId: editingUser.id, ...userFormData }
        : userFormData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        await fetchUsersList();
        await fetchAuditLogs();
        setShowAddUserModal(false);
        setEditingUser(null);
        setUserFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'CUSTOMER',
        });
        setAdminAlert({ type: 'success', message: `User ${isEdit ? 'updated' : 'created'} successfully!` });
        setTimeout(() => setAdminAlert(null), 4000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save customer.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingUser(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-rose-400 font-bold">Access Denied. Admin privileges required.</div>;
  }

  // Filter products by sub-tab (Active vs Trash)
  const activeProducts = products.filter((p) => p.is_deleted === 0 || !p.is_deleted);
  const trashProducts = products.filter((p) => p.is_deleted === 1);

  // Filter orders by selected status filter
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'ALL') return true;
    return o.status === orderStatusFilter;
  });

  const refundRequestedCount = orders.filter((o) => o.status === 'REFUND_REQUESTED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              <h1 className="text-3xl font-extrabold text-white">RailMart Admin Portal</h1>
            </div>
            <p className="text-slate-400 text-xs mt-1">Manage railway products, inventory stock, order fulfillment, refund approvals, and immutable audit logs.</p>
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

        {/* Global Feedback Banner Alert */}
        {adminAlert && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs font-extrabold flex items-center justify-between shadow-lg ${
              adminAlert.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {adminAlert.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{adminAlert.message}</span>
            </div>
            <button onClick={() => setAdminAlert(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Analytics Stat Cards */}
        {loadingStats ? (
          <StatCardsSkeleton />
        ) : (
          stats && (
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
                  <p className="text-xs text-slate-400 font-bold uppercase">Refund Requests</p>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">{refundRequestedCount} Pending</h3>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                  <RotateCcw className="w-6 h-6" />
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
          )
        )}

        {/* Admin Section Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setActiveTab('overview');
              if (orders.length === 0) fetchOrdersList();
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'overview' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Order Fulfillment Desk ({orders.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              if (products.length === 0) fetchProductsList();
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'products' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipment Inventory ({products.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              if (usersList.length === 0) fetchUsersList();
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Customers & Users ({usersList.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('logs');
              if (auditLogs.length === 0) fetchAuditLogs();
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-railway-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" /> Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Order Status Filters */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 px-3">
                <Filter className="w-3.5 h-3.5 text-railway-400" /> Filter Orders:
              </span>
              {[
                { label: 'All Orders', value: 'ALL', count: orders.length },
                { label: 'Pending', value: 'PENDING', count: orders.filter((o) => o.status === 'PENDING').length },
                { label: 'Delivered', value: 'DELIVERED', count: orders.filter((o) => o.status === 'DELIVERED').length },
                { label: 'Refund Requested', value: 'REFUND_REQUESTED', count: refundRequestedCount, highlight: true },
                { label: 'Refunded', value: 'REFUNDED', count: orders.filter((o) => o.status === 'REFUNDED').length },
                { label: 'Cancelled', value: 'CANCELLED', count: orders.filter((o) => o.status === 'CANCELLED').length },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setOrderStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderStatusFilter === f.value
                      ? f.highlight
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                        : 'bg-railway-600 text-white shadow'
                      : f.highlight && f.count > 0
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-950/60'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Orders Data Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Live Customer Orders & Dispatch Timeline</h3>
              </div>

              {loadingOrders && orders.length === 0 ? (
                <TableSkeleton rows={6} cols={6} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status Workflow</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredOrders.map((ord) => {
                        const isProcessingThis = processingOrderId === ord.id;
                        const isCancelled = ord.status === 'CANCELLED';
                        const isRefundRequested = ord.status === 'REFUND_REQUESTED';
                        const isRefunded = ord.status === 'REFUNDED';

                        return (
                          <tr key={ord.id} className={`hover:bg-slate-800/40 ${isRefundRequested ? 'bg-amber-500/5' : ''}`}>
                            <td className="p-4 font-bold text-white">{ord.orderNumber}</td>
                            <td className="p-4">
                              <p className="font-semibold text-white">{ord.user?.name}</p>
                              <p className="text-[10px] text-slate-400">{ord.user?.email}</p>
                            </td>
                            <td className="p-4 font-bold text-railway-400">{formatCurrency(ord.totalAmount)}</td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  ord.paymentStatus === 'REFUNDED'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                {ord.paymentMethod} ({ord.paymentStatus})
                              </span>
                            </td>
                            <td className="p-4">
                              <select
                                value={ord.status}
                                disabled={isProcessingThis}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className={`bg-slate-950 border text-[11px] font-bold px-2 py-1.5 rounded-lg ${
                                  isCancelled
                                    ? 'border-rose-500/50 text-rose-400'
                                    : isRefundRequested
                                    ? 'border-amber-500/60 text-amber-400 bg-amber-500/10 animate-pulse'
                                    : isRefunded
                                    ? 'border-emerald-500/50 text-emerald-400'
                                    : 'border-slate-800 text-white'
                                } ${isProcessingThis ? 'opacity-50 cursor-wait' : ''}`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="PACKED">PACKED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="REFUND_REQUESTED">REFUND REQUESTED</option>
                                <option value="REFUNDED">REFUNDED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {isRefundRequested && (
                                <button
                                  disabled={isProcessingThis}
                                  onClick={() => handleAdminApproveRefund(ord.id, ord.orderNumber, ord.totalAmount)}
                                  className="text-white font-bold text-[11px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-600/30 inline-flex items-center gap-1"
                                >
                                  {isProcessingThis ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Refund
                                    </>
                                  )}
                                </button>
                              )}

                              {!isCancelled && !isRefunded && (
                                <button
                                  disabled={isProcessingThis}
                                  onClick={() => handleAdminCancelOrder(ord.id, ord.orderNumber)}
                                  className="text-rose-400 hover:text-rose-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-[11px] bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/20"
                                >
                                  {isProcessingThis ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                              )}

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
                        );
                      })}

                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            No orders matching filter "{orderStatusFilter}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
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
                onClick={() => {
                  setEditingProductSlug(null);
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
                  setShowAddProduct(true);
                }}
                className="bg-railway-600 hover:bg-railway-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-railway-600/30"
              >
                <Plus className="w-4 h-4" /> Add New Railway Product
              </button>
            </div>

            {loadingProducts && products.length === 0 ? (
              <TableSkeleton rows={6} cols={7} />
            ) : (
              productSubTab === 'active' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">IMAGE</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">PRODUCT NAME</th>
                        <th className="p-4">CATEGORY</th>
                        <th className="p-4">PRICE</th>
                        <th className="p-4">STOCK</th>
                        <th className="p-4 text-center">CATALOG VISIBILITY</th>
                        <th className="p-4 text-right">ACTIONS</th>
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
                                  {isVisible ? 'Visible' : 'Disabled'}
                                </span>
                              </label>
                            </td>
                            <td className="p-4 text-right space-x-1">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                                title="Edit Product Details"
                              >
                                <Edit className="w-3.5 h-3.5 text-railway-400" /> Edit
                              </button>
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
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Soft-Deleted Products are preserved in the database (is_deleted = 1) and hidden from customers. You can restore them anytime.</span>
                  </div>
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">IMAGE</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">PRODUCT NAME</th>
                        <th className="p-4">PRICE</th>
                        <th className="p-4">STATUS KEY</th>
                        <th className="p-4 text-right">ACTION</th>
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
              )
            )}
          </div>
        )}

        {/* Tab 3: Customer & User Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Registered Railway Enterprise Accounts</h3>
                <p className="text-[11px] text-slate-400">Manage customer accounts, roles, addresses, and order histories.</p>
              </div>

              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    role: 'CUSTOMER',
                  });
                  setShowAddUserModal(true);
                }}
                className="bg-railway-600 hover:bg-railway-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-railway-600/30"
              >
                <UserPlus className="w-4 h-4" /> Add New Customer
              </button>
            </div>

            {loadingUsers && usersList.length === 0 ? (
              <TableSkeleton rows={5} cols={6} />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Orders Placed</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-railway-600 flex items-center justify-center text-xs font-bold text-white">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="p-4 text-slate-300 font-mono">{u.email}</td>
                        <td className="p-4 font-semibold text-slate-300">{u.phone || 'N/A'}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              u.role === 'ADMIN'
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-railway-500/20 text-railway-400 border-railway-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">{u._count?.orders || 0} orders</td>
                        <td className="p-4 text-slate-400">{formatDate(u.createdAt)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openEditUserModal(u)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs border border-slate-700"
                          >
                            <Edit className="w-3.5 h-3.5 text-railway-400" /> Edit Customer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Audit Logs (IMMUTABLE LOGS) */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-extrabold text-white block">Immutable Security Audit Logs</span>
                  <span className="text-slate-400">All customer and administrative operations are recorded with cryptographic timestamps and IP tracking. Audit logs cannot be edited or deleted.</span>
                </div>
              </div>
            </div>

            {loadingLogs && auditLogs.length === 0 ? (
              <TableSkeleton rows={5} cols={5} />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Action Type</th>
                      <th className="p-4">User / Performer</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Audit Operation Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="p-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-extrabold bg-slate-800 text-railway-400 border border-slate-700">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-white">
                          {log.user ? `${log.user.name} (${log.user.email})` : 'System / Guest'}
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                        <td className="p-4 text-slate-300 font-sans leading-relaxed">{log.details}</td>
                      </tr>
                    ))}

                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No audit log activity recorded yet.
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

      {/* Add / Edit Customer Modal */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingUser) {
              setShowAddUserModal(false);
              setEditingUser(null);
            }
          }}
        >
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingUser ? 'Edit Customer Details' : 'Add New Customer Account'}
              </h3>
              <button
                disabled={isSubmittingUser}
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-white p-1 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rajesh@railways.gov.in"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Initial Password</label>
                  <input
                    type="password"
                    placeholder="Leave blank for Customer@123456"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Account Role</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPPORT">SUPPORT</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmittingUser}
                  onClick={() => {
                    setShowAddUserModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-5 py-2 bg-railway-600 hover:bg-railway-500 text-white rounded-xl font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmittingUser ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Customer...
                    </>
                  ) : editingUser ? (
                    'Update Customer'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showAddProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingProduct) {
              setShowAddProduct(false);
              setEditingProductSlug(null);
            }
          }}
        >
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProductSlug ? 'Edit Railway Product' : 'Add New Railway Product'}
              </h3>
              <button
                disabled={isSubmittingProduct}
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProductSlug(null);
                }}
                className="text-slate-400 hover:text-white p-1 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
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
                  <label className="text-slate-300 block mb-1 font-bold flex items-center justify-between">
                    <span>SKU Code</span>
                    {editingProductSlug && <span className="text-[10px] text-amber-400 font-normal">Unique (Read-only)</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RM-TRK-099"
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    disabled={Boolean(editingProductSlug)}
                    className={`w-full border rounded-xl p-2.5 text-white placeholder-slate-500 uppercase font-mono ${
                      editingProductSlug
                        ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800'
                    }`}
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

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Technical Specifications (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="100-Ton Bending Capability&#10;RDSO Approved Design"
                  value={newProd.features}
                  onChange={(e) => setNewProd({ ...newProd, features: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
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
                  disabled={isSubmittingProduct}
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProductSlug(null);
                  }}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-6 py-2.5 bg-railway-600 hover:bg-railway-500 text-white rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-railway-600/30 inline-flex items-center gap-1.5"
                >
                  {isSubmittingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Product...
                    </>
                  ) : editingProductSlug ? (
                    'Update Product'
                  ) : (
                    'Save Product'
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
