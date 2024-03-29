const express = require('express');
const {ec2Controller} = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

router.post("/deploy",authMiddleware.authenticateUser,ec2Controller.deploy)
router.put("/stop",authMiddleware.authenticateUser,ec2Controller.stop)
router.put("/restart",authMiddleware.authenticateUser,ec2Controller.restart)
router.put("/terminate",authMiddleware.authenticateUser,ec2Controller.terminate)
router.post("/describe",authMiddleware.authenticateUser,ec2Controller.describeInstances)
router.post("/getCost",authMiddleware.authenticateUser,ec2Controller.getCost)


module.exports = router;
