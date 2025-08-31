const jwt = require("jsonwebtoken");
const User = require("../config/user");
const isUserAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        const decodedData = await jwt.verify(token,"PRAVEEN@219");
        const {_id} = decodedData;
        const user = await User.findOne({_id:_id});
        if(!user){
            throw new Error("Invalid User");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(400).send("Something went Wrong: "+err);
    }
}

module.exports = {
    
    isUserAuth,
}