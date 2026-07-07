-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('factory', 'agency');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "suggested_organizations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255),
    "status" "SuggestionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggested_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factories" (
    "id" SERIAL NOT NULL,
    "reg_number" VARCHAR(50),
    "name" VARCHAR(500) NOT NULL,
    "operator" VARCHAR(500),
    "business_activity" TEXT,
    "house_number" VARCHAR(100),
    "village" VARCHAR(100),
    "soi" VARCHAR(200),
    "road" VARCHAR(200),
    "subdistrict" VARCHAR(200),
    "district" VARCHAR(200),
    "province" VARCHAR(200),
    "postal_code" VARCHAR(10),
    "phone" VARCHAR(50),
    "type" VARCHAR(100),
    "capital_baht" DECIMAL,
    "workers" INTEGER,
    "horsepower" DECIMAL,
    "tsic" VARCHAR(50),
    "country" VARCHAR(100) NOT NULL DEFAULT 'Thailand',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "factories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER,
    "factory_id" INTEGER,
    "worker_role" VARCHAR(255) NOT NULL,
    "country_from" VARCHAR(100) NOT NULL,
    "rating_salary" INTEGER NOT NULL,
    "rating_ot" INTEGER NOT NULL,
    "rating_housing" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "factories_reg_number_key" ON "factories"("reg_number");

-- CreateIndex
CREATE INDEX "factories_name_idx" ON "factories"("name");

-- CreateIndex
CREATE INDEX "factories_province_idx" ON "factories"("province");

-- CreateIndex
CREATE INDEX "factories_district_idx" ON "factories"("district");

-- CreateIndex
CREATE INDEX "reviews_factory_id_idx" ON "reviews"("factory_id");

-- CreateIndex
CREATE INDEX "reviews_organization_id_idx" ON "reviews"("organization_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "suggested_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
