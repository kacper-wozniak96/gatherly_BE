/*
  Warnings:

  - You are about to drop the `postban` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postbantouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `postbantouser` DROP FOREIGN KEY `PostBanToUser_PostBanId_fkey`;

-- DropForeignKey
ALTER TABLE `postbantouser` DROP FOREIGN KEY `PostBanToUser_PostId_fkey`;

-- DropForeignKey
ALTER TABLE `postbantouser` DROP FOREIGN KEY `PostBanToUser_UserId_fkey`;

-- DropTable
DROP TABLE `postban`;

-- DropTable
DROP TABLE `postbantouser`;

-- CreateTable
CREATE TABLE `PostTypeOfBan` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Label` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostTypeOfBanToUser` (
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
ALTER TABLE `PostTypeOfBanToUser` ADD CONSTRAINT `PostTypeOfBanToUser_PostId_fkey` FOREIGN KEY (`PostId`) REFERENCES `Post`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTypeOfBanToUser` ADD CONSTRAINT `PostTypeOfBanToUser_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTypeOfBanToUser` ADD CONSTRAINT `PostTypeOfBanToUser_PostBanId_fkey` FOREIGN KEY (`PostBanId`) REFERENCES `PostTypeOfBan`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
