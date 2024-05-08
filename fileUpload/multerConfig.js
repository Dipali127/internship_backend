const multer = require("multer");
const upload = multer({dest: './uploaded/files'});


// Export Multer middleware function
module.exports = upload.single("resume");

