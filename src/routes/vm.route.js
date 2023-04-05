const express = require('express');
const {vmController} = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

router.post("/deploy",authMiddleware.authenticateUser,vmController.deploy)
module.exports = router;
