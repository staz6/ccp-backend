const express = require('express');
const {storageaccountController} = require('../controllers');
const multer = require('multer');
const { authMiddleware } = require('../middlewares');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/deploy",authMiddleware.authenticateUser,storageaccountController.deploy)
router.post("/upload",authMiddleware.authenticateUser,upload.single('file'),storageaccountController.uploadFile)
router.get("/getFiles/:saName",authMiddleware.authenticateUser,storageaccountController.getFiles)
module.exports = router;
