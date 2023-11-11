/*
  Warnings:

  - Added the required column `CreatedOnUtc` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendee` ADD COLUMN `CreatedOnUtc` DATETIME(3) NOT NULL;
