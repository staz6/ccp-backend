const express = require('express');
const {ec2Controller} = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

router.post("/deploy",authMiddleware.authenticateUser,ec2Controller.deploy)
router.put("/stop",authMiddleware.authenticateUser,ec2Controller.stop)
router.put("/restart",authMiddleware.authenticateUser,ec2Controller.restart)
router.delete("/terminate",authMiddleware.authenticateUser,ec2Controller.terminate)
router.post("/describe",authMiddleware.authenticateUser,ec2Controller.describeInstances)


module.exports = router;
