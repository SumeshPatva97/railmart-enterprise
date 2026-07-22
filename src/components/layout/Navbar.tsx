'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  Train,
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Shield,
  Briefcase,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems, wishlistIds } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Toggle Dark / Light Theme
  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Autocomplete search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data.products || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-white transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-railway-700 via-railway-600 to-indigo-700 py-1.5 px-4 text-center text-xs font-semibold tracking-wider text-blue-100 flex items-center justify-center gap-2">
        <Train className="w-4 h-4 animate-pulse text-amber-300" />
        <span>RDSO Certified Railway Maintenance Tools & Locos | Fast Dispatch Across India</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white group">
          <div className="w-10 h-10 rounded-xl bg-railway-600 flex items-center justify-center shadow-lg shadow-railway-600/30 group-hover:scale-105 transition-transform">
            <Train className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="leading-none text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-railway-300">
              Rail<span className="text-railway-400">Mart</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Enterprise</span>
          </div>
        </Link>

        {/* Autocomplete Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rail benders, LED signals, pantographs, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-railway-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchQuery.trim().length > 1 && (
            <div className="absolute top-12 left-0 right-0 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-xs text-slate-400 text-center">Searching Railway Inventory...</div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      onClick={() => setSearchQuery('')}
                      className="p-3 flex items-center gap-3 hover:bg-slate-800/80 transition-colors"
                    >
                      <div className="w-10 h-10 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.images[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400">SKU: {item.sku} &bull; ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-xs text-slate-400 text-center">No railway equipment found matching "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/products" className="hover:text-railway-400 transition-colors">
            All Products
          </Link>
          <Link href="/products?category=track-maintenance-equipment" className="hover:text-railway-400 transition-colors">
            Track Tools
          </Link>
          <Link href="/products?category=signaling-and-interlocking" className="hover:text-railway-400 transition-colors">
            Signaling
          </Link>
          <Link href="/products?category=locomotive-electrical-spares" className="hover:text-railway-400 transition-colors">
            Loco Spares
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Wishlist Icon */}
          <Link
            href="/account?tab=wishlist"
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-railway-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Admin Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800 transition-colors border border-slate-700"
              >
                <div className="w-7 h-7 rounded-full bg-railway-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800">
                  <div className="px-4 py-2">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-railway-500/20 text-railway-400 border border-railway-500/30">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <User className="w-4 h-4 text-railway-400" /> My Orders & Profile
                    </Link>

                    {user.role === 'ADMIN' && (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2 text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2 transition-colors font-semibold"
                        >
                          <Shield className="w-4 h-4 text-amber-400" /> Admin Dashboard
                        </Link>
                        <Link
                          href="/admin/crm"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2 text-xs text-emerald-300 hover:bg-slate-800 flex items-center gap-2 transition-colors font-semibold"
                        >
                          <Briefcase className="w-4 h-4 text-emerald-400" /> Enterprise CRM Panel
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-railway-600 hover:bg-railway-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-md shadow-railway-600/30 flex items-center gap-1.5"
            >
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools, signals, loco parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-white"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 py-1.5">
              All Products
            </Link>
            <Link href="/products?category=track-maintenance-equipment" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 py-1.5">
              Track Maintenance
            </Link>
            <Link href="/products?category=signaling-and-interlocking" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 py-1.5">
              Signaling
            </Link>

            {user?.role === 'ADMIN' && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-amber-400 block py-1">
                  Admin Dashboard
                </Link>
                <Link href="/admin/crm" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-emerald-400 block py-1">
                  Enterprise CRM Panel
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
