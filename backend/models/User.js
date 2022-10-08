import Sequelize from "sequelize";
import conn from '../database/dbConnection.js';
import Role from "./Role.js";
import Position from "./Position.js";
import Calendar from "./Calendar.js";
import Candidate from "./Candidate.js";
import crypto from "crypto";
import Meeting from "./Meetings.js";
import Chat from "./Chat.js";
import StatusChange from "./StatusChange.js";


//user model 
const User = conn.define('users', {

    id:{
       // Integer Datatype
       type:Sequelize.INTEGER.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    first_name: { type: Sequelize.STRING, allowNull:false },
    last_name: { type: Sequelize.STRING, allowNull:false },
    email: { type: Sequelize.STRING, allowNull:false, unique:true },
    password: { type: Sequelize.STRING, allowNull:false },
    gender: { type: Sequelize.ENUM("MALE", "FEMALE", "OTHERS"), defaultValue:"MALE" },
    phone_no: { type: Sequelize.DOUBLE.UNSIGNED, allowNull:true },
    city: { type: Sequelize.STRING, allowNull:true },
    country: { type: Sequelize.STRING, allowNull:true },
    img: { type: Sequelize.STRING, allowNull:true },
    company: { type: Sequelize.STRING, allowNull:true },
    position: { type: Sequelize.STRING, allowNull:true },
    isAdmin: { type: Sequelize.BOOLEAN, allowNull:false,defaultValue:false },
    isVendor: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue:false },
    isVendorApplied: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue:false },
    isVendorApproved: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue:false },

 });

 // check table in database
 await User.sync();

// relations
User.hasMany(Candidate);
Candidate.belongsTo(User);

User.belongsToMany(Position, { through: 'position_users' },{
   onDelete:"CASCADE",
   onUpdate:"CASCADE"
});
User.belongsToMany(Role, { through: 'position_users' });

User.hasMany(Calendar);
Calendar.belongsTo(User,{
   onDelete:"CASCADE",
   onUpdate:"CASCADE"
});

Meeting.belongsTo(User,{
   onDelete:"CASCADE",
   onUpdate:"CASCADE"
})
User.belongsToMany(Meeting, { through: 'meeting_users' })
Chat.belongsTo(User)

User.hasMany(StatusChange);
StatusChange.belongsTo(User);

 //create admin account if it doesn't exists
 await User.findOrCreate({
   where : {email:"admin@gmail.com"},
   defaults : {first_name:'admin', last_name:'user',email:"admin@gmail.com",password:crypto.createHash('sha256').update(`litehires-admin`).digest('hex'),isAdmin:1}
   });

await User.findOrCreate({
   where : {email:"test@gmail.com"},
   defaults : {first_name:'test', last_name:'user',email:"test@gmail.com",password:crypto.createHash('sha256').update(`litehires-tester`).digest('hex'),isAdmin:0}
   });

//exports
export default User;