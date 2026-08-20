'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getWhatsAppUrl } from '@/lib/utils';

export function WhatsAppButton() {
  const { user } = useAuth();
  const whatsappUrl = getWhatsAppUrl(user?.email);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Floating CTA Tooltip / Badge */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex flex-col bg-slate-900/95 border border-emerald-500/40 text-white text-xs px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none"
          >
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online Support Desk
            </span>
            <span className="text-[11px] text-slate-300">
              Call / WhatsApp: +91 8521012621
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Pulsing Button */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ping Ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping pointer-events-none" />

        {/* Secondary Pulsing Glow Wave */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60 blur-md animate-pulse pointer-events-none" />

        {/* Action Anchor */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp (+91 8521012621)"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="relative z-10 p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-2xl shadow-emerald-500/60 border border-emerald-200/50 flex items-center justify-center cursor-pointer transition-shadow hover:shadow-emerald-400/80"
          title="Chat on WhatsApp (+91 8521012621)"
        >
          <svg
            className="w-6 h-6 fill-current drop-shadow"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.301-1.127z" />
          </svg>

          {/* Mini active green dot indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-slate-950 rounded-full" />
        </motion.a>
      </div>
    </div>
  );
}

export default WhatsAppButton;
