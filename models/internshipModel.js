const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const internshipSchema = new mongoose.Schema({
    companyId: {
        type: objectId,
        ref: 'Company'
    },
    category:{
        type:String,
        required:true
    },
    position: {
        type: String,
        required: true
    },
    internshipType: {
        type: String,
        enum: ["remote", "wfh", "wfo"],
        default: "wfo"
    },
    skillsRequired: {
        type: String, 
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    location: {
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true       
        }
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    numberOfOpenings: {
        type: Number,
        required: true
    },
    stipend: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "closed"],
        default: "active"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);