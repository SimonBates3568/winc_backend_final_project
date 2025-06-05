import { PrismaClient } from '@prisma/client';
  const prisma = new PrismaClient();

const createBooking = async ( 
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,) => {
  const newBooking = { 
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
      user: { connect: { id: userId } },
      property: { connect: { id: propertyId } },
    };
  const booking = await prisma.booking.create({
    data: newBooking,
  });
  console.log(booking);
  return booking;
};

export default createBooking;