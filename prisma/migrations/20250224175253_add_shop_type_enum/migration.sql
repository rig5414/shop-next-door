/*
  Warnings:

  - Changed the type of `type` on the `Shop` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShopType" AS ENUM ('local_shop', 'grocery_shop');

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "type",
ADD COLUMN     "type" "ShopType" NOT NULL;
