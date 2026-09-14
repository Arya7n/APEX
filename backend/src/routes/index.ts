import { Router } from "express";
import { z } from "zod";
import { healthHandler } from "./health.js";
import { BikeModel, ArticleModel, BrandModel, CategoryModel, FavoriteModel, GarageModel, UserModel } from "../models/index.js";
import { listBikes } from "../services/bike-query.js";
import { getRanking, type Ranking } from "../services/rankings.js";
import { compareBikes } from "../utils/comparison.js";
import { scoreBike } from "../utils/recommendation.js";
import { login, logout, refresh, register } from "../services/auth.js";
import { authRequired, adminRequired, type AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";
import { getBikeDataProvider } from "../providers/index.js";
import { ingestBike } from "../services/ingest.js";
import { env } from "../config/env.js";

export const router = Router();

router.get("/health", healthHandler);
router.get("/api/health", healthHandler);
const asyncRoute = (fn: (req: any, res: any) => Promise<unknown>) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
const api = Router();
api.get("/providers/status", asyncRoute(async (_req, res) => {
  const checks: Record<string, { ok: boolean; detail: string }> = {};
  try {
    const response = await fetch(`${env.BIKESPECS_API_BASE_URL}/motorcycles?limit=1`, {
      signal: AbortSignal.timeout(8_000),
      headers: env.BIKESPECS_API_KEY
        ? { Authorization: `Bearer ${env.BIKESPECS_API_KEY}` }
        : {},
    });
    checks.bikespecs = {
      ok: response.ok,
      detail: `HTTP ${response.status}`,
    };
  } catch (error) {
    checks.bikespecs = {
      ok: false,
      detail: error instanceof Error ? error.message : "unreachable",
    };
  }

  try {
    if (!env.API_NINJAS_API_KEY) {
      checks["api-ninjas"] = { ok: false, detail: "API_NINJAS_API_KEY not set" };
    } else {
      const response = await fetch(
        `${env.API_NINJAS_API_BASE_URL}/v1/motorcycles?make=BMW&model=S%201000%20RR`,
        {
          headers: { "X-Api-Key": env.API_NINJAS_API_KEY },
          signal: AbortSignal.timeout(8_000),
        },
      );
      checks["api-ninjas"] = {
        ok: response.ok,
        detail: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    checks["api-ninjas"] = {
      ok: false,
      detail: error instanceof Error ? error.message : "unreachable",
    };
  }

  res.json({
    active: env.BIKE_DATA_PROVIDER,
    mongoSource: "primary",
    checks,
    note: "APEX serves bikes from MongoDB. External providers are used only for import/sync.",
  });
}));

api.get("/bikes", asyncRoute(async (req, res) => res.json(await listBikes({ ...req.query, page: Number(req.query.page) || undefined, limit: Number(req.query.limit) || undefined, year: Number(req.query.year) || undefined, minPower: Number(req.query.minPower) || undefined, maxPower: Number(req.query.maxPower) || undefined, minWeight: Number(req.query.minWeight) || undefined, maxWeight: Number(req.query.maxWeight) || undefined }))));
api.get("/bikes/search", asyncRoute(async (req, res) => res.json(await listBikes({ q: String(req.query.q ?? ""), limit: Number(req.query.limit) || undefined }))));
api.get("/bikes/:slug/similar", asyncRoute(async (req, res) => { const bike = await BikeModel.findOne({ slug: req.params.slug }).lean(); if (!bike) throw new HttpError(404, "Bike not found"); res.json(await BikeModel.find({ _id: { $ne: bike._id }, category: bike.category }).limit(6).lean()); }));
api.get("/bikes/:slug/stats", asyncRoute(async (req, res) => { const bike = await BikeModel.findOne({ slug: req.params.slug }).lean(); if (!bike) throw new HttpError(404, "Bike not found"); const faster = await BikeModel.countDocuments({ "derivedMetrics.performanceScore": { $gt: bike.derivedMetrics?.performanceScore ?? Infinity } }); res.json({ performanceRank: faster + 1, derivedMetrics: bike.derivedMetrics }); }));
api.get("/bikes/:slug", asyncRoute(async (req, res) => { const bike = await BikeModel.findOne({ slug: req.params.slug }).lean(); if (!bike) throw new HttpError(404, "Bike not found"); res.json(bike); }));
api.post("/comparisons", asyncRoute(async (req, res) => {
  const body = req.body ?? {};
  const ids = Array.isArray(body.bikeIds) ? body.bikeIds.filter(Boolean) : [];
  const slugs = Array.isArray(body.slugs) ? body.slugs.filter(Boolean) : [];
  if (ids.length + slugs.length < 2) throw new HttpError(400, "Provide 2-4 bikeIds or slugs");
  const query =
    ids.length > 0
      ? { _id: { $in: ids } }
      : { slug: { $in: slugs } };
  const bikes = await BikeModel.find(query).lean();
  if (bikes.length < 2 || bikes.length > 4) {
    throw new HttpError(400, "Compare requires 2-4 found bikes");
  }
  res.json({ bikes, ...compareBikes(bikes) });
}));
api.get("/rankings/:kind", asyncRoute(async (req, res) => { if (!["fastest","power","lightest","power-to-weight","torque"].includes(req.params.kind)) throw new HttpError(404, "Ranking not found"); res.json(await getRanking(req.params.kind as Ranking)); }));
api.post("/recommendations", asyncRoute(async (req, res) => { const bikes = await BikeModel.find().lean(); res.json(bikes.map(bike => ({ bike, ...scoreBike(bike, req.body) })).sort((a,b) => b.match-a.match).slice(0, 10)); }));
api.get("/articles", asyncRoute(async (_req, res) => res.json(await ArticleModel.find().sort({ publishedAt: -1 }).lean())));
api.get("/articles/:slug", asyncRoute(async (req, res) => { const article = await ArticleModel.findOne({ slug: req.params.slug }).lean(); if (!article) throw new HttpError(404, "Article not found"); res.json(article); }));
const credentials = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(1).optional() });
api.post("/auth/register", validateBody(credentials.extend({ name: z.string().min(1) })), asyncRoute(async (req, res) => res.status(201).json(await register(req.body.email, req.body.name, req.body.password))));
api.post("/auth/login", validateBody(credentials), asyncRoute(async (req, res) => res.json(await login(req.body.email, req.body.password))));
api.post("/auth/refresh", asyncRoute(async (req, res) => res.json(await refresh(String(req.body.refreshToken ?? "")))));
api.post("/auth/logout", authRequired, asyncRoute(async (req: AuthRequest, res) => { await logout(req.auth!.userId); res.status(204).end(); }));
api.get("/auth/me", authRequired, asyncRoute(async (req: AuthRequest, res) => {
  const user = await UserModel.findById(req.auth!.userId).select("email name role createdAt updatedAt").lean();
  if (!user) throw new HttpError(404, "User not found");
  res.json({ id: String(user._id), email: user.email, name: user.name, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt });
}));
api.get("/favorites", authRequired, asyncRoute(async (req: AuthRequest, res) => res.json(await FavoriteModel.find({ user: req.auth!.userId }).populate("bike").lean())));
api.post("/favorites/:bikeId", authRequired, asyncRoute(async (req: AuthRequest, res) => res.status(201).json(await FavoriteModel.findOneAndUpdate({ user: req.auth!.userId, bike: req.params.bikeId }, {}, { upsert: true, new: true }))));
api.delete("/favorites/:bikeId", authRequired, asyncRoute(async (req: AuthRequest, res) => { await FavoriteModel.deleteOne({ user: req.auth!.userId, bike: req.params.bikeId }); res.status(204).end(); }));
api.get("/garage", authRequired, asyncRoute(async (req: AuthRequest, res) => res.json(await GarageModel.find({ user: req.auth!.userId }).populate("bike").lean())));
api.post("/garage", authRequired, asyncRoute(async (req: AuthRequest, res) => res.status(201).json(await GarageModel.create({ ...req.body, user: req.auth!.userId }))));
api.delete("/garage/:id", authRequired, asyncRoute(async (req: AuthRequest, res) => { await GarageModel.deleteOne({ _id: req.params.id, user: req.auth!.userId }); res.status(204).end(); }));
api.get("/search", asyncRoute(async (req, res) => { const q = String(req.query.q ?? ""); const regex = new RegExp(q, "i"); const [bikes, articles, brands] = await Promise.all([BikeModel.find({ $or: [{ brand: regex }, { model: regex }] }).limit(10).lean(), ArticleModel.find({ title: regex }).limit(10).lean(), BrandModel.find({ name: regex }).limit(10).lean()]); res.json({ bikes, articles, brands }); }));
api.post("/admin/bikes/import", authRequired, adminRequired, asyncRoute(async (req, res) => res.status(201).json(await ingestBike(await getBikeDataProvider().getBike(String(req.body.id))))));
api.post("/admin/bikes/sync", authRequired, adminRequired, asyncRoute(async (req, res) => { const rows = await getBikeDataProvider().getBikes(req.body ?? {}); res.json(await Promise.all(rows.map(ingestBike))); }));
for (const [path, model] of [["bikes", BikeModel], ["brands", BrandModel], ["categories", CategoryModel], ["articles", ArticleModel]] as const) {
  const collection = model as any;
  api.post(`/admin/${path}`, authRequired, adminRequired, asyncRoute(async (req, res) => res.status(201).json(await collection.create(req.body))));
  api.put(`/admin/${path}/:id`, authRequired, adminRequired, asyncRoute(async (req, res) => res.json(await collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))));
  api.delete(`/admin/${path}/:id`, authRequired, adminRequired, asyncRoute(async (req, res) => { await collection.findByIdAndDelete(req.params.id); res.status(204).end(); }));
}
api.get("/admin/stats", authRequired, adminRequired, asyncRoute(async (_req, res) => res.json({ bikes: await BikeModel.countDocuments(), users: await UserModel.countDocuments(), articles: await ArticleModel.countDocuments() })));
api.get("/admin/users", authRequired, adminRequired, asyncRoute(async (_req, res) => res.json(await UserModel.find().select("-passwordHash -refreshTokenHash").lean())));
router.use("/api", api);
