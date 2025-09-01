const express = require("express");
const requestRouter = express.Router();
const {isUserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../config/connectionrequest");


requestRouter.post("/request/:status/:toUserId",isUserAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const ALLOWED_STATUS = ["ignored","interested"];
        if(!ALLOWED_STATUS.includes(status)){
            return res.send("Invalid Status Type");
        }

        const isAlreadyExist = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                { fromUserId:toUserId,toUserId:fromUserId }
            ],
        })
        if(isAlreadyExist){
            return res.status(400).send("Connection Request Already Exist");
        }

        const newRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        await newRequest.save();
        res.send("New Connection Request Added Scucessfully");

    }
    catch(err){
        res.status(400).send("Error Updating the Data: "+err.message);
    }


})


requestRouter.post("/request/review/:status/:requestId",isUserAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user._id;
        const status = req.params.status;
        const requestId = req.params.requestId;

        const ALLOWED_UPDATES = ["accepted","rejected"];
        if(!ALLOWED_UPDATES.includes(status)){
             return res.status(400).send("Invalid status Type");
        }

        const requestDoc = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser,
            status:"interested"
        })
        if(!requestDoc){
            return res.status(400).send("Invalid Request Data");
        }

        requestDoc.status = status;
        const data = await requestDoc.save();

        res.json({
            message: status+" Request Processed Sucessfully",data});


    }
    catch(err){
        res.status(400).send("Error Updating the Request: "+err);
    }
})


module.exports = requestRouter;







