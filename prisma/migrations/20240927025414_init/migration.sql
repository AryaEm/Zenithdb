/*
  Warnings:

  - Added the required column `updateAt` to the `Detail_Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_transaksi` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `game` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;
