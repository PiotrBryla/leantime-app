const mongoose = require('mongoose');

// Emplyee Log Schema
const logSchema = mongoose.Schema({
    time: {
        type: timestamp,
        required: true
    },
    event: {
        trype: String,
        required: true
    }
});

const Log = module.exports = mongoose.model('Log', logSchema);
