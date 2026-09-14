import { Router } from "express";
import { healthHandler } from "./health.js";

export const router = Router();

router.get("/health", healthHandler);
router.get("/api/health", healthHandler);
