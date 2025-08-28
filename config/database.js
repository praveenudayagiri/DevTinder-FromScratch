const {  mongoose } = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://praveenudayagiri724:PRAVEEN@cluster0.lvusg.mongodb.net/DevTinder"
    );
};

module.exports = connectDB;