import Link from 'next/link';
import { Train, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-railway-600/20 text-railway-400 border border-railway-500/30 flex items-center justify-center mb-4">
        <Train className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Station Not Found</h1>
      <p className="text-slate-400 text-sm mt-2 max-w-md text-center">
        The railway equipment page or route you were looking for does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="mt-6 bg-railway-600 hover:bg-railway-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Return to Main Junction (Home)
      </Link>
    </div>
  );
}
