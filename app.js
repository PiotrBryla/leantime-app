// Import necessary modules
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost/leantime');
let db = mongoose.connection;

// Check DB connection
db.once('open', function () {
    console.log('Connected to the DB ');
})

//Check for DB errors
db.on('error', function(err) {
    console.log(err);
});

// Initialize application
const app = express();

// Import DB models
let User = require('./models/user');

// Set view engine
app.set ('view engine', 'ejs') ;

// Set the static files directories
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/semantic', express.static(__dirname + '/semantic'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Set views repositories
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/employees/'),
    path.join(__dirname, 'views/logs/'),
    path.join(__dirname, 'views/public/'),
    path.join(__dirname, 'views/settings/'),
    path.join(__dirname, 'views/timesheets')
]);

// Api Calls
app.get('/' ,function(req, res){
    res.render('index');
});

app.get('/dashboard/:name' ,function(req, res){
    User.find({}, function functionName(err, users) {
        if(err) {
            console.log(err);
        } else {
            res.render('dashboard', {
                name: req.params.name,
                users: users
            });
        }
    });
});

// Set application port
app.listen(3000);
