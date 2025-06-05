import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateUserById = async (id, updatedUserById) => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                username: updatedUserById.username,
                password: updatedUserById.password,
                name: updatedUserById.name, 
                email: updatedUserById.email,
                phoneNumber: updatedUserById.phoneNumber,
                pictureUrl: updatedUserById.pictureUrl
            },
        });
        return {
            message: `User with id ${id} successfully updated`,
            user
        };
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error(`Could not update user with id ${id}`);
    }
};

export default updateUserById;