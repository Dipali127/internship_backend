const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
const jwt = require('../middleware/auth')
//register student
router.post('/register', studentController.registerStudent);

//login student
router.post('/loginStudent', studentController.studentLogin);

//update student details
router.put('/update/:_id', jwt.authentication,studentController.updateStudentdetails)

//Incorrect Endpoints
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;