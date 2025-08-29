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

connectDB().
then(()=>{
    console.log("Database Connected Sucesssfully");
    app.listen(7777, () => {
    console.log("Server is listening from port 7777");
    });
});

