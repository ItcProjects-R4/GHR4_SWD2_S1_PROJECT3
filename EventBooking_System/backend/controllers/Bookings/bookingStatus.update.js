import { Bookings } from '../../models/booking.model.js'

export const changeBookingStatus = async (bookingId, status) => {
  if (!['Pending','Cancelled','Confirmed'].includes(status)) {
    throw new Error("Invalid status")
  }
  const booking = await Bookings.findById(bookingId)
  if (!booking) throw new Error("No booking found")
  
  booking.bookingStatus = status
  await booking.save()  // also remove the redundant updateOne above this
}