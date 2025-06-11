import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const deletePropertyById = async (id) => {
    
    const deletedProperty = await prisma.property.delete({
        where: { id },
    });
    return deletedProperty;
};

export default deletePropertyById;