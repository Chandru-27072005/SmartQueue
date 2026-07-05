const express = require("express");

const router = express.Router();

const {
    getBookings,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    exportBookings
} = require("../controllers/bookingController");

router.get("/", getBookings);

router.get("/export", exportBookings);

router.post("/", createBooking);

router.put("/:id", updateBookingStatus);

router.delete("/:id", deleteBooking);



module.exports = router;