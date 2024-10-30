/*
  Warnings:

  - You are about to drop the column `idAdmin` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `idPelanggan` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pelanggan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_idAdmin_fkey`;

-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_idPelanggan_fkey`;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `idAdmin`,
    DROP COLUMN `idPelanggan`,
    ADD COLUMN `userId` INTEGER NULL;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `pelanggan`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `nomor_telp` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('Admin', 'Pelanggan') NOT NULL DEFAULT 'Admin',
    `jenis_kelamin` ENUM('Laki_laki', 'Perempuan') NOT NULL DEFAULT 'Laki_laki',
    `profil_picture` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
