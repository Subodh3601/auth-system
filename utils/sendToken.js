// create token and save into cookie 
import jwt from "jsonwebtoken"

export const sendToken = async (user, res, statusCode) => { 
    const token = user.getJWTToken();
     return token;
};