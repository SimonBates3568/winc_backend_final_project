import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getHosts = async () => {
    const hosts = await prisma.host.findMany({
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            phoneNumber: true,
            pictureUrl: true,
            aboutMe: true,
        }
    })
    return hosts;
};

export default getHosts;




