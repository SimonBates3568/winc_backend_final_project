import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const deleteBookingById = async (id) => {
  // Delete the booking directly
  const deletedBooking = await prisma.booking.delete({
    where: { id },
  });
  return deletedBooking;
};

export default deleteBookingById;