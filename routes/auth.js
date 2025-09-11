const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User=require("../config/user");
const jwt=require("jsonwebtoken");


authRouter.post("/signup",async(req,res)=>{
    try{

    validateSignUpData(req);

    const hashedPassword = await bcrypt.hash(req.body.password,10);
    req.body.password = hashedPassword;
    const user = new User((req.body));
    
        const signedUser=await user.save();
        const token = await user.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now()+8*60*60*1000)});
        
        res.send(signedUser);
    }
    catch(err){
        res.status(400).send("Error saving the user: "+err);
    }
})


authRouter.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Email does not exist");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now()+8*60*60*1000)});
            res.send(user);
        }
        else res.status(400).send("Invalid Credentials");
    }
    catch(err){
        res.status(400).send("Something Went Wrong: "+err);
    }
})

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{ expires:new Date(Date.now()),
     })
    res.send("Logout Sucessfull");
})

module.exports = authRouter;