const express = require("express");
const { isUserAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../config/connectionrequest");
const SAFETOSEND = "firstName lastName age about skills photoUrl gender"
const User = require("../config/user");

userRouter.get("/user/requests/received",isUserAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", SAFETOSEND);
        
        
            const formattedData = data.map((d) => ({
                requestId: d._id,
                user: d.fromUserId,
            }));

        res.json({message:"Data Fetched Sucessfully",
            formattedData
        })
    }
    catch(err){
        res.status(400).send("Error fetcing data: "+err.message);
    }
})



userRouter.post("/user/connections",isUserAuth,async(req,res)=>{
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

userRouter.post("/user/feed",isUserAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;


        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select(SAFETOSEND)
        .skip(skip)
        .limit(limit);

        res.json({data:users});


    }
    catch(err){
        res.status(400).send("Error fetching data: "+err.message);
    }
})


module.exports = userRouter;