const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('./auth');

const Employee = require('../models/employee');
const Log = require('../models/log');

router.get('/', auth, function(req, res){
    res.render('logs');
});

// TODO: Permission startegy needs to be implemented
var  responseJson ={empty: "not assigned"};
router.post('/', function(req, res){

    // POST variables
    const employeeId = req.body.employeeId;

    // POST variables validation
    req.checkBody('employeeId', 'Wrong Employee ID!').notEmpty();

    // Validation errors hadling
    let errors = req.validationErrors();

    if(errors){
        responseJson = errors;
    } else {
        // Create new Log object
        const punchType = "Punch";

        var newLog = new Log({
            _id: new mongoose.Types.ObjectId(),
            time: Date.now(),
            event: punchType
        });

        // Save new log to the db
        newLog.save(function(err) {
            // TODO: Error handling
            if(err) console.log(err);

            // Update employee logs record

            Employee.findOne({_id: employeeId}, function(err, em) {
                var currentEmpolyeeStatus = em.present;

                Employee.update(
                    {_id: employeeId },
                    {$set: {present: !currentEmpolyeeStatus},
                    $push:{ logs : newLog._id }
                },
                function(err, status) {
                    // Error handling

                    if(err){
                        console.log("error log " ,err);
                        responseJson = {
                            message: "err"
                        }
                    }
                    else{
                        // Response
                        responseJson = {
                            message: "Punch Accepted !" + newLog.time
                        }
                    }
                });
            });
        });
    }

    res.header("Content-Type",'application/json');
    res.json(responseJson);

});

module.exports = router;
