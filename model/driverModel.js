const mongoose = require("mongoose");
const DriverSchema = new mongoose.Schema({
    Active: {
      type: Boolean,
      default:false,
    },
    Occupied: {
        type: Boolean,
        default:false,
    },
    OnRequest:{
      type: Boolean,
      default:false,
    },
    Location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    
    Name:{
        type:String,
        required: true
    },
    MobNumber:{
        type:Number,
        required:true,
        unique:true
    },
    Vehicle_info:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    Password:{
      type : String, 
      required : true
    }
  });

  DriverSchema.index({ Location: "2dsphere" });

  const User = mongoose.model("User", DriverSchema);
  module.exports = User;
  
