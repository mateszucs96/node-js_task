import mongoose from 'mongoose';
import { products } from './products';
import { ProductEntity } from '../entities/product.entity';

// 1. Define Mongoose schema
const productSchema = new mongoose.Schema<ProductEntity>({
  title: String,
  description: String,
  price: Number,
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

// 2. Seed function
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


seed();
