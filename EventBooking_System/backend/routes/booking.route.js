import { Router } from "express";

import { createBooking } from "../controllers/Bookings/booking.controller.js";

import { getMyBookingHistory } from "../controllers/Bookings/getBookingHistrory.controller.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";

import { getBookingData } from "../controllers/Bookings/getBookingData.controller.js";

const router = Router()

router.route('/create-booking').post(verifyJWT,createBooking)

router.route('/get-booking-history').get(verifyJWT,getMyBookingHistory)

router.route('/:eventId/get-booking-data').get(verifyJWT,getBookingData)

export default router