const express = require('express');
const router = express.Router();

router.use('/getWeather', require('./weather'));
router.use("/getCropSuggestion", require("./getCropSuggRoute"));
router.use("/getCropInfo", require("./getCropInfo"));



module.exports = router;