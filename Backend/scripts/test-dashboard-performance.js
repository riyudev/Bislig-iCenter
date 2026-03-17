import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';

async function testDashboardPerformance() {
  try {
    await connectDB();
    
    console.log('Testing dashboard API performance...');
    
    // Test the dashboard stats endpoint
    const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
      headers: {
        'Authorization': 'Bearer test-token', // This will fail but we can measure the query time
        'Content-Type': 'application/json'
      }
    });
    
    const startTime = Date.now();
    const data = await response.json();
    const endTime = Date.now();
    
    console.log(`Response time: ${endTime - startTime}ms`);
    console.log('Response:', response.status, data);
    
  } catch (error) {
    console.error('Error testing performance:', error.message);
  }
  
  process.exit(0);
}

// Only run if server is running
testDashboardPerformance();
