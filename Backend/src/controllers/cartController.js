import Cart from "../models/Cart.js";

// Get user's cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      // Create empty cart for user
      cart = new Cart({ user: req.user.id });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, storage = "64GB", color = "Default", quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id });
    }

    await cart.addItem(productId, storage, color, quantity);

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Remove one quantity from cart
export const removeOneFromCart = async (req, res, next) => {
  try {
    const { productId, storage = "64GB", color = "Default" } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await cart.removeOneItem(productId, storage, color);

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Remove item completely from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, storage = "64GB", color = "Default" } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await cart.removeItem(productId, storage, color);

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Toggle item check
export const toggleItemCheck = async (req, res, next) => {
  try {
    const { productId, storage = "64GB", color = "Default" } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await cart.toggleItemCheck(productId, storage, color);

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Toggle all items check
export const toggleAllChecks = async (req, res, next) => {
  try {
    const { checkState } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update all checked items
    const updatedChecks = new Map();
    cart.cartOrder.forEach(cartItemId => {
      updatedChecks.set(cartItemId, checkState);
    });
    cart.checkedItems = updatedChecks;

    await cart.save();

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Clear cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await cart.clearCart();

    res.json(cart);
  } catch (err) {
    next(err);
  }
};
