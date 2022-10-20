import slugify from "slugify";
import Candidate from "../models/Candidate.js";
import Position from "../models/Position.js";
import PositionUser from "../models/PositionUser.js";
import Role from "../models/Role.js";
import User from "../models/User.js"
import Tag from "../models/Tag.js"
// import pluck from 'arr-pluck';
import AddMember from "../models/AddMember.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import  dotenv from 'dotenv';
import fs from "fs/promises";
import Calendar from "../models/Calendar.js";
import Chat from "../models/Chat.js";
import { Op, col, where } from "sequelize";
import Meeting from "../models/Meetings.js";
import MeetUser from "../models/MeetUser.js";
import Skill from "../models/Skill.js";
import moment from  "moment";
import ics from "ics";
import StatusChange from "../models/StatusChange.js";
import CandidateChatRoom from "../models/CandidateChatRoom.js";
import CandidateChat from "../models/CandidateChat.js";
import io from "../index.js";
import googleTrends from 'google-trends-api';


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


export const profile = async (req,res) => {

    let data = await User.findOne({
        attributes: ["email",'first_name','last_name',"img","company","city","country","position","phone_no","isAdmin","isVendor","isVendorApplied","isVendorApproved"],
        where:{
            id:req.body.id
        }
    }) 
    res.send(data);
}

export const dashboard = async (req,res) => {
    let pId ;
    if(req.body?.positionId){
        pId = req.body.positionId
    }
    else{
        let usr = await User.findOne({
            where:{id:req.body.id},
            include: [
                { 
                    model: Position,
                    order: [ ["createdAt","DESC"] ] 
                }
            ]
        })
        try{
             pId = usr.positions[0].id
        }
        catch(e){
            res.send();
            return;
        }
    }

    let data = await Position.findOne(
        {
            where: { id: pId },
            include: [
                { 
                    model: Candidate , attributes: ["id","createdAt","updatedAt","status"], 
                    where: {
                        createdAt: { [Op.gt]: moment().subtract(1, 'years').toDate() }
                    },
                    include: 
                    [{ 
                        model: User, attributes: ['id','first_name','last_name'],
                        include: [{ 
                            model: PositionUser,
                            include:
                                [{ 
                                    model: Role, 
                                    where: { slug:{[Op.not]: "LITEHIRES-VENDOR"} }, required: true
                                }]
                                , required: true
                        }],
                        required:false
                    }]
                }
            ]
        }
    )
    res.send(data);
}

export const recentEvents = async (req,res) =>{
    let data = await User.findOne({
        where: { id: req.body.id },
        include: [
            {
                model: Calendar,
                where: { start: {[Op.gte]: moment() }},
                order:[["start","DESC" ]]
            }
        ]
    })
    res.send(data)
}


export const update = async (req,res) => {
    
    let data = await User.update(
        {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            company: req.body.company,
            phone_no: req.body.phone_no,
            city: req.body.city,
            country: req.body.country,
            position: req.body.position,
        },
        {
            where:{
                id:req.body.id
            }
        }
    ) 

    if(data){
        profile(req,res);
        return;
    }
    else{
        res.status(500).send({message:"Failed to update data"})

    }
    
}


export const uploadImg = (req,res) => {
    res.send({res:"Img uploaded"})   
}


export const newPosition = async (req,res) => {
    await Position.create({
        name:req.body.name,
        department:req.body.department,
        company:req.body.company,
        location:req.body.location,
        other:req.body.other,
        minExp:req.body.minExp,
        maxExp:req.body.maxExp,
        minCTC:req.body.minCtc,
        maxCTC:req.body.maxCtc,
        slug:slugify(req.body.name),
        isTest:req.body.isTest,
        isOfferInHand:req.body.isOfferInHand,
        isNewCompany:req.body.isNewCompany,
        isNewOffer:req.body.isNewOffer,
    }).then(async result => {

        let role = await Role.findOne({where:{name:"ADMIN"}})
        let preRole = await Role.findOne({where:{slug:"LITEHIRES-VENDOR"}})
        await PositionUser.create({ userId: req.body.id, positionId:result.id, roleId: role.id }).then(async pu => {
            let tags = []
            req.body.tags.forEach(async value => {
                tags.push({name:value.name,positionId:result.id})
                await Tag.create({name:value.name,positionId:result.id})
            })
            await PositionUser.create({ userId: 1, positionId:result.id, roleId: preRole.id }).catch(er => {})

            res.send({res:"success"})
            
        }).catch(async error => {
            res.status(500)
            res.send({ res:error })
            await Position.destroy({where:{id:result.id}})
         })
         return;
        
     }).catch(error => {
        res.status(500)
        res.send({ res:error })
     })
}

