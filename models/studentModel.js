const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    DOB: {
        type: Date
    },
    collegeName: {
        type: String
    },
    yearOfPassout: {
        type: Number
    },
    areaOfInterest: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema);