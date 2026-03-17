import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import Order from '../src/models/Order.js';
import Product from '../src/models/Product.js';

async function buildIndexes() {
  try {
    await connectDB();
    
    console.log('Building database indexes...');
    
    // Build Order indexes
    console.log('Building Order indexes...');
    await Order.createIndexes();
    console.log('Order indexes built successfully');
    
    // Build Product indexes
    console.log('Building Product indexes...');
    await Product.createIndexes();
    console.log('Product indexes built successfully');
    
    // Check existing indexes
    const orderIndexes = await Order.collection.getIndexes();
    const productIndexes = await Product.collection.getIndexes();
    
    console.log('\nOrder indexes:', Object.keys(orderIndexes));
    console.log('Product indexes:', Object.keys(productIndexes));
    
    console.log('\nAll indexes built successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error building indexes:', error);
    process.exit(1);
  }
}

buildIndexes();
