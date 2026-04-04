import User from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search, status } = req.query;
    const conditions = [];

    if (role) conditions.push({ role });
    if (search) {
      conditions.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ],
      });
    }

    const now = Date.now();
    const activeWindowMs = 2 * 60 * 1000; // 2 minutes
    const activeSince = new Date(now - activeWindowMs);

    if (status === "active") {
      conditions.push({ isOnline: true, lastSeenAt: { $gte: activeSince } });
    } else if (status === "inactive") {
      conditions.push({
        $or: [
          { isOnline: { $ne: true } },
          { lastSeenAt: { $lt: activeSince } },
          { lastSeenAt: null },
        ],
      });
    }

    const filter = conditions.length > 0 ? { $and: conditions } : {};

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(filter);

    const decorated = users.map((u) => {
      const lastSeenAt = u.lastSeenAt ? new Date(u.lastSeenAt).getTime() : 0;
      const isActive = u.isOnline === true && lastSeenAt && now - lastSeenAt <= activeWindowMs;
      return {
        ...u.toJSON(),
        computedStatus: isActive ? "active" : "inactive",
      };
    });

    res.json({ users: decorated, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Only allow safe updates from admin panel.
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(typeof isActive === "boolean" ? { isActive } : {}) },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
