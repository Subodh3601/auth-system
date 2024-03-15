import app from "./index.js"
import {connectDB} from "./config/db.js"

app.listen(process.env.PORT,async(err)=>{
    if(err){
        console.log(`sever failed with error ${err}`);

    }else{
        await connectDB();
        console.log(`server is running at https://localhost:${process.env.PORT}`)
    }
})