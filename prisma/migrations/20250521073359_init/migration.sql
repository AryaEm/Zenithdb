-- AlterTable
ALTER TABLE `user` MODIFY `nomor_telp` VARCHAR(191) NULL DEFAULT '',
    MODIFY `jenis_kelamin` ENUM('Laki_laki', 'Perempuan') NULL;
