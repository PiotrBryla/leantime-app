const express = require('express');
const router = express.Router();
const auth = require('./auth');


const Employee = require('../models/employee');
const Log = require('../models/log');



router.get('/', auth, function(req, res){

    if(req.user) {
        let companyId = res.locals.user.companyId ;

    Employee.find({present: true, companyId: companyId}, function(err, presentEmpolyees) {

        Employee.find({present: false}, function(err, absentEmployees) {

                res.render('dashboard', {present: presentEmpolyees, absent: absentEmployees});

        })
    })
}
});

module.exports = router;
