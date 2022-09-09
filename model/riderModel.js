const mongoose = require('mongoose')
const riderModel = new mongoose.Schema({
        Name:{
            type:String,
            Required:true
        },
        MobNumber:{
            type:Number,
            required:true,
            unique:true
        },
        Password:{
            type:String,
            required:true
        }
})





const user = mongoose.model("riderModel", riderModel)
module.exports = user


//Create Rider
    //Name
    //Mobile Number
    //Password
//Login Rider
//update Rider
