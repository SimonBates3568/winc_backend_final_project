import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const deleteAmenityById = async (id) => {
    // Delete the amenity directly
    const deletedAmenity = await prisma.amenity.delete({
        where: { id },
    });
    return deletedAmenity;
};

export default deleteAmenityById;