import { Router } from "express";
import getProperties from "../services/properties/getProperties.js";
import createProperty from "../services/properties/createProperty.js";
import getPropertyById from "../services/properties/getPropertyById.js";
import updatePropertyById from "../services/properties/updatePropertyById.js";
import deletePropertyById from "../services/properties/deletePropertyById.js";
import authMiddleware from "../middleware/errorHandler.js";


const router = Router();
//  query params => /properties?location=Malibu, California&pricePerNight=310.25&amenities=Wifi
// GET /properties => returns all properties
router.get("/", async (req, res) => {
  try {
    const { location, pricePerNight, amenities } = req.query;//query parameters
    const properties = await getProperties({ location, pricePerNight, amenities });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//POST /properties => create a new property (JWT TOKEN AUTHENTICATION)
router.post("/", authMiddleware,async (req, res) => {
  try {
    const { hostId, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, host } = req.body;
    const newProperty = await createProperty(hostId, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, host);
    res.status(201).json(newProperty);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

//GET /properties/:id => get property by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve property" });
  }
});

//PUT /properties/:id => update property by id(JWT TOKEN AUTHENTICATION)
router.put("/:id", authMiddleware, async (req, res) => {
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
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

//DELETE /properties/:id => delete property by id(JWT TOKEN AUTHENTICATION)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const property = await deletePropertyById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully", property });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});


export default router;