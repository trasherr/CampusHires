import { Sequelize } from "sequelize";
import conn from '../database/dbConnection.js';
import Position from "./Position.js";
import Role from "./Role.js";
import User from "./User.js";

//PositionsUser model 
const PositionUser = conn.define('position_user', 
    {

        id:{
        // Integer Datatype
        type:Sequelize.BIGINT.UNSIGNED,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
        },
    
        userId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
        positionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull:false },
        roleId:{type: Sequelize.INTEGER.UNSIGNED, allowNull:false}

    },
    {
        indexes:[
            {
                unique:true,
                fields:['positionId','userId']
            }
        ]
    }
);
 
 await PositionUser.sync()
 // check table in database
 PositionUser.belongsTo(Role,{
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
 })
 Role.hasMany(PositionUser)

 PositionUser.belongsTo(User,{
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
 })
 User.hasMany(PositionUser)

 PositionUser.belongsTo(Position,{
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
 })
 Position.hasMany(PositionUser)

//exports
export default PositionUser;