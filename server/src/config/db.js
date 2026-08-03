import mongoose from "mongoose";

const KEEP_ALIVE_MS = 4 * 60 * 1000; // 4 minutes
let keepAliveTimer = null;

function startKeepAlive() {
  if (keepAliveTimer) return; // already running
  keepAliveTimer = setInterval(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        // lightweight ping to keep the connection warm
        await mongoose.connection.db.admin().ping();
        console.log("[keep-alive] MongoDB ping OK");
      } else {
        console.warn("[keep-alive] MongoDB not connected, state:", mongoose.connection.readyState);
      }
    } catch (err) {
      console.error("[keep-alive] MongoDB ping failed:", err.message);
    }
  }, KEEP_ALIVE_MS);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected — attempting to reconnect...");
    mongoose.connect(uri).catch((err) => {
      console.error("MongoDB reconnect failed:", err.message);
    });
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  startKeepAlive();
}
