import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateHostById = async (id, updateData) => {
    try {
        const user = await prisma.host.update({
            where: { id },
            data: {
                username: updateData.username,
                password: updateData.password,
                name: updateData.name, 
                email: updateData.email,
                phoneNumber: updateData.phoneNumber,
                pictureUrl: updateData.pictureUrl
            },
        });
        return {
            message: `Host with id ${id} successfully updated`,
            user
        };
    } catch (error) {
        console.error("Error updating host:", error);
        throw new Error(`Could not update host with id ${id}`);
    }
};

export default updateHostById;