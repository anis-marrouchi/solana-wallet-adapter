-- DropForeignKey
ALTER TABLE `Wallet` DROP FOREIGN KEY `Wallet_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
