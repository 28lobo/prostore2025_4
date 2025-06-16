/*
  Warnings:

  - You are about to drop the column `paymmentMethod` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "paymmentMethod",
ADD COLUMN     "paymentMethod" TEXT;
