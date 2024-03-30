const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fistName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female","other"]
    },
    role:{
        type:String,
        required:true,
        enum:["student","company"]
    }
},{timestamps:true})

module.exports = mongoose.model('User',userSchema);