//validation functions:
const mongoose = require('mongoose')
//Checks if an object is not empty by verifying if it contains any keys
const isEmpty = (data) => { return Object.keys(data).length > 0 };

//Checks if a value is a non-empty string
const checkData = (data) => { return data.length > 0 || typeof (data) === String };

//Validates a name to ensure it contains only letters(small & capital) and space is allowed
const checkName = (name) => /^[A-Za-z\s]+$/.test(name);

//Validates an email address using a regular expression
const checkEmail = (email) => { return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) };

//Password must contain one small letter, one capital letter, one digit and one special character.
//Length of password should be a minimum of 8 characters
const checkPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/.test(password);
};

//Validates a mobile number to ensure it starts with a digit from 6 to 9, followed by exactly 9 digits
//(any digit from 0 to 9) with a total length of 10 digits.
const checkMobile = (mobileNumber) => { return /^[6-9]\d{9}$/.test(mobileNumber) }

//Validate input data consists only of numbers.
const validateInput = (input) => /^[0-9\s]+$/.test(input);

//Validate salary format includes numbers and a minus symbol for the range
const validateSalaryFormat = (input) => {
    return /^\d{1,}(?:-\d{1,})?$/.test(input);
};

//Validates a MongoDB ObjectId using mongoose.isValidObjectId().
const checkObjectId = (id) => { return mongoose.isValidObjectId(id); }

module.exports = {
    isEmpty, checkData, checkName, checkEmail, checkPassword, validateInput, checkMobile,
    validateSalaryFormat, checkObjectId
}

