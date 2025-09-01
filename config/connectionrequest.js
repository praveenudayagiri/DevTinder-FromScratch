const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status: {
        type: String,
    validate(value) {
    if (!["ignored", "interested", "accepted", "rejected"].includes(value)) {
      throw new Error("Status data invalid");
    }
  },
  required: true
    },


},{
    timestamps:true
})


connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can't send Connection request to your self");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema);