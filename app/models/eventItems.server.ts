import { prisma } from "~/db.server";

import type { User, EventItem, Event } from "@prisma/client";

export type { Event, EventItem } from "@prisma/client";

export async function getEventItems(eventId: string) {
  return prisma.eventItem.findMany({
    select: { id: true, name: true, note: true },
    where: { eventId }
  });
}

export async function getEventItem(id: string ) {
  return prisma.eventItem.findUnique({ where: { id } });
} 

export function createEventItem({
  name,
  note,
  eventId,
}: Pick<EventItem, "name" | "note"> & {
  eventId: Event["id"];
}) {
  return prisma.eventItem.create({
    data: {
      name,
      note,
      event: {
        connect: {
          id: eventId,
        },
      }
    },
  });
}

export function deleteEventItem({
  id,
}: Pick<EventItem, "id">) {
  return prisma.eventItem.delete({
    where: { id }
  });
}