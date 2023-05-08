import type { Contribution, Like, User, Dislike } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getLikes(contributionId: string) {
  return prisma.like.findMany({
    select: { id: true, like: true, userId: true },
    where: { contributionId }
  });
}

export async function createLike({
  like,
  contributionId,
  userId
}: Pick<Like, 'like'> & {
  contributionId: Contribution['id'],
  userId: User['id']
}) {
  const existingLike = await getLikeByContributionIdAndUserId(contributionId, userId);
  if (existingLike) {
    console.log("🚀 ~ file: likes.server.ts:23 ~ 'User has already liked this contribution':", 'User has already liked this contribution')
    throw new Error('User has already liked this contribution');
  }
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

async function getLikeByContributionIdAndUserId(
  contributionId: Contribution['id'],
  userId: User['id']
) {
  return prisma.like.findFirst({
    where: {
      contributionId,
      userId,
      like: true
    }
  });
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

export async function createDislike({
  dislike,
  contributionId,
  userId
}: Pick<Dislike, "dislike"> & {
  contributionId: Contribution["id"],
  userId: User["id"];
}) {
  const existingDislike = await getDislikeByContributionIdAndUserId(contributionId, userId);
  if (existingDislike) {
    console.log("🚀 ~ file: likes.server.ts:89 ~ 'User has already disliked this contribution':", 'User has already disliked this contribution')
    throw new Error('User has already disliked this contribution');
  }
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

async function getDislikeByContributionIdAndUserId(
  contributionId: Contribution['id'],
  userId: User['id']
) {
  return prisma.dislike.findFirst({
    where: {
      contributionId,
      userId,
      dislike: true
    }
  });
}

export function deleteDisLike({
  id,
}: Pick<Dislike, "id">) {
  return prisma.dislike.delete({
    where: { id }
  });
}