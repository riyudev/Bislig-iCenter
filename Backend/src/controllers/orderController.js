import Order from "../models/Order.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, customer, subtotal, shippingFee, total, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      items: orderItems,
      customer,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      createdBy: req.user._id,
      status: "pending",
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ createdBy: req.user._id }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
