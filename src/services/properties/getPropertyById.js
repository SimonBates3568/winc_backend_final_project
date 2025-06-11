import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPropertyById = async (id) => {
    const property = await prisma.property.findUnique({
        where: { id },
    })
    console.log(`Property with ID ${id} retrieved successfully.`);
    return property;
}

export default getPropertyById;