import { asyncHandler } from "../../utils/asyncHandler.js";
import { Bookings } from "../../models/booking.model.js";
import { Events } from "../../models/event.model.js";

export const createBooking = asyncHandler(async (req,res)=>{
   const { eventId, ticketCount } = req.body;
   const userId = req.user._id;

   //1.Check event's existence
   const event = await Events.findById(eventId);

   if(!event){
    return res.status(404).json({
        success: false,
        message: "Event doesn't exists"
    })
   }
    
   //2.Prevent duplicate bookings
   const existingBooking = await Bookings.findOne({
    user: userId,
    event: eventId
   })

    if(existingBooking){
    return res.status(409).json({
        success: false,
        message: "Booking already exists"
    })
   }

    //3.Check if seats are available 
    //Seat decrement only after payments are made
    
   const updated = await Events.findOneAndUpdate(
    { _id: eventId, seatLimit: { $gte: ticketCount } },
    { new: true }
   )

   if (!updated) return res.status(400).json({ message: "No seats available" })

   //4.Calculate the price
   const price = event.price;
    
   //5.Create Booking object
   const newBooking = await Bookings.create({
    user: userId,
    event: eventId,
    ticketCount,
    totalAmount: ticketCount*price,
    bookingStatus: 'Pending'
   })
   
   //7.send user response : Booking successful
   res.status(201).json({
    success: true,
    message: "Booking successfully created",
    data: newBooking
   })
})

