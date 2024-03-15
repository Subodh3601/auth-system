import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (user, resetPasswordURL) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.AUTH_SMPT_MAIL,
            pass: process.env.AUTH_SMPT_MAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.AUTH_SMPT_MAIL,
        to: user.email,
        subject: "Password Reset",
        text:`click on url ${resetPasswordURL}`,
    }
    await transporter.sendMail(mailOptions);
};