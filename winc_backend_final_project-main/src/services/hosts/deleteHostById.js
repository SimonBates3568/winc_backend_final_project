import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteHostById = async (id) => {
  // Find all properties for this host
  const properties = await prisma.property.findMany({ where: { hostId: id } });

  // For each property, delete related bookings and reviews
  for (const property of properties) {
    await prisma.booking.deleteMany({ where: { propertyId: property.id } });
    await prisma.review.deleteMany({ where: { propertyId: property.id } });
  }

  // Now delete all properties for this host
  await prisma.property.deleteMany({ where: { hostId: id } });

  // Finally, delete the host
  const deletedHost = await prisma.host.delete({ where: { id } });

  return deletedHost;
};

export default deleteHostById;