const express = require("express");
const app=express();
const {isAdminAuth,isUserinAuth} = require("../middlewares/auth");


app.post("/user/login",(req,res)=>{
    res.send("Login Sucessfull");
})
app.use("/admin",isAdminAuth);
app.use("/user/getdata",isUserinAuth,(req,res)=>{
    res.send("Got User Data");
});
app.get("/admin/getData",(req,res)=>{
    res.send("Got Admin Data ");
})
app.post("/admin/postdata",(req,res)=>{
    res.send("Posted Admin Data");
})
app.use("/",(req,res)=>{
    res.send("Hello Default");
})
app.listen(7777,()=>{
    console.log("Server is listening from port 7777");
})