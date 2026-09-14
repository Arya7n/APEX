import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { createHash } from "node:crypto";
import { env } from "../config/env.js";
import { UserModel } from "../models/index.js";
import { HttpError } from "../middleware/errorHandler.js";

const hash = (v: string) => createHash("sha256").update(v).digest("hex");

function publicUser(user: { _id: unknown; email: string; name: string; role: string; createdAt?: Date; updatedAt?: Date }) {
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function tokens(user: { _id: unknown; role: string }) {
  const payload = { sub: String(user._id), role: user.role };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"],
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"],
  });
  return { accessToken, refreshToken };
}

export async function register(email: string, name: string, password: string) {
  if (await UserModel.exists({ email })) throw new HttpError(409, "Email already registered");
  const user = await UserModel.create({
    email,
    name,
    passwordHash: await bcrypt.hash(password, 12),
  });
  const result = tokens(user);
  user.refreshTokenHash = hash(result.refreshToken);
  await user.save();
  return { user: publicUser(user), ...result };
}

export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid credentials");
  }
  const result = tokens(user);
  user.refreshTokenHash = hash(result.refreshToken);
  await user.save();
  return { user: publicUser(user), ...result };
}

export async function refresh(token: string) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
  const user = await UserModel.findById(payload.sub);
  if (!user || user.refreshTokenHash !== hash(token)) {
    throw new HttpError(401, "Invalid refresh token");
  }
  const result = tokens(user);
  user.refreshTokenHash = hash(result.refreshToken);
  await user.save();
  return { user: publicUser(user), ...result };
}

export async function logout(userId: string) {
  await UserModel.findByIdAndUpdate(userId, { $set: { refreshTokenHash: null } });
}