export const updatePostion = async (req,res) =>{
    await Position.update(
        {
            name:req.body.name,
            department:req.body.department,
            location:req.body.location,
            other:req.body.other,
            minExp:req.body.minExp,
            maxExp:req.body.maxExp,
            minCTC:req.body.minCtc,
            maxCTC:req.body.maxCtc,
            slug:slugify(req.body.name),
            isTest:req.body.isTest,
            isOfferInHand:req.body.isOfferInHand,
            isNewCompany:req.body.isNewCompany,
            isNewOffer:req.body.isNewOffer,
    },
        {
            where:{
                id: req.body.positionId
            }
        }
    ).then(async (a)=>{
        res.send({ res: "Position uploaded successfully",candidateId:a.id });
    }).catch(error => {
        res.status(500);
        res.send({ res:error });
     })

}


export const positions = async (req,res) =>{

    let data = await User.findOne({ 
        where:{id:req.body.id}, 
        include: [{
            model:Position,
            include:[
                {
                    model: Candidate , 
                    attributes: ['id',"createdAt"],
                    order: [['createdAt', 'DESC']]
                },
            ]
        }  ]
    });
    res.send(data);
}

export const roles = async (req,res) => {
    let data = await Role.findAll({where: {slug:{[Op.not]:"LITEHIRES-VENDOR"}}});
    res.send(data);
}

export const positionUsers = async (req,res) => {
    let data = await PositionUser.findAll({
        where: {
            positionId:req.body.positionId
        },

        include: [ 
            { model: User, required: true },
            { model: Role, where: { slug:{[Op.not]: "LITEHIRES-VENDOR"} }, required: true },
        ]

    })
    res.send(data);
}

export const rmMember = async (req,res) => {

    let admin = await Role.findOne({ where: {slug: "ADMIN"} })
    let ct = await PositionUser.count({ where: { positionId: req.body.positionId, userId: req.body.userId } })
    let cta = await PositionUser.count({ where: { positionId: req.body.positionId, userId: req.body.userId, roleId: admin.id } })

    if (ct <= 1 ){
        res.status(550).send()
        return ;
    }
    if (cta <= 1){
        res.status(551).send()

        return ;
    }
    await PositionUser.destroy({ where: { positionId: req.body.positionId, userId: req.body.userId } })
    res.send({res: "Removed"})
}

export const addMember = async (req,res) => {

    let u = await User.findOne({where: {email: req.body.email }})
    if(u){
        await User.findOne({
            where:{id:req.body.id},
            include: [
                {
                    model:Position,
                    where:{id:req.body.positionId}
                },
                {
                    model:Role,
                    where:{name:"ADMIN"}
                }
            ]
        }).then(async valid => {
            
            if(valid.positions[0].id == null || valid.roles[0].id == null || valid.positions[0].id == undefined || valid.roles[0].id == undefined){
                res.status(404);
                res.send({error:"1"});
                return;
            }
            await PositionUser.create({userId: u.id, roleId: req.body.roleId, positionId: req.body.positionId}).catch(error => { })
            res.send({res:"joined"});

        })
    }

    let ct = await AddMember.count({ where: { positionId: req.body.positionId, email: req.body.email } })
    if (ct > 0 ){
        res.status(550).send()
        return ;
    }

    await User.findOne({
        where:{id:req.body.id},
        include: [
            {
                model:Position,
                where:{id:req.body.positionId}
            },
            {
                model:Role,
                where:{name:"ADMIN"}
            }
        ]
    }).then(async valid => {
        
        if(valid.positions[0].id == null || valid.roles[0].id == null || valid.positions[0].id == undefined || valid.roles[0].id == undefined){
            res.status(404);
            res.send({error:"1"});
            return;
        }
        let rand = crypto.randomBytes(10).toString('hex');
        await AddMember.create({
            code:rand,
            email:req.body.email,
            positionId:req.body.positionId,
            roleId:req.body.roleId
        }).then(async r => {
            let htmlTemplate = await fs.readFile('emails/join.txt', { encoding: 'utf8' });
              let role =  await Role.findByPk(req.body.roleId)
              // send mail with defined transport object
              await transporter.sendMail({
                from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
                to: req.body.email, // list of receivers
                subject: "Invitation", // Subject line
                html: htmlTemplate
                    .replace("--JOB--",valid.positions[0].name)
                    .replace("--ROLE--",role.name)
                    .replace("--ROLE--",role.name)
                    .replace("--SENDER--",valid.first_name+" "+valid.last_name)
                    .replace("--URL--",`${process.env.FRONTDOMAIN}/userDashboard/joinPosition/${rand}`), // html body
              });
            res.send({res:"success"});
        }).catch(r => {
            res.status(500)
            res.send({error:"2"});
        } )
        return;

    }).catch(r => {
        res.status(500);
        res.send({error:"3"});
        return;
    })

}

