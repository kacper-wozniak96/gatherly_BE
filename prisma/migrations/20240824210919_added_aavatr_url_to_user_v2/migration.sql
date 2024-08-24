/*
  Warnings:

  - You are about to drop the column `AvatarURL` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `AvatarURL`,
    ADD COLUMN `AvatarS3Key` VARCHAR(191) NULL;
