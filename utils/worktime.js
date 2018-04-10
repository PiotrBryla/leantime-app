const mongoose = require('mongoose');
const moment = require('moment');

const Company = require('../models/company');
const Employee = require('../models/employee');
const Log = require('../models/log');

exports.getWorkingPeriod = function(employeeID, startDay, endDay){

    var startDate = moment(startDay);
    var endDate = moment(endDay);
    var datesBetween = [];

    var startingMoment = startDate;

    while(startingMoment <= endDate) {

        datesBetween.push(startingMoment.format('YYYY-MM-DD'));

        startingMoment.add(1, 'days');
    }

    var workingPeriod = [];

    datesBetween.forEach(function(date) {
        workingPeriod.push(getWorkingDay(employeeID, date));
    });

    console.log(workingPeriod);
    return workingPeriod;

}


var getWorkingDay = exports.getWorkingDay = function(employeeId, day) {

    const isToday = moment(Date.now()).get('date') === moment(day).get('date');
    const startingMoment = moment(day).startOf('day');
    const endingMoment = moment(day).endOf('day');

    Employee.findOne({_id: employeeId})
    .populate({
        path: 'logs',
        match: {
            time : {$gte: startingMoment, $lte: endingMoment}
        }
    }
)
.exec(function (err, em) {
    if (err) return handleError(err);

    var dayWorkingTime = {};
    var workingTime = [];

    if(em.logs.length > 0){
        dayWorkingTime.events = true;

        var calcMode;

        if(em.logs.length % 2 == 0 && em.logs[0].event == true)
        calcMode = 1;
        if(em.logs.length % 2 == 0 && em.logs[0].event == false)
        calcMode = 2;
        if(em.logs.length % 2 == 1 && em.logs[0].event == true)
        calcMode = 3;
        if(em.logs.length % 2 == 1 && em.logs[0].event == false)
        calcMode = 4;

        switch (calcMode) {
            case 1:
                calcMode1();
            break;

            case 2:
                calcMode2();
            break;

            case 3:
                calcMode3();
            break;

            case 4:
                calcMode4();
            break;

            default:
            break;
        }

        function calcMode1() {
            for (var i = 0; i<= em.logs.length - 1; i = i+2 ){

                var a = moment(em.logs[i].time);
                var b = moment(em.logs[i+1].time);

                workingTime.push(
                    {'duration': b.diff(a, 'hours') + ':' + b.diff(a, 'minutes') + ':' + b.diff(a, 'seconds'),
                        'miliseconds': b.diff(a, 'miliseconds')
                    }
                );

            }
        }

        function calcMode2() {
            //Copy logs list
            logsCopy = em.logs;

            var firstLog = startingMoment;
            var lastLog = isToday ? Date.now() :  endingMoment;

            // Add day starting moment at the beginning of the loglist
            // Add  ennfing moment at the enf of the loglist
            logsCopy.unshift({time: firstLog, event: true});
            logsCopy.push({time: lastLog, event: false});

            for (var i = 0; i<= logsCopy.length - 1; i = i+2 ){

                var a = moment(logsCopy[i].time);
                var b = moment(logsCopy[i+1].time);

                workingTime.push(
                    {'duration': b.diff(a, 'hours') + ':' + b.diff(a, 'minutes') + ':' + b.diff(a, 'seconds'),
                        'miliseconds': b.diff(a, 'miliseconds')
                    }
                );

            }
        }

        function calcMode3() {
            //Copy logs list
            logsCopy = em.logs;

            // Check if the last log have today's date and set it if true
            // else set 23:59:59 of the logs day
            var lastLog = isToday ? Date.now() :  endingMoment;
            logsCopy.push({time: lastLog, event: false});

            for (var i = 0; i<= logsCopy.length - 1; i = i+2 ){

                var a = moment(logsCopy[i].time);
                var b = moment(logsCopy[i+1].time);

                workingTime.push(
                    {'duration': b.diff(a, 'hours') + ':' + b.diff(a, 'minutes') + ':' + b.diff(a, 'seconds'),
                        'miliseconds': b.diff(a, 'miliseconds')
                    }
                );

            }
        }

        function calcMode4() {
            //Copy logs list
            logsCopy = em.logs;

            // Set beginning of the day to be treated as a first log
            var firstLog = startingMoment;
            logsCopy.unshift({time: firstLog, event: true});

            for (var i = 0; i<= logsCopy.length - 1; i = i+2 ){

                var a = moment(logsCopy[i].time);
                var b = moment(logsCopy[i+1].time);

                workingTime.push(
                    {'duration': b.diff(a, 'hours') + ':' + b.diff(a, 'minutes') + ':' + b.diff(a, 'seconds'),
                        'miliseconds': b.diff(a, 'miliseconds')
                    }
                );

            }
        }

        // else if there is no events
    } else {
        dayWorkingTime.events = false;
        console.log(dayWorkingTime);
        return dayWorkingTime;
    }

    dayWorkingTime.logs = em.logs;
    dayWorkingTime.workingTime = workingTime;
    dayWorkingTime.totalMili = totalMili();
    dayWorkingTime.total = moment.duration(totalMili()).hours()
    + ':' + moment.duration(totalMili()).minutes()
    + ':' + moment.duration(totalMili()).seconds();

    function totalMili() {
        var miliSum = 0;

        workingTime.forEach(function(item) {
            miliSum = miliSum + item.miliseconds;
        });

        return miliSum
    }

    console.log('***************',dayWorkingTime);
    return dayWorkingTime;

});
}
