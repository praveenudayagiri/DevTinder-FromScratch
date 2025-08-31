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

module.exports = {
    validateSignUpData,
}