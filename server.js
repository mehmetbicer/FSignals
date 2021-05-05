var express = require('express');
const ejs = require('ejs');
// Initialise Express
const fs = require('fs');

var signals = require('./volume_spot7g');

var app = express();
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);

var name = "asdadadasd";

// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
    
    var rawdata = fs.readFileSync('data.json');
    var student = JSON.parse(rawdata)
    var ham_ = JSON.stringify(student)
    
    let sortedInput = student.slice().sort((a, b) => b.hacim - a.hacim);

    // Render index page
    res.render('pages/index', {
        // EJS variable and server-side variable
        para: sortedInput

    });


});

