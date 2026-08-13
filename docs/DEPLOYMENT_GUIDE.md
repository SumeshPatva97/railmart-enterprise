# 🚀 Complete Project Deployment & Hosting Guide

A complete, beginner-friendly, and cost-effective guide to deploying the **RailMart Enterprise / Tatkal E-Commerce Application** (`Next.js 15`, `PostgreSQL`, `Prisma`, `Nodemailer`, `Razorpay/Stripe`).

---

## 💰 1. Total Cost Breakdown

| Component | Recommended Provider | Expected Cost |
| :--- | :--- | :--- |
| **Domain Name** (`.com` / `.in`) | Hostinger / GoDaddy / Namecheap | **₹500 - ₹900 / year** |
| **Web Hosting** | Vercel (Hobby Tier) | **₹0 (FREE)** |
| **PostgreSQL Database** | Neon.tech / Supabase | **₹0 (FREE Tier)** |
| **Email SMTP** | Gmail App Password / Resend | **₹0 (FREE - 3,000 emails/mo)** |
| **SSL Certificate** | Vercel (Automatic HTTPS) | **₹0 (FREE)** |
| **Total Estimated Cost** | | **~ ₹500 - ₹900 per year** |

---

## 🛠️ Step-by-Step Deployment Process

### Step 1: Set Up Cloud PostgreSQL Database (Neon.tech)

1. Go to [Neon.tech](https://neon.tech/) and sign up for a free account.
2. Click **Create Project** and give it a name (e.g., `railmart-prod-db`).
3. Select a region closest to your target users (e.g., `AWS Asia Pacific / Singapore` or `Mumbai` if available).
4. Copy the generated **PostgreSQL Connection String**:
   ```text
   postgresql://username:password@ep-xyz.neon.tech/neondb?sslmode=require
   ```
5. From your local machine terminal, run the following commands to create the database schema and populate initial data:
   ```bash
   # Set environment variable temporarily or update your local .env
   npx prisma db push
   npx prisma db seed
   ```

---

### Step 2: Buy & Prepare Domain Name

1. Purchase a domain from **Hostinger**, **GoDaddy**, or **Namecheap** (e.g., `yourbrand.com`).
2. Keep the domain provider dashboard open for DNS configuration in Step 5.

---

### Step 3: Push Source Code to GitHub

1. Ensure `.env` is listed inside `.gitignore` so secrets are not publicly exposed.
2. Commit and push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

---

### Step 4: Deploy App on Vercel

1. Log in to [Vercel.com](https://vercel.com/) with your GitHub account.
2. Click **Add New** -> **Project** and select your GitHub repository.
3. In the **Environment Variables** section, add all required key-value pairs:

#### Required Environment Variables Checklist

| Environment Variable | Description / Value |
| :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | `RailMart Enterprise` (or Client Brand Name) |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` |
| `DATABASE_URL` | Neon.tech PostgreSQL connection string |
| `JWT_SECRET` | Strong random secret string |
| `JWT_REFRESH_SECRET` | Strong random refresh secret string |
| `COOKIE_DOMAIN` | `.yourdomain.com` (or `yourdomain.com`) |
| `RAZORPAY_KEY_ID` | Production Key ID from Client's Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | Production Key Secret from Client's Razorpay Dashboard |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production Key ID (same as above) |
| `STRIPE_SECRET_KEY` | (Optional) Stripe Live Secret Key |
| `STRIPE_WEBHOOK_SECRET` | (Optional) Stripe Webhook Secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (Optional) Stripe Live Publishable Key |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Support Email (e.g., `orders@yourdomain.com` or Gmail) |
| `SMTP_PASS` | Gmail 16-character App Password |
| `EMAIL_FROM` | `RailMart Orders <orders@yourdomain.com>` |
| `CLOUDINARY_CLOUD_NAME` | (Optional) Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | (Optional) Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | (Optional) Cloudinary API Secret |

4. Click **Deploy**. Vercel will automatically build the Next.js app and generate Prisma client.

---

### Step 5: Connect Custom Domain & DNS Configuration

1. In Vercel Project Dashboard, navigate to **Settings** -> **Domains**.
2. Type your domain (e.g., `yourdomain.com` and `www.yourdomain.com`) and click **Add**.
3. Open your Domain Registrar (GoDaddy / Hostinger) **DNS Management** panel and add the following records:

| Record Type | Name / Host | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` | Automatic / 300 |
| **CNAME Record** | `www` | `cname.vercel-dns.com` | Automatic / 300 |

4. Wait 5 to 10 minutes for DNS propagation. SSL (HTTPS) certificate will be provisioned automatically by Vercel.

---

### Step 6: Gmail App Password Setup (For Automated Emails)

1. Open the Google Account used for `SMTP_USER`.
2. Go to **Security** -> Enable **2-Step Verification**.
3. Search for **App Passwords**.
4. Create a new App Password named `RailMart Deployment`.
5. Copy the 16-character code and paste it as `SMTP_PASS` in Vercel Environment Variables.

---

## ✅ Pre-Handover Checklist

Before delivering the project to the client, verify the following:

- [ ] **Admin Authentication**: Test logging into `/login` with Admin credentials.
- [ ] **Payment Gateway**: Perform a real minimum transaction (e.g., ₹1) to confirm Razorpay live mode working.
- [ ] **Email Delivery**: Test reset password flow to ensure emails are arriving in inbox (not spam).
- [ ] **Mobile Responsiveness**: Test site on mobile browsers.
- [ ] **Database Connection**: Ensure products, orders, and users populate correctly from Neon PostgreSQL.

---
*Created on: August 2026 for RailMart Enterprise Project*
