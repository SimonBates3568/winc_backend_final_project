import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getHostById = async (id) => {
    const host = await prisma.host.findUnique({
        where: { id },
    })
    console.log("getHostById called with id:", id);
    return host;
}

export default getHostById;
