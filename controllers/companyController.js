const companyModel = require('../models/companyModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../../.env' });
const validation = require('../validator/validation.js');


//company registration and login typically refer to the process where an authorized representative of the company, 
//such as an employer, owner, or HR personnel, registers and logs in to the website. 
//Once logged in, they can post internship opportunities offered by their company. 


// Register Company Function
const registerCompany = async function (req, res) {
    try {
        const data = req.body;
        // Check if data is provided
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for registration" });
        }
        // Destructure request body data
        const { companyName, companyEmail, password, contactNumber } = data;

        // Check for required fields and data validity
        if (!validation.checkData(companyName)) {
            return res.status(400).send({ status: false, message: "companyName is required" });
        }

        if (!validation.checkData(companyEmail)) {
            return res.status(400).send({ status: false, message: "Email is required" });
        }

        if (!validation.checkEmail(companyEmail)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        }

        const existingEmail = await companyModel.findOne({ companyEmail: companyEmail });
        if (existingEmail) {
            return res.status(409).send({ status: false, message: "The provided email already exists" });
        }

        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "Password is required" });
        }

        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        const encryptPassword = await bcrypt.hash(password, 10);

        if (!validation.checkData(contactNumber)) {
            return res.status(400).send({ status: false, message: "Contact number is required" });
        }

        if (!validation.checkMobile(contactNumber)) {
            return res.status(400).send({ status: false, message: "Invalid contact number" });
        }


        const newDetails = {
            companyName: companyName,
            companyEmail: companyEmail,
            password: encryptPassword,
            contactNumber: contactNumber
        };

        const createCompany = await companyModel.create(newDetails);
        return res.status(200).send({ status: true, message: "Company registered successfully", companyData: createCompany });
    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

// Company Login Function
const companyLogin = async function (req, res) {
    try {
        const data = req.body;
        // Check if data is provided
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for login" });
        }

        // Destructure email and password from request body
        const { companyEmail, password } = data;

        // Check for required fields and data validity
        if (!validation.checkData(companyEmail)) {
            return res.status(400).send({ status: false, message: "Provide email for login" });
        }

        if (!validation.checkEmail(companyEmail)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        }

        const isEmailExist = await companyModel.findOne({ companyEmail: companyEmail });
        if (!isEmailExist) {
            return res.status(404).send({ status: false, message: "Email not found" });
        }

        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "Provide password for login" });
        }

        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        const comparePassword = await bcrypt.compare(password, isEmailExist.password);
        if (!comparePassword) {
            return res.status(404).send({ status: false, message: "Invalid password" });
        }

        const token = jwt.sign({
            companyID: isEmailExist._id.toString(),
            user: "company"
        }, process.env.secretKey, { expiresIn: "1h" });

        // Set the token in the response header
        res.set('Authorization', `Bearer ${token}`);

        return res.status(200).send({ status: true, message: "Company login successful", token: token });
    } catch (error) {
        return res.status(503).send({ status: false, message: error.message });
    }
}

module.exports = { registerCompany, companyLogin };
