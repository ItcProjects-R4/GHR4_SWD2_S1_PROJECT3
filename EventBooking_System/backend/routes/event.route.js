import { Router } from "express";

import { browseAndFilter } from "../controllers/Events/browseAndFilter.event.controller.js";
import { createEvents } from "../controllers/Events/createEvents.controller.js";
import { deleteEvents } from "../controllers/Events/deleteEvents.controller.js";
import { updateEvents } from "../controllers/Events/updateEvents.controller.js"; 
import { approveEvent, rejectEvent, getPendingEvents } from "../controllers/Events/adminApproval.event.controller.js";
import { getEventData } from "../controllers/Events/getEvent.controller.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router()

router.route('/browse-events').get(verifyJWT,browseAndFilter);

router.route('/create-event').post(verifyJWT,createEvents);

router.route('/:id/delete-event').delete(verifyJWT,deleteEvents);

router.route('/:id/edit-event').patch(verifyJWT,updateEvents);

router.route('/:id/get-pending-events').get(verifyJWT,getPendingEvents);

router.route('/:eventId/approve-event').post(verifyJWT,approveEvent);

router.route('/:eventId/reject-event').post(verifyJWT,rejectEvent);

router.route('/:id/get-event-data').get(verifyJWT,getEventData);


export default router