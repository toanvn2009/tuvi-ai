import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(new Date()).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * LLM Configuration table for admin settings
 */
export const llmSettings = sqliteTable("llm_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  baseUrl: text("baseUrl").notNull().default("https://api.openai.com/v1"),
  model: text("model").notNull().default("gpt-4"),
  apiKey: text("apiKey").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type LLMSetting = typeof llmSettings.$inferSelect;
export type InsertLLMSetting = typeof llmSettings.$inferInsert;

/**
 * Tử Vi readings history
 */
export const tuviReadings = sqliteTable("tuvi_readings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").references(() => users.id),
  fullName: text("fullName").notNull(),
  birthDate: text("birthDate").notNull(),
  birthHour: text("birthHour").notNull(),
  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  calendarType: text("calendarType", { enum: ["lunar", "solar"] }).notNull(),
  chartData: text("chartData", { mode: "json" }),
  aiAnalysis: text("aiAnalysis"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type TuviReading = typeof tuviReadings.$inferSelect;
export type InsertTuviReading = typeof tuviReadings.$inferInsert;

/**
 * Numerology readings history
 */
export const numerologyReadings = sqliteTable("numerology_readings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").references(() => users.id),
  fullName: text("fullName").notNull(),
  birthDate: text("birthDate").notNull(),
  lifePathNumber: integer("lifePathNumber").notNull(),
  soulNumber: integer("soulNumber").notNull(),
  personalityNumber: integer("personalityNumber").notNull(),
  destinyNumber: integer("destinyNumber").notNull(),
  birthDayNumber: integer("birthDayNumber").notNull(),
  birthChart: text("birthChart", { mode: "json" }),
  aiAnalysis: text("aiAnalysis"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type NumerologyReading = typeof numerologyReadings.$inferSelect;
export type InsertNumerologyReading = typeof numerologyReadings.$inferInsert;

export const tuviStars = sqliteTable("tuvi_stars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vietnameseName: text("vietnameseName").notNull().unique(),
  chineseName: text("chineseName").notNull(),
  pinyin: text("pinyin"),
  nature: text("nature", { enum: ["cat", "hung", "neutral"] }).notNull(),
  type: text("type", { enum: ["main", "secondary", "auxiliary"] }).default("main").notNull(),
  meaning: text("meaning"),
  description: text("description"),
  influence: text("influence"),
  palaceInfluence: text("palaceInfluence", { mode: "json" }),
  remedy: text("remedy"),
  compatibility: text("compatibility", { mode: "json" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type TuviStar = typeof tuviStars.$inferSelect;
export type InsertTuviStar = typeof tuviStars.$inferInsert;

/**
 * Tử Vi AI Analysis Cache
 * Cache kết quả phân tích AI để tránh gọi API LLM nhiều lần cho cùng input
 */
export const tuviCache = sqliteTable("tuvi_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  birthDate: text("birthDate").notNull(),
  birthHour: text("birthHour").notNull(),
  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  calendarType: text("calendarType", { enum: ["lunar", "solar"] }).notNull(),
  year: integer("year").notNull(), // Năm sinh để cache riêng theo năm (using integer for year)
  chartData: text("chartData", { mode: "json" }).notNull(), // Lưu chart data đã tính
  aiAnalysis: text("aiAnalysis").notNull(), // Kết quả phân tích AI tổng quan
  palaceAnalyses: text("palaceAnalyses", { mode: "json" }), // Lưu phân tích chi tiết 12 cung: { "Mệnh": "...", "Phụ Mẫu": "...", ... }
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type TuviCache = typeof tuviCache.$inferSelect;
export type InsertTuviCache = typeof tuviCache.$inferInsert;

/**
 * Numerology AI Analysis Cache
 * Cache kết quả phân tích AI để tránh gọi API LLM nhiều lần cho cùng ngày sinh
 */
export const numerologyCache = sqliteTable("numerology_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("fullName").notNull(),
  birthDate: text("birthDate").notNull(), // YYYY-MM-DD format
  year: integer("year").notNull(), // Năm sinh để cache riêng theo năm
  lifePathNumber: integer("lifePathNumber").notNull(),
  soulNumber: integer("soulNumber").notNull(),
  personalityNumber: integer("personalityNumber").notNull(),
  destinyNumber: integer("destinyNumber").notNull(),
  birthDayNumber: integer("birthDayNumber").notNull(),
  birthChart: text("birthChart", { mode: "json" }).notNull(), // Kết quả tính toán numerology
  aiAnalysis: text("aiAnalysis").notNull(), // Kết quả phân tích AI
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type NumerologyCache = typeof numerologyCache.$inferSelect;
export type InsertNumerologyCache = typeof numerologyCache.$inferInsert;

/**
 * Zodiac Forecast Cache
 * Cache dự báo vận mệnh 12 con giáp
 */
export const zodiacCache = sqliteTable("zodiac_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animal: text("animal").notNull(), // rat, ox, ...
  year: integer("year").notNull(), // Năm dự báo (2026)
  content: text("content").notNull(), // Nội dung dự báo
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type ZodiacCache = typeof zodiacCache.$inferSelect;
export type InsertZodiacCache = typeof zodiacCache.$inferInsert;

/**
 * Tet Tools Cache
 * Cache kết quả các công cụ Tết (Xông đất, Lời khuyên tổng hợp)
 */
export const tetCache = sqliteTable("tet_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  functionName: text("functionName").notNull(), // 'xongDat', 'fullAdvice'
  birthYear: integer("birthYear").notNull(), // Năm sinh của user
  year: integer("year").notNull(), // Năm Tết (2026)
  data: text("data", { mode: "json" }).notNull(), // Kết quả tính toán (JSON)
  aiAdvice: text("aiAdvice").notNull(), // Lời khuyên AI
  createdAt: integer("createdAt", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(new Date()).notNull(),
});

export type TetCache = typeof tetCache.$inferSelect;
export type InsertTetCache = typeof tetCache.$inferInsert;
