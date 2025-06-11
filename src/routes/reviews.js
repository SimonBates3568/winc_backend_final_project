import { Router } from "express";
import getReviews from "../services/reviews/getReviews.js";

const router = Router();

// GET /reviews => returns all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await getReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//POST /reviews => create a new review(JWT TOKEN AUTHENTICATION REQUIRED!)

//GET /reviews/:id => get review by id
//PUT /reviews/:id => update review by id(JWT TOKEN AUTHENTICATION REQUIRED!)
//DELETE /reviews/:id => delete review by id(JWT TOKEN AUTHENTICATION REQUIRED!)




export default router;