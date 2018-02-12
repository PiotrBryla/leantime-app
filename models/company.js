const mongoose = require('mongoose');

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
    departaments: [{name: String}]
});

const Company = module.exports = mongoose.model('Company', companySchema);
