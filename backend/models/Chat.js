import Sequelize from 'sequelize';
import conn from '../database/dbConnection.js';

//Position model 
const Chat = conn.define('chats', {

    id:{
       // Integer Datatype
       type:Sequelize.BIGINT.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    positionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    candidateId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    userId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    content :{ type: Sequelize.TEXT, allowNull:false},
    isStatus :{ type: Sequelize.BOOLEAN, defaultValue:false},
    isMedia :{ type: Sequelize.BOOLEAN, defaultValue:false},

 });

 
 // check table in database
 await Chat.sync();

//exports
export default Chat;