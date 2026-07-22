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
  taxAmount: number; // GST
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
}

export function calculateCartTotals(
  items: { price: number; quantity: number; gstPercent?: number; deliveryCharges?: number }[],
  couponDiscount: { type: 'PERCENTAGE' | 'FIXED'; value: number; maxDiscount?: number } | null = null
): CartCalculation {
  let subtotal = 0;
  let totalGst = 0;
  let maxDeliveryFee = 0;

  items.forEach((item) => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const gstRate = (item.gstPercent ?? 18) / 100;
    totalGst += itemSubtotal * gstRate;

    if ((item.deliveryCharges ?? 0) > maxDeliveryFee) {
      maxDeliveryFee = item.deliveryCharges ?? 0;
    }
  });

  const shippingFee = subtotal > 100000 ? 0 : maxDeliveryFee || (subtotal > 0 ? 500 : 0);

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

  const totalAmount = Math.max(0, subtotal + totalGst + shippingFee - discountAmount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(totalGst * 100) / 100,
    shippingFee: Math.round(shippingFee * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}
