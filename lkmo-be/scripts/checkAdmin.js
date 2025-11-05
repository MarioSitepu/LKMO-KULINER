import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

// Load environment variables
dotenv.config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lkmo-recipes');
    console.log('✅ Connected to MongoDB');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@lkmo.com').toLowerCase().trim();

    // Check if admin exists
    const admin = await User.findOne({ email: adminEmail }).select('+password');
    
    if (admin) {
      console.log('✅ Admin user ditemukan:');
      console.log('📧 Email:', admin.email);
      console.log('👤 Name:', admin.name);
      console.log('🔐 Role:', admin.role || 'user');
      console.log('📅 Created:', admin.createdAt);
      console.log('🔑 Has Password:', !!admin.password);
    } else {
      console.log('❌ Admin user tidak ditemukan!');
      console.log('💡 Jalankan: npm run create-admin');
    }

    // List all admins
    const allAdmins = await User.find({ role: 'admin' }).select('-password');
    console.log('\n📋 Semua admin di database:');
    if (allAdmins.length > 0) {
      allAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email} - ${admin.name}`);
      });
    } else {
      console.log('Tidak ada admin ditemukan');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run the script
checkAdmin();

