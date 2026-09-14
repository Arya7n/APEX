import mongoose, { Schema } from "mongoose";

const nullableNumber = { type: Number, default: null };
const nullableString = { type: String, default: null };
const overrideSchema = new Schema({ sourceValue: Schema.Types.Mixed, overrideValue: Schema.Types.Mixed, isOverridden: { type: Boolean, default: false } }, { _id: false });

const bikeSchema = new Schema({
  externalId: { type: String, required: true },
  source: { type: String, enum: ["bikespecs", "api-ninjas", "seed", "manual"], required: true },
  brand: { type: String, required: true, index: true }, model: { type: String, required: true, index: true },
  variant: nullableString, year: { ...nullableNumber, index: true },
  slug: { type: String, required: true, unique: true }, category: { ...nullableString, index: true },
  description: nullableString,
  images: [{ id: String, provider: String, path: String, alt: String, role: String }],
  engine: { displacement: { ...nullableNumber, index: true }, configuration: nullableString, cylinders: nullableNumber, cooling: nullableString, compressionRatio: nullableString, bore: nullableNumber, stroke: nullableNumber, redline: nullableNumber },
  performance: { horsepower: { ...nullableNumber, index: true }, torque: nullableNumber, topSpeed: { ...nullableNumber, index: true }, zeroTo100: nullableNumber },
  dimensions: { weight: { ...nullableNumber, index: true }, seatHeight: nullableNumber, wheelbase: nullableNumber, fuelCapacity: nullableNumber, length: nullableNumber },
  chassis: { frame: nullableString, frontSuspension: nullableString, rearSuspension: nullableString, frontBrake: nullableString, rearBrake: nullableString, frontTyre: nullableString, rearTyre: nullableString },
  electronics: { ridingModes: [String], tractionControl: { type: Boolean, default: null }, abs: { type: Boolean, default: null }, quickshifter: { type: Boolean, default: null }, launchControl: { type: Boolean, default: null }, engineBrakeControl: { type: Boolean, default: null } },
  aerodynamics: { winglets: { type: Boolean, default: null }, downforce: nullableString },
  pricing: { basePrice: nullableNumber, currency: nullableString },
  derivedMetrics: { horsepowerPerKg: nullableNumber, torquePerKg: nullableNumber, displacementPerKg: nullableNumber, performanceScore: nullableNumber },
  overrides: { type: Map, of: overrideSchema, default: {} },
  metadata: { importedAt: { type: Date, required: true }, updatedAt: { type: Date, required: true }, sourceUpdatedAt: { type: Date, default: null } },
}, { timestamps: true });
bikeSchema.index({ brand: "text", model: "text", description: "text" });
bikeSchema.index({ source: 1, externalId: 1 }, { unique: true });

export const BikeModel = mongoose.model("Bike", bikeSchema);

const userSchema = new Schema({ email: { type: String, unique: true, required: true, lowercase: true }, name: { type: String, required: true }, passwordHash: { type: String, required: true }, role: { type: String, enum: ["user", "admin"], default: "user" }, refreshTokenHash: nullableString }, { timestamps: true });
export const UserModel = mongoose.model("User", userSchema);

function slugModel(name: string, extras: Record<string, unknown> = {}) {
  return mongoose.model(name, new Schema({ name: { type: String, required: true }, slug: { type: String, unique: true, required: true }, ...extras }, { timestamps: true }));
}
export const BrandModel = slugModel("Brand", { description: nullableString });
export const CategoryModel = slugModel("Category", { description: nullableString });
export const ArticleModel = slugModel("Article", { title: { type: String, required: true }, excerpt: nullableString, content: { type: String, required: true }, publishedAt: { type: Date, default: Date.now } });
ArticleModel.schema.index({ title: "text", content: "text" });
export const ComparisonModel = mongoose.model("Comparison", new Schema({ user: { type: Schema.Types.ObjectId, ref: "User" }, bikes: [{ type: Schema.Types.ObjectId, ref: "Bike" }], result: Schema.Types.Mixed }, { timestamps: true }));
export const FavoriteModel = mongoose.model("Favorite", new Schema({ user: { type: Schema.Types.ObjectId, ref: "User", required: true }, bike: { type: Schema.Types.ObjectId, ref: "Bike", required: true } }, { timestamps: true }));
FavoriteModel.schema.index({ user: 1, bike: 1 }, { unique: true });
export const GarageModel = mongoose.model("Garage", new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bike: { type: Schema.Types.ObjectId, ref: "Bike", required: true },
  category: { type: String, enum: ["dream", "track", "street"], default: "dream" },
  nickname: nullableString,
  notes: nullableString,
}, { timestamps: true }));
GarageModel.schema.index({ user: 1, bike: 1 }, { unique: true });
