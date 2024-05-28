const multer = require('multer');
//Created multer instance with disk storage to upload files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads') //null is custom error added by developer
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); //Use a timestamp to avoid name conflicts
    }

})

//Configure Multer to accept only PDF files
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

//Export the Multer instance
module.exports = upload.single("resume")