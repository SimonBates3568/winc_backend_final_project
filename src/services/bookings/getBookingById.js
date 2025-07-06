import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getBookingById = async (id) => {
    try {
        // Validate that id is provided
        if (!id) {
            return null;
        }
        
        const booking = await prisma.booking.findUnique({
            where: { id },
        });
        
        console.log("Booking found:", booking);
        return booking;
    } catch (error) {
        console.error("Error in getBookingById:", error);
        throw error; // Re-throw to be handled by the route
    }
};

export default getBookingById;