const express = require("express");
const profileRouter = express.Router();
const {isUserAuth} = require("../middlewares/auth");
const User=require("../config/user");
const {validateEditProfileDate} = require("../utils/validation");



profileRouter.post("/profile/view",isUserAuth,async(req,res)=>{
    try{
        const user = req.user;
        if(!user){
            throw new Error("User does not exist");
        }
        else res.send(user);
    }
    catch(err){
        res.send(err.message);
    }
})

profileRouter.patch("/profile/edit",isUserAuth,async(req,res)=>{
    try{
        if(!validateEditProfileDate(req)){
            res.send("Edit request Denied");
        }
        else{
            const updatedUser = await User.findByIdAndUpdate(req.user._id,req.body,
                {new:true, runValidators:true });

                res.status(200).json({
                    message: "Profile updated successfully",
                    user: updatedUser,
                });
        }
    }
    catch(err){
        res.status(400).send("Something went Wrong: "+err);
    }
     
})

module.exports = profileRouter;