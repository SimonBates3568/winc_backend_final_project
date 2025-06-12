import { Router } from "express";
import getReviews from "../services/reviews/getReviews.js";
import createReview from "../services/reviews/createReview.js";
import getReviewById from "../services/reviews/getReviewById.js";
import updateReviewById from "../services/reviews/updateReviewById.js";
import deleteReviewById from "../services/reviews/deleteReviewById.js";
import authMiddleware from "../middleware/errorHandler.js";

const router = Router();

// Reviews => GET => /review => Returns all reviews
// TODO: Add Sentry monitoring to this route if needed
router.get("/", async (req, res) => {
  try {
    const reviews = await getReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Reviews => POST => /review => Creates a new review (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.post("/", authMiddleware, async (req, res) => {
  try {
  const { userId, propertyId, rating, comment } = req.body;
  const newReview = await createReview(userId, propertyId, rating, comment);
  res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /review/:id => returns a single review by ID
// TODO: Add Sentry monitoring to this route if needed
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve review" });
  }
});

// PUT /review/:id => updates a review by ID (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, propertyId, rating, comment } = req.body;
    const updatedReviewById = await updateReviewById(id, { userId, propertyId, rating, comment });
    if (!updatedReviewById) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(updatedReviewById);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});


// DELETE /review/:id => deletes a review by ID (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
   
    const { id } = req.params;
    const review = await deleteReviewById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully", review });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});



export default router;