export const joinMember = async (req,res) => {
    let j = await  AddMember.findOne({where:{code:req.body.code}})

    if( j == null){
        res.status(500)
        return null;
    }

    await PositionUser.create({ 
        userId:req.body.id, 
        positionId:j.positionId, 
        roleId:j.roleId 
    }).catch(async r => {
        await AddMember.destroy({where:{code:req.body.code}})
        res.send({res:"success"})
        return;
    }).then( r => {
        // res.status(500)
        res.send({error:"error"})
    })

    await j.destroy()
}


export const changePassword = async (req,res) => {
    let usr = await User.findOne({ where: {id: req.body.id, password: crypto.createHash('sha256').update(`campusHires-${req.body.password}`).digest('hex')  } })

    if (usr == null){
        res.send({message: "Current password didn't match", type: "error"})
        return null;
    }
    else{
        await User.update({password: crypto.createHash('sha256').update(`campusHires-${req.body.new_password}`).digest('hex') }, { where: { id: usr.id } })
        res.send({message: "Password changed", type: "success"})
    }

}

// Candidate data handeling
export const addCandidate = async (req,res) => {

    let pos = await Position.findOne({ where: {id: req.body.positionId, status: "ACTIVE" } })

    if(pos == null){
        res.status(500).send({
            errors:[
                {
                    message: 'Position not active',
                    type:"NOT_ACTIVE"
                 },
                ]
        });
        return null;
    }
    await Candidate.create({
        positionId: req.body.positionId,
        userId: req.body.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,

        email: req.body.email,
        phone_no: req.body.phone_no,

        currentCtc: req.body.currentCtc,
        expectedCtc: req.body.expectedCtc,

        location: req.body.location,
        gender: req.body.gender,

        newPosition: req.body.position,
        rtc: (req.body.rtc) ? true : false,
        experience: req.body.experience,

        notice: req.body.notice,
        unemployed: (req.body.unemployed) ? true : false,
        skill: req.body.mainSkill,

        lastDay: req.body.lastDay,
        currentCompany: req.body.currentCompany,
        offerInHand: (req.body.offerInHand) ? true : false,
        newCompany: req.body.newCompany,
        newOffer: req.body.newOffer
    }).then(async (a)=>{

        let room = crypto.randomBytes(10).toString('hex');
        await CandidateChatRoom.create({room: room ,candidateId: a.id, positionId: a.positionId})

        await StatusChange.create({ newStatus: "APPLIED", prvStatus: "APPLIED", candidateId: a.id, userId: req.body.id })
        req.body.otherSkill.forEach( async (val) => {
            await Skill.create({ candidateId: a.id, name: val })
        })

        res.send({ res: "Candidate uploaded successfully",candidateId:a.id });
    }).catch(error => {
        res.status(500);
        res.send(error);
     })
}

export const positionStatusChange = async (req,res) => {
    await Position.update({ status: req.body.status }, {where: {id: req.body.positionId}})
    res.send({res: "success"})
}

export const positionVisibilityChange = async (req,res) => {
    let data = await Position.findByPk(req.body.positionId)
    data.isPublicApplied = req.body.isPublic
    await data.save()

    if(!req.body.isPublic){
        let role = await Role.findOne({ where: { slug: "LITEHIRES-VENDOR"  }  })
        await PositionUser.destroy({ where: { roleId: role.id, positionId: req.body.positionId } })
    }
    res.send()
}

