/*
  Warnings:

  - You are about to drop the `Options` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Options" DROP CONSTRAINT "Options_task_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_option_id_fkey";

-- DropTable
DROP TABLE "Options";

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
