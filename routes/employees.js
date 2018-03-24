const express = require('express');
const router = express.Router();
const auth = require('./auth');
const mongoose = require('mongoose');

const Company = require('../models/company.js');
const Employee = require('../models/employee.js');
const Department = require('../models/departament.js');

router.get('/', auth, function(req, res){
    res.render('employees');
});

router.post('/add', auth, function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const departament = req.body.departament;
    const companyId = req.body.companyId;

    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('departament', 'Departament name is required').notEmpty();
    req.checkBody('companyId', 'System error, please contact the support').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.render('/employees', {
            errors: errors
        });
    } else {

        var newEmployee = new Employee({
            _id: new mongoose.Types.ObjectId(),
            company: companyId,
            firstName: firstName,
            lastName: lastName,
            departament: departament
        });

        newEmployee.save(function(err) {
            if (err) return handleError(err);

            Company.update({_id: companyId}, {$push :{ employees : newEmployee._id}},
                 function(err) {
                    // Error handling
                    if(err){
                        req.flash('negative', err);
                    }
                    else{

                        Department.findOne({_id: newEmployee.departament}, function(err, eDepartament){
                            if (err) return handleError(err);

                            res.json({
                                'message': 'New employee has been added successfully',
                                'employee': {
                                    'firstName': newEmployee.firstName,
                                    'lastName': newEmployee.lastName,
                                    'departament': eDepartament.name,
                                    'employeeID': newEmployee._id
                                }
                            });
                        })
                    }
                });
        });
    }
});

module.exports = router;
