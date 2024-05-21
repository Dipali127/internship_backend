const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
    },
     companyEmail:{
        type:String,
        required:true,
        unique:true
    },
     password:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true,
        unique:true
     }

},{timestamps:true})

module.exports = mongoose.model('Company', companySchema);