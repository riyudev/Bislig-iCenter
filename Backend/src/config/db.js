import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  mongoose.set("strictQuery", true);

  try {
    // Determine target database name in this priority order:
    // 1) Explicit env var MONGODB_DB_NAME
    // 2) Database parsed from URI path (mongodb+srv://.../<db>?...)
    // 3) Fallback default
    const dbNameFromEnv = process.env.MONGODB_DB_NAME && process.env.MONGODB_DB_NAME.trim();
    const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/i);
    const dbNameFromUri = match ? match[1] : undefined;
    const dbName = dbNameFromEnv || dbNameFromUri || "bislig_icenter";

    const conn = await mongoose.connect(uri, { dbName });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};
