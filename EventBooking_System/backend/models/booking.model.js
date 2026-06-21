import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
},
event:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events"
},
ticketCount:{
    type: Number,
    required: true,
    min: 1
},
totalAmount:{
    type: Number,
    required: true,
    min: 0
},
bookingStatus:{
    type: String,
    enum: ['Confirmed','Cancelled','Pending'],
    default: 'Pending'
}
},{timestamps: true})

export const Bookings = mongoose.model('Bookings',bookingSchema)