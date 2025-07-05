import { Router } from "express";
import getProperties from "../services/properties/getProperties.js";
import createProperty from "../services/properties/createProperty.js";
import getPropertyById from "../services/properties/getPropertyById.js";
import updatePropertyById from "../services/properties/updatePropertyById.js";
import deletePropertyById from "../services/properties/deletePropertyById.js";
import authMiddleware from "../middleware/authMiddleware.js";
import * as Sentry from "@sentry/node";


const router = Router();
// Properties => GET => /properties => Returns all properties (query parameters: location, pricePerNight, amenities)
// sentry added
router.get("/", async (req, res, next) => {
  try {
    const { location, pricePerNight, amenities } = req.query; // query parameters
    const properties = await getProperties({ location, pricePerNight, amenities });
    res.status(200).json(properties);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    next(error); // Pass the error to the next middleware for Sentry
  }
});

// Properties => POST => /properties => Creates a new property (JWT TOKEN AUTHENTICATION)
// sentry added
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { hostId, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, host } = req.body;
    const newProperty = await createProperty(
      hostId,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      host
    );
    res.status(201).json(newProperty);
  } catch (error) {
    Sentry.captureException(error);

    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
    next(error); // Pass the error to the next middleware for Sentry
  }
});

// Properties => GET => /properties/:id => Returns a single property by ID
// sentry added
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message || "Failed to retrieve property" });
    next(error); // Pass the error to the next middleware for Sentry
  }
});

// Properties => PUT => /properties/:id => Updates a property by ID (JWT TOKEN AUTHENTICATION)
// sentry added
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      host
    } = req.body;
    const updatedProperty = await updatePropertyById(id, {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      host
    });
    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(updatedProperty);
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
    next(error); // Pass the error to the next middleware for Sentry
  }
});
// Properties => DELETE => /properties/:id => Deletes a property by ID (JWT TOKEN AUTHENTICATION)
// sentry added
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await deletePropertyById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully", property });
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
    next(error); // Pass the error to the next middleware for Sentry
  }
});


export default router;