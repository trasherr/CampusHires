import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';
import Candidate from "./Candidate.js";
import CandidateChat from "./CandidateChat.js";
import Tag from "./Tag.js";


//Position model 
const Position = conn.define('positions', {

    id:{
       // Integer Datatype
       type:Sequelize.INTEGER.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    status: { type: Sequelize.ENUM("HOLD", "ACTIVE", "INACTIVE"), allowNull:false, defaultValue:"ACTIVE" },
    name: { type: Sequelize.STRING, allowNull:false },
    department: { type: Sequelize.STRING, allowNull:true },
    company: { type: Sequelize.STRING, allowNull:false },
    location: { type: Sequelize.STRING, allowNull:true },
    minExp: { type: Sequelize.DOUBLE.UNSIGNED, defaultValue:0 },
    maxExp: { type: Sequelize.DOUBLE.UNSIGNED, defaultValue:0 },
    minCTC: { type: Sequelize.DOUBLE.UNSIGNED, defaultValue:0 },
    maxCTC: { type: Sequelize.DOUBLE.UNSIGNED, defaultValue:0 },
    other: { type: Sequelize.STRING, allowNull:true },

    slug: { type: Sequelize.STRING, allowNull:false },
    img: { type: Sequelize.STRING, allowNull:true },
    isTest: { type: Sequelize.BOOLEAN, defaultValue:false },
    isPublic: { type: Sequelize.BOOLEAN, defaultValue:false },
    isPublicApplied: { type: Sequelize.BOOLEAN, defaultValue:false },
    isOfferInHand: { type: Sequelize.BOOLEAN, defaultValue:false },
    isNewCompany: { type: Sequelize.BOOLEAN, defaultValue:false },
    isNewOffer: { type: Sequelize.BOOLEAN, defaultValue:false },

 });

 
 // check table in database
 await Position.sync();

 //candidate relation
Position.hasMany(Candidate);
Candidate.belongsTo(Position,{
   onDelete:"CASCADE",
   onUpdate:"CASCADE"
})

CandidateChat.belongsTo(Position,{
   onDelete:"CASCADE",
   onUpdate:"CASCADE"
})
Position.hasMany(CandidateChat)

Position.hasMany(Tag);
Tag.belongsTo(Position,{
   onDelete:"CASCADE",
   onUpdate:"CASCADE"
})

//exports
export default Position;