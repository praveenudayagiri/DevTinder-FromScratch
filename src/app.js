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


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);




connectDB().
then(()=>{
    console.log("Database Connected Sucesssfully");
    app.listen(7777, () => {
    console.log("Server is listening from port 7777");
    });
});

