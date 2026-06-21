import { asyncHandler } from "../../utils/asyncHandler.js";
import { Events } from "../../models/event.model.js";

export const getEventData = asyncHandler(async(req,res)=>{
    const eventId = req.params.id;

    const event = await Events.findById(eventId);

    if(!event){
        return res.status(404).json({
            success: false,
            message: "Event not found"
        })
    }
    
    //Unapproved events can only be accessed by organizers or admin
    /*if(!event.adminApproval && req.user.role === 'User'){
        return res.status(404).json({
            success: false,
            message: "Event is un-approved by the admin and can only be viewed by organizers or admin"
        })
    }*/

    res.status(200).json({
        success: true,
        message: "Event data fetched succcessfully",
        data: event
    })
})