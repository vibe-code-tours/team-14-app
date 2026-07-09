-- CreateEnum
CREATE TYPE "FactoryStatus" AS ENUM ('pending', 'approved', 'declined');

-- AlterTable
ALTER TABLE "factories" ADD COLUMN  "status" "FactoryStatus" NOT NULL DEFAULT 'approved';

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "is_admin" BOOLEAN NOT NULL DEFAULT false;
