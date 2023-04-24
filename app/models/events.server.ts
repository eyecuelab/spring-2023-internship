import { prisma } from "~/db.server";

import type { User, Event } from "@prisma/client";

export type { Event } from "@prisma/client";

export async function getEventsByUserId(userId: string) {
  return prisma.event.findMany({
    where: { userId },
    select: { id: true, name: true }, 
  });
}

export async function getEvent(id: string ) {
  return prisma.event.findUnique({ 
    where: { id },
    include: { 
      user: true,
      contributions: {
        include: { user: true}
      }
    } 
  });
} 

export function createEvent({
  name,
  summary,
  streetAddress,
  unit,
  city,
  state,
  zip,
  dateTime,
  userId
}: Pick<Event, "name" | "summary" | "streetAddress" | "unit" | "city" | "state" | "zip" | "dateTime"> & {
  userId: User["id"];
}) {
  return prisma.event.create({
    data: {
      name,
      summary,
      streetAddress,
      unit,
      city,
      state,
      zip,
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
  name,
  summary,
  streetAddress,
  unit,
  city,
  state,
  zip,
  dateTime
}: Pick<Event, "id" | "name" | "summary" | "streetAddress" | "unit" | "city" | "state" | "zip" | "dateTime"> & {
  userId: User["id"]
}) {
  return prisma.event.update({
    where: { id },
    data: {
      name,
      summary,
      streetAddress,
      unit,
      city,
      state,
      zip,
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

