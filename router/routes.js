const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
const companyController = require('../controllers/companyController');
const internshipController = require('../controllers/internshipController');
const applicationController = require('../controllers/applicationController');
const jwt = require('../middleware/auth')
const uploadFile = require('../middleware/multer.middleware')

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>student>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//register student
router.post('/register', studentController.registerStudent);
//login student
router.post('/loginStudent', studentController.studentLogin);
//update student details
router.put('/update/:studentID', jwt.authentication,studentController.editStudentdetails)
//get Internship
router.get('/getIntership', jwt.authentication,studentController.getInternship);
//apply to internship
//router.post('/apply/:studentID',jwt.authentication,uploadFile,applicationController.applyInternship)
router.post('/apply/:studentID',jwt.authentication,uploadFile,applicationController.applyInternship)
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>company>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//register company
router.post('/registerCompany', companyController.registerCompany)
//login company
router.post('/loginCompany', companyController.companyLogin);
//company post internship
router.post('/postInternship/:companyId', jwt.authentication,internshipController.postInternship);
//update internship
router.put('/updateInternship/:internshipId', jwt.authentication, internshipController.updateInternship);
//get application review
router.get('/getAllAppliedStudents/:internshipId', jwt.authentication, applicationController.getAllAppliedStudents )

//route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;