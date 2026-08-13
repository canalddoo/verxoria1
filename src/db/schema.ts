import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const packages = sqliteTable("packages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  trackingCode: text("tracking_code").notNull().unique(), // Code de suivi unique
  // trackingCode: text("tracking_code").notNull().unique(),
  packageName: text("package_name").notNull(),
  recipient: text("recipient").notNull(),
  originCountry: text("origin_country").notNull(),
  originCity: text("origin_city").notNull(),
  destinationCountry: text("destination_country").notNull(),
  destinationCity: text("destination_city").notNull(),
  status: text("status").notNull().default("Étiquette créée"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});