export const getCandidate = async (req,res) =>{
    let data = await Candidate.findOne({
        where:{
            id:req.body.candidateId,
            userId: req.body.id
        }
    })
    res.send(data);
}

export const getCandidates = async (req,res) =>{

    let userCheck = await PositionUser.findOne({
        where: {
            positionId:req.body.positionId,
            userId: req.body.id
        },
        include: [{ model: Role , required: true}]   
    })

    if(userCheck.role.slug == "LITEHIRES-VENDOR" || userCheck.role.slug == "EXTERNAL-RECRUITER"){
        let data = await Candidate.findAll({
            where:{
                positionId:req.body.positionId,
                userId: req.body.id
            },
            include:[
                { model: Skill },
                { 
                    model: User, attributes:["id","first_name","last_name","email","company"], 
                    include: [{ model: PositionUser, where:{positionId:req.body.positionId }, include: [{model: Role }]  }],
                }
            ],
            order: [
                ['priority', 'ASC'],
            ],
        })
        res.send(data);
        return null;
    }
    let data = await Candidate.findAll({
        where:{
            positionId:req.body.positionId
        },
        include:[
            { model: Skill },

            { 
            model: User, attributes:["id","first_name","last_name","email","company"], 
            include: [{ model: PositionUser, where:{positionId:req.body.positionId }, include: [{model: Role }]  }],
        }],
        order: [
            ['priority', 'ASC'],
        ],
    })
    res.send(data);
}

export const position = async(req,res) =>{

    let positionUser = await PositionUser.findOne({ where: {  userId: req.body.id, positionId: req.body.positionId}, 
        include:[ 
            {model: Role}, 
            { model: Position, include: [{model: Tag, where: {positionId: req.body.positionId}, attributes: ["name"], required:false }] } ]   });
            
    res.send(positionUser);
}

export const rmPosition = async (req,res) => {

    let role = await Role.findOne({where: { slug: "ADMIN" }})
    if (role == null){
        res.status(500).send()
        return
    }
    let permission = await PositionUser.findOne({
        where: { userId: req.body.id, positionId: req.body.positionId, roleId: role.id }
    })

    if(permission == null){
        res.status(450).send()
        return 
    }

    await Position.destroy({ where: { id: permission.positionId } })
    res.send({res:"sucess"})
}

export const rmCandidate = async (req,res) => {

    let candidate = await Candidate.findOne({where: { id: req.body.candidateId }})

    if (candidate == null){
        res.status(450).send()
        return
    }

    await Candidate.destroy({ where: { id: candidate.id } })
    res.send({res:"sucess"})
}



export const getAllCandidates = async(req,res) =>{
    let data = await User.findOne({ 
        where:{id:req.body.id}, 
        include: [{
            model:Candidate,
            order: [['createdAt', 'DESC']],
            include: [{ model: Position}, {model: User, attributes: ["id","email","first_name","last_name"]}]
        }]
    });
    res.send(data);
}

export const getPositionData = async (req,res) => {
    let data;
    if(req.body.positionId){

        data = await Candidate.findAll( {
            attributes: ["id","status","positionId","createdAt","updatedAt"],
            where: { 
                positionId: {[Op.in]: req.body.positionId },
                createdAt: { [Op.gt]: moment().subtract(1,'years').toDate() } 

            },
            include: [
                { model: StatusChange},
                { model: User, attributes: ["id", "first_name", "last_name"], include: [ {model: PositionUser, include:  {model: Role} } ]   }
                // { model: Position, attributes:["id","name"], where: { id: { [Op.in] : req.body.positionId }, required: true } }

            ],
            order: [['createdAt', 'DESC']]
        } )

    }
    else{
        data = await Candidate.findAll( {
            attributes: ["id","status","positionId","createdAt","updatedAt"],
            where: {
                userId: req.body.id,
                createdAt: { [Op.gt]: moment().subtract(1,'years').toDate() } 
            },
            include: [
                { model: StatusChange },
                { model: User, attributes: ["id", "first_name", "last_name"], include: [ {model: PositionUser, include:  {model: Role} } ]   }
                // { model: Position, attributes:["id","name"], where: { id: { [Op.in] : req.body.positionId }, required: true } }

            ],
            order: [['createdAt', 'DESC']]
        } )

    }
    res.send(data);
}


