import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lkmo-recipes');
    console.log('✅ Connected to MongoDB');

    // Default admin credentials
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@lkmo.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const adminName = process.env.ADMIN_NAME || 'Admin LKMO';

    console.log('🔍 Checking for admin user...');
    console.log('📧 Email:', adminEmail);

    // Check if admin already exists (email is stored as lowercase in DB)
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    
    if (existingAdmin) {
      // Update existing user to admin
      let updated = false;
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        updated = true;
      }
      // Set password as plain text - mongoose pre-save hook will hash it
      existingAdmin.password = adminPassword;
      existingAdmin.markModified('password'); // Force mongoose to treat it as modified
      updated = true;
      await existingAdmin.save();
      
      if (updated) {
        console.log(`✅ User ${adminEmail} telah diupdate menjadi admin`);
        console.log(`🔑 Password telah direset ke: ${adminPassword}`);
      } else {
        console.log(`⚠️  User ${adminEmail} sudah menjadi admin`);
        console.log(`🔑 Password telah direset ke: ${adminPassword}`);
      }
    } else {
      // Create new admin user
      // Set password as plain text - mongoose pre-save hook will hash it automatically
      const admin = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase().trim(),
        password: adminPassword, // Plain text - will be hashed by pre-save hook
        role: 'admin'
      });

      console.log('✅ Admin user berhasil dibuat!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      console.log('👤 Name:', adminName);
      console.log('🔐 Role:', admin.role);
      console.log('⚠️  JANGAN LUPA UNTUK MENGUBAH PASSWORD SETELAH LOGIN PERTAMA KALI!');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run the script
createAdmin();

