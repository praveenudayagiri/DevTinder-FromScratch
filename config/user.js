const { default: mongoose,Schema } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not valid Email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Not Strong Password");
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data invalid");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://i.pinimg.com/736x/d6/36/d5/d636d53048eccf75fed71e3add231b94.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not valid photo URL");
            }
        }
    },
    about:{
        type:String,
        default:"This is default description",
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true,
});

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},process.env.ADMIN_SECRET_KEY,{ expiresIn:"7d" });
    return token;
}


module.exports = mongoose.model("User",userSchema);