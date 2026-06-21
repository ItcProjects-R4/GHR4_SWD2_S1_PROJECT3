import { Events } from '../../models/event.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createEvents = asyncHandler(async (req, res) => {
    const { 
        title, 
        category, 
        mode, 
        venue, 
        seatLimit, 
        status, 
        price, 
        startTime, 
        endTime 
    } = req.body;
    
    const organizerId = req.user._id;
    
    if (!organizerId || !title || !category || !mode || !venue || !price || !startTime ||!endTime) {
        return res
        .status(400)
        .json({ message: "Some fields are missing" });
    }
    
    const newEvent = await Events.create({
        organizer: organizerId,
        title,
        category,
        mode,
        venue,
        seatLimit,
        status,
        price,
        startTime,
        endTime,
        adminApproval: true
    });

    res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: newEvent
    })
});
