import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(filter);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.updateStatus(status);
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.updateStatus("cancelled");
    if (reason) order.adminNotes = reason;
    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);
    const revenueStatuses = ["shipped", "completed"];

    // Optimized queries using aggregation facets
    const [orderStats, revenueStats, lowStockCount] = await Promise.all([
      // Order counts using facet
      Order.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            today: [
              { $match: { orderDate: { $gte: today } } },
              { $count: "count" }
            ],
            week: [
              { $match: { orderDate: { $gte: weekAgo } } },
              { $count: "count" }
            ],
            month: [
              { $match: { orderDate: { $gte: monthAgo } } },
              { $count: "count" }
            ],
            pending: [
              { $match: { status: "pending" } },
              { $count: "count" }
            ]
          }
        }
      ]),
      
      // Revenue calculations using facet
      Order.aggregate([
        {
          $facet: {
            total: [
              { $match: { status: { $in: revenueStatuses } } },
              { $group: { _id: null, total: { $sum: "$total" } } }
            ],
            today: [
              { $match: { status: { $in: revenueStatuses }, orderDate: { $gte: today } } },
              { $group: { _id: null, total: { $sum: "$total" } } }
            ],
            week: [
              { $match: { status: { $in: revenueStatuses }, orderDate: { $gte: weekAgo } } },
              { $group: { _id: null, total: { $sum: "$total" } } }
            ],
            month: [
              { $match: { status: { $in: revenueStatuses }, orderDate: { $gte: monthAgo } } },
              { $group: { _id: null, total: { $sum: "$total" } } }
            ],
            byMonth: [
              {
                $match: {
                  status: { $in: revenueStatuses },
                  orderDate: { $gte: yearStart, $lt: nextYearStart }
                }
              },
              {
                $group: {
                  _id: { month: { $month: "$orderDate" } },
                  total: { $sum: "$total" }
                }
              },
              { $sort: { "_id.month": 1 } }
            ]
          }
        }
      ]),
      
      // Low stock products - compare stocks against lowStockThreshold
      Product.countDocuments({
        isActive: true,
        $expr: {
          $or: [
            // If no variants, check global stocks
            {
              $and: [
                { $eq: [{ $size: { $ifNull: ["$stockItems", []] } }, 0] },
                { $lte: ["$stocks", { $ifNull: ["$lowStockThreshold", 5] }] }
              ]
            },
            // If variants exist, check if ANY variant is low on stock
            {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$stockItems", []] },
                      as: "item",
                      cond: { $lte: ["$$item.stock", { $ifNull: ["$lowStockThreshold", 5] }] }
                    }
                  }
                },
                0
              ]
            }
          ]
        }
      })
    ]);

    // Extract results from facet queries
    const stats = orderStats[0];
    const revenue = revenueStats[0];

    const totalOrders = stats.total[0]?.count || 0;
    const todayOrders = stats.today[0]?.count || 0;
    const weekOrders = stats.week[0]?.count || 0;
    const monthOrders = stats.month[0]?.count || 0;
    const pendingOrders = stats.pending[0]?.count || 0;

    const totalRevenue = revenue.total[0]?.total || 0;
    const revenueToday = revenue.today[0]?.total || 0;
    const revenueWeek = revenue.week[0]?.total || 0;
    const revenueMonth = revenue.month[0]?.total || 0;

    const revenueByMonth = Array.from({ length: 12 }, (_, idx) => {
      const month = idx + 1;
      const found = revenue.byMonth.find((r) => r?._id?.month === month);
      return { month, total: found?.total || 0 };
    });

    res.json({
      totalOrders,
      todayOrders,
      weekOrders,
      monthOrders,
      pendingOrders,
      lowStockProducts: lowStockCount,
      totalRevenue,
      revenueToday,
      revenueWeek,
      revenueMonth,
      revenueByMonth,
    });
  } catch (err) {
    next(err);
  }
};
