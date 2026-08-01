'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Custom 600ms Ease-Out Cubic smooth scroll animation
  const smoothScrollToTop = () => {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (startPosition === 0) return;

    const startTime = performance.now();
    const duration = 600;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      window.scrollTo(0, startPosition * (1 - easedProgress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <button
      onClick={smoothScrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xl shadow-amber-500/50 border border-amber-300/60 flex items-center justify-center group transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-110 active:translate-y-0 active:scale-95 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
    </button>
  );
}

export default ScrollToTop;
