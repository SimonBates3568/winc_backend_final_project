import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createAmenity = async (name) => {
  const newAmenity = { name };
  const amenity = await prisma.amenity.create({
  data: newAmenity,
  });
  console.log(`Amenity created: ${amenity.name}`);
  return amenity;
};

export default createAmenity;