import Order from "../models/Order.js";
import Review from "../models/Review.js";

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
    const orders = await Order.find({ createdBy: req.user._id }).lean().sort({ orderDate: -1 });
    
    // Check if each order has an existing review by the user
    const orderIds = orders.map(o => o._id);
    const reviews = await Review.find({ orderId: { $in: orderIds }, userId: req.user._id }).lean();
    
    const reviewedOrderIds = new Set(reviews.map(r => r.orderId.toString()));
    
    const ordersWithReviewStatus = orders.map(o => ({
      ...o,
      isRated: reviewedOrderIds.has(o._id.toString())
    }));
    
    res.json(ordersWithReviewStatus);
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

    // Check if order is eligible for cancellation (only pending orders can be cancelled by customer)
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be cancelled once it is being processed" });
    }

    await order.updateStatus("cancelled");

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer confirms order received
// @route   PUT /api/orders/:id/confirm-received
// @access  Private
export const confirmReceived = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Order must be in delivered status to confirm receipt" });
    }

    await order.updateStatus("completed");
    res.json({ message: "Order marked as completed", order });
  } catch (err) {
    next(err);
  }
};
