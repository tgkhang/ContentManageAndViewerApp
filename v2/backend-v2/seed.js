require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'editor', 'client'],
    default: 'client',
  },
  createdBy: {
    type: String,
    ref: 'User',
  },
  updatedBy: {
    type: String,
    ref: 'User',
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Seed data
const seedUsers = [
  {
    name: 'Admin User',
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'Demo@123',
    role: 'admin',
  },
  {
    name: 'Editor User 1',
    username: 'user1',
    email: 'user1@gmail.com',
    password: 'Demo@123',
    role: 'editor',
  },
  {
    name: 'Client User 2',
    username: 'user2',
    email: 'user2@gmail.com',
    password: 'Demo@123',
    role: 'client',
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Process each user
    for (const userData of seedUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
