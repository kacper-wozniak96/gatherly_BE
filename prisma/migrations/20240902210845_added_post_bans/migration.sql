-- CreateTable
CREATE TABLE `PostBan` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Label` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostBanToUser` (
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
ALTER TABLE `PostBanToUser` ADD CONSTRAINT `PostBanToUser_PostId_fkey` FOREIGN KEY (`PostId`) REFERENCES `Post`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostBanToUser` ADD CONSTRAINT `PostBanToUser_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostBanToUser` ADD CONSTRAINT `PostBanToUser_PostBanId_fkey` FOREIGN KEY (`PostBanId`) REFERENCES `PostBan`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
