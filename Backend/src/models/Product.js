import mongoose from "mongoose";

const variantStockSchema = new mongoose.Schema(
  {
    variant: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["iphone", "ipad", "laptop", "android"],
      required: true,
    },
    image: { type: String, required: true },
    images: [{ type: String }],
    oldPrice: { type: Number },
    newPrice: { type: Number, required: true, min: 0 },
    variantPrices: { type: Map, of: Number, default: {} },
    variants: [{ type: String }],
    colors: [{ type: String }],
    stockItems: [variantStockSchema],
    stocks: { type: Number, default: 0, min: 0 },
    totalSales: { type: Number, default: 0, min: 0 },
    description: { type: String },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        _id: false
      }
    ],
    isActive: { type: Boolean, default: true },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    lowStockThreshold: { type: Number, default: 5, min: 0 },
  },
  { timestamps: true }
);

// Performance indexes
productSchema.index({ isActive: 1 });
productSchema.index({ stocks: 1 });
productSchema.index({ "stockItems.stock": 1 });
productSchema.index({ category: 1 });

productSchema.methods.getStock = function (variant, color) {
  const item = this.stockItems.find((s) => s.variant === variant && s.color === color);
  return item ? item.stock : 0;
};

productSchema.methods.adjustStock = function (variant, color, delta) {
  const item = this.stockItems.find((s) => s.variant === variant && s.color === color);
  if (item) {
    item.stock = Math.max(0, item.stock + delta);
  } else {
    this.stockItems.push({ variant, color, stock: Math.max(0, delta) });
  }
  return this.save();
};

export default mongoose.model("Product", productSchema);