export const updateCandidateDetails = async(req,res) =>{
       
    await Candidate.update(
        {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            currentCtc: req.body.currentCtc,
            expectedCtc: req.body.expectedCtc,
            location: req.body.location,
            gender: req.body.gender,
            newPosition: req.body.position,
            rtc: (req.body.rtc) ? true : false,
            experience: req.body.experience,
            notice: req.body.notice,
            unemployed: (req.body.unemployed) ? true: false,
            lastDay: req.body.lastDay,
            currentCompany: req.body.currentCompany,
            offerInHand: (req.body.offerInHand) ? true : false ,
            newCompany: req.body.newCompany,
            newOffer: req.body.newOffer,
    },
        {
            where:{
                id:req.body.candidateId,
                userId: req.body.id
            }
        }
    ).then(async (a)=>{
        res.send({ res: "Candidate uploaded successfully",candidateId:a.id });
    }).catch(error => {
        res.status(500);
        res.send({ res:error });
     })

}

export const updateCandidateStatus = async(req,res) =>{
   
    let user = await User.findByPk(req.body.id);
    let c = await Candidate.findByPk(req.body.candidateId)
    console.log(req.body.status );
    await Candidate.update(
        { status: req.body.status },
        { where:{ id:req.body.candidateId} }
    ).then(async (a)=>{
        console.log(a);
        await Chat.create({
            candidateId:req.body.candidateId,
            positionId: c.positionId,
            userId: req.body.id,
            content: `${c.status} -> ${req.body.status} by ${user.first_name} ${user.last_name}`,
            isStatus: true
            
        })
        await StatusChange.create({ userId: req.body.id, candidateId: req.body.candidateId, prvStatus:c.status , newStatus: req.body.status })
        c = await Candidate.findByPk(req.body.candidateId)
        res.send(c)

    }).catch( err => res.status(500).send())

}

export const updateCandidatePriority = async(req,res) =>{

    let p = req.body.priorities;

    let promises = []
    let c = await Candidate.findOne({ where: { id:  req.body.priorities[0]}})
    p.forEach(async (element,index) => {
        promises.push(new Promise((resolve, reject) => { Candidate.update({ priority:index }, { silent: true, where: { id: element } }).then( resolve(true))  } ))
    })

    Promise.all(promises).then(() => {
        res.send({ res: "Candidate updated successfully" })
        io.emit(`updatePipeline-${c.positionId}`,{disable: false})
    });

}

export const getEvents = async (req,res) => {
    let data = await User.findOne({
        where:{ id:req.body.id },
        include: Calendar
        
    })

    res.send(data);
}

export const getChat = async (req,res) => {

    let data  = await Chat.findAll({
        where:{positionId: req.body.positionId, candidateId: req.body.candidateId},
        include: [{ model: User, attributes:["first_name","last_name","email","id","img"] }]
    })
    res.send(data);
}

export const getCandidateChat = async (req,res) => {

    let data  = await CandidateChat.findAll({where:{positionId: req.body.positionId, candidateId: req.body.candidateId}})
    res.send(data);
}

export const getRoom  = async (req,res) => {
    let data = await CandidateChatRoom.findOne({ candidateId: req.body.candidateId, positionId: req.body.positionId })
    res.send(data)
}


export const sendCandidateChat = async (req,res) => {

    await CandidateChat.create({
        positionId: req.body.positionId,
        candidateId: req.body.candidateId,
        content: req.body.content,
        isCandidate: false,
    })
    let data  = await CandidateChat.findAll({where:{positionId: req.body.positionId, candidateId: req.body.candidateId}})
    res.send(data)

    let ch = await CandidateChatRoom.findOne({ where: {candidateId:req.body.candidateId , positionId: req.body.positionId} })
    let candidateDetails = await Candidate.findByPk(req.body.candidateId);
    let positionDetails = await Position.findByPk(req.body.positionId);


    let htmlTemplate = await fs.readFile('emails/chatUpdate.txt', { encoding: 'utf8' });
    // send mail with defined transport object
    await transporter.sendMail({
       from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
       to: candidateDetails.email, // list of receivers
       subject: "New Message", // Subject line
       html: htmlTemplate
       .replace("--candidateName--", candidateDetails.first_name+" "+candidateDetails.last_name)
       .replace("--message--", req.body.content)
       .replace("--positionName--", positionDetails.name)
       .replace("--room--",`${process.env.FRONTDOMAIN}/candidateChat/${ch.room}`)
       .replace("--companyName--",positionDetails.company)
       .replace("--companyName--",positionDetails.company)
   });

}

