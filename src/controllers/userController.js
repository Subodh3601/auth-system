
import UserModel from "../models/userModel.js";
import { sendPasswordResetEmail } from "../../utils/resetPassword.js"
import { sendToken } from "../../utils/sendToken.js";
import { createNewUserRepo, findUserForPasswordResetRepo, findUserRepo } from "../models/userRepository.js";
import session from "express-session";



export const createNewUser = async (req, res) => {
    try {
        console.log("body data", req.body)
        const newUser = await createNewUserRepo(req.body);
        if (newUser.success == false) {
            return res.render("signup", { success: false, msg: newUser.msg })
        }
        return res.render("signin", { success: true, msg: "User registration Successful" });
    } catch (err) {
        // handle error for duplicate email
        return res.render("signup", { success: false, meg: err });
    }
};

//login

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render("signin", { success: false, msg: "please enter email/password" });
        }

        const user = await findUserRepo({ email }, true);
        if (!user) {
            return res.render("signup", { success: false, msg: "user not found! register yourself now!!" });
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.render("signin", { success: false, msg: "Invalid email or passsword!" });
        }

        //session initialization
        req.session.email = email;



        const token = await sendToken(user, res, 200);
        //setting cookie 
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, cookieOptions);

        return res.render('userHome', { msg: "User SignIn Successful" });
    } catch (error) {
        return res.render("signin", { success: false, msg: error });

    }
};

export const logoutUser = async (req, res, next) => {
    req.session.destroy();
    res.clearCookie("token");
    return res.status(302).render('home', { success: true, msg: "logout successful" });
};

//forget password
export const forgetPassword = async (req, res) => {
    // Implement feature for forget password 
    console.log("req.body",req.body)
    try {
        const { email } = req.body;
        console.log("req.body",req.body,"email:  ",email)
        if (!email) {
            return res.render('forgetPassword', { success: false, msg: "Please provide an email address" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.render('forgetPassword', { success: false, msg: "User not found, please use registered email" });
        }
        const token = await user.getResetPasswordToken();
        console.log("user",user,"token:  :",token)
        user.resetPasswordToken = token;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();
        console.log("user",user.resetPasswordToken,"token:  :",user.resetPasswordExpire)
        const resetPasswordURL = `http://localhost:3000/password/reset/${token}`;
        await sendPasswordResetEmail(user, resetPasswordURL);
        return res.render('forgetPassword', { success: true, msg: "Password reset token has been sent to your mail. click on the link to reset your password" });
    } catch (error) {
        return res.render('forgetPassword', { success: false, msg:`error form server ${error}`});
    }
};

//reset password
export const resetUserPassword = async (req, res) => {
    // Implement feature for reset password 
    const user = await findUserForPasswordResetRepo(req);
   if(user.success==false){
    return res.render('resetPassword', { success: false, msg: user.msg });
   }
    return res.render('resetPassword', { success: true, msg: user.msg });
};


//update password
export const updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log("currentPassword, newPassword, confirmPassword",currentPassword, newPassword, confirmPassword)
    try {
        if (!currentPassword) {
            return res.render("updatePassword", { success: false, msg: "pls enter current password" });

        }
        const user = await findUserRepo({ _id: req.user._id }, true);
        const passwordMatch = await user.comparePassword(currentPassword);
        if (!passwordMatch) {
            return res.render("updatePassword", { success: false, msg: "Incorrect current password!" });

        }
        if (!newPassword || newPassword !== confirmPassword) {
            return res.render("updatePassword", { success: false, msg: "mismatch new password and confirm password!" });
        }
        // user.password = newPassword;
        user.updateOne({password:newPassword})
        // await user.save();
        // await sendToken(user, res, 200);
        return res.render("updatePassword", { success: true, msg: "Password Update successful!" });

    } catch (error) {
        return res.render("updatePassword", { success: false, msg: error });

    }
};