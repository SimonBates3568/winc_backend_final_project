import { Router } from "express";
import getReviews from "../services/reviews/getReviews.js";
import createReview from "../services/reviews/createReview.js";
import getReviewById from "../services/reviews/getReviewById.js";
import updateReviewById from "../services/reviews/updateReviewById.js";
import deleteReviewById from "../services/reviews/deleteReviewById.js";
import authMiddleware from "../middleware/authMiddleware.js";
import * as Sentry from "@sentry/node";

const router = Router();

// Reviews => GET => /review => Returns all reviews
// sentry added
router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    res.status(200).json(reviews);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    next(error); // Pass the error to the next middleware for Sentry
  }
});

// Reviews => POST => /review => Creates a new review (JWT TOKEN AUTHENTICATION)
// sentry added
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    
    // Input validation
    if (!userId || !propertyId || !rating || !comment) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, propertyId, rating, comment" 
      });
    }
    
    // Validate rating range
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ 
        error: "Rating must be a number between 1 and 5" 
      });
    }
    
    // Validate comment length
    if (typeof comment !== 'string' || comment.trim().length === 0) {
      return res.status(400).json({ 
        error: "Comment must be a non-empty string" 
      });
    }
    
    const newReview = await createReview(userId, propertyId, rating, comment);
    res.status(201).json(newReview);
  } catch (error) {
    Sentry.captureException(error);
    
    // Handle validation and constraint errors as 400
    if (error.message.includes("Invalid userId or propertyId") || 
        error.message.includes("Review already exists") ||
        error.message.includes("Referenced user or property not found")) {
      return res.status(400).json({ error: error.message });
    }
    
    console.error("Error creating review:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    next(error); // Pass the error to the next middleware for Sentry
  }
});

// GET /review/:id => returns a single review by ID
// sentry added
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: "Failed to retrieve review" });
    next(error); // Pass the error to the next middleware for Sentry
  }
});

// PUT /review/:id => updates a review by ID (JWT TOKEN AUTHENTICATION)
// sentry added
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const updatedReview = await updateReviewById(id, { rating, comment });
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
    next(error); // Pass the error to the next middleware for Sentry
  }
});

// DELETE /review/:id => deletes a review by ID (JWT TOKEN AUTHENTICATION)
// sentry added
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await deleteReviewById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully", review });
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      return res.status(500).json({ error: error.message });
    }
    next(error); // Pass the error to the next middleware for Sentry
  }
});



export default router;