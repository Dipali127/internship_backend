const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
const companyController = require('../controllers/companyController');
const internshipController = require('../controllers/internshipController');
const applicationController = require('../controllers/applicationController');
const jwt = require('../middleware/auth')
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>student>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//register student
router.post('/register', studentController.registerStudent);
//login student
router.post('/loginStudent', studentController.studentLogin);
//update student details
router.put('/update/:_id', jwt.authentication,studentController.updateStudentdetails)
//get Internship
router.get('/getIntership', jwt.authentication,studentController.getInternship);
//apply to internship
router.post('/apply/:_id',jwt.authentication, applicationController.applyInternship)
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>company>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//register company
router.post('/registerCompany', companyController.registerCompany)
//login company
router.post('/loginCompany', companyController.companyLogin);
//company post internship
router.post('/postInternship/:_id', jwt.authentication,internshipController.postInternship);
//update internship
router.put('/updateInternship/:_id', jwt.authentication, internshipController.updateInternship);

//route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;