const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: objectId,
        ref: 'Student',
        required: true
    },
    internshipId: {
        type: objectId,
        ref: 'Internship',
        required: true
    },
    resume: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
