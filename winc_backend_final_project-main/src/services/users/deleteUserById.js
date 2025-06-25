import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//delete related bookings and reviews before deleting the user
const deleteUserById = async (id) => {
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
};

export default deleteUserById;
