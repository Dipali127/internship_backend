const studentModel = require('../models/studentModel');
const internshipModel = require('../models/internshipModel');
const applicationModel = require('../models/applicationModel');
const validation = require('../validator/validation');

//apply internship
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

        //Fetch data from request body
        const data = req.body;
        console.log(data);
        const { internshipId, status } = data;

        //Validate request body data
        if (!validation.checkData(internshipId)) {
            return res.status(400).send({ status: false, message: "internshipId is required" });
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
        const existingApplication = await applicationModel.findOne({ internshipId: internshipId });

        // If the application of this internship already exists.
        if (existingApplication) {
            return res.status(400).send({ status: false, message: "You have already applied for this internship" });
        }

        //f a file was uploaded(req.file exists),resumePath will be assigned the path of the uploaded file(req.file.path).
        //multer uploaded file inside req.file property
        const resumePath = req.file ? req.file.path : null;
        //give all the information about uploaded file
        console.log(req.file)
        // Create the new application object
        const newApplication = {
            studentId: studentId,
            internshipId: internshipId,
            resume: resumePath, //assign the resume path
            status: status || "pending"
        };

        // Save data of application in database
        const createInternshipApply = await applicationModel.create(newApplication);

        //Send the success response with the new application data
        return res.status(201).send({ status: true, message: "Application created successfully", data: createInternshipApply });
    }

    catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
};

//get all student details who has applied on particular internhsip
const getAllAppliedStudents  = async function (req, res) {
    try {
        const internshipId = req.params.internshipId;
        if (!validation.checkObjectId(internshipId)) {
            return res.status(400).send({ status: false, message: "Invalid internshipId" });
        }

        const isExistcompany = await internshipModel.findOne({ _id: internshipId });
        if (!isExistcompany) {
            return res.status((400).send({ status: false, message: "Provided internship doesn't exist" }));
        }

        const companyId = isExistcompany.companyId;
        const loggedinCompanyId = req.decodedToken.companyID;

        if (companyId != loggedinCompanyId) {
            return res.status(403).send({ status: false, message: "Unauthorized company" });
        }

        const isExistinternship = await applicationModel.find({internshipId: internshipId });
        if (!isExistinternship) {
            return res.status(400).send({ status: false, message: "No applications found for this internship"})
        }

        
        //response data
        const data = {
            internshipId: internshipId,
            totalApplications: isExistinternship.length,
            allStudentdetails: isExistinternship.map((student) => {
                return {
                    studentId:student.studentId,
                    resumeDownloadLink: `${req.protocol}://${req.get('host')}/${student.resume}`
                };
            })
        }

        return res.status(200).send({
            status: true, message: "successfully fetched all student who applied for internship of given internshipId",
            Data: data
        })

    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

module.exports = { applyInternship, getAllAppliedStudents  };
