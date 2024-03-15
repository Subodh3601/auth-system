import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("db connecting....")
        const res = await mongoose.connect(process.env.mongoURI);

        console.log(`mogodb connected with server ${res.connection.host}`)
    } catch (error) {
        console.log("mongodb connection failed : ", error);
    }
}