/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `email` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Admin_email_key` ON `Admin`(`email`);
