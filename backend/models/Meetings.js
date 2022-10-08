import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';

//Meet model 
const Meeting = conn.define('meetings', {

    id:{
       // Integer Datatype
       type:Sequelize.BIGINT.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    room: { type: Sequelize.STRING, allowNull:false, unique:true },
    name: { type: Sequelize.STRING, allowNull: false },
    type: { type: Sequelize.ENUM("ONLINE","PHONE","F2F"), defaultValue: "ONLINE", allowNull:false },
    value: { type: Sequelize.STRING, allowNull:true },
    userId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    start: { type: Sequelize.DATE, allowNull:false },
    end: { type: Sequelize.DATE, allowNull:false },
    response: {  type: Sequelize.ENUM("","NO SHOW","DONE","PANEL NOT AVAILABLE","OTHER" ), defaultValue:null },
    candidateId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:true },//  as of now

 });
 
 await Meeting.sync();
//exports
export default Meeting;