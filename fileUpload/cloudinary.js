//cloudinary code:
require('dotenv').config({path: '../.env'})
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Connects Cloudinary to the application using credentials from environment variables
cloudinary.config({ 
    cloud_name: process.env.Cloudinary_Cloud_Name ,
    api_key: process.env.Cloudinary_Api_Key, 
    api_secret: process.env.Cloudinary_Api_Secret 
});

const uploadFileOnCloudinary = async function(localFilePath){
    try{
        if(!localFilePath){
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"  
        })
        //File has been uploaded successfully
        console.log(`file uploaded successfully ${response.url}`)
       
        return response;

    }catch(error){
        console.error(`Upload failed: ${error.message}`);
        //Reomve locally saved temporary file as the uploaded operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }
}

module.exports = uploadFileOnCloudinary;
