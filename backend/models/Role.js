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

defaultRoles.forEach(async element =>  {
    console.log(element);
    try{
        await Role.create({id: defaultRoles.indexOf(element)+1, name:element,slug:slugify(element)});
    }
    catch(er){
        
    }
});


//exports
export default Role;