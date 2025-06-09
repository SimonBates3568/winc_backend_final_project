import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBookings = async ({ userId } = {}) => {

    const filters = {};

    if (userId) filters.userId = userId;

    const bookings = await prisma.booking.findMany({
        where: filters,
        select: {
            id: true,
            userId: true,
            propertyId: true,
            checkinDate: true,
            checkoutDate: true,
            numberOfGuests: true,
            totalPrice: true,
            bookingStatus: true
        }
    });
    console.log(bookings);
    return bookings;
}

export default getBookings;