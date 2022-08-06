const express = require('express');
// Using to add security header, extra security protection
const helmet = require('helmet');
// to sanitize the api requests
const xss = require('xss-clean');
// to prevent MongoDB Operator Injection.
const mongoSanitize = require('express-mongo-sanitize');
// to compress express requests
const compression = require('compression');
// to set cors policy
const cors = require('cors');
// to setup authentication middleware
const passport = require('passport');
// for http status code handling
const httpStatus = require('http-status');


const app = express();

app.get('/ping',(req,res)=>{
    res.end("pong")
})

module.exports = app;
