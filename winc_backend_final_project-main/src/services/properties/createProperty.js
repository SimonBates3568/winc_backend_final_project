import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createProperty = async (hostId, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, host) => {
    const newProperty = {hostId, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, host};
    const property = await prisma.property.create({
        data: newProperty,
    });
    console.log(property);
    return property;
};

export default createProperty;