import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const deleteBookingById = async (id) => {
  try {
    // Delete the booking directly
    const deletedBooking = await prisma.booking.delete({
      where: { id },
    });
    return deletedBooking;
  } catch (error) {
    // Check if it's a "record not found" error
    if (error.code === 'P2025') {
      return null; // Return null so the route can handle 404
    }
    console.error("Error deleting booking:", error);
    throw new Error(`Could not delete booking with id ${id}`);
  }
};

export default deleteBookingById;