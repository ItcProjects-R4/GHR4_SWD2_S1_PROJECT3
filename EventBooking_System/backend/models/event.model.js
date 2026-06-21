import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    organizer:{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Users",
       required: true
    },
    title:{
       type: String,
       required: true,
    },
    category:{
       type: String,
       required: true
    },
    mode:{
        type: String,
        enum: ["Online","Campus","External"],
        required: true
    },
    venue:{
        type: String,
        required: true
    },
    seatLimit:{
        type: Number,
        required: true,
        min: 1
    },
    status:{
        type: String,
        enum: ['Active','Completed','Canceled'],
        default: 'Active'
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type: Date,
        required: true
    },
    adminApproval:{
        type: Boolean,
        default: true
    }
},{timestamps: true})

export const Events = mongoose.model('Events',eventSchema)