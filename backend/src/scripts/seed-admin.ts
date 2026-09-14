import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { UserModel } from "../models/index.js";

const email = process.env.ADMIN_EMAIL ?? "admin@apex.local";
const password = process.env.ADMIN_PASSWORD ?? "ApexAdmin123!";
const name = process.env.ADMIN_NAME ?? "APEX Admin";

await mongoose.connect(env.MONGODB_URI);
try {
  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.findOneAndUpdate(
    { email },
    { $set: { email, name, passwordHash, role: "admin" } },
    { upsert: true, new: true },
  );
  console.info(`Admin ready: ${email}`);
} finally {
  await mongoose.disconnect();
}
