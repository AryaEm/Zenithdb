/*
  Warnings:

  - You are about to alter the column `metode_pembayaran` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `transaksi` MODIFY `metode_pembayaran` ENUM('QRIS', 'Transfer_bank') NOT NULL DEFAULT 'QRIS';
