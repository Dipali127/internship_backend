const express = require('express');
const app = express();
//Middleware to handle json data
app.use(express.json())
// Middleware to handle URL-encoded form data
app.use(express.urlencoded({extended:true}))  

const route = require('./router/routes');
require('dotenv').config({path:'../.env'});

const mongoose = require('mongoose');
// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.clusterString,).then(()=>{console.log("mongoDB connected successfully")})
.catch((error)=>{console.log(error.message)});

const port = process.env.PORT||3000;

// Serve static files from the 'uploads' directory
// Any files in the 'uploads' directory can be accessed via URLs starting with '/uploads'
app.use('/uploads', express.static('uploads'));

// Use routes defined in the 'router/routes' module
app.use('/',route);

// Start the server and listen on the specified port
app.listen(port, ()=>{console.log(`server listen on port ${port}`)});