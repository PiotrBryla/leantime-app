const express = require('express');
const router = express.Router();
const auth = require('./auth');

const Company = require('../models/company');
const Employee = require('../models/employee');
const Log = require('../models/log');

router.get('/', auth, function(req, res){

    if(req.user) {
        var companyId = res.locals.user.companyId ;
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

                  res.render('dashboard', {
                      present: presentEmpolyees,
                      absent: absentEmployees,
                      presentNumber: presentEmpolyees.length,
                      absentNumber: absentEmployees.length
                  });
              });
        });

        var nsp = req.io.of('/dashboard/'+companyId);

        nsp.on('connection', function(socket){
          console.log('someone connected to' + nsp.name);
        });

}
});

module.exports = router;
