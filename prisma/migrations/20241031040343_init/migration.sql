-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `customer` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('Admin', 'Pelanggan') NOT NULL DEFAULT 'Pelanggan';
