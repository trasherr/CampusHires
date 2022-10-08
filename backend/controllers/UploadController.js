import User from "../models/User.js"
import jwt from "jsonwebtoken";
import Candidate from "../models/Candidate.js";

export const uploadImg = async (req,res) => {

    var headers = JSON.parse(JSON.stringify(req.headers));
    var tk = jwt.verify(headers.auth,"access_token")
    var data = await User.findOne({attributes: ["img"], where:{id:tk.id}})
    
    res.send({res:data.img})
}

export const uploadResume = async (req,res) => {

    var headers = JSON.parse(JSON.stringify(req.headers))
    var tk = jwt.verify(headers.auth,"access_token")
    var data = await Candidate.findOne({attributes: ["resume"], where:{id:headers.candidate}})

    res.send({res:data.resume})
}

export const uploadChatDocs = async (req,res) => {
    var headers = JSON.parse(JSON.stringify(req.headers))
    var tk = jwt.verify(headers.auth,"access_token")
    // var data = await Candidate.findOne({attributes: ["content"], where:{id:tk.id}})

    res.send()
}

export const uploadCandidateChatDocs= async (req,res) => {
    res.send()
}