import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";


export const createNewUserRepo = async (user) => {
    try {
        const { name, email, password } = user;
        if (name == "" || email == "" || password == "") {
            return { success: false, msg: "Name/Email/Password are required" }
        }

        let registeredUser = await UserModel.findOne({ email });
        if (registeredUser) {
            return { success: false, msg: "email already registered" }
        } else {
            const newUser = new UserModel(user);
            await newUser.save();
            return { success: true, msg: "email registered", user }

        }
    } catch (err) {
        console.log("error", err)
        return { success: false, msg: err }
    }
}

export const findUserRepo = async (factor, withPassword = false) => {
    if (withPassword)
        return await UserModel.findOne(factor).select("+password");
    else return await UserModel.findOne(factor);
};

export const findUserForPasswordResetRepo = async (req) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;
        console.log("token", newPassword, confirmPassword, token)
        if (!newPassword || !confirmPassword) {
            return { success: false, msg: "Please provide new password and confirm password", statusCode: 400 };
        }
        if (newPassword !== confirmPassword) {
            return { success: false, msg: "Provided passwords do not match. Please make sure to input same new password and confirm password.", statusCode: 400 };
        }
        const user = await UserModel.findOne({ resetPasswordToken: token });
        if (!user || user.resetPasswordExpire < Date.now()) {
            return { success: false, msg: "Invalid or expired token.", statusCode: 400 };
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return { success: true, msg: "Password reset successful" };
    } catch (error) {
        return { success: false, msg: error, statusCode: 400 };
    }
}
