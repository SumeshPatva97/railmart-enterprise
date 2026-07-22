const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RailMart Database Seeding...');

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
      email: 'customer@railmart.com',
      phone: '+919811223344',
      passwordHash: custPasswordHash,
      role: 'CUSTOMER',
      emailVerified: true,
      addresses: {
        create: [
          {
            label: 'Office Workshop',
            fullName: 'Rajesh Kumar',
            phone: '+919811223344',
            street: 'Plot 42, Railway Industrial Estate, Station Road',
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

  console.log('✅ Users seeded: Admin (admin@railmart.com) & Customer (customer@railmart.com)');

  // 2. Create Brands
  const brand1 = await prisma.brand.create({
    data: {
      name: 'RailTech India',
      slug: 'railtech-india',
      website: 'https://railtech-india.example.com',
    },
  });

  const brand2 = await prisma.brand.create({
    data: {
      name: 'BharatSignal Corp',
      slug: 'bharatsignal-corp',
      website: 'https://bharatsignal.example.com',
    },
  });

  const brand3 = await prisma.brand.create({
    data: {
      name: 'LocoPro Spares',
      slug: 'locopro-spares',
      website: 'https://locopro.example.com',
    },
  });

  // 3. Create Categories
  const catTrack = await prisma.category.create({
    data: {
      name: 'Track Maintenance Equipment',
      slug: 'track-maintenance-equipment',
      description: 'Heavy duty track alignment, rail fasteners, and sleeper maintenance machinery.',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catSignal = await prisma.category.create({
    data: {
      name: 'Signaling & Interlocking',
      slug: 'signaling-and-interlocking',
      description: 'Relays, LED signal lamps, point machines, and track circuit equipment.',
      image: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catLoco = await prisma.category.create({
    data: {
      name: 'Locomotive Electrical Spares',
      slug: 'locomotive-electrical-spares',
      description: 'Traction motor components, pantographs, breakers, and cab instruments.',
      image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catSafety = await prisma.category.create({
    data: {
      name: 'Safety & Trackside Tools',
      slug: 'safety-and-trackside-tools',
      description: 'Insulated safety tools, LED fog signal lights, and inspector gear.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    },
  });

  // 4. Create Products
  const productsData = [
    {
      name: 'Heavy-Duty Hydraulic Rail Bender (100-Ton)',
      slug: 'heavy-duty-hydraulic-rail-bender-100t',
      sku: 'RM-TRK-001',
      categoryId: catTrack.id,
      brandId: brand1.id,
      description: 'Precision hydraulic rail bending machine for 52kg and 60kg rail sections. Engineered with high-strength alloy steel for track maintenance crews.',
      features: JSON.stringify([
        'Capacity: 100 Tons pressure rating',
        'Compatible Rail Types: UIC 60, 52kg, 90 R',
        'Weight: 85 kg (Portable dual cylinder design)',
        'Operating Pressure: 700 Bar hydraulic pump included',
        'RDSO Guidelines Compliant'
      ]),
      price: 145000,
      discount: 10,
      stock: 15,
      gstPercent: 18,
      deliveryCharges: 1500,
      rating: 4.8,
      reviewsCount: 12,
      isFeatured: true,
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'High-Luminance LED Multi-Aspect Railway Signal Lamp Unit',
      slug: 'led-multi-aspect-railway-signal-lamp',
      sku: 'RM-SIG-004',
      categoryId: catSignal.id,
      brandId: brand2.id,
      description: 'Fail-safe LED aspect signal unit designed for main line signaling with over 100,000 burning hours lifespan and anti-glare optical lens.',
      features: JSON.stringify([
        'Operating Voltage: 110V AC ± 20%',
        'Colors: Red, Yellow, Green, White Lunar',
        'Weatherproof Rating: IP66 Stainless Enclosure',
        'Current Sensing Fail-Safe Relay Circuit',
        'Operating Temp Range: -20°C to +70°C'
      ]),
      price: 28500,
      discount: 5,
      stock: 45,
      gstPercent: 18,
      deliveryCharges: 350,
      rating: 4.9,
      reviewsCount: 24,
      isFeatured: true,
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'WAP-7 / WAG-9 Electric Loco Pantograph Assembly',
      slug: 'wap7-wag9-electric-loco-pantograph-assembly',
      sku: 'RM-LOC-012',
      categoryId: catLoco.id,
      brandId: brand3.id,
      description: 'High-speed air-raised single arm pantograph for 25kV AC overhead electrification lines. Optimized contact strip dynamics.',
      features: JSON.stringify([
        'Nominal Voltage: 25 kV AC 50 Hz',
        'Rated Current: 1000 Amps continuous',
        'Operating Speed: Up to 160 km/h',
        'Auto-Drop Safety Mechanism (ADD)',
        'Carbon Metallized Collector Strips'
      ]),
      price: 420000,
      discount: 8,
      stock: 6,
      gstPercent: 18,
      deliveryCharges: 5000,
      rating: 4.7,
      reviewsCount: 9,
      isFeatured: true,
      isPopular: false,
      images: [
        'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Insulated 1000V Track Maintenance Safety Tool Set (24 Pcs)',
      slug: 'insulated-1000v-track-maintenance-safety-tool-set',
      sku: 'RM-SAF-088',
      categoryId: catSafety.id,
      brandId: brand1.id,
      description: 'VDE certified 1000V insulated torque wrenches, spanners, and pliers set stored in a heavy-duty waterproof flight case.',
      features: JSON.stringify([
        'Insulation Rating: IEC 60900 / VDE 1000V',
        'Material: Drop-forged Chrome Vanadium Steel',
        'Includes: Ratchets, Sockets 10-32mm, Torque Wrench',
        'Impact Resistant Heavy Case Included'
      ]),
      price: 36000,
      discount: 15,
      stock: 30,
      gstPercent: 18,
      deliveryCharges: 400,
      rating: 4.9,
      reviewsCount: 38,
      isFeatured: false,
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
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

    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        comment: `Excellent build quality for ${createdProduct.name}. Certified for railway standards. Delivered quickly!`,
      },
    });
  }

  console.log('✅ Products & Images seeded successfully');

  // 5. Create Coupons
  await prisma.coupon.create({
    data: {
      code: 'RAIL10',
      discountType: 'PERCENTAGE',
      value: 10,
      minOrderValue: 5000,
      maxDiscount: 10000,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2027-12-31'),
      usageLimit: 500,
      status: 'ACTIVE',
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'TATKAL5000',
      discountType: 'FIXED',
      value: 5000,
      minOrderValue: 50000,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2027-12-31'),
      usageLimit: 100,
      status: 'ACTIVE',
    },
  });

  // 6. Create Banners
  await prisma.banner.create({
    data: {
      title: 'Next-Gen Railway Equipment & Spares',
      subtitle: 'Certified Track Maintenance, Signaling, and Locomotive Components for Indian Railways Contractors.',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
      link: '/products',
      section: 'HERO',
      isEnabled: true,
    },
  });

  // 7. Create CRM Leads & Tickets
  await prisma.lead.create({
    data: {
      name: 'Vikas Construction Ltd',
      email: 'procurement@vikasconst.com',
      phone: '+919712345678',
      company: 'Vikas Infra Projects',
      status: 'QUALIFIED',
      source: 'Website Inquiry',
      notes: 'Interested in bulk order of 20x Hydraulic Rail Benders for Dedicated Freight Corridor project.',
    },
  });

  const ticket1 = await prisma.supportTicket.create({
    data: {
      ticketNumber: 'TKT-2026-1001',
      userId: customer.id,
      subject: 'Warranty Certificate Request for LED Signal Units',
      category: 'Warranty & Testing',
      priority: 'HIGH',
      status: 'OPEN',
      messages: {
        create: [
          {
            senderId: customer.id,
            senderType: 'USER',
            message: 'Hello, we need the RDSO test compliance certificates and 3-year warranty card for order #RM-2026-9812.',
          },
        ],
      },
    },
  });

  await prisma.cRMNote.create({
    data: {
      ticketId: ticket1.id,
      author: 'System Admin',
      note: 'Forwarded warranty request to quality testing department for PDF generation.',
    },
  });

  await prisma.reminder.create({
    data: {
      title: 'Follow up with Vikas Construction on Bulk Rail Bender Quote',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 'HIGH',
      isCompleted: false,
    },
  });

  console.log('✅ CRM Leads, Tickets, Coupons, and Banners seeded successfully.');
  console.log('🎉 RailMart Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
