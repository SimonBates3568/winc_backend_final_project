import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createHost = async (username, password, name, email, phoneNumber, pictureUrl, aboutMe) => {
    const host = await prisma.host.create({
        data: { username, password, name, email, phoneNumber, pictureUrl, aboutMe }
    });
    console.log(host);
    return host;
};

export default createHost;