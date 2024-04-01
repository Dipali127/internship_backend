const studentModel = require('../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'../../.env'});
const validation = require('../validator/validation');

//register studentDetails:
const registerStudent = async function(req,res){
    try{
        const data = req.body;
        //if student doesnt send data 
        if(!validation.isEmpty(data)){
            return res.status(400).send({status:false,message:"Provide details for registration"});
        }
        //destructuring request body data which are mandatory at the time of registration
        const {name,email,password,mobileNumber} = data;

        //if student forgot to send any of details as well as validate the provided details are correct
        if(!validation.checkString(name)){
            return res.status(400).send({status:false,message:"studentName is required"})
        }

        if(!validation.checkName(name)){
            return res.status(400).send({status:false,message:"Invalid name"})
        }

        if(!validation.checkString(email)){
            return res.status(400).send({status:false,message:"email is required"});
        }

        if(!validation.checkEmail(email)){
            return res.status(400).send({status:false,message:"Invalid email"})
        }

        if(!validation.checkString(password)){
            return res.status(400).send({status:false,message:"password is required"});
        }

        if(!validation.checkPassword(password)){
            return res.status(400).send({status:false,message:"Invalid password"});
        }

        if(!validation.checkString(mobileNumber)){
            return res.status(400).send({status:false,message:"mobileNumber is required"});
        }

        if(!validation.checkPassword(password)){
            return res.status(400).send({status:false,message:"Invalid password"});
        }
       
        //if provided email already present in database
        const existingEmail = await studentModel.findOne({email:email});
        if(existingEmail){
            return res.status(409).send({status:false,message:"The provided email already exists"})
        }

        //hashed password
       const encryptPassword = await bcrypt.hash(password, 10)

        const newDetails = {
            name:name,
            email:email,
            password:encryptPassword,
            mobileNumber:mobileNumber
        }

        const createStudent = await studentModel.create(newDetails);
        return res.status(200).send({status:true,message:"Student registered successfully",studentData:createStudent});
    }catch(error){
        return res.status(503).send({status:false,message:error.message});
    }
}

//student login:
const studentLogin = async function(req,res){
    try{
        const data = req.body;
        //if student doesnt send data 
        if(!validation.isEmpty(data)){
            return res.status(400).send({status:false,message:"Provide details for registration"});
        }

        //destructuring email and password from request body to login student
        const {email,password} = data;

        if(!validation.checkString(email)){
            return res.status(400).send({status:false,message:"Provide email for login"})
        }

        if(!validation.checkEmail(email)){
            return res.status(400).send({status:false,message:"Invalid email"});
        }

        if(!validation.checkString(password)){
            return res.status(400).send({status:false,message:"Provide password for login"});
        }
        
        if(!validation.checkPassword(password)){
            return res.status(400).send({status:false,message:"Invalid password"});
        }
        //if provided email already present in database
        const isemailExist = await studentModel.findOne({email:email});
        if(!isemailExist){
            return res.status(404).send({status:false,message:"Email not found"});
        }

       //compare hassedPassword with the student provided password
       const comparePassword = await bcrypt.compare(password,isemailExist.password);

       //If password don't match
       if(!comparePassword){
        return res.status(404).send({status:false,message:"Invalid password"})
       }

       //Generate token for student
       const token = jwt.sign({
        studentID:isemailExist._id.toString(),
        author:"dipali"
       }, process.env.secretKey,{expiresIn: "2min"})

       return res.status(200).send({status:true,message:"student login succesfully",token:token});
    }catch(error){
        return res.status(503).send({status:false,message:error.message})
    }
}

const updateStudentdetails = async function(req,res){
    try{
        const studentId = req.params._id;
        const isExiststudent = await studentModel.findById(studentId);
        if(!isExiststudent){
            return res.status(400).send({status:false,message:"Student not found"});
        }

        
        const loggedInStudent = req.decodedToken.studentID;

        if(studentId != loggedInStudent){
            return res.status(403).send({status:false,message:"Unauthorized to update student details"});
        }

        const data = req.body;
        const {DOB,collegeName,yearOfPassout,areaOfInterest,address,country,state,city} = data;

        const additionalData = {
            DOB,
            collegeName,
            yearOfPassout,
            areaOfInterest,
            address,
            country,
            state,
            city
        }

        const updateDetails = await studentModel.findOneAndUpdate({_id:studentId},
            additionalData,{new:true});
        return res.status(200).send({status:true,message:"Added additional data of student",data:updateDetails});

    }catch(error){
        return res.status(503).send({status:false,message:error.message});
    }
}
module.exports = {registerStudent,studentLogin,updateStudentdetails};