const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Import User Model
const User = require('../models/user.js');

// Display logn page
router.get('/' ,function(req, res){
    res.render('login');
});

// Logging Process
router.post('/', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect:'/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;
