const express = require("express");
const app=express();

app.use("/hello",(req,res)=>{
    res.send("Hello fom hello");
})
app.use("/test",(req,res)=>{
    res.send("Hello from test");
})
app.use("/",(req,res)=>{
    res.send("Hello Default");
})
app.listen(7777,()=>{
    console.log("Server is listening from port 7777");
})