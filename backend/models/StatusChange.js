import { Sequelize } from "sequelize";
import conn from '../database/dbConnection.js';

//PositionsUser model 
const StatusChange = conn.define('status_changes', 
    {

        id:{
        // Integer Datatype
        type:Sequelize.BIGINT.UNSIGNED,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
        },
    
        userId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
        candidateId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
        prvStatus: { type: Sequelize.STRING, allowNull:false, defaultValue:'APPLIED' },
        newStatus: { type: Sequelize.STRING, allowNull:false, defaultValue:'APPLIED' },

    },
);

 await StatusChange.sync()
 // check table in database

//exports
export default StatusChange;