import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";
import { E2E_USER } from "../e2e/fixtures";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = hashSync(E2E_USER.password, 10);

  const user = await prisma.user.upsert({
    where: { email_isAdmin: { email: E2E_USER.email, isAdmin: false } },
    update: { emailVerified: new Date() },
    create: {
      email: E2E_USER.email,
      passwordHash,
      fullName: E2E_USER.fullName,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ E2E user ready: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
