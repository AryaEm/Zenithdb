/*
  Warnings:

  - Made the column `idGame` on table `detail_transaksi` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idTransaksi` on table `detail_transaksi` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `detail_transaksi` DROP FOREIGN KEY `Detail_Transaksi_idGame_fkey`;

-- DropForeignKey
ALTER TABLE `detail_transaksi` DROP FOREIGN KEY `Detail_Transaksi_idTransaksi_fkey`;

-- AlterTable
ALTER TABLE `detail_transaksi` MODIFY `idGame` INTEGER NOT NULL,
    MODIFY `idTransaksi` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_idTransaksi_fkey` FOREIGN KEY (`idTransaksi`) REFERENCES `Transaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_idGame_fkey` FOREIGN KEY (`idGame`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
