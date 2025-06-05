import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getBookingById = async (id) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
    })
    console.log(booking);
    return booking;
}

export default getBookingById;