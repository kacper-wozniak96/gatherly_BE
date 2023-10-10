-- AddForeignKey
ALTER TABLE `Gathering` ADD CONSTRAINT `Gathering_CreatorId_fkey` FOREIGN KEY (`CreatorId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
