//const express = require('express');
import express from 'express';
import cookieParser from "cookie-parser";
import { ENV} from "./lib/env.js";
import path from 'path';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cors from "cors";
//dotenv.config();//For loading the .env file

const app = express();

const _dirname = path.resolve();

//console.log(process.env.PORT);//For ACCESSING THE .ENV FILE

const PORT = ENV.PORT || 3000;

// Add these lines BEFORE your routes
app.use(express.json({ limit: "10mb" })); 
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));//Allow cross-origin requests from the frontend URL and include credentials (cookies) in the requests
app.use(cookieParser());//Parse cookies from incoming requests and populate req.cookies with an object containing the cookie values

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//make ready for deployment
if(ENV.NODE_ENV == "production"){
    app.use(express.static(path.join(_dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"));
    })
}
////////////////////////
app.listen(PORT,() => {
    console.log('Server running on port : ' + PORT);
    connectDB();
});