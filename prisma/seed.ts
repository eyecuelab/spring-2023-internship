import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();

// async function seed() {
//   const kody = await db.user.create({
//     data: {
//       email: "kody@gmail.com",
//       username: "kody",
//       // this is a hashed version of "twixrox"
//       passwordHash:
//         "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
//     },
//   });
//   await Promise.all(
//     getEvents().map((event) => {
//       const data = { creatorId: kody.id, creator: kody, ...event };
//       return db.event.create({ data });
//     })
//   );
// }

// function getEvents() {
//   return [
//     {
//       title: "Birthday Party",
//       description: "This event is a birthday party"
//     },
//     {
//       title: "Office Party",
//       description: "This event is a office party"
//     }
//   ]
// }

// seed();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await db.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await db.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await db.event.create({
    data: {
      title: "My First Potluck",
      description: "Hello potuck!",
      userId: user.id
    }
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });