import { prisma } from "~/db.server";

import type { User, Event } from "@prisma/client";

export type { Event } from "@prisma/client";

export async function getEvents() {
  return prisma.event.findMany({
    select: { id: true, title: true}
  });
}

export async function getEvent(id: string ) {
  return prisma.event.findUnique({ where: { id } });
} 

export function createEvent({
  title,
  description,
  userId
}: Pick<Event, "title" | "description"> & {
  userId: User["id"];
}) {
  return prisma.event.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateEvent({
  id,
  title,
  description,
}: Pick<Event, "id" | "title" | "description"> 
) {
  return prisma.event.update({
    where: { id },
    data: {
      title,
      description
    }
  })
}

export function deleteEvent({
  id,
}: Pick<Event, "id"> & { userId: User["id"] }) {
  return prisma.event.delete({
    where: { id }
  });
}

