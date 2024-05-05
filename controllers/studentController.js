//const dob = moment(DOB, 'YYYY-MM-DD');
//Here, DOB is assumed to be a string containing the date of birth in the format 'YYYY-MM-DD'.
// Moment.js parses this string and creates a Moment object representing the date and assign it to dob variable.
//if (!dob.isValid() || moment().diff(dob, 'years') < minAge): This conditional statement checks two conditions:
//This checks if the parsed date of birth (dob) is valid. If it's not a valid date (e.g., if the user entered an 
//invalid date format), dob.isValid() will return false.
//. moment().diff(dob, 'years') < minAge: This calculates the difference in years between the current 
//date (obtained using moment()) and the parsed date of birth (dob)
//If this difference is less than minAge (in this case, 18 years), it means the user is younger than the required age.
// isValid() is indeed a function provided by Moment.js to check if a Moment object represents a valid date.

//Yes, exactly. GeoNames provides API endpoints like searchJSON which allow developers to query geographical data, including cities, 
//countries, and other locations, using various parameters such as country code, state code, city name, etc.

//However, GeoNames doesn't provide pre-defined functions in programming languages like JavaScript. Instead, developers use HTTP 
//requests to interact with these API endpoints directly. They may write custom functions or wrappers in their programming language of
// choice to simplify the process of making requests to these endpoints and handling responses.

//The fetchCities function you provided is an example of such a custom function. It's a JavaScript function that utilizes Axios, a 
//popular HTTP client library, to make a GET request to the GeoNames searchJSON endpoint with specific parameters. This function is
// not provided by GeoNames itself but is written by a developer to interact with the GeoNames 
//API in a specific way, in this case, fetching cities based on a state code.


const studentModel = require('../models/studentModel');
const internshipModel = require('../models/internshipModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../../.env' });
const validation = require('../validator/validation');
const moment = require('moment');
const axios = require('axios');

//register studentDetails:
const registerStudent = async function (req, res) {
    try {
        const data = req.body;
        //if student doesnt send data 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for registration" });
        }
        //destructuring request body data which are mandatory at the time of registration
        const { name, email, password, mobileNumber } = data;

        //if student forgot to send any of details as well as validate the provided details are correct
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

        //if provided email already present in database
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

        //hashed password
        const encryptPassword = await bcrypt.hash(password, 10)

        if (!validation.checkData(mobileNumber)) {
            return res.status(400).send({ status: false, message: "mobileNumber is required" });
        } 

        if (!validation.checkMobile(mobileNumber)) {
            return res.status(400).send({ status: false, message: "Invalid mobileNumber" });
        }

        //unique mobile number
        const uniqueMobile = await studentModel.findOne({ mobileNumber: mobileNumber });
        if (uniqueMobile) {
            return res.status(409).send({ status: false, message: "Provided mobile number already exist" });
        }


        const newDetails = {
            name: name,
            email: email,
            password: encryptPassword,
            mobileNumber: mobileNumber
        }

        const createStudent = await studentModel.create(newDetails);
        return res.status(200).send({ status: true, message: "Student registered successfully", studentData: createStudent });
    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

//student login:
const studentLogin = async function (req, res) {
    try {
        const data = req.body;
        //if student doesn't send data 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for login" });
        }

        //destructuring email and password from request body to login student
        const { email, password } = data;

        if (!validation.checkData(email)) {
            return res.status(400).send({ status: false, message: "Provide email for login" })
        }

        if (!validation.checkEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        }

        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "Provide password for login" });
        }

        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }
        //if provided email not present in database
        const isemailExist = await studentModel.findOne({ email: email });
        if (!isemailExist) {
            return res.status(404).send({ status: false, message: "Email not found" });
        }

        //compare hassedPassword with the student provided password
        //if password valid then it return boolean value
        const comparePassword = await bcrypt.compare(password, isemailExist.password);

        //If password don't match
        if (!comparePassword) {
            return res.status(404).send({ status: false, message: "Invalid password" })
        }

        //Generate token for student
        const token = jwt.sign({
            studentID: isemailExist._id.toString(),
            user: "student"
        }, process.env.secretKey, { expiresIn: "1h" })

        // Set the token in the response header
        res.set('Authorization', `Bearer ${token}`)

        return res.status(200).send({ status: true, message: "student login succesfully", token: token });
    } catch (error) {
        return res.status(503).send({ status: false, message: error.message })
    }
}

//function to fetch all the cities based of specific state
async function fetchCities(stateCode) {
    try {
        const response = await axios.get(`http://api.geonames.org/searchJSON?country=IN&adminCode1=${stateCode}&maxRows=1000&username=${process.env.geoNames_userName}`);
        
        console.log("Response:", response.data); // Log the response data
        
        // Check if response status is OK
        if (response.status !== 200) {
            throw new Error(`Failed to fetch cities: HTTP status ${response.status}`);
        }
        
        // Check if response data is available and contains the expected structure
        if (!response.data || !response.data.geonames || !Array.isArray(response.data.geonames)) {
            throw new Error('No geonames data available or unexpected response structure');
        }
        
        // Extract city names from the response data
         return response.data.geonames.map(city => city.name);

 

    } catch (error) {
        console.error("Error fetching cities:", error.message);
        return [];
    }
}


