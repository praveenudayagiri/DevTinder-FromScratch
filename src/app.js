const express = require("express");
const app = express();
const connectDB = require("../config/database");
const User=require("../config/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {isUserAuth} = require("../middlewares/auth");


app.use(express.json());
app.use(cookieParser());


app.post("/signup",async(req,res)=>{
    try{

    validateSignUpData(req);

    const hashedPassword = await bcrypt.hash(req.body.password,10);
    req.body.password = hashedPassword;
    const user = new User((req.body));
    
        await user.save();
        
        res.send("User added Sucessfully");
    }
    catch(err){
        res.status(400).send("Error saving the user: "+err);
    }
})

app.get("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Email does not exist");
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            const token = await jwt.sign({_id:user._id},"PRAVEEN@219",{ expiresIn:"7d" });
            res.cookie("token",token,{expires:new Date(Date.now()+8*60*60*1000)});
            res.send("Login Sucessfull");
        }
        else res.status(400).send("Invalid Credentials");
    }
    catch(err){
        res.status(400).send("Something Went Wrong: "+err);
    }
})


app.get("/profile",isUserAuth,async(req,res)=>{
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

connectDB().
then(()=>{
    console.log("Database Connected Sucesssfully");
    app.listen(7777, () => {
    console.log("Server is listening from port 7777");
    });
});

