import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//  query params => /properties?location=Malibu, California&pricePerNight=310.25&amenities=Wifi
const getProperties = async ({ location, pricePerNight, amenities } = {}) => {
    const filters = {};
    if (location) filters.location = location;
    if (pricePerNight) filters.pricePerNight = Number(pricePerNight);
    if (amenities) {
      filters.amenities = {
        some: {
          name: { in: Array.isArray(amenities) ? amenities : [amenities] }
        }
      };
    }
    console.log("Filters:", filters);
    try {
        const properties = await prisma.property.findMany({
            where: filters,
            select: {
                hostId: true,
                title: true,
                description: true,
                location: true,
                pricePerNight: true,
                bedroomCount: true,
                bathRoomCount: true,
                maxGuestCount: true,
                rating: true,
            }
        });
        console.log("Fetching all properties from the database", properties);
        return properties;
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
    }
};

export default getProperties;