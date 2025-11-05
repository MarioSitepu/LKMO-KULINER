import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lkmo-recipes');
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@lkmo.com'.toLowerCase().trim();
    const adminPassword = 'admin123456';

    console.log('\n🔍 Testing login...');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);

    // Find user
    const user = await User.findOne({ email: adminEmail }).select('+password');
    
    if (!user) {
      console.log('❌ User tidak ditemukan!');
      console.log('💡 Jalankan: npm run create-admin');
      process.exit(1);
    }

    console.log('\n✅ User ditemukan:');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔐 Role:', user.role);
    console.log('🔑 Has Password:', !!user.password);
    console.log('📱 Has Google ID:', !!user.googleId);

    if (!user.password) {
      console.log('\n❌ User tidak memiliki password!');
      console.log('💡 User mungkin dibuat via Google OAuth');
      console.log('💡 Jalankan: npm run create-admin untuk reset password');
      process.exit(1);
    }

    // Test password
    console.log('\n🔐 Testing password...');
    const isMatch = await user.comparePassword(adminPassword);
    
    if (isMatch) {
      console.log('✅ Password match! Login seharusnya berhasil.');
    } else {
      console.log('❌ Password tidak match!');
      console.log('💡 Jalankan: npm run create-admin untuk reset password');
      
      // Test with bcrypt directly
      console.log('\n🔍 Testing with bcrypt directly...');
      const directMatch = await bcrypt.compare(adminPassword, user.password);
      console.log('Direct bcrypt compare:', directMatch);
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
testLogin();

