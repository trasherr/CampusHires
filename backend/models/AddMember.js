import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';
import Role from '../models/Role.js';
import Position from '../models/Position.js';


//AddMember model 
const AddMember = conn.define('add_member', {

    id:{
       // Integer Datatype
       type:Sequelize.BIGINT.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
    
    code: { type: Sequelize.STRING, allowNull:false, unique:true },
    email: { type: Sequelize.STRING, allowNull:false },
    positionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false},
    roleId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false},

   },
   {
      indexes:[{
         unique:true,
         fields: ['email', 'positionId'],
      }
   ]}
 );
 
 // check table in database
 await AddMember.sync();

AddMember.belongsTo(Role);
AddMember.belongsTo(Position)


//exports
export default AddMember;