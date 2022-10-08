import Sequelize from 'sequelize';
import conn from '../database/dbConnection.js';

//Position model 
const CandidateChatRoom = conn.define('candidate_chat_rooms', {

    id:{
       // Integer Datatype
       type:Sequelize.BIGINT.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    room: { type: Sequelize.STRING, allowNull: false, unique: true },
    candidateId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false, unique: true },
    positionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
 });

 
 // check table in database
 await CandidateChatRoom.sync();


//exports
export default CandidateChatRoom;