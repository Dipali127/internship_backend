const multer = require("multer");
//the below code doesn't provide acess of reading or manipulating file.
//create an instance of multer
//const upload = multer({dest: './uploaded/files'}); //automatically create folder 'uploaded' in our local system .

//created multer instance with disk storage to upload files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads') // null is custom error added by developer
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }

})

// Create a Multer instance with the configured storage
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true); // accept file
        } else {
            cb(new Error('Only pdf files are allowed'), false) //doesn't accept the file
        }
    }
});

// Export the Multer instance
module.exports = upload.single("resume")



