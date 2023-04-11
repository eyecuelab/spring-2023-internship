import { prisma } from "~/db.server";

import type { User, Event, Attendee } from "@prisma/client";

export type { Attendee } from "@prisma/client";

export function createAttendee({
  userId,
  eventId
}: {
  userId: User["id"],
  eventId: Event["id"]
}) {
  return prisma.attendee.create({
    data: {
      user: { connect: { id: userId } },
      event: { connect: { id: eventId } }
    }
  })
}

export function getAttendeesByEventId(eventId: string) {
  return prisma.attendee.findMany({
    where: { eventId },
    include: { user: true }
  })
}

export function isAttendee(userId: string, eventId: string) {
  return prisma.attendee.findFirst({
    where: {
      AND: [
        { userId: { equals: userId } },
        { eventId: { equals: eventId } }
      ]
    }
  })
}