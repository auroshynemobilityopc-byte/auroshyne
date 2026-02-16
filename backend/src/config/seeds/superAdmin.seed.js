require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../../modules/users/user.model');
const { ADMIN } = require('../../common/constants/roles');

const MONGO_URI = process.env.MONGO_URI;

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding');

        const email = 'admin@carwash.com';

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log('⚠️ Super Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        await User.create({
            name: 'Super Admin',
            mobile: '9876543210',
            email,
            password: hashedPassword,
            role: ADMIN,
            isActive: true,
        });

        console.log('✅ Super Admin created successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeder error:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
