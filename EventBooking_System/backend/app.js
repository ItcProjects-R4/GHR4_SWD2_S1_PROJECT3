import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//import all routes
import userRouter from './routes/user.route.js'
import eventRouter from './routes/event.route.js'
import bookingRouter from './routes/booking.route.js'
import paymentRouter from './routes/payment.route.js'
import ticketRouter from './routes/ticket.route.js'
import certificateRouter from './routes/certificate.route.js'

//route declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/events",eventRouter)
app.use("/api/v1/bookings",bookingRouter)
app.use("/api/v1/payments",paymentRouter)
app.use("/api/v1/tickets",ticketRouter)
app.use("/api/v1/certificates",certificateRouter)

export {app}