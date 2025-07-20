/* import mongoose from 'mongoose';
import { Product } from './data/seed-products';
import { products } from './data/products';

async function seed() {
  try {
    await mongoose.connect('mongodb://root:nodegmp@localhost:27017/mydatabase?authSource=admin');
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    await Product.insertMany(products);
    console.log('🌱 Products seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed(); */
