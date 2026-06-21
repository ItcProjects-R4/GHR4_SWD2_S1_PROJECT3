import { Events } from '../../models/event.model.js'; // Ensure correct path
import { asyncHandler }  from '../../utils/asyncHandler.js';

export const updateEvents = asyncHandler(async (req, res) => {
    const {
        title, category, mode, venue, 
        price, seatLimit, startTime, endTime, status
    } = req.body;

    const _id = req.params.id;

    const event = await Events.findById(_id);

    if (!event) {
        return res.status(404).json({
            success: false,
            message: "Event not found"
        });
    }

    event.title = title || event.title;
    event.category = category || event.category;
    event.mode = mode || event.mode;
    event.venue = venue || event.venue;
    event.price = price ?? event.price; //if price is 0(free event) it will be flagged as false .Use nullish cosacling
    event.seatLimit = seatLimit ?? event.seatLimit; //same with seatLimit
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.status = status || event.status;

    const updatedEvent = await event.save();

    res.status(200).json({
        success: true,
        message: "Event updated successfully!",
        data: updatedEvent
    });
});