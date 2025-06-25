import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getReviews = async () => {

    const reviews = await prisma.review.findMany({
        select: {
            id: true,
            userId: true,
            propertyId: true,
            rating: true,
            comment: true,
        }
    });

    console.log("Fetching all reviews from the database", reviews);
    return reviews;

}

export default getReviews;