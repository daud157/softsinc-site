import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var _softsincMongoose: MongooseCache | undefined;
}

const cached: MongooseCache =
  global._softsincMongoose ?? { conn: null, promise: null };

if (!global._softsincMongoose) {
  global._softsincMongoose = cached;
}

/** Safe to import during `next build` when `MONGODB_URI` is unset. */
export async function connectDB(): Promise<Mongoose> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Set it in .env.local or Vercel Project → Settings → Environment Variables."
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      /** Prefer IPv4 when IPv6/DNS is flaky (common cause of `queryTxt ETIMEOUT`). */
      family: 4,
      serverSelectionTimeoutMS: 20_000,
      socketTimeoutMS: 45_000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
