const express = require('express');
const router = express.Router();
const auth = require('./auth');

const Company = require('../models/company');
const Employee = require('../models/employee');
const Log = require('../models/log');


// Initialize application
const app = express();



// Socket.io Config
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


router.get('/', auth, function(req, res){

    if(req.user) {
        let companyId = res.locals.user.companyId ;
        // Get absent emplyees
        Company.findOne({_id: companyId})
        .populate('departaments')
        .populate({
            path: 'employees',
            match:{present: false},
            populate: {path: 'departament'}
        })
        .exec(function (err, company) {
             if (err) return handleError(err);
              var  absentEmployees = company.employees;

              // Get present emplyees
              Company.findOne({_id: companyId})
              .populate('departaments')
              .populate({
                  path: 'employees',
                  match:{present: true},
                  populate: {path: 'departament'}
              })
              .exec(function (err, company) {
                   if (err) return handleError(err);
                    var  presentEmpolyees = company.employees;

                  res.render('dashboard', {present: presentEmpolyees, absent: absentEmployees});
              });
        });
}
});

module.exports = router;
