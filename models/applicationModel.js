const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: objectId,
        ref: 'User', // Reference to the User model (assuming student is a user)
        required: true
    },
    internshipId: {
        type: objectId,
        ref: 'Internship', // Reference to the Internship model
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "rejected", "accepted"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
