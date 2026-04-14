/*
  Warnings:

  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('EARN', 'REDEEM');

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_subdivisionId_fkey";

-- DropTable
DROP TABLE "Record";

-- CreateTable
CREATE TABLE "records" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "suffix" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "isResident" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'RESIDENT',
    "address" TEXT,
    "contactNumber" TEXT,
    "subdivisionId" TEXT NOT NULL,
    "points" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_materials" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL,
    "points" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reward_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_activities" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "points" DECIMAL(10,2) NOT NULL,
    "type" "RewardType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reward_materials_activityId_materialId_key" ON "reward_materials"("activityId", "materialId");

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_subdivisionId_fkey" FOREIGN KEY ("subdivisionId") REFERENCES "Subdivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_materials" ADD CONSTRAINT "reward_materials_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "reward_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_materials" ADD CONSTRAINT "reward_materials_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_activities" ADD CONSTRAINT "reward_activities_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
