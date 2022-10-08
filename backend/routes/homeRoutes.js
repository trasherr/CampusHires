import express  from "express";

import  { getCandidateChat, sendCandidateChat } from "../controllers/HomeController.js";

const homeRoute = express.Router();

homeRoute.post('/getCandidateChat', getCandidateChat );
homeRoute.post('/sendCandidateChat', sendCandidateChat );


export default homeRoute;