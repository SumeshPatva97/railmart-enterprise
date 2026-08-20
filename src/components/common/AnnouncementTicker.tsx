'use client';

import React from 'react';
import { PhoneCall, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export function AnnouncementTicker() {
  const announcements = [
    {
      icon: <PhoneCall className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5" />,
      text: '📢 MESSAGE FROM SUPER MASTER BHIMDADA :- 7:30 AM - 12:00 AM Online Support (+91 8521012621)',
      highlight: true,
    },
    {
      icon: <Zap className="w-3.5 h-3.5 text-amber-400 inline mr-1.5" />,
      text: '⚡ 12 High-Speed Official Tatkal Booking Softwares & Browser Extensions Live',
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-400 inline mr-1.5" />,
      text: '🛡️ Instant License Key & Software Download Link Available After Checkout',
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-yellow-300 inline mr-1.5" />,
      text: '⭐ Dedicated Technical Installation & Multi-PNR Configuration Help',
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 py-2.5 z-40 text-xs font-semibold select-none">
      {/* Glow highlight effects */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      {/* Infinite scrolling track using pure Tailwind CSS animation */}
      <div className="flex whitespace-nowrap overflow-hidden">
        {/* Track 1 */}
        <div className="flex items-center space-x-8 animate-marquee shrink-0">
          {announcements.map((item, index) => (
            <div
              key={`ticker-1-${index}`}
              className="flex items-center text-slate-300 hover:text-white transition-colors"
            >
              {item.icon}
              <span className={item.highlight ? 'text-amber-400 font-bold' : ''}>
                {item.text}
              </span>
              <span className="mx-6 text-slate-600 font-bold">•</span>
            </div>
          ))}
        </div>

        {/* Track 2 (Seamless loop) */}
        <div className="flex items-center space-x-8 animate-marquee2 shrink-0">
          {announcements.map((item, index) => (
            <div
              key={`ticker-2-${index}`}
              className="flex items-center text-slate-300 hover:text-white transition-colors"
            >
              {item.icon}
              <span className={item.highlight ? 'text-amber-400 font-bold' : ''}>
                {item.text}
              </span>
              <span className="mx-6 text-slate-600 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementTicker;
