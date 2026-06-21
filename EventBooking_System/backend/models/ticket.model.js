import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
    booking:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Bookings"
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Events"
    },
    participantName:{
        type: String,
        required: true
    },
    qrToken:{
       type: String,
       required: true,
       unique: true
    },
    isCheckedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    isCheckedInAt:{
        type: Date
    }
},{timestamps: true})

export const Tickets = mongoose.model("Tickets",ticketSchema)