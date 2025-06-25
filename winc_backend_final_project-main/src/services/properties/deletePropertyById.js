import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const deletePropertyById = async (id) => {
  // First, check if the property exists
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) return null; // Not found

  // Delete related records if needed (e.g., bookings, reviews)
  await prisma.booking.deleteMany({ where: { propertyId: id } });
  await prisma.review.deleteMany({ where: { propertyId: id } });

  // Now delete the property
  return await prisma.property.delete({ where: { id } });
};

export default deletePropertyById;