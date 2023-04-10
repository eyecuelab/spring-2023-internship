import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

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
      description: "This is my first potluck",
      address: "1234 N Test St. Portland, OR 97123",
      dateTime: new Date("2023-06-20T17:00:00Z"), 
      userId: user.id
    }
  });
  await db.event.create({
    data: {
      title: "My Second Potluck",
      description: "This is my second potluck",
      address: "1234 N Test St. Portland, OR 97123",
      dateTime: new Date("2023-06-20T14:00:00Z"),
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

