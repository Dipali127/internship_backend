const studentModel = require('../models/studentModel');
const internshipModel = require('../models/internshipModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
//require('dotenv').config({ path: '../.env' });
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
            return res.status(400).send({ status: false, message: "studentName is required" })
        }

        if (!validation.checkName(name)) {
            return res.status(400).send({ status: false, message: "Invalid name" })
        }

        if (!validation.checkData(email)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }

        if (!validation.checkEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" })
        }

        //Check if the provided email already present in database
        const existingEmail = await studentModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(409).send({ status: false, message: "The provided email already exists" })
        }

        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }

        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        //Hash the password before saving it in database
        const encryptPassword = await bcrypt.hash(password, 10)

        if (!validation.checkData(mobileNumber)) {
            return res.status(400).send({ status: false, message: "mobileNumber is required" });
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

        //Check if the provided email not present in database
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

        //If password doesn't match
        if (!comparePassword) {
            return res.status(404).send({ status: false, message: "Incorrect password" })
        }

        //Generate token for student
        const token = jwt.sign({
            studentID: isemailExist._id.toString(),
            user: "student"
        }, process.env.secretKey, { expiresIn: "1h" })

        // Set the token in the response header
        res.set('Authorization', `Bearer ${token}`)

        return res.status(200).send({ status: true, message: "Student login successfully", token: token });
    } catch (error) {
        return res.status(503).send({ status: false, message: error.message })
    }
}

//Edit student details:
const editStudentdetails = async function (req, res) {
    try {
        const studentId = req.params.studentID;
        if (!validation.checkObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Invalid studentId" });
        }

        const isExiststudent = await studentModel.findById(studentId);
        //if provided studentId student not exist
        if (!isExiststudent) {
            return res.status(400).send({ status: false, message: "Student not found" });
        }
        const loggedInStudent = req.decodedToken.studentID;

        if (studentId != loggedInStudent) {
            return res.status(403).send({ status: false, message: "Unauthorized to update student details" });
        }

        const data = req.body;
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide data to update/edit details" })
        }
        const { DOB, collegeName, yearOfPassout, areaOfInterest, state, city } = data;

        if (!validation.checkData(DOB)) {
            return res.status(400).send({ status: false, message: "DOB is required" });
        }

        // Parsing DOB using moment.js
        const dob = moment(DOB, 'YYYY-MM-DD');

        if (!dob.isValid()) {
            return res.status(400).send({ status: false, message: "Invalid date format" });
        }

        if (!validation.checkData(collegeName)) {
            return res.status(400).send({ status: false, message: "collegeName is required" });
        }

        if (!validation.checkData(yearOfPassout)) {
            return res.status(400).send({ status: false, message: "yearOfPassout is required" });
        }

        // Check if yearOfPassout is not a number
        if (isNaN(yearOfPassout)) {
            return res.status(400).send({ status: false, message: "yearOfPassout must be a number" });
        }

        if (!validation.checkData(areaOfInterest)) {
            return res.status(400).send({ status: false, message: "areaOfInterest is required" });
        }

        if (!validation.checkData(state)) {
            return res.status(400).send({ status: false, message: "state is required" });
        }

        if (!validation.checkData(city)) {
            return res.status(400).send({ status: false, message: "city is required" });
        }

        const additionalData = {
            DOB,
            collegeName,
            yearOfPassout,
            areaOfInterest,
            state,
            city
        }

        const updateDetails = await studentModel.findOneAndUpdate({ _id: studentId },
            additionalData, { new: true });
        return res.status(200).send({ status: true, message: "Added additional data of student", data: updateDetails });

    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

//Get internship:
const getInternship = async function (req, res) {
    try {
        const filter = req.query;
        let fetchInternship;
        if (Object.keys(filter).length === 0) {
            fetchInternship = await internshipModel.find({ status: "active" });
        } else {
            const query = { status: "active" };

            if (filter.category) { query.category = filter.category };
            if (filter.internshipType) { query.internshipType = filter.internshipType };
            if (filter.location) {
                if (filter.location.state) query['location.state'] = filter.location.state;
                if (filter.location.city) query['location.city'] = filter.location.city;
            }

            fetchInternship = await internshipModel.find(query);
        }

        return res.status(200).send({ status: true, message: "Successfully fetched internships", data: fetchInternship });
    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

module.exports = { registerStudent, studentLogin, editStudentdetails, getInternship };