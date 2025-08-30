const express = require("express");
const app = express();
const connectDB = require("../config/database");
const User=require("../config/user");


app.use(express.json());



app.post("/signup",async(req,res)=>{
    
    const user = new User((req.body));
    try{
        await user.save();
        res.send("User added Sucessfully");
    }
    catch(err){
        res.status(400).send("Error saving the user");
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

app.patch("/user",async(req,res)=>{
    const userId = req.body._id;
    const data = req.body;
    try{
        await User.findByIdAndUpdate({_id:userId},data);
        res.send("User Details Updated Sucessfully");
    }
    catch(err){
        res.status(404).send("Error while updating user details");
    }
})

connectDB().
then(()=>{
    console.log("Database Connected Sucesssfully");
    app.listen(7777, () => {
    console.log("Server is listening from port 7777");
    });
});

