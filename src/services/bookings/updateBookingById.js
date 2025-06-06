import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateBookingById = async (
    id,
    { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus, userId, propertyId }
) => {
    try {
        const booking = await prisma.booking.update({
            where: { id },
            data: {
                checkinDate,
                checkoutDate,
                numberOfGuests,
                totalPrice,
                bookingStatus,
                user: { connect: { id: userId } },
                property: { connect: { id: propertyId } },
            },
        });
        return {
            message: `Booking with id ${id} successfully updated`,
            booking
        };
    } catch (error) {
        console.error("Error updating booking:", error);
        throw new Error(`Could not update booking with id ${id}`);
    }
};

export default updateBookingById;