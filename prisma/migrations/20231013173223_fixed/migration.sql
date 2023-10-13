/*
  Warnings:

  - The primary key for the `attendee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gatheringId` on the `attendee` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `attendee` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `attendee` table. All the data in the column will be lost.
  - The primary key for the `gathering` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `gathering` table. All the data in the column will be lost.
  - The primary key for the `gatheringtype` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `gatheringtype` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `gatheringtype` table. All the data in the column will be lost.
  - The primary key for the `invitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdOnUtc` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the column `gatheringId` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the column `invitationStatusId` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `invitation` table. All the data in the column will be lost.
  - The primary key for the `invitationstatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `invitationstatus` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `invitationstatus` table. All the data in the column will be lost.
  - The primary key for the `member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `member` table. All the data in the column will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Email]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `GatheringId` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MemberId` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Gathering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `GatheringType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Label` to the `GatheringType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GatheringId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvitationStatusId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MemberId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `InvitationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Label` to the `InvitationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FirstName` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LastName` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendee` DROP FOREIGN KEY `Attendee_gatheringId_fkey`;

-- DropForeignKey
ALTER TABLE `attendee` DROP FOREIGN KEY `Attendee_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `gathering` DROP FOREIGN KEY `Gathering_CreatorId_fkey`;

-- DropForeignKey
ALTER TABLE `gathering` DROP FOREIGN KEY `Gathering_Type_fkey`;

-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `Invitation_gatheringId_fkey`;

-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `Invitation_invitationStatusId_fkey`;

-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `Invitation_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropIndex
DROP INDEX `Member_email_key` ON `member`;

-- AlterTable
ALTER TABLE `attendee` DROP PRIMARY KEY,
    DROP COLUMN `gatheringId`,
    DROP COLUMN `id`,
    DROP COLUMN `memberId`,
    ADD COLUMN `GatheringId` INTEGER NOT NULL,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `MemberId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `gathering` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `gatheringtype` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `label`,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `Label` VARCHAR(50) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `invitation` DROP PRIMARY KEY,
    DROP COLUMN `createdOnUtc`,
    DROP COLUMN `gatheringId`,
    DROP COLUMN `id`,
    DROP COLUMN `invitationStatusId`,
    DROP COLUMN `memberId`,
    ADD COLUMN `CreatedOnUtc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `GatheringId` INTEGER NOT NULL,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `InvitationStatusId` INTEGER NOT NULL,
    ADD COLUMN `MemberId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `invitationstatus` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `label`,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `Label` VARCHAR(50) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `member` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `firstName`,
    DROP COLUMN `id`,
    DROP COLUMN `lastName`,
    ADD COLUMN `Email` VARCHAR(191) NOT NULL,
    ADD COLUMN `FirstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `LastName` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `user`;

-- CreateIndex
CREATE UNIQUE INDEX `Member_Email_key` ON `Member`(`Email`);

-- AddForeignKey
ALTER TABLE `Gathering` ADD CONSTRAINT `Gathering_CreatorId_fkey` FOREIGN KEY (`CreatorId`) REFERENCES `Member`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gathering` ADD CONSTRAINT `Gathering_Type_fkey` FOREIGN KEY (`Type`) REFERENCES `GatheringType`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendee` ADD CONSTRAINT `Attendee_MemberId_fkey` FOREIGN KEY (`MemberId`) REFERENCES `Member`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendee` ADD CONSTRAINT `Attendee_GatheringId_fkey` FOREIGN KEY (`GatheringId`) REFERENCES `Gathering`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_InvitationStatusId_fkey` FOREIGN KEY (`InvitationStatusId`) REFERENCES `InvitationStatus`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_MemberId_fkey` FOREIGN KEY (`MemberId`) REFERENCES `Member`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_GatheringId_fkey` FOREIGN KEY (`GatheringId`) REFERENCES `Gathering`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
