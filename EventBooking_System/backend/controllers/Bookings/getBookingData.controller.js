import { Bookings } from "../../models/booking.model.js";
import { Events } from "../../models/event.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

//This controller is to fetch data of ONE booking only
//This is a core function

export const getBookingData = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const eventId = req.params.eventId;
    
    //Check is event exists
    const event = await Events.findById(eventId);

    if(!event){
        return res.status(404).json({
            success: false,
            message: "Event doesnot exist"
        })
    }

    //Find the booking details
    const booking = await Bookings.findOne({user: userId,event: eventId})

    if(!booking){
        return res.status(404).json({
            success: false,
            message: "Booking doesnot exist"
        })
    }

    res.status(200).json({
        success: true,
        message: "Booking data successfully fetched",
        data: booking
    })
})