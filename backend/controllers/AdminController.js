import slugify from "slugify";
import Candidate from "../models/Candidate.js";
import Position from "../models/Position.js";
import PositionUser from "../models/PositionUser.js";
import Role from "../models/Role.js";
import User from "../models/User.js"
import Tag from "../models/Tag.js"
import pluck from 'arr-pluck';
import AddMember from "../models/AddMember.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import  dotenv from 'dotenv';
import fs from "fs/promises";
import Calendar from "../models/Calendar.js";
import Chat from "../models/Chat.js";
import { Op } from "sequelize";
import moment from  "moment";
import Meeting from "../models/Meetings.js";
import StatusChange from "../models/StatusChange.js";
import Skill from "../models/Skill.js";
import { pid } from "process";
import CandidateChat from "../models/CandidateChat.js";
import CandidateChatRoom from "../models/CandidateChatRoom.js";
import MeetUser from "../models/MeetUser.js";
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
        attributes: ["email",'first_name','last_name',"img","company","city","country","position","phone_no","isAdmin","createdAt"],
        where:{
            id:req.body.id
        }
    }) 
    res.send(data);
}

export const getUserProfile = async (req,res) => {

    let data = await User.findOne({
        attributes: ["email",'first_name','last_name',"img","company","city","country","position","phone_no","isAdmin","createdAt"],
        where:{
            id:req.body.userId
        }
    }) 
    res.send(data);
}

export const getUsers = async (req,res) => {

    let data = await User.findAll({ 
        attributes:["id","email",'first_name','last_name',"img","company","city","country","position","phone_no","isAdmin","isVendor","isVendorApplied","isVendorApproved","createdAt"], 
        where: { isAdmin: false }
    })
    res.send(data)

} 


export const dashboard = async (req,res) => {
    let pId ;
    if(req.body?.positionId){
        pId = req.body.positionId
    }
    else{
        let pos = await Position.findOne({ order: [ ["createdAt","DESC"] ] })
        pId = pos.id
    }

    let data = await Position.findOne(
        {
            where: { id: pId },
            include: [
                { 
                    model: Candidate , attributes: ["id","createdAt","updatedAt","status"], 
                    where: { createdAt: { [Op.gt]: moment().subtract(1, 'years').toDate() } },
                    include: {  model: User, attributes: ['id','first_name','last_name'], required: true},
                    required: false
                }
            ]
        }
    )
    res.send(data);
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



export const updateUser = async (req,res) => {
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
                id:req.body.userId
            }
        }
    ) 

    if(data){
        getUserProfile(req,res);
        return;
    }
    else{
        res.status(500).send({message:"Failed to update data"})

    }   
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

// export const newPosition = async (req,res) => {
//     console.log(req.body)
//     await Position.create({
//         name:req.body.name,
//         department:req.body.department,
//         location:req.body.location,
//         other:req.body.other,
//         minExp:req.body.minExp,
//         maxExp:req.body.maxExp,
//         minCTC:req.body.minCtc,
//         maxCTC:req.body.maxCtc,
//         slug:slugify(req.body.name),
//         isTest:req.body.isTest,
//         isOfferInHand:req.body.isOfferInHand,
//         isNewCompany:req.body.isNewCompany,
//         isNewOffer:req.body.isNewOffer,
//     }).then(async result => {
//         let role = await Role.findOne({where:{name:"ADMIN"}})
//         await PositionUser.create({ userId: req.body.id, positionId:result.id, roleId: role.id }).then(async pu => {
//             let tags = []
//             req.body.tags.forEach(async value => {
//                 tags.push({name:value.name,positionId:result.id})
//                 await Tag.create({name:value.name,positionId:result.id})
//             })

//             res.send({res:"success"})
            
//         }).catch(async error => {
//             res.status(500)
//             res.send({ res:error })
//             await Position.destroy({where:{id:result.id}})
//          })
//          return;
        
//      }).catch(error => {
//         res.status(500)
//         res.send({ res:error })
//      })
// }

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
    let data = await Position.findAll({
            include:[
                { model: Candidate , attributes: ["id","status","createdAt"], order: [['createdAt', 'DESC']] }
            ]
    });
    res.send(data);
}


export const positionStatusChange = async (req,res) => {
    await Position.update({ status: req.body.status }, {where: {id: req.body.positionId}})
    res.send({res: "success"})
}

export const positionVisibilityChange = async (req,res) => {
    let data = await Position.findByPk(req.body.positionId)
    data.isPublic = req.body.isPublic
    data.isPublicApplied = req.body.isPublic
    await data.save()

    if(req.body.isPublic){
        let usr = await User.findAll({where: { isVendor: true, isVendorApplied:true, isVendorApproved: true } })
        let role = await Role.findOne({ where: { slug: "LITEHIRES-VENDOR"  }  })

        Object.keys(usr).forEach(async (key, index) => {
            await PositionUser.create({ userId: usr[key].id, positionId: req.body.positionId , roleId: role.id }).catch( err => { })
        })
    }
    else{
        let role = await Role.findOne({ where: { slug: "LITEHIRES-VENDOR"  }  })
        await PositionUser.destroy({ where: { roleId: role.id, positionId: req.body.positionId } })

    }
    res.send()
}

