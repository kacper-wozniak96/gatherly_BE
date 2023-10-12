/*
  Warnings:

  - You are about to drop the column `status` on the `invitation` table. All the data in the column will be lost.
  - Added the required column `invitationStatusId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `Invitation_status_fkey`;

-- AlterTable
ALTER TABLE `invitation` DROP COLUMN `status`,
    ADD COLUMN `invitationStatusId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_invitationStatusId_fkey` FOREIGN KEY (`invitationStatusId`) REFERENCES `InvitationStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
