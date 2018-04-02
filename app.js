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
var server = require('http').Server(app);

// Import DB models
let User = require('./models/user');
let Company = require('./models/company');

// Socket.io Config
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// Make Socket.io accesable in the router
app.use(function(req,res,next){
    req.io = io;
    next();
});

// Set view engine
app.set ('view engine', 'pug') ;

// Set the static files directories
app.use('/dest', express.static(__dirname + '/dest'));
app.use('/semantic', express.static(__dirname + '/semantic'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Set views repositories
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/departaments'),
    path.join(__dirname, 'views/dashboard'),
    path.join(__dirname, 'views/employees/'),
    path.join(__dirname, 'views/logs/'),
    path.join(__dirname, 'views/public/'),
    path.join(__dirname, 'views/reports/'),
    path.join(__dirname, 'views/settings/'),
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

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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

        Company.findOne({_id: companyId})
        .populate('departaments')
        .populate({
            path: 'employees',
            populate: {path: 'departament'}
        })
        .exec(function (err, company) {
             if (err) return handleError(err);
               res.locals.company = company;
              console.log(company);
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

// Company logs
let logs = require('./routes/logs');
app.use('/logs', logs);

// Company Dashboard
let dashboard = require('./routes/dashboard');
app.use('/dashboard', dashboard);

// Company Dashboard
let employees = require('./routes/employees');
app.use('/employees', employees);

// Company Dashboard
let reports = require('./routes/reports');
app.use('/reports', reports);

// Company Dashboard
let settings = require('./routes/settings');
app.use('/settings', settings);

// Company Departaments
let departaments = require('./routes/departaments');
app.use('/departaments', departaments);

// Dashboard User Login
let login = require('./routes/login');
app.use('/login', login);

// Dashboard User Logout
let logout = require('./routes/logout');
app.use('/logout', logout);

// Set application port
server.listen(3000, function(){
  console.log('listening on *:3000');
});
