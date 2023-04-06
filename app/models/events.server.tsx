import { prisma } from "~/db.server";

export async function getEvents() {
  return prisma.event.findMany({
    select: { id: true, title: true}
  });
}

export async function getEvent(id: string ) {
  return prisma.event.findUnique({ where: { id } });
} 

