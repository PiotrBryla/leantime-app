// Import necessary modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const config = require('./config/database');

// Connect to the database
mongoose.connect(config.database);
let db = mongoose.connection;

// Check DB connection
db.once('open', function () {
    console.log('Connected to the DB ');
})

// Check for DB errors
db.on('error', function(err) {
    console.log(err);
});

// Initialize application
const app = express();

// Import DB models
let User = require('./models/user');
let Company = require('./models/company');

// Set view engine
app.set ('view engine', 'pug') ;

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

// Session Config
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Body Parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  Express Flash messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global User  and Company Variable
app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;

    if(req.user) {
        let companyId = res.locals.user.companyId ;

        Company.findById( companyId , function(error, result) {
            res.locals.company = result;
        }).then(function () {
            next();
        });
    }else {
        next();
    }
});

// Home API Call
app.get('/' ,function(req, res){
    res.render('index');
});

// Routes
// Dashboard User Register
let register = require('./routes/register');
app.use('/register', register);

// Dashboard User Login
let login = require('./routes/login');
app.use('/login', login);

// Dashboard User Logout
let logout = require('./routes/logout');
app.use('/logout', logout);

// Set application port
app.listen(3000);
