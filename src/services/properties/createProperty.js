import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createProperty = async (hostId, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, host) => {
    try {
        // Validate required fields at service level
        if (!hostId || !title || !description || !location || pricePerNight === undefined || bedroomCount === undefined || bathRoomCount === undefined || maxGuestCount === undefined) {
            const error = new Error('Missing required fields');
            error.name = 'ValidationError';
            throw error;
        }

        const newProperty = {
            hostId, 
            title, 
            description, 
            location, 
            pricePerNight: Number(pricePerNight), 
            bedroomCount: Number(bedroomCount), 
            bathRoomCount: Number(bathRoomCount), 
            maxGuestCount: Number(maxGuestCount), 
            rating: rating ? Number(rating) : null, 
            host
        };

        const property = await prisma.property.create({
            data: newProperty,
        });
        
        console.log(property);
        return property;
    } catch (error) {
        console.error('CreateProperty error:', error);
        
        // Handle Prisma-specific errors
        if (error.code === 'P2002') {
            const validationError = new Error('A property with this data already exists');
            validationError.name = 'ValidationError';
            throw validationError;
        }
        
        if (error.code === 'P2003') {
            const validationError = new Error('Referenced host does not exist');
            validationError.name = 'ValidationError';
            throw validationError;
        }
        
        // Re-throw validation errors
        if (error.name === 'ValidationError') {
            throw error;
        }
        
        // For other errors, throw a generic error
        throw new Error('Failed to create property');
    }
};

export default createProperty;