export const sendChat = async (req,res) => {

    await Chat.create({
        positionId: req.body.positionId,
        candidateId: req.body.candidateId,
        userId: req.body.id,
        content: req.body.content
    })
    let data  = await Chat.findAll({where:{positionId: req.body.positionId, candidateId: req.body.candidateId}})

    res.send(data)
}



export const interview = async (req,res) => {

    let s = moment(req.body.start).tz("Asia/Kolkata");
    req.body.start = s.format("dddd, MMMM Do YYYY, h:mm a");
    req.body.end = s.clone().add(req.body.duration,'minutes').format();
    let icalTime = s.clone().subtract(330,'minutes');


    //get necessary data for database
    let members = req.body.members.split(",")
    let candidate = await Candidate.findOne({ where: { id: req.body.candidateId }, include: [{model: Position}]})
    let user = await User.findByPk(req.body.id)
    //=================================

    let interviewUser = []
    let interviewName = []
    let eventAtten = []

    // create room for meeting
    let room = crypto.randomBytes(10).toString('hex');
    let meetingLink = `${process.env.FRONTDOMAIN}/meeting/${room}`;
    // =====================

    if(req.body.type == "ONLINE"){

        let htmlTemplate = await fs.readFile('emails/interview1.txt', { encoding: 'utf8' });

        // store meeting and chat data
        await Meeting.create({ userId: req.body.id,name:req.body.name ,room: room, start: s.format(), end: req.body.end, candidateId: req.body.candidateId })
        let chatText = "Interview Scheduled @ "+ req.body.start + ` with ${candidate.first_name} ${candidate.last_name} on ${candidate.position.name}`;
        await Chat.create({ positionId: req.body.positionId,isStatus:true , candidateId: req.body.candidateId, userId: req.body.id, content: chatText })
        //==============================

        let meet = await Meeting.findOne({ where:  { room: room } })


        // push data of all the User invited to the meeting
        await Promise.all(members.map( async (value) => {

                let uid = await User.findOne({where: { email: value }}) 
                if (!uid){
                    return null;
                }
                
                interviewUser.push(uid)
                interviewName.push(`${uid.first_name} ${uid.last_name}`)
                eventAtten.push({ rsvp:true,  role: 'REQ-PARTICIPANT',name: `${uid.first_name} ${uid.last_name}`, email: uid.email})
                await MeetUser.create({userId: uid.id, meetingId: meet.id})
                await Calendar.create({ userId: uid.id, name: req.body.name, des: req.body.des, start: s.format(), end: req.body.end })
            })
        )
        eventAtten.push({ rsvp:true,role: 'REQ-PARTICIPANT', name: `${candidate.first_name} ${candidate.last_name}`, email: candidate.email})
        //=================================================

        // event (calendar) =================
        let event;

        console.log([icalTime.year(), icalTime.month(), icalTime.date(), icalTime.hour(), icalTime.minute()]);
        ics.createEvent({
            title: req.body.name,
            description: `${req.body.des}`,
            method:"REQUEST",
            uid:`${room}@campusHires.com`,
            start: [icalTime.year(), icalTime.month()+1, icalTime.date(), icalTime.hour(), icalTime.minute()],
            location: meetingLink,
            duration: { minutes: req.body.duration },
            organizer: { name: `${user.first_name} ${user.last_name}`, email: user.email },
            attendees: eventAtten,
            description: req.body.des
        }, (error, value) => {
            if (error) {
            }
            event = value
        })
    
        //=========================

        // send mail all the User invited to the meeting
        interviewUser.forEach( async (value) => {
            await transporter.sendMail({
                from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
                to: value.email, 
                subject: "Interview",
                html: htmlTemplate
                    .replace("--interviewers--",interviewName.join(", "))
                    .replace("--candidateName--",`${value.first_name} ${value.last_name}`)
                    .replace("--link--",meetingLink)
                    .replace("--name--",req.body.name)
                    .replace("--des--",req.body.des)
                    .replace("--start--",req.body.start)
                    .replace("--duration--",`${req.body.duration} mins` ),
                icalEvent: {
                        filename: 'invitation.ics',
                        method: 'request',
                        content: event
                    }
            });
        })
        //=================================================

        //send mail to the candidate
        await transporter.sendMail({
            from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
            to: candidate.email, 
            subject: "Interview",
            html: htmlTemplate
                .replace("--interviewers--",interviewName.join(", "))
                .replace("--candidateName--",candidate.first_name)
                .replace("--link--",meetingLink)
                .replace("--name--",req.body.name)
                .replace("--des--",req.body.des)
                .replace("--start--",req.body.start)
                .replace("--duration--",`${req.body.duration} mins` ),
            icalEvent: {
                filename: 'invitation.ics',
                method: 'request',
                content: event
            }
        });
        //==========================================

    }
    else{
        let htmlTemplate = await fs.readFile('emails/interview2.txt', { encoding: 'utf8' });

        // store meeting and chat data
        await Meeting.create({ userId: req.body.id,name:req.body.name ,room: room, start: s.format(), end: req.body.end, candidateId: req.body.candidateId, type:req.body.type, value: req.body.value })
        let chatText = "Interview Scheduled @ "+ req.body.start + ` with ${candidate.first_name} ${candidate.last_name} on ${candidate.position.name}`;
        await Chat.create({ positionId: req.body.positionId,isStatus:true , candidateId: req.body.candidateId, userId: req.body.id, content: chatText })
        //==============================

        let meet = await Meeting.findOne({ where:  { room: room } })

        // push data of all the User invited to the meeting
        await Promise.all(members.map( async (value) => {

                let uid = await User.findOne({where: { email: value }}) 
                if (!uid){
                    return null;
                }
                
                interviewUser.push(uid)
                interviewName.push(`${uid.first_name} ${uid.last_name}`)
                eventAtten.push({ rsvp:true,  role: 'REQ-PARTICIPANT',name: `${uid.first_name} ${uid.last_name}`, email: uid.email})
                await MeetUser.create({userId: uid.id, meetingId: meet.id})
                await Calendar.create({ userId: uid.id, name: req.body.name, des: req.body.des, start: s.format(), end: req.body.end })
            })
        )
        eventAtten.push({ rsvp:true,role: 'REQ-PARTICIPANT', name: `${candidate.first_name} ${candidate.last_name}`, email: candidate.email})
        //=================================================

        // event (calendar) =================

        let event;

        ics.createEvent({
            title: req.body.name,
            description: `${req.body.des}`,
            method:"REQUEST",
            uid:`${room}@campusHires.com`,
            start: [icalTime.year(), icalTime.month(), icalTime.date(), icalTime.hour(), icalTime.minute()],
            location: req.body.value == "F2F" ? req.body.value : `Phone (${req.body.value})`,
            duration: { minutes: req.body.duration },
            organizer: { name: `${user.first_name} ${user.last_name}`, email: user.email },
            attendees: eventAtten,
            description: req.body.des
        }, (error, value) => {
            if (error) {
            }
            event = value
        })
    
        //=========================

        // send mail all the User invited to the meeting
        interviewUser.forEach( async (value) => {
            await transporter.sendMail({
                from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
                to: value.email, 
                subject: "Interview",
                html: htmlTemplate
                    .replace("--interviewers--",interviewName.join(", "))
                    .replace("--candidateName--",`${value.first_name} ${value.last_name}`)
                    .replace("--location--",req.body.value == "F2F" ? req.body.value : `Phone (${req.body.value})`)
                    .replace("--name--",req.body.name)
                    .replace("--des--",req.body.des)
                    .replace("--start--",req.body.start)
                    .replace("--duration--",`${req.body.duration} mins` ),
                icalEvent: {
                        filename: 'invitation.ics',
                        method: 'request',
                        content: event
                    }
            });
        })
        //=================================================

        //send mail to the candidate
        await transporter.sendMail({
            from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
            to: candidate.email, 
            subject: "Interview",
            html: htmlTemplate
                .replace("--interviewers--",interviewName.join(", "))
                .replace("--candidateName--",candidate.first_name)
                .replace("--location--",req.body.value == "F2F" ? req.body.value : `Phone (${req.body.value})`)
                .replace("--name--",req.body.name)
                .replace("--des--",req.body.des)
                .replace("--start--",req.body.start)
                .replace("--duration--",`${req.body.duration} mins` ),
            icalEvent: {
                filename: 'invitation.ics',
                method: 'request',
                content: event
            }
        });
        //==========================================
    }
    

    res.send({res:"success"})
}

