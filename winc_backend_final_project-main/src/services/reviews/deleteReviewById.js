import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const deleteReviewById = async (id) => {
    
    const deletedReview = await prisma.review.delete({
        where: { id },
    });
    return deletedReview;
};

export default deleteReviewById;