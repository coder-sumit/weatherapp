const express = require('express');
const router = express.Router();

// get controller
const getCropSuggestion = require('../controllers/getCropSugg');

router.get("/", getCropSuggestion);

module.exports = router;
