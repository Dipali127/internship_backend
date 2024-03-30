const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const applicationSchema = new mongoose.Schema({
    studentId:{
        type:objectId,
        ref:'User',
        required:true
    },
    internshipId:{
        type:objectId,
        ref:'Internship',
        required:true
    },
    resume:{
        type:String
    },
    status:{
        type:String,
        enum:["pending","rejected","accepted"],
        default:"pending"
    }
},{timestamps:true});

module.exports = mongoose.model('Application',applicationSchema);