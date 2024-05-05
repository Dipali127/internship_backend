const studentModel = require('../models/studentModel');
const internshipModel = require('../models/internshipModel');
const applicationModel = require('../models/applicationModel');
const validation = require('../validator/validation');
const multer = require('multer');
const path = require("path");
const upload = multer({dest: './uploads/files'});


const applyInternship = async function (req, res) {
    try {
        const studentId = req.params._id;
        if (!validation.checkObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Invalid studentId" });
        }

        // Validate student existence
        const isExistStudent = await studentModel.findById(studentId);
        if (!isExistStudent) {
            return res.status(400).send({ status: false, message: "Student not found" });
        }

        // Check authorization
        if (studentId != req.decodedToken.studentID) {
            return res.status(403).send({ status: false, message: "Unauthorized to apply for the internship" });
        }

        // Fetch data from request body
        const { internshipId, status } = req.body;

        // Validate request body data
        if (!validation.checkData(internshipId)) {
            return res.status(400).send({ status: false, message: "internshipId is required" });
        }

        if (!validation.checkObjectId(internshipId)) {
            return res.status(400).send({ status: false, message: "Invalid internshipId" });
        }

        // Check if the internship exists
        const isExistInternship = await internshipModel.findById(internshipId);
        if (!isExistInternship) {
            return res.status(400).send({ status: false, message: "Provided internshipId internship doesn't exist" });
        }

        // Use the upload middleware to handle file upload
        upload.single('resume')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Multer error occurred
                return res.status(400).send({ status: false, message: "Multer error", error: err });
            } else if (err) {
                // Other unknown error occurred
                return res.status(400).send({ status: false, message: "Unknown error", error: err });
            }

            // File uploaded successfully, now we can access req.file.path
            const resumePath = req.file.path;

            // Create the new application object
            const newApplication = {
                studentId: studentId,
                internshipId: internshipId,
                resume: resumePath,
                status: status || "pending"
            };

            // Save data of application in database
            const createInternshipApply = await applicationModel.create(newApplication);

            // Send the success response with the new application data
            return res.status(201).send({ status: true, message: "Application created successfully", data: createInternshipApply });
        });

    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
};

module.exports = {applyInternship};
