const express = require("express");
const app=express();

app.get("/user/getdata",(req,res)=>{
    try{
        throw new Error("Praveen");
        res.send("Got user data");
    }
    catch(err){
        res.send("Something Went Wrong");
    }
})

app.use((err,req,res,next)=>{
    if(err){
        res.send("Something Went Wrong");
    }
    else res.send("Hello Default");
})
app.listen(7777,()=>{
    console.log("Server is listening from port 7777");
})