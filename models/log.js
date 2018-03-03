const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Employee = require('./employee');

const logSchema = mongoose.Schema({
     _id: Schema.Types.ObjectId,
    event: Boolean,
    time: Date,
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee"}
    });


const Log = module.exports = mongoose.model('Log', logSchema);
