const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Import User Model
const User = require('../models/user.js');

// Diplay register page
router.get('/' ,function(req, res){
    res.render('register');
});

router.post('/', function(req,res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password confirmation does not match with given password').equals(password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            email: email,
            password: password,
            username: username
        });

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err) {
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        req.flash('positive', 'Registeration complete, you can log in now.')
                        res.redirect('login');
                    }
                });
            })
        });
    }
});

module.exports = router;
