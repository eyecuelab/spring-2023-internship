-- CreateTable
CREATE TABLE "DisLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contributionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dislike" BOOLEAN NOT NULL,

    CONSTRAINT "DisLike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
