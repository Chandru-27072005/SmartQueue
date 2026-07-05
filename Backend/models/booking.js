const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    slot:{
        type:String,
        required:true
    },
    notes:{
        type:String,
        default:""
    },
    token:{
        type:String,
        required:true,
        unique:true
    },
    status:{
    type:String,
    enum:["Waiting","Serving","Completed","Cancelled"],
    default:"Waiting"
}
  

},
{
    timestamps:true
}
);

module.exports = mongoose.model("Booking", bookingSchema);