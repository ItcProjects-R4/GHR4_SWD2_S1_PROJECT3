import {app} from './app.js'
import{connectDB} from './db/index.js'
import 'dotenv/config'

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`server is running at port http://localhost:${process.env.PORT}`)
})
})
.catch((err)=>{
    console.log(`cannot connect Database and server, ${err}`);
})

export default app;