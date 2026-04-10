/*
  Warnings:

  - A unique constraint covering the columns `[name,area]` on the table `Subdivision` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subdivision_name_area_key" ON "Subdivision"("name", "area");
