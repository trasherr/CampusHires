import User from "../models/User.js";
import OTP from "../models/OTP.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import  dotenv from 'dotenv';
import fs from "fs/promises";

dotenv.config()


const transporter = nodemailer.createTransport({
    host: (process.env.PRODUCTION) ? process.env.MAILHOST : process.env.MAILTRAP_HOST,
    port: (process.env.PRODUCTION) ? process.env.MAILPORT : process.env.MAILTRAP_PORT,
    secure: (process.env.PRODUCTION) ? true : false, // true for 465, false for other ports
    auth: {
      user: (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER, // generated ethereal user
      pass: (process.env.PRODUCTION) ? process.env.MAILPASS : process.env.MAILTRAP_PASS, // generated ethereal password
    },
  });
 
export const login = async (req,res) => {
    
    var data = await User.findOne(
        { where: 
            { 
                email: req.body.email , 
                password: crypto.createHash('sha256').update(`litehires-${req.body.password}`).digest('hex')
            } 
        }).catch(function(error){
            res.send(error);
            return;
        });
        
    if(data != null){
        const token = jwt.sign(
            {
                id:data.id,
                email: data.email,
                isAdmin: data.isAdmin
            },
            "access_token",
            {
                expiresIn: req.body.exp
            }
        )
        res.send({id:data.id, access_token: token});
        return;
    }
    res.send(null);
    
}

export const register = async (req,res) => {

    var userExixts = await User.findOne(
        { where: 
            { 
                email: req.body.email
            } 
        }).catch(function(error){
            res.send(error);
            return;
        });
    
    if(userExixts == null){
        
        var data = await User.create({ 
            first_name: req.body.first_name, 
            last_name: req.body.last_name ,  
            email: req.body.email,
            phone_no: req.body.phone_no,
            company: req.body.company,
            password: crypto.createHash('sha256').update(`campusHires-${req.body.password}`).digest('hex'),
            isVendor: req.body.isVendor
        }).catch(function(e) {
            res.send(e);
            return;
        });
        res.send(data);
        const htmlTemplate = await fs.readFile('emails/newRegister.txt', { encoding: 'utf8' });
        await transporter.sendMail({
            from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
            to: 'ankit.khanduri@campusHires.com', // list of receivers
            subject: 'New Registration', // Subject line
            html: htmlTemplate.replace("--first--",data.first_name).replace("--last--",data.last_name).replace("--email--",data.email).replace("--vendor--",(data.isVendor)? "As Vendor": "As Client"), // html body
        }).catch(err => { console.log( err );});

        return;
    }
    res.send(JSON.stringify({
        id: null,
        first_name:null,
        last_name:null,
        email: null,
        password: null,
        phone_no: null,
        img:null,
        company: null,
        position: null,
        city: null,
        country: null,
        isAdmin: null,
        isVendor: null,
        createdAt: null,
        updatedAt:null
    }));
}

export const sendOTP = async (req,res) => {

    console.log({
        host: process.env.MAILHOST,
        port: process.env.MAILPORT
    })
    var data = await User.findOne(
        { where: 
            { 
                email: req.body.email 
            } 
        }).catch(function(error){
            res.send(error);
            return;
        });
    if (data == null){
        res.send({res:"failed"})
        return;
    }else{

        var otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
        const htmlTemplate = await fs.readFile('emails/resetPassword.txt', { encoding: 'utf8' });

        await OTP.create({ 
            otp: otp, 
            email: req.body.email
        }).catch(function(e) {
            res.send(e);
            return;
        });
          
          // send mail with defined transport object
          await transporter.sendMail({
            from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
            to: req.body.email, // list of receivers
            subject: req.body.subject, // Subject line
            text: "OTP", // plain text body
            html: htmlTemplate.replace("--otp--",otp), // html body
          }).catch(err => { console.log( err );});
    
        res.send({res:"success"})
    }
}

export const verifyOTP = async(req,res) => {
    var data = await OTP.findOne(
        { where: 
            { 
                email: req.body.email,
                otp: req.body.otp
            } 
        }).catch(function(error){
            res.send({res: error.statusText});
            return;
        });
    if (data == null){
        res.send({res:"mismatch"})
        return;
    }else{
        data.destroy();
        res.send({res:"success"})
    }
}

export const changePass = async(req,res) => {
    await User.update(
        {password: crypto.createHash('sha256').update(`campusHires-${req.body.password}`).digest('hex')},
        { where: 
            { 
                email: req.body.email 
            } 
        }).catch(function(error){
            res.send({res:"failed"})
            return;
        });
    res.send({res:"success"})
    return ;

    
}
