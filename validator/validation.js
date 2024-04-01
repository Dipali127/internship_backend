//validation functions:

const mongoose = require('mongoose')
//Checks if an object is not empty by verifying if it contains any keys 
const isEmpty = (data) => {return Object.keys(data).length>0};

//Checks if a value is not empty or is a string
const checkData = (data) => {return data.length>0 || typeof(data) === String};

//Validates a name to ensure it contains only letters 
const checkName = (name) => {return /^[A-Za-z]+$/.test(name)};

// Validates an email address using a regular expression
const checkEmail = (email) => {return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)};

//password contain one small letter, one capital letter, one digti and one special character.
//length of password is minimum of length 8.
const checkPassword = (password) =>
 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/.test(password);

 // Validates a mobile number to ensure it starts with a digit from 6 to 9, followed by exactly 9 digits
 // (any digit from 0 to 9) with a total length of 10 digits.
const checkMobile = (mobileNumber) => {return /^[6-9]\d{9}$/.test(mobileNumber)}

//Validates a MongoDB ObjectId using mongoose.isValidObjectId().
const checkObjectId = (id) => { return mongoose.isValidObjectId(id); }

module.exports = {isEmpty,checkData,checkName,checkEmail,checkPassword,checkMobile,checkObjectId}

