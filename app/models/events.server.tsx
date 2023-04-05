import { prisma } from "~/db.server";

export async function getEvents() {
  return prisma.event.findMany();
}

