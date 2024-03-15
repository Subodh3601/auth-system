import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpire: {
        type: String,
        dafault: null,
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }

})

// JWT Token 
userSchema.methods.getJWTToken = function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
    }, process.env.JWT_Secret, {
        expiresIn: process.env.JWT_Expire,
    });
};

// user password compare 
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generatePasswordResetToken 
userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and updating user resetPasswordToken 

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};


const UserModel = mongoose.model("User", userSchema);

export default UserModel;