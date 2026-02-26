/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Strategy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Strategy" DROP CONSTRAINT "Strategy_mapId_fkey";

-- DropForeignKey
ALTER TABLE "Strategy" DROP CONSTRAINT "Strategy_userId_fkey";

-- DropForeignKey
ALTER TABLE "StrategyComment" DROP CONSTRAINT "StrategyComment_strategyId_fkey";

-- DropForeignKey
ALTER TABLE "Utility" DROP CONSTRAINT "Utility_strategyId_fkey";

-- DropIndex
DROP INDEX "Strategy_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_name_userId_key" ON "Strategy"("name", "userId");

-- AddForeignKey
ALTER TABLE "Utility" ADD CONSTRAINT "Utility_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyComment" ADD CONSTRAINT "StrategyComment_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
