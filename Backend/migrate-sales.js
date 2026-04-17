import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import Order from "./src/models/Order.js";

// Load env variables
dotenv.config();

const migrateSales = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const products = await Product.find({});
    
    // Reset totalSales for complete recalculation
    for (const product of products) {
      product.totalSales = 0;
      if (product.stockItems && product.stockItems.length > 0) {
        product.stockItems.forEach(item => {
          item.totalSales = 0;
        });
      }
      await product.save();
    }
    console.log("Reset all sales counters.");

    // Determine totalSales by going through all valid statuses
    const completedOrders = await Order.find({
      status: { $in: ["shipped", "out_for_delivery", "delivered", "completed"] },
    });

    for (const order of completedOrders) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          // Add main totalSales
          product.totalSales = (product.totalSales || 0) + item.quantity;
          
          // Add variant totalSales
          if (product.stockItems && product.stockItems.length > 0) {
            const stockItem = product.stockItems.find(
              (s) => s.variant === item.variant && s.color === item.color
            );
            if (stockItem) {
              stockItem.totalSales = (stockItem.totalSales || 0) + item.quantity;
            }
          }
          await product.save();
        }
      }
      
      // Force set salesAdded to true so later updates don't recount
      if (!order.salesAdded) {
        order.salesAdded = true;
        await order.save();
      }
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed", err);
    process.exit(1);
  }
};

migrateSales();
