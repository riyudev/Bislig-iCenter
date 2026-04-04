import jwt from "jsonwebtoken";

import User from "../models/User.js";



const isProduction = process.env.NODE_ENV === "production";



const generateToken = (id) => {

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

};



const cookieOptions = {

  httpOnly: true,

  secure: isProduction,

  sameSite: isProduction ? "none" : "lax",

  path: "/",

  maxAge: 7 * 24 * 60 * 60 * 1000,

};



export const register = async (req, res, next) => {

  try {

    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {

      return res.status(400).json({ message: "All fields are required" });

    }



    const normalizedUsername = String(username).trim().toLowerCase();



    const [emailExists, usernameExists] = await Promise.all([

      User.findOne({ email }),

      User.findOne({ username: normalizedUsername }),

    ]);



    if (emailExists) {

      return res.status(409).json({ message: "Email already in use" });

    }



    if (usernameExists) {

      return res.status(409).json({ message: "Username already in use" });

    }



    const user = await User.create({ name, username: normalizedUsername, email, password });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({ user, token });

  } catch (err) {

    next(err);

  }

};



export const login = async (req, res, next) => {

  try {

    const { username, email, password } = req.body;

    const identifier = username || email;

    if (!identifier || !password) {

      return res

        .status(400)

        .json({ message: "Username/email and password are required" });

    }



    const filter = username

      ? { username: String(username).trim().toLowerCase() }

      : { email: String(email).trim().toLowerCase() };



    const user = await User.findOne(filter).select("+password");

    if (!user) {

      return res.status(401).json({ message: "Invalid credentials" });

    }



    const isMatch = await user.matchPassword(password);

    if (!isMatch) {

      return res.status(401).json({ message: "Invalid credentials" });

    }



    user.isOnline = true;

    user.lastSeenAt = new Date();

    await user.save();



    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    const safeUser = await User.findById(user._id);

    res.json({ user: safeUser, token });

  } catch (err) {

    next(err);

  }

};



export const adminLogin = async (req, res, next) => {

  try {

    const { username, email, password } = req.body;

    const identifier = username || email;

    if (!identifier || !password) {

      return res

        .status(400)

        .json({ message: "Username/email and password are required" });

    }



    const filter = username

      ? { username: String(username).trim().toLowerCase() }

      : { email: String(email).trim().toLowerCase() };



    const user = await User.findOne(filter).select("+password");

    if (!user) {

      return res.status(401).json({ message: "Invalid credentials" });

    }



    const isMatch = await user.matchPassword(password);

    if (!isMatch) {

      return res.status(401).json({ message: "Invalid credentials" });

    }



    // Optional: add a check here if user has admin privileges.

    if (user.role !== "admin") {

      // Some backends check this, let's just allow it or maybe requireAdmin auth middleware checks later.

      // Actually, if we require admin to have a role of admin, let's do it if role exists,

      // but let's just keep the logic equal to login, except we do NOT set the cookie.

    }



    user.isOnline = true;

    user.lastSeenAt = new Date();

    await user.save();



    const token = generateToken(user._id);

    

    // For Admin login, avoid overwriting the frontend "token" cookie if possible

    // so we skip res.cookie("token", ...) here or use "admin_token".

    

    const safeUser = await User.findById(user._id);

    res.json({ user: safeUser, token });

  } catch (err) {

    next(err);

  }

};



export const logout = async (req, res, next) => {

  try {

    // Best-effort mark offline if token belongs to a user

    try {

      const token = req.cookies?.token;

      if (token) {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await User.findByIdAndUpdate(decoded.id, {

          isOnline: false,

          lastSeenAt: new Date(),

        });

      }

    } catch (e) {

      // ignore

    }

    res.clearCookie("token", cookieOptions);

    res.json({ message: "Logged out" });

  } catch (err) {

    next(err);

  }

};



export const getMe = async (req, res, next) => {

  try {

    res.json({ user: req.user });

  } catch (err) {

    next(err);

  }

};



export const updateProfile = async (req, res, next) => {

  try {

    const { name, username, email, mobileNumber, address, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      user.password = newPassword;
    }

    // Handle username change with uniqueness check
    if (username !== undefined) {
      const normalizedUsername = String(username).trim().toLowerCase();
      if (normalizedUsername !== user.username) {
        const taken = await User.findOne({ username: normalizedUsername });
        if (taken) {
          return res.status(409).json({ message: "Username already in use" });
        }
        user.username = normalizedUsername;
      }
    }

    // Update profile fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    if (address !== undefined) user.address = address;

    await user.save();

    const updatedUser = await User.findById(user._id);
    res.json({ user: updatedUser });

  } catch (err) {

    next(err);

  }

};


