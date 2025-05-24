/*
  Warnings:

  - You are about to drop the column `idTransaski` on the `detail_transaksi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `detail_transaksi` DROP FOREIGN KEY `Detail_Transaksi_idTransaski_fkey`;

-- AlterTable
ALTER TABLE `detail_transaksi` DROP COLUMN `idTransaski`,
    ADD COLUMN `idTransaksi` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_idTransaksi_fkey` FOREIGN KEY (`idTransaksi`) REFERENCES `Transaksi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
