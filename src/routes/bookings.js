import { Router } from "express";
import getBookings from "../services/bookings/getBookings.js";
import createBooking from "../services/bookings/createBooking.js";
import getBookingById from "../services/bookings/getBookingById.js";
import updateBookingById from "../services/bookings/updateBookingById.js";
import deleteBookingById from "../services/bookings/deleteBookingById.js";
import authMiddleware from "../middleware/errorHandler.js";
import * as Sentry from "@sentry/node";

const router = Router();

// Booking => GET => /bookings => returns all bookings (parameters: userId (optional))
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await getBookings({ userId });
    res.status(200).json(bookings);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message || "Failed to retrieve bookings" });
  }
});
// Booking => POST => /bookings => creates a new booking(JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { 
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus } = req.body;
    const newBooking = await createBooking(userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus);
    res.status(201).json(newBooking);
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else if (error.status === 500) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Booking => GET => /bookings/:id => returns a single booking by ID
// TODO: Add Sentry monitoring to this route if needed
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    if (!booking) {
      const error = new Error("Booking not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(booking);
  } catch (error) {
    Sentry.captureException(error);
    next(error);
  }
});

// Booking => PUT => /bookings/:id => updates a booking by ID (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus } = req.body;
    const updatedBookingById = await updateBookingById(id, { userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus });
    if (!updatedBookingById) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(updatedBookingById);
  } catch (error) {
    Sentry.captureException(error);
    if (error.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Booking => DELETE => /bookings/:id => deletes a booking by ID (JWT TOKEN AUTHENTICATION)
// TODO: Add Sentry monitoring to this route if needed
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await deleteBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully", booking });
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