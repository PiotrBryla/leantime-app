const mongoose = require('mongoose');
const moment = require('moment');

const Company = require('../models/company');
const Employee = require('../models/employee');
const Log = require('../models/log');

exports.getWorkingDay = function(employeeId, day) {

    Employee.findOne({_id: employeeId})
    .populate({
        path: 'logs',
        match: {
            time : {$gte: moment(day).startOf('day'), $lte: moment(day).endOf('day')}
        }
    }
    )
    .exec(function (err, em) {
        if (err) return handleError(err);

        var dayWorkingTime = {};
        var workingTime = [];

        if(em.logs.length > 0){
            dayWorkingTime.events = true;

            // Check if first employee event that day was to clock-in and if employee has clocked out
            if(em.logs.length % 2 == 0 && em.logs[0].event == true){

                for (var i = 0; i<= em.logs.length - 1; i = i+2 ){

                    var a = moment(em.logs[i].time);
                    var b = moment(em.logs[i+1].time);

                    workingTime.push({'duration': b.diff(a, 'hours') + ':' + b.diff(a, 'minutes') + ':' + b.diff(a, 'seconds')});

                }
            } else {
                // Get day starting point, and start counting from its 00:00:00

            }

        } else {
            dayWorkingTime.events = false;
            return dayWorkingTime;
        }
        dayWorkingTime.logs = em.logs;
        dayWorkingTime.workingTime = workingTime;
        return dayWorkingTime;
    });
}
