import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      username: "kody",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });
  await Promise.all(
    getEvents().map((event) => {
      const data = { userId: kody.id, ...event };
      return db.event.create({ data });
    })
  );
}

function getEvents() {
  return [
    {
      name: "Birthday Party",
      content: "This event is a birthday party"
    },
    {
      name: "Office Party",
      content: "This event is a office party"
    }
  ]
}

seed();