export const roles = async (req,res) => {
    let data = await Role.findAll();
    res.send(data);
}

export const positionUsers = async (req,res) => {
    let data = await PositionUser.findAll({
        where: {
            positionId:req.body.positionId
        },

        include: [ 
            { model: User },
            { model: Role }
        ]

    })

    res.send(data);
}

export const rmMember = async (req,res) => {
    let admin = await Role.findOne({ where: {slug: "ADMIN"} })
    let ct = await PositionUser.count({ where: { positionId: req.body.positionId, userId: req.body.userId } })
    let cta = await PositionUser.count({ where: { positionId: req.body.positionId, userId: req.body.userId, roleId: admin.id } })

    if (ct <= 1 ){
        res.status(550)
        return ;
    }
    if (cta <= 1){
        res.status(551)
        return ;
    }
    await PositionUser.destroy({ where: { positionId: req.body.positionId, userId: req.body.userId } })
    res.send({res: "Removed"})
}

export const addMember = async (req,res) => {

    let u = await User.findOne({where: {email: req.body.email, isAdmin: true }})
    if(u){

        await PositionUser.create({userId: u.id, roleId: req.body.roleId, positionId: req.body.positionId})
        res.send({res:"joined"});
    }

    let pos = await Position.findOne({ where: { id: req.body.positionId } })
    let role = await Role.findOne({ where: { id: req.body.roleId } })

    let rand = crypto.randomBytes(20).toString('hex');
    await AddMember.create({
        code:rand,
        email:req.body.email,
        positionId:req.body.positionId,
        roleId:req.body.roleId
    }).then(async r => {
        let htmlTemplate = await fs.readFile('emails/join.txt', { encoding: 'utf8' });
            
            // send mail with defined transport object
            await transporter.sendMail({
            from: `CampusHires <${ (process.env.PRODUCTION) ? process.env.MAILUSER : process.env.MAILTRAP_USER}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Invitation", // Subject line
            html: htmlTemplate
                .replace("--JOB--",pos.name)
                .replace("--ROLE--",role.name)
                .replace("--ROLE--",role.name)
                .replace("--SENDER--","CampusHires")
                .replace("--URL--",`${process.env.FRONTDOMAIN}/userDashboard/joinPosition/${rand}`), // html body
            });
        res.send({res:"success"});
    }).catch(r => {
        res.status(500)
        res.send({error:"2"});
    } )
    return;


}

export const joinMember = async (req,res) => {
    let j = await  AddMember.findOne({where:{code:req.body.code}})

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
}
// Candidate data handeling
export const addCandidate = async (req,res) => {
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
        rtc: req.body.rtc ? true: false,
        experience: req.body.experience,

        notice: req.body.notice,
        unemployed: req.body.unemployed ? true: false,

        lastDay: req.body.lastDay,
        currentCompany: req.body.currentCompany,
        offerInHand: req.body.offerInHand ? true: false,
        newCompany: req.body.newCompany,
        newOffer: req.body.newOffer,
        // pincode: req.body.pincode,
        // company: req.body.company,
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
        res.send({ res:error });
     })
}

export const getCandidates = async(req,res) =>{
    let data = await Candidate.findAll({
        where:{
            positionId:req.body.positionId
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
}

export const position = async(req,res) =>{

    console.log(req.body.positionId);
    let positionUser = await PositionUser.findOne({ where: {  userId: req.body.id, positionId: req.body.positionId}, 
        include:[ 
            {model: Role}, 
            { model: Position, include: [{model: Tag, where: {positionId: req.body.positionId}, attributes: ["name"], required:false }] } ]   });
            
    res.send(positionUser);
}

export const getPositionData = async (req,res) => {
    let data;
    if(req.body.positionId){

        data = await Candidate.findAll( {
            attributes: ["id","status","createdAt","updatedAt"],
            where: { 
                userId: {[Op.in]: req.body.userId },
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
                userId: {[Op.in]: req.body.userId },
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
    let data = await Candidate.findAll({ 
        include: [{ model: Position}, {model: User, attributes: ["id","email","first_name","last_name"]}],
        order: [['createdAt', 'DESC']] 
    });
    res.send(data);
}

export const getCandidate = async (req,res) =>{
    let data = await Candidate.findOne({
        where:{
            id:req.body.candidateId,
        }
    })
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
            rtc: req.body.rtc ? true: false,
            experience: req.body.experience,
            notice: req.body.notice,
            unemployed: req.body.unemployed ? true: false,
            lastDay: req.body.lastDay,
            currentCompany: req.body.currentCompany,
            offerInHand: req.body.offerInHand ? true: false,
            newCompany: req.body.newCompany,
            newOffer: req.body.newOffer,
    },
        {
            where:{
                id:req.body.candidateId
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
    await Candidate.update(
        { status: req.body.status },
        { where:{ id:req.body.candidateId} }
    ).then(async (a)=>{
    
        await Chat.create({
            candidateId:req.body.candidateId,
            positionId: c.positionId,
            userId: req.body.id,
            content: `${c.status} -> ${req.body.status} by ${user.first_name} ${user.last_name}`,
            isStatus: true
        })
        c = await Candidate.findByPk(req.body.candidateId)
        res.send(c)
        return;
    })
    res.status(500).send()

}

export const updateCandidatePriority = async(req,res) =>{

    let p = req.body.priorities;
    let c = 0
    p.forEach(async (element,index) => {
        await Candidate.update({ priority:index }, { silent: true, where: { id: element }  }).then( a => {
            c++
            if (c == p.length){

                res.send({ res: "Candidate updated successfully" });
            }
        } )
    })
}

export const getEvents = async (req,res) => {
    let data = await User.findOne({
        where:{ id:req.body.id },
        include: Calendar
        
    })

    res.send(data);
}

export const recentEvents = async (req,res) =>{
    let cr = new Date()
    var data = await User.findOne({
        where: { id: req.body.id },
        include: [
            {
                model: Calendar,
                where: { start: {[Op.gte]: new Date(cr.getDate()) }},
                order:[["start","DESC" ]]
            }
        ]
    })

    res.send(data)
}

export const getChat = async (req,res) => {

    let data  = await Chat.findAll({
        where:{positionId: req.body.positionId, candidateId: req.body.candidateId},
        include: [{ model: User, attributes:["first_name","last_name","email","id","img"] }]
    })
    res.send(data);
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

        ics.createEvent({
            title: req.body.name,
            description: `${req.body.des}`,
            method:"REQUEST",
            uid:`${room}@campusHires.com`,
            start: [icalTime.year(), icalTime.month(), icalTime.date(), icalTime.hour(), icalTime.minute()],
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

    let data = await Meeting.findAll({ 
        include: [{
                model: User,
                attributes: ["id","email","first_name","last_name"]
        }],
        order: [ ["start","DESC"] ]
     })
    res.send(data)
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

export const approveVendor = async (req,res) => {

    await User.update({isVendorApproved: true},{ where: {id:  req.body.userId}})
    let pos = await Position.findAll({where: { isPublic: true } })
    let role = await Role.findOne({ where: { slug: "LITEHIRES-VENDOR"  }  })

    Object.keys(pos).forEach(async (key, index) => {
        await PositionUser.create({ userId: req.body.userId, positionId: pos[key].id , roleId: role.id }).catch( err => { })
    })
    res.send()
}

export const approvePosition = async (req,res) => {

    let pos = await Position.findByPk(req.body.positionId)
    pos.isPublic = req.body.isPublic
    await pos.save()

    if(pos.isPublic){
        let usr = await User.findAll({where: { isVendor: true, isVendorApplied:true, isVendorApproved: true } })
        let role = await Role.findOne({ where: { slug: "LITEHIRES-VENDOR"  }  })

        Object.keys(usr).forEach(async (key, index) => {
            await PositionUser.create({ userId: usr[key].id, positionId: req.body.positionId , roleId: role.id }).catch( err => { })
        })
    }
    res.send()
}

export const refreshVendors = async (req,res) => {
    let pos = await Position.findAll({where: { isPublic: true } })
    let usr = await User.findAll({where: { isVendor: true, isVendorApplied:true, isVendorApproved: true } })
    let role = await Role.findOne({ where: { slug: "LITEHIRES-VENDOR"  }  })

    Object.keys(pos).forEach(async (key1, index1) => {
        Object.keys(usr).forEach(async (key2, index2) => {
            await PositionUser.create({ userId: usr[key2].id, positionId: pos[key1].id , roleId: role.id }).catch( err => { })
        })
    })

    res.send()
}


export const deleteUser = async (req,res) => {

    await Chat.destroy({ where: { userId: req.body.userId, isStatus: false } });
    await Calendar.destroy({ where: { userId: req.body.userId } });
    await Meeting.destroy({ where: { userId: req.body.userId } });
    await MeetUser.destroy({ where: { userId: req.body.userId } });
    await StatusChange.destroy({ where: { userId: req.body.userId } });
    await PositionUser.destroy({ where: { userId: req.body.userId } });


    await Candidate.findAll({ where: { userId: req.body.userId } })
    .then(async candidates => {
        deleteCandidate(candidates)
    })
    await Candidate.destroy({ where: { userId: req.body.userId } })
    await User.destroy({  where : {id: req.body.userId} })
    
    getUsers(req,res)

}

const deleteCandidate = async (candidates) => {

    let cid = []
    Object.entries(candidates).forEach(([key, val]) => {
        pid.push(val.id)
    });

    if(cid.length > 0){
        await CandidateChat.destroy({ where: { candidateId: { [Op.in] : cid }} })
        await CandidateChatRoom.destroy({ where: { candidateId: { [Op.in] : cid }} })
        await Chat.destroy({ where: { candidateId: { [Op.in] : cid } } })
        await Meeting.destroy({ where: { candidateId: { [Op.in] : cid } } });
        await MeetUser.destroy({ where: { candidateId: { [Op.in] : cid } } });
        await StatusChange.destroy({ where: { candidateId: { [Op.in] : cid } } });
        await Skill.destroy({ where: { candidateId: { [Op.in] : cid } } });
    
    }

   
}