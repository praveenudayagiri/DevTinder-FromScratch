const validator = require("validator");
const validateSignUpData = (req)=>{
    const {firstName, lastName,email,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    if(!validator.isEmail(email)){
        throw new Error("Enter valid email");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password");
    }
}

const validateEditProfileDate = (req)=>{
    const UPDATE_ALLOWED = ["firstName","lastName","age","skills","about","photoUrl","gender"];
    const isSafeToUpdate = Object.keys(req.body).every((key)=> UPDATE_ALLOWED.includes(key) );
    return isSafeToUpdate;
}

module.exports = {
    validateSignUpData,
    validateEditProfileDate,
}