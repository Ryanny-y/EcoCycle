-- CreateEnum
CREATE TYPE "RewardItemType" AS ENUM ('PRODUCT', 'FARM');

-- CreateEnum
CREATE TYPE "MainCategory" AS ENUM ('AGRICULTURAL', 'NON_AGRICULTURAL');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('KG', 'PIECE', 'BUNDLE', 'SACK', 'POT');

-- CreateTable
CREATE TABLE "reward_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "itemType" "RewardItemType" NOT NULL,
    "mainCategory" "MainCategory" NOT NULL,
    "subCategory" TEXT,
    "requiredPoints" INTEGER NOT NULL DEFAULT 1,
    "unit" "Unit" NOT NULL,
    "farmOrigin" TEXT,
    "stocks" INTEGER NOT NULL DEFAULT 0,
    "lastRestocked" TIMESTAMP(3),
    "imageUrl" TEXT,
    "imageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reward_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reward_items_name_key" ON "reward_items"("name");
