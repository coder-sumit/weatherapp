const express = require('express');
const router = express.Router();

// get controller
const getCropInfo = require('../controllers/getCropInfo');

router.post("/", getCropInfo);

module.exports = router;