/*
  Warnings:

  - Made the column `image` on table `ProductCatalog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductCatalog" ALTER COLUMN "image" SET NOT NULL;
