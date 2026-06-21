import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
    ticket:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    scanTime:{
        type: Date,
        default: Date.now
    },
    scanResult:{
        type: String,
        enum: ['valid','invalid'],
        required: true,
        default: 'invalid'
    }
},{timestamps: true})

export const Attendances = mongoose.model('Attendances',attendanceSchema)