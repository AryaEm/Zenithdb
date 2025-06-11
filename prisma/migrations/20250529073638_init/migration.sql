/*
  Warnings:

  - The values [Transfer_bank] on the enum `Transaksi_metode_pembayaran` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transaksi` MODIFY `metode_pembayaran` ENUM('QRIS', 'GOPAY', 'DANA') NOT NULL DEFAULT 'QRIS';
