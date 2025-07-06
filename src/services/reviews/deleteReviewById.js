import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const deleteReviewById = async (id) => {
    try {
        const deletedReview = await prisma.review.delete({
            where: { id },
        });
        return deletedReview;
    } catch (error) {
        // Check if it's a "record not found" error
        if (error.code === 'P2025') {
            return null; // Return null so the route can handle 404
        }
        console.error("Error deleting review:", error);
        throw new Error(`Could not delete review with id ${id}`);
    }
};

export default deleteReviewById;