import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteUserById = async (id) => {
  try {
    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return null; // Return null for non-existent user
    }

    // Delete related bookings
    await prisma.booking.deleteMany({ where: { userId: id } });
    // Delete related reviews
    await prisma.review.deleteMany({ where: { userId: id } });

    // Now delete the user
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    console.log(`User with id ${id} successfully deleted`);
    return deletedUser;
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma "Record to delete does not exist"
      return null;
    }
    throw error; // Re-throw other errors
  }
};

export default deleteUserById;
