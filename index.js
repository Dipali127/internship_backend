const express = require('express');
const app = express();
app.use(express.json())
const route = require('./router/routes');
require('dotenv').config({path:'../.env'});

const mongoose = require('mongoose');
mongoose.connect(process.env.clusterString,).then(()=>{console.log("mongoDB connected successfully")})
.catch((error)=>{console.log(error.message)});

const port = process.env.PORT||3000;

app.use('/',route);

app.listen(port, ()=>{console.log(`server listen on port ${port}`)});