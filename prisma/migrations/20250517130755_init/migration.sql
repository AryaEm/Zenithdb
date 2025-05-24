/*
  Warnings:

  - You are about to drop the column `status` on the `game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `game` DROP COLUMN `status`,
    ADD COLUMN `Owned` ENUM('True', 'False') NOT NULL DEFAULT 'False';
