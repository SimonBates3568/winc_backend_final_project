import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createBooking = async (userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus) => {
  try {
    const newBooking = {
      userId, 
      propertyId, 
      checkinDate: new Date(checkinDate), 
      checkoutDate: new Date(checkoutDate), 
      numberOfGuests, 
      totalPrice, 
      bookingStatus
    };
    
    const booking = await prisma.booking.create({
      data: newBooking,
    });
    
    console.log(booking);
    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    
    // Let Prisma validation errors bubble up to be handled by the route
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error("Booking already exists or conflicts with existing booking");
    }
    if (error.code === 'P2003') {
      // Foreign key constraint violation
      throw new Error("Invalid userId or propertyId");
    }
    if (error.code === 'P2025') {
      // Record not found
      throw new Error("Referenced user or property not found");
    }
    
    // Re-throw other errors
    throw error;
  }
};

export default createBooking;