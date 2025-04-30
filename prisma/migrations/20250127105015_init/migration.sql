/*
  Warnings:

  - You are about to drop the column `tanggal_transaksi` on the `transaksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `tanggal_transaksi`;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `jenis_kelamin` DROP DEFAULT;
