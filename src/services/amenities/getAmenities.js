import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAmenities = async () => {

    const amenities = await prisma.amenity.findMany({
        select: {
            name: true, 
        }
    });
    console.log("Fetching all amenities from the database", amenities);
    return amenities;
}


export default getAmenities;