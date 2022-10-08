import { Sequelize } from "sequelize";
import conn from '../database/dbConnection.js';

//PositionsUser model 
const MeetUser = conn.define('meeting_user', 
    {

        id:{
        // Integer Datatype
        type:Sequelize.BIGINT.UNSIGNED,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
        },
    
        userId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
        meetingId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false }

    },
    {
        indexes:[
            {
                unique:true,
                fields:['meetingId','userId']
            }
        ]
    }
);

 await MeetUser.sync()
 // check table in database

//exports
export default MeetUser;