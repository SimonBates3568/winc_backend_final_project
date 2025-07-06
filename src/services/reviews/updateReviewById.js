import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateReviewById = async (
    id,
    { rating, comment }
) => {
    try {
        const review = await prisma.review.update({
            where: { id },
            data: {
                rating,
                comment
            },
        });
        return {
            message: `Review with id ${id} successfully updated`,
            review
        };
    } catch (error) {
        // Check if it's a "record not found" error
        if (error.code === 'P2025') {
            return null; // Return null so the route can handle 404
        }
        console.error("Error updating review:", error);
        throw new Error(`Could not update review with id ${id}`);
    }
};

export default updateReviewById;
