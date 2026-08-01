'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Briefcase,
} from 'lucide-react';
import { ProductType } from '@/types';

export function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems, wishlistIds } = useCart();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('railmart_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('railmart_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('railmart_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full overflow-hidden shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Royal Golden Shield Logo */}
        <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-shrink group">
          <img
            src="/images/logo.png"
            alt="ENTERPRISE D TEAM BY BHIMDADA Logo"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="font-black text-xs sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors block leading-tight truncate">
              ENTERPRISE D TEAM
            </span>
            <span className="hidden sm:block text-[10px] text-amber-600 dark:text-amber-400 font-extrabold tracking-wider uppercase mt-0.5">
              BY BHIMDADA
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search Tatkal Softwares, Extensions, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 transition-colors shadow-inner dark:shadow-none"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {(searchResults.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">Searching Software Catalog...</div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      onClick={() => setSearchQuery('')}
                      className="p-3 flex items-center gap-3 hover:bg-amber-50 dark:hover:bg-railway-500/20 transition-colors"
                    >
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={item.images[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">SKU: {item.sku} &bull; ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">No software found matching "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Link href="/products" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            All 12 Softwares
          </Link>
          <Link href="/products?category=tatkal-booking-software" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Tatkal Software
          </Link>
          <Link href="/products?category=tatkal-browser-extensions" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Browser Extensions
          </Link>
          <a
            href="https://whatsapp.com/channel/0029Vb8ikne7Noa8Auu2yp0T"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 font-bold"
          >
            WhatsApp Updates
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {/* Theme Toggle (Desktop/Tablet) */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Wishlist (Desktop/Tablet) */}
          <Link
            href="/account?tab=wishlist"
            className="hidden sm:flex relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Cart Icon (Always Visible) */}
          <Link
            href="/cart"
            className="relative p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs font-bold max-w-[100px] truncate text-slate-900 dark:text-white">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:inline" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="px-4 py-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-700 border border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all rounded-lg mx-1"
                    >
                      <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>My Orders & Profile</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all rounded-lg mx-1"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Admin Control Panel</span>
                        </Link>
                        <Link
                          href="/admin/crm"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all rounded-lg mx-1"
                        >
                          <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Enterprise CRM Panel</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-all rounded-lg mx-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all shadow-md shadow-amber-500/20 flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search Tatkal Softwares, Extensions, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 text-xs">
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-amber-600 dark:text-amber-400 py-2">
              All 12 Softwares
            </Link>
            <Link href="/products?category=tatkal-booking-software" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-slate-700 dark:text-slate-300 py-2">
              Tatkal Booking Software
            </Link>
            <Link href="/products?category=tatkal-browser-extensions" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-slate-700 dark:text-slate-300 py-2">
              Browser Extensions
            </Link>
            <Link href="/account?tab=wishlist" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-rose-600 dark:text-rose-400 py-2 flex items-center justify-between">
              <span>My Wishlist</span>
              {wishlistIds.length > 0 && <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px]">{wishlistIds.length}</span>}
            </Link>
            <a
              href="https://whatsapp.com/channel/0029Vb8ikne7Noa8Auu2yp0T"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 dark:text-emerald-400 py-2"
            >
              Join WhatsApp Channel
            </a>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Switch Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 text-amber-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-1.5 text-[11px] font-bold"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>

            {user?.role === 'ADMIN' && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-amber-600 dark:text-amber-400 block py-2">
                  Admin Dashboard
                </Link>
                <Link href="/admin/crm" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-emerald-600 dark:text-emerald-400 block py-2">
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

export default Navbar;
