const express = require("express");
const profileRouter = express.Router();
const {isUserAuth} = require("../middlewares/auth");
const User=require("../config/user");




profileRouter.get("/profile",isUserAuth,async(req,res)=>{
    try{
        const user = req.user;
        if(!user){
            throw new Error("User does not exist");
        }
        else res.send(user);
    }
    catch(err){
        res.send("Something went Wrong "+err);
    }
})



module.exports = profileRouter;