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
  const event1 = await db.event.create({
    data: {
      name: "Sunday potluck at rachel's",
      summary: "It's that time of the year again - time for our annual potluck dinner! We're excited to gather with our friends and family to share some delicious food and great company. We'll provide the plates, utensils, and drinks. We’ve had requests from our last Potluck, feel free to claim them if you are interested!",
      streetAddress: "1234 marino ave",
      city: "minivile",
      state: "co",
      zip: "56789",
      dateTime: new Date("2023-06-20T17:00:00Z"), 
      userId: user.id
    }
  });
  await db.event.create({
    data: {
      name: "My Second Potluck",
      summary: "This is my second potluck",
      streetAddress: "1234 marino ave",
      city: "minivile",
      state: "co",
      zip: "56789",
      dateTime: new Date("2023-06-20T14:00:00Z"),
      userId: user.id
    }
  });
  await db.contribution.create({
    data: {
      eventId: event1.id,
      name: "deviled eggs"
    }
  });
  await db.contribution.create({
    data: {
      eventId: event1.id,
      name: "meatballs"
    }
  });
  await db.contribution.create({
    data: {
      eventId: event1.id,
      name: "stuffed mushrooms"
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

