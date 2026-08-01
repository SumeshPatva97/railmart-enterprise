import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Tatkal Enterprise Database Seeding...');

  // Clean existing tables
  await prisma.activityLog.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.cRMNote.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  const custPasswordHash = await bcrypt.hash('Customer@123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Master Bhimdada',
      email: 'admin@denterpriese.softvps.in',
      phone: '+66805849689',
      passwordHash: passwordHash,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@railmart.com',
      phone: '+919876543210',
      passwordHash: passwordHash,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'customer@softvps.in',
      phone: '+919811223344',
      passwordHash: custPasswordHash,
      role: 'CUSTOMER',
      emailVerified: true,
      addresses: {
        create: [
          {
            label: 'Primary Terminal',
            fullName: 'Rajesh Kumar',
            phone: '+919811223344',
            street: 'Station Road Terminal',
            city: 'New Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India',
            isDefault: true,
          },
        ],
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Demo Customer',
      email: 'customer@railmart.com',
      phone: '+919811223355',
      passwordHash: custPasswordHash,
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });

  console.log('✅ Users seeded: admin@denterpriese.softvps.in, admin@railmart.com, customer@softvps.in, customer@railmart.com');

  // 2. Create Brand
  const brandSoftvps = await prisma.brand.create({
    data: {
      name: 'Enterprise D Team',
      slug: 'enterprise-d-team',
      website: 'https://denterpriese.softvps.in',
    },
  });

  // 3. Create Categories
  const catSoftware = await prisma.category.create({
    data: {
      name: 'Tatkal Booking Software',
      slug: 'tatkal-booking-software',
      description: 'High-speed automated IRCTC Tatkal ticket booking desktop tools & software.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catExtension = await prisma.category.create({
    data: {
      name: 'Tatkal Browser Extensions',
      slug: 'tatkal-browser-extensions',
      description: 'Lightweight browser-based Tatkal automation extensions & quick tools.',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    },
  });

  // 4. Create 12 Tatkal Products & Images
  const productsData = [
    {
      name: 'GADAR Tatkal Software',
      alternateName: '01',
      slug: 'gadar-tatkal-software',
      sku: 'TTK-GADAR-01',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'Gadar Tatkal Software ek simple aur efficient booking solution hai jo IRCTC Tatkal tickets ko easy tarike se book karne me madad karta hai. Iska beta version available hai jise aap directly access kar sakte hain. Is version me ek hi time par multiple PNR booking ka support milta hai, jisse process aur fast ho jata hai. Demo version available nahi hai.',
      features: JSON.stringify([
        'Ek hi time par multiple PNR booking support available hai',
        'Fast performance, easy interface aur smooth workflow',
        'Mobile use support (VPS server recommended for optimal speed)',
        'Internal data protection system user details secure rakhne ke liye',
        'Time saving - manual process se kaafi fast',
        'Better success rate - optimized booking flow'
      ]),
      price: 1199,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.9,
      reviewsCount: 42,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'STAR_TS Tatkal Software',
      alternateName: '02',
      slug: 'star-ts-tatkal-software',
      sku: 'TTK-STARTS-02',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'STAR_TS Tatkal Software – Smart Automatic Booking Solution. STAR_TS Tatkal Software ek advanced aur high-performance automation tool hai jo Tatkalticket booking process ko fast, smooth aur efficient banane ke liye design kiya gaya hai. Ye software un users ke liye ideal hai jo speed, accuracy aur better booking results chahte hain. Is version me naye upgrades add kiye gaye hain jo isse aur powerful aur market ke dusre tools se alag banate hain.',
      features: JSON.stringify([
        'Multi PNR Booking Support (Ek hi time par multiple PNR process)',
        'Fully Automated System (Manual steps reduce karke complete automated workflow)',
        'Advanced Login Integration (Multiple web login support)',
        'High-Speed Processing Engine (Fast response & quick execution)',
        'Smart Automation Logic (Optimized booking flow)',
        'User-friendly interface & Optimized success performance'
      ]),
      price: 1149,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.8,
      reviewsCount: 38,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'PRO MAX Tatkal Software',
      alternateName: '03',
      slug: 'pro-max-tatkal-software',
      sku: 'TTK-PROMAX-03',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'PRO MAX Tatkal Software – Advanced IRCTC Ticket Booking Solution. PRO MAX Tatkal Software ek advanced aur high-performance booking solution hai jo IRCTC ticket booking process ko fast, smooth aur efficient banane ke liye design kiya gaya hai. Yeh software modern technology aur user-friendly interface ke saath aata hai, jisse booking management aur workflow ko aasani se handle kiya ja sakta hai.',
      features: JSON.stringify([
        'High-Speed Performance',
        'User-Friendly Interface',
        'Smooth Booking Management',
        'Multi PNR Support',
        'Fast Processing System',
        'Easy Setup & Configuration',
        'Stable & Reliable Operation',
        'Regular Updates & Improvements'
      ]),
      price: 1499,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 5.0,
      reviewsCount: 56,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Hitman Tatkal Software',
      alternateName: '04',
      slug: 'hitman-tatkal-software',
      sku: 'TTK-HITMAN-04',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'Hitman Tatkal Software – Smart & Efficient Booking Assistant Solution. Hitman Tatkal Software ek powerful aur modern booking assistant tool hai jo users ko smooth workflow management, optimized performance aur user-friendly experience provide karne ke liye design kiya gaya hai. Is software ka interface simple aur easy-to-use hai, jisse beginners aur experienced users dono efficiently operate kar sakte hain.',
      features: JSON.stringify([
        'Easy-to-Use Interface & Modern Dashboard',
        'Smart Workflow Management',
        'Fast Processing Support',
        'Stable & Reliable Performance',
        'Optimized User Experience',
        'Quick Setup & Activation',
        'Regular Maintenance & Updates',
        'Dedicated Support Assistance'
      ]),
      price: 1399,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.8,
      reviewsCount: 31,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Superman Tatkal Software',
      alternateName: '05',
      slug: 'superman-tatkal-software',
      sku: 'TTK-SUPERMAN-05',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'Superman Tatkal Software – Smart Booking Assistant & Workflow Management Solution. Superman Tatkal Software ek modern aur user-friendly booking assistant solution hai jo efficient workflow management, smooth operation aur organized reservation handling experience provide karne ke liye design kiya gaya hai. Software ka intuitive interface aur optimized functionality users ko booking-related activities ko conveniently manage karne me help karta hai.',
      features: JSON.stringify([
        'Optimized Workflow Management',
        'Modern User Interface',
        'Responsive Performance',
        'Easy Installation & Activation',
        'Smart Utility Tools',
        'Regular Updates & Maintenance',
        'Dedicated Customer Support'
      ]),
      price: 1599,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.9,
      reviewsCount: 47,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'BTS Tatkal Software (Black Turbo)',
      alternateName: '06',
      slug: 'bts-black-turbo-tatkal-software',
      sku: 'TTK-BTS-06',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'Black Turbo Tatkal Software ek original aur trusted Tatkal booking software hai, jo fast booking experience provide karta hai. IRCTC server par heavy traffic ke dauran bhi ye software booking process ko smooth banane mein madad karta hai. Special Offer: Order place karne par 10% cashback automatically wallet mein credit kiya jayega.',
      features: JSON.stringify([
        'Fast Tatkal Booking',
        'Multi PNR Booking Support',
        'Stable Performance',
        'Easy to Use Interface',
        'Heavy Traffic High Speed Handling',
        'Special Offer: 10% Automatic Wallet Cashback on Order'
      ]),
      price: 1599,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.9,
      reviewsCount: 64,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Panda Tatkal Software',
      alternateName: '07',
      slug: 'panda-tatkal-software',
      sku: 'TTK-PANDA-07',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'Panda Tatkal Software – Smart Booking Assistant & Reservation Management Solution. Panda Tatkal Software ek modern aur user-friendly booking assistant solution hai jo reservation management aur booking workflow ko organized aur efficient banane ke liye design kiya gaya hai. Is software ka intuitive dashboard aur optimized functionality users ko smooth working experience provide karta hai.',
      features: JSON.stringify([
        'Modern & Clean Dashboard',
        'Easy-to-Use Controls',
        'Smart Workflow Management',
        'Fast & Responsive Performance',
        'Easy Installation & Setup',
        'Regular Software Improvements',
        'Reliable Support Assistance'
      ]),
      price: 1599,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.7,
      reviewsCount: 29,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Window TS Tatkal Software',
      alternateName: '08',
      slug: 'window-ts-tatkal-software',
      sku: 'TTK-WINDOWTS-08',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'Window TS Software – Advanced Booking Assistant & Workflow Management Solution. Window TS Software ek modern aur professional booking assistant solution hai jo users ko smooth workflow management, organized reservation handling aur efficient software experience provide karne ke liye design kiya gaya hai. Iska user-friendly interface aur optimized functionality daily booking-related activities ko manage karna aur bhi convenient banata hai.',
      features: JSON.stringify([
        'Advanced Workflow Management',
        'User-Friendly Dashboard',
        'Fast & Responsive Performance',
        'Easy Installation & Configuration',
        'Smart Management Tools',
        'Reliable & Stable Operation',
        'Regular Updates & Enhancements'
      ]),
      price: 1899,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 5.0,
      reviewsCount: 78,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'AVATAR Tatkal Software',
      alternateName: '09',
      slug: 'avatar-tatkal-software',
      sku: 'TTK-AVATAR-09',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'AVATAR Tatkal Software – Advanced High-Speed Booking Solution. AVATAR Tatkal Software ek powerful aur advanced booking solution hai jo IRCTC Tatkal ticket booking ko fast, smooth aur efficient banane ke liye design kiya gaya hai. Yeh software modern technology aur optimized performance ke saath users ko behtar booking experience provide karta hai.',
      features: JSON.stringify([
        'High-Speed Booking Performance',
        'Multi PNR Support',
        'Smart Auto Fill Technology',
        'Secure & Reliable Environment',
        'User-Friendly Interface',
        'Fast Response Processing'
      ]),
      price: 1099,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.8,
      reviewsCount: 35,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Ocean Tatkal Extension',
      alternateName: '10',
      slug: 'ocean-tatkal-extension',
      sku: 'TTK-OCEANEXT-10',
      categoryId: catExtension.id,
      brandId: brandSoftvps.id,
      description: 'Ocean Tatkal Extension – Smart Browser-Based Booking Assistant. Ocean Tatkal Extension ek modern aur user-friendly browser extension hai jo booking workflow management ko simple aur organized banane ke liye design ki gayi hai. Iska lightweight design aur intuitive interface users ko smooth aur convenient experience provide karta hai.',
      features: JSON.stringify([
        'User-Friendly Browser Extension',
        'Lightweight & Optimized Design',
        'Smooth Workflow Management',
        'Easy Installation & Configuration',
        'Modern Interface Experience',
        'Reliable Performance & Browser Compatibility'
      ]),
      price: 699,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.9,
      reviewsCount: 51,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'BINGO Tatkal Software',
      alternateName: '11',
      slug: 'bingo-tatkal-software',
      sku: 'TTK-BINGO-11',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'BINGO – THE ONLY SOFTWARE WORKING WITHOUT TOKEN. If you\'re looking for a hassle-free experience with direct login and token-free access, BINGO delivers smooth performance across supported platforms.',
      features: JSON.stringify([
        'No Token Required',
        'Web Working',
        'Web3 Working',
        'Web5 Working',
        'Direct Login Access',
        'Smooth & Stable Performance',
        'Fast Response & Reliable Speed'
      ]),
      price: 1499,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 5.0,
      reviewsCount: 88,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'RANGER Tatkal Software',
      alternateName: '12',
      slug: 'ranger-tatkal-software',
      sku: 'TTK-RANGER-12',
      categoryId: catSoftware.id,
      brandId: brandSoftvps.id,
      description: 'RANGER – BEST FOR BOTH APP & WEB. RANGER is built for users who want fast, smooth, and dependable performance on both App and Web.',
      features: JSON.stringify([
        'Best Performance on App & Web',
        'Smooth & Fast Working',
        'Famous for Stable App Login',
        'Reliable Performance',
        'Quick Response',
        'Seamless Login Experience'
      ]),
      price: 1449,
      discount: 0,
      stock: 100,
      gstPercent: 18,
      deliveryCharges: 0,
      rating: 4.9,
      reviewsCount: 61,
      isFeatured: true,
      isPopular: true,
      status: 'ACTIVE',
      isVisible: true,
      images: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      ]
    }
  ];

  for (const p of productsData) {
    const { images, ...prodInfo } = p;
    const createdProduct = await prisma.product.create({
      data: prodInfo,
    });

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: images[i],
          alt: createdProduct.name,
          isPrimary: i === 0,
        },
      });
    }

    // Add sample review
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        comment: `Excellent speed and 100% working performance for ${createdProduct.name}! Highly recommended Tatkal software.`,
      },
    });
  }

  console.log('✅ 12 Tatkal Products & Images seeded successfully');

  // 5. Create Coupons
  await prisma.coupon.create({
    data: {
      code: 'BHIMDADA10',
      discountType: 'PERCENTAGE',
      value: 10,
      minOrderValue: 1000,
      maxDiscount: 500,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2027-12-31'),
      usageLimit: 500,
      status: 'ACTIVE',
    },
  });

  // 6. Create Banner
  await prisma.banner.create({
    data: {
      title: 'Enterprise D Team - Super Master Bhimdada',
      subtitle: 'Original & Verified Tatkal Software Solutions with High Speed & Fast Support (Domain: denterpriese.softvps.in)',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
      link: '/products',
      section: 'HERO',
      isEnabled: true,
    },
  });

  console.log('🎉 Tatkal Software Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
