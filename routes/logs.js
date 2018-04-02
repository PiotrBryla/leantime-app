const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('./auth');

const Company = require('../models/company');
const Employee = require('../models/employee');
const Log = require('../models/log');

router.get('/', auth, function(req, res){

    if(req.user) {
        let companyId = res.locals.user.companyId ;

        Log.find({companyId: companyId})
        .populate('employee')
        .populate({
                path: 'employee',
                populate: {path: 'departament'},
            })
        .sort({time: -1})
        .exec(function(err, logs) {
            res.render('logs', {logs: logs});
        })
}
});

// TODO: Permission startegy needs to be implemented
var  responseJson ={empty: "not assigned"};
router.post('/', function(req, res){

    // POST variables
    const employeeId = req.body.employeeId;
    const companyId = req.body.companyId;

    console.log('*** employeeid: ' + employeeId);

    // POST variables validation
    req.checkBody('employeeId', 'Wrong Employee ID!').notEmpty();

    // Validation errors hadling
    let errors = req.validationErrors();

    if(errors){
        responseJson = errors;
    } else {

            Employee.findOne({_id: employeeId}, function(err, em) {
                var currentEmpolyeeStatus = em.present;

                var newLog = new Log({
                    _id: new mongoose.Types.ObjectId(),
                    time: Date.now(),
                    event: !currentEmpolyeeStatus,
                    employee: employeeId,
                    companyId: companyId
                });

                // Save new log to the db
                newLog.save(function(err) {
                    // TODO: Error handling
                    if(err) console.log(err);

                    // Update employee logs record

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

                        var handler = `${em.firstName} ${em.lastName}`;

                        var ioData = {
                            event: newLog.event,
                            employee : newLog.employee,
                            handler: handler
                        }
                        req.io.sockets.emit('news', ioData );
                    }
                });
            });
        });
    }


    res.header("Content-Type",'application/json');
    res.json(responseJson);

});

module.exports = router;
