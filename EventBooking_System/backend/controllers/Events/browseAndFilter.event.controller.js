import { Events } from '../../models/event.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const browseAndFilter = asyncHandler(async (req, res) => {
  // Destructure from req.query (GET requests are standard for search)
  const { 
    title, maxPrice, minPrice, category, 
    venue, mode, status, startTime, endTime,
    page = 1, limit = 10 
  } = req.query;

  let query = {};

  // Text Search (Case-insensitive Regex)
  if (title) query.title = { $regex: title, $options: 'i' };
  if (category) query.category = { $regex: category, $options: 'i' };
  if (venue) query.venue = { $regex: venue, $options: 'i' };

  // Exact Matches
  if (mode) query.mode = mode; 
  if (status) query.status = status;

  // Numeric Range Filtering (Fixed logic: min is $gte, max is $lte)
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Date Filtering
  if (startTime || endTime) {
    query.startTime = {};
    if (startTime) query.startTime.$gte = new Date(startTime);
    if (endTime) query.endTime.$lte = new Date(endTime);//Fixed: startTime.$lte to endTime.$lte 
  }

  //Only admin approved events should be accessbile by the users
  //query.adminApproval = true

  // Pagination & Execution
  const skip = (Number(page) - 1) * Number(limit);

  const events = await Events.find(query)
    .sort({ startTime: 1 }) // Sort by upcoming events
    .skip(skip)
    .limit(Number(limit));

  const totalResults = await Events.countDocuments(query);

  // Response
  res.status(200).json({
    success: true,
    results: events.length,
    total: totalResults,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalResults / limit)
    },
    data: events
  });
});