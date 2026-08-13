import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Charge les variables depuis .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts", // Chemin mis à jour vers src/db/schema.ts
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
});