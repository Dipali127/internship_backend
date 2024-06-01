const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
const companyController = require('../controllers/companyController');
const internshipController = require('../controllers/internshipController');
const applicationController = require('../controllers/applicationController');
const jwt = require('../middleware/auth')
const uploadFile = require('../middleware/multer.middleware')

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Student Routes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//Register student
router.post('/student/signup', studentController.registerStudent);
//Login student
router.post('/student/login', studentController.studentLogin);
//Edit/update student details
router.put('/update/:studentID', jwt.authentication,studentController.editStudentdetails)

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Company Routes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//Register company
router.post('/company/signup', companyController.registerCompany)
//Login company
router.post('/company/login', companyController.companyLogin);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Internship Routes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//Company post an internship
router.post('/postInternship/:companyId', jwt.authentication,internshipController.postInternship);
//Company update an internship
router.put('/updateInternship/:internshipId', jwt.authentication, internshipController.updateInternship);
//Student gets all Internship
router.get('/internships/list', jwt.authentication,internshipController.getInternship);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Application Routes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
//Student apply for an internship
router.post('/apply/:studentID',jwt.authentication,uploadFile,applicationController.applyInternship)
//Company gets all applied student's application
router.get('/getAllAppliedStudents/:internshipId', jwt.authentication, applicationController.getAllAppliedStudents )

//route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;