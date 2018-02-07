const mongoose = require('mongoose');

// Emplyee Log Schema
const logSchema = mongoose.Schema({
    employeeId:{
        type: String,
        required: true
    },
    timestamp:{
        type: String,
        required: true
    },
    type:{
        type: timestamp,
        required: true;
    }
});

const Log = module.exports = mongoose.model('Log', logSchema);
