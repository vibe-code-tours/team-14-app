import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "Demo1234!";
const passwordHash = hashSync(DEMO_PASSWORD, 10);

const demoUsers = [
  {
    email: "demo@workervoice.org",
    fullName: "Demo User",
    role: "user" as const,
    isAdmin: false,
    isSuperAdmin: false,
  },
  {
    email: "demo-superadmin@workervoice.org",
    fullName: "Demo Super Admin",
    role: "administrator" as const,
    isAdmin: true,
    isSuperAdmin: true,
  },
  {
    email: "demo-admin@workervoice.org",
    fullName: "Demo Admin",
    role: "administrator" as const,
    isAdmin: true,
    isSuperAdmin: false,
  },
];

async function main() {
  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: {
        email_isAdmin: {
          email: userData.email,
          isAdmin: userData.isAdmin,
        },
      },
      update: {
        passwordHash,
        fullName: userData.fullName,
        role: userData.role,
        isSuperAdmin: userData.isSuperAdmin,
        emailVerified: new Date(),
      },
      create: {
        email: userData.email,
        passwordHash,
        fullName: userData.fullName,
        role: userData.role,
        isAdmin: userData.isAdmin,
        isSuperAdmin: userData.isSuperAdmin,
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Demo user ready: ${user.email} (${userData.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
