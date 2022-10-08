import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';

//user model 
const Calendar = conn.define('calendars', {

    id:{
       // Integer Datatype
       type:Sequelize.BIGINT.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    name: { type: Sequelize.STRING, allowNull:false },
    userId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    des: { type: Sequelize.STRING, allowNull:false },
    start: { type: Sequelize.DATE, allowNull:false },
    end: { type: Sequelize.DATE, allowNull:false },

 });
 

 await Calendar.sync();


//exports
export default Calendar;