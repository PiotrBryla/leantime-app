const mongoose = require('mongoose');

const emplyeeSchema = mongoose.Schema({
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


const employee = module.exports = mongoose.model('Employee', emplyeeSchema);
