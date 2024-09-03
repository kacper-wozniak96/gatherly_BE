/*
  Warnings:

  - You are about to drop the `posttypeofban` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posttypeofbantouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `posttypeofbantouser` DROP FOREIGN KEY `PostTypeOfBanToUser_PostBanId_fkey`;

-- DropForeignKey
ALTER TABLE `posttypeofbantouser` DROP FOREIGN KEY `PostTypeOfBanToUser_PostId_fkey`;

-- DropForeignKey
ALTER TABLE `posttypeofbantouser` DROP FOREIGN KEY `PostTypeOfBanToUser_UserId_fkey`;

-- DropTable
DROP TABLE `posttypeofban`;

-- DropTable
DROP TABLE `posttypeofbantouser`;

-- CreateTable
CREATE TABLE `BanType` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Label` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostBan` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `PostId` INTEGER NOT NULL,
    `UserId` INTEGER NOT NULL,
    `PostBanId` INTEGER NOT NULL,

    INDEX `PostId`(`PostId`),
    INDEX `UserId`(`UserId`),
    INDEX `PostBanId`(`PostBanId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostBan` ADD CONSTRAINT `PostBan_PostId_fkey` FOREIGN KEY (`PostId`) REFERENCES `Post`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostBan` ADD CONSTRAINT `PostBan_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostBan` ADD CONSTRAINT `PostBan_PostBanId_fkey` FOREIGN KEY (`PostBanId`) REFERENCES `BanType`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
