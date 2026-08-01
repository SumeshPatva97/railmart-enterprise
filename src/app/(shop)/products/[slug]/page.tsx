'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ProductType, ReviewType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus,
  HelpCircle,
  Check,
  Zap,
  Download,
  PhoneCall,
} from 'lucide-react';

// Product Details Extra Data Mapping from PDF
const productExtraDataMap: Record<string, {
  whyChoose?: string[];
  setupSteps?: string[];
  faqs?: { q: string; a: string }[];
}> = {
  'gadar-tatkal-software': {
    whyChoose: [
      'Fast performance, easy interface & smooth workflow',
      'Multiple PNR booking support without monthly fixed restrictions',
      'Mobile usage support (VPS recommended for peak speed)',
      'Internal data protection system to keep user details secure',
      'Time saving – manual process se kaafi fast',
      'Better success rate with optimized booking flow',
    ],
    setupSteps: [
      'Software ka trusted version download karein',
      'System par install karke open karein',
      'Apne IRCTC login details add karein',
      'Payment method select karein',
      'Required preferences set karein',
      'Booking details enter karke process start karein',
    ],
    faqs: [
      {
        q: 'Gadar Tatkal Software kaise kaam karta hai?',
        a: 'Gadar Tatkal Software ek optimized booking tool hai jo Tatkal ticket process ko fast aur smooth banane ke liye design kiya gaya hai. Iska interface simple hai aur system ko is tarah develop kiya gaya hai ki booking ke dauran errors minimum ho. User data ko secure rakhne ke liye internal protection system bhi use kiya jata hai.',
      },
      {
        q: 'Ek mahine me kitne PNR book kar sakte hain?',
        a: 'Software me multiple booking support available hai, jisse aap ek hi time par kai PNR process kar sakte hain. Monthly booking par koi fixed restriction nahi hota.',
      },
      {
        q: 'Gadar Software kyon choose karein?',
        a: 'Ye software fast performance, easy interface aur smooth workflow provide karta hai. Iska system is tarah optimized hai ki booking process simple aur efficient ho jaye.',
      },
      {
        q: 'Kya ise mobile par इस्तेमाल kar sakte hain?',
        a: 'Haan, aap ise mobile par bhi use kar sakte hain, lekin better performance ke liye VPS server ka use recommended hota hai.',
      },
      {
        q: 'Kya VPS ya IP lena zaroori hai?',
        a: 'Basic usage ke liye zaruri nahi hai, lekin high-speed aur better performance ke liye VPS use karna helpful hota hai.',
      },
    ],
  },
  'star-ts-tatkal-software': {
    whyChoose: [
      'Automated Tatkal booking system',
      'Faster processing with better efficiency',
      'Multi-task booking capability',
      'Flexible login support',
      'User-friendly interface',
      'Optimized success performance',
    ],
    setupSteps: [
      'Software install karke setup complete karein',
      'Apne login details configure karein',
      'Booking information fill karein',
      'Auto mode enable karke process start karein',
    ],
    faqs: [
      {
        q: 'STAR_TS Tatkal Software kya hai?',
        a: 'STAR_TS Tatkal Software ek advanced aur high-performance automation tool hai jo Tatkal ticket booking process ko fast, smooth aur efficient banane ke liye design kiya gaya hai.',
      },
      {
        q: 'Kya multi PNR support available hai?',
        a: 'Haan, ek hi time par multiple PNR process karne ki capability hai jisse success chances improve hote hain.',
      },
      {
        q: 'Upcoming Enhancements kya hain?',
        a: 'Enhanced Payment Flow System – Future updates me payment process ko aur fast aur smooth banane ke liye naye improvements add kiye jayenge.',
      },
    ],
  },
  'pro-max-tatkal-software': {
    whyChoose: [
      'Advanced Booking Technology',
      'Efficient Workflow Management',
      'Easy-to-Use Dashboard',
      'Reliable Performance',
      'Optimized User Experience',
      'Professional Booking Solution',
    ],
    setupSteps: [
      'Install the software on your system',
      'Complete the setup process',
      'Configure your booking details',
      'Manage bookings through the easy dashboard',
      'Enjoy a smooth and efficient booking experience',
    ],
    faqs: [
      {
        q: 'PRO MAX Tatkal Software kya hai?',
        a: 'PRO MAX Tatkal Software ek advanced aur high-performance booking solution hai jo IRCTC ticket booking process ko fast, smooth aur efficient banane ke liye design kiya gaya hai.',
      },
      {
        q: 'PRO MAX kin users ke liye suitable hai?',
        a: 'PRO MAX Tatkal Software un users ke liye ek ideal solution hai jo fast performance, easy management aur professional booking experience ki talaash mein hain.',
      },
    ],
  },
  'hitman-tatkal-software': {
    whyChoose: [
      'Modern & Professional Interface',
      'Efficient Workflow Management',
      'Fast & Responsive Operation',
      'Easy Learning Curve',
      'Stable Performance Experience',
      'Quick Setup Process',
      'Reliable User Support',
      'Continuous Software Improvements',
    ],
    setupSteps: [
      'Software purchase karein',
      'Download aur installation complete karein',
      'Activation process follow karein',
      'Configuration complete karein',
      'Software use karna shuru karein',
    ],
    faqs: [
      {
        q: 'Hitman Tatkal Software kya hai?',
        a: 'Hitman Tatkal Software ek advanced booking assistant solution hai jo users ko efficient workflow management aur smooth software experience provide karta hai.',
      },
      {
        q: 'Kya installation guidance milti hai?',
        a: 'Haan, software ke saath installation aur setup guidance provide ki jati hai.',
      },
      {
        q: 'Kya support available hai?',
        a: 'Haan, activation, setup aur software-related assistance ke liye support available hai.',
      },
      {
        q: 'Kya software updates milte hain?',
        a: 'Haan, software ko regular maintenance aur improvements ke saath update kiya jata hai.',
      },
      {
        q: 'Kya beginners bhi use kar sakte hain?',
        a: 'Bilkul, software ka interface simple aur user-friendly hai jisse beginners bhi aasani se use kar sakte hain.',
      },
    ],
  },
  'superman-tatkal-software': {
    whyChoose: [
      'User-Friendly Dashboard',
      'Organized Workflow Structure',
      'Smooth Software Experience',
      'Reliable Performance',
      'Easy Setup Process',
      'Smart Management Features',
      'Regular Software Improvements',
      'Dedicated Customer Support',
    ],
    setupSteps: [
      'Software purchase karein',
      'Download aur installation complete karein',
      'Activation process follow karein',
      'Required configuration setup karein',
      'Software use karna shuru karein',
    ],
    faqs: [
      {
        q: 'Superman Tatkal Software kya hai?',
        a: 'Superman Tatkal Software ek advanced booking assistant solution hai jo workflow management aur reservation organization me help karta hai.',
      },
      {
        q: 'Kya software install karna easy hai?',
        a: 'Haan, software ke saath setup aur activation guidance provide ki jati hai.',
      },
      {
        q: 'Kya support available hai?',
        a: 'Haan, installation aur software-related assistance ke liye support available hai.',
      },
      {
        q: 'Kya software updates milte hain?',
        a: 'Haan, software ko regular maintenance aur updates ke saath improve kiya jata hai.',
      },
      {
        q: 'Kya beginners bhi use kar sakte hain?',
        a: 'Bilkul, software ka interface simple aur user-friendly hai.',
      },
    ],
  },
  'bts-black-turbo-tatkal-software': {
    whyChoose: [
      'Fast Tatkal Booking System',
      'Multi PNR Booking Support',
      'Stable Performance during heavy traffic',
      'Easy to Use Interface',
      '10% Cashback automatically credited to wallet on order',
      'Direct High Speed Processing Engine',
    ],
    setupSteps: [
      'Purchase BTS (Black Turbo) Tatkal License',
      'Download installer & complete setup',
      'Enter activation key & login credentials',
      'Start high speed Tatkal booking process',
    ],
    faqs: [
      {
        q: 'BTS Black Turbo Software ki special offer kya hai?',
        a: 'Order place karne par 10% cashback automatically aapke wallet mein credit kiya jayega.',
      },
      {
        q: 'Kya demo version available hai?',
        a: 'Demo facility available nahi hai. Terms & conditions apply.',
      },
    ],
  },
  'panda-tatkal-software': {
    whyChoose: [
      'Modern & Clean Dashboard',
      'Easy-to-Use Controls',
      'Efficient Workflow Management',
      'Smooth User Experience',
      'Quick Setup Process',
      'Reliable Performance',
      'Regular Software Improvements',
      'Dedicated Customer Support',
    ],
    setupSteps: [
      'Software purchase karein',
      'Download aur installation complete karein',
      'Activation process follow karein',
      'Required configuration setup karein',
      'Software use karna shuru karein',
    ],
    faqs: [
      {
        q: 'Panda Tatkal Software kya hai?',
        a: 'Panda Tatkal Software ek booking assistant solution hai jo users ko reservation management aur workflow organization me help karta hai.',
      },
      {
        q: 'Kya software install karna easy hai?',
        a: 'Haan, software ke saath setup guidance aur activation assistance provide ki jati hai.',
      },
      {
        q: 'Kya support available hai?',
        a: 'Haan, software-related assistance aur guidance ke liye support available hai.',
      },
      {
        q: 'Kya software updates milte hain?',
        a: 'Haan, software ko regular updates aur improvements ke saath maintain kiya jata hai.',
      },
      {
        q: 'Kya beginners bhi use kar sakte hain?',
        a: 'Bilkul, software ka interface beginner-friendly aur easy-to-use hai.',
      },
    ],
  },
  'window-ts-tatkal-software': {
    whyChoose: [
      'Modern & Professional Interface',
      'Easy-to-Use Controls',
      'Organized Workflow Management',
      'Smooth & Responsive Experience',
      'Reliable Software Performance',
      'Quick Installation Process',
      'Regular Software Updates',
      'Dedicated Support Assistance',
    ],
    setupSteps: [
      'Software purchase karein',
      'Download aur installation complete karein',
      'Activation process follow karein',
      'Configuration settings setup karein',
      'Software use karna shuru karein',
    ],
    faqs: [
      {
        q: 'Window TS Software kya hai?',
        a: 'Window TS Software ek advanced booking assistant solution hai jo workflow management aur reservation organization me help karta hai.',
      },
      {
        q: 'Kya software install karna easy hai?',
        a: 'Haan, software ke saath installation aur setup guidance provide ki jati hai.',
      },
      {
        q: 'Kya support available hai?',
        a: 'Haan, software-related assistance aur guidance ke liye support available hai.',
      },
      {
        q: 'Kya software updates milte hain?',
        a: 'Haan, software ko regular updates aur improvements ke saath maintain kiya jata hai.',
      },
      {
        q: 'Kya beginners bhi use kar sakte hain?',
        a: 'Bilkul, software ka interface simple aur user-friendly hai aur beginners ke liye bhi suitable hai.',
      },
    ],
  },
  'avatar-tatkal-software': {
    whyChoose: [
      'Advanced Booking Technology',
      'Fast & Reliable Performance',
      'User-Friendly Design',
      'Multiple Booking Support',
      'Optimized Workflow Management',
      'Regular Updates & Improvements',
    ],
    setupSteps: [
      'Software install karein aur setup complete karein',
      'Login details configure karein',
      'Passenger information enter karein',
      'Booking process start karein aur workflow manage karein',
    ],
    faqs: [
      {
        q: 'AVATAR Tatkal Software kya hai?',
        a: 'AVATAR Tatkal Software ek powerful aur advanced booking solution hai jo IRCTC Tatkal ticket booking ko fast, smooth aur efficient banane ke liye design kiya gaya hai.',
      },
      {
        q: 'AVATAR Software ke key benefits kya hain?',
        a: 'High-Speed Booking Performance, Multi PNR Support, Smart Auto Fill Technology, Secure & Reliable Environment, User-Friendly Interface.',
      },
    ],
  },
  'ocean-tatkal-extension': {
    whyChoose: [
      'Easy-to-Use Browser Extension Interface',
      'Quick Setup Process',
      'Organized Workflow Management',
      'Responsive User Experience',
      'Reliable Functionality',
      'Modern Browser Compatibility',
      'Regular Software Improvements',
      'Customer Support Assistance',
    ],
    setupSteps: [
      'Extension download karein',
      'Browser me install karein',
      'Required configuration complete karein',
      'Setup guidance follow karein',
      'Extension use karna shuru karein',
    ],
    faqs: [
      {
        q: 'Ocean Tatkal Extension kya hai?',
        a: 'Ocean Tatkal Extension ek browser-based booking assistant extension hai jo workflow management aur organized operation me help karti hai.',
      },
      {
        q: 'Kya extension install karna easy hai?',
        a: 'Haan, extension ka installation process simple hai aur setup guidance bhi provide ki jati hai.',
      },
      {
        q: 'Kya support available hai?',
        a: 'Haan, installation aur extension-related assistance ke liye support available hai.',
      },
      {
        q: 'Kya regular updates milte hain?',
        a: 'Haan, extension ko compatibility aur performance improve karne ke liye regular updates ke saath maintain kiya jata hai.',
      },
      {
        q: 'Kya beginners bhi use kar sakte hain?',
        a: 'Bilkul, extension ka interface simple aur beginner-friendly hai.',
      },
    ],
  },
  'bingo-tatkal-software': {
    whyChoose: [
      'No Token Required',
      'Web Working',
      'Web3 Working',
      'Web5 Working',
      'Direct Login Access',
      'Smooth & Stable Performance',
      'Fast Response & Reliable Speed',
    ],
    setupSteps: [
      'Download BINGO Tatkal Software',
      'Open direct login window without token',
      'Configure passenger & payment credentials',
      'Execute high-speed direct Tatkal booking',
    ],
    faqs: [
      {
        q: 'BINGO Tatkal Software ki specialty kya hai?',
        a: 'BINGO is the ONLY software working WITHOUT TOKEN with direct login access and smooth performance across Web, Web3, and Web5 platforms.',
      },
    ],
  },
  'ranger-tatkal-software': {
    whyChoose: [
      'Best Performance on both App & Web',
      'Smooth & Fast Working',
      'Famous for Stable App Login',
      'Reliable Performance',
      'Quick Response',
      'Seamless Login Experience',
    ],
    setupSteps: [
      'Install RANGER Tatkal Software',
      'Choose App or Web mode',
      'Setup credentials and auto-fill preferences',
      'Start booking with seamless login experience',
    ],
    faqs: [
      {
        q: 'RANGER Tatkal Software kin platforms par work karta hai?',
        a: 'RANGER is built specifically for users who want fast, smooth, and dependable performance on both App and Web with famous stable App login.',
      },
    ],
  },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          if (data.product.images?.length > 0) {
            setSelectedImg(data.product.images[0].url);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-amber-400 font-bold">Loading Product Specs...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-white">Product Not Found.</div>;
  }

  const isFav = isWishlisted(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  let featuresList: string[] = [];
  try {
    featuresList = typeof product.features === 'string' ? JSON.parse(product.features) : product.features || [];
  } catch {
    featuresList = [product.features];
  }

  const extraData = productExtraDataMap[slug] || {
    whyChoose: featuresList,
    setupSteps: [
      'Software download and setup complete karein',
      'IRCTC login details configure karein',
      'Booking details enter karke process start karein',
    ],
    faqs: [
      {
        q: `${product.name} kya hai?`,
        a: product.description,
      },
      {
        q: 'Kya support available hai?',
        a: 'Haan, dedicated support team 7:30 AM se 12:00 AM tak online rehti hai. Contact: +66805849689',
      },
    ],
  };

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    router.push('/checkout');
  };

  const reviewsList: ReviewType[] = product.reviews || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb */}
        <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
          <span>Enterprise D Team</span>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{product.category?.name || 'Tatkal Software'}</span>
          <span>/</span>
          <span className="text-slate-200">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Product Image */}
          <div className="space-y-4">
            <div className="relative h-96 sm:h-[450px] bg-slate-900 rounded-3xl overflow-hidden border border-amber-500/30 flex items-center justify-center p-6 shadow-2xl">
              <img
                src={selectedImg || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-lg"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full border backdrop-blur-md transition-all ${
                  isFav
                    ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(img.url)}
                    className={`w-20 h-20 rounded-xl bg-slate-900 border-2 overflow-hidden flex-shrink-0 transition-all ${
                      selectedImg === img.url ? 'border-amber-400' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs & Pricing */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {product.category?.name || 'Tatkal Software'}
                </span>
                <span className="text-xs text-slate-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{product.name}</h1>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">({product.reviewsCount} verified reviews)</span>
                <span className="text-slate-700">&bull;</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Access Available
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-amber-400">₹{discountedPrice.toLocaleString('en-IN')}/-</span>
                {product.discount > 0 && (
                  <span className="text-base text-slate-500 line-through">₹{product.price.toLocaleString('en-IN')}/-</span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Official Super Master Bhimdada License Key & Fast Support Included.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 uppercase">Licenses:</span>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  Buy Now & Instant Access
                </button>
              </div>
            </div>

            {/* Support Highlight Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Super Master Support Desk</h4>
                  <p className="text-slate-400 text-[11px]">7:30 AM to 12:00 AM Online Support (+66805849689)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated FULL DESCRIPTION Section (Requested by User) */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Product Description</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{product.name} Overview</h2>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/70 p-6 rounded-2xl border border-slate-800/80">
            {product.description}
          </p>
        </div>

        {/* Why Choose Section & Key Features */}
        {extraData.whyChoose && extraData.whyChoose.length > 0 && (
          <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Why Choose {product.name}?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {extraData.whyChoose.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-slate-200 font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Setup / Use Section */}
        {extraData.setupSteps && extraData.setupSteps.length > 0 && (
          <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Download className="w-4 h-4" />
              <span>How to Setup & Use {product.name}</span>
            </div>
            <div className="space-y-3">
              {extraData.setupSteps.map((step, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs text-slate-200 font-semibold">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Specific FAQ Section */}
        {extraData.faqs && extraData.faqs.length > 0 && (
          <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions (FAQ) – {product.name}</span>
            </div>
            <div className="space-y-4">
              {extraData.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 font-mono">Q{idx + 1}.</span> {faq.q}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="mt-12 pt-8 border-t border-slate-900">
          <h2 className="text-2xl font-bold text-white mb-6">User Reviews & Feedback</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-white">{rev.user?.name || 'Verified Buyer'}</span>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-10">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No user reviews yet. Be the first to submit feedback!</p>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-4">
              <h3 className="text-sm font-bold text-white">Leave a Product Review</h3>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Rating</label>
                <div className="flex items-center gap-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)}>
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Comment</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share booking speed and performance experience..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              <button
                onClick={() => {
                  alert('Thank you! Your product review has been submitted.');
                  setReviewComment('');
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 text-xs rounded-xl transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
