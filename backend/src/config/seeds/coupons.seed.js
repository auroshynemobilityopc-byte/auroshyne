require('dotenv').config();
const mongoose = require('mongoose');

const Discount = require('../../modules/discounts/discount.model');

const MONGO_URI = process.env.MONGO_URI;

const coupons = [
    {
        code: 'FIRSTBOOKING',
        type: 'percentage',
        value: 20,                   // 20% off
        minOrderValue: 0,
        maxDiscount: 300,            // capped at ₹300 off
        usageLimit: 0,               // no global cap; per-customer cap enforced via oncePerCustomer + usageCondition
        isActive: true,
        description: 'First booking offer – get 20% off (up to ₹300) on your very first AURO-SHYNE Mobility booking.',
        usageCondition: 'firstBookingOnly', // only valid if customer has 0 prior bookings
        oncePerCustomer: true,
    },
    {
        code: 'WELCOME',
        type: 'percentage',
        value: 10,                   // 10% off
        minOrderValue: 0,
        maxDiscount: 150,            // capped at ₹150 off
        usageLimit: 0,
        isActive: true,
        description: 'Welcome offer – enjoy 10% off (up to ₹150) on your booking. Valid once per customer.',
        usageCondition: 'none',      // no extra condition beyond once-per-customer
        oncePerCustomer: true,
    },
];

const seedCoupons = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected for coupon seeding');

        let created = 0;
        let skipped = 0;

        for (const coupon of coupons) {
            const exists = await Discount.findOne({ code: coupon.code });
            if (exists) {
                console.log(`⚠️  Coupon "${coupon.code}" already exists – skipping`);
                skipped++;
            } else {
                await Discount.create(coupon);
                console.log(`✅ Coupon "${coupon.code}" created`);
                created++;
            }
        }

        console.log(`\nDone! ${created} coupon(s) created, ${skipped} skipped.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Coupon seeder error:', error);
        process.exit(1);
    }
};

seedCoupons();
