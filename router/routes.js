const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
//register student
router.post('/register', studentController.registerStudent);

//login student
router.post('/loginStudent', studentController.studentLogin);

//update student details
router.put('/update/:_id', studentController.updateStudentdetails)

module.exports = router;