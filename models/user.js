const mongoose = require('mongoose');

//User Schema
let userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    companyId:{
        type: String,
        required: true
    }
});

let User = module.exports = mongoose.model('User', userSchema);