export const meetings = async (req,res) => {

    let data = await User.findOne({ 
        where: { id: req.body.id },
        include: [{
                model: Meeting,
                include: [{
                    model: User,
                    attributes: ["id","email","first_name","last_name"]
                }],
            }],
        order: [ [ col('meetings.start', 'DESC') ] ]
    })

    res.send(data)
}

export const meetingNoResponse = async (req,res) => {

    let data = await Meeting.findOne({ where: { candidateId: req.body.candidateId, response:null, end: { [Op.lt]: new Date() }} })
    res.send(data)
}

export const meetingResponse = async (req,res) => {
    await Meeting.update({ response: req.body.response }, { where: {id: req.body.meetingId} })
    res.send()
}

export const getInvites = async (req,res) => {

    let data = await AddMember.findAll({ where: { positionId: req.body.positionId } })
    res.send(data)
} 

export const resendInvite = async (req,res) => {
    let data = await AddMember.findOne({ where: { positionId: req.body.positionId, email: req.body.email } })
    let usr = await User.findByPk(req.body.id)
    let pos = await Position.findOne({ where: { id: req.body.positionId  } })
    let role = await Position.findOne({ where: { id: data.roleId  } })
    let htmlTemplate = await fs.readFile('emails/join.txt', { encoding: 'utf8' });
              
    // send mail with defined transport object
    await transporter.sendMail({
    from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
    to: req.body.email, // list of receivers
    subject: "Invitation", // Subject line
    html: htmlTemplate
        .replace("--JOB--",pos.name)
        .replace("--ROLE--",role.name)
        .replace("--SENDER--",usr.first_name+" "+usr.last_name)
        .replace("--URL--",`${process.env.FRONTDOMAIN}/userDashboard/joinPosition/${data.code}`), // html body
    });
    res.send({res:"success"});
}

