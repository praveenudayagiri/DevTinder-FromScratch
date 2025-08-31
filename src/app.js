const express = require("express");
const app = express();
const connectDB = require("../config/database");
const User=require("../config/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());



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
        const isPasswordValid = bcrypt.compare(password,user.password);
        if(isPasswordValid){
            res.send("Login Sucessfull");
        }
        else res.status(400).send("Invalid Credentials");
    }
    catch(err){
        res.status(400).send("Something Went Wrong: "+err);
    }
})

app.get("/user",async(req,res)=>{
    const userEmail = req.body.email;
    try{
        const user = await User.find({email:userEmail});
        res.send(user);
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
})

app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("Error Fetching Users");
    }
})

app.delete("/user",async(req,res)=>{
    const userId = req.body._id;
    try{
        await User.deleteOne({_id:userId});
        res.send("User deleted Sucessfully");
    }
    catch(err){
        res.send(404).send("Error to delete user in Database");
    }
})

app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=> 
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        await User.findByIdAndUpdate({_id:userId},data,{
            runValidators:true,
        });
        res.send("User Details Updated Sucessfully");
    }
    catch(err){
        res.status(404).send("Error while updating user details: "+err);
    }
})

connectDB().
then(()=>{
    console.log("Database Connected Sucesssfully");
    app.listen(7777, () => {
    console.log("Server is listening from port 7777");
    });
});

