'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Home, Package, ShoppingCart, User, ShieldCheck } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Do not render bottom nav on pure auth pages if screen height is constrained
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/verify-otp');
  if (isAuthPage) return null;

  const items = [
    { label: 'Home', href: '/', icon: Home, active: pathname === '/' },
    { label: 'Products', href: '/products', icon: Package, active: pathname.startsWith('/products') },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, active: pathname === '/cart', badge: cartCount },
    { label: 'Account', href: user ? '/account' : '/login', icon: User, active: pathname === '/account' },
  ];

  if (user?.role === 'ADMIN') {
    items.push({
      label: 'Admin',
      href: '/admin',
      icon: ShieldCheck,
      active: pathname.startsWith('/admin'),
    });
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe pt-1 shadow-2xl">
      <div className="flex items-center justify-around h-14 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors relative ${
                item.active
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.active ? 'scale-110' : ''} transition-transform`} />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
