import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "./errorHandler.js";
export interface AuthRequest extends Request { auth?: { userId: string; role: string } }
export function authRequired(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return next(new HttpError(401, "Authentication required"));
  try { const value = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: string }; req.auth = { userId: value.sub, role: value.role }; next(); }
  catch { next(new HttpError(401, "Invalid or expired access token")); }
}
export function adminRequired(req: AuthRequest, _res: Response, next: NextFunction) {
  if (req.auth?.role !== "admin") return next(new HttpError(403, "Admin access required")); next();
}
