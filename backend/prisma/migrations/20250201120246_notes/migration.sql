/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Note`;

-- CreateTable
CREATE TABLE `notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `fileUrl` TEXT NOT NULL,
    `year` VARCHAR(4) NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `course` VARCHAR(100) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `folder` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NOT NULL,

    INDEX `notes_year_subject_idx`(`year`, `subject`),
    INDEX `notes_type_course_idx`(`type`, `course`),
    FULLTEXT INDEX `notes_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
