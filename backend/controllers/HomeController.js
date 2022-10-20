import CandidateChat from "../models/CandidateChat.js";
import CandidateChatRoom from "../models/CandidateChatRoom.js";

import googleTrends from 'google-trends-api';

export const getCandidateChat = async (req,res) => {

    console.log(req.body);
    if(!req.body.room){
        res.status(500).send()
    }
    let room  = await CandidateChatRoom.findOne({where:{room: req.body.room}})
    let data = await CandidateChat.findAll({where: { candidateId: room.candidateId } })
    res.send(data);
}

export const sendCandidateChat = async (req,res) => {

    if(!req.body.room){
        res.status(500).send()
    }
    let room  = await CandidateChatRoom.findOne({where:{room: req.body.room}})

    await CandidateChat.create({
        positionId: room.positionId,
        candidateId: room.candidateId,
        isCandidate: req.body.isCandidate,
        content: req.body.content,
    })
    let data  = await CandidateChat.findAll({where: { candidateId: room.candidateId } })

    res.send(data)
}

export const trends = async (req,res) => {

    // googleTrends.interestOverTime({
    //     keyword: ['PHP',"Node.js"],
    //     startTime: moment().subtract('5',"years").toDate(),
    //     category : 958
    // })
    //     .then(results =>  {
    //     res.send(results);
    //     })
    //     .catch( err => {
    //     res.send(err);
    //     })

    googleTrends.autoComplete({
        keyword: 'PHP',
        // startTime: moment().subtract('5',"years").toDate(),
        category : 958
    })
        .then(results =>  {
        res.send(results);
        })
        .catch( err => {
        res.send(err);
        })
}