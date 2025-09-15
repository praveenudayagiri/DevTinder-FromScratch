const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("../config/database");
const User=require("../config/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {isUserAuth} = require("../middlewares/auth");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("../utils/sockets");
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const requestRouter = require("../routes/request");
const userRouter = require("../routes/user");
const chatRouter = require("../routes/chat");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);


connectDB().
then(()=>{
    console.log("Database Connected Sucesssfully");
    server.listen(7777, () => {
    console.log("Server is listening from port 7777");
    });
});

