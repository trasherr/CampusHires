// npm imports
import express  from "express";

//custom imports
import  { addMember, joinMember, newPosition, positions, positionUsers, profile, roles, update, addCandidate, getCandidates, getAllCandidates, updateCandidateStatus, updateCandidatePriority, getEvents, getChat, sendChat, dashboard, recentEvents, position, rmMember, interview, positionStatusChange, changePassword, meetings, updateCandidateDetails,getCandidate, updatePostion, rmPosition, rmCandidate, getInvites, resendInvite, enrolVendor, positionVisibilityChange, meetingNoResponse, meetingResponse, getPositionData,sendChatUpdateEmail, sendCandidateChat, getCandidateChat, getRoom, trends, trendsData } from "../controllers/UserController.js";

//route initialization
const userRoute = express.Router();


//route definition and controller function assignment
userRoute.post('/profile',profile );
userRoute.post('/update',update );
userRoute.post('/changePassword',changePassword );
userRoute.post('/dashboard',dashboard );
userRoute.post('/positions',positions );
userRoute.post('/position',position );
userRoute.post('/rmPosition',rmPosition );
userRoute.post('/rmCandidate',rmCandidate );
userRoute.post('/roles',roles );
userRoute.post('/meetings',meetings );
userRoute.post('/newPosition', newPosition);
userRoute.post('/positionUsers', positionUsers);
userRoute.post('/addMember', addMember);
userRoute.post('/interview', interview);
userRoute.post('/rmMember', rmMember);
userRoute.post('/joinMember', joinMember);
userRoute.post('/addCandidate', addCandidate);
userRoute.post('/getCandidates', getCandidates);
userRoute.post('/getCandidate', getCandidate);
userRoute.post('/getAllCandidates', getAllCandidates);
userRoute.post('/updateCandidateStatus', updateCandidateStatus);
userRoute.post('/updateCandidatePriority', updateCandidatePriority);
userRoute.post('/calendar', getEvents);
userRoute.post('/recentEvents', recentEvents);
userRoute.post('/getChat', getChat);
userRoute.post('/getRoom', getRoom);
userRoute.post('/getCandidateChat', getCandidateChat);
userRoute.post('/sendCandidateChat', sendCandidateChat);
userRoute.post('/sendChat', sendChat);
userRoute.post('/positionStatusChange', positionStatusChange);
userRoute.post('/updateCandidateDetails', updateCandidateDetails);
userRoute.post('/updatePostion', updatePostion);
userRoute.post('/getInvites',getInvites);
userRoute.post('/resendInvite',resendInvite);
userRoute.post('/enrolVendor',enrolVendor);
userRoute.post('/positionVisibilityChange',positionVisibilityChange);
userRoute.post('/meetingNoResponse',meetingNoResponse);
userRoute.post('/meetingResponse',meetingResponse);
userRoute.post('/getPositionData',getPositionData);
userRoute.post('/sendChatUpdateEmail',sendChatUpdateEmail)
userRoute.post('/trends', trends)
userRoute.post('/trendsData', trendsData)


export default userRoute;
