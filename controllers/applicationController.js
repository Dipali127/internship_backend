const studentModel = require('../models/studentModel');
const internshipModel = require('../models/internshipModel');
const applicationModel = require('../models/applicationModel');
const validation = require('../validator/validation');
const uploadFileOnCloudinary = require('../fileUpload/cloudinary');
const fs = require('fs');

//Apply in internship:
const applyInternship = async function (req, res) {
    try {
        const studentId = req.params.studentID;
       //Check if the provided 'studentId' is a valid ObjectId format.
        if (!validation.checkObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Invalid studentId" });
        }

        //Validate student existence
        const isExistStudent = await studentModel.findById({_id:studentId});
        if (!isExistStudent) {
            return res.status(400).send({ status: false, message: "Student not found" });
        }

        //Check authorization
        if (isExistStudent._id != req.decodedToken.studentID) {
            return res.status(403).send({ status: false, message: "Unauthorized to apply for the internship" });
        }

        //Fetch data from request body
        const { internshipId } = req.body;

        //Validate request body data
        if (!validation.checkData(internshipId)) {
            return res.status(400).send({ status: false, message: "InternshipId is required" });
        }

        if (!validation.checkObjectId(internshipId)) {
            return res.status(400).send({ status: false, message: "Invalid internshipId" });
        }

        //Check if the internship exists
        const isExistInternship = await internshipModel.findById(internshipId);
        if (!isExistInternship) {
            return res.status(400).send({ status: false, message: "Provided internshipId internship doesn't exist" });
        }

        //Check if the student has already applied for this internship
        const existingApplication = await applicationModel.findOne({ studentId:studentId,internshipId: internshipId });
        if (existingApplication) {
            return res.status(400).send({ status: false, message: "You have already applied for this internship" });
        }

        //multer uploaded file inside req.file property
        const resumePath = req.file.path;

        if (!resumePath) {
            return res.status(400).send({ status: false, message: "Resume file is required" });
        }

        //upload file in cloudinary
        const cloudinaryResponse = await uploadFileOnCloudinary(resumePath);
        if (!cloudinaryResponse) {
            return res.status(500).send({ status: false, message: "Failed to upload resume to Cloudinary" });
        }

        //Create the new application object
        const newApplication = {
            studentId: studentId,
            internshipId: internshipId,
            resume: cloudinaryResponse.url
        };

        //Save data of application in database
        const createInternshipApply = await applicationModel.create(newApplication);

        //Send the success response with the new application data
        return res.status(201).send({ status: true, message: "Application created successfully", data: createInternshipApply });
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    } 
    finally {
        //Clean up the local file from your local system after processing
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

//Get all student details who has applied on particular internhsip
const getAllAppliedStudents = async function (req, res) {
    try {
        const internshipId = req.params.internshipId;
        //Check if the provided 'internshipId' is a valid ObjectId format
        if (!validation.checkObjectId(internshipId)) {
            return res.status(400).send({ status: false, message: "Invalid internshipId" });
        }

        //if provided internshipId doesn't exist
        const isExistcompany = await internshipModel.findOne({ _id: internshipId });
        if (!isExistcompany) {
            return res.status(400).send({ status: false, message: "Provided internship doesn't exist" });
        }

        //Check authorization
        if (isExistcompany.companyId != req.decodedToken.companyID) {
            return res.status(403).send({ status: false, message: "Unauthorized company" });
        }

        //If no student has applied on the company provided internship
        const isExistinternship = await applicationModel.find({ internshipId: internshipId });
        if (!isExistinternship) {
            return res.status(400).send({ status: false, message: "No applications found for this internship" })
        }

        //response data
        const data = {
            internshipId: internshipId,
            totalApplications: isExistinternship.length,
            allStudentdetails: isExistinternship.map((student) => {
                return {
                    resumeDownloadLink: student.resume
                };
            })
        }

        return res.status(200).send({
            status: true, message: "successfully fetched all student who applied for internship of given internship",
            Data: data,
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { applyInternship, getAllAppliedStudents };
