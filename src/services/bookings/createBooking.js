import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createBooking = async (userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus) => {
  const newBooking = {userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus};
  const booking = await prisma.booking.create({
  data: newBooking,
  });
  console.log(booking);
  return booking;
};

export default createBooking;