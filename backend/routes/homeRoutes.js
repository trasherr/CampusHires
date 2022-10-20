import express  from "express";

import  { getCandidateChat, sendCandidateChat, trends } from "../controllers/HomeController.js";

const homeRoute = express.Router();

homeRoute.get('/trends', trends );
homeRoute.post('/getCandidateChat', getCandidateChat );
homeRoute.post('/sendCandidateChat', sendCandidateChat );


export default homeRoute;