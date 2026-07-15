import { defineConfig } from "@prisma/config";

export default defineConfig({
  migrations: {
    seed: "bash prisma/seed-all.sh",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
