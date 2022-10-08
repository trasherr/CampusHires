// npm imports
import express  from "express";

//custom imports
import  { addMember, rmMember,joinMember, positions, position, recentEvents ,positionUsers, profile, roles, update, addCandidate, getCandidates, getAllCandidates, updateCandidateStatus, updateCandidatePriority, getEvents, getChat, sendChat, dashboard, interview, positionStatusChange, changePassword, meetings ,updateCandidateDetails , getCandidate, rmPosition, rmCandidate, getInvites, resendInvite, positionVisibilityChange, getUsers, approveVendor, refreshVendors, approvePosition, getPositionData, getUserProfile, updateUser, deleteUser} from "../controllers/AdminController.js";

//route initialization
const adminRoute = express.Router();


//route definition and controller function assignment
adminRoute.post('/profile',profile );
adminRoute.post('/getUserProfile',getUserProfile );
adminRoute.post('/updateUser',updateUser);
adminRoute.post('/update',update );
adminRoute.post('/changePassword',changePassword );
adminRoute.post('/dashboard',dashboard );
adminRoute.post('/positions',positions );
adminRoute.post('/position',position );
adminRoute.post('/roles',roles );
// adminRoute.post('/newPosition', newPosition);
adminRoute.post('/rmPosition',rmPosition);
adminRoute.post('/rmCandidate',rmCandidate);
adminRoute.post('/positionUsers', positionUsers);
adminRoute.post('/addMember', addMember);
adminRoute.post('/meetings', meetings);
// adminRoute.post('/interview', interview);
adminRoute.post('/joinMember', joinMember);
adminRoute.post('/rmMember', rmMember);
adminRoute.post('/addCandidate', addCandidate);
adminRoute.post('/getCandidates', getCandidates);
adminRoute.post('/getCandidate', getCandidate);
adminRoute.post('/getAllCandidates', getAllCandidates);
adminRoute.post('/updateCandidateStatus', updateCandidateStatus);
adminRoute.post('/updateCandidatePriority', updateCandidatePriority);
adminRoute.post('/calendar', getEvents);
adminRoute.post('/recentEvents', recentEvents);
adminRoute.post('/getChat', getChat);
adminRoute.post('/sendChat', sendChat);
adminRoute.post('/positionStatusChange', positionStatusChange);
adminRoute.post('/updateCandidateDetails', updateCandidateDetails);
adminRoute.post('/getInvites',getInvites);
adminRoute.post('/resendInvite',resendInvite);
adminRoute.post('/positionVisibilityChange',positionVisibilityChange);
adminRoute.post('/getUsers',getUsers);
adminRoute.post('/approveVendor',approveVendor);
adminRoute.post('/refreshVendors',refreshVendors);
adminRoute.post('/approvePosition',approvePosition);
adminRoute.post('/getPositionData',getPositionData);
adminRoute.post('/deleteUser',deleteUser);


export default adminRoute;
