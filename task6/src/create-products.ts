import mongoose from 'mongoose';

import { Product } from './models/product.model';
import { PRODUCTS } from './data/products';
import { DB_CONNECTION_STRING } from './env/mongodb-connection';

(async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(PRODUCTS);
    console.log('Inserted seed products');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
})();
