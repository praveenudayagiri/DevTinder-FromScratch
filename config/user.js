const { default: mongoose,Schema } = require("mongoose");

const userSchema = new Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:String,
    },
    gender:{
        type:String,
    }
});

module.exports = mongoose.model("User",userSchema);