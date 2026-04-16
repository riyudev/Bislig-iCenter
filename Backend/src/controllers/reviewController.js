import Review from "../models/Review.js";

// POST /api/reviews  – submit a review after order received
export const createReview = async (req, res, next) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !orderId || !rating) {
      return res.status(400).json({ message: "productId, orderId, and rating are required" });
    }

    // Prevent duplicate review
    const existing = await Review.findOne({ productId, orderId, userId: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "You have already reviewed this product for this order" });
    }

    const review = await Review.create({
      productId,
      orderId,
      userId: req.user._id,
      userName: req.user.name || req.user.username || "Customer",
      rating,
      comment: comment?.trim() || "",
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews?productId=xxx  – fetch all reviews for a product (public)
export const getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, average: parseFloat(avg.toFixed(1)), total: reviews.length });
  } catch (err) {
    next(err);
  }
};
