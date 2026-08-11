import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export interface CartCalculation {
  subtotal: number;
  taxAmount: number; // GST (0 - Removed)
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
}

export function calculateCartTotals(
  items: { price: number; quantity: number; gstPercent?: number; deliveryCharges?: number }[],
  couponDiscount: { type: 'PERCENTAGE' | 'FIXED'; value: number; maxDiscount?: number } | null = null
): CartCalculation {
  let subtotal = 0;

  items.forEach((item) => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;
  });

  // Freight Fee / Delivery Fee removed (0)
  const shippingFee = 0;

  let discountAmount = 0;
  if (couponDiscount) {
    if (couponDiscount.type === 'PERCENTAGE') {
      discountAmount = (subtotal * couponDiscount.value) / 100;
      if (couponDiscount.maxDiscount && discountAmount > couponDiscount.maxDiscount) {
        discountAmount = couponDiscount.maxDiscount;
      }
    } else {
      discountAmount = couponDiscount.value;
    }
  }

  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  const totalAmount = Math.max(0, subtotal - discountAmount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: 0,
    shippingFee: 0,
    discountAmount: Math.round(discountAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

export function getWhatsAppUrl(userEmail?: string, customText?: string): string {
  const phone = '918521012621';
  let message = customText || 'Hi, I’m interested in this opportunity. Please contact me and share the relevant details.';
  
  if (userEmail) {
    message += `\n\nYou can also reach me at: ${userEmail}`;
  }
  
  message += `\n\nThank you!`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
