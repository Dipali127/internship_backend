const companyModel = require('../models/companyModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../.env' });
const validation = require('../validator/validation.js');


//company registration and login typically refer to the process where an authorized representative of the company, 
//such as an employer, owner, or HR personnel, registers and logs in to the website. 
//Once logged in, they can post internship opportunities offered by their company. 

//Register Company:
const registerCompany = async function (req, res) {
    try {
        const data = req.body;
        //Check if request body is empty 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for registration" });
        }
        //Destructure mandatory fields from request body
        const { companyName, companyEmail, password, contactNumber } = data;

        //Validate mandatory details
        if (!validation.checkData(companyName)) {
            return res.status(400).send({ status: false, message: "CompanyName is required" });
        }

        if (!validation.checkData(companyEmail)) {
            return res.status(400).send({ status: false, message: "Email is required" });
        }

        if (!validation.checkEmail(companyEmail)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        }

        //Check if the provided email already exist in database
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

         //Hash the password before saving it in database
        const encryptPassword = await bcrypt.hash(password, 10);

        if (!validation.checkData(contactNumber)) {
            return res.status(400).send({ status: false, message: "Contact number is required" });
        }

        if (!validation.checkMobile(contactNumber)) {
            return res.status(400).send({ status: false, message: "Invalid contact number" });
        }
       
        //Check if the provided contact number already exist in database
        const existingContact = await companyModel.findOne({contactNumber:contactNumber});

        if(existingContact){
            return res.status(409).send({status:false,message:"Provided contact number already exists"});
        }

        //Prepare the new company details with the encrypted password
        const newDetails = {
            companyName: companyName,
            companyEmail: companyEmail,
            password: encryptPassword,
            contactNumber: contactNumber
        };

        //Save the new student record in the database
        const createCompany = await companyModel.create(newDetails);
        return res.status(201).send({ status: true, message: "Company registered successfully", companyData: createCompany });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//Company Login:
const companyLogin = async function (req, res) {
    try {
        const data = req.body;
        //Check if request body is empty 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for login" });
        }

        //Destructure email and password from request body
        const { companyEmail, password } = data;

        
        if (!validation.checkData(companyEmail)) {
            return res.status(400).send({ status: false, message: "Provide email for login" });
        }

        if (!validation.checkEmail(companyEmail)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        }

        //Check if the provided email doesn't present in database
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

        //Compare hashedPassword with the student provided password
        const comparePassword = await bcrypt.compare(password, isEmailExist.password);
        if (!comparePassword) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        //Generate token for student
        const token = jwt.sign({
            companyID: isEmailExist._id.toString(),
            user: "company"
        }, process.env.secretKey, { expiresIn: "1h" });

        // Set the generated token in the response header
        res.set('Authorization', `Bearer ${token}`);

        return res.status(200).send({ status: true, message: "Company login successfully", token: token });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { registerCompany, companyLogin };
