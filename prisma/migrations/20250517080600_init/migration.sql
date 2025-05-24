-- AlterTable
ALTER TABLE `game` ADD COLUMN `status` ENUM('True', 'False') NOT NULL DEFAULT 'False',
    ADD COLUMN `userId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_OwnedGames` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OwnedGames_AB_unique`(`A`, `B`),
    INDEX `_OwnedGames_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OwnedGames` ADD CONSTRAINT `_OwnedGames_A_fkey` FOREIGN KEY (`A`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OwnedGames` ADD CONSTRAINT `_OwnedGames_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
