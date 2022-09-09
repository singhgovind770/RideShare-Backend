const mongoose = require('mongoose')

const rideModel = new mongoose.Schema({
    Origin:{
        type:String,
        required:true
    },
    Destination:{
        type:String,
        required:true
    },
    Fare:{
        type:Number,
        requied:true
    },
    Customer_id:{
        type:String,
        required:true
    },
    Driver_id :{
        type:String,
        required:true
    },
    Status:{
        type:String,
        required:true
    }
})

const ride = mongoose.model("rideModel", rideModel)
module.exports = ride




//Rider Model
    // Origin
    // Destination
    // Fare
    // Customer_id
    // Driver_id


    //CUSTOMER_REQUEST
    //find in database
    //emit a event to driver
    //emit a event to customer
