const internshipModel = require('../models/internshipModel');
const companyModel = require('../models/companyModel');
const validation = require('../validator/validation');
const moment = require('moment');

//Create internship:
const postInternship = async function (req, res) {
    try {
        const companyId = req.params.companyId;
        //Check if the provided 'companyId' is a valid ObjectId format
        if (!validation.checkObjectId(companyId)) {
            return res.status(400).send({ status: false, message: "Invalid companyId" });
        }

        const isExistcompany = await companyModel.findById(companyId);
        //if provided companyId company doesn't exist
        if (!validation.isEmpty(isExistcompany)) {
            return res.status(404).send({ status: false, message: "Company not found" });
        }

        //Check authorization
        if (isExistcompany._id != req.decodedToken.companyID) {
            return res.status(403).send({ status: false, message: "Unauthorized to post internship details" });
        }

        let data= req.body;
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide data to post internship" });
        }

        //Destructure mandatory fields from request body
        const { category, position, internshipType, skillsRequired, eligibility, duration, location, applicationDeadline,
            numberOfOpenings, stipend, status } = data;

        //Validate mandatory details
        if (!validation.checkData(category)) {
            return res.status(400).send({ status: false, message: "Category is required" });
        }

        if (!validation.checkData(position)) {
            return res.status(400).send({ status: false, message: "Position is required" });
        }

        //if position of this company's internship already exist
        const isExistPosition = await internshipModel.findOne({ companyId: companyId, position: position });
        if (isExistPosition) {
            return res.status(409).send({ status: false, message: "An internship with the same position already exists for this company" });
        }

        if (!validation.checkData(skillsRequired)) {
            return res.status(400).send({ status: false, message: "SkillsRequired is required" });
        }

        if (!validation.checkData(eligibility)) {
            return res.status(400).send({ status: false, message: "Eligibility is required" });
        }

        if (!validation.checkData(duration)) {
            return res.status(400).send({ status: false, message: "Duration is required" });
        }

        if (!validation.isEmpty(location)) {
            return res.status(400).send({ status: false, message: "Location is required" });
        }

        if (!validation.checkData(location.state)) {
            return res.status(400).send({ status: false, message: "State is required" })
        }

        if (!validation.checkData(location.city)) {
            return res.status(400).send({ status: false, message: "City is required" });
        }

        if (!validation.checkData(applicationDeadline)) {
            return res.status(400).send({ status: false, message: "ApplicationDeadline is required" });
        }

        //Parsing lastDateofAppling using moment.js
        const lastDateofApplying = moment(applicationDeadline, 'YYYY-MM-DD');
        if (!lastDateofApplying.isValid()) {
            return res.status(400).send({ status: false, message: "Invalid date format" });
        }

        //Get the current date
        const currentDate = moment();
        if (!lastDateofApplying.isAfter(currentDate)) {
            return res.status(400).send({ status: false, message: "Please provide an application deadline that is after the current date." })
        }

        if (!validation.checkData(numberOfOpenings)) {
            return res.status(400).send({ status: false, message: "NumberOfOpenings is required" });
        }

        if (!validation.validateInput(numberOfOpenings)) {
            return res.status(400).send({ status: false, message: "Invalid numberOfOpenings" });
        }

        if (!validation.checkData(stipend)) {
            return res.status(400).send({ status: false, message: "Stipend is required" });
        }

        //Parse the stipend string to extract minimum and maximum stipend values
        const [minStipendStr, maxStipendStr] = stipend.split('-');

        //Remove any non-numeric characters (except '-') and parse the stipend values as integers
        const minimumStipend = parseInt(minStipendStr.trim().replace(/[^\d]/g, ''), 10);
        const maximumStipend = parseInt(maxStipendStr.trim().replace(/[^\d]/g, ''), 10);


        //Ensure that both minimum and maximum stipend values are valid numbers
        if (isNaN(minimumStipend) || isNaN(maximumStipend)) {
            return res.status(400).send({ status: false, message: "Invalid stipend format" });
        }

        //structure of internship show in database
        const newInternship = {
            companyId : isExistcompany,
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

        return res.status(201).send({ status: true, message: "Internship successfully posted", data: createInternship });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//Update internship:
const updateInternship = async function (req, res) {
    try {
        const internshipId = req.params.internshipId;
       //Check if the provided 'internshipId' is a valid ObjectId format
        if (!validation.checkObjectId(internshipId)) {
            return res.status(400).send({ status: false, message: "Invalid internshipId" });
        }

        const isExistInternship = await internshipModel.findById({_id:internshipId});
        if (!isExistInternship) {
            return res.status(404).send({ status: false, message: "Internship not found" });
        }

        // Check if the logged-in company is authorized to update the internship details
        if (isExistInternship.companyId != req.decodedToken.companyID) {
            return res.status(403).send({ status: false, message: "Unauthorized to update internship details" });
        }
  
        const data = req.body;
        //Check if request body is empty 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "No fields provided for update" });
        }

        //Destructure mandatory fields from request body
        const { status, internshipType, duration, } = data;

        //validate mandatory fields
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

        //update the internship
        const updatedInternship = await internshipModel.findOneAndUpdate({ _id: internshipId }, updatedField, { new: true });

        return res.status(200).send({ status: true, message: "Status updated succesfully", data: updatedInternship })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//Get internship:
const getInternship = async function (req, res) {
    try {
        const filter = req.query;
        let fetchInternship;
        //If no query parameters provided by the student
        if (Object.keys(filter).length === 0) {
            fetchInternship = await internshipModel.find({ status: "active" }).populate('companyId');
        } else {
            const query = { status: "active" };
        //If student provides query parameters
            if (filter.category) { query.category = filter.category };
            if (filter.internshipType) { query.internshipType = filter.internshipType };
            if (filter.location) {
                if (filter.location.state) query['location.state'] = filter.location.state;
                if (filter.location.city) query['location.city'] = filter.location.city;
            }

            //Get all internships based on the provided query
            fetchInternship = await internshipModel.find(query).populate('companyId');
        } 
        //Format the response to include company name along with other internship details
        const formattedInternships = fetchInternship.map(internship => {
            return {
                BY:internship.companyId.companyName, 
                category: internship.category,
                position: internship.position,
                internshipType: internship.internshipType,
                skillsRequired: internship.skillsRequired,
                eligibility: internship.eligibility,
                duration: internship.duration,
                location: internship.location,
                applicationDeadline: internship.applicationDeadline,
                numberOfOpenings: internship.numberOfOpenings,
                stipend: internship.stipend,
                status: internship.status
            };
        });

        return res.status(200).send({ status: true, message: "Successfully fetched internships", data: formattedInternships});
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { postInternship, updateInternship, getInternship}