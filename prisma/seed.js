import { PrismaClient } from "@prisma/client";
import usersData from "../src/data/users.json" with { type: "json" };
import hostsData from "../src/data/hosts.json" with { type: "json" };
import bookingData from "../src/data/bookings.json" with { type: "json" };
import reviewsData from "../src/data/reviews.json" with { type: "json" };
import amenitiesData from "../src/data/amenities.json" with { type: "json" };
import propertiesData from "../src/data/properties.json" with { type: "json" };


const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function main() {
  const { users } = usersData;
  const { hosts } = hostsData;
  const { bookings } = bookingData;
  const { reviews } = reviewsData;
  const { amenities } = amenitiesData;
  const { properties } = propertiesData;

  
for (const user of users) {
    await prisma.user.upsert({
     where: { id: user.id },
      update: {},
      create: user,
    });
  }
  for (const host of hosts) {
    const { profilePicture, ...hostData } = host;
    await prisma.host.upsert({
     where: { id: host.id },
      update: {},
      create: {
        ...hostData,
        pictureUrl: profilePicture, // map profilePicture to pictureUrl
      },
    });
  }
  for (const property of properties) {
     console.log("Seeding property:", property); 
    await prisma.property.upsert({
        where: { id: property.id },
        update: {},
        create: property,
    });
  }
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
        where: { id: amenity.id },
        update: {},
        create: amenity,
    });
  }
  for (const booking of bookings) {
    await prisma.booking.upsert({
        where: { id: booking.id },
        update: {},
        create: booking,
    });
  }
  for (const review of reviews) {
    await prisma.review.upsert({
        where: { id: review.id },
        update: {},
        create: review,
    });
  }
  console.log("Seeding completed successfully!");
  console.log("Users seeded:", users.length);
  console.log("Hosts seeded:", hosts.length);           
  console.log("Properties seeded:", properties.length);
  console.log("Amenities seeded:", amenities.length);
  console.log("Bookings seeded:", bookings.length);
  console.log("Reviews seeded:", reviews.length);
  console.log("Database seeding completed successfully!");
  
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });