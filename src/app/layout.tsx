import type { Metadata } from 'next';
import { Roboto, Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { AnnouncementTicker } from '@/components/common/AnnouncementTicker';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { Preloader } from '@/components/common/Preloader';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'D ENTERPRISE TEAM | Official Tatkal Software & Extension Portal',
  description: 'Official Portal for High-Speed Tatkal Ticket Booking Software & Extensions: GADAR, STAR_TS, PRO MAX, HITMAN, SUPERMAN, BTS, PANDA, WINDOW TS, AVATAR, OCEAN EXTENSION, BINGO & RANGER.',
  keywords: 'tatkal software, ticket booking tatkal, gadar tatkal, star ts, pro max tatkal, hitman software, bts black turbo, ticket booking extension, d enterprise team',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'D ENTERPRISE TEAM - Tatkal Software Portal',
    description: 'Procure official high-speed Tatkal ticket booking softwares and extensions with 7:30 AM to 12:00 AM dedicated support.',
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
      <body className={`${roboto.variable} ${montserrat.variable} font-sans bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between overflow-x-hidden w-full`}>
        <AuthProvider>
          <CartProvider>
            <Preloader />
            <AnnouncementTicker />
            <Navbar />
            <main className="flex-1 pb-16 sm:pb-0 w-full min-w-0">{children}</main>
            <Footer />
            <MobileBottomNav />
            <ScrollToTop />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
