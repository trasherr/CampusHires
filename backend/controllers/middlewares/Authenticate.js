import express from 'express';
import jwt from "jsonwebtoken";
import querystring from 'querystring';

const app = express()

 const authenticateJWT = app.use((req, res, next) => {
  console.log(req.body)
  try{
    let jtwToken = jwt.verify(req.body.access_token,"access_token")
    if( jtwToken.id == req.body.id){
      next()
      return;
    }
  }
  catch(e){
    res.status(419)
    res.send({message: "Authentication Failed"})
  }
  
})

export default authenticateJWT;