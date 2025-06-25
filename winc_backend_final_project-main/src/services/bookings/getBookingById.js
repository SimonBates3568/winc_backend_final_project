import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getBookingById = async (id) => {
    console.log("Looking for booking with id:", id, "Type:", typeof id);
    const booking = await prisma.booking.findUnique({
        where: { id: id.trim() } // Use the string as-is, trim whitespace
    });
    console.log(booking);
    return booking;
}

export default getBookingById;