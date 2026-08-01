import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/common/ScrollToTop';

export const metadata: Metadata = {
  title: 'ENTERPRISE D TEAM | Official Tatkal Software & Extension Portal',
  description: 'Official Portal for IRCTC High-Speed Tatkal Ticket Booking Software & Extensions: GADAR, STAR_TS, PRO MAX, HITMAN, SUPERMAN, BTS, PANDA, WINDOW TS, AVATAR, OCEAN EXTENSION, BINGO & RANGER.',
  keywords: 'tatkal software, irctc tatkal booking, gadar tatkal, star ts, pro max tatkal, hitman software, bts black turbo, irctc extension, enterprise d team',
  openGraph: {
    title: 'ENTERPRISE D TEAM BY BHIMDADA - Tatkal Software Portal',
    description: 'Procure official high-speed IRCTC Tatkal softwares and extensions with 7:30 AM to 12:00 AM dedicated support.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
