import { Router } from "express";
import getBookings from "../services/bookings/getBookings.js";
import createBooking from "../services/bookings/createBooking.js";
import getBookingById from "../services/bookings/getBookingById.js";
import updateBookingById from "../services/bookings/updateBookingById.js";
import deleteBookingById from "../services/bookings/deleteBookingById.js";
import authMiddleware from "../middleware/authMiddleware.js";
import * as Sentry from "@sentry/node";

const router = Router();

// Booking => GET => /bookings => returns all bookings (parameters: userId (optional))
// Sentry monitoring added to this route
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const bookings = await getBookings({ userId });
    res.status(200).json(bookings);
  } catch (error) {
    Sentry.captureException(error);
     res.status(500).json({ error: error.message });
    next(error);
  }
});
// Booking => POST => /bookings => creates a new booking(JWT TOKEN AUTHENTICATION)
// Sentry monitoring added to this route
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { 
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus 
    } = req.body;
    
    // Input validation
    if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests || !totalPrice) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice" 
      });
    }
    
    // Validate date format and logic
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    
    if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    
    if (checkin >= checkout) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }
    
    if (numberOfGuests < 1) {
      return res.status(400).json({ error: "Number of guests must be at least 1" });
    }
    
    if (totalPrice < 0) {
      return res.status(400).json({ error: "Total price must be positive" });
    }

    const newBooking = await createBooking(
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );
    res.status(201).json(newBooking);
  } catch (error) {
    Sentry.captureException(error);
    
    // Handle validation and constraint errors as 400
    if (error.message.includes("Invalid userId or propertyId") || 
        error.message.includes("Booking already exists") ||
        error.message.includes("Referenced user or property not found")) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message });
    next(error);
  }
});

// Booking => GET => /bookings/:id => returns a single booking by ID
// Sentry monitoring added to this route
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    if (!booking) {
      const error = new Error("Booking not found");
      error.status = 404;
      Sentry.captureException(error);
      return res.status(404).json({ error: error.message });
    }
    res.status(200).json(booking);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
    next(error);
  }
});

// Booking => PUT => /bookings/:id => updates a booking by ID (JWT TOKEN AUTHENTICATION)
// Sentry monitoring added to this route
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus 
    } = req.body;
    const updatedBooking = await updateBookingById(id, { 
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus 
    });
    if (!updatedBooking) {
      const error = new Error("Booking not found");
      error.status = 404;
      Sentry.captureException(error);
      return res.status(404).json({ error: error.message });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
    next(error);
  }
});

//  Booking => DELETE => /bookings/:id => deletes a booking by ID (JWT TOKEN AUTHENTICATION)
// Sentry monitoring added to this route
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await deleteBookingById(id);
    if (!booking) {
      const error = new Error("Booking not found");
      error.status = 404;
      Sentry.captureException(error);
      return res.status(404).json({ error: error.message });
    }
    res.status(200).json({ message: "Booking deleted successfully", booking });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
    next(error);
  }
});


export default router;