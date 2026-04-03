import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  storage: {
    type: String,
    default: "64GB",
  },
  color: {
    type: String,
    default: "Default",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  cartOrder: [String], // Array of cartItemIds to maintain order
  checkedItems: {
    type: Map,
    of: Boolean,
    default: {},
  },
}, { timestamps: true });

// Helper method to generate cart item ID
cartSchema.methods.generateCartItemId = function(productId, storage, color) {
  return `${productId}-${storage}-${color}`;
};

// Helper method to add item to cart
cartSchema.methods.addItem = function(productId, storage, color, quantity) {
  const cartItemId = this.generateCartItemId(productId, storage, color);
  const existingItemIndex = this.items.findIndex(item => 
    item.productId === productId && item.storage === storage && item.color === color
  );

  if (existingItemIndex !== -1) {
    this.items[existingItemIndex].quantity += quantity;
  } else {
    this.items.push({ productId, storage, color, quantity });
    if (!this.cartOrder.includes(cartItemId)) {
      this.cartOrder.unshift(cartItemId);
    }
  }
  
  return this.save();
};

// Helper method to remove one quantity from cart
cartSchema.methods.removeOneItem = function(productId, storage, color) {
  const cartItemId = this.generateCartItemId(productId, storage, color);
  const itemIndex = this.items.findIndex(item => 
    item.productId === productId && item.storage === storage && item.color === color
  );

  if (itemIndex !== -1) {
    this.items[itemIndex].quantity--;
    if (this.items[itemIndex].quantity <= 0) {
      this.items.splice(itemIndex, 1);
      this.cartOrder = this.cartOrder.filter(id => id !== cartItemId);
      this.checkedItems.delete(cartItemId);
    }
  }
  
  return this.save();
};

// Helper method to remove item completely from cart
cartSchema.methods.removeItem = function(productId, storage, color) {
  const cartItemId = this.generateCartItemId(productId, storage, color);
  this.items = this.items.filter(item => 
    !(item.productId === productId && item.storage === storage && item.color === color)
  );
  this.cartOrder = this.cartOrder.filter(id => id !== cartItemId);
  this.checkedItems.delete(cartItemId);
  
  return this.save();
};

// Helper method to toggle item check
cartSchema.methods.toggleItemCheck = function(productId, storage, color) {
  const cartItemId = this.generateCartItemId(productId, storage, color);
  const currentCheck = this.checkedItems.get(cartItemId) || false;
  this.checkedItems.set(cartItemId, !currentCheck);
  
  return this.save();
};

// Helper method to clear checked items
cartSchema.methods.clearCheckedItems = function() {
  const checkedIds = [];
  for (const [key, value] of this.checkedItems.entries()) {
    if (value === true) {
      checkedIds.push(key);
    }
  }

  this.items = this.items.filter(item => {
    const cartItemId = this.generateCartItemId(item.productId, item.storage, item.color);
    return !checkedIds.includes(cartItemId);
  });
  
  this.cartOrder = this.cartOrder.filter(id => !checkedIds.includes(id));
  
  for (const id of checkedIds) {
    this.checkedItems.delete(id);
  }
  
  return this.save();
};

// Helper method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.cartOrder = [];
  this.checkedItems = {};
  
  return this.save();
};

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
