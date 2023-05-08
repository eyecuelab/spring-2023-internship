/*
  Warnings:

  - You are about to drop the `DisLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DisLike" DROP CONSTRAINT "DisLike_contributionId_fkey";

-- DropForeignKey
ALTER TABLE "DisLike" DROP CONSTRAINT "DisLike_userId_fkey";

-- DropTable
DROP TABLE "DisLike";

-- CreateTable
CREATE TABLE "Dislike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contributionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dislike" BOOLEAN NOT NULL,

    CONSTRAINT "Dislike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
