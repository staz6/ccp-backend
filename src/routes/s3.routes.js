const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {s3bucketController} = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

router.post("/deploy",authMiddleware.authenticateUser,s3bucketController.deploy)
router.get("/:bucketName",authMiddleware.authenticateUser,s3bucketController.getFiles)
router.post("/upload",authMiddleware.authenticateUser,upload.single('file'),s3bucketController.upload)


module.exports = router;
