import mongoose from 'mongoose'
import {DB_NAME} from './constant.js'
import 'dotenv/config'

export const connectDB = async () => {
    try{
        const db = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        console.log(`Database sucessfully connceted ${db.connection.host}`);
    }
    catch(err){
        console.log(`Error: Couldn't connect database ${err}`)
    }
}