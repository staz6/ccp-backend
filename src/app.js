const express = require("express");
// Using to add security header, extra security protection
const helmet = require("helmet");
// to sanitize the api requests
const xss = require("xss-clean");
// to prevent MongoDB Operator Injection.
const mongoSanitize = require("express-mongo-sanitize");
// to compress express requests
const compression = require("compression");
// to set cors policy
const cors = require("cors");
// to setup authentication middleware
const passport = require("passport");
// for http status code handling
const httpStatus = require("http-status");
// Jwt token init
const { jwtStrategy } = require('./config/passport');
const routes = require('./routes');



const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// app.use('/v1/auth', authLimiter);
app.use('/v1', routes);

app.get("/ping", (req, res) => {
  res.end("pong");
});

module.exports = app;
