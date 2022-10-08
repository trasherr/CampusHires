// npm pacakages =================================
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import csurf from 'csurf';
// import cookie from 'cookie-parser';
// import session from 'express-session';
import  dotenv from 'dotenv';
//================================================
dotenv.config()

// custom imports ========================================
import homeRoute from './routes/HomeRoutes.js';
import authRoute from './routes/AuthRoutes.js';
import userRoute from './routes/UserRoutes.js';
import adminRoute from './routes/AdminRoutes.js';
import uploadRoute from './routes/UploadRoutes.js';
import authenticateJWT from './controllers/middlewares/Authenticate.js';
//========================================================


//initialize express ====================================
const PORT = process.env.PORT || 5000;
let app = express();

//=======================================================

//set approot ===========================================
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import Candidate from './models/Candidate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.appRoot = path.resolve(__dirname);

//========================================================

// setting up cookie, session and csrf ==================
// app.use(cookie())
// app.set('trust proxy', 1) // trust first proxy((for session))
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))
//========================================================
//enable in production
// app.use(csurf({cookie:true}));

//json limit and parsers ==================================
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());
app.options('*', cors());

//===========================================================


// Function to serve all static files
// inside public directory. =================================
app.use(express.static('public')); 
app.use('/images', express.static('images'));
app.use('/resume', express.static('resume'));
app.use('/files', express.static('files'));
//===========================================================

// custom routes ============================================
app.use('/home',homeRoute);
app.use('/auth',authRoute);
app.use('/upload',uploadRoute);
app.use('/user',authenticateJWT,userRoute);
app.use("/admin",authenticateJWT,adminRoute);

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname,'/public/index.html'));
});
//===========================================================


import { createServer } from 'http';
import { Server } from "socket.io";
const httpServer = createServer(app);
const io = new Server(httpServer,{ cors: { origin: '*' } });

httpServer.listen(PORT,() => {
  console.log("Running at port::"+PORT)
});

export default io;