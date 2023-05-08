import type { Contribution, Like, User, Dislike } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getLikes(contributionId: string) {
  return prisma.like.findMany({
    select: { id: true, like: true },
    where: { contributionId }
  });
}

export function createLike({
  like,
  contributionId,
  userId
}: Pick<Like, "like"> & {
  contributionId: Contribution["id"],
  userId: User["id"];
}) {
  return prisma.like.create({
    data: {
      like,
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

export async function getLikesByContributionId(contributionId: string) {
  return prisma.like.findMany({
    where: { contributionId },
    include: { user: true },
    orderBy: { createdAt: "asc" }
  })
}

export function deleteLike({
  id,
}: Pick<Like, "id">) {
  return prisma.like.delete({
    where: { id }
  });
}

export async function getDislikes(contributionId: string) {
  return prisma.dislike.findMany({
    select: { id: true, dislike: true },
    where: { contributionId }
  });
}

export function createDislike({
  dislike,
  contributionId,
  userId
}: Pick<Dislike, "dislike"> & {
  contributionId: Contribution["id"],
  userId: User["id"];
}) {
  return prisma.dislike.create({
    data: {
      dislike,
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

export async function getDislikesByContributionId(contributionId: string) {
  return prisma.dislike.findMany({
    where: { contributionId },
    include: { user: true },
    orderBy: { createdAt: "asc" }
  })
}

export function deleteDisLike({
  id,
}: Pick<Dislike, "id">) {
  return prisma.dislike.delete({
    where: { id }
  });
}