export const enrolVendor = async (req,res) => {

    let data = await User.findByPk(req.body.id)
    data.isVendorApplied = true
    await data.save()
    res.send()
}

export const sendChatUpdateEmail = async(req,res) => {

    let candidateDetails = await Candidate.findByPk(req.body.candidateId);
    let positionDetails = await Position.findByPk(candidateDetails.positionId);

    let ch = await CandidateChatRoom.findOne({ where: {candidateId: candidateDetails.id, positionId: positionDetails.id} })
    let room;
    if(ch){
        await CandidateChat.create({ positionId: ch.positionId, candidateId: ch.candidateId, content: req.body.content })
        room = ch.room
    }
    else{
        room = crypto.randomBytes(10).toString('hex');
        await CandidateChatRoom.create({room: room ,candidateId: candidateDetails.id, positionId: positionDetails.id})
    }

    let htmlTemplate = await fs.readFile('emails/chatUpdate.txt', { encoding: 'utf8' });
     // send mail with defined transport object
     await transporter.sendMail({
        from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
        to: candidateDetails.email, // list of receivers
        subject: req.body.subject, // Subject line
        html: htmlTemplate
        .replace("--candidateName--", candidateDetails.first_name+" "+candidateDetails.last_name)
        .replace("--message--", req.body.content)
        .replace("--positionName--", positionDetails.name)
        .replace("--room--",`${process.env.FRONTDOMAIN}/candidateChat/${room}`)
        .replace("--companyName--",positionDetails.company)
        .replace("--companyName--",positionDetails.company)
    });
    res.send({res:"success"});
}


export const trends = async (req,res) => {

    console.log(req.body.keyword);
    googleTrends.autoComplete({
        keyword: req.body.keyword,
        startTime: moment().subtract('10',"years").toDate(),
        category : 958
    })
        .then(results =>  {
        res.send(results);
        })
        .catch( err => {
        res.send(err);
        })

}

export const trendsData = async (req,res) => {

    console.log(req.body.keyword);
    googleTrends.interestOverTime({
        keyword: req.body.keyword,
        startTime: moment().subtract('10',"years").toDate(),
        category : 958
    })
        .then(results =>  {
        res.send(results);
        })
        .catch( err => {
        res.send(err);
        })

}