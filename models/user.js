const mongoose = require('mongoose');

//User Schema
const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', userSchema);
