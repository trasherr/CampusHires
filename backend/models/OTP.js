import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';


//user model 
const OTP = conn.define('otp', {

    id:{
       // Integer Datatype
       type:Sequelize.INTEGER.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    otp: { type: Sequelize.BIGINT(11).UNSIGNED, allowNull:false },
    email: { type: Sequelize.STRING, allowNull:false },

 });
 
 // check table in database
 await OTP.sync();

//exports
export default OTP;