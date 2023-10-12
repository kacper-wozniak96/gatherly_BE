-- AlterTable
ALTER TABLE `gathering` ADD COLUMN `InvitationsExpireAtUtc` DATETIME(3) NULL,
    ADD COLUMN `MaxiumNumberOfAttendess` INTEGER NULL;
