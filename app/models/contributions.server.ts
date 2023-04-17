import { prisma } from "~/db.server";

import type { User, Contribution, Event } from "@prisma/client";

export type { Event, Contribution } from "@prisma/client";

export async function getContributions(eventId: string) {
  return prisma.contribution.findMany({
    select: { id: true, name: true },
    where: { eventId }
  });
}

export async function getContribution(id: string ) {
  return prisma.contribution.findUnique({ where: { id } });
} 

export function createContribution({
  name,
  eventId,
}: Pick<Contribution, "name"> & {
  eventId: Event["id"];
}) {
  return prisma.contribution.create({
    data: {
      name,
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
  name,
}: Pick<Contribution, "id" | "name"> & {
  eventId: Event["id"]
}) {
  return prisma.contribution.update({
    where: { id },
    data: {
      name,
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