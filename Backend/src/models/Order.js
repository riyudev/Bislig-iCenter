import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    variant: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["cod", "pickup"], default: "cod" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "packed", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    orderDate: { type: Date, default: Date.now },
    confirmedDate: { type: Date },
    packedDate: { type: Date },
    shippedDate: { type: Date },
    completedDate: { type: Date },
    cancelledDate: { type: Date },
    notes: { type: String },
    adminNotes: { type: String },
    trackingNumber: { type: String },
    proofOfDeliveryUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Performance indexes
orderSchema.index({ orderDate: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1, status: 1 });

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

orderSchema.methods.updateStatus = function (newStatus) {
  const now = new Date();
  this.status = newStatus;
  switch (newStatus) {
    case "confirmed":
      this.confirmedDate = now;
      break;
    case "packed":
      this.packedDate = now;
      break;
    case "shipped":
      this.shippedDate = now;
      break;
    case "completed":
      this.completedDate = now;
      break;
    case "cancelled":
      this.cancelledDate = now;
      break;
  }
  return this.save();
};

export default mongoose.model("Order", orderSchema);
