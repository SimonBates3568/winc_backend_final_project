import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updatePropertyById = async (id, { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, host }) => {
    try {
        const property = await prisma.property.update({
            where: { id },
            data: {
                title,
                description,
                location,
                pricePerNight,
                bedroomCount,
                bathRoomCount,
                maxGuestCount,
                rating,
                host
            },
        });
        return {
            message: `Property with id ${id} successfully updated`,
            property
        };
    } catch (error) {
        console.error("Error updating property:", error);
        if (error.code === 'P2025') {
            // Record not found
            return null;
        }
        throw new Error(`Could not update property with id ${id}`);
    }
};

export default updatePropertyById;