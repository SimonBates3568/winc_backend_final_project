import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAmenityById = async (id) => {
    const amenity = await prisma.amenity.findUnique({
        where: { id },
    });
    if (amenity) {
        console.log(`Amenity retrieved: ${amenity.name}`);
    } else {
        console.log(`Amenity with id ${id} not found.`);
    }
    return amenity;
}

export default getAmenityById;