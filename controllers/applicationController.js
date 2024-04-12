const internshipModel = require('../models/internshipModel');
const multer = require('multer');
const upload = multer({ dest: 'C:/uploads/' });

const applyInternship = async function(req,res){
    try{
        const internshipId = req.params._id;
        const isExistinternship = await internshipModel.findById(internshipId);

        if(!isExistinternship){
            return res.status(400).send({status:false,message:"Provided internshipId internship doesnt exist"})
        }

        const {resume ,status} = req.body;

        // After extracting resume and status from the request body
        // Use the upload middleware to handle file upload
        upload.single('resume')(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                // Multer error occurred
                return res.status(400).send({ status: false, message: "Multer error", error: err });
            } else if (err) {
                // Other unknown error occurred
                return res.status(400).send({ status: false, message: "Unknown error", error: err });
            }

            // File uploaded successfully
            return res.status(201).send({status:true,message:"file uploaded successfully",data:req.body})
        });
    }catch(error){
        return res.status(503).send({status:false,message:error.message})
    }
}

module.exports = {applyInternship};