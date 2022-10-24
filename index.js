const express = require('express');
const app = express();
const PORT = process.env.port||8000;
const bodyParser = require('body-parser');
const cors = require('cors');

// cros origin resource
app.use(cors({
    origin: '*'
}));

// to get api link
app.use("/img", express.static(__dirname + '/images'));

// parse data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// handle routes
app.use('/', require('./routes'));

// test server
app.listen(PORT, function(err){
    console.log("Yup! Server is up and running on port", PORT);
})