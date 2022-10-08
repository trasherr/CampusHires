import Sequelize, { ENUM } from "sequelize";
import conn from '../database/dbConnection.js';
import CandidateChat from "./CandidateChat.js";
import Chat from "./Chat.js";
import Skill from "./Skill.js";
import StatusChange from "./StatusChange.js";

//Position model 
const Candidate = conn.define('candidates', {

    id:{
       // Integer Datatype
       type:Sequelize.INTEGER.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    positionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    userId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    priority: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false, defaultValue:0 },
    status: { type: Sequelize.STRING, allowNull:false, defaultValue:'APPLIED' },
    gender: { type: Sequelize.ENUM("MALE", "FEMALE", "OTHERS"), defaultValue:"MALE" },
    first_name: { type: Sequelize.STRING, allowNull:false },
    last_name: { type: Sequelize.STRING, allowNull:false },
    email: { type: Sequelize.STRING, allowNull:false },
    phone_no: { type: Sequelize.DOUBLE.UNSIGNED, allowNull:false },
    newPosition: { type: Sequelize.STRING, allowNull:true },

    skill: { type: Sequelize.STRING, allowNull:false },
    currentCtc: { type: Sequelize.FLOAT.UNSIGNED, allowNull:false },
    expectedCtc: { type: Sequelize.FLOAT.UNSIGNED, allowNull:false },

    location: { type: Sequelize.STRING, allowNull:false },
    rtc: { type: Sequelize.BOOLEAN, defaultValue:false},

    experience: { type: Sequelize.FLOAT.UNSIGNED, allowNull:false },
    notice: { type: Sequelize.BOOLEAN, defaultValue:false },
    unemployed: { type: Sequelize.BOOLEAN, defaultValue:false },
    lastDay: { type: Sequelize.DATEONLY, allowNull:true },
    currentCompany: { type: Sequelize.STRING, allowNull:true },

    offerInHand: { type: Sequelize.BOOLEAN, defaultValue:false},
    newCompany: { type: Sequelize.STRING, allowNull:true },
    newOffer: { type: Sequelize.FLOAT.UNSIGNED, allowNull:true },

    
    img: { type: Sequelize.STRING, allowNull:true },
    resume: { type: Sequelize.STRING, allowNull:true },
 });
 
 // check table in database
 await Candidate.sync();

 
Candidate.hasMany(Chat);
Chat.belongsTo(Candidate);

Candidate.hasMany(CandidateChat);
CandidateChat.belongsTo(Candidate);

Candidate.hasMany(Skill);
Skill.belongsTo(Candidate);

Candidate.hasMany(StatusChange);
StatusChange.belongsTo(Candidate);

//exports
export default Candidate;