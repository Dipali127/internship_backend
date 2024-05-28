const studentModel = require('../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../.env' });
const validation = require('../validator/validation');
const moment = require('moment');

//Register student details:
const registerStudent = async function (req, res) {
    try {
        const data = req.body;
        //Check if request body is empty 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for registration" });
        }
        //Destructure mandatory fields from request body
        const { name, email, password, mobileNumber } = data;

        //Validate mandatory details
        if (!validation.checkData(name)) {
            return res.status(400).send({ status: false, message: "StudentName is required" })
        }

        if (!validation.checkName(name)) {
            return res.status(400).send({ status: false, message: "Invalid name" })
        }

        if (!validation.checkData(email)) {
            return res.status(400).send({ status: false, message: "Email is required" });
        }

        if (!validation.checkEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" })
        }

        //Check if the provided email already exist in database
        const existingEmail = await studentModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(409).send({ status: false, message: "The provided email already exists" })
        }

        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "Password is required" });
        }

        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        //Hash the password before saving it in database
        const encryptPassword = await bcrypt.hash(password, 10)

        if (!validation.checkData(mobileNumber)) {
            return res.status(400).send({ status: false, message: "MobileNumber is required" });
        }

        if (!validation.checkMobile(mobileNumber)) {
            return res.status(400).send({ status: false, message: "Invalid mobileNumber" });
        }

        //Check if the provided mobile number already exists in the database
        const uniqueMobile = await studentModel.findOne({ mobileNumber: mobileNumber });
        if (uniqueMobile) {
            return res.status(409).send({ status: false, message: "Provided mobile number already exist" });
        }

        //Prepare the new student details with the encrypted password
        const newDetails = {
            name: name,
            email: email,
            password: encryptPassword,
            mobileNumber: mobileNumber
        }

        //Save the new student record in the database
        const createStudent = await studentModel.create(newDetails);
        return res.status(200).send({ status: true, message: "Student registered successfully", studentData: createStudent });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//Student login:
const studentLogin = async function (req, res) {
    try {
        const data = req.body;
        //Check if request body is empty 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for login" });
        }

        //Destructure email and password from request body 
        const { email, password } = data;

        if (!validation.checkData(email)) {
            return res.status(400).send({ status: false, message: "Provide email for login" })
        }

        if (!validation.checkEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        }

        //Check if the provided email doesn't present in database
        const isemailExist = await studentModel.findOne({ email: email });
        if (!isemailExist) {
            return res.status(404).send({ status: false, message: "Email not found" });
        }

        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "Provide password for login" });
        }

        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        //Compare hashedPassword with the student provided password
        const comparePassword = await bcrypt.compare(password, isemailExist.password);
        if (!comparePassword) {
            return res.status(404).send({ status: false, message: "Incorrect password" })
        }

        //Generate token for student
        const token = jwt.sign({
            studentID: isemailExist._id.toString(),
            user: "student"
        }, process.env.secretKey, { expiresIn: "1h" })

        // Set the generated token in the response header
        res.set('Authorization', `Bearer ${token}`)

        return res.status(200).send({ status: true, message: "Student login successfully", token: token });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//Edit student details:
const editStudentdetails = async function (req, res) {
    try {
        const studentId = req.params.studentID;
        //Check if the provided 'studentId' is a valid ObjectId format.
        if (!validation.checkObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Invalid studentId" });
        }

        const isExiststudent = await studentModel.findById(studentId);
        //if provided studentId student doesn't exist
        if (!isExiststudent) {
            return res.status(400).send({ status: false, message: "Student not found" });
        }

        //authorization check
        if (isExiststudent._id != req.decodedToken.studentID) {
            return res.status(403).send({ status: false, message: "Unauthorized to update student details" });
        }

        const data = req.body;
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide data to edit/update details" })
        } 
        //Destructure mandatory fields from request body
        const { DOB, collegeName, yearOfPassout, areaOfInterest, state, city } = data;

        if (!validation.checkData(DOB)) {
            return res.status(400).send({ status: false, message: "DOB is required" });
        }

        //Parsing DOB using moment.js
        const dob = moment(DOB, 'YYYY-MM-DD');

        if (!dob.isValid()) {
            return res.status(400).send({ status: false, message: "Invalid date format" });
        }

        if (!validation.checkData(collegeName)) {
            return res.status(400).send({ status: false, message: "CollegeName is required" });
        }

        if (!validation.checkData(yearOfPassout)) {
            return res.status(400).send({ status: false, message: "YearOfPassout is required" });
        }

        // Check if yearOfPassout is not a number
        if (isNaN(yearOfPassout)) {
            return res.status(400).send({ status: false, message: "YearOfPassout must be a number" });
        }

        if (!validation.checkData(areaOfInterest)) {
            return res.status(400).send({ status: false, message: "AreaOfInterest is required" });
        }

        if (!validation.checkData(state)) {
            return res.status(400).send({ status: false, message: "State is required" });
        }

        if (!validation.checkData(city)) {
            return res.status(400).send({ status: false, message: "City is required" });
        }

        //Prepare the new edit/update details 
        const additionalData = {
            DOB,
            collegeName,
            yearOfPassout,
            areaOfInterest,
            state,
            city
        }

        //Save the edit student record in the database
        const updateDetails = await studentModel.findOneAndUpdate({ _id: studentId },
            additionalData, { new: true });
        return res.status(200).send({ status: true, message: "Student details updated successfully", data: updateDetails });

    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

module.exports = { registerStudent, studentLogin, editStudentdetails};