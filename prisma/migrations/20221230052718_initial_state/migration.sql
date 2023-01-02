/*
  Warnings:

  - Added the required column `options` to the `questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questionnaire" ADD COLUMN     "options" TEXT NOT NULL;
