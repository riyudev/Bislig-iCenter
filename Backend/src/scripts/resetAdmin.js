import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const DEFAULT_EMAIL = "admin@bisligicenter.com";
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }

    const dbName = process.env.MONGODB_DB_NAME || "bislig_icenter";
    await mongoose.connect(uri, { dbName });

    const email = process.env.ADMIN_EMAIL || DEFAULT_EMAIL;
    const username = (process.env.ADMIN_USERNAME || DEFAULT_USERNAME)
      .trim()
      .toLowerCase();
    const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;

    let admin = await User.findOne({ username }).select("+password");
    if (!admin) {
      admin = await User.findOne({ email }).select("+password");
    }

    if (!admin) {
      admin = new User({ name: "Admin", username, email, password, role: "admin" });
      await admin.save();
      console.log(`Created admin: ${username} / ${password}`);
    } else {
      admin.username = admin.username || username;
      admin.email = email;
      admin.password = password;
      admin.role = "admin";
      await admin.save();
      console.log(`Reset admin password: ${username} / ${password}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Reset admin error:", err.message);
    process.exit(1);
  }
};

run();
