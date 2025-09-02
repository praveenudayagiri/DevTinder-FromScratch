const express = require("express");
const { isUserAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../config/connectionrequest");
const SAFETOSEND = "firstName lastName age about skills photoUrl gender"
userRouter.get("/user/requests/received",isUserAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", SAFETOSEND);
        
        
        const formattedData = data.map(d => d.fromUserId); 

        res.json({message:"Data Fetched Sucessfully",
            formattedData
        })
    }
    catch(err){
        res.status(400).send("Error fetcing data: "+err.message);
    }
})



userRouter.get("/user/connections",isUserAuth,async(req,res)=>{
    try{
            const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id, status:"accepted"},
            {toUserId:loggedInUser._id, status:"accepted"}
        ]
    }).populate("fromUserId",SAFETOSEND)
    .populate("toUserId",SAFETOSEND);


    const data = connectionRequests.map((row)=>{
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
        }
        else{
            return row.fromUserId;
        }
    });


    res.json({data});
    }
    catch(err){
        res.status(400).send("Error fetching connections data: "+err.message);
    }
})

module.exports = userRouter;