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

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is the creator of the order
    if (order.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this order" });
    }

    // Check if order is eligible for cancellation
    if (order.status !== "pending" && order.status !== "confirmed") {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }

    await order.updateStatus("cancelled");

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    next(err);
  }
};
