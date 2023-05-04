import type { Contribution, Comment, User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getComments(contributionId: string) {
  return prisma.comment.findMany({
    select: { id: true, post: true },
    where: { contributionId }
  });
}

export function createComment({
  post,
  contributionId,
  userId
}: Pick<Comment, "post"> & {
  contributionId: Contribution["id"],
  userId: User["id"];
}) {
  return prisma.comment.create({
    data: {
      post,
      contribution: {
        connect: {
          id: contributionId,
        },
      },
      user: { 
        connect: { 
          id: userId 
        } 
      }
    },
  });
} 

export async function getCommentsByContributionId(contributionId: string) {
  return prisma.comment.findMany({
    where: { contributionId },
    include: { user: true },
    orderBy: { createdAt: "asc" }
  })
}