const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.objectId;
const internshipSchema = new mongoose.Schema({
    companyId:{
        type:objectId,
        ref:'Company',
        required:true
    },
    internshipTitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    requirements:{
        type:String,
        required:true
    },
    duration:{
        type:Date,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    applicationDeadline:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["active","closed","filled"],
        default:"active"
    }
},{
    timestamps:true
})

module.exports= mongoose.model('Internship',internshipSchema);