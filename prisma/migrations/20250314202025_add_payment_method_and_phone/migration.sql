-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('mpesa', 'airtel', 'cod');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'cod',
ADD COLUMN     "phoneNumber" TEXT;
