import sequelize from 'sequelize';
import  dotenv from 'dotenv';
dotenv.config()

const conn = new sequelize(
   process.env.DB_NAME,
   process.env.DB_USER, 
   process.env.DB_PASS,
    {
        dialect : process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }

);

export default conn;