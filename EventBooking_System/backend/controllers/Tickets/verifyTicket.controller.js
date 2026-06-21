import { Tickets } from "../../models/ticket.model.js";
import { Attendances } from "../../models/attendance.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const verifyTicket = asyncHandler(async(req,res)=>{
    const qrCode = req.body.qrCode;
    
    const data = qrCode.split(".");
   
    const qrToken = data[1];
    const ticketId = data[0];

    //search ticket object by it's ID in DB
    const ticket = await Tickets.findOne({qrToken});
    
    //If ticket doesn't exists 
    if(!ticket){
        return res.status(404).json({
            success: false,
            message: 'Invalid ticket'
        })
    }

    if(ticket.isCheckedIn){
        return res.status(404).json({
            success: false,
            message: "Tikcet is already used"
        })
    } 
    
    ticket.isCheckedIn = true;
    ticket.isCheckedInAt = Date.now();

    //create an attendence log
    const attendance = await Attendances.create({
        ticket: ticket._id,
        scanTime: ticket.isCheckedInAt,
        scanResult: 'valid'
    })
    
    await Tickets.findByIdAndUpdate(ticket._id, {
    isCheckedIn: true,
    isCheckedInAt: new Date(),
    attendanceId: attendance._id  // store reference
    })
    
    await ticket.save();

    res.status(200).json({
        success: true,
        message: 'Ticket exsits and it is valid',
        data: ticket
    })
})