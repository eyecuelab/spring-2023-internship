import { prisma } from "~/db.server";

import type { User, Contribution, Event } from "@prisma/client";

export type { Event, Contribution } from "@prisma/client";

export async function getContributions(eventId: string) {
  return prisma.contribution.findMany({
    select: { id: true, contributionName: true },
    where: { eventId }
  });
}

export async function getContribution(id: string ) {
  return prisma.contribution.findUnique({ where: { id } });
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
}: Pick<Contribution, "id" | "contributionName"> & {
  eventId: Event["id"]
}) {
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