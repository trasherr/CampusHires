import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';


//Position model 
const Tag = conn.define('tags', {

    id:{
       // Integer Datatype
       type:Sequelize.BIGINT.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },

    positionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
    name: { type: Sequelize.STRING, allowNull:false }

 });

 
 // check table in database
 await Tag.sync();

//exports
export default Tag;