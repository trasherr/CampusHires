// npm imports
import express  from "express";
import multer from 'multer';
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Candidate from "../models/Candidate.js";
import url from "url";


// storage destination and file parameters
const storageDP = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, './public/images/users/dp')
    },
    filename: async function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const imgName = file.fieldname + '-' + uniqueSuffix+extension
        cb(null, imgName)


        //auth
        const headers = JSON.parse(JSON.stringify(req.headers))
        const tk = jwt.verify(headers.auth,"access_token")

        //deleting existing img
        var imgC = await User.findOne({attributes: ["img"], where:{id:tk.id}})

        if(imgC.img){
            try {
                fs.unlink(path.resolve('public','images','users','dp',imgC.img))
            }
            catch(err){
                
            }
        }
        // Updating database
        await User.update({"img": imgName},{where:{id:tk.id}})

    }
})


// storage destination and file parameters
const storageResume = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, './public/resume/')
    },
    filename: async function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const imgName = file.fieldname + '-' + uniqueSuffix+extension
        cb(null, imgName)


        //auth
        const headers = JSON.parse(JSON.stringify(req.headers))
        //deleting existing img
        var imgC = await Candidate.findOne({attributes: ["resume"], where:{id:headers.candidate}})

        if(imgC.resume){
            try{
                fs.unlink(path.resolve('public','resume',imgC.resume))
            }
            catch(err){

            }
        }

        // Updating database
        await Candidate.update({"resume": imgName},{where:{id:headers.candidate}})

    }
})

// storage destination and file parameters
const storageChatDocs = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/files/')
    },
    filename: async function(req, file, cb){
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '_' +  Math.round(Math.random() * 1E9)
        const fileName = file.fieldname + '-' + uniqueSuffix+extension

        const headers = JSON.parse(JSON.stringify(req.headers))
        let tk = jwt.verify(headers.auth,"access_token")
        console.log(headers.candidate);

        //create database pid cid uid isStatus = FALSE ismedia = TRUE  use chat.create
        let candidatePosition = await Candidate.findByPk(headers.candidate)
        await Chat.create({
            positionId: candidatePosition.positionId,
            candidateId: headers.candidate,
            userId: tk.id,
            content: fileName,
            isStatus: false,
            isMedia: true,
        })
        cb(null, fileName)
    }
})

// storage destination and file parameters
const storageCandidateChatDocs = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/files/')
    },
    filename: async function(req, file, cb){
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '_' +  Math.round(Math.random() * 1E9)
        const fileName = file.fieldname + '-' + uniqueSuffix+extension
       
        let query = url.parse(req.url, true).query
        console.log(query);

        let tk;
        if(query.verify){
            try{ tk = jwt.verify(query.verify,"access_token") }
            catch(err){ }
        }

        let room  = await CandidateChatRoom.findOne({where:{room: query.room}})
        await CandidateChat.create({
            positionId: room.positionId,
            candidateId: room.candidateId,
            content: fileName,
            isStatus: false,
            isMedia: true,
            isCandidate: (tk) ? false:  true,
        })
        cb(null, fileName)
       
    }
})

// file filters, checks and initialization of upload middleware for DP
const uploadDp = multer({ 
    storage: storageDP, 
    fileFilter:function(req,file,cb){
        const headers = JSON.parse(JSON.stringify(req.headers));
        
        //check file extension
        const extension = path.extname(file.originalname).toLowerCase()
        if (extension == '.jpg' || extension == '.jpeg' || extension == '.png'){
            let tk;
            try{
                tk = jwt.verify(headers.auth,"access_token")
            }
            catch(err){
                cb("authentication failed",false);
            }
            if(tk != undefined)
                cb(null,true);
            else
                cb("authentication failed",false);
            

        }
        else
            cb("Invalid file type",false)
        
    }
})


// file filters, checks and initialization of upload middleware for PDF(resume)
const uploadPDF = multer({ 
    storage: storageResume, 
    fileFilter:function(req,file,cb){
        const headers = JSON.parse(JSON.stringify(req.headers));
        
        //check file extension
        const extension = path.extname(file.originalname).toLowerCase()
        if (extension == '.pdf' || extension == '.docx' || extension == '.doc' || extension == '.pptx'){
            let tk;
            try{
                tk = jwt.verify(headers.auth,"access_token")
            }
            catch(err){
                cb("authentication failed 1",false);
            }
            if(tk != undefined)
                cb(null,true);
            else
                cb("authentication failed 2",false);
            

        }
        else
            cb("Invalid file type",false)
        
    }
})


// file filters, checks and initialization of upload middleware for PDF(resume)
const uploadDocs = multer({
    storage: storageChatDocs,
    fileFilter:function(req,file,cb) {
        const headers = JSON.parse(JSON.stringify(req.headers));
        console.log(headers);

        const allowedExtensions = ['.pptx','.ppt','.docx','.doc','.pdf','.jpeg','.jpg','.zip','.png','.rar'];

        const extension = path.extname(file.originalname).toLowerCase()
        if (allowedExtensions.indexOf(extension) != -1){
            let tk;
            try{
                tk = jwt.verify(headers.auth,"access_token")
            }
            catch(err){
                cb("authentication failed",false);
            }
            if(tk != undefined)
                cb(null,true);
            else
                cb("authentication failed",false);
            

        }
        else
            cb("Invalid file type",false)
    }
})

const uploadCandidateDocs = multer({
    storage: storageCandidateChatDocs,
    fileFilter:async function(req,file,cb) {

        const allowedExtensions = ['.pptx','.ppt','.docx','.doc','.pdf','.jpeg','.jpg','.zip','.png','.rar'];

        let query = url.parse(req.url, true).query
        const extension = path.extname(file.originalname).toLowerCase()
        let room  = await CandidateChatRoom.findOne({where:{room: query.room}})


        if(!room){
            cb("Invalid Room",false)
        }
        else if (allowedExtensions.indexOf(extension) != -1){
            cb(null,true);
        }
        else
            cb("Invalid file type",false)
    }
})

//route initialization
const userRoute = express.Router();

import { uploadImg, uploadResume, uploadChatDocs, uploadCandidateChatDocs } from "../controllers/UploadController.js";
import CandidateChat from "../models/CandidateChat.js";
import CandidateChatRoom from "../models/CandidateChatRoom.js";


userRoute.post('/user/img-upload',uploadDp.single("img"),uploadImg);
userRoute.post('/user/resume-upload',uploadPDF.single("resume"),uploadResume);
userRoute.post('/user/chat-docs-upload',uploadDocs.single("content"),uploadChatDocs);
userRoute.post('/user/candidate-chat-docs-upload',uploadCandidateDocs.single("content"),uploadCandidateChatDocs);

export default userRoute;
