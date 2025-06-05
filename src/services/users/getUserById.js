import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
    })
    console.log(user);
    return user;
}

export default getUserById;
