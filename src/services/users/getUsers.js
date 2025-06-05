import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//get all users except password
const getUsers = async (req, res) => {
    const user = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            phoneNumber: true,
            pictureUrl: true,
        }
    });
    console.log(user);
    return user;
}

export default getUsers;