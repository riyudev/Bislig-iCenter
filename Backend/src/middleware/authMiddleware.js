import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;

    // Lightweight presence update (best-effort)
    user.lastSeenAt = new Date();
    if (user.isOnline !== true) user.isOnline = true;
    user.save().catch(() => {});

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export const adminProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;

    user.lastSeenAt = new Date();
    if (user.isOnline !== true) user.isOnline = true;
    user.save().catch(() => {});

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};
