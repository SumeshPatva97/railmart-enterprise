# RailMart Enterprise - Complete Railway E-Commerce & CRM Platform

**RailMart Enterprise** is a production-grade, enterprise-ready Railway E-Commerce Marketplace and Integrated CRM Platform engineered using Next.js 15, React 19, TypeScript, Prisma ORM, PostgreSQL (with SQLite zero-config dev mode), Tailwind CSS, Razorpay/Stripe payments, Nodemailer, and JWT authentication with Role-Based Access Control (RBAC).

---

## 🚀 Key Features

### 🛒 Customer E-Commerce Experience
- **Modern Premium UI**: Built with glassmorphism touches, dark/light mode toggle, dynamic Framer Motion micro-animations, and responsive mobile drawers.
- **Product Catalog & Advanced Search**: Real-time autocomplete search bar, multi-faceted filtering by Category, Price Range, Minimum Rating, and dynamic Sorting (Price Low/High, Rating, Popularity).
- **Dynamic GST Calculator**: Transparent 18% GST tax breakdown box and insured freight delivery calculator on every product and cart summary.
- **Interactive Cart & Wishlist**: Real-time quantity updates, coupon code validator (`RAIL10`, `TATKAL5000`), and persistent wishlist favorites.
- **Multi-Step Checkout**: Saved address selector, new site office address creator, payment gateway options (Razorpay, Stripe, Cash on Delivery).
- **Order Tracking & Tax Invoices**: Live timeline status tracking (Pending → Confirmed → Packed → Shipped → Delivered) and 1-click Tax Invoice PDF generation.

### 🛡️ Secure Admin Portal (`/admin`)
- **Real-Time Analytics**: Visual cards for Total Revenue, Total Orders, Pending Orders count, Registered Users, and Monthly Sales.
- **Order Fulfillment Desk**: Inline order status updates, payment verification, and courier tracking details modifier.
- **Inventory Management**: Create, edit, and delete railway spares, SKUs, prices, stock levels, and features.

### 💼 Enterprise CRM Hub (`/admin/crm`)
- **Lead Management Pipeline**: Full pipeline tracking for railway contractors (New → Contacted → Qualified → Converted → Lost).
- **Support Desk & Internal Staff Notes**: Multi-threaded support tickets with private internal staff notes for audit trails.
- **Reminders & Follow-up Calendar**: Tasks and follow-up calendar for bulk quotation queries.
- **CSV Data Exporter**: Instant download of reports for Orders, Revenue, Inventory, and Leads.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Next.js API Routes, Node.js, Prisma ORM, JWT, bcryptjs |
| **Database** | PostgreSQL / SQLite (Development engine included) |
| **Payments** | Razorpay SDK, Stripe SDK, Cash on Delivery |
| **Emails** | Nodemailer (OTP Verification, Order Confirmation) |

---

## 📁 Project Structure

```
tatkal/
├── prisma/
│   ├── schema.prisma          # PostgreSQL / SQLite Database Schema (20+ entities)
│   └── seed.ts                # Database seeder script
├── scripts/
│   └── run-tests.mjs          # Unit test runner
├── src/
│   ├── app/                   # Next.js 15 App Router
│   │   ├── (auth)/            # Login, Register, Verify OTP
│   │   ├── (shop)/            # Products catalog, Product details, Cart, Checkout
│   │   ├── account/           # Customer account portal, Order tracking, Tickets
│   │   ├── admin/             # Admin Dashboard & Order fulfillment
│   │   │   └── crm/           # Enterprise CRM Panel
│   │   ├── api/               # REST APIs for Auth, Products, Cart, Orders, Payments, CRM
│   │   ├── globals.css        # Tailwind styles & theme variables
│   │   ├── layout.tsx         # Root layout with Auth & Cart Contexts
│   │   └── page.tsx           # Modern Homepage
│   ├── components/            # Layout, Home, Shop, Admin & CRM components
│   ├── context/               # AuthContext & CartContext
│   ├── lib/                   # Prisma, Auth, Mailer, Razorpay, Stripe, PDF Invoice generator
│   └── types/                 # TypeScript interfaces
├── .env.example               # Environment template
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Start & Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="railmart_super_secret_jwt_key_2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_railmart_key_id"
RAZORPAY_KEY_SECRET="rzp_test_railmart_secret_key"
```

### 3. Database Migration & Seeding
Initialize the database tables and populate sample railway products, categories, admin, customer, coupons, and CRM leads:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@railmart.com` | `Admin@123456` | Full Admin Dashboard & Enterprise CRM Hub |
| **Customer** | `customer@railmart.com` | `Customer@123456` | Shop Catalog, Cart, Checkout & Orders Portal |

---

## 🧪 Running Automated Tests

Run the test suite to verify cart calculations, GST tax calculations, and coupon validation logic:
```bash
npm test
```

---

## 🚢 Production Deployment Guide

### Deploying to Vercel & PostgreSQL
1. Push the code repository to GitHub/GitLab.
2. Provision a PostgreSQL database (e.g. Supabase, Neon, or NeonDB).
3. Set `DATABASE_URL="postgresql://user:pass@host:5432/dbname"` in Vercel environment variables.
4. Deploy on Vercel with command `npm run build`.

---
&copy; 2026 RailMart Enterprise. All rights reserved.
