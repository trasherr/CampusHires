import CandidateChat from "../models/CandidateChat.js";
import CandidateChatRoom from "../models/CandidateChatRoom.js";


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