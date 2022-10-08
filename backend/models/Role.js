import { Sequelize, Op } from "sequelize";
import conn from '../database/dbConnection.js';
import slugify from "slugify";


//Role model 
const Role = conn.define('roles', {

    id:{
       // Integer Datatype
       type:Sequelize.INTEGER.UNSIGNED,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
 
    name: { type: Sequelize.STRING, allowNull:false, unique:true },
    slug: { type: Sequelize.STRING, allowNull:false }

});

// check table in database
// await Role.destroy({where: {},truncate: true});
await Role.sync();

//Roles
const defaultRoles = [ "MEMBER","EXTERNAL RECRUITER","ADMIN","HIRING MANAGER", "LITEHIRES VENDOR" ]

//create Roles
let i = 1
defaultRoles.forEach(async element =>  {
    try{
        await Role.create({id:i, name:element,slug:slugify(element)});
    }
    catch(er){
        
    }
    i++;
});


//exports
export default Role;