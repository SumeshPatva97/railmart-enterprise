console.log('🧪 Starting RailMart Automated Unit Test Suite...\n');

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

function calculateCartTotals(items, couponDiscount = null) {
  let subtotal = 0;
  let maxDeliveryFee = 0;

  items.forEach((item) => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

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

  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: 0,
    shippingFee: Math.round(shippingFee * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

// Test Suite 1: Cart Subtotal & Total Calculations (No GST)
console.log('Test Suite 1: Cart & Payment Totals Calculations');
const mockItems = [
  { price: 100000, quantity: 1, deliveryCharges: 1000 },
  { price: 5000, quantity: 2, deliveryCharges: 200 }
];

const totals = calculateCartTotals(mockItems, { type: 'PERCENTAGE', value: 10 });

assert(totals.subtotal === 110000, 'Subtotal calculation equals ₹1,10,000');
assert(totals.taxAmount === 0, 'GST Tax is zero (0% GST Tax)');
assert(totals.discountAmount === 11000, '10% Coupon discount equals ₹11,000');
assert(totals.totalAmount === 99000, 'Grand Total (Subtotal + Shipping - Discount) calculation correct');

console.log(`\n🎉 Test Suite Completed: ${passedCount}/${totalCount} tests passed!`);
if (passedCount < totalCount) {
  process.exit(1);
}
