import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  datasource: {
    // The CLI (db push / migrate) uses the DIRECT Neon URL. The app itself uses DATABASE_URL (pooled) via the adapter in src/lib/db.ts.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
