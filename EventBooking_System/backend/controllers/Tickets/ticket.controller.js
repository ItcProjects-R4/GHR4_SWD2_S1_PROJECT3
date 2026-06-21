import { Tickets } from "../../models/ticket.model.js";
import { Bookings } from "../../models/booking.model.js";
import { Events } from "../../models/event.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateTicketPDF } from "./generateTicket.js";
import { randomUUID } from "crypto";

export const generateTicket = asyncHandler(async (req,res)=>{
    const eventId = req.params.eventId;
    const bookingId = req.params.bookingId;

    console.log("Event Id:", eventId);
    console.log("Booking Id:", bookingId);

    //1.find the booking object from DB
    const booking = await Bookings.findById(bookingId).populate('user');
    console.log("Booking data:", booking);

    //2.verify booking's existence
    if(!booking){
        return res.status(404).json({
            success: false,
            message: "Booking doesn't exists"
        })
    }
    
    //3.Verify booking status -> confirmed
    if(booking.bookingStatus != 'Confirmed'){
        return res.status(404).json({
            success: false,
            message: "Booking is not confirmed"
        })
    }

    //4.Check event existence in DB
    const event = await Events.findById(eventId);
    if(!event) {
        return res.status(404).json({
            success: false,
            message: "no event found"
        })
    }
    console.log("Event data", event)

    const qrToken = randomUUID();

    //4.create a ticket object
    const ticket = await Tickets.create({
        booking: booking,
        event: event,
        participantName: booking.user.username,
        qrToken: qrToken,
        isCheckedIn: false
    })

    //insert here actual ticket PDF generation logic here later
    const pdfBuffer =  await generateTicketPDF(ticket._id,eventId,qrToken);
    //Fixed: this was actually returning unit8array 

    const buffer = Buffer.from(pdfBuffer)
    //converted to buffer

    const base64 = buffer.toString("base64")
    //console.log(base64)
    
    //Gixed: Used base64 to allow both ticket data and buffer transfer to frontend
    res.status(200).json({
        success: true,
        message: "Ticket generation and object creation successfull",
        ticketData: ticket,
        pdfData: base64
    })
});

export const getTicketData = asyncHandler(async (req,res)=>{
    const ticketId = req.body.ticketId;

    const ticket = await Tickets.findById(ticketId);
    
    //Check ticket's existence
    if(!ticket){
        return res.status(404).json({
            success: false,
            message: "Ticket doesn't exists"
        })
    }

    const event = await Events.findById(ticket.event);
    
    //Check if ticket has expired yet
    if(event.endTime < Date.now()){
        return res.status(404).json({
            success: false,
            message: "Ticket has expired"
        })
    }

    res.status(200).json({
        success: true,
        message: "Ticket found successfully",
        data: ticket
    })
})