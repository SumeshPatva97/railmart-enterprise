export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPPORT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface BrandType {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface ReviewType {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  category?: CategoryType;
  brandId?: string;
  brand?: BrandType;
  description: string;
  features: string; // JSON parsed or string
  price: number;
  discount: number;
  stock: number;
  gstPercent: number;
  deliveryCharges: number;
  rating: number;
  reviewsCount: number;
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
  isFeatured: boolean;
  isPopular: boolean;
  images: { id?: string; url: string; alt?: string; isPrimary?: boolean }[];
  reviews?: ReviewType[];
  createdAt: string;
}

export interface CartItemType {
  id: string;
  productId: string;
  product: ProductType;
  quantity: number;
}

export interface OrderItemType {
  id: string;
  productId: string;
  product: ProductType;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export interface OrderType {
  id: string;
  orderNumber: string;
  userId: string;
  user?: UserProfile;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  shippingAddress: string; // JSON
  billingAddress: string; // JSON
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
  items: OrderItemType[];
}

export interface SupportTicketType {
  id: string;
  ticketNumber: string;
  userId: string;
  user?: UserProfile;
  subject: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  messages?: {
    id: string;
    senderId: string;
    senderType: 'USER' | 'AGENT';
    message: string;
    createdAt: string;
  }[];
}

export interface LeadType {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  source: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
}

export interface CouponType {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  timesUsed: number;
  status: string;
}
