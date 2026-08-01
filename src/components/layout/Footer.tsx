'use client';

import React from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Col 1: Brand & Logo */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-white group">
            <img
              src="/images/logo.png"
              alt="ENTERPRISE D TEAM BY BHIMDADA Logo"
              className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-extrabold text-white">
              ENTERPRISE <span className="text-amber-400">D TEAM</span> BY BHIMDADA
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Domain: <strong>denterpriese.softvps.in</strong>. High-Speed IRCTC Tatkal Ticket Booking Tools & Extensions with 7:30 AM to 12:00 AM dedicated support.
          </p>
          <div className="pt-2">
            <a
              href="https://whatsapp.com/channel/0029Vb8ikne7Noa8Auu2yp0T"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" /> Join Daily Update WhatsApp Channel
            </a>
          </div>
        </div>

        {/* Col 2: Tatkal Products 1-6 */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Tatkal Products</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products/gadar-tatkal-software" className="hover:text-amber-400 transition-colors">1) GADAR - ₹1,199</Link></li>
            <li><Link href="/products/star-ts-tatkal-software" className="hover:text-amber-400 transition-colors">2) STAR_TS - ₹1,149</Link></li>
            <li><Link href="/products/pro-max-tatkal-software" className="hover:text-amber-400 transition-colors">3) PRO MAX - ₹1,499</Link></li>
            <li><Link href="/products/hitman-tatkal-software" className="hover:text-amber-400 transition-colors">4) HITMAN - ₹1,399</Link></li>
            <li><Link href="/products/superman-tatkal-software" className="hover:text-amber-400 transition-colors">5) SUPERMAN - ₹1,599</Link></li>
            <li><Link href="/products/bts-black-turbo-tatkal-software" className="hover:text-amber-400 transition-colors">6) BTS (Black Turbo) - ₹1,599</Link></li>
          </ul>
        </div>

        {/* Col 3: Tatkal Softwares II 7-12 */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Tatkal Softwares II</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products/panda-tatkal-software" className="hover:text-amber-400 transition-colors">7) PANDA - ₹1,599</Link></li>
            <li><Link href="/products/window-ts-tatkal-software" className="hover:text-amber-400 transition-colors">8) WINDOW TS - ₹1,899</Link></li>
            <li><Link href="/products/avatar-tatkal-software" className="hover:text-amber-400 transition-colors">9) AVATAR - ₹1,099</Link></li>
            <li><Link href="/products/ocean-tatkal-extension" className="hover:text-amber-400 transition-colors">10) OCEAN EXTENSION - ₹699</Link></li>
            <li><Link href="/products/bingo-tatkal-software" className="hover:text-amber-400 transition-colors">11) BINGO - ₹1,499</Link></li>
            <li><Link href="/products/ranger-tatkal-software" className="hover:text-amber-400 transition-colors">12) RANGER - ₹1,449</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact Team */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Contact Team</h4>
          <address className="not-italic text-xs leading-relaxed space-y-2 text-slate-400">
            <p className="text-amber-400 font-bold text-xs uppercase tracking-wider">SUPER MASTER BHIMDADA</p>
            <p className="text-emerald-400 font-bold">Contact: +66805849689</p>
            <p className="text-slate-300">Support Hours: 7:30 AM to 12:00 AM</p>
            <p className="text-slate-400">Services: Software, VPS, IP, IRCTC ID</p>
          </address>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} ENTERPRISE D TEAM BY BHIMDADA. All Rights Reserved.</p>
        <div className="flex items-center gap-6">
          <span className="text-slate-400">Domain: denterpriese.softvps.in</span>
          <a href="https://whatsapp.com/channel/0029Vb8ikne7Noa8Auu2yp0T" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">WhatsApp Channel</a>
        </div>
      </div>
    </footer>
  );
}
