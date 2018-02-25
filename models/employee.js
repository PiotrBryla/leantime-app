const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Employee Schema
const employeeSchema = mongoose.Schema({
     _id: Schema.Types.ObjectId,
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    departament: {
        type: Schema.Types.ObjectId,
        ref: 'Departament'
    },
    present: {
        type: Boolean,
        default: false,
        required: true
    },
    logs: [{
        type: Schema.Types.ObjectId,
        ref: 'Log'
    }]
});
const employee = module.exports = mongoose.model('Employee', employeeSchema);
