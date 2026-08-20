'use client';

import React from 'react';
import Link from 'next/link';
import { Send, PhoneCall, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getWhatsAppUrl } from '@/lib/utils';

export function Footer() {
  const { user } = useAuth();
  const whatsappUrl = getWhatsAppUrl(user?.email);

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-14 pb-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand & Logo */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-white group">
            <img
              src="/images/logo.png"
              alt="D ENTERPRISE TEAM Logo"
              className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="font-heading text-lg font-extrabold text-white">
              D <span className="text-amber-400">ENTERPRISE</span> TEAM
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Domain: <strong className="text-white font-mono">denterpriese.softvps.in</strong>. High-Speed Tatkal Ticket Booking Tools & Extensions with 7:30 AM to 12:00 AM dedicated support.
          </p>
          <div className="pt-2 flex flex-col items-start gap-2.5 w-full">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" /> WhatsApp Support (+91 8521012621)
            </a>

            <a
              href="https://whatsapp.com/channel/0029Vb8ikne7Noa8Auu2yp0T"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" /> JOIN OUR CHANNEL FOR DAILY UPDATE
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-heading text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Quick Navigation</span>
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span>All Tatkal Softwares</span>
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span>Shopping Cart</span>
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span>My Account & Orders</span>
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span>Wishlist</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Official Services */}
        <div>
          <h4 className="font-heading text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Key Solutions</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>High-Speed Tatkal Booking Desktop Tools</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Multi-PNR Browser Extensions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>VPS & Dedicated High-Speed IP Server Setup</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Instant Software Download & License Key</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Auto-Captcha & Smart Bypass Assistance</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Legal */}
        <div>
          <h4 className="font-heading text-sm font-bold text-white mb-4 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Contact & Support</span>
          </h4>
          <address className="not-italic text-xs leading-relaxed space-y-2 text-slate-400">
            <p className="text-amber-400 font-bold text-xs uppercase tracking-wider">SUPER MASTER BHIMDADA</p>
            <p>
              <a href="tel:8521012621" className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors">
                WhatsApp / Call: +91 8521012621
              </a>
            </p>
            <p className="text-slate-300">Support Desk: 7:30 AM to 12:00 AM</p>
            <p className="text-slate-400 mb-3">Services: Software, VPS, IP, Booking ID</p>
          </address>
          <div className="pt-3 border-t border-slate-900 flex flex-col gap-2 text-xs">
            <Link href="/terms" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              • Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              • Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} D ENTERPRISE TEAM. All Rights Reserved.</p>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono">denterpriese.softvps.in</span>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">WhatsApp Support</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
