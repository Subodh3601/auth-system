import jwt from "jsonwebtoken";
import UserModel from "../src/models/userModel.js";

export const auth = async (req, res, next) => {

    //session check
    if (req.session.email) {
        const { token } = req.cookies;
        if (!token) {
            return res.render("signin", { msg: "User not registered! register to sign-In" });
        }
        const decodedData = jwt.verify(token, process.env.JWT_Secret, (err, data) => {
            if (err) {
                return res.render("signin", { msg: "User name or password is incorrect" })
            } else {
                req._id = data._id;
                req.user = data;
                // console.log("req.user =================",data); 
                next()
            }
        })
    } else {
        return res.render("signin", { msg: "User name or password is incorrect" })
    }

    // const { token } = req.cookies;
    // if (!token) {
    //     return res.render("signin", { msg: "User not registered! register to sign-In" });
    // }
    // const decodedData = jwt.verify(token, process.env.JWT_Secret, (err, data) => {
    //     if (err) {
    //       return  res.render("signin", { msg: "User name or password is incorrect" })
    //     } else {
    //         req._id = data._id;
    //         req.user = data;
    //         // console.log("req.user =================",data); 
    //         next()
    //     }
    // });
};