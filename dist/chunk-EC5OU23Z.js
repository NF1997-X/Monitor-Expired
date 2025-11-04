var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  foodItems: () => foodItems,
  insertFoodItemSchema: () => insertFoodItemSchema,
  updateFoodItemSchema: () => updateFoodItemSchema
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var foodItems = pgTable("food_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  expiryDate: timestamp("expiry_date", { withTimezone: true }).notNull(),
  category: text("category").notNull(),
  notes: text("notes"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`)
});
var insertFoodItemSchema = createInsertSchema(foodItems).omit({
  id: true,
  isDeleted: true,
  deletedAt: true,
  createdAt: true
}).extend({
  expiryDate: z.union([z.date(), z.string().transform((str) => new Date(str))])
});
var updateFoodItemSchema = insertFoodItemSchema.partial().extend({
  expiryDate: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional()
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

export {
  foodItems,
  insertFoodItemSchema,
  updateFoodItemSchema,
  pool,
  db
};
