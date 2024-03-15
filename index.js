import dotenv from "dotenv";
import path from "path";
const configPath = path.resolve("config", "key.env");
dotenv.config({ path: configPath });
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import UserModel from "./src/models/userModel.js";
import userRoutes from "./src/routes/userRoutes.js";


const app = express();
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", path.join(path.resolve(), 'src', 'views'))


//session
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}))
//to parse the form data 
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());

app.use("/", userRoutes);

export default app

