import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPropertyById = async (id) => {
    console.log("Looking for property with ID:", id);
    const property = await prisma.property.findUnique({
        where: { id },
    })
    console.log(`Property with ID ${id} retrieved successfully.`);
    console.log("Found property:", property);
    return property;
}

export default getPropertyById;