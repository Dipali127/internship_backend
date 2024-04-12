const internshipModel = require('../models/internshipModel');
const companyModel = require('../models/companyModel');
const validation = require('../validator/validation');
const axios = require('axios');
require('dotenv').config({ path: '../../.env' });
const moment = require('moment');


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
        console.log("Error fetching cities:", error.message);
        return [];
    }
}
//create internship
const postInternship = async function (req, res) {
    try {
        const companyId = req.params._id;
        if (!validation.checkObjectId(companyId)) {
            return res.status(400).send({ status: false, message: "Invalid companyId" });
        }
        const isExistcompany = await companyModel.findById(companyId);
        //if provided companyId company doesn't exist
        if (!validation.isEmpty(isExistcompany)) {
            return res.status(400).send({ status: false, message: "company not found" });
        }


        const loggedInCompany = req.decodedToken.companyID;

        if (companyId != loggedInCompany) {
            return res.status(403).send({ status: false, message: "Unauthorized to post internship details" });
        }

        //once the company is authorized he/she can post the internship
        const data = req.body;
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide data to post internship" });
        }

        //destructure data coming from request body 
        const { category, position, internshipType, skillsRequired, eligibility, duration, location, applicationDeadline,
            numberOfOpenings, stipend, status } = data;

        //validation part:
        if (!validation.checkData(category)) {
            return res.status(400).send({ status: false, message: "Category is required" });
        }

        const validCategory = {
            'Web Development': ['Frontend Developer', 'Backend Developer', 'full stack Developer'],
            'Mobile Development': ['Mobile App Developer', 'iOS Developer', 'Android Developer'],
            'Data Science': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Data Engineer'],
            'Cybersecurity': ['Security Analyst', 'Security Engineer'],
            'DevOps and Cloud Computing': ['Cloud Architect', 'DevSecOps Engineer', 'Cloud Security Engineer'],
            'UI/UX Design': ['UI Developer/Frontend Developer', 'UX Developer', 'Visual Designer'],
            'Content Writing': ['Content Writer (Technical Content)', 'Technical Writer', 'SEO Specialist']
        }

        if (!validCategory.hasOwnProperty(category)) {
            return res.status(400).send({ status: false, message: "Invalid category" });
        }

        //here, we fetch all the position in array which are under provided category by company
        const positionsForCategory = validCategory[category];

        if (!validation.checkData(position)) {
            return res.status(400).send({ status: false, message: "Position is required" });
        }

        //if same position internship created multiple times
        const positionCheck = await internshipModel.findOne({ position: position });

        if (positionCheck) {
            return res.status(400).send({ status: false, message: "Position already exist" });
        }

        if (!positionsForCategory.includes(position)) {
            return res.status(400).send({ status: false, message: "Position is not valid for the selected category" })
        }

        if (!validation.checkData(skillsRequired)) {
            return res.status(400).send({ status: false, message: "skillsRequired is required" });
        }

        if (!validation.checkData(eligibility)) {
            return res.status(400).send({ status: false, message: "eligibility is required" });
        }

        //eligibility only contain capital letter,small letter and space
        if (!validation.checkName(eligibility)) {
            return res.status(400).send({ status: false, message: "Invalid eligibility" });
        }

        if (!validation.checkData(duration)) {
            return res.status(400).send({ status: false, message: "Duration is required" });
        }

        if (!validation.validateInput(duration)) {
            return res.status(400).send({ status: false, message: "Invalid duration" });
        }

        if (!validation.isEmpty(location)) {
            return res.status(400).send({ status: false, message: "location is required" });
        }

        if (!validation.checkData(location.state)) {
            return res.status(400).send({ status: false, message: "state is required" })
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
        if (!Object.keys(indianStates).includes(location.state)) {
            return res.status(400).send({ status: false, message: "Invalid state" });
        }

        //fetch the stateCode corresponding to the state given by student
        const stateCode = indianStates[location.state];
        console.log(stateCode)

        if (!validation.checkData(location.city)) {
            return res.status(400).send({ status: false, message: "city is required" });
        }

        console.log(location.city)
        // Fetch cities for the provided state's stateCode
        const cities = await fetchCities(stateCode)
        console.log(cities)

        // Check if the provided city is one of the fetched cities
        if (!cities.includes(location.city)) {
            return res.status(400).send({ status: false, message: "Invalid city" });
        }

        if (!validation.checkData(applicationDeadline)) {
            return res.status(400).send({ status: false, message: "applicationDeadline is required" });
        }

        const lastDateofApplying = moment(applicationDeadline, 'YYYY-MM-DD');

        if (!lastDateofApplying.isValid()) {
            return res.status(400).send({ status: false, message: "Invalid date format" });
        }

        if (!validation.checkData(numberOfOpenings)) {
            return res.status(400).send({ status: false, message: "numberOfOpenings is required" });
        }

        if (!validation.validateInput(numberOfOpenings)) {
            return res.status(400).send({ status: false, message: "Invalid numberOfOpenings" });
        }

        if (!validation.checkData(stipend)) {
            return res.status(400).send({ status: false, message: "stipend is required" });
        }

        //Parse the stipend string to extract minimum and maximum stipend values
        const [minStipendStr, maxStipendStr] = stipend.split('-');

        // Remove any non-numeric characters (except '-') and parse the stipend values as integers
        const minimumStipend = parseInt(minStipendStr.trim().replace(/[^\d]/g, ''), 10);
        const maximumStipend = parseInt(maxStipendStr.trim().replace(/[^\d]/g, ''), 10);


        // Ensure that both minimum and maximum stipend values are valid numbers
        if (isNaN(minimumStipend) || isNaN(maximumStipend)) {
            return res.status(400).send({ status: false, message: "Invalid stipend format" });
        }

        //structure of internship show in database
        const newInternship = {
            companyId: companyId,
            category,
            position,
            internshipType,
            skillsRequired,
            eligibility,
            duration,
            location,
            applicationDeadline: lastDateofApplying,
            numberOfOpenings,
            stipend: `${minimumStipend}-${maximumStipend}`,
            status
        }

        const createInternship = await internshipModel.create(newInternship);

        //structure of internship shows to student

        const responseInternshipStructure = {
            By: isExistcompany.companyName,
            Email: isExistcompany.companyEmail,
            Contact: isExistcompany.contactNumber,
            category: createInternship.category,
            position: createInternship.position,
            internshipType: createInternship.internshipType,
            skillsRequired: createInternship.skillsRequired,
            eligibility: createInternship.eligibility,
            duration: createInternship.duration,
            location: createInternship.location,
            applicationDeadline: createInternship.applicationDeadline,
            numberOfOpenings: createInternship.numberOfOpenings,
            stipend: createInternship.stipend,
            status: createInternship.status
        }

        return res.status(201).send({ status: true, message: "Internship successfully posted", data: responseInternshipStructure });

    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

//update internship
const updateInternship = async function (req, res) {
    try {
        const internshipId = req.params._id;

        const isExistInternship = await internshipModel.findById(internshipId);
        if (!isExistInternship) {
            return res.status(404).send({ status: false, message: "Internship not found" });
        }

        const companyId = isExistInternship.companyId;

        // Check if the logged-in company is authorized to update the internship
        if (companyId != req.decodedToken.companyID) {
            return res.status(403).send({ status: false, message: "Unauthorized to update internship details" });
        }

        //if company is authorized to update then take updated data from request body
        const data = req.body;

        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "No fields provided for update" });
        }

        // Extract only the allowed fields from the request body
        const { status, internshipType, duration, } = data;

        if (status && !["active", "closed"].includes(status)) {
            return res.status(400).send({ status: false, message: "Invalid status value" });
        }

        if (internshipType && !["remote", "wfh", "wfo"].includes(internshipType)) {
            return res.status(400).send({ status: false, message: "Invalid internshipType value" })
        }

        if (duration && !validation.validateInput(duration)) {
            return res.status(400).send({ status: false, message: "Invalid duration" });
        }

        const updatedField = {
            status,
            internshipType,
            duration
        };

        //update internship status
        const updatedInternship = await internshipModel.findOneAndUpdate({ _id: internshipId }, updatedField, { new: true });

        return res.status(200).send({ status: true, message: " Status updated succesfully", data: updatedInternship })


    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

module.exports = { postInternship, updateInternship }