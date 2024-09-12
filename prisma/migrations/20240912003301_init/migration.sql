/*
  Warnings:

  - You are about to drop the column `picture` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `paymenth_method` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `total_payment` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_date` on the `transaksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `game` DROP COLUMN `picture`,
    DROP COLUMN `price`,
    DROP COLUMN `release_date`,
    ADD COLUMN `gambar` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `harga` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tahun_rilis` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `paymenth_method`,
    DROP COLUMN `total_payment`,
    DROP COLUMN `transaction_date`,
    ADD COLUMN `metode_pembayaran` ENUM('Kartu_Kredit', 'paypal', 'Transfer_bank') NOT NULL DEFAULT 'Kartu_Kredit',
    ADD COLUMN `tanggal_transaksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `total_bayar` INTEGER NOT NULL DEFAULT 0;
