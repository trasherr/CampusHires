import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';


//Position model 
const Skill = conn.define('skills', {

    id:{
       // Integer Datatype
       type:Sequelize.BIGINT.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },

    candidateId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    name: { type: Sequelize.STRING, allowNull:false }

 });

 
 // check table in database
 await Skill.sync();

//exports
export default Skill;