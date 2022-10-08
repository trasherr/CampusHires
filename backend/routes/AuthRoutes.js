// npm imports
import express  from "express";

//custom imports
import  { changePass, login, register,sendOTP, verifyOTP } from "../controllers/AuthController.js";

//route initialization
const registerRoute = express.Router();


//route definition and controller function assignment
registerRoute.post('/login',login );
registerRoute.post('/sendOTP',sendOTP);
registerRoute.post('/verifyOTP',verifyOTP);
registerRoute.post('/changePass',changePass);
registerRoute.post('/register',register );

export default registerRoute;
