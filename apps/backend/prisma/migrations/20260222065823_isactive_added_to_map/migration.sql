/*
  Warnings:

  - You are about to drop the `StrategyEconomy` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `economy` to the `Strategy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StrategyEconomy" DROP CONSTRAINT "StrategyEconomy_strategyId_fkey";

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "economy" "Economy" NOT NULL;

-- DropTable
DROP TABLE "StrategyEconomy";
