# 🚀 RailMart Enterprise - Production Deployment Guide (Live Hone Ki Poori Jankari)

Yeh document **RailMart Enterprise** web application ko Internet par **Live (Production)** karne ke liye step-by-step complete guide hai.

---

## 📑 Index / Vishay-Suchi
1. [Prerequisites (Deployment ke liye kya-kya chahiye)](#1-prerequisites)
2. [Domain Name & DNS Setup](#2-domain-name--dns-setup)
3. [PostgreSQL Database Setup (Neon / Supabase)](#3-postgresql-database-setup)
4. [Environment Variables (`.env.production`) Reference](#4-environment-variables-reference)
5. [Vercel Deployment Guide (Recommended)](#5-vercel-deployment-guide)
6. [VPS / Hostinger Server Deployment (Alternative)](#6-vps--hostinger-server-deployment)
7. [Email SMTP & Payment Gateways Setup](#7-email-smtp--payment-gateways-setup)
8. [Post-Deployment Testing Checklist](#8-post-deployment-testing-checklist)

---

## 1. 🛠️ Prerequisites

Live jaane ke liye aapko in services ke accounts ki zaroorat hogi:

| Service | Recommended Provider | Purpose | Cost |
|---|---|---|---|
| **Domain** | GoDaddy / Hostinger / Namecheap | Custom Web Address (e.g. `denterpriseteam.com`) | Paid (~₹800/yr) |
| **Hosting** | Vercel (or Render / Hostinger VPS) | Next.js Server & Frontend Hosting | Free / Paid |
| **Database** | Neon.tech / Supabase | Production PostgreSQL Database | Free Tier Available |
| **Payment Gateway 1** | Razorpay (Live Mode) | INR Payments (UPI, Cards, NetBanking) | Transaction Fee |
| **Payment Gateway 2** | Stripe (Live Mode) | USD / International Card Payments | Transaction Fee |
| **Email SMTP** | Gmail / Brevo (Sendinblue) | OTP, Password Reset, & Order Receipts | Free (100 emails/day) |
| **Media Hosting** | Cloudinary | Product Images & Assets | Free Tier Available |

---

## 2. 🌐 Domain Name & DNS Setup

Aapne kisi bhi registrar (GoDaddy, Hostinger, Namecheap) se domain kharida ho, uski **DNS Settings** me ye records add karein:

### Case A: Agar Aap Vercel Hosting Use Kar Rahe Hain
- **Type**: `A` | **Name**: `@` | **Value**: `76.76.21.21`
- **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com`

### Case B: Agar Aap Custom VPS Server Use Kar Rahe Hain
- **Type**: `A` | **Name**: `@` | **Value**: `YOUR_SERVER_PUBLIC_IP`
- **Type**: `CNAME` | **Name**: `www` | **Value**: `YOUR_SERVER_PUBLIC_IP`

---

## 3. 🗄️ PostgreSQL Database Setup

Project **Prisma ORM + PostgreSQL** par chalta hai. Local `sqlite` ya `localhost` production me nahi chalega.

### Neon.tech (Recommended Serverless Postgres):
1. [Neon.tech](https://neon.tech) par free account banayein.
2. Naya Project create karein: `railmart-prod-db`.
3. Dashboard se **PostgreSQL Connection String** copy karein:
   ```text
   postgresql://neondb_owner:PASSWORD@ep-xyz-123.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Database Schema Sync Command**:
   Local terminal me ye command chalayein taaki live DB me saare tables (Users, Orders, Products, Leads, SupportTickets) create ho jayein:
   ```bash
   npx prisma db push
   ```

---

## 4. 🔑 Environment Variables (`.env.production`) Reference

Vercel / Hosting platform ke **Environment Variables** section me in sabhi keys ko exact set karein:

```env
# -------------------------------------------------------------
# 1. APP CONFIGURATION
# -------------------------------------------------------------
NEXT_PUBLIC_APP_NAME="D ENTERPRISE TEAM"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# -------------------------------------------------------------
# 2. DATABASE CONFIGURATION
# -------------------------------------------------------------
DATABASE_URL="postgresql://username:password@ep-xyz.neon.tech/neondb?sslmode=require"

# -------------------------------------------------------------
# 3. AUTHENTICATION & COOKIE SECRETS
# -------------------------------------------------------------
JWT_SECRET="generate_a_long_random_secret_string_min_32_chars_2026"
JWT_REFRESH_SECRET="generate_another_long_random_refresh_secret_string_2026"
COOKIE_DOMAIN="yourdomain.com"

# -------------------------------------------------------------
# 4. RAZORPAY PAYMENT GATEWAY (KEYS)
# -------------------------------------------------------------
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"

# -------------------------------------------------------------
# 5. STRIPE PAYMENT GATEWAY (KEYS)
# -------------------------------------------------------------
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"

# -------------------------------------------------------------
# 6. GMAIL SMTP EMAIL CONFIGURATION
# -------------------------------------------------------------
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
EMAIL_FROM="YOUR APP <your_email@gmail.com>"

# -------------------------------------------------------------
# 7. CLOUDINARY MEDIA STORAGE
# -------------------------------------------------------------
CLOUDINARY_CLOUD_NAME="railmart-cloud"
CLOUDINARY_API_KEY="1234567890"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

---

## 5. ⚡ Vercel Deployment Guide (Recommended)

Vercel Next.js ka official hosting platform hai. Isme deployment 100% automated aur SSL (HTTPS) free hai.

### Steps:
1. **GitHub Connection**:
   - Aapka code pehle se hi GitHub repo `SumeshPatva97/railmart-enterprise` me pushed hai.
2. **Vercel Project Import**:
   - [Vercel.com](https://vercel.com) par login karein.
   - **"Add New"** -> **"Project"** par click karein.
   - GitHub Repository `railmart-enterprise` select karein.
3. **Environment Variables Add Karein**:
   - Section *Environment Variables* me upar diye gaye sabhi `.env` keys paste karein.
4. **Deploy**:
   - **"Deploy"** button dabayein. Vercel automatically `npx prisma generate` aur `next build` karke site live kar dega.
5. **Custom Domain Connect**:
   - Project -> **Settings** -> **Domains**.
   - `yourdomain.com` type karke add karein aur DNS verify karein.

---

## 6. 🖥️ VPS / Hostinger Server Deployment (Alternative)

Agar aap Ubuntu VPS (Hostinger, DigitalOcean, AWS EC2) par deploy kar rahe hain:

### Step 1: Install Node.js, PM2 & Nginx
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -y pm2 -g
```

### Step 2: Clone & Build Application
```bash
cd /var/www
git clone https://github.com/SumeshPatva97/railmart-enterprise.git tatkal
cd tatkal
npm install
nano .env  # (Copy all .env variables here)
npx prisma db push
npm run build
```

### Step 3: Start Application with PM2
```bash
pm2 start npm --name "railmart" -- run start
pm2 save
pm2 startup
```

### Step 4: Nginx Reverse Proxy Setup
`/etc/nginx/sites-available/default` file ko edit karein:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Nginx restart karein aur SSL Certbot install karein:
```bash
sudo systemctl restart nginx
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 7. 📧 Email SMTP & Payment Gateways Setup

### A. Gmail App Password Setup:
1. Apne Google Account me **Security** -> **2-Step Verification** ON karein.
2. Search bar me type karein: **"App Passwords"**.
3. App Name: `RailMart Enterprise` chunne par 16-digit password milega (e.g., `abcd efgh ijkl mnop`).
4. Is 16-digit password ko `.env` me `SMTP_PASS` ki jagah rakhein.

### B. Razorpay Live Mode Setup:
1. [Razorpay Dashboard](https://dashboard.razorpay.com) me login karke Mode **"Test"** se **"Live"** switch karein.
2. **Account & Settings** -> **API Keys** -> Generate Live Key ID & Secret.
3. Live Key ID ko `RAZORPAY_KEY_ID` aur `NEXT_PUBLIC_RAZORPAY_KEY_ID` me set karein.

---

## 8. ✅ Post-Deployment Testing Checklist

Live jaane ke baad in sabhi features ko ek baar check karein:

- [ ] Domain HTTPS (SSL Certificate) active hai.
- [ ] New User Registration & Login working correctly.
- [ ] Email OTP Verification Code inbox me receive ho raha hai.
- [ ] Product Cart & Checkout page properly amount calculate kar raha hai.
- [ ] Razorpay / Stripe Payment modal open ho raha hai aur success order generate ho raha hai.
- [ ] Admin Panel (`/admin`) me Naye Customer aur Orders dikhai de rahe hain.
- [ ] CRM Panel (`/admin/crm`) me Leads capture aur Export CSV kaam kar raha hai.
- [ ] Mobile navigation & bottom navigation bars smooth chal rahe hain.

---
**Created by Antigravity AI for D ENTERPRISE TEAM.**
