# 🚀 Aasan Hindi/Hinglish Deployment Guide (Step-by-Step)

Aapke **RailMart Enterprise / Tatkal E-Commerce** project (`Next.js 15`, `PostgreSQL`, `Prisma`, `Nodemailer`, `Razorpay`) ko **kam se kam paise (sirf domain ka kharch ₹500 - ₹900/year)** me live karne ka sabse aasan aur detailed guide.

---

## 💰 1. Total Kitna Kharcha Aayega?

| Service | Kahan Se Lena Hai | Kharcha (Cost) | Note / Detail |
| :--- | :--- | :--- | :--- |
| **1. Domain Name** (`.com` / `.in`) | Hostinger, GoDaddy ya Namecheap | **₹500 - ₹900 / saal** | Yeh akela kharcha hai jo zaroori hai. |
| **2. Website Hosting** | Vercel (Next.js Official Hosting) | **FREE (₹0)** | Unlimited deployment, fast speed. |
| **3. Database (PostgreSQL)** | Neon.tech | **FREE (₹0)** | 500MB cloud database free milta hai. |
| **4. Email Send Karne Ke Liye** | Gmail App Password | **FREE (₹0)** | Daily 500 emails free send kar sakte ho. |
| **5. SSL Certificate (HTTPS)** | Vercel | **FREE (₹0)** | Padlock icon (🔒) automatically active hoga. |
| **TOTAL KHARCHA** | | **Sirf ₹500 - ₹900 / Year!** | |

---

## 🛠️ Step-by-Step Live Karne Ka Tareeka

---

### 🔹 STEP 1: Cloud Database Setup (PostgreSQL)

Aapke project me **PostgreSQL Database** use hua hai. Isse cloud par live karne ke liye:

1. **[Neon.tech](https://neon.tech/)** website par jayein aur Free Account banayein.
2. **"Create Project"** par click karein aur project ka naam rakhein (e.g. `railmart-db`).
3. Region me **Singapore** ya **Mumbai** select karein.
4. Database banne ke baad aapko ek **Connection String** (Database URL) milegi:
   ```text
   postgresql://username:password@ep-xyz.neon.tech/neondb?sslmode=require
   ```
5. Apne computer ke terminal me ye command chala kar live database me tables aur sample items daalein:
   ```bash
   # Pehle local .env me DATABASE_URL ko Neon.tech wali URL se replace karein
   # Phir ye commands chalayein:
   npx prisma db push
   npx prisma db seed
   ```

---

### 🔹 STEP 2: Domain Buy Karna

1. **Hostinger** ya **GoDaddy** par jaakar client ke naam se domain search karein (jaise: `clientwebsite.com`).
2. Domain buy kar lein. (Abhi DNS settings badalne ki zaroorat nahi hai, Step 5 me karenge).

---

### 🔹 STEP 3: Code Ko GitHub Par Push Karna

1. Check karein ki `.gitignore` file me `.env` likha hua hai (taaki aapke secrets/passwords leak na hon).
2. Code ko GitHub par push karein:
   ```bash
   git add .
   git commit -m "Ready for live deployment"
   git push origin main
   ```

---

### 🔹 STEP 4: Vercel Par Website Deploy Karna

1. **[Vercel.com](https://vercel.com/)** par jayein aur apne GitHub account se Sign In karein.
2. Dashboard me **"Add New" -> "Project"** par click karein aur apna GitHub repository select karein.
3. **Environment Variables** wale section me neeche diye sabhi keys aur values daalein:

| Variable Key | Kya Value Daalni Hai? |
| :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | Client ke Brand ka Naam (e.g. `RailMart Enterprise`) |
| `NEXT_PUBLIC_APP_URL` | `https://clientwebsite.com` (Client ka domain) |
| `DATABASE_URL` | Step 1 me Neon.tech se mila PostgreSQL URL |
| `JWT_SECRET` | Koi bhi secret password string (e.g. `my_super_secret_jwt_2026`) |
| `JWT_REFRESH_SECRET` | Koi doosra secret password string |
| `RAZORPAY_KEY_ID` | Client ke Live Razorpay Account ki Key ID |
| `RAZORPAY_KEY_SECRET` | Client ke Live Razorpay Account ki Key Secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same Razorpay Key ID |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Email ID jisse notifications bhejne hain |
| `SMTP_PASS` | Gmail 16-digit App Password (Step 6 dekhein) |
| `EMAIL_FROM` | `RailMart <orders@clientwebsite.com>` |

4. **"Deploy"** button par click kar dein. 1-2 minute me aapki site Vercel link (`.vercel.app`) par live ho jayegi.

---

### 🔹 STEP 5: Domain Ko Vercel Se Jodna (DNS Setup)

1. Vercel dashboard me apne project ke **Settings -> Domains** me jayein.
2. Client ka domain add karein (e.g., `clientwebsite.com` aur `www.clientwebsite.com`).
3. Vercel aapko 2 Records dikhayega:
   - **A Record**: Name `@` -> Value `76.76.21.21`
   - **CNAME Record**: Name `www` -> Value `cname.vercel-dns.com`
4. Ab Hostinger / GoDaddy me **DNS Management / DNS Zone** me jaakar ye dono records add kar dein.
5. **5-10 minute wait karein**, domain par 🔒 HTTPS active ho jayega aur site live ho jayegi!

---

### 🔹 STEP 6: Gmail App Password Kaise Banayein? (Email Sending Ke Liye)

Aapke project me orders aur password reset mail bhejne ke liye Nodemailer hai:

1. Gmail Account ki **Google Account Settings** me jayein.
2. **Security** tab me jaakar **2-Step Verification** ON karein.
3. Search bar me type karein **"App Passwords"**.
4. App Name daalein: `RailMart Live`.
5. Screen par ek **16-letter ka code** dikhega (e.g., `abcd efgh ijkl mnop`).
6. Iss code ko copy karke Vercel ke `SMTP_PASS` me daal dein (space ke bina).

---

## 📌 Checklist Client Ko Handover Karne Se Pehle

- [ ] **Admin Login Check**: Admin email/password se login karke Admin Dashboard check karein.
- [ ] **Payment Test**: Client ke Razorpay Live keys chal rahe hain ya nahi (₹1 ka test order karke dekhein).
- [ ] **Email Check**: Password Forgot karke check karein ki mail inbox me aa rahi hai ya nahi.
- [ ] **Mobile Test**: Phone me website khol ke responsive UI check karein.

---

## 🔄 Future Updates Kaise Lein?

Jab bhi aap local computer me koi naya feature banayein ya bug fix karein, bus:
```bash
git add .
git commit -m "New feature added"
git push origin main
```
Vercel **automatically** naye code ko 1 minute me live update kar dega! Aapko dobara koi setup nahi karna padega.

---
*Guide Created for Tatkal / RailMart Project Deployment*
