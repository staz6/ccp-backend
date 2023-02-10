const express = require('express');
const {validateMiddleware} = require("../middlewares");
const {authValidation} = require("../validators");
const {authController} = require('../controllers');

const router = express.Router();

router.post('/register', validateMiddleware(authValidation.register), authController.register);
router.post('/login', validateMiddleware(authValidation.login), authController.login);

module.exports = router;