const mongoose = require('mongoose');

const emplyeeSchema = mongoose.Schema({
    companyId : {
        type: String,
        required: true
    },
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    department : {
        type: String,
        required: true
    }
});

const employee = module.exports = mongoose.model('Employee', employeeSchema);
