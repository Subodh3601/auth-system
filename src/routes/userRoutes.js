import express from "express";
import { createNewUser, userLogin, logoutUser, forgetPassword, resetUserPassword, updatePassword } from "../controllers/userController.js"
import { auth } from "../../middlewares/auth.js"
import passport from "passport";

const router = express.Router();

// User GET Routes 
router.get('/', (req, res) => {
    return res.render('home',{msg:null})
});

//sign up
router.get('/signup', (req, res) => {
    return res.render('signup', { msg: null })
});
router.post('/signup', createNewUser);

//signin
router.get('/signin', (req, res) => {
    return res.render('signin', { msg: null })
});
router.post('/signin', userLogin);

//forget password
router.get('/forget-password',(req, res) => {
    return res.render('forgetpassword',{msg:null})
});
router.post("/forget-password",forgetPassword);

// User PUT Routes 
router.get("/password/reset/:token",(req, res) => {
    console.log("token from reset param",req.params.token)
    return res.render('resetPassword',{msg:null,token:req.params.token});
});
router.post("/password/reset/:token",resetUserPassword);

//userhome
router.get('/user-home', auth,(req, res) => {
    return res.render('userHome', { msg: null })
});
//update router
router.get('/update-password',auth, (req, res) => {
    return res.render('updatePassword', { msg: null })
});
router.post("/update-password",auth,updatePassword);



router.get("/logout",auth,logoutUser);



export default router;
