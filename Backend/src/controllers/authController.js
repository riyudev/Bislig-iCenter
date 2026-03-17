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

