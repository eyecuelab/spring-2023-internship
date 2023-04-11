import { prisma } from "~/db.server";

import type { User, Event } from "@prisma/client";

export type { Event } from "@prisma/client";

export async function getEventsByUserId(userId: string) {
  return prisma.event.findMany({
    where: { userId },
    select: { id: true, title: true }, 
  });
}

export async function getEvent(id: string ) {
  return prisma.event.findUnique({ 
    where: { id },
    // include: { attendees: true } 
  });
} 

export function createEvent({
  title,
  description,
  address,
  dateTime,
  userId
}: Pick<Event, "title" | "description" | "address" | "dateTime"> & {
  userId: User["id"];
}) {
  return prisma.event.create({
    data: {
      title,
      description,
      address,
      dateTime,
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
  address,
  dateTime
}: Pick<Event, "id" | "title" | "description" | "address" | "dateTime"> & {
  userId: User["id"]
}) {
  return prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      address,
      dateTime
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

