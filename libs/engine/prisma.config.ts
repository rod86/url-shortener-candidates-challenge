import "dotenv/config";
import { defineConfig } from "prisma/config"
import * as process from "node:process";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
