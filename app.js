// Import necessary modules
const express = require('express');
const ejs = require('ejs');
const path = require('path');

let app = express();

// Set view engine
app.set ('view engine', 'ejs') ;

// Set views repositories
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/employees/'),
    path.join(__dirname, 'views/logs/'),
    path.join(__dirname, 'views/public/'),
    path.join(__dirname, 'views/settings/'),
    path.join(__dirname, 'views/timesheets')
]);

app.get('/' ,function(req, res){
    res.render('index');
});

app.get('/dashboard/:name' ,function(req, res){
    res.render('dashboard', {name: req.params.name});
});

app.listen(3000);
