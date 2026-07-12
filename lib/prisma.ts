const isCloudflare = !!(
  process.env.CF_PAGES ||
  process.env.WRANGLER ||
  process.env.CLOUDFLARE
);

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

function createPrismaClient() {
  if (isCloudflare) {
    // Edge client + HTTP adapter for Cloudflare Workers (no TCP support)
    const { PrismaClient: EdgeClient } = require("@prisma/client/edge");
    const { PrismaNeonHTTP } = require("@prisma/adapter-neon");
    const adapter = new PrismaNeonHTTP({
      connectionString: process.env.DATABASE_URL!,
    });
    return new EdgeClient({ adapter });
  } else {
    // Standard Prisma client with PG adapter for local/Node.js environments
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    return new PrismaClient({ adapter });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
