const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Company Schema
const companySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    departaments: [{
        type: Schema.Types.ObjectId,
        ref: 'Departament'
    }],
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }]
});

const Company = module.exports = mongoose.model('Company', companySchema);