//added additional details of students when students update/edit his/her details
//once student click on update/edit his/her details then student must to add all the details mentioned in edit/update
const updateStudentdetails = async function (req, res) {
    try {
        const studentId = req.params._id;
        if (!validation.checkObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Invalid studentId" });
        }
        const isExiststudent = await studentModel.findById(studentId);
        //if provided studentId student not exist
        if (!validation.isEmpty(isExiststudent)) {
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

        // Additional validation, e.g., ensuring the user is at least 18 years old
        const dob = moment(DOB, 'YYYY-MM-DD'); // Parsing DOB using moment.js
        const minAge = 18; // Minimum age required

        if (!dob.isValid()) {
            return res.status(400).send({ status: false, message: "Invalid date format" });
        }

        if (moment().diff(dob, 'years') < minAge) {
            return res.status(400).send({ status: false, message: "Student must be at least 18 years old" });
        }
        if (!validation.checkData(collegeName)) {
            return res.status(400).send({ status: false, message: "collegeName is required" });
        }

        if (!validation.checkName(collegeName)) {
            return res.status(400).send({ status: false, message: "Invalid college name" });
        }

        if (!validation.checkData(yearOfPassout)) {
            return res.status(400).send({ status: false, message: "yearOfPassout is required" });
        }

        // Check if yearOfPassout is not a number
        if (isNaN(yearOfPassout)) {
            return res.status(400).send({ status: false, message: "yearOfPassout must be a number" });
        }

        //All the areaOfInterest in internship website
        const AreaOfInterest = [
            'Web Development',
            'Mobile Development',
            'Data Science',
            'Cybersecurity',
            'DevOps and Cloud Computing',
            'UI/UX Design',
            'Content Writing'
        ];

        if (!validation.checkData(areaOfInterest)) {
            return res.status(400).send({ status: false, message: "areaOfInterest is required" });
        }

        //check if areaOfinterest is from AreaOfInterest
        if (!AreaOfInterest.includes(areaOfInterest)) {
            return res.status(400).send({ status: false, message: "Invalid areaOfInterest" });
        }

        if (!validation.checkData(state)) {
            return res.status(400).send({ status: false, message: "state is required" });
        }

        //All the states of india for internship
        const indianStates = {
            "Andhra Pradesh": "02",
            "Arunachal Pradesh": "30",
            "Assam": "03",
            "Bihar": "34",
            "Chhattisgarh": "37",
            "Goa": "33",
            "Gujarat": "09",
            "Haryana": "10",
            "Himachal Pradesh": "11",
            "Jharkhand": "38",
            "Karnataka": "19",
            "Kerala": "13",
            "Madhya Pradesh": "35",
            "Maharashtra": "16",
            "Manipur": "17",
            "Meghalaya": "18",
            "Mizoram": "31",
            "Nagaland": "20",
            "Odisha": "21",
            "Punjab": "23",
            "Rajasthan": "24",
            "Sikkim": "29",
            "Tamil Nadu": "25",
            "Telangana": "40",
            "Tripura": "26",
            "Uttar Pradesh": "36",
            "Uttarakhand": "39",
            "West Bengal": "28",
            "Delhi": "07"
        };

        //check if state is from indianStates
        if (!Object.keys(indianStates).includes(state)) {
            return res.status(400).send({ status: false, message: "Invalid state" });
        }
        
        //fetch the stateCode corresponding to the state given by student
        const stateCode = indianStates[state];
        console.log(stateCode)

        if (!validation.checkData(city)) {
            return res.status(400).send({ status: false, message: "city is required" });
        }
        
        console.log(city)
        // Fetch cities for the provided state's stateCode
        const cities = await fetchCities(stateCode)
        console.log(cities)

        // Check if the provided city is one of the fetched cities
        if (!cities.includes(city)) {
            return res.status(400).send({ status: false, message: "Invalid city" });
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

//get internship:
const getInternship = async function(req, res){
    try {
        const filter = req.query;
        //In JavaScript, when you declare a variable using const, you must assign an initial value to it. 
        //const fetchInternship give error
        //You cannot declare a const variable without initializing it with a value.
        let fetchInternship;
        if (Object.keys(filter).length === 0) {
            fetchInternship = await internshipModel.find({ status: "active" });
        } else {
            fetchInternship = await internshipModel.find({
                $or:[{category: filter.category},
                {internshipType: filter.internshipType},
                {location: filter.location},]
            }).find({status:"active"});
        }

        return res.status(200).send({ status: true, message: "Successfully fetched internships", data: fetchInternship });
    } catch(error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

module.exports = { registerStudent, studentLogin, updateStudentdetails, getInternship };