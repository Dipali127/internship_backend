const express = require('express');
const app = express();
app.use(express.json())
const mongoose = require('mongoose');

require('dotenv').config({path:'../.env'});

const port = process.env.PORT||3000;

app.listen(port, ()=>{console.log(`server listen on port ${port}`)});