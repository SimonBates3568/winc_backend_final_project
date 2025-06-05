import { Router } from "express";
import getBookings from "../services/bookings/getBookings.js";
import createBooking from "../services/bookings/createBooking.js";
import getBookingById from "../services/bookings/getBookingById.js";
const router = Router();

//GET /bookings => returns all bookings 
router.get("/", async (req, res) => {
  try {
    const bookings = await getBookings(req, res);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
});

// POST /bookings => create a new booking
router.post("/", async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
});

// GET /bookings/:id => get booking by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve booking" });
  }
});

// PUT /bookings/:id => update booking by id

// DELETE /bookings/:id => delete booking by id


export default router;