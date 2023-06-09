import { prisma } from "~/db.server";

import type { User, Contribution, Event } from "@prisma/client";

export type { Event, Contribution } from "@prisma/client";

export async function getContributions(eventId: string) {
  return prisma.contribution.findMany({
    where: { eventId },
    include: { user: true },
    orderBy: { contributionName: "asc"}
  });
}

export async function getContribution(id: string) {
  return prisma.contribution.findUnique({ 
    where: { id }, 
    include: { user: true}
  });
} 

export async function getContributionByName(contributionName: string ) {
  return prisma.contribution.findFirst({ where: { contributionName } });
} 

export function createContribution({
  contributionName,
  eventId,
}: Pick<Contribution, "contributionName"> & {
  eventId: Event["id"];
}) {
  return prisma.contribution.create({
    data: {
      contributionName,
      event: {
        connect: {
          id: eventId,
        },
      }
    },
  });
}

export function updateContribution({
  id,
  contributionName,
}: Pick<Contribution, "id" | "contributionName">) {
  return prisma.contribution.update({
    where: { id },
    data: {
      contributionName,
    }
  })
}

export function deleteContribution({
  id,
}: Pick<Contribution, "id">) {
  return prisma.contribution.delete({
    where: { id }
  });
}

export function claimItem(id: string, userId: string) {
  return prisma.contribution.update({
    where: { id },
    data: {
      user: { connect: { id: userId } }
    }
  })
}

export function unclaimItem(id: string) {
  return prisma.contribution.update({
    where: { id },
    data: {
      user: { disconnect: true }
    }
  })
}