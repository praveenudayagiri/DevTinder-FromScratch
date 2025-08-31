const express = require("express");
const requestRouter = express.Router();
const {isUserAuth} = require("../middlewares/auth");

requestRouter.post("/sendrequest",isUserAuth,(req,res)=>{
    res.send("Connection Send Sucessfull");
})


module.exports = requestRouter;







