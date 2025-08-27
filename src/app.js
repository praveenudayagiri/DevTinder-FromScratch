const express = require("express");
const app=express();

app.get("/user",(req,res)=>{
    res.send({firstName:"Praveen",lastName:"Udayagiri"});
})
app.post("/user",(req,res)=>{
    //logic for saving user data into Database
    res.send("User added to DB sucessfully");
})
app.use("/",(req,res)=>{
    res.send("Hello Default");
})
app.listen(7777,()=>{
    console.log("Server is listening from port 7777");
})