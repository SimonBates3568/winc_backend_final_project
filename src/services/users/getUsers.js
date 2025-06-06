import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//get all users except password(query params) 
const getUsers = async ({ username, email } = {}) => {

    const filters = {};

    if(username) filters.username = username;
    if(email) filters.email = email;

    const users = await prisma.user.findMany({
        where: filters,
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            phoneNumber: true,
            pictureUrl: true,
        }
    });
    return users;
}


export default getUsers;