const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
    },

    aboutCompany:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },
     contactEmail:{
        type:String,
        required:true,
        unique:true
     }

},{timestamps:true})

module.exports = mongoose.model('Company', companySchema);