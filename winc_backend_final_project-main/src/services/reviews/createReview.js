import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createReview = async (userId, propertyId, rating, comment) => {
    const newReview = { userId, propertyId, rating, comment };
    const review = await prisma.review.create({
        data: newReview,
    });
    console.log(review);
    return review;
};

export default createReview;