/*
  Warnings:

  - You are about to drop the column `PostBanId` on the `postban` table. All the data in the column will be lost.
  - Added the required column `BanTypeId` to the `PostBan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `postban` DROP FOREIGN KEY `PostBan_PostBanId_fkey`;

-- AlterTable
ALTER TABLE `postban` DROP COLUMN `PostBanId`,
    ADD COLUMN `BanTypeId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `BanTypeId` ON `PostBan`(`BanTypeId`);

-- AddForeignKey
ALTER TABLE `PostBan` ADD CONSTRAINT `PostBan_BanTypeId_fkey` FOREIGN KEY (`BanTypeId`) REFERENCES `BanType`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
