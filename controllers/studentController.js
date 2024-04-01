const studentModel = require('../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'../../.env'});

//register studentDetails:
const registerStudent = async function(req,res){
    try{
        const data = req.body;
        //destructuring request body data which are mandatory at the time of registration
        const {name,email,password,mobileNumber} = data;
        if(!name || !email || !password || !mobileNumber){
            return res.status(400).send({status:false,message:"Please provide all details for registration"})
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
        //destructuring email and password from request body to login student
        const {email,password} = data;

        if(!email){
            return res.status(400).send({status:false,message:"Provide email for login"})
        }

        if(!password){
            return res.status(400).send({status:false,message:"Provide password for login"})
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
        studentID:isemailExist._id,
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