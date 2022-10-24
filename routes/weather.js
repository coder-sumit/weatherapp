const express = require('express');
const router = express.Router();

// get controller
const weather = require('../controllers/weather');

router.post('/', weather.getWeather);

module.exports = router;