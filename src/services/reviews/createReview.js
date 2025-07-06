import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createReview = async (userId, propertyId, rating, comment) => {
    try {
        const newReview = { 
            userId, 
            propertyId, 
            rating: parseInt(rating), // Ensure rating is a number
            comment 
        };
        
        const review = await prisma.review.create({
            data: newReview,
        });
        
        console.log(review);
        return review;
    } catch (error) {
        console.error("Error creating review:", error);
        
        // Handle Prisma validation errors
        if (error.code === 'P2002') {
            // Unique constraint violation
            throw new Error("Review already exists for this user and property");
        }
        if (error.code === 'P2003') {
            // Foreign key constraint violation
            throw new Error("Invalid userId or propertyId");
        }
        if (error.code === 'P2025') {
            // Record not found
            throw new Error("Referenced user or property not found");
        }
        
        // Re-throw other errors
        throw error;
    }
};

export default createReview;