const { default: mongoose,Schema } = require("mongoose");

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
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:String,
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

module.exports = mongoose.model("User",userSchema);