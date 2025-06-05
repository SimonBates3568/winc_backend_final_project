import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBookings = async (req, res) => {
    const booking = await prisma.booking.findMany();
    console.log(booking);
    return booking;
}

export default getBookings;