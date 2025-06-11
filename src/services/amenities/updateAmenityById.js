import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateAmenityById = async (id, name) => {
    try {
        const amenity = await prisma.amenity.update({
            where: { id },
            data: {
                name: name,
            },
        });
        return {
            message: `Amenity with id ${id} successfully updated`,
            amenity
        };
    } catch (error) {
        console.error("Error updating amenity:", error);
        throw new Error(`Could not update amenity with id ${id}`);
    }
};

export default updateAmenityById;