import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'RailMart Enterprise | Next-Gen Railway E-Commerce & CRM Platform',
  description: 'Certified Railway Equipment Marketplace: Hydraulic Rail Benders, 110V LED Signals, 25kV Pantographs, and Insulated Safety Tools with instant GST tax credit.',
  keywords: 'railway equipment, track maintenance, hydraulic rail bender, LED signal lamp, pantograph assembly, RDSO certified, railway e-commerce',
  openGraph: {
    title: 'RailMart Enterprise - Railway Equipment Marketplace',
    description: 'Procure certified railway tools, signaling lamps, and locomotive spares with instant GST input credit.',
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
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
