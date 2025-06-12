import { Router } from "express";
import getAmenities from "../services/amenities/getAmenities.js";
import createAmenity from "../services/amenities/createAmenity.js";
import getAmenityById from "../services/amenities/getAmenityById.js";
import updateAmenityById from "../services/amenities/updateAmenityById.js";
import deleteAmenityById from "../services/amenities/deleteAmenityById.js";
import authMiddleware from "../middleware/errorHandler.js";
import * as Sentry from "@sentry/node";
const router = Router();

// Amenities => GET => /amenities => Returns all amenities
// TODO: Add Sentry monitoring to this route if needed
router.get("/", async (_, res) => {
  try {
    const amenities = await getAmenities();
    res.status(200).json(amenities);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
  }
});

// Amenities => POST => /amenities => Creates a new amenity (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const newAmenity = await createAmenity(name);
    res.status(201).json(newAmenity);
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// GET /amenities/:id => returns a single amenity by ID
// TODO: Add Sentry monitoring to this route if needed
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const amenity = await getAmenityById(id);
    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }
    res.status(200).json(amenity);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: "Failed to retrieve amenity" });
  }
});

// PUT /amenities/:id => updates an amenity by ID (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedAmenityById = await updateAmenityById(id, name);
    if (!updatedAmenityById) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(updatedAmenityById);
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Amenities => DELETE => /amenities/:id => Deletes an amenity by ID (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const amenity = await deleteAmenityById(id);
    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }
    res.status(200).json({ message: "Amenity deleted successfully", amenity });
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;