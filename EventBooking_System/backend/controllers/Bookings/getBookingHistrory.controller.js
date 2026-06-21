import { asyncHandler } from "../../utils/asyncHandler.js";
import { Bookings } from "../../models/booking.model.js";

// Fetch booking history for the logged-in user
export const getMyBookingHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const book = await Bookings.find({ user: userId })
        .populate("event");

    // Remove bookings whose events were deleted
    const validBookings = book.filter(
        booking => booking.event !== null
    );

    if (!validBookings.length) {
        return res.status(404).json({
            success: false,
            message: "No bookings found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Booking history successfully fetched",
        data: validBookings